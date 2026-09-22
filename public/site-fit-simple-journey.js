(() => {
  if (window.location.pathname.replace(/\/$/, '') !== '/site-fit') return;

  function init() {
    const panel = document.querySelector('.control-panel');
    const header = document.querySelector('.site-fit-header');
    const confirmLocation = document.getElementById('confirm-location');
    const confirmParcel = document.getElementById('confirm-parcel');
    const skipLink = panel?.querySelector('.skip-link');
    const coordinateGrid = panel?.querySelector('.coordinate-grid');
    const applyCoordinates = document.getElementById('apply-coordinates');
    if (!panel || !header || !confirmLocation) return;

    const h1 = header.querySelector('h1');
    const intro = header.querySelector('div > p:last-child');
    const aside = header.querySelector('aside');
    if (h1) h1.textContent = 'Where do you want to build?';
    if (intro) intro.textContent = 'Locate the site if you have one. A precise parcel boundary is helpful, but it is not required to start your project.';
    if (aside) aside.innerHTML = '<span>START YOUR PROJECT</span><strong>1 of 4 · Site</strong><small>Next: tell us about the project.</small>';

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

    const saveSite = (includeParcel) => {
      const number = (id) => {
        const value = Number(document.getElementById(id)?.textContent || document.getElementById(id)?.value);
        return Number.isFinite(value) ? value : null;
      };
      const site = {
        hasSite: true,
        place: document.getElementById('map-place-name')?.textContent?.trim() || 'Selected site',
        source: document.getElementById('location-source')?.textContent?.trim() || 'Map point',
        lat: number('map-latitude'),
        lng: number('map-longitude'),
        parcel: includeParcel ? (document.getElementById('parcel-reference')?.textContent?.trim() || '') : '',
        area: includeParcel ? (document.getElementById('parcel-area')?.textContent?.trim() || '') : '',
        boundarySource: includeParcel ? (document.getElementById('parcel-source')?.textContent?.trim() || '') : '',
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
      continueButton.hidden = true;
      confirmLocation.after(continueButton);
    }

    confirmLocation.addEventListener('click', () => {
      window.setTimeout(() => {
        continueButton.hidden = false;
        const parcelControls = document.getElementById('parcel-controls');
        const step = parcelControls?.querySelector('.step strong');
        const small = parcelControls?.querySelector('.step small');
        if (step) step.textContent = 'Add the parcel boundary (optional)';
        if (small) small.textContent = 'Useful if available. You can skip this and continue.';
        const state = document.getElementById('parcel-search-state');
        if (state && !/found|respond|intersect/i.test(state.textContent || '')) {
          state.textContent = 'Optional: use available cadastral records or draw an approximate boundary.';
        }
      }, 0);
    }, true);

    continueButton.addEventListener('click', () => {
      saveSite(false);
      window.location.assign('/project-details');
    });

    if (confirmParcel) {
      confirmParcel.onclick = () => {
        saveSite(true);
        window.location.assign('/project-details');
      };
      confirmParcel.textContent = 'Use parcel and continue';
    }

    if (skipLink) {
      skipLink.textContent = 'I do not have a site yet →';
      skipLink.href = '/project-details';
      skipLink.addEventListener('click', () => {
        try { localStorage.setItem('bauhuProjectSite', JSON.stringify({ hasSite: false, savedAt: new Date().toISOString() })); } catch {}
      });
    }

    const style = document.createElement('style');
    style.textContent = `
      .journey-continue{margin-top:.65rem}
      .coordinate-options{margin:.7rem 0}
      .coordinate-options summary{cursor:pointer;padding:.7rem .8rem;border:1px solid rgba(23,57,76,.18);background:#fff;font:700 .67rem Inter,sans-serif}
      .coordinate-options[open] summary{margin-bottom:.7rem}
      #parcel-controls{margin-top:1.2rem;padding-top:1.2rem;border-top:1px solid rgba(23,57,76,.15)}
      #parcel-controls .or{opacity:.7}
      @media(max-width:760px){.journey-continue{position:sticky;bottom:.65rem;z-index:25;box-shadow:0 8px 24px rgba(23,57,76,.22)}}
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();