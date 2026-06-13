// Minimal offline-first service worker for the Checkers PWA.
//
// It is served verbatim from /sw.js (no build step), so it must not reference
// hashed asset filenames directly. Strategy:
//   - navigations: network-first, falling back to the cached app shell so the
//     game still loads with no connection;
//   - same-origin GET assets (hashed JS/CSS, icon, manifest): cache-first, so
//     repeat visits are instant and work offline after the assets have been
//     fetched once under this worker's control.
//
// Hashed asset filenames change every build, so a static cache name is safe:
// superseded entries are simply never requested again, while the shell is
// refreshed from the network whenever the device is online.

const CACHE = 'checkers-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  // Note: we deliberately do NOT call clients.claim(). The worker takes control
  // on the next navigation rather than hijacking the page that registered it,
  // which keeps the very first load deterministic (it never intercepts the
  // in-flight asset/font requests of the page that is currently rendering).
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key))))
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  // App navigations: network-first, with the cached shell as the offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html').then((cached) => cached || caches.match('./')))
    );
    return;
  }

  // Same-origin static assets: cache-first, populating the cache on a miss.
  if (sameOrigin) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }
        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return response;
        });
      })
    );
  }

  // Cross-origin requests (e.g. Google Fonts) are left to the browser's default
  // handling; the app ships system-font fallbacks when they are unavailable.
});
