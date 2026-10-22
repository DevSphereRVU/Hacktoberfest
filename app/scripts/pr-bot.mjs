// The wall bot. Runs from the TRUSTED base branch inside .github/workflows/auto-merge.yml.
// It never checks out or runs code from the pull request. It only downloads the PR's
// profile files as data, checks them, and (if everything is fine) merges the PR.
//
//   node scripts/pr-bot.mjs check     -> writes kind/ok/profiles_dir to $GITHUB_OUTPUT
//   node scripts/pr-bot.mjs merge     -> squash-merges exactly the commit that was checked
//   node scripts/pr-bot.mjs comment <file>  -> creates or updates the bot's comment on the PR
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const {
  GH_TOKEN, REPO, PR_NUMBER, PR_AUTHOR, HEAD_SHA, HEAD_REPO, BASE_REF = "main",
  SITE_URL = "", HOLD = "false", GITHUB_OUTPUT, GITHUB_STEP_SUMMARY,
} = process.env;
const API = process.env.GITHUB_API_URL || "https://api.github.com";
const MARK = "<!-- wall-bot -->";
const appDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const repoRoot = path.resolve(appDir, "..");

async function gh(url, opts = {}) {
  const res = await fetch(url.startsWith("http") ? url : API + url, {
    ...opts,
    headers: { Authorization: `Bearer ${GH_TOKEN}`, Accept: "application/vnd.github+json", "X-GitHub-Api-Version": "2022-11-28", ...(opts.headers || {}) },
  });
  if (!res.ok && !opts.allowFail) throw new Error(`${opts.method || "GET"} ${url} -> ${res.status} ${await res.text()}`);
  return res;
}
const out = (k, v) => GITHUB_OUTPUT && fs.appendFileSync(GITHUB_OUTPUT, `${k}<<__EOF__\n${v}\n__EOF__\n`);

async function changedFiles() {
  const files = [];
  for (let page = 1; page < 30; page++) {
    const batch = await (await gh(`/repos/${REPO}/pulls/${PR_NUMBER}/files?per_page=100&page=${page}`)).json();
    files.push(...batch);
    if (batch.length < 100) break;
  }
  return files;
}

async function check() {
  const problems = [];
  const files = await changedFiles();
  const author = PR_AUTHOR;
  const own = (p) => p.toLowerCase().startsWith(`profiles/${author.toLowerCase()}/`);
  const onlyProfiles = files.every((f) => f.filename.startsWith("profiles/") && (!f.previous_filename || f.previous_filename.startsWith("profiles/")));

  if (!onlyProfiles) {
    out("kind", "code"); out("ok", "false");
    fs.writeFileSync(path.join(os.tmpdir(), "bot-comment.md"),
      `${MARK}\n👋 Thanks @${author}! This PR changes the website itself, so a maintainer will review it by hand. The wall bot only auto-merges profile cards.`);
    return;
  }
  out("kind", "profile");

  for (const f of files) {
    if (!own(f.filename) || (f.previous_filename && !own(f.previous_filename))) {
      problems.push(`This PR changes \`${f.previous_filename || f.filename}\`. Only add files inside \`profiles/${author}/\` (your exact GitHub username).`);
    }
  }

  // Build a scratch profiles/ folder: everyone already on main, plus this PR's folder as it is at HEAD_SHA.
  const scratch = fs.mkdtempSync(path.join(os.tmpdir(), "profiles-"));
  fs.cpSync(path.join(repoRoot, "profiles"), scratch, { recursive: true });
  const folders = [...new Set(files.map((f) => f.filename.split("/")[1]))];
  for (const folder of folders) {
    fs.rmSync(path.join(scratch, folder), { recursive: true, force: true });
    const res = await gh(`/repos/${HEAD_REPO}/contents/profiles/${encodeURIComponent(folder)}?ref=${HEAD_SHA}`, { allowFail: true });
    if (!res.ok) continue; // folder deleted in the PR
    const listing = await res.json();
    if (!Array.isArray(listing)) { problems.push(`\`profiles/${folder}\` should be a folder.`); continue; }
    fs.mkdirSync(path.join(scratch, folder), { recursive: true });
    for (const item of listing) {
      if (item.type !== "file") { problems.push(`\`profiles/${folder}/${item.name}\` is a folder. Keep your files directly inside \`profiles/${folder}/\`.`); continue; }
      if (item.size > 2 * 1024 * 1024) { problems.push(`\`profiles/${folder}/${item.name}\` is too big (${(item.size / 1048576).toFixed(1)} MB).`); continue; }
      if (!/^[\w.-]+$/.test(item.name)) { problems.push(`\`profiles/${folder}/${item.name}\`: use only letters, numbers, dots, dashes and underscores in file names.`); continue; }
      const raw = await gh(`/repos/${HEAD_REPO}/contents/profiles/${encodeURIComponent(folder)}/${encodeURIComponent(item.name)}?ref=${HEAD_SHA}`,
        { headers: { Accept: "application/vnd.github.raw" } });
      fs.writeFileSync(path.join(scratch, folder, item.name), Buffer.from(await raw.arrayBuffer()));
    }
  }

  // Run the same rules the site uses, against the scratch folder.
  process.env.PROFILES_DIR = scratch;
  const { readProfile } = await import("./profile-rules.mjs");
  const blocked = fs.existsSync(path.join(repoRoot, ".github/blocked-words.txt"))
    ? fs.readFileSync(path.join(repoRoot, ".github/blocked-words.txt"), "utf8").split(/\r?\n/).map((w) => w.trim().toLowerCase()).filter((w) => w && !w.startsWith("#"))
    : [];
  const cards = [];
  for (const folder of folders) {
    if (!fs.existsSync(path.join(scratch, folder))) continue;
    const { profile, errors } = readProfile(folder);
    errors.forEach((e) => problems.push(`\`profiles/${folder}\`: ${e}`));
    if (profile) {
      cards.push(profile.username);
      const text = `${profile.name} ${profile.role} ${profile.bio}`.toLowerCase();
      const hit = blocked.find((w) => new RegExp(`(^|\\W)${w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(\\W|$)`).test(text));
      if (hit) problems.push(`\`profiles/${folder}\`: please keep it friendly. A maintainer will take a look.`);
    }
  }

  const ok = problems.length === 0;
  out("ok", String(ok));
  out("profiles_dir", scratch);
  const link = SITE_URL && cards[0] ? `${SITE_URL.replace(/\/$/, "")}/u/${cards[0]}` : "";
  const body = ok && HOLD === "true"
    ? `${MARK}\n✅ Profile looks great, @${author}! A maintainer put this PR on hold, so they’ll merge it by hand.`
    : ok
    ? `${MARK}\n✅ **Profile looks great, @${author}!** Merging now. Your card will be live in about a minute${link ? `: ${link}` : "."} 🎉`
    : `${MARK}\n❌ **Almost there, @${author}! Fix these, then commit and push again (this PR updates itself):**\n\n${problems.map((p) => `- ${p}`).join("\n")}`;
  fs.writeFileSync(path.join(os.tmpdir(), "bot-comment.md"), body);
  if (GITHUB_STEP_SUMMARY) fs.appendFileSync(GITHUB_STEP_SUMMARY, body.replace(MARK, "") + "\n");
  console.log(body.replace(MARK, ""));
}

async function merge() {
  // Tag the PR so the site knows which PR made this card (used for the timings on the wall).
  await gh(`/repos/${REPO}/issues/${PR_NUMBER}/labels`, { method: "POST", allowFail: true, body: JSON.stringify({ labels: ["wall"] }) });
  const res = await gh(`/repos/${REPO}/pulls/${PR_NUMBER}/merge`, {
    method: "PUT", allowFail: true,
    body: JSON.stringify({ merge_method: "squash", sha: HEAD_SHA, commit_title: `Add ${PR_AUTHOR} to the wall (#${PR_NUMBER})` }),
  });
  if (!res.ok) {
    const msg = await res.text();
    console.log(`Merge failed: ${res.status} ${msg}`);
    fs.writeFileSync(path.join(os.tmpdir(), "bot-comment.md"),
      `${MARK}\n✅ Your profile passed every check, @${PR_AUTHOR}, but GitHub wouldn’t let the bot merge it (${res.status}). A maintainer will merge it shortly.`);
    process.exitCode = 1;
  }
}

async function comment(file) {
  const body = fs.readFileSync(file, "utf8");
  const existing = await (await gh(`/repos/${REPO}/issues/${PR_NUMBER}/comments?per_page=100`)).json();
  const mine = existing.find((c) => c.body && c.body.includes(MARK));
  if (mine) await gh(`/repos/${REPO}/issues/comments/${mine.id}`, { method: "PATCH", body: JSON.stringify({ body }) });
  else await gh(`/repos/${REPO}/issues/${PR_NUMBER}/comments`, { method: "POST", body: JSON.stringify({ body }) });
}

function buildFailed() {
  fs.writeFileSync(path.join(os.tmpdir(), "bot-comment.md"),
    `${MARK}\n⚠️ Your profile passed the checks, @${PR_AUTHOR}, but the site didn’t build with it. A maintainer will take a look. Nothing for you to do yet.`);
}

const [cmd, arg] = process.argv.slice(2);
if (cmd === "check") await check();
else if (cmd === "buildfail") buildFailed();
else if (cmd === "merge") await merge();
else if (cmd === "comment") await comment(arg || path.join(os.tmpdir(), "bot-comment.md"));
else { console.error("usage: pr-bot.mjs check|merge|buildfail|comment [file]"); process.exit(2); }
