(() => {
  const page = document.querySelector('.home-detail[data-model-slug="firefly"]');
  if (!page) return;

  const floorPlanSection = page.querySelector('.home-floor-plan');
  const headingWrap = floorPlanSection?.querySelector('.home-floor-plan-heading');
  const headingCopy = headingWrap?.querySelector('div');

  if (!floorPlanSection || !headingWrap || !headingCopy) return;

  if (!headingCopy.querySelector('h2')) {
    const heading = document.createElement('h2');
    heading.textContent = 'Three bedrooms, three bathrooms and generous outdoor living.';
    headingCopy.appendChild(heading);
  }

  if (!headingWrap.querySelector('a.home-text-link')) {
    const link = document.createElement('a');
    link.className = 'home-text-link';
    link.href = '/downloads/models/firefly-plans.pdf';
    link.target = '_blank';
    link.rel = 'noopener';
    link.textContent = 'View architectural plans ↗';
    headingWrap.appendChild(link);
  }

  if (!floorPlanSection.querySelector('.home-plan-note')) {
    const figure = floorPlanSection.querySelector('figure');
    const note = document.createElement('p');
    note.className = 'home-plan-note';
    note.textContent = 'Plans shown are the current reference design and are provided for model evaluation. Final project information is developed and coordinated for the specific site and approved project scope.';
    figure?.insertAdjacentElement('afterend', note);
  }
})();
