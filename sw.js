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
  
  // Handle WASM files explicitly to prevent 404/HTML errors breaking WebAssembly compilation
  if (pathname.endsWith(".wasm")) {
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          // If the network request failed (404, 500, etc.)
          if (!response.ok) {
            throw new Error(`WASM fetch failed with status: ${response.status}`);
          }
          
          // Check the Content-Type header
          var contentType = response.headers.get("content-type") || "";
          
          // If the server returned HTML (common for 404 fallbacks) instead of real binary data
          if (contentType.includes("text/html")) {
            throw new Error("WASM request returned an HTML page instead of binary data.");
          }
          
          return response;
        })
        .catch((err) => {
          console.error("[SW WASM Error]:", err);
          // Return a structured 404 error response so the app knows it failed early,
          // rather than passing empty/corrupted data to WebAssembly.instantiate()
          return new Response(new ArrayBuffer(0), {
            status: 404,
            statusText: "Not Found",
            headers: { "Content-Type": "application/wasm" }
          });
        })
    );
    return;
  }

  // Let .wasm.js bypass the proxy via network
  if (pathname.endsWith(".wasm.js")) {
    return; 
  }
  
  if (self.$Education && self.$Education.shouldRoute) {
    if (self.$Education.shouldRoute(e)) {
      e.respondWith(self.$Education.route(e));
    }
  }
});
