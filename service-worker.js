self.addEventListener("install", (e) => {
  console.log("ZTERA SW Installed");
  e.waitUntil(
    caches.open("ztera-cache").then((cache) => {
      return cache.addAll(["/"]);
    })
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
