const CACHE='crypto-plan-cache-v1';
self.addEventListener('install',e=>{e.waitUntil((async()=>{
  const c=await caches.open(CACHE);
  await c.addAll(['./','./index.html','./manifest.json']);
})());self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.map(k=>(k!==CACHE?caches.delete(k):null)));
})());self.clients.claim();});
self.addEventListener('fetch',e=>{
  const req=e.request;
  e.respondWith(caches.match(req).then(cached=>{
    const fetchP=fetch(req).then(res=>{
      if(req.method==='GET' && res && res.status===200 && res.type==='basic'){
        const r=res.clone();
        caches.open(CACHE).then(c=>c.put(req,r));
      }
      return res;
    }).catch(()=>cached);
    return cached||fetchP;
  }));
});



