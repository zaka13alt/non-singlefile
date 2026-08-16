importScripts("./educationlaunch.js");

self.$Education = self.$Education || self.$educationlaunch || {};
const safeClients = (self && self.clients) || { claim: function() { return Promise.resolve(); }, matchAll: function() { return Promise.resolve([]); } };

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(safeClients && safeClients.claim ? safeClients.claim() : Promise.resolve()));

// Override the shouldRoute to exclude WASM files
var originalShouldRoute = self.$Education.shouldRoute;
if (originalShouldRoute) {
  self.$Education.shouldRoute = function(event) {
    var url = new URL(event.request.url);
    var pathname = url.pathname;
    // Never route WASM files through the Education proxy
    if (pathname.endsWith(".wasm") || pathname.endsWith(".wasm.js") || pathname.includes("/scj/scj.")) {
      return false;
    }
    return originalShouldRoute.call(this, event);
  };
}

addEventListener("fetch", (e) => {
  var url = e.request.url;
  var pathname = new URL(url).pathname;
  
  // Explicitly never route WASM through Education proxy
  if (pathname.endsWith(".wasm") || pathname.endsWith(".wasm.js")) {
    return; // Don't intercept, let it fetch from network
  }
  
  if (self.$Education && self.$Education.shouldRoute) {
    if (self.$Education.shouldRoute(e)) {
      e.respondWith(self.$Education.route(e));
    }
  }
});
