// Runs before every build. Reads ../profiles, copies photos into public/, and writes
// src/generated/profiles.json for the site. A broken profile is skipped with a warning
// so one bad folder can never take the whole wall down.
import fs from "node:fs";
import path from "node:path";
import { PROFILES_DIR, listProfileFolders, readProfile } from "./profile-rules.mjs";
import { fetchPrTimes, repoName } from "./pr-times.mjs";

const appDir = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const photoOut = path.join(appDir, "public", "photos");
const jsonOut = path.join(appDir, "src", "generated", "profiles.json");

fs.rmSync(photoOut, { recursive: true, force: true });
fs.mkdirSync(photoOut, { recursive: true });
fs.mkdirSync(path.dirname(jsonOut), { recursive: true });

const prTimes = await fetchPrTimes();
const profiles = [];
for (const folder of listProfileFolders()) {
  const { profile, errors } = readProfile(folder);
  if (!profile || errors.length) {
    console.warn(`⚠ Skipping profiles/${folder}: ${errors.join(" ")}`);
    continue;
  }
  let photo = `https://github.com/${profile.github}.png?size=400`;
  if (profile.image) {
    const ext = path.extname(profile.image);
    const out = `${profile.username.toLowerCase()}${ext}`;
    fs.copyFileSync(path.join(PROFILES_DIR, folder, profile.image), path.join(photoOut, out));
    photo = `/photos/${out}`;
  }
  profiles.push({ ...profile, photo, pr: prTimes[folder.toLowerCase()] || null });
}

// Newest merge first (so a fresh card lands at the top during the live merges), then everyone else A–Z.
profiles.sort((a, b) => {
  if (a.pr && b.pr) return new Date(b.pr.merged) - new Date(a.pr.merged);
  if (a.pr || b.pr) return a.pr ? -1 : 1;
  return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
});
fs.writeFileSync(jsonOut, JSON.stringify({ generatedAt: new Date().toISOString(), repo: repoName(), profiles }, null, 2));
console.log(`✓ Collected ${profiles.length} profile(s) into src/generated/profiles.json`);
