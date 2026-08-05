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

    if (!step || !instruction || !coordinateGrid || !applyCoordinates || !currentLocation || !confirmLocation) return;

    const stepCopy = step.querySelector('small');
    if (stepCopy) stepCopy.textContent = 'Position the marker, enter coordinates or use your device location.';

    instruction.textContent = 'Move the map and drag the marker to locate your property.';
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
    `;
    document.head.appendChild(style);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
