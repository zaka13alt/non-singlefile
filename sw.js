
self.addEventListener("fetch", (e) => {
  const urlObj = new URL(e.request.url);
  const pathname = urlObj.pathname;
  
  // Match any variation of WASM binary requests or framework query parameters
  if (pathname.endsWith(".wasm") || pathname.endsWith(".wasm.js") || urlObj.search.includes(".wasm")) {
    
    // 
    e.stopImmediatePropagation(); 
    
    // 
    e.respondWith(
      fetch(e.request)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`err code ${response.status}`);
          }
          
          //
          const contentType = response.headers.get("content-type") || "";
          if (contentType.includes("text/html")) {
            throw new Error("err");
          }
          
          return response;
        })
        .catch((err) => {
          console.error("err", err.message);
          // 
          //
          return new Response(null, { 
            status: 404, 
            statusText: "WASM Asset Not Found" 
          });
        })
    );
  }
}, { capture: true }); // 


importScripts("./educationlaunch.js");

self.$Education = self.$Education || self.$educationlaunch || {};
const safeClients = (self && self.clients) || { claim: function() { return Promise.resolve(); }, matchAll: function() { return Promise.resolve([]); } };

// 
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


self.addEventListener("fetch", (e) => {
  if (self.$Education && self.$Education.shouldRoute) {
    if (self.$Education.shouldRoute(e)) {
      e.respondWith(self.$Education.route(e));
    }
  }
});
