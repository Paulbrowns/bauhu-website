(() => {
  if (!location.pathname.startsWith('/site-fit/')) return;

  function removePlacementArtifacts() {
    document.getElementById('model-card')?.remove();
    document.querySelectorAll('.model-map-label').forEach((node) => node.remove());

    document.querySelectorAll('#property-map .leaflet-overlay-pane path').forEach((path) => {
      const fill = getComputedStyle(path).fill.replace(/\s+/g, '');
      const stroke = getComputedStyle(path).stroke.replace(/\s+/g, '');
      const isModelColour = fill === 'rgb(23,57,76)' || stroke === 'rgb(23,57,76)';
      const fillOpacity = Number(path.getAttribute('fill-opacity') || getComputedStyle(path).fillOpacity || 0);
      if (isModelColour && fillOpacity >= 0.4) path.remove();
    });
  }

  function init() {
    removePlacementArtifacts();

    ['confirm-location', 'find-parcel', 'draw-boundary', 'confirm-parcel'].forEach((id) => {
      document.getElementById(id)?.addEventListener('click', () => {
        requestAnimationFrame(removePlacementArtifacts);
        setTimeout(removePlacementArtifacts, 50);
        setTimeout(removePlacementArtifacts, 250);
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
