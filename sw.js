/* ============================================================
   Service Worker - Bitácora EFE Sur
   Versión 9: siempre busca la versión nueva del HTML y de las pautas
   y conserva una copia para poder seguir usando la app sin señal.
   ============================================================ */

const CACHE = 'bitacora-efe-v9';

// Archivos que componen la aplicación. Todos existen en el repositorio.
const ASSETS = [
  './index.html',
  './manifest.json',
  './icon-512.png',
  './pautas/pautas.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key !== CACHE).map((key) => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const requestUrl = new URL(request.url);

  if (request.method !== 'GET' || requestUrl.origin !== self.location.origin) {
    return;
  }

  // Las pautas diarias cambian todos los días: primero internet, y la copia
  // guardada solo si no hay señal.
  if (requestUrl.pathname.endsWith('/pautas/pautas.json')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Las páginas se consultan primero en internet para recibir las mejoras nuevas.
  // Se pide con cache: reload para saltarse el caché del navegador: si no, GitHub
  // Pages puede seguir entregando la versión anterior hasta diez minutos.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request.url, { cache: 'reload' })
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) =>
            cached || caches.match('./index.html')
          )
        )
    );
    return;
  }

  // Los demás recursos se sirven desde caché y se descargan si aún no existen.
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(request, copy));
        return response;
      });
    })
  );
});
