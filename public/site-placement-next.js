(() => {
  if (!location.pathname.startsWith('/site-placement/')) return;

  function init() {
    const button = document.getElementById('confirm-placement');
    const centre = document.getElementById('house-centre');
    const rotation = document.getElementById('rotation');
    if (!button) return;

    const slug = location.pathname.split('/').filter(Boolean).pop();
    if (!slug) return;

    button.textContent = 'Use this placement and continue';
    button.disabled = false;

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      const destination = new URL('/project-contact', location.origin);
      const params = new URLSearchParams(location.search);
      const coordinateText = centre?.textContent || '';
      const match = coordinateText.match(/(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/);

      if (match) {
        params.set('lat', match[1]);
        params.set('lng', match[2]);
      }

      params.set('rotation', String(Number(rotation?.value || 0)));
      params.set('placement', 'confirmed');
      params.set('model', slug);
      destination.search = params.toString();
      location.assign(destination.toString());
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();