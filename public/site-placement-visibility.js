(() => {
  if (!location.pathname.startsWith('/site-placement/')) return;

  const style = document.createElement('style');
  style.textContent = `
    .placement-page .leaflet-map-pane { z-index: 2; }
    .placement-page .leaflet-tile-pane { z-index: 200; }
    .placement-page .leaflet-overlay-pane { z-index: 450 !important; }
    .placement-page .leaflet-marker-pane { z-index: 600 !important; }
    .placement-page .leaflet-tooltip-pane { z-index: 650 !important; }
    .placement-page .leaflet-overlay-pane svg,
    .placement-page .leaflet-overlay-pane path {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
      pointer-events: auto;
    }
    .placement-page .leaflet-overlay-pane path {
      stroke: #c5a66a !important;
      stroke-width: 4 !important;
      fill: #17394c !important;
      fill-opacity: .58 !important;
    }
    .placement-page .placement-label {
      display: block !important;
      visibility: visible !important;
      opacity: 1 !important;
    }
  `;
  document.head.appendChild(style);

  function refreshVectorLayers() {
    document.querySelectorAll('.placement-page .leaflet-overlay-pane path').forEach((path) => {
      path.style.display = 'block';
      path.style.visibility = 'visible';
      path.style.opacity = '1';
      path.setAttribute('stroke', '#c5a66a');
      path.setAttribute('stroke-width', '4');
      path.setAttribute('fill', '#17394c');
      path.setAttribute('fill-opacity', '0.58');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      requestAnimationFrame(refreshVectorLayers);
      setTimeout(refreshVectorLayers, 250);
      setTimeout(refreshVectorLayers, 1000);
    }, { once: true });
  } else {
    requestAnimationFrame(refreshVectorLayers);
    setTimeout(refreshVectorLayers, 250);
    setTimeout(refreshVectorLayers, 1000);
  }
})();
