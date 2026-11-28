// Offline shell (petravanta's apps standard, see general/STANDARDS.md): the app opens without a connection.
// Pages come from the network when possible and from this cache otherwise. User data never goes in here; it lives in Google Drive.
const CACHE='fitness-coach-v7';
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
// unless the app is on screen, then post it again every 20 seconds, up to 3 more times, until the app comes back.
// Browsers stop an idle worker after about 30 seconds, so the wait is held open with waitUntil, which Chrome allows for up
// to 5 minutes from the message. Later reminders past that may not come. A message without `at` cancels.
const BUZZ=[600,200,600,200,600,200,1000], REPEAT=20000, REPEATS=3;
const mmss=s=>Math.floor(s/60)+':'+String(Math.floor(s%60)).padStart(2,'0');
let alarm=null;
function cancelAlarm(){if(alarm){clearTimeout(alarm.t);alarm.done();alarm=null}}
async function appOnScreen(){const ws=await self.clients.matchAll({type:'window',includeUncontrolled:true});return ws.some(w=>w.visibilityState==='visible')}
self.addEventListener('message',e=>{
  const m=e.data||{}; if(m.type!=='alarm') return;
  cancelAlarm(); if(!m.at) return;
  e.waitUntil(new Promise(done=>{
    const a=alarm={done,n:0,t:0};
    const fire=async()=>{
      if(alarm!==a) return;
      try{
        if(await appOnScreen()){alarm=null;return done()}
        const over=a.n?' · '+mmss(a.n*REPEAT/1000)+' over':'';
        await self.registration.showNotification((m.title||'Timer done')+over,{body:m.body||'',tag:'fc-timer',renotify:true,
          icon:'icon-192.png',badge:'icon-192.png',requireInteraction:true,silent:!!m.silent,vibrate:m.silent?undefined:BUZZ});
      }catch(err){}
      if(alarm!==a) return;
      if(a.n++<REPEATS) a.t=setTimeout(fire,REPEAT); else {alarm=null;done()}
    };
    a.t=setTimeout(fire,Math.max(0,m.at-Date.now()));
  }));
});
self.addEventListener('notificationclick',e=>{
  e.notification.close();
  e.waitUntil(self.clients.matchAll({type:'window',includeUncontrolled:true}).then(ws=>ws.length?ws[0].focus():self.clients.openWindow('./')));
});
