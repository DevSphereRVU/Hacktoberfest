# 🧱 The RVU Contributors Wall · Hacktoberfest 2026

Every card on the wall is a merged pull request.
Built for the **DevSphere × FOSS RVU** Hacktoberfest meetup at RV University, Bengaluru (23 October 2026).

**Live site:** _link appears here once it's deployed on Vercel_

```
Hacktoberfest/
├── app/                 ← the website (you don't need to touch this)
└── profiles/
    ├── test-user/       ← the example. Copy this folder
    │   ├── test_bio.md
    │   └── test.jpg
    └── your-username/   ← you add this
        ├── bio.md
        └── photo.jpg    (optional)
```

---

## Add yourself in 5 minutes

> **New to Git?** That's the whole point of today. Follow along step by step.

### 0. Install Git (once)

- **Windows:** download the installer from [git-scm.com/install/windows](https://git-scm.com/install/windows) and click through it. The defaults are fine. Then open **Git Bash**.
- **macOS:** open **Terminal** and run `git --version`. If Git isn't there, macOS offers to install it. Or, with [Homebrew](https://brew.sh): `brew install git`.

Check it worked:

```bash
git --version
```

### 1. Fork, then clone your fork

Click **Fork** (top right of this page). You now have your own copy at `github.com/YOUR-USERNAME/Hacktoberfest`. Clone **your fork**:

```bash
git clone https://github.com/YOUR-USERNAME/Hacktoberfest.git
cd Hacktoberfest
```

### 2. Copy the example folder

```bash
cd profiles
cp -r test-user YOUR-USERNAME
```

Your folder name **must be your GitHub username** (same spelling). Then open it in your editor:

- Rename `test_bio.md` to `bio.md` and write about yourself.
- Delete `test.jpg` and drop in your own photo (`.jpg`, `.png` or `.webp`, under 1 MB). No photo? We'll use your GitHub avatar.

```markdown
---
name: Samarth
role: AI Engineer @ Hoogway
emoji: 🚀
---
I build AI agents and occasionally break them on purpose.
```

| Field | Required | Limit |
|---|---|---|
| `name` | yes | 40 characters |
| `role` | no | 60 characters |
| `emoji` | no | one emoji |
| `links` | no | `github`, `linkedin`, `x`, `website`, `instagram` (full `https://` URLs) |
| text under the `---` | yes | 400 characters |

### 3. Check, commit, push

```bash
git status
git add .
git commit -m "Add YOUR-USERNAME to the wall"
git push origin main
```

### 4. Open a pull request

Go to your fork on GitHub. Click **Contribute → Open pull request** (or the **Compare & pull request** button), fill in the template, and click **Create pull request**.

Then watch for:

- ✅ **Check profile**: an automatic check that your folder follows the rules. If it's red, click **Details** to see what to fix, fix it, then commit and push again. The PR updates itself.
- 🔗 **Vercel preview**: a link to a copy of the site with *your* card on it.
- 🎉 **Merged**: a maintainer merges it, the site redeploys, and you're on the wall.

---

## Starting a brand-new project instead?

`git clone` sets everything up for you. For a folder of your own that isn't on GitHub yet, use `git init`:

```bash
git init my-git-project
cd my-git-project
git status
```

## No Git installed?

Press `.` on this repo page to open **github.dev** (VS Code in your browser). You can create your folder and file there and commit to your fork, then open a PR. Same result, no install.

## Stuck?

| You see | Do this |
|---|---|
| `Support for password authentication was removed` | Run `gh auth login`, or create a personal access token and use it as the password |
| `Permission denied` / `403` | You cloned the original repo instead of your fork. Clone `github.com/YOUR-USERNAME/Hacktoberfest` |
| `! [rejected] … (fetch first)` | `git pull origin main`, then push again |
| The check says the folder name is wrong | Rename it to your exact GitHub username: `git mv profiles/old profiles/NEW` |

## Finished early? Improve the site

Look at the [issues labelled `good first issue`](../../issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22). They're real features for this website (dark mode, filters, a "Surprise me" button…). Comment on one to claim it before you start.

---

## For maintainers

- The site is in `app/` and deploys on Vercel with **Root Directory = `app`**. Every merge to `main` redeploys it.
- At build time `app/scripts/collect-profiles.mjs` reads `profiles/`, copies photos into `public/photos/` and writes `src/generated/profiles.json`. A broken profile is **skipped with a warning**, so one bad folder never takes the site down.
- A profile folder holds one `.md` bio (any name) and at most one photo (any name). An optional `github:` field links the card to a different GitHub account than the folder name, as `test-user` does.
- The **Check profile** workflow runs `app/scripts/validate-profiles.mjs` on every PR. It makes sure a workshop PR only touches `profiles/<PR author>/`, and that the bio and photo follow the rules above.
- Run locally: `cd app && npm install && npm run dev`, then open http://localhost:3000.
