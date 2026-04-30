const CACHE = 'choose-v3';
const ASSETS = [
  '/Choose/',
  '/Choose/index.html',
  '/Choose/manifest.json',
  '/Choose/icons/icon-192.png',
  '/Choose/icons/icon-512.png',
  '/Choose/icons/apple-touch-icon.png',
  '/Choose/icons/favicon-32.png',
  '/Choose/icons/favicon-16.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c =>
      Promise.allSettled(ASSETS.map(a => c.add(a).catch(() => {})))
    )
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(ks =>
      Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if (!e.request.url.includes('/Choose/')) return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(r => {
        if (e.request.method === 'GET' && r.status === 200) {
          const cl = r.clone();
          caches.open(CACHE).then(c => c.put(e.request, cl));
        }
        return r;
      }).catch(() => caches.match('/Choose/index.html'));
    })
  );
});
