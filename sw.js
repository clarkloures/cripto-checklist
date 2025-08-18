const CACHE_NAME = 'orbelab-cache-v1';
const urlsToCache = [
  '/cripto-checklist/',
  '/cripto-checklist/index.html',
  '/cripto-checklist/style.css',  // se você separar CSS
  '/cripto-checklist/icons/icon-192.png',
  '/cripto-checklist/icons/icon-512.png'
];

// Instala o SW e adiciona arquivos ao cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Ativa o SW e remove caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
            .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Intercepta requests e responde do cache ou fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request)
        .then(fetchRes => {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, fetchRes.clone());
            return fetchRes;
          });
        })
        .catch(() => {
          // fallback offline se precisar, ex: uma página offline
          return caches.match('/cripto-checklist/index.html');
        });
    })
  );
});
