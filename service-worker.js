const CACHE_NAME = 'gtfs-counter-v4';

const CORE_ASSETS = [
  '/ridecheck/gtfs_counter_app_27c.html',
  '/ridecheck/manifest.json',
  '/ridecheck/icon-192.png',
  '/ridecheck/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const asset of CORE_ASSETS) {
        try {
          await cache.add(asset);
        } catch (e) {
          // Allow install to succeed even if one asset fails
        }
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => (key !== CACHE_NAME ? caches.delete(key) : null))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      caches
        .match('/ridecheck/gtfs_counter_app_27c.html', { ignoreSearch: true })
        .then(response => response || fetch(event.request))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
