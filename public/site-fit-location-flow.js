(() => {
  if (!location.pathname.startsWith('/site-fit/')) return;

  const init = () => {
    const panel = document.querySelector('.control-panel');
    if (!panel || document.documentElement.dataset.locationFlowReady) return;
    document.documentElement.dataset.locationFlowReady = 'true';

    const step = panel.querySelector('.step');
    const searchForm = document.getElementById('location-search-form');
    const feedback = document.getElementById('search-feedback');
    const instruction = panel.querySelector('.instruction');
    const coordinateGrid = panel.querySelector('.coordinate-grid');
    const applyCoordinates = document.getElementById('apply-coordinates');
    const currentLocation = document.getElementById('use-current-location');
    const confirmLocation = document.getElementById('confirm-location');
    const mapStage = document.querySelector('.map-stage');
    const mapWorkspaceFooter = document.querySelector('.map-workspace footer');

    if (!step || !instruction || !coordinateGrid || !applyCoordinates || !currentLocation || !confirmLocation) return;

    const stepCopy = step.querySelector('small');
    if (stepCopy) stepCopy.textContent = 'Position the marker, enter coordinates or use your device location.';

    instruction.textContent = 'Tap the Caribbean map to place the pin, or enter coordinates below.';
    instruction.classList.add('location-primary-instruction');

    const coordinateHeading = document.createElement('div');
    coordinateHeading.className = 'location-method-label';
    coordinateHeading.textContent = 'Use coordinates';

    if (feedback) {
      feedback.textContent = '';
      feedback.classList.add('location-feedback');
    }

    step.after(instruction);
    instruction.after(coordinateHeading);
    coordinateHeading.after(coordinateGrid);
    coordinateGrid.after(applyCoordinates);
    applyCoordinates.after(currentLocation);
    currentLocation.after(confirmLocation);
    if (feedback) confirmLocation.after(feedback);

    searchForm?.remove();

    const mobileConfirm = document.createElement('div');
    mobileConfirm.className = 'mobile-location-confirm';
    mobileConfirm.innerHTML = '<p>Tap the map or drag the pin, then confirm this site location.</p>';
    const desktopPlaceholder = document.createComment('desktop confirm location position');
    confirmLocation.before(desktopPlaceholder);

    const moveConfirmButton = () => {
      const isMobile = window.matchMedia('(max-width: 760px)').matches;
      if (isMobile && mapStage && mapWorkspaceFooter) {
        if (!mobileConfirm.isConnected) mapWorkspaceFooter.before(mobileConfirm);
        if (confirmLocation.parentElement !== mobileConfirm) mobileConfirm.appendChild(confirmLocation);
      } else {
        if (confirmLocation.parentElement !== panel) desktopPlaceholder.after(confirmLocation);
        mobileConfirm.remove();
      }
    };

    moveConfirmButton();
    window.addEventListener('resize', moveConfirmButton);

    const style = document.createElement('style');
    style.textContent = `
      .location-primary-instruction {
        margin: 0 0 1rem;
        padding: 1rem;
        background: #e9e1cf;
        font: 600 .72rem/1.55 Inter, sans-serif;
      }
      .location-method-label {
        margin: 0 0 .55rem;
        font: 700 .68rem/1 Inter, sans-serif;
      }
      #apply-coordinates { margin-bottom: .8rem; }
      #use-current-location { margin-bottom: .8rem; }
      #confirm-location { margin-top: .15rem; }
      .location-feedback {
        min-height: 0;
        margin: .55rem 0 0;
      }
      .mobile-location-confirm {
        display: none;
      }
      @media (max-width: 760px) {
        .location-primary-instruction {
          margin-bottom: 1.15rem;
        }
        .mobile-location-confirm {
          display: grid;
          gap: .75rem;
          padding: 1rem;
          background: #f7f5ef;
          border-top: 1px solid rgba(23,57,76,.14);
          border-bottom: 1px solid rgba(23,57,76,.14);
        }
        .mobile-location-confirm p {
          margin: 0;
          color: rgba(23,57,76,.68);
          font: 600 .72rem/1.5 Inter, sans-serif;
        }
        .mobile-location-confirm #confirm-location {
          margin: 0;
          min-height: 48px;
          font-size: .74rem;
        }
        .leaflet-control-zoom {
          display: block !important;
        }
      }
    `;
    document.head.appendChild(style);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
