/* sw.js — Service Worker simple para cacheo básico */
const CACHE_NAME = 'cv-julian-cache-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/styles.css',
  '/js/app.js',
  '/assets/img/foto_perfil.jpg',
  '/assets/img/banner.jpg',
  '/assets/docs/CV_Julian_Gutierrez_Baquero.pdf'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => resp || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  const keep = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => keep.includes(k) ? null : caches.delete(k))))
  );
});

