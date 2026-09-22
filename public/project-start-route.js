(() => {
  function captureAttribution() {
    try {
      if (localStorage.getItem('bauhuAttribution')) return;
      const params = new URLSearchParams(location.search);
      const attribution = {
        landingPage: location.pathname + location.search,
        referrer: document.referrer || '',
        utmSource: params.get('utm_source') || '',
        utmMedium: params.get('utm_medium') || '',
        utmCampaign: params.get('utm_campaign') || '',
        utmContent: params.get('utm_content') || '',
        utmTerm: params.get('utm_term') || '',
        capturedAt: new Date().toISOString()
      };
      localStorage.setItem('bauhuAttribution', JSON.stringify(attribution));
    } catch {}
  }

  function normalizeProjectStartLinks() {
    const path = window.location.pathname.replace(/\/$/, '') || '/';
    if (path === '/site-fit') return;

    document.querySelectorAll('a[href]').forEach((link) => {
      try {
        const url = new URL(link.getAttribute('href'), window.location.origin);
        if (url.origin === window.location.origin && url.pathname === '/start-your-project') {
          link.setAttribute('href', '/site-fit');
        }
      } catch {}
    });
  }

  const init = () => {
    captureAttribution();
    normalizeProjectStartLinks();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();