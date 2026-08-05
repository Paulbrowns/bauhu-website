(() => {
  if (!location.pathname.startsWith('/site-placement/')) return;

  function init() {
    const map = document.getElementById('placement-map');
    const footprint = document.getElementById('bauhu-footprint-overlay');
    if (!map || !footprint || document.getElementById('placement-value-tools')) return;

    const tools = document.createElement('section');
    tools.id = 'placement-value-tools';
    tools.innerHTML = `
      <div class="placement-tool-row">
        <div>
          <strong>Indicative setback envelope</strong>
          <small>Visual clearance only — not a planning determination.</small>
        </div>
        <label><span id="setback-value">3 m</span><input id="setback-range" type="range" min="0" max="10" step="1" value="3" /></label>
      </div>
      <div class="placement-tool-row sun-row">
        <div>
          <strong>Sun orientation</strong>
          <small>North is fixed to the map. Rotate the house to explore orientation.</small>
        </div>
        <div class="sun-compass" aria-label="North and sun orientation"><span class="north">N</span><span class="sun">☀</span></div>
      </div>`;

    const controls = document.querySelector('.placement-controls');
    (controls || map.parentElement || map).appendChild(tools);

    const envelope = document.createElement('div');
    envelope.id = 'bauhu-setback-envelope';
    map.appendChild(envelope);

    const style = document.createElement('style');
    style.textContent = `
      #placement-value-tools{margin-top:1rem;border-top:1px solid rgba(23,57,76,.14)}
      .placement-tool-row{display:flex;justify-content:space-between;align-items:center;gap:1rem;padding:1rem 0;border-bottom:1px solid rgba(23,57,76,.12)}
      .placement-tool-row strong{display:block;font:700 .68rem Inter,sans-serif;color:#17394c}
      .placement-tool-row small{display:block;margin-top:.25rem;font:400 .58rem/1.45 Inter,sans-serif;color:rgba(23,57,76,.62)}
      .placement-tool-row label{display:grid;gap:.35rem;min-width:130px;text-align:right;font:700 .62rem Inter,sans-serif;color:#17394c}
      .placement-tool-row input{width:130px}
      .sun-compass{position:relative;width:54px;height:54px;border:1px solid rgba(23,57,76,.24);border-radius:50%;background:rgba(247,245,239,.9)}
      .sun-compass:before{content:'';position:absolute;left:50%;top:7px;bottom:7px;width:1px;background:rgba(23,57,76,.28)}
      .sun-compass .north{position:absolute;left:50%;top:4px;transform:translateX(-50%);font:800 .62rem Inter,sans-serif;color:#17394c}
      .sun-compass .sun{position:absolute;right:-7px;top:50%;transform:translateY(-50%);font-size:1rem}
      #bauhu-setback-envelope{position:absolute;z-index:840;box-sizing:border-box;border:2px dashed rgba(197,166,106,.95);background:rgba(197,166,106,.08);pointer-events:none;transform-origin:center}
      @media(max-width:600px){.placement-tool-row{align-items:flex-start;flex-direction:column}.placement-tool-row label{text-align:left}}
    `;
    document.head.appendChild(style);

    const range = document.getElementById('setback-range');
    const value = document.getElementById('setback-value');

    function currentZoom() {
      const tile = Array.from(map.querySelectorAll('img.leaflet-tile')).find((img) => img.src);
      const match = tile?.src.match(/\/(?:tile\/)?(\d+)\/\d+\/\d+(?:\.[a-z]+)?(?:\?.*)?$/i);
      return match ? Number(match[1]) : 19;
    }

    function latitude() {
      const params = new URLSearchParams(location.search);
      const lat = Number(params.get('lat'));
      return Number.isFinite(lat) ? lat : 18.3419;
    }

    function metresPerPixel() {
      return Math.cos(latitude() * Math.PI / 180) * 2 * Math.PI * 6378137 / (256 * Math.pow(2, currentZoom()));
    }

    function render() {
      const rect = footprint.getBoundingClientRect();
      const mapRect = map.getBoundingClientRect();
      const setbackM = Number(range?.value || 0);
      const pad = setbackM / metresPerPixel();
      const rotation = footprint.style.transform.match(/rotate\(([-\d.]+)deg\)/)?.[1] || '0';

      envelope.style.left = `${rect.left - mapRect.left + rect.width / 2}px`;
      envelope.style.top = `${rect.top - mapRect.top + rect.height / 2}px`;
      envelope.style.width = `${Math.max(1, footprint.offsetWidth + pad * 2)}px`;
      envelope.style.height = `${Math.max(1, footprint.offsetHeight + pad * 2)}px`;
      envelope.style.transform = `translate(-50%, -50%) rotate(${rotation}deg)`;
      envelope.hidden = footprint.hidden;
      requestAnimationFrame(render);
    }

    range?.addEventListener('input', () => {
      value.textContent = `${range.value} m`;
      const params = new URLSearchParams(location.search);
      params.set('setback', range.value);
      history.replaceState(null, '', `${location.pathname}?${params.toString()}`);
    });

    const saved = new URLSearchParams(location.search).get('setback');
    if (saved && range) { range.value = saved; value.textContent = `${saved} m`; }
    requestAnimationFrame(render);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => setTimeout(init, 300), { once: true });
  else setTimeout(init, 300);
})();
