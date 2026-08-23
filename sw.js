// EDSchedule Service Worker – development-friendly caching
// Version bumped to v4 to clear old cache that might contain Supabase responses
const CACHE_NAME = 'edschedule-cache-v35';

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

// Helper: check if the request is to Supabase (should not be cached)
function isSupabaseRequest(request) {
  const url = new URL(request.url);
  return url.hostname.includes('supabase.co');
}

// Fetch event: network-first for HTML/CSS/JS, cache-first for images,
// and no caching for Supabase API requests.
self.addEventListener('fetch', event => {
  const { request } = event;

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // --- Supabase requests: always network, never cache ---
  if (isSupabaseRequest(request)) {
    event.respondWith(
      fetch(request).catch(() => {
        // If network fails for Supabase, return a simple error response
        return new Response('Network error – unable to reach Supabase', { status: 503 });
      })
    );
    return;
  }

  // --- Cache-first for images ---
  if (isImageRequest(request)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;

        return fetch(request).then(response => {
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
        if (response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, responseClone));
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then(cached => {
          if (cached) return cached;
          if (request.mode === 'navigate') {
            return caches.match('./index.html');
          }
          return new Response('Network error', { status: 503 });
        });
      })
  );
});
// Handle push notifications
self.addEventListener('push', event => {
    let payload = { title: 'New Notification', body: 'You have a new message.' };

    try {
        if (event.data) {
            const data = event.data.json();
            payload = {
                title: data.title || payload.title,
                body: data.body || payload.body,
                icon: data.icon || './assets/icons/icon-192x192.png',
                badge: './assets/icons/icon-94x94.png',
                data: data.url || './index.html'
            };
        }
    } catch (err) {
        console.warn('[SW] Push payload parse error', err);
    }

    event.waitUntil(
        self.registration.showNotification(payload.title, {
            body: payload.body,
            icon: payload.icon,
            badge: payload.badge,
            data: payload.data
        })
    );
});
self.addEventListener('notificationclick', event => {
    event.notification.close();
    const urlToOpen = event.notification.data || './index.html';
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true })
            .then(windowClients => {
                for (const client of windowClients) {
                    if ('focus' in client) {
                        return client.focus();
                    }
                }
                if (clients.openWindow) {
                    return clients.openWindow(urlToOpen);
                }
            })
    );
});