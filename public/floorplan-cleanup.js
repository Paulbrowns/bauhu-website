(() => {
  const removeFloorplanSection = (image) => {
    const section = image?.closest?.('.home-floor-plan');
    if (section) section.remove();
  };

  const wireFloorplan = () => {
    document.querySelectorAll('.home-floor-plan img').forEach((image) => {
      if (image.dataset.floorplanCleanupWired === 'true') return;
      image.dataset.floorplanCleanupWired = 'true';
      image.addEventListener('error', () => removeFloorplanSection(image));

      if (image.complete && image.naturalWidth === 0) {
        removeFloorplanSection(image);
      }
    });
  };

  const modelVideos = {
    'barbados-blue': {
      src: '/videos/barbados-blue.mp4',
      label: 'Experience Barbados Blue',
      title: 'See the model in motion.',
      ariaLabel: 'Barbados Blue video',
    },
    'caribbean-cottage': {
      src: '/videos/caribbean-cottage.mp4',
      label: 'Experience Caribbean Cottage',
      title: 'See the model in motion.',
      ariaLabel: 'Caribbean Cottage video',
    },
  };

  const insertModelVideo = () => {
    const root = document.querySelector('.home-detail[data-model-slug]');
    if (!root || document.querySelector('.home-film')) return;

    const slug = root.dataset.modelSlug?.replace(/^bauhu-/, '');
    const modelVideo = modelVideos[slug];
    if (!modelVideo) return;

    const gallery = root.querySelector('.home-gallery');
    if (!gallery) return;

    const film = document.createElement('section');
    film.className = 'home-film';
    film.setAttribute('aria-label', modelVideo.ariaLabel);
    film.innerHTML = `
      <div class="home-film-heading">
        <p class="home-kicker">${modelVideo.label}</p>
        <h2>${modelVideo.title}</h2>
      </div>
      <div class="home-film-frame">
        <video autoplay muted loop playsinline preload="metadata">
          <source src="${modelVideo.src}" type="video/mp4">
        </video>
      </div>
    `;

    const video = film.querySelector('video');
    video?.addEventListener('error', () => film.remove());
    gallery.parentNode.insertBefore(film, gallery);
  };

  wireFloorplan();
  insertModelVideo();
  window.addEventListener('load', wireFloorplan, { once: true });
})();
