const CACHE='OrbeLab-cache-v1';
self.addEventListener('install',e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(CACHE);
    await c.addAll([
      '/OrbeLab/',
      '/OrbeLab/index.html',
      '/OrbeLab/manifest.json'
    ]);
  })());
  self.skipWaiting();
});

self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.map(k=>(k!==CACHE?caches.delete(k):null)));
  })());
  self.clients.claim();
});

self.addEventListener('fetch',e=>{
  e.respondWith(caches.match(e.request).then(cached=>{
    const fetchP=fetch(e.request).then(res=>{
      if(e.request.method==='GET' && res && res.status===200 && res.type==='basic'){
        caches.open(CACHE).then(c=>c.put(e.request,res.clone()));
      }
      return res;
    }).catch(()=>cached);
    return cached||fetchP;
  }));
});




