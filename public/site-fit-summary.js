(() => {
  if (!location.pathname.startsWith('/site-fit/')) return;

  const ready = (fn) => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', fn, { once: true })
    : fn();

  ready(() => {
    const page = document.querySelector('.site-fit-page');
    const panel = document.querySelector('.model-panel');
    if (!page || !panel || panel.dataset.siteSummaryReady) return;
    panel.dataset.siteSummaryReady = 'true';

    const style = document.createElement('style');
    style.textContent = `
      .model-card,.model-map-label{display:none!important}
      .tool-shell .model-panel{display:block!important;position:relative;padding:1.35rem;background:#f7f5ef;border-left:1px solid rgba(23,57,76,.16)}
      .site-summary{position:sticky;top:6.5rem;font-family:Inter,sans-serif}.site-summary .kicker{margin-bottom:.55rem}.site-summary h2{margin:0 0 .35rem;font:400 2rem/1.05 'Cormorant Garamond',serif}.site-summary-intro{margin:0 0 1rem;font:400 .64rem/1.55 Inter,sans-serif;color:rgba(23,57,76,.62)}
      .site-summary-status{display:inline-flex;margin-bottom:1rem;padding:.4rem .58rem;border-radius:999px;background:#ece9df;font:700 .58rem Inter,sans-serif;color:rgba(23,57,76,.65)}.site-summary-status.ready{background:#dfe9df;color:#497150}
      .site-summary dl{margin:0}.site-summary dl>div{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:.75rem;padding:.68rem 0;border-top:1px solid rgba(23,57,76,.13)}.site-summary dt{font:500 .61rem/1.4 Inter,sans-serif;color:rgba(23,57,76,.52)}.site-summary dd{margin:0;text-align:right;font:700 .64rem/1.4 Inter,sans-serif;overflow-wrap:anywhere}
      .site-summary-section{margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(23,57,76,.15)}.site-summary-section>strong{display:block;margin-bottom:.55rem;font:700 .62rem Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase}.summary-flags{display:flex;flex-wrap:wrap;gap:.35rem}.summary-flag{padding:.35rem .48rem;background:#ece9df;font:700 .56rem Inter,sans-serif}.summary-empty{font:400 .61rem/1.45 Inter,sans-serif;color:rgba(23,57,76,.55)}
      .summary-intel{display:grid;gap:.45rem}.summary-intel div{display:flex;justify-content:space-between;gap:.75rem;padding:.48rem 0;border-top:1px solid rgba(23,57,76,.09);font:400 .61rem/1.35 Inter,sans-serif}.summary-intel strong{text-align:right;font-size:.61rem}
      .site-summary-action{display:block;width:100%;box-sizing:border-box;margin-top:1.15rem;padding:.92rem 1rem;border:0;background:#17394c;color:#fff;text-align:center;font:700 .7rem Inter,sans-serif;cursor:pointer}.site-summary-action:disabled{background:#9aa5a8;cursor:not-allowed}.site-summary-help{margin:.55rem 0 0;font:400 .56rem/1.45 Inter,sans-serif;color:rgba(23,57,76,.52);text-align:center}
      @media(max-width:1100px){.tool-shell{grid-template-columns:290px minmax(0,1fr)!important}.tool-shell .model-panel{grid-column:1/-1;border-left:0;border-top:1px solid rgba(23,57,76,.16)}.site-summary{position:static;display:grid;grid-template-columns:1fr 1fr;gap:0 2rem}.site-summary>header,.site-summary-action,.site-summary-help{grid-column:1/-1}}
      @media(max-width:760px){.site-summary{display:block}.site-summary-action{position:sticky;bottom:.65rem;z-index:20;box-shadow:0 8px 24px rgba(23,57,76,.22)}}
    `;
    document.head.appendChild(style);

    panel.innerHTML = `
      <section class="site-summary" aria-label="Site summary">
        <header><p class="kicker">SITE SUMMARY</p><h2>Your property</h2><p class="site-summary-intro">Location, parcel, documents and site intelligence gathered in this step.</p><span id="summary-status" class="site-summary-status">Location not confirmed</span></header>
        <dl>
          <div><dt>Location</dt><dd id="summary-location">Not confirmed</dd></div>
          <div><dt>Coordinates</dt><dd id="summary-coordinates">—</dd></div>
          <div><dt>Parcel</dt><dd id="summary-parcel">Not selected</dd></div>
          <div><dt>Plot area</dt><dd id="summary-area">—</dd></div>
          <div><dt>Boundary source</dt><dd id="summary-boundary">—</dd></div>
          <div><dt>Site documents</dt><dd id="summary-documents">None uploaded</dd></div>
        </dl>
        <div class="site-summary-section"><strong>Available site information</strong><div id="summary-flags" class="summary-flags"><span class="summary-empty">No document information selected.</span></div></div>
        <div class="site-summary-section"><strong>Site intelligence</strong><div class="summary-intel"><div><span>Sun study</span><strong id="summary-sun">Pending location</strong></div><div><span>Climate</span><strong id="summary-climate">Pending location</strong></div><div><span>Hazards</span><strong id="summary-hazards">Pending location</strong></div></div></div>
        <button id="continue-placement" class="site-summary-action" type="button" disabled>Continue to house placement</button>
        <p id="summary-help" class="site-summary-help">Confirm the parcel to continue.</p>
      </section>
    `;

    const text = (id, fallback = '') => document.getElementById(id)?.textContent?.trim() || fallback;
    const set = (id, value) => { const el = document.getElementById(id); if (el && el.textContent !== value) el.textContent = value; };

    function refresh() {
      const locationConfirmed = /confirmed/i.test(text('location-status'));
      const parcelConfirmed = /confirmed/i.test(text('parcel-status'));
      const lat = text('map-latitude');
      const lng = text('map-longitude');
      const docs = Number(document.documentElement.dataset.siteDocuments || 0);

      set('summary-location', locationConfirmed ? text('map-place-name', 'Selected property') : 'Not confirmed');
      set('summary-coordinates', locationConfirmed && lat && lng ? `${lat}, ${lng}` : '—');
      set('summary-parcel', parcelConfirmed ? text('parcel-reference', 'Confirmed parcel') : text('parcel-reference', 'Not selected'));
      set('summary-area', text('parcel-area', '—'));
      set('summary-boundary', text('boundary-source', '—'));
      set('summary-documents', docs ? `${docs} PDF${docs === 1 ? '' : 's'} uploaded` : 'None uploaded');

      const flags = Array.from(document.querySelectorAll('#survey-checks input:checked'))
        .map((input) => input.parentElement?.textContent?.trim()).filter(Boolean);
      const flagBox = document.getElementById('summary-flags');
      if (flagBox) flagBox.innerHTML = flags.length
        ? flags.map((flag) => `<span class="summary-flag">${flag}</span>`).join('')
        : '<span class="summary-empty">No document information selected.</span>';

      const intelVisible = !!document.getElementById('site-intelligence');
      set('summary-sun', locationConfirmed ? (intelVisible ? 'Available below' : 'Calculating') : 'Pending location');
      set('summary-climate', locationConfirmed ? (intelVisible ? 'Available below' : 'Loading') : 'Pending location');
      set('summary-hazards', locationConfirmed ? (intelVisible ? 'Screening available' : 'Loading') : 'Pending location');

      const status = document.getElementById('summary-status');
      if (status) {
        status.textContent = parcelConfirmed ? 'Site information ready' : locationConfirmed ? 'Location confirmed' : 'Location not confirmed';
        status.classList.toggle('ready', parcelConfirmed);
      }
      const button = document.getElementById('continue-placement');
      if (button) button.disabled = !parcelConfirmed;
      set('summary-help', parcelConfirmed ? 'Continue to the separate house-placement stage.' : 'Confirm the parcel to continue.');
    }

    document.addEventListener('click', (event) => {
      if (event.target.closest('button,a')) {
        window.setTimeout(refresh, 0);
        window.setTimeout(refresh, 400);
        window.setTimeout(refresh, 1200);
      }
    }, true);
    document.addEventListener('change', () => window.setTimeout(refresh, 0), true);
    document.addEventListener('input', () => window.setTimeout(refresh, 0), true);
    window.addEventListener('site-fit:updated', refresh);

    document.getElementById('continue-placement')?.addEventListener('click', () => {
      if (!/confirmed/i.test(text('parcel-status'))) return;
      const slug = location.pathname.split('/').filter(Boolean).pop();
      const params = new URLSearchParams({ lat: text('map-latitude'), lng: text('map-longitude'), parcel: text('parcel-reference'), area: text('parcel-area') });
      location.href = `/site-placement/${slug}?${params.toString()}`;
    });

    refresh();
    window.setTimeout(refresh, 800);
    window.setTimeout(refresh, 2200);
  });
})();