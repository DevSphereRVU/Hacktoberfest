// PR check. Usage:
//   node scripts/validate-profiles.mjs                     -> check every profile
//   node scripts/validate-profiles.mjs --author <login> --changed <file-with-changed-paths>
// With --author, it also checks that the PR only touches profiles/<author>/.
import fs from "node:fs";
import { listProfileFolders, readProfile } from "./profile-rules.mjs";

const args = process.argv.slice(2);
const arg = (k) => {
  const i = args.indexOf(k);
  return i >= 0 ? args[i + 1] : undefined;
};
const author = arg("--author");
const changedFile = arg("--changed");

const problems = [];
const notes = [];
let folders = listProfileFolders();

if (author && changedFile) {
  const changed = fs.readFileSync(changedFile, "utf8").split("\n").map((s) => s.trim()).filter(Boolean);
  const touched = new Set();
  for (const p of changed) {
    const m = p.match(/^profiles\/([^/]+)\/[^/]+$/);
    if (!m) {
      problems.push(`This PR changes "${p}". Workshop PRs should only add files inside profiles/${author}/.`);
      continue;
    }
    touched.add(m[1]);
  }
  for (const f of touched) {
    if (f.toLowerCase() !== author.toLowerCase()) {
      problems.push(`This PR changes profiles/${f}/, but your GitHub username is ${author}. Name your folder profiles/${author}/.`);
    }
  }
  folders = [...touched].filter((f) => fs.existsSync(`../profiles/${f}`));
}

for (const folder of folders) {
  const { errors, warnings } = readProfile(folder);
  errors.forEach((e) => problems.push(`profiles/${folder}: ${e}`));
  warnings.forEach((w) => notes.push(`profiles/${folder}: ${w}`));
}

const summary = [];
if (problems.length) {
  summary.push("## ❌ Your profile needs a fix", "", ...problems.map((p) => `- ${p}`));
} else {
  summary.push("## ✅ Profile looks great", "", `Checked: ${folders.map((f) => `profiles/${f}`).join(", ") || "nothing to check"}`);
}
if (notes.length) summary.push("", "**Heads up**", ...notes.map((n) => `- ${n}`));
const text = summary.join("\n");
console.log(text);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, text + "\n");
process.exit(problems.length ? 1 : 0);
