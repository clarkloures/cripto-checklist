const CACHE_NAME = 'orbelab-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/style.css', // caso você mova CSS externo
  // você pode adicionar outros arquivos estáticos importantes
];

// Instalando Service Worker e cache inicial
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Ativando o Service Worker e limpando caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

// Interceptando requisições
self.addEventListener('fetch', event => {
  // Tentativa de buscar online primeiro, senão retorna do cache
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clona a resposta para salvar no cache
        const resClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, resClone));
        return response;
      })
      .catch(() => caches.match(event.request).then(res => res))
  );
});
