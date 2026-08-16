// 1. STRIP AND ISOLATE WASM AT THE ABSOLUTE ENTRY POINT
addEventListener("fetch", (e) => {
  var urlObj = new URL(e.request.url);
  var pathname = urlObj.pathname;
  
  if (pathname.endsWith(".wasm") || pathname.endsWith(".wasm.js") || urlObj.search.includes(".wasm")) {
    // Stop all other proxy listeners (like educationlaunch internal scripts) from handling this event
    e.stopImmediatePropagation(); 
    
    // 
    e.respondWith(fetch(e.request));
    return;
  }
});

//
importScripts("./educationlaunch.js");

self.$Education = self.$Education || self.$educationlaunch || {};
const safeClients = (self && self.clients) || { claim: function() { return Promise.resolve(); }, matchAll: function() { return Promise.resolve([]); } };

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(safeClients && safeClients.claim ? safeClients.claim() : Promise.resolve()));

// 
var originalShouldRoute = self.$Education.shouldRoute;
if (originalShouldRoute) {
  self.$Education.shouldRoute = function(event) {
    var url = new URL(event.request.url);
    var pathname = url.pathname;
    if (pathname.endsWith(".wasm") || pathname.endsWith(".wasm.js") || pathname.includes("/scj/scj.") || url.search.includes(".wasm")) {
      return false;
    }
    return originalShouldRoute.call(this, event);
  };
}

// 
addEventListener("fetch", (e) => {
  if (self.$Education && self.$Education.shouldRoute) {
    if (self.$Education.shouldRoute(e)) {
      e.respondWith(self.$Education.route(e));
    }
  }
});
