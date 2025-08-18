const CACHE_NAME = 'OrbeLab-cache-v1';
const urlsToCache = [
  '/OrbeLab/',
  '/OrbeLab/index.html',
  '/OrbeLab/manifest.json',
  '/OrbeLab/sw.js',
  // coloque aqui os caminhos dos ícones
  '/OrbeLab/icon-192.png',
  '/OrbeLab/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keyList =>
      Promise.all(
        keyList.map(key => {
          if (!cacheWhitelist.includes(key)) {
            return caches.delete(key);
          }
        })
      )
    )
  );
});






