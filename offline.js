// Service Worker Registration for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(reg => console.log('Service Worker registered', reg))
      .catch(err => console.log('Service Worker registration failed', err));
  });
}

// Cache critical assets for offline use
const CACHE_NAME = 'smartagro-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/main.js',
  '/js/camera.js',
  '/js/offline.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Create service worker file dynamically (for demo)
if (typeof window !== 'undefined') {
  fetch('/sw.js')
    .then(response => {
      if (!response.ok) {
        // Fallback: Create minimal service worker
        const swContent = `
          const CACHE_NAME = 'smartagro-v1';
          const urlsToCache = ${JSON.stringify(urlsToCache)};
          
          self.addEventListener('install', event => {
            event.waitUntil(
              caches.open(CACHE_NAME)
                .then(cache => cache.addAll(urlsToCache))
                .then(() => self.skipWaiting())
            );
          });
          
          self.addEventListener('fetch', event => {
            event.respondWith(
              caches.match(event.request)
                .then(response => response || fetch(event.request))
                .catch(() => {
                  if (event.request.mode === 'navigate') {
                    return caches.match('/');
                  }
                })
            );
          });
          
          self.addEventListener('activate', event => {
            event.waitUntil(
              caches.keys().then(cacheNames => {
                return Promise.all(
                  cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) return caches.delete(cache);
                  })
                );
              })
            );
          });
        `;
        
        // In production: Save this to /sw.js on server
        console.log('Service worker content generated (save to /sw.js):', swContent);
      }
    });
}