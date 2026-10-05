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

  const insertBarbadosBlueVideo = () => {
    const root = document.querySelector('.home-detail[data-model-slug]');
    if (!root) return;

    const slug = root.dataset.modelSlug?.replace(/^bauhu-/, '');
    if (slug !== 'barbados-blue' || document.querySelector('.home-film')) return;

    const gallery = root.querySelector('.home-gallery');
    if (!gallery) return;

    const film = document.createElement('section');
    film.className = 'home-film';
    film.setAttribute('aria-label', 'Barbados Blue video');
    film.innerHTML = `
      <div class="home-film-heading">
        <p class="home-kicker">Experience Barbados Blue</p>
        <h2>See the model in motion.</h2>
      </div>
      <div class="home-film-frame">
        <video autoplay muted loop playsinline preload="metadata">
          <source src="/videos/barbados-blue.mp4" type="video/mp4">
        </video>
      </div>
    `;

    const video = film.querySelector('video');
    video?.addEventListener('error', () => film.remove());
    gallery.parentNode.insertBefore(film, gallery);
  };

  wireFloorplan();
  insertBarbadosBlueVideo();
  window.addEventListener('load', wireFloorplan, { once: true });
})();
