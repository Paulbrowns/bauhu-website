(() => {
  if (!location.pathname.startsWith('/site-placement/')) return;

  function init() {
    const page = document.querySelector('.placement-page');
    const map = document.getElementById('placement-map');
    const rotation = document.getElementById('rotation');
    if (!page || !map || !rotation || document.getElementById('bauhu-footprint-overlay')) return;

    const totalWidth = Number(page.dataset.width);
    const totalDepth = Number(page.dataset.depth);

    const storeysRow = Array.from(document.querySelectorAll('.placement-controls dl div')).find((row) =>
      row.querySelector('dt')?.textContent?.trim().toLowerCase() === 'storeys'
    );
    const parsedStoreys = Number.parseFloat(storeysRow?.querySelector('dd')?.textContent || '1');
    const storeys = Number.isFinite(parsedStoreys) && parsedStoreys > 0 ? parsedStoreys : 1;

    // Existing page dimensions were derived from total built area. Reduce both axes
    // by sqrt(storeys) so their product represents the ground-floor footprint area.
    const scaleForStoreys = Math.sqrt(storeys);
    const widthM = Number.isFinite(totalWidth) && totalWidth > 0 ? totalWidth / scaleForStoreys : 10;
    const depthM = Number.isFinite(totalDepth) && totalDepth > 0 ? totalDepth / scaleForStoreys : 8;
    const isWide = widthM >= depthM;

    const footprint = document.createElement('div');
    footprint.id = 'bauhu-footprint-overlay';
    footprint.setAttribute('aria-label', 'House roof footprint');
    footprint.innerHTML = isWide
      ? `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <rect class="roof-plane" x="2" y="2" width="96" height="96" rx="2" />
          <line class="roof-ridge" x1="27" y1="50" x2="73" y2="50" />
          <line class="roof-slope" x1="2" y1="2" x2="27" y2="50" />
          <line class="roof-slope" x1="2" y1="98" x2="27" y2="50" />
          <line class="roof-slope" x1="98" y1="2" x2="73" y2="50" />
          <line class="roof-slope" x1="98" y1="98" x2="73" y2="50" />
        </svg>`
      : `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
          <rect class="roof-plane" x="2" y="2" width="96" height="96" rx="2" />
          <line class="roof-ridge" x1="50" y1="27" x2="50" y2="73" />
          <line class="roof-slope" x1="2" y1="2" x2="50" y2="27" />
          <line class="roof-slope" x1="98" y1="2" x2="50" y2="27" />
          <line class="roof-slope" x1="2" y1="98" x2="50" y2="73" />
          <line class="roof-slope" x1="98" y1="98" x2="50" y2="73" />
        </svg>`;
    map.appendChild(footprint);

    const style = document.createElement('style');
    style.textContent = `
      #placement-map { position: relative; }
      .placement-page .leaflet-overlay-pane path,
      .placement-page .leaflet-tooltip-pane .placement-label { display: none !important; }
      #bauhu-footprint-overlay {
        position: absolute;
        z-index: 850;
        box-sizing: border-box;
        pointer-events: none;
        transform-origin: center;
        filter: drop-shadow(5px 7px 5px rgba(23,57,76,.34));
      }
      #bauhu-footprint-overlay svg { display: block; width: 100%; height: 100%; overflow: visible; }
      #bauhu-footprint-overlay .roof-plane {
        fill: rgba(52,79,91,.62);
        stroke: #c5a66a;
        stroke-width: 3;
        vector-effect: non-scaling-stroke;
      }
      #bauhu-footprint-overlay .roof-ridge {
        stroke: rgba(247,245,239,.95);
        stroke-width: 2.2;
        vector-effect: non-scaling-stroke;
      }
      #bauhu-footprint-overlay .roof-slope {
        stroke: rgba(247,245,239,.72);
        stroke-width: 1.25;
        vector-effect: non-scaling-stroke;
      }
    `;
    document.head.appendChild(style);

    const params = new URLSearchParams(window.location.search);
    const latitude = Number(params.get('lat'));
    const siteLatitude = Number.isFinite(latitude) ? latitude : 18.3419;

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

    function currentZoom() {
      const tile = Array.from(map.querySelectorAll('img.leaflet-tile')).find((img) => img.src);
      const match = tile?.src.match(/\/(?:tile\/)?(\d+)\/\d+\/\d+(?:\.[a-z]+)?(?:\?.*)?$/i);
      if (match) return Number(match[1]);

      const zoomText = map.querySelector('.leaflet-control-zoom-in')?.getAttribute('aria-label');
      return Number(page.dataset.mapZoom || 19) || 19;
    }

    function metresPerPixel(zoom) {
      return Math.cos(siteLatitude * Math.PI / 180) * 2 * Math.PI * 6378137 / (256 * Math.pow(2, zoom));
    }

    function render() {
      const centre = markerCentre();
      if (centre) {
        const zoom = currentZoom();
        const mpp = metresPerPixel(zoom);
        const widthPx = widthM / mpp;
        const heightPx = depthM / mpp;
        const angle = Number(rotation.value || 0);

        footprint.style.width = `${Math.max(1, widthPx)}px`;
        footprint.style.height = `${Math.max(1, heightPx)}px`;
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
