# FreshSpawn — Live New Game Reviews

A public website that shows new & top-rated video games with live data, cover art, and a personal star‑rating feature. Live data comes from the [RAWG](https://rawg.io) API through a serverless function, so **your API key is never exposed** in the page.

## What's in this folder

```
index.html              The website (frontend)
netlify/functions/
  games.js              Serverless proxy that calls RAWG with your secret key
netlify.toml            Netlify config (publish dir + functions dir)
README.md               This file
```

## Get it live in ~5 minutes

### 1. Get a free RAWG API key
1. Go to https://rawg.io/apikey
2. Sign up (free) and copy your API key.

### 2. Deploy to Netlify

**Option A — drag & drop (no account tools needed)**
1. Sign in at https://app.netlify.com
2. Click **Add new site → Deploy manually**.
3. Drag this entire folder onto the upload area.
4. After it deploys, go to **Site configuration → Environment variables → Add a variable**:
   - Key: `RAWG_API_KEY`
   - Value: *(paste your RAWG key)*
5. Go to **Deploys → Trigger deploy → Deploy site** so the function picks up the key.
6. Open your new `https://<your-site>.netlify.app` URL. Done.

**Option B — Git + continuous deploy (recommended long‑term)**
1. Push this folder to a GitHub repo.
2. In Netlify: **Add new site → Import from Git**, pick the repo.
3. Build settings: leave the publish directory as `.` (functions are auto-detected from `netlify.toml`).
4. Add the `RAWG_API_KEY` environment variable (step 4 above), then deploy.
5. Every future `git push` redeploys automatically.

### 3. (Optional) Custom domain
In Netlify: **Domain management → Add a domain** to point your own domain at the site.

## Run it locally
```bash
npm install -g netlify-cli
netlify dev
```
Then set the key for local dev: create a `.env` file with `RAWG_API_KEY=your_key_here`.

> Opening `index.html` directly (double‑click, no server) still works — it falls back to a small built‑in **sample dataset** and shows a "Preview mode" note, because the serverless function only runs when hosted.

## How it works

- The page calls `/.netlify/functions/games?...` instead of RAWG directly.
- `games.js` injects your secret `RAWG_API_KEY` server-side and forwards the request to `https://api.rawg.io/api/...`, so the key never reaches the browser.
- On load the site pulls two feeds: top‑rated games from this year + last year (sorted by Metascore) and upcoming releases. Cover images, genres, platforms, release dates, Metacritic scores, and the community review breakdown all come straight from RAWG.
- **Rate it yourself:** click the stars in a game's detail view. Your ratings are saved in your browser via `localStorage` (private to you, persists between visits). To make ratings shared/global across all visitors later, you'd add a small database (e.g. Supabase) — ask and I can wire that up.

## Features
- Live game grid with real cover art and Metascore badges
- Top‑rated leaderboard
- Search, genre filter, status filter (released / upcoming), and sort (score / newest / A–Z)
- Click‑through detail view with description, platforms, community review breakdown, and your personal rating
- Early‑2000s "Frutiger Aero" glossy theme

## Notes
- RAWG's free tier allows 20,000 requests/month; responses are cached for 5 minutes by the function to stay well under that.
- Attribution to RAWG is included in the site footer, as required by their free tier.
