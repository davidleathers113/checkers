# Deployment

The playable app is a static single-page site built by Vite. There is no
server or database — any static host works.

## Run it locally

```bash
npm install

# Live dev server with hot reload
npm run dev            # http://localhost:5173

# Production build + preview (what users will get)
npm run build:web      # outputs to dist/web/
npm run preview        # serves dist/web/ at http://localhost:4173
```

Play together on one device, or open the preview/dev URL on a tablet or phone
that's on the same Wi‑Fi (use your computer's LAN IP, e.g. `http://192.168.x.x:5173`).

## Install on a tablet (no app store)

The app ships a web manifest and icons, so on a tablet/phone you can open the
URL in the browser and choose **"Add to Home Screen"**. It then launches
full‑screen like a normal app — handy for playing with a kid.

## Deploy to a URL

The production build is the contents of `dist/web/`. Point any static host at it.

### Render (blueprint included)
`render.yaml` is committed. On https://render.com choose **New → Blueprint**,
connect this repo, and Render will build with `npm ci && npm run build:web` and
publish `dist/web/`. Or, with the Render CLI: `render blueprint launch`.

### Netlify
- Build command: `npm run build:web`
- Publish directory: `dist/web`

### Vercel
- Framework preset: **Other**
- Build command: `npm run build:web`
- Output directory: `dist/web`

### Any static host / S3 / nginx
Upload the contents of `dist/web/` and serve `index.html`.

## Note on sub‑path hosting (e.g. GitHub Pages project sites)

The app is built for the site root (`/`). If you must host it under a sub‑path
like `https://user.github.io/checkers/`, set Vite's base URL when building:

```bash
# vite.config.ts: add `base: '/checkers/'`, then
npm run build:web
```

Root‑hosted deploys (Render, Netlify, Vercel, a custom domain) need no change.
