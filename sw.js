const CACHE_NAME = "dose-app-v1";

const urlsToCache = [
  "index.html",
  "login.html",
  "style.css",
  "script.js",
  "drug_data.csv"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});