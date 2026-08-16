# MAMAP Onboarding Demo

A demo build of the Michigan Advanced Manufacturing Adoption Program (MAMAP)
application/vetting/dashboard flow, built for the Automation Alley Grant
Program Manager assessment.

**This is a static, front-end-only demo.** There is no backend and no
database. All application data lives in memory in the visitor's browser tab
and resets on refresh — see "How data works" below before you demo this live.

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

Every application, score, and login is stored in React state — plain
JavaScript memory in that one browser tab. There is no server and nothing is
saved anywhere:

- If **you** open the link and add a test company, only your tab sees it.
  Refresh, and it's gone.
- If you **share the link**, whoever opens it always starts from the same
  baseline data below — they will never see anything you typed in your own
  session, no matter how long you leave it open.

## 4. Adding or changing test companies (the simple way)

Since this doesn't need a real database yet, the way to make a change
visible to *everyone* who opens the link is to bake it into the source and
redeploy:

1. Open `src/App.jsx`.
2. Find `const seedApplications = () => [ ... ]` near the top.
3. Add, edit, or remove an application object in that array. Match the shape
   of the existing entries (see any one of the five for the full field list —
   `ref`, `company`, `employees`, `scores`, etc.).
4. Commit and push to `main`. The GitHub Actions workflow rebuilds and
   redeploys automatically — give it about a minute.

That new baseline is now what *everyone* sees when they open the link, until
you change it again.

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

## 7. Changelog

The app displays its current version number in the top gold bar (e.g. `v1.4.0`).
Update `APP_VERSION` in `src/App.jsx` and add an entry here with every
meaningful change, so this file always reflects what's actually deployed.

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
