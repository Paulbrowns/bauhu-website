(() => {
  if (!location.pathname.startsWith('/site-placement/')) return;

  function init() {
    const page = document.querySelector('.placement-page');
    const map = document.getElementById('placement-map');
    const rotation = document.getElementById('rotation');
    if (!page || !map || !rotation || document.getElementById('bauhu-footprint-overlay')) return;

    const width = Number(page.dataset.width);
    const depth = Number(page.dataset.depth);
    const ratio = Number.isFinite(width) && Number.isFinite(depth) && depth > 0 ? width / depth : 1.25;
    const longSide = 132;
    const footprintWidth = ratio >= 1 ? longSide : longSide * ratio;
    const footprintHeight = ratio >= 1 ? longSide / ratio : longSide;

    const footprint = document.createElement('div');
    footprint.id = 'bauhu-footprint-overlay';
    footprint.setAttribute('aria-label', 'Indicative house footprint');
    footprint.innerHTML = '<span>Indicative house footprint</span>';
    footprint.style.width = `${Math.max(72, footprintWidth)}px`;
    footprint.style.height = `${Math.max(58, footprintHeight)}px`;
    map.appendChild(footprint);

    const style = document.createElement('style');
    style.textContent = `
      #placement-map { position: relative; }
      #bauhu-footprint-overlay {
        position: absolute;
        z-index: 850;
        box-sizing: border-box;
        border: 4px solid #c5a66a;
        background: rgba(23,57,76,.58);
        box-shadow: 0 8px 22px rgba(23,57,76,.24);
        pointer-events: none;
        transform-origin: center;
        display: grid;
        place-items: center;
      }
      #bauhu-footprint-overlay span {
        max-width: 90%;
        padding: .35rem .45rem;
        background: rgba(23,57,76,.92);
        color: #fff;
        text-align: center;
        font: 700 9px/1.25 Inter,sans-serif;
        letter-spacing: .06em;
        text-transform: uppercase;
      }
    `;
    document.head.appendChild(style);

    function markerCentre() {
      const candidates = Array.from(map.querySelectorAll('.leaflet-marker-icon'));
      const marker = candidates.find((node) => node.classList.contains('leaflet-marker-draggable')) || candidates[0];
      if (!marker) return null;
      const markerRect = marker.getBoundingClientRect();
      const mapRect = map.getBoundingClientRect();
      return {
        x: markerRect.left - mapRect.left + markerRect.width / 2,
        y: markerRect.top - mapRect.top + markerRect.height / 2
      };
    }

    function render() {
      const centre = markerCentre();
      if (centre) {
        const angle = Number(rotation.value || 0);
        footprint.style.left = `${centre.x}px`;
        footprint.style.top = `${centre.y}px`;
        footprint.style.transform = `translate(-50%, -50%) rotate(${angle}deg)`;
        footprint.hidden = false;
      } else {
        footprint.hidden = true;
      }
      requestAnimationFrame(render);
    }

    requestAnimationFrame(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
