const CACHE_NAME = 'telukaru-v2';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo-telukaru-id.png',
  '/favicon-16.png',
  '/favicon-32.png',
  '/favicon-192.png',
  '/favicon-512.png',
  '/apple-touch-icon.png',
  '/favicon.ico'
];

self.addEventListener('install', e => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Jangan cache Google, AdSense, dan file eksternal
  if (e.request.url.includes('cdn.tailwindcss') || 
      e.request.url.includes('google') ||
      e.request.url.includes('gstatic') ||
      e.request.url.includes('adsense')) {
    return;
  }

  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Cache gambar & css biar offline tetap