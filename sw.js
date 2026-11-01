/* MINIVERS — service worker généré, version 77yuyj */
const CACHE = 'minivers-77yuyj'
const FILES = ["./","./apple-touch-icon.png","./assets/AnalysisZone-MaBnNOKQ.js","./assets/App-Cq2oXZZ0.js","./assets/App-Cwxwbobs.css","./assets/App-SwGH5gmp.js","./assets/ControlZone-DekGUxey.js","./assets/LabHome-BHMBFTOB.js","./assets/LabProduct-DRSRSyp4.js","./assets/PRODUCT-LAB-CLYg83JR.js","./assets/SideBySide-CMo3HWCk.js","./assets/charts-BXqgSBY9.js","./assets/charts-BsqJrU5X.css","./assets/index-DfNlM2zz.css","./assets/index-OGls_LNZ.js","./assets/render-DLhy3w0k.js","./assets/report-Wr-KDAtt.js","./assets/rolldown-runtime-XKyaHtl9.js","./assets/three-P82L681T.js","./assets/useLab-B4HmD9T7.js","./icon-192.png","./icon-512.png","./icon.svg","./index.html","./manifest.webmanifest"]
const ENTRY = './index.html'
// ignoreVary : certains serveurs répondent « Vary: Origin », ce qui ferait manquer le cache pour les scripts de module (requêtes avec en-tête Origin)
const MATCH = { ignoreVary: true }

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(FILES.map((f) => new Request(f, { cache: 'reload' })))).then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k.startsWith('minivers-') && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return

  // page d'entrée : réseau d'abord (toujours à jour), cache si hors ligne
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone()
        caches.open(CACHE).then((c) => c.put(ENTRY, copy))
        return res
      }).catch(() => caches.match(ENTRY, MATCH).then((r) => r || caches.match('./', MATCH))),
    )
    return
  }

  // fichiers statiques : cache d'abord, réseau sinon (et mise en cache)
  event.respondWith(
    caches.match(req, MATCH).then((hit) => hit || fetch(req).then((res) => {
      if (res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)) }
      return res
    })),
  )
})
