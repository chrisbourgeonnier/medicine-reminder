const CACHE_NAME = 'medicine-reminder-v1';
const ASSETS = [
  './',
  './index.html',
  './styles.css',
  './script.js',
  './manifest.json'
];

// Install: cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// Fetch: serve from cache when offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

// Notification click: open the app
self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('./'));
});
