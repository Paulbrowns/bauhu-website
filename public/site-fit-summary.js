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
      .leaflet-overlay-pane path[stroke="#17394c"][fill="#17394c"]{display:none!important}
      .tool-shell .model-panel{display:block!important;position:relative;padding:1.35rem;background:#f7f5ef;border-left:1px solid rgba(23,57,76,.16)}
      .site-summary{position:sticky;top:6.5rem;font-family:Inter,sans-serif}.site-summary .kicker{margin-bottom:.55rem}.site-summary h2{margin:0 0 .35rem;font:400 2rem/1.05 'Cormorant Garamond',serif}.site-summary-intro{margin:0 0 1rem;font:400 .64rem/1.55 Inter,sans-serif;color:rgba(23,57,76,.62)}
      .site-summary-status{display:inline-flex;margin-bottom:1rem;padding:.4rem .58rem;border-radius:999px;background:#ece9df;font:700 .58rem Inter,sans-serif;color:rgba(23,57,76,.65)}.site-summary-status.ready{background:#dfe9df;color:#497150}
      .site-summary dl{margin:0}.site-summary dl>div{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:.75rem;padding:.68rem 0;border-top:1px solid rgba(23,57,76,.13)}.site-summary dt{font:500 .61rem/1.4 Inter,sans-serif;color:rgba(23,57,76,.52)}.site-summary dd{margin:0;text-align:right;font:700 .64rem/1.4 Inter,sans-serif;overflow-wrap:anywhere}
      .site-summary-section{margin-top:1rem;padding-top:1rem;border-top:1px solid rgba(23,57,76,.15)}.site-summary-section>strong{display:block;margin-bottom:.55rem;font:700 .62rem Inter,sans-serif;letter-spacing:.08em;text-transform:uppercase}.summary-flags{display:flex;flex-wrap:wrap;gap:.35rem}.summary-flag{padding:.35rem .48rem;background:#ece9df;font:700 .56rem Inter,sans-serif}.summary-empty{font:400 .61rem/1.45 Inter,sans-serif;color:rgba(23,57,76,.55)}
      .summary-intel{display:grid;gap:.45rem}.summary-intel div{display:flex;justify-content:space-between;gap:.75rem;padding:.48rem 0;border-top:1px solid rgba(23,57,76,.09);font:400 .61rem/1.35 Inter,sans-serif}.summary-intel strong{text-align:right;font-size:.61rem}
      .site-summary-action{display:block;width:100%;box-sizing:border-box;margin-top:1.15rem;padding:.92rem 1rem;border:0;background:#17394c;color:#fff;text-align:center;text-decoration:none;font:700 .7rem Inter,sans-serif}.site-summary-action[aria-disabled="true"]{background:#9aa5a8;cursor:not-allowed}.site-summary-help{margin:.55rem 0 0;font:400 .56rem/1.45 Inter,sans-serif;color:rgba(23,57,76,.52);text-align:center}
      @media(max-width:1100px){.tool-shell{grid-template-columns:290px minmax(0,1fr)!important}.tool-shell .model-panel{grid-column:1/-1;border-left:0;border-top:1px solid rgba(23,57,76,.16)}.site-summary{position:static;display:grid;grid-template-columns:1fr 1fr;gap:0 2rem}.site-summary>header,.site-summary-action,.site-summary-help{grid-column:1/-1}}
      @media(max-width:760px){.site-summary{display:block}.site-summary-action{position:sticky;bottom:.65rem;z-index:20;box-shadow:0 8px 24px rgba(23,57,76,.22)}}
    `;
    document.head.appendChild(style);

    panel.innerHTML = `
      <section class="site-summary" aria-label="Site summary">
        <header>
          <p class="kicker">SITE SUMMARY</p>
          <h2>Your property</h2>
          <p class="site-summary-intro">A live summary of the location, parcel, supporting documents and site intelligence gathered in this step.</p>
          <span id="summary-status" class="site-summary-status">Location not confirmed</span>
        </header>
        <dl>
          <div><dt>Location</dt><dd id="summary-location">Not confirmed</dd></div>
          <div><dt>Coordinates</dt><dd id="summary-coordinates">—</dd></div>
          <div><dt>Parcel</dt><dd id="summary-parcel">Not selected</dd></div>
          <div><dt>Plot area</dt><dd id="summary-area">—</dd></div>
          <div><dt>Boundary source</dt><dd id="summary-boundary">—</dd></div>
          <div><dt>Site documents</dt><dd id="summary-documents">None uploaded</dd></div>
        </dl>
        <div class="site-summary-section">
          <strong>Available site information</strong>
          <div id="summary-flags" class="summary-flags"><span class="summary-empty">No document information selected.</span></div>
        </div>
        <div class="site-summary-section">
          <strong>Site intelligence</strong>
          <div class="summary-intel">
            <div><span>Sun study</span><strong id="summary-sun">Pending location</strong></div>
            <div><span>Climate</span><strong id="summary-climate">Pending location</strong></div>
            <div><span>Hazards</span><strong id="summary-hazards">Screening pending</strong></div>
          </div>
        </div>
        <button id="continue-placement" class="site-summary-action" type="button" disabled>Continue to house placement</button>
        <p id="summary-help" class="site-summary-help">Confirm the parcel to continue.</p>
      </section>
    `;

    const value = (id, fallback = '') => document.getElementById(id)?.textContent?.trim() || fallback;

    function removePlacementArtifacts() {
      document.getElementById('model-card')?.remove();
      document.querySelectorAll('.model-map-label').forEach((node) => node.remove());
      document.querySelectorAll('.leaflet-overlay-pane path').forEach((path) => {
        const stroke = (path.getAttribute('stroke') || '').toLowerCase();
        const fill = (path.getAttribute('fill') || '').toLowerCase();
        if (stroke === '#17394c' && fill === '#17394c') path.remove();
      });
      const next = document.getElementById('next-step');
      if (next && /test model placement|model placement/i.test(next.textContent || '')) next.textContent = 'Continue to house placement';
    }

    function updateSummary() {
      removePlacementArtifacts();
      const locationConfirmed = /confirmed/i.test(value('location-status'));
      const parcelConfirmed = /confirmed/i.test(value('parcel-status'));
      const lat = value('map-latitude');
      const lng = value('map-longitude');
      const docs = Number(document.documentElement.dataset.siteDocuments || 0);

      document.getElementById('summary-location').textContent = locationConfirmed ? value('map-place-name', 'Selected property') : 'Not confirmed';
      document.getElementById('summary-coordinates').textContent = locationConfirmed && lat && lng ? `${lat}, ${lng}` : '—';
      document.getElementById('summary-parcel').textContent = value('parcel-reference', parcelConfirmed ? 'Confirmed parcel' : 'Not selected');
      document.getElementById('summary-area').textContent = value('parcel-area', '—');
      document.getElementById('summary-boundary').textContent = value('boundary-source', '—');
      document.getElementById('summary-documents').textContent = docs ? `${docs} PDF${docs === 1 ? '' : 's'} uploaded` : 'None uploaded';

      const flags = Array.from(document.querySelectorAll('#survey-checks input:checked')).map((input) => input.parentElement?.textContent?.trim()).filter(Boolean);
      const flagBox = document.getElementById('summary-flags');
      flagBox.innerHTML = flags.length ? flags.map((flag) => `<span class="summary-flag">${flag}</span>`).join('') : '<span class="summary-empty">No document information selected.</span>';

      const sunrise = value('sunrise-time') || value('sunrise');
      const sunset = value('sunset-time') || value('sunset');
      document.getElementById('summary-sun').textContent = sunrise && sunset ? `${sunrise}–${sunset}` : locationConfirmed ? 'Calculated below' : 'Pending location';
      document.getElementById('summary-climate').textContent = locationConfirmed ? 'Climate summary available' : 'Pending location';
      document.getElementById('summary-hazards').textContent = locationConfirmed ? 'Screening available' : 'Screening pending';

      const status = document.getElementById('summary-status');
      status.textContent = parcelConfirmed ? 'Site information ready' : locationConfirmed ? 'Location confirmed' : 'Location not confirmed';
      status.classList.toggle('ready', parcelConfirmed);

      const button = document.getElementById('continue-placement');
      button.disabled = !parcelConfirmed;
      const help = document.getElementById('summary-help');
      help.textContent = parcelConfirmed ? 'The next screen will handle the selected Bauhu model and placement.' : 'Confirm the parcel to continue.';
    }

    document.getElementById('continue-placement').addEventListener('click', () => {
      if (!/confirmed/i.test(value('parcel-status'))) return;
      const slug = location.pathname.split('/').filter(Boolean).pop();
      const params = new URLSearchParams({
        lat: value('map-latitude'),
        lng: value('map-longitude'),
        parcel: value('parcel-reference'),
        area: value('parcel-area')
      });
      location.href = `/site-placement/${slug}?${params.toString()}`;
    });

    const observer = new MutationObserver(updateSummary);
    observer.observe(document.body, { subtree: true, childList: true, characterData: true, attributes: true });
    document.addEventListener('change', updateSummary);
    updateSummary();
  });
})();