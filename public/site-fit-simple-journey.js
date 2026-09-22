(() => {
  if (window.location.pathname.replace(/\/$/, '') !== '/site-fit') return;

  function init() {
    const params = new URLSearchParams(window.location.search);
    const selectedModel = params.get('model');
    if (selectedModel) {
      try {
        const existing = JSON.parse(localStorage.getItem('bauhuProjectDetails') || '{}');
        localStorage.setItem('bauhuProjectDetails', JSON.stringify({ ...existing, route: 'model', modelSlug: selectedModel }));
      } catch {}
    }

    const panel = document.querySelector('.control-panel');
    const header = document.querySelector('.site-fit-header');
    const confirmLocation = document.getElementById('confirm-location');
    const skipLink = panel?.querySelector('.skip-link');
    const coordinateGrid = panel?.querySelector('.coordinate-grid');
    const applyCoordinates = document.getElementById('apply-coordinates');
    const parcelControls = document.getElementById('parcel-controls');
    if (!panel || !header || !confirmLocation) return;

    const h1 = header.querySelector('h1');
    const intro = header.querySelector('div > p:last-child');
    const aside = header.querySelector('aside');
    if (h1) h1.textContent = 'Where do you want to build?';
    if (intro) intro.textContent = 'Pin the location of the site you have in mind. If you have not chosen land yet, you can skip this step and continue.';
    if (aside) aside.innerHTML = '<span>START YOUR PROJECT</span><strong>1 of 3 · Site</strong><small>Next: tell us about the project.</small>';

    const firstStep = panel.querySelector('.step');
    if (firstStep) {
      const strong = firstStep.querySelector('strong');
      const small = firstStep.querySelector('small');
      if (strong) strong.textContent = 'Locate your site';
      if (small) small.textContent = 'Search by place, use your location, or enter coordinates.';
    }

    if (coordinateGrid && applyCoordinates && !document.getElementById('coordinate-options')) {
      const details = document.createElement('details');
      details.id = 'coordinate-options';
      details.className = 'coordinate-options';
      const summary = document.createElement('summary');
      summary.textContent = 'Use coordinates instead';
      coordinateGrid.before(details);
      details.append(summary, coordinateGrid, applyCoordinates);
    }

    if (parcelControls) parcelControls.remove();

    const saveSite = () => {
      const number = (id) => {
        const el = document.getElementById(id);
        const value = Number(el?.textContent || el?.value);
        return Number.isFinite(value) ? value : null;
      };
      const site = {
        hasSite: true,
        place: document.getElementById('map-place-name')?.textContent?.trim() || 'Selected site',
        source: document.getElementById('location-source')?.textContent?.trim() || 'Map point',
        lat: number('map-latitude'),
        lng: number('map-longitude'),
        savedAt: new Date().toISOString()
      };
      try { localStorage.setItem('bauhuProjectSite', JSON.stringify(site)); } catch {}
    };

    let continueButton = document.getElementById('continue-project');
    if (!continueButton) {
      continueButton = document.createElement('button');
      continueButton.id = 'continue-project';
      continueButton.className = 'primary journey-continue';
      continueButton.type = 'button';
      continueButton.textContent = 'Continue to project details';
      continueButton.disabled = true;
      confirmLocation.after(continueButton);
    }

    confirmLocation.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      saveSite();

      const status = document.getElementById('location-status');
      if (status) {
        status.textContent = 'Location confirmed';
        status.className = 'confirmed-status';
      }

      const nextStep = document.getElementById('next-step');
      if (nextStep) nextStep.textContent = 'Continue to project details';

      confirmLocation.textContent = 'Location confirmed';
      confirmLocation.classList.add('confirmed-location');
      continueButton.disabled = false;
      continueButton.classList.add('ready');
    }, true);

    continueButton.addEventListener('click', () => {
      if (continueButton.disabled) return;
      saveSite();
      window.location.assign('/project-details');
    });

    if (skipLink) {
      skipLink.textContent = 'I do not have a site yet →';
      skipLink.href = '/project-details';
      skipLink.addEventListener('click', () => {
        try { localStorage.setItem('bauhuProjectSite', JSON.stringify({ hasSite: false, savedAt: new Date().toISOString() })); } catch {}
      });
    }

    const parcelStatus = document.getElementById('parcel-status');
    if (parcelStatus) parcelStatus.remove();

    const footer = document.querySelector('.map-workspace footer');
    if (footer) {
      const items = Array.from(footer.children);
      if (items[1]) items[1].remove();
      if (items[2]) items[2].remove();
    }

    const style = document.createElement('style');
    style.textContent = `
      .journey-continue{margin-top:.65rem;transition:opacity .18s ease,background .18s ease}
      .journey-continue:disabled{opacity:.32;cursor:not-allowed;background:#17394c}
      .journey-continue.ready{opacity:1}
      .confirmed-location{background:#dfe9df!important;color:#497150!important}
      .coordinate-options{margin:.7rem 0}
      .coordinate-options summary{cursor:pointer;padding:.7rem .8rem;border:1px solid rgba(23,57,76,.18);background:#fff;font:700 .67rem Inter,sans-serif}
      .coordinate-options[open] summary{margin-bottom:.7rem}
      .map-workspace footer{grid-template-columns:1fr 1fr!important}
      @media(max-width:760px){.journey-continue.ready{position:sticky;bottom:.65rem;z-index:25;box-shadow:0 8px 24px rgba(23,57,76,.22)}}
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();