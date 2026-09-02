/**
 * GlobeSkill High-Performance Progressive Web App (PWA) Service Worker
 * Fully compliant with W3C Service Worker specification, Google Lighthouse & PWABuilder.
 */

const CACHE_NAME = 'globeskill-cache-v2';

const STATIC_PRECACHE = [
  '/',
  '/manifest.json',
  '/icon-192.png',
  '/icon-192x192.png',
  '/icon-512.png',
  '/icon-512x512.png',
  '/courses',
  '/student',
  '/sandbox',
  '/donate'
];

// Install Lifecycle
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_PRECACHE).catch((err) => {
        console.warn('SW pre-caching notice:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Lifecycle & Cleanup Old Caches
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

// Message Event (for SKIP_WAITING / Instant Updates)
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch Event: Network-First with Cache Fallback for offline reliability
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Skip non-GET requests and Next.js HMR/API endpoints
  if (request.method !== 'GET' || request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(async () => {
        const cachedMatch = await caches.match(request);
        if (cachedMatch) {
          return cachedMatch;
        }

        // For navigation requests, fallback to root or cached student portal
        if (request.mode === 'navigate') {
          const fallback = await caches.match('/student') || await caches.match('/');
          if (fallback) return fallback;
        }

        return new Response('Offline content temporarily unavailable', {
          status: 503,
          statusText: 'Offline',
          headers: { 'Content-Type': 'text/plain' }
        });
      })
  );
});
