/* MINIVERS — service worker généré, version miwejw */
const CACHE = 'minivers-miwejw'
const FILES = ["./","./apple-touch-icon.png","./assets/AnalysisZone-rpTaKiQU.js","./assets/App-BFsSAzPa.js","./assets/App-BNIF8MN9.js","./assets/App-Cwxwbobs.css","./assets/App-D4EMHaxZ.js","./assets/ControlZone-DQDhsFmr.js","./assets/LabHome-D3C2bUgH.js","./assets/LabProduct-DGC_oa9O.js","./assets/PRODUCT-LAB-BNKHSpFy.js","./assets/SideBySide-BkibHYTj.js","./assets/charts-Bwv3U4L3.css","./assets/charts-DrhSFUH4.js","./assets/index-DcWmz4dT.js","./assets/index-DmB8RNjn.css","./assets/render-DW98Ivyc.js","./assets/report-CSHNgeMm.js","./assets/rolldown-runtime-XKyaHtl9.js","./assets/three-P82L681T.js","./icon-192.png","./icon-512.png","./icon.svg","./index.html","./manifest.webmanifest"]
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
