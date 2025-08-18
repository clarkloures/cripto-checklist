const CACHE_NAME = "orbelab-cache-v1";
const ASSETS = [
  "/", 
  "/index.html",
  "/manifest.json",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

// Instala o service worker e faz cache dos arquivos essenciais
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// Ativa o SW e remove caches antigos
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
});

// Intercepta requisições para funcionar offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).catch(() =>
          // Fallback: caso queira exibir algo offline
          new Response("Você está offline. Conteúdo não disponível.", {
            headers: { "Content-Type": "text/plain" }
          })
        )
      );
    })
  );
});
