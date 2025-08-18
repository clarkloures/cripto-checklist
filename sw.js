// Cache simples para funcionar offline
const CACHE = 'crypto-plan-cache-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE);
      // cacheia a própria página atual
      await cache.addAll(['./', './index.html']);
    })()
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(k => (k !== CACHE ? caches.delete(k) : null)));
    })()
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(cached => {
      // Cache-first; tenta rede de fallback
      const fetchPromise = fetch(req).then(res => {
        // só cacheia GETs básicos
        if (req.method === 'GET' && res && res.status === 200 && res.type === 'basic') {
          const resClone = res.clone();
          caches.open(CACHE).then(cache => cache.put(req, resClone));
        }
        return res;
      }).catch(() => cached);
      return cached || fetchPromise;
    })
  );
});
