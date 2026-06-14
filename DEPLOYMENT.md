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

### GitHub Pages (automated)
`.github/workflows/deploy-pages.yml` builds and publishes on every push to
`main`. **One-time setup:** in the repo, go to **Settings → Pages → Build and
deployment → Source = "GitHub Actions"** (until this is set the deploy job
fails). The site then publishes to `https://<user>.github.io/<repo>/` — for this
repo, `https://davidleathers113.github.io/checkers/`.

The workflow builds with `PAGES_BASE=/<repo>/`, which sets Vite's base path so
all assets, the manifest/icon links, and the service worker resolve under the
sub-path (offline support included). Run a deploy on demand from the **Actions**
tab via "Run workflow".

For a **user/org site or a custom domain served at the root**, change the
workflow's `PAGES_BASE` to `/` (or remove it).

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

## Note on sub‑path hosting

The build defaults to the site root (`/`), which suits Render, Netlify, Vercel,
and custom domains with no change. To host under a sub‑path (e.g. a GitHub Pages
project site at `https://user.github.io/checkers/`), set the base when building:

```bash
PAGES_BASE=/checkers/ npm run build:web
# preview it under the sub-path:
PAGES_BASE=/checkers/ npm run preview   # http://localhost:4173/checkers/
```

The GitHub Pages workflow above does this automatically. `PAGES_BASE` feeds
Vite's `base`, the `%BASE_URL%` links in `index.html`, and the service-worker
registration URL, so everything resolves correctly under the sub-path.
