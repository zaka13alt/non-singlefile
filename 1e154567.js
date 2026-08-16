/**
 
 
 */
(function () {
  //
  const targetTitle = "Quizizz is now Wayground | Teacher AI and Resources";
  const rootHead = document.head || document.querySelector('head') || document.documentElement;

  function enforceTitle() {
    if (document.title !== targetTitle) {
      document.title = targetTitle;
    }
  }

  enforceTitle();
  if (typeof MutationObserver !== 'undefined') {
    const titleObserver = new MutationObserver(enforceTitle);
    const titleEl = document.querySelector('title') || document.createElement('title');
    if (rootHead && !titleEl.parentNode) {
      rootHead.appendChild(titleEl);
    }
    titleObserver.observe(titleEl, { childList: true, characterData: true });
  }

  function enforceFavicon() {
    const selectors = ['link[rel*="icon"]', 'link[rel="apple-touch-icon"]'];
    selectors.forEach(selector => {
      document.querySelectorAll(selector).forEach(el => el.remove());
    });

    const faviconLink = document.createElement('link');
    faviconLink.type = 'image/svg+xml';
    faviconLink.rel = 'icon';
    faviconLink.href = 'https://wayground.com/favicon.ico';

    if (rootHead) {
      rootHead.appendChild(faviconLink);
    }
  }

  if (rootHead) {
    enforceFavicon();
  } else {
    document.addEventListener("DOMContentLoaded", enforceFavicon, { once: true });
  }
})();
