(() => {
  if (!location.pathname.startsWith('/site-placement/')) return;

  function init() {
    const button = document.getElementById('confirm-placement');
    if (!button) return;

    const slug = location.pathname.split('/').filter(Boolean).pop();
    if (!slug) return;

    button.textContent = 'Explore this house in 3D';
    button.disabled = false;

    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
      const destination = new URL(`/model-viewer/${slug}`, location.origin);
      destination.search = location.search;
      location.assign(destination.toString());
    }, true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
