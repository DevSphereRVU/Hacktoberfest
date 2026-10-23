# 🧱 The RVU Contributors Wall · Hacktoberfest 2026

Every card on this wall is a real merged pull request. Add yours and you're on it.  
Built for the **DevSphere × FOSS RVU** Hacktoberfest meetup at RV University, Bengaluru — 23 October 2026.

**Live site:** _link appears here once deployed on Vercel_  
**Repo:** [github.com/DevSphereRVU/Hacktoberfest](https://github.com/DevSphereRVU/Hacktoberfest)

---

## 📁 What's in this repo

```
Hacktoberfest/
├── .github/
│   ├── workflows/
│   │   ├── auto-merge.yml     ← the wall bot (auto-reviews and merges your PR)
│   │   └── ci.yml             ← builds the site on every push to main
│   ├── blocked-words.txt      ← words that pause the bot for a human to check
│   ├── pull_request_template.md  ← the checklist you see when you open a PR
│   └── workshop-issues.json   ← issue templates for the solo-round features
│
├── app/                       ← the Next.js website (you don't touch this)
│   ├── scripts/
│   │   ├── collect-profiles.mjs   ← reads ../profiles/, builds profiles.json
│   │   ├── profile-rules.mjs      ← shared validation rules for bios
│   │   ├── validate-profiles.mjs  ← CLI tool to check all profiles locally
│   │   ├── pr-bot.mjs             ← the actual bot logic (check / merge / comment)
│   │   └── pr-times.mjs           ← fetches PR open/merge timestamps from GitHub API
│   └── src/
│       ├── app/
│       │   ├── globals.css        ← all the CSS for the site
│       │   ├── layout.jsx         ← root layout
│       │   ├── page.jsx           ← homepage (the wall)
│       │   └── u/[username]/
│       │       └── page.jsx       ← individual profile page
│       ├── components/
│       │   ├── Hero.jsx           ← the big header
│       │   ├── Wall.jsx           ← the card grid + search bar
│       │   └── Avatar.jsx         ← profile photo with initials fallback
│       └── lib/
│           └── profiles.js        ← reads profiles.json and exports helpers
│
└── profiles/                  ← THIS is where you add yourself
    ├── test-user/             ← the example folder. Copy this.
    │   ├── test_bio.md
    │   └── test.jpg
    └── your-github-username/  ← your folder goes here
        ├── bio.md             ← required
        └── photo.jpg          ← optional (we use your GitHub avatar if missing)
```

---

## 🤔 What is Hacktoberfest?

Hacktoberfest is an event that runs every October. The idea is simple: contribute to open source projects on GitHub. You make **pull requests** (basically: "here's my change, please add it"), maintainers merge them, and you can say you've shipped code to a real repository on the internet.

This project **is** that repository. Instead of contributing to some giant project you've never heard of, you're adding yourself to a live wall that everyone at the meetup can see on screen. Same Git skills, lower stakes, higher dopamine.

---

## 🧠 Quick crash course on Git and GitHub

If you've only used GitHub to download zip files — that's okay, this is literally designed for you.

| Term | What it actually means |
|---|---|
| **Git** | A tool on your laptop that tracks every change you make to a folder, like a detailed version history |
| **GitHub** | A website that hosts Git projects so others can see and contribute to them |
| **Repository (repo)** | A project folder that Git is tracking |
| **Fork** | Your own personal copy of someone else's repo. You can freely break things in it |
| **Clone** | Downloading that fork to your laptop so you can actually edit files |
| **Commit** | Saving a named snapshot of your changes (like "added my profile") |
| **Push** | Uploading your commits back up to GitHub |
| **Pull Request (PR)** | Asking the original repo to include your changes. This is the main thing. |

The flow is always: **Fork → Clone → Edit → Commit → Push → Open PR**.

That's it. The rest is just details.

---

## ✅ Add yourself in 5 steps

> **Never done this before?** Perfect, that's the whole point of today.

### Step 0 — Install Git (if you haven't already)

**Windows:** Download the installer from [git-scm.com/install/windows](https://git-scm.com/install/windows). Click through it — the defaults are all fine. Then open **Git Bash** (it gets installed alongside Git).

**macOS:** Open Terminal and run `git --version`. If it's not there, macOS will offer to install it. Or with [Homebrew](https://brew.sh): `brew install git`.

Check it worked:

```bash
git --version
# should print something like: git version 2.47.0
```

---

### Step 1 — Fork this repo, then clone your fork

Click **Fork** at the top right of this page. GitHub creates your own copy at `github.com/YOUR-USERNAME/Hacktoberfest`.

Now clone **your fork** (not the original repo):

```bash
git clone https://github.com/YOUR-USERNAME/Hacktoberfest.git
cd Hacktoberfest
```

> ⚠️ Most common beginner mistake: cloning the original and wondering why `git push` says "permission denied". Always clone your fork.

---

### Step 2 — Copy the example folder and make it yours

```bash
cd profiles
cp -r test-user YOUR-GITHUB-USERNAME
```

**Your folder name must exactly match your GitHub username.** Same spelling, same casing. The bot checks this.

Now open the folder in VS Code (or any text editor):

1. **Rename** `test_bio.md` → `bio.md`
2. **Edit** `bio.md` to be about you (see the format below)
3. **Delete** `test.jpg` and drop in your own photo (`.jpg`, `.png`, or `.webp`, max 5 MB). Or just delete it — we'll use your GitHub avatar automatically if there's no photo.

Your `bio.md` should look like this:

```markdown
---
name: Deshnaa Suresh
role: 2nd Year CSE @ RVU
emoji: 🎓
links:
  github: https://github.com/deshnaas
  linkedin: https://linkedin.com/in/yourprofile
  instagram: https://instagram.com/yourhandle
---
Hey! I'm a second-semester CS student at RVU who's slowly figuring out
what "open source" actually means. This is my first PR and I'm on the wall.
```

**All the fields you can use:**

| Field | Required? | Limit | Notes |
|---|---|---|---|
| `name` | ✅ Yes | 40 characters | Your display name on the card |
| `role` | No | 60 characters | Your year, branch, job, whatever |
| `emoji` | No | 1 emoji | Shows in the corner of your card |
| `links` | No | — | Supported: `github`, `linkedin`, `x`, `website`, `instagram` |
| text under `---` | ✅ Yes | 400 characters | The bio text that appears on your card |

> **Note on links:** they must be full `https://` URLs, not just usernames. So `https://github.com/deshnaas`, not just `deshnaas`.

---

### Step 3 — Commit and push

First, check what you've changed:

```bash
git status
```

You should see your new folder listed. Then stage, commit, and push:

```bash
git add .
git commit -m "Add YOUR-USERNAME to the wall"
git push origin main
```

> `git add .` stages everything in the current directory (selects it for the next snapshot).  
> `git commit -m "..."` takes the snapshot with your message.  
> `git push origin main` uploads it to your fork on GitHub.

---

### Step 4 — Open a Pull Request

Go to `github.com/YOUR-USERNAME/Hacktoberfest`. You should see a yellow banner — **"Compare & pull request"**. Click it.

Fill in the checklist in the PR description and click **Create pull request**.

---

### Step 5 — Wait about 60 seconds

The **wall bot** runs automatically:

- ✅ **If everything is fine:** the bot merges your PR, comments with a link, and your card appears on the live site — usually within a minute.
- ❌ **If something needs fixing:** the bot comments with exactly what's wrong. Fix it, commit, push again. The PR updates itself and the bot re-checks automatically.

> You don't need to close and reopen your PR. Just push the fix to the same branch.

---

## 🎉 That's it. You did open source.

Fork → Clone → Edit → Commit → Push → PR. That's the exact same workflow used by every open-source project on the internet — Linux, VS Code, React, all of it. The files are different, the scale is different, the idea is identical.

---

## 🔗 No Git installed? Use github.dev instead

Press `.` on this repo page (the dot key, seriously) while on your fork. It opens **github.dev** — a full VS Code running in your browser. Create your folder there, write your bio, and commit directly. No install needed.

---

## 🆘 Common errors and fixes

| Error you see | What to do |
|---|---|
| `Support for password authentication was removed` | Run `gh auth login`, or create a Personal Access Token at GitHub → Settings → Developer settings and use it as your password |
| `Permission denied (publickey)` or `403` | You probably cloned the original repo, not your fork. The URL should have YOUR username in it |
| `! [rejected] main → main (fetch first)` | Someone else pushed to your fork before you. Run `git pull origin main` then push again |
| The bot says "folder name is wrong" | Rename your folder to your exact GitHub username: `git mv profiles/wrong-name profiles/exact-username` |
| `Updates were rejected because the tip of your current branch is behind` | Same as above — `git pull --rebase origin main` then push |
| Bot says "photo is over 5 MB" | Compress it at [squoosh.app](https://squoosh.app) or [tinypng.com](https://tinypng.com) |
| Nothing happened after I pushed | Double check you pushed to `origin main` and not some other branch or remote |

Still stuck? Find anyone with a DevSphere or FOSS RVU lanyard. That's why we're here.

---

## 🛠 Starting your own Git project from scratch?

For new projects that aren't on GitHub yet, use `git init`:

```bash
git init my-cool-project
cd my-cool-project
# make files, then:
git add .
git commit -m "first commit"
# then go to github.com, create a new repo, and:
git remote add origin https://github.com/YOUR-USERNAME/my-cool-project.git
git push -u origin main
```

For this repo specifically, `git clone` already handled everything.

---

## ⚡ Finished early? Work on a real feature

Check the [issues labelled `good first issue`](../../issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22). These are actual tasks for the site itself — dark mode, a search filter, a "Surprise me" button, etc.

**How to work on a site issue:**

```bash
# Make sure you're back in the repo root
cd Hacktoberfest
# install dependencies
cd app
npm install
# run the local dev server
npm run dev
# open http://localhost:3000
```

Pick an open issue, comment on it to claim it, then build the feature and open a PR. These PRs go through human review (not the bot), and the CI workflow builds them to make sure the site doesn't break.

---

## 🏗 How the site actually works (for the curious)

This is a **Next.js 15** app (React framework) with static export. Here's the data flow:

```
profiles/ folders
       ↓
scripts/collect-profiles.mjs   (runs before every build)
       ↓
src/generated/profiles.json    (written at build time)
       ↓
src/lib/profiles.js            (reads the JSON, exports helpers)
       ↓
src/app/page.jsx               (homepage — passes profiles to Wall.jsx)
src/app/u/[username]/page.jsx  (individual profile page)
```

**`collect-profiles.mjs`** reads every folder in `profiles/`, runs it through the same validation rules the bot uses (`profile-rules.mjs`), copies photos into `public/photos/`, and writes a single `profiles.json` file. Any folder that fails validation is **skipped with a warning** — one bad profile can never take the whole site down.

**`profile-rules.mjs`** is the brain of the validation. It checks:
- Folder name is a valid GitHub username (letters, numbers, dashes only)
- Exactly one `.md` bio file
- At most one photo (`.jpg`, `.png`, `.webp`)
- `name` ≤ 40 chars, `role` ≤ 60 chars, bio ≤ 400 chars
- No `---js` front matter (that would let someone run code)
- Photo ≤ 5 MB
- No unknown extra files
- All links are full `https://` URLs

**`pr-times.mjs`** talks to the GitHub API at build time to get when each PR was opened and merged, then shows it on the card ("merged 14:32 IST · took 4m 12s"). If GitHub's API can't be reached, the build still works — just without the timings.

**The site UI** is built with:
- `Hero.jsx` — the big heading with the Hacktoberfest corner graphic and contributor count
- `Wall.jsx` — the card grid with a live-filtering search bar (client component)
- `Avatar.jsx` — shows your photo, falls back to an SVG with your initials if the photo fails to load
- `globals.css` — all the styles, using CSS custom properties (no Tailwind, no component library)

---

## 🤖 How the wall bot works

The bot is defined in two places:
- **`.github/workflows/auto-merge.yml`** — the GitHub Actions workflow that triggers it
- **`app/scripts/pr-bot.mjs`** — the actual logic

**Security design (this matters):**  
The workflow uses `pull_request_target`, which means it always runs the scripts from the `main` branch, never from the PR. So a contributor can't modify the bot by changing a script in their PR. The bot downloads the PR's profile files through the GitHub API as raw data and checks them in a temporary scratch folder. It never executes anything from the PR.

**What the bot checks:**
1. Does the PR only touch files inside `profiles/YOUR-USERNAME/`? (If it touches anything else, it's sent to human review)
2. Does the profile folder pass all the rules from `profile-rules.mjs`?
3. Do any words from `.github/blocked-words.txt` appear in the name/role/bio?
4. Does the site actually build with this profile included?

**If all checks pass** and no `hold` label is on the PR: the bot squash-merges exactly the commit it checked, labels the PR `wall`, and comments with a link to your card.

**If anything fails:** the bot comments with the exact list of problems. The contributor pushes a fix, the PR updates, the bot re-runs.

**Adding a `hold` label** to any PR stops the bot from merging it. A maintainer has to do it by hand.

---

## ⚙️ For maintainers: one-time setup

### GitHub repo settings

1. **Actions → General → Workflow permissions → Read and write permissions.** The bot needs write access to merge PRs.
2. **Do NOT add a branch protection rule that requires reviews on `main`.** That would block the bot's merge.
3. **Optional but recommended:** Settings → Secrets and variables → Actions → Variables → add `SITE_URL` (your Vercel link). The bot's merge comment will link directly to the contributor's new card.

### Vercel deployment

- Set **Root Directory = `app`** in your Vercel project settings.
- Every merge to `main` triggers a redeployment automatically.
- Optionally add a `GITHUB_TOKEN` environment variable (fine-grained token, read-only on public repos) to raise the GitHub API rate limit from 60 to 5,000 requests/hour for the PR timing lookups.

### Running locally

```bash
cd app
npm install
npm run dev        # runs collect-profiles.mjs then starts Next.js dev server
# open http://localhost:3000
```

To skip the GitHub API call for PR timings during local dev:

```bash
PR_TIMES=off npm run dev
```

### Validating profiles without running the full dev server

```bash
cd app
node scripts/validate-profiles.mjs
```

### The `workshop-issues.json` file

This is a list of pre-written issues (the "good first issue" tasks) that can be bulk-imported into the repo. If you're setting up a fork of this for your own event, you can create these issues with the GitHub API or with a tool like [github-issue-importer](https://github.com/nickvdyck/github-issue-importer).

---

## 📝 Profile validation rules (quick reference)

| Rule | Limit / Constraint |
|---|---|
| Folder name | Must be your GitHub username: letters, numbers, and dashes only, max 39 chars |
| Bio file | Exactly one `.md` or `.txt` file (any filename) |
| Photo | At most one `.jpg`, `.jpeg`, `.png`, or `.webp` file (max **5 MB**) |
| Extra files | Not allowed. Only one bio + one photo. |
| `name` field | Required (falls back to folder name if missing). Max **40 characters**. |
| `role` field | Optional. Max **60 characters**. |
| `emoji` field | Optional. One emoji. |
| `links` | Optional. Keys: `github`, `linkedin`, `x`, `website`, `instagram`. Must be full `https://` URLs. |
| Bio text (under `---`) | Required. Max **400 characters**. |
| Front matter type | Must be plain YAML (`---`). No `---js` blocks — the bot rejects them. |

---

## 📜 License

MIT. Do whatever you want with the code. Add yourself to the wall. Have fun.

---

*Made with a lot of `git push --force` and one very helpful bot.*
