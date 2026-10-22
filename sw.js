/* Neo Formulary — service worker (offline support)
   - The app page, drugs.csv and the manifest are fetched fresh from GitHub whenever
     the device is online ("network first"), so anything you push to GitHub reaches
     devices on their next open. The last good copy is kept for offline use.
   - Icons are served from the device ("cache first").
   You do not need to edit this file when you update drugs.csv or index.html.
   Change VERSION only if you add new files that must be available offline. */
const VERSION = '2026-10-22.3';
const CACHE = 'miri-formulary-' + VERSION;
const CORE = [
  './',
  'drugs.csv',
  'manifest.webmanifest',
  'icon-192.png',
  'icon-512.png',
  'icon-maskable-512.png',
  'apple-touch-icon.png'
];
const NETWORK_TIMEOUT_MS = 4000; // slow ward Wi-Fi: fall back to the saved copy after 4 s

const abs = (p) => new URL(p, self.registration.scope).href;

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    // Add files one by one so a single missing file never blocks offline support
    await Promise.all(CORE.map(async (p) => {
      try {
        const resp = await fetch(abs(p), { cache: 'no-store' });
        if (resp.ok) await cache.put(abs(p), resp);
      } catch (e) { /* offline during install — will be filled on next visit */ }
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('miri-formulary-') && k !== CACHE).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

async function networkFirst(request, cacheKey, markFallback) {
  const cache = await caches.open(CACHE);
  const network = fetch(request.mode === 'navigate' ? request.url : request, { cache: 'no-store', credentials: 'same-origin' })
    .then(async (resp) => {
      if (resp && resp.ok) await cache.put(cacheKey, resp.clone());
      return resp;
    });
  const cached = await cache.match(cacheKey);
  if (!cached) return network; // nothing saved yet — must wait for the network
  const timeout = new Promise((resolve) => setTimeout(() => resolve('timeout'), NETWORK_TIMEOUT_MS));
  try {
    const winner = await Promise.race([network, timeout]);
    if (winner !== 'timeout' && winner.ok) return winner;
  } catch (e) { /* offline */ }
  network.catch(() => {}); // let a slow download finish in the background
  if (!markFallback) return cached;
  const headers = new Headers(cached.headers);
  headers.set('X-Offline-Fallback', '1');
  return new Response(await cached.blob(), { status: 200, headers });
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const key = request.url.split('?')[0];
  const cached = await cache.match(key);
  if (cached) return cached;
  const resp = await fetch(request);
  if (resp && resp.ok) await cache.put(key, resp.clone());
  return resp;
}

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const path = url.pathname;

  if (req.mode === 'navigate' || path.endsWith('/index.html')) {
    event.respondWith(networkFirst(req, abs('./'), false));
  } else if (path.endsWith('/drugs.csv')) {
    event.respondWith(networkFirst(req, abs('drugs.csv'), true));
  } else if (path.endsWith('/manifest.webmanifest')) {
    event.respondWith(networkFirst(req, abs('manifest.webmanifest'), false));
  } else {
    event.respondWith(cacheFirst(req));
  }
});
