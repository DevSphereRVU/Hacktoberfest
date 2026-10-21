// Shared rules for reading and checking a profile folder.
// Used by the build (collect-profiles.mjs) and by the PR check (validate-profiles.mjs).
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export const PROFILES_DIR = process.env.PROFILES_DIR
  ? path.resolve(process.env.PROFILES_DIR)
  : path.resolve(path.dirname(new URL(import.meta.url).pathname), "../../profiles");

export const LIMITS = { name: 40, role: 60, bio: 400, imageBytes: 1024 * 1024 };
export const IMAGE_EXTS = [".jpg", ".jpeg", ".png", ".webp"];
export const BIO_EXTS = [".md", ".txt"];
const USERNAME_RE = /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/;
const LINK_KEYS = ["github", "linkedin", "x", "website", "instagram"];

export function listProfileFolders() {
  if (!fs.existsSync(PROFILES_DIR)) return [];
  return fs
    .readdirSync(PROFILES_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_") && !d.name.startsWith("."))
    .map((d) => d.name);
}

const clean = (v) => (typeof v === "string" ? v.replace(/<[^>]*>/g, "").trim() : "");

/** Read one profile folder. Returns { profile, errors, warnings }. Never throws. */
export function readProfile(folder) {
  const errors = [];
  const warnings = [];
  const dir = path.join(PROFILES_DIR, folder);

  if (!USERNAME_RE.test(folder)) {
    errors.push(`Folder "${folder}" must be your GitHub username (letters, numbers and dashes only).`);
  }

  const files = fs.readdirSync(dir).filter((f) => !f.startsWith("."));
  const ext = (f) => path.extname(f).toLowerCase();
  const bios = files.filter((f) => BIO_EXTS.includes(ext(f)));
  const images = files.filter((f) => IMAGE_EXTS.includes(ext(f)));
  if (bios.length === 0) {
    errors.push(`profiles/${folder}/ needs a .md file with your bio. Copy profiles/test-user to get started.`);
    return { profile: null, errors, warnings };
  }
  if (bios.length > 1) errors.push(`profiles/${folder}/ has ${bios.length} bio files (${bios.join(", ")}). Keep just one .md file.`);
  if (images.length > 1) errors.push(`profiles/${folder}/ has ${images.length} photos (${images.join(", ")}). Keep just one, and delete test.jpg.`);
  const bioFile = bios.sort()[0];

  let data = {};
  let body = "";
  try {
    const raw = fs.readFileSync(path.join(dir, bioFile), "utf8");
    const parsed = matter(raw);
    data = parsed.data || {};
    body = parsed.content || "";
  } catch (e) {
    errors.push(`profiles/${folder}/${bioFile} could not be read. Check the --- lines at the top. (${e.reason || e.message})`);
    return { profile: null, errors, warnings };
  }

  const name = clean(data.name) || folder;
  const role = clean(data.role);
  const emoji = clean(data.emoji).slice(0, 8);
  const bio = clean(body).replace(/\n{3,}/g, "\n\n");

  if (!clean(data.name)) warnings.push(`No "name:" in ${bioFile}, so your username will be shown instead.`);
  if (name.length > LIMITS.name) errors.push(`name is ${name.length} characters, the limit is ${LIMITS.name}.`);
  if (role.length > LIMITS.role) errors.push(`role is ${role.length} characters, the limit is ${LIMITS.role}.`);
  if (!bio) errors.push(`Write a few words about yourself under the --- lines in ${bioFile}.`);
  if (bio.length > LIMITS.bio) errors.push(`Your bio is ${bio.length} characters, the limit is ${LIMITS.bio}. Keep it short and sweet.`);

  const links = {};
  const rawLinks = typeof data.links === "object" && data.links ? data.links : {};
  for (const [k, v] of Object.entries(rawLinks)) {
    if (!LINK_KEYS.includes(k)) {
      warnings.push(`Ignoring unknown link "${k}". Allowed: ${LINK_KEYS.join(", ")}.`);
      continue;
    }
    const url = clean(String(v ?? ""));
    if (!url) continue;
    if (!/^https:\/\/[^\s]+$/.test(url)) {
      errors.push(`links.${k} must be a full https:// URL.`);
      continue;
    }
    links[k] = url;
  }

  const image = images.sort()[0] || null;
  if (image) {
    const size = fs.statSync(path.join(dir, image)).size;
    if (size > LIMITS.imageBytes) errors.push(`${image} is ${(size / 1048576).toFixed(1)} MB, the limit is 1 MB.`);
  }
  for (const f of files) {
    if (![...BIO_EXTS, ...IMAGE_EXTS].includes(ext(f))) {
      errors.push(`Unexpected file profiles/${folder}/${f}. Only one .md bio and one .jpg/.png/.webp photo are allowed.`);
    }
  }
  const gh = clean(data.github);
  if (gh && !USERNAME_RE.test(gh)) errors.push(`github: "${gh}" doesn't look like a GitHub username.`);

  return {
    profile: { username: folder, github: gh || folder, name, role, emoji, bio, links, image },
    errors,
    warnings,
  };
}
