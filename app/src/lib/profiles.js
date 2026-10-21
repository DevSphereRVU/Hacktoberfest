import data from "@/generated/profiles.json";

export const REPO_URL = "https://github.com/DevSphereRVU/Hacktoberfest";

export function getProfiles() {
  return data.profiles;
}

export function getProfile(username) {
  return data.profiles.find((p) => p.username.toLowerCase() === String(username).toLowerCase()) || null;
}
