/* MINIVERS — service worker généré, version 24k9kc */
const CACHE = 'minivers-24k9kc'
const FILES = ["./","./apple-touch-icon.png","./assets/index-BclhptN4.js","./assets/index-Ryypa1WG.css","./assets/render-Dz5nk5as.js","./assets/three-Db0s_oXR.js","./icon-192.png","./icon-512.png","./icon.svg","./index.html","./manifest.webmanifest"]
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
