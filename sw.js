// Offline shell (petravanta's apps standard, see general/STANDARDS.md): the app opens without a connection.
// Pages come from the network when possible and from this cache otherwise. User data never goes in here; it lives in Google Drive.
const CACHE='fitness-coach-v5';
const SHELL=['./','index.html','manifest.webmanifest','icon.svg','data/exercises.json','data/sports.json','data/equipment.json','data/figures.json','data/routines.json','icon-192.png','apple-touch-icon.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin) return;
  e.respondWith(fetch(e.request).then(r=>{if(r.ok){const c=r.clone();caches.open(CACHE).then(x=>x.put(e.request,c))}return r})
    .catch(()=>caches.match(e.request).then(r=>r||caches.match('index.html'))));
});

// Lock-screen alarm for the rest and hold timers. The page sends the timer's end time; at that time we post a notification
// unless the app is on screen. Browsers stop an idle worker after about 30 seconds, so the wait is held open with waitUntil,
// which Chrome allows for up to 5 minutes. A rest longer than that may not alert. A message without `at` cancels.
let alarm=null;
function cancelAlarm(){if(alarm){clearTimeout(alarm.t);alarm.done();alarm=null}}
self.addEventListener('message',e=>{
  const m=e.data||{}; if(m.type!=='alarm') return;
  cancelAlarm(); if(!m.at) return;
  e.waitUntil(new Promise(done=>{alarm={done,t:setTimeout(async()=>{alarm=null;
    try{
      const wins=await self.clients.matchAll({type:'window',includeUncontrolled:true});
      if(!wins.some(w=>w.visibilityState==='visible')) await self.registration.showNotification(m.title||'Timer done',{body:m.body||'',tag:'fc-timer',
        icon:'icon-192.png',badge:'icon-192.png',requireInteraction:true,silent:!!m.silent,vibrate:m.silent?undefined:[300,120,300,120,300]});
    }catch(err){}
    done()},Math.max(0,m.at-Date.now()))}}));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>ws.length?ws[0].focus():self.clients.openWindow('./')));
});
