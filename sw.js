/*! Final Assembly — © 2026 Rainwater Games (Jeff Rainwater). All rights reserved. */
// Always-newest: network-first with no-cache; cache is offline fallback only.
const V='0.3.0';const C='final-assembly-v'+V;
const F=['./','index.html','game.js?v='+V,'install.js?v='+V,'manifest.webmanifest','icon-192.png','icon-512.png','fonts/LilitaOne-Regular.ttf'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(F.map(u=>new Request(u,{cache:'no-cache'})))).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{const req=e.request;if(req.method!=='GET')return;const u=new URL(req.url);if(u.origin!==location.origin)return;
 if(/version\.json$/.test(u.pathname)){e.respondWith(fetch(req,{cache:'no-store'}));return;}
 const p=req.mode==='navigate'?fetch(u.href,{cache:'no-cache',credentials:'same-origin'}):fetch(req,{cache:'no-cache'});
 e.respondWith(p.then(res=>{if(res.ok){const cp=res.clone();caches.open(C).then(c=>c.put(req,cp));}return res;})
  .catch(()=>caches.match(req,{ignoreSearch:req.mode==='navigate'}).then(m=>m||caches.match('index.html'))));});
