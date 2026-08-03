// ==========================================
// 💰 Monetag Push Notification Configuration
// ==========================================
self.options = {
    "domain": "3nbf4.com",
    "zoneId": 11261219
};
self.lary = "";
importScripts('https://3nbf4.com/act/files/service-worker.min.js?r=sw');

// ==========================================
// ⚡ PWA Super Fast Caching Logic
// ==========================================
const CACHE_NAME = 'ztera-fast-cache-v1';
const ASSETS_TO_CACHE = [
    '/',              // Main HTML page (Root)
    '/icon.png',      // App Icon
    '/manifest.json'  // PWA Manifest
];

// Install Event: Pehli baar load par assets ko cache karega
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting(); // Force new SW to activate immediately
});

// Activate Event: Purane cache ko clean karega
self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    clients.claim(); // Instant control over all pages
});

// Fetch Event: Cache First Strategy
self.addEventListener("fetch", (event) => {
    // 💡 Fix: Sirf GET requests ko cache karein (Ad/API requests par SW crash hone se bachata hai)
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Agar cache mein hai, toh instantly return karo
            if (cachedResponse) {
                return cachedResponse;
            }
            
            // Agar cache mein nahi hai, toh network se fetch karo aur future ke liye cache karo
            return fetch(event.request).then((networkResponse) => {
                // Sirf same-origin successful responses (status 200) ko cache karein
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            });
        })
    );
});
