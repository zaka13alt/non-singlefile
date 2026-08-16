// green-cursor.js
(function () {
  var defaultCursor = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2300E676%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolygon%20points%3D%225%203%2019%2012%2012%2014%209%2021%205%203%22%3E%3C/polygon%3E%3C/svg%3E";
  var pointerCursor = "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2232%22%20height%3D%2232%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%2300E676%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22M18%2013v6a2%202%200%200%201-2%202H5a2%202%200%200%201-2-2V8a2%202%200%200%201%202-2h6%22%3E%3C/path%3E%3Cpolyline%20points%3D%2215%203%2021%203%2021%209%22%3E%3C/polyline%3E%3Cline%20x1%3D%2210%22%20y1%3D%2214%22%20x2%3D%2221%22%20y2%3D%223%22%3E%3C/line%3E%3C/svg%3E";

  var cssStyle = "* { cursor: url(\"" + defaultCursor + "\") 4 4, auto !important; } " +
                 "a, button, [role=\"button\"], input[type=\"submit\"], input[type=\"button\"], select, textarea { cursor: url(\"" + pointerCursor + "\") 4 4, pointer !important; }";

  function injectStyles(targetDocument) {
    try {
      if (!targetDocument) return;
      var existing = targetDocument.getElementById('custom-green-cursor-style');
      if (existing) return; // Already injected successfully
      
      var style = targetDocument.createElement('style');
      style.id = 'custom-green-cursor-style';
      style.type = 'text/css';
      style.innerHTML = cssStyle;
      (targetDocument.head || targetDocument.documentElement).appendChild(style);
    } catch (e) {}
  }

  function checkAndTargetIframes() {
    var iframes = document.querySelectorAll('iframe');
    for (var i = 0; i < iframes.length; i++) {
      try {
        var iframeDoc = iframes[i].contentDocument || iframes[i].contentWindow.document;
        if (iframeDoc) {
          injectStyles(iframeDoc);
          
          // Re-bind listener if it hasn't been set up yet
          if (!iframes[i].getAttribute('data-cursor-listened')) {
            iframes[i].setAttribute('data-cursor-listened', 'true');
            iframes[i].addEventListener('load', function () {
              try {
                var doc = this.contentDocument || this.contentWindow.document;
                injectStyles(doc);
              } catch(err){}
            });
          }
        }
      } catch (e) {}
    }
  }

  function initCursor() {
    // 1. Core global injection
    injectStyles(document);
    checkAndTargetIframes();

    // 2. Continuous enforcement during user activity
    window.addEventListener('mousemove', checkAndTargetIframes, { passive: true });
    window.addEventListener('mouseover', checkAndTargetIframes, { passive: true });

    // 3. Monitor DOM adjustments (e.g. AJAX or frame updates)
    if (typeof MutationObserver !== 'undefined') {
      var observer = new MutationObserver(checkAndTargetIframes);
      observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
  } else {
    initCursor();
  }
})();
