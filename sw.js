const CACHE_NAME = 'speedometer-v1';

const ASSETS_TO_CACHE = [
  './',
  './100.html',
  './index.html',
  './profile.html',
  './rides.html',
  './script.js',
  './style.css',
  './manifest.json',
  './assets/images/background.png',
  './assets/images/+-gray.png',
  './assets/images/10_icon.png',
  './assets/images/100_icon.png',
  './assets/images/aod_icon.png',
  './assets/images/blue_circle.png',
  './assets/images/delete_button.png',
  './assets/images/export_button.png',
  './assets/images/fullscreen_button.png',
  './assets/images/icon-192.png',
  './assets/images/icon-512.png',
  './assets/images/IMG_2908.JPG',
  './assets/images/import_button.png',
  './assets/images/info.png',
  './assets/images/length.png',
  './assets/images/location_button.png',
  './assets/images/median_speed.png',
  './assets/images/menu_background.png',
  './assets/images/moving_background_v2.mov',
  './assets/images/pause_button.png',
  './assets/images/play_button.png',
  './assets/images/profile_icon.png',
  './assets/images/record_icon.png',
  './assets/images/rides_icon.png',
  './assets/images/rotation_lock.png',
  './assets/images/save_button.png',
  './assets/images/speedometer_icon.png',
  './assets/images/time_logo.png',
  './assets/images/topspeed_background.png',
  './assets/images/topspeed_logo.png'
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});


self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        return caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});