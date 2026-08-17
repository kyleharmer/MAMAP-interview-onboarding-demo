# MAMAP Onboarding Demo

A demo build of the Michigan Advanced Manufacturing Adoption Program (MAMAP)
application/vetting/dashboard flow, built for the Automation Alley Grant
Program Manager assessment.

**This is a demo build with a real (but intentionally lightweight) backend.**
Application and scoring data is stored in Firebase Realtime Database and
syncs live across every visitor — see "How data works" below for exactly
what that means and what's still demo-only (the login gate, notably).

## 1. Run it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`. Edit `src/App.jsx` and it hot-reloads.

## 2. Deploy to GitHub Pages

One-time setup:

1. Push this folder to a new GitHub repo.
2. In the repo, go to **Settings → Pages**.
3. Under "Build and deployment", set **Source** to **GitHub Actions**.
4. Push to `main` (or click **Run workflow** under the Actions tab).

The included workflow (`.github/workflows/deploy.yml`) builds the app and
deploys it automatically on every push to `main` — no manual build step, no
`gh-pages` branch to manage. After the first successful run, your link is:

```
https://<your-username>.github.io/<your-repo-name>/
```

Find it under **Settings → Pages** once the first deploy finishes (usually
under a minute).

## 3. How data works (read this before sending the link)

Application and scoring data lives in a real Firebase Realtime Database, not
just browser memory:

- If **you** add a test company or score an application, it's written to
  Firebase immediately and visible to anyone else with the link — including
  after you close the tab or refresh.
- If you **share the link**, whoever opens it sees the same live data you
  do, and changes either of you make sync to the other in real time (no
  refresh needed).
- The top bar shows a **Live** / **Connecting…** / **Offline (local only)**
  indicator so it's always clear whether you're actually looking at synced
  data.
- The sign-in on Vetting Committee / Dashboard is still explicitly **not**
  real authentication (see section 6) — it doesn't gate who can write data,
  only what the current browser tab can see labeled as "signed in."

## 4. Adding or changing test companies

There are two different ways to change what's in the data now, and they do
different things:

**To edit live data directly (fastest, no redeploy needed):** open the
[Firebase console](https://console.firebase.google.com) → your project →
Realtime Database → `applications`. You can edit, add, or delete entries
right there, and every open tab of the app updates within a second or two.

**To change the one-time seed data** (only matters the *first* time the
database is ever empty — e.g. if you wipe it and want a fresh baseline):
1. Open `src/App.jsx`, find `const seedApplications = () => [ ... ]`
2. Edit the array — match the shape of the existing entries
3. In the Firebase console, delete everything under `applications` (this
   makes the database empty again)
4. Reload the app once — it detects the empty database and writes your
   updated seed data back in

Editing `seedApplications()` alone does **not** change already-seeded data —
that function only runs once, the very first time the database is empty.

## 5. The "Suggest starting scores" button and the API

The Vetting Committee view has an AI-assisted scoring suggestion button. It
first tries a live call to Anthropic's API. When this app runs inside
Claude.ai's own artifact environment, that call is authenticated
automatically. **Once deployed to GitHub Pages as a plain static site, there
is no backend and no API key, so that live call will always fail** — the app
detects this (via a timeout) and automatically falls back to a transparent,
rule-based heuristic that scores off the same structured fields (automation
maturity level, jobs impact, timeline, etc.), clearly labeled **"Heuristic
(offline mode)"** next to the button so it's never presented as something
it isn't. Nothing breaks or shows an error in front of whoever is viewing it.

If you later want the live AI scoring to actually run on the hosted version,
that requires a small backend (even a single serverless function) to hold an
API key server-side — deliberately left out here to keep this deploy simple,
per the current scope.

## 6. What's demo-only vs. real

- **Login gate** (Vetting Committee / Dashboard): not a real auth system —
  clearly labeled as such on the sign-in screen. It only personalizes the
  session (shows your name in the header).
- **Eligibility check**: a simplified employee-count proxy, not the real
  SBA per-NAICS determination — the app links to the actual SBA Size
  Standards Tool and says so explicitly.
- **Scoring rubric and weighted-total math**: fully real and functional —
  not a mockup. The weights, formula, and recommendation bands are all live.

## 8. Firebase (real shared data)

As of v1.5.0, application and scoring data is stored in a real Firebase
Realtime Database (`src/firebase.js`) instead of only browser memory.
Everyone who opens the deployed link sees the same live data, and changes
sync in real time — the top bar shows **Live** / **Connecting…** / **Offline
(local only)** so it's obvious if the connection ever drops (the app still
works fully offline, it just won't sync).

**Security note:** the database is currently running in Firestore/RTDB "test
mode" — open read/write for anyone with the URL, including the Vetting
Committee scoring data. That's a reasonable tradeoff for an interview demo
where the login gate is explicitly not real authentication anyway, but it's
worth tightening (e.g. requiring a shared key for writes to `/applications/*`
status and score fields) before this becomes anything more than a demo.

## 9. Changelog

The app displays its current version number in the top gold bar (e.g. `v1.5.0`).
Update `APP_VERSION` in `src/App.jsx` and add an entry here with every
meaningful change, so this file always reflects what's actually deployed.

- **1.5.0** — Connected to a real Firebase Realtime Database. Application
  and scoring data now persists and syncs live across every visitor instead
  of resetting per browser tab. Added a Live/Connecting/Offline indicator to
  the top bar.
- **1.4.0** — Fixed a dead-end: the "Back" button on the first step of the
  application form was disabled with no way to return to the landing page.
  It now routes Home from step 1. Added Home / Visit Automation Alley /
  Share-by-email actions to the post-submission confirmation screen — the
  share link builds a pre-filled email using the page's own live URL, so it
  always points to wherever this is actually hosted.
- **1.3.0** — Version number now shown in the top bar. Automation Alley logo
  links out to automationalley.com. "Suggest starting scores" redesigned as
  a clearly clickable primary button (solid fill, shadow, press animation)
  instead of a subtle tinted link.
- **1.2.0** — Added a marketing landing page ahead of the application form:
  program summary, who administers/funds it, eligibility, and benefits, with
  an explicit "Apply now" action before the form is shown.
- **1.1.0** — Broadened eligibility/project questions to cover the program's
  full scope (automation, robotics, and AI) rather than automation alone;
  added a technology-focus multi-select that feeds both the rubric and the
  AI/heuristic scoring prompt.
- **1.0.0** — Initial functional build: multi-step public application with
  live SBA-proxy eligibility check, Vetting Committee view with a real
  weighted 6-criterion scoring rubric, AI-assisted starting scores (with an
  automatic offline heuristic fallback), a program pipeline Dashboard, and a
  demo-only sign-in gate on the internal views. Deployed via GitHub Actions
  to GitHub Pages.
