/* ============================================================
   Service Worker - Bitácora EFE Sur
   Estrategia: "cache-first" para el app-shell (funciona offline).
   Sube el número de versión (CACHE) cada vez que cambies el HTML
   para forzar la actualización en los teléfonos ya instalados.
   ============================================================ */

const CACHE = 'bitacora-efe-v1';

// Archivos que componen la app (el "app-shell").
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png',
  './icon-180.png'
];

// 1) Instalación: se descargan y guardan los archivos en caché.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // activa la nueva versión de inmediato
});

// 2) Activación: borra cachés viejas de versiones anteriores.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 3) Fetch: responde desde caché; si no está, va a la red y la guarda.
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Solo gestionamos peticiones GET del mismo origen (la app).
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) {
    return; // wa.me, enlaces externos, etc. pasan directo a la red.
  }

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached; // offline: servimos lo cacheado
      return fetch(req)
        .then((resp) => {
          // Guardamos una copia para la próxima vez.
          const copy = resp.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
          return resp;
        })
        .catch(() => caches.match('./index.html')); // fallback offline
    })
  );
});
