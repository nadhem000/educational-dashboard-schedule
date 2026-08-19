// EDSchedule Service Worker – development-friendly caching
const CACHE_NAME = 'edschedule-cache-v6';

// Core assets to pre-cache on install
const CORE_ASSETS = [
  './',
  './index.html',
  './admin.html',
  './manifest.json',
  './assets/icons/icon-94x94.png',
  './assets/icons/icon-192x192.png',
  './assets/icons/icon-512x512.png'
];

// Install event: pre-cache core files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

// Helper: check if a request is for an image
function isImageRequest(request) {
  const url = new URL(request.url);
  const extension = url.pathname.split('.').pop().toLowerCase();
  return ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico'].includes(extension)
      || request.destination === 'image';
}

// Fetch event: cache-first for images, network-first for everything else
self.addEventListener('fetch', event => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // --- Cache-first for images ---
  if (isImageRequest(request)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;

        return fetch(request).then(response => {
          // Cache a copy if successful and same-origin
          if (response.status === 200 && (response.type === 'basic' || response.type === 'cors')) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
          }
          return response;
        });
      })
    );
    return;
  }

  // --- Network-first for everything else (HTML, CSS, JS, JSON, etc.) ---
  event.respondWith(
    fetch(request)
      .then(response => {
        // Cache successful same-origin responses
        if (response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => {
        // If network fails, try the cache
        return caches.match(request).then(cached => {
          if (cached) return cached;
          // If it's a navigation request, fall back to the cached index.html
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          // Otherwise, nothing we can do
          return new Response('Network error', { status: 503 });
        });
      })
  );
});
/* - **Version bump:** I changed `CACHE_NAME` to `'edschedule-cache-v2'` because the caching strategy changed. This will force the old cache to be deleted on activation.
- **Image caching:** The `isImageRequest` function checks both the file extension and the `request.destination`. That covers most cases.
- **Development workflow:** Because HTML, CSS, and JavaScript are network-first, you’ll always see the latest version when online. If you make changes, simply refresh the page (or the service worker will update automatically in the background).
- **Offline fallback:** If the network is unavailable and a non-image request isn’t cached, the service worker will try to serve the cached `index.html` for navigation requests. */