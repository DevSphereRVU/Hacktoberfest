// Fetches when each contributor's pull request was opened and merged, so the wall can show it.
// Runs at build time (on Vercel, right after a merge). Never fails the build: if GitHub can't be
// reached, cards simply show no timings.
//
// Env (all optional):
//   GITHUB_TOKEN   read-only token, raises the API limit from 60 to 5,000 requests an hour
//   GITHUB_REPO    owner/name. Defaults to Vercel's repo variables, then DevSphereRVU/Hacktoberfest
//   PR_TIMES=off   skip the lookup (offline development)

const API = process.env.GITHUB_API_URL || "https://api.github.com";
const TZ = "Asia/Kolkata";

export function repoName() {
  if (process.env.GITHUB_REPO) return process.env.GITHUB_REPO;
  if (process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG)
    return `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`;
  if (process.env.GITHUB_REPOSITORY) return process.env.GITHUB_REPOSITORY;
  return "DevSphereRVU/Hacktoberfest";
}

const fmt = (iso, opts) => new Intl.DateTimeFormat("en-IN", { timeZone: TZ, hour12: false, ...opts }).format(new Date(iso));
const clock = (iso) => fmt(iso, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
const day = (iso) => fmt(iso, { weekday: "short", day: "numeric", month: "short", year: "numeric" });

function took(a, b) {
  const s = Math.max(0, Math.round((new Date(b) - new Date(a)) / 1000));
  if (s < 60) return `${s}s`;
  if (s < 3600) return `${Math.floor(s / 60)}m ${s % 60}s`;
  return `${Math.floor(s / 3600)}h ${Math.floor((s % 3600) / 60)}m`;
}

/** Returns { "<login lowercase>": { number, url, opened, merged, openedClock, mergedClock, mergedDay, took } } */
export async function fetchPrTimes() {
  if (process.env.PR_TIMES === "off") return {};
  const repo = repoName();
  const headers = { Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", "User-Agent": "rvu-contributors-wall" };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 10000);
  const pulls = [];
  try {
    for (let page = 1; page <= 10; page++) {
      const url = `${API}/repos/${repo}/pulls?state=closed&sort=created&direction=asc&per_page=100&page=${page}`;
      let res = await fetch(url, { headers, signal: ctrl.signal });
      if (res.status === 401 && headers.Authorization) {
        // A bad or expired token: fall back to anonymous access (the repo is public).
        console.warn("⚠ GITHUB_TOKEN was rejected, retrying without it.");
        delete headers.Authorization;
        res = await fetch(url, { headers, signal: ctrl.signal });
      }
      if (!res.ok) throw new Error(`GitHub API ${res.status}`);
      const batch = await res.json();
      pulls.push(...batch);
      if (batch.length < 100) break;
    }
  } catch (e) {
    console.warn(`⚠ Couldn't fetch PR timings for ${repo} (${e.message}). Cards will show without them.`);
    return {};
  } finally {
    clearTimeout(timer);
  }

  const byLogin = {};
  // Prefer the PR the wall bot labelled "wall"; otherwise the person's first merged PR.
  const merged = pulls.filter((p) => p.merged_at && p.user && p.user.login);
  const ranked = [...merged.filter((p) => (p.labels || []).some((l) => l.name === "wall")), ...merged];
  for (const p of ranked) {
    const key = p.user.login.toLowerCase();
    if (byLogin[key]) continue;
    byLogin[key] = {
      number: p.number,
      url: p.html_url,
      opened: p.created_at,
      merged: p.merged_at,
      openedClock: clock(p.created_at),
      mergedClock: clock(p.merged_at),
      openedDay: day(p.created_at),
      mergedDay: day(p.merged_at),
      took: took(p.created_at, p.merged_at),
    };
  }
  console.log(`✓ Found merge times for ${Object.keys(byLogin).length} contributor(s) in ${repo}`);
  return byLogin;
}
