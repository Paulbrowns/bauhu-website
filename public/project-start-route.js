(() => {
  function normalizeProjectStartLinks() {
    const path = window.location.pathname.replace(/\/$/, '') || '/';

    // These pages intentionally use /start-your-project as the skip/final-details step.
    if (path === '/site-fit' || path === '/site-summary') return;

    document.querySelectorAll('a[href]').forEach((link) => {
      try {
        const url = new URL(link.getAttribute('href'), window.location.origin);
        if (url.origin === window.location.origin && url.pathname === '/start-your-project') {
          link.setAttribute('href', '/site-fit');
        }
      } catch {
        // Ignore malformed or non-standard links.
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', normalizeProjectStartLinks, { once: true });
  } else {
    normalizeProjectStartLinks();
  }
})();
