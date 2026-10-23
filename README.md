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

## 🤔 Wait, what even is Hacktoberfest?

Hacktoberfest is a month-long event every October where developers worldwide contribute to open-source projects on GitHub. You make pull requests (PRs), maintainers review and merge them, and you get to say you've done open-source — which, trust me, looks really good on your resume.

This project is our version of it at RVU. Instead of contributing to some random repo you've never heard of, you're adding yourself to **a live website** that the whole community can see. Same concept, more fun.

---

## 🧠 Quick Git/GitHub crash course (read this if you're lost)

If you've only ever used GitHub to download zip files, that's okay. Here's the mental model:

- **Git** = a tool that lives on your computer. It tracks changes in your code like a really detailed Ctrl+Z history.
- **GitHub** = a website that stores your Git projects online so others can see and contribute to them.
- **Repository (repo)** = a project folder that Git is tracking.
- **Fork** = your own personal copy of someone else's repo on GitHub. You can mess with it freely.
- **Clone** = downloading that fork to your laptop so you can actually edit files.
- **Commit** = saving a snapshot of your changes with a message like "added my profile".
- **Push** = uploading those saved changes back to GitHub.
- **Pull Request (PR)** = telling the original repo's owner "hey, I made changes, can you merge them in?"

That's literally the whole flow. Fork → Clone → Edit → Commit → Push → PR.

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

> You should see something like `git version 2.x.x`. If you get `command not found`, Git isn't installed yet.

### 1. Fork, then clone your fork

Click **Fork** (top right of this page). GitHub will create a copy of this repo under your account at `github.com/YOUR-USERNAME/Hacktoberfest`.

Now clone **your fork** (not the original):

```bash
git clone https://github.com/YOUR-USERNAME/Hacktoberfest.git
cd Hacktoberfest
```

> ⚠️ A very common mistake: people clone the original repo and then wonder why they can't push. Always clone **your fork**.

### 2. Copy the example folder

```bash
cd profiles
cp -r test-user YOUR-USERNAME
```

Your folder name **must be your GitHub username** (same spelling, same case). Then open it in your editor:

- Rename `test_bio.md` → `bio.md`
- Write a short intro about yourself in `bio.md`
- Delete `test.jpg` and drop in your own photo (`.jpg`, `.png` or `.webp`, up to 5 MB). No photo? No worries — we'll use your GitHub avatar automatically.

Your `bio.md` should look like this:

```markdown
---
name: Deshnaa Suresh
role: 2nd Year CSE @ RVU
emoji: 💻
links:
  github: https://github.com/deshnaas
  linkedin: https://linkedin.com/in/yourprofile
---
Hey! I'm a 2nd year CSE student at RVU. I like building things and breaking them equally.
This is my first open-source contribution and honestly it's not as scary as I thought.
```

**Fields you can fill in:**

| Field | Required | Limit |
|---|---|---|
| `name` | ✅ yes | 40 characters |
| `role` | no | 60 characters |
| `emoji` | no | one emoji |
| `links` | no | `github`, `linkedin`, `x`, `website`, `instagram` (full `https://` URLs) |
| text under the `---` | ✅ yes | 400 characters |

### 3. Check, commit, push

Before committing, check what files you've changed:

```bash
git status
```

You should see your new folder under `profiles/YOUR-USERNAME/`. Then:

```bash
git add .
git commit -m "Add YOUR-USERNAME to the wall"
git push origin main
```

> **What does `git add .` do?** It stages all your changes — tells Git "include these in the next snapshot." Think of it like selecting files before hitting save.

### 4. Open a pull request

Go to your fork on GitHub (`github.com/YOUR-USERNAME/Hacktoberfest`). You should see a yellow banner saying **"Compare & pull request"** — click it. Fill in the template and hit **Create pull request**.

Then the **wall bot** takes over:

- ✅ If your folder follows the rules, the bot merges your PR by itself and comments with a link. The site redeploys and you're on the wall in about **60 seconds**.
- ❌ If something's off, the bot comments with exactly what to fix. Just fix it, commit and push again — the PR updates automatically and the bot re-checks.

---

## 🎉 Congrats, you just did open source

Seriously. That's it. You forked a repo, made a change, and opened a pull request — that's what open-source contribution looks like. The repos that keep the internet running (Linux, Node.js, VS Code) work exactly this way, just with more files and more people arguing in the comments.

---

## Starting a brand-new project instead?

`git clone` sets everything up for you. For a folder of your own that isn't on GitHub yet, use `git init`:

```bash
git init my-git-project
cd my-git-project
git status
```

This initializes a new empty repository. From here you can start making commits, and later connect it to a GitHub repo with `git remote add origin <your-repo-url>`.

---

## No Git installed?

Press `.` on this repo page to open **github.dev** (VS Code in your browser). You can create your folder and file there and commit to your fork, then open a PR. Same result, no install needed.

---

## 🆘 Stuck?

| You see | Do this |
|---|---|
| `Support for password authentication was removed` | Run `gh auth login`, or create a personal access token and use it as the password |
| `Permission denied` / `403` | You cloned the original repo instead of your fork. Clone `github.com/YOUR-USERNAME/Hacktoberfest` |
| `! [rejected] … (fetch first)` | `git pull origin main`, then push again |
| The check says the folder name is wrong | Rename it to your exact GitHub username: `git mv profiles/old-name profiles/your-exact-username` |
| Nothing is happening after `git push` | Check that you're pushing to `origin main` and not some other branch |

Still stuck? Just ask anyone with a lanyard at the event. That's literally why we're here.

---

## Finished early? Improve the site

Look at the [issues labelled `good first issue`](../../issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22). They're real features for this website (dark mode, filters, a "Surprise me" button…). Comment on one to claim it before you start.

These are actual coding contributions — components, scripts, a bit of CSS. If you've done Web Dev in your curriculum already, this is fair game.

---

## For maintainers

- The site is in `app/` and deploys on Vercel with **Root Directory = `app`**. Every merge to `main` redeploys it.
- At build time `app/scripts/collect-profiles.mjs` reads `profiles/`, copies photos into `public/photos/` and writes `src/generated/profiles.json`. A broken profile is **skipped with a warning**, so one bad folder never takes the site down.
- A profile folder holds one `.md` bio (any name) and at most one photo (any name). An optional `github:` field links the card to a different GitHub account than the folder name, as `test-user` does.
- **The wall bot** (`.github/workflows/auto-merge.yml` + `app/scripts/pr-bot.mjs`) checks every PR and **auto-merges** profile PRs that pass:
  - It runs on `pull_request_target`, so it runs straight away even for first-time contributors, using the scripts from `main`. It never runs code from the PR: it downloads the PR's profile files through the API as data.
  - It only merges PRs that touch nothing but `profiles/<PR author>/`, and merges exactly the commit it checked.
  - It rejects bios that try to run code (`---js` front matter), photos over 5 MB, extra files, and wrong folder names, and comments the fix on the PR.
  - Words in `.github/blocked-words.txt` stop the auto-merge so a human can look. Add a `hold` label to any PR to stop the bot merging it.
  - PRs that change the site code get a "a maintainer will review this" comment, and `.github/workflows/ci.yml` builds them.
- **PR timings on the wall:** at build time `app/scripts/pr-times.mjs` asks the GitHub API when each person's PR was opened and merged (the bot labels those PRs `wall`) and shows it on their card, newest merges first, in IST. If GitHub can't be reached the site still builds, just without timings. On Vercel, optionally add an environment variable `GITHUB_TOKEN` (a fine-grained token with read-only access to public repos) to raise the API limit from 60 to 5,000 calls an hour.
- **One-time setup for the bot:**
  1. Settings → Actions → General → Workflow permissions → **Read and write permissions**.
  2. Don't add a branch protection rule on `main` that requires reviews, or the bot can't merge.
  3. Optional: Settings → Secrets and variables → Actions → Variables → add `SITE_URL` (your Vercel link) so the bot's comment links to each new card.
- Run locally: `cd app && npm install && npm run dev`, then open http://localhost:3000.
