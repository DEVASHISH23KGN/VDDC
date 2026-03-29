const CACHE_NAME = "dose-app-v1";

const urlsToCache = [
  "index.html",
  "login.html",
  "style.css",
  "script.js",
  "drug_data.csv"
];

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("fetch", event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        const responseClone = response.clone();
        caches.open("dose-app-dynamic").then(cache => {
          cache.put(event.request, responseClone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
