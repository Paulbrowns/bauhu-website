(() => {
  const root = document.querySelector('.home-detail[data-model-slug]');
  if (!root) return;

  const currentPublicSlug = root.dataset.modelSlug;
  const currentSlug = `bauhu-${currentPublicSlug}`;
  const target = root.querySelector('.home-enquiry-block');
  if (!target || document.querySelector('.related-models-panel')) return;

  const titleCase = (value) => value
    .replace(/^bauhu-/, '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const models = [
    ['bauhu-sky','Contemporary',2,900,'Compact minimalist open-plan home with modern aesthetics'],
    ['bauhu-arc','Contemporary',3,894,'Compact three-bedroom contemporary home with open-plan living and covered terrace'],
    ['bauhu-ice','Contemporary',2,894,'Two-bedroom contemporary home with open-plan living and covered terraces'],
    ['bauhu-eon','Contemporary',3,894,'Three-bedroom contemporary home with open-plan living and a covered terrace'],
    ['bauhu-zen','Contemporary',2,872,'Two-bedroom contemporary home with open-plan living and exterior decks'],
    ['bauhu-air','Contemporary',2,872,'Two-bedroom contemporary home with open-plan living and exterior decks'],
    ['bauhu-abaco','Classic',4,3700,'Spacious family home in Caribbean colonial style'],
    ['bauhu-azure','Caribbean',2,1300,'Hurricane-resistant two-bedroom island home'],
    ['bauhu-angel','Contemporary',3,1500,'Contemporary sustainable design with expansive covered terrace'],
    ['bauhu-jade','Contemporary',4,3563,'Sleek modern luxury villa with cutting-edge design'],
    ['bauhu-amber','Contemporary',4,3660,'High-end architectural villa with innovative materials'],
    ['bauhu-topaz','Contemporary',4,3724,'Ultra-luxury design with sustainable features'],
    ['bauhu-moonstone','Contemporary',4,4680,'Luxury villa with premium finishes and amenities'],
    ['bauhu-cat-island','Contemporary',2,1450,'Elegant elevated contemporary villa'],
    ['bauhu-caribbean-cottage','Classic',1,650,'Compact vacation rental or guest house with covered terrace'],
    ['bauhu-coconut-cottage','Classic',2,862,'Charming small home or guest cottage with character'],
    ['bauhu-coconut-villa-2','Classic',2,1230,'Single-floor family home with open-plan living'],
    ['bauhu-coconut-villa-3','Classic',3,1377,'Three-bedroom island villa with open-plan living'],
    ['bauhu-charlston','Caribbean',2,1238,'Elevated Caribbean villa with wrap-around terrace'],
    ['bauhu-bahama-beach','Classic',3,1140,'Three-bedroom coastal home with island-style roof'],
    ['bauhu-grapetree','Classic',3,1850,'Well-proportioned three-bedroom family home'],
    ['bauhu-skyline','Contemporary',4,5700,'Large modern multi-storey luxury villa'],
    ['bauhu-sailfish','Classic',3,2260,'Luxurious villa with covered terrace'],
    ['bauhu-barbados-blue','Classic',2,1281,'Contemporary home with spacious bedroom suites'],
    ['bauhu-sunset-cove','Classic',2,1800,'Spacious open-plan home with expansive covered terrace'],
    ['bauhu-falcon-500','Contemporary',2,500,'Entry-level standalone home with hurricane-safe standards'],
    ['bauhu-falcon-900','Classic',3,900,'Compact modern home with high-end fixtures'],
    ['bauhu-falcon-1800','Classic',3,1800,'Single-storey duplex with two self-contained apartments'],
    ['bauhu-falcon-3500','Classic',1,900,'Two-storey building with four self-contained apartments'],
    ['bauhu-horizon','Contemporary',3,1900,'Sophisticated design personalised to individual taste'],
    ['bauhu-halo','Contemporary',3,2420,'Well-proportioned family home with covered veranda'],
    ['bauhu-casita','Contemporary',2,1260,'Two-bedroom home with pool-facing living spaces'],
    ['bauhu-chameleon','Contemporary',3,1085,'Compact three-bedroom home with unique covered terrace'],
    ['bauhu-toucan','Contemporary',3,1529,'Hurricane-resistant sustainable home'],
    ['bauhu-hawks-cay-villa','Contemporary',2,1486,'Elegant home with shade screens'],
    ['bauhu-jimmy-hill','Contemporary',4,3980,'Architect-designed contemporary home with seamless indoor-outdoor living'],
    ['bauhu-firefly','Contemporary',3,2000,'Spacious open-plan home with covered dining terrace'],
    ['bauhu-high-ridge','Contemporary',3,2153,'Classic contemporary architecture with modern interior'],
    ['bauhu-jamaica','Contemporary',7,4200,'Spacious ultra-stylish villa with roof garden'],
    ['bauhu-providence','Classic',4,2230,'Four-bedroom home with spacious open-plan living'],
    ['bauhu-st-thomas','Contemporary',4,2900,'Classic contemporary architecture with modern interior design'],
    ['bauhu-quinta','Contemporary',3,3230,'Contemporary villa with expansive open-plan living'],
    ['bauhu-son-faro','Contemporary',2,1937,'Sophisticated single-storey villa design'],
    ['bauhu-cap-dantibes','Contemporary',5,5486,'Custom distinctive design with personalised finishes'],
    ['bauhu-casa-lavanda','Contemporary',4,5145,'Custom distinctive design with personalised finishes'],
    ['bauhu-grenada-luxe','Contemporary',1,800,'Stylish guest suite with roof garden option'],
    ['bauhu-serenity-heights','Contemporary',4,3768,'Contemporary two-storey home with optional guest suite'],
    ['bauhu-nova','Contemporary',4,3500,'Stylish modern villa designed for sloping sites'],
    ['bauhu-north-beach','Contemporary',4,2530,'Spacious home with unique architectural detailing'],
    ['bauhu-palmetto','Contemporary',3,3000,'Classic island style villa'],
    ['bauhu-emerald-bay','Contemporary',8,5534,'Architect-designed multi-resident condominium building'],
    ['bauhu-red-hawk-ridge','Contemporary',3,2470,'Custom distinctive design with personalised finishes'],
    ['bauhu-28','Contemporary',1,301,'Hurricane-resistant modular hospitality pod'],
    ['bauhu-36','Contemporary',1,387,'Hurricane-resistant hospitality pod with bedroom and bathroom'],
    ['bauhu-39','Contemporary',1,419,'Hurricane-resistant pod with en-suite bedroom'],
    ['bauhu-44','Contemporary',2,473,'Hurricane-resistant hospitality pod with two bedrooms']
  ].map(([slug, style, bedrooms, area, description]) => ({ slug, style, bedrooms, area, description }));

  const current = models.find((model) => model.slug === currentSlug);
  if (!current) return;

  const modelVideos = {
    firefly: {
      src: '/videos/firefly.mp4',
      label: 'Experience Firefly',
      title: 'See the model in motion.',
      ariaLabel: 'Firefly video',
    },
  };

  const modelVideo = modelVideos[currentPublicSlug];
  if (modelVideo && !document.querySelector('.home-film')) {
    const gallery = root.querySelector('.home-gallery');
    if (gallery) {
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
      gallery.parentNode.insertBefore(film, gallery);
    }
  }

  const related = models
    .filter((model, index, all) => model.slug !== current.slug && all.findIndex((item) => item.slug === model.slug) === index)
    .map((model) => {
      const styleScore = model.style === current.style ? 100 : 0;
      const bedScore = Math.max(0, 45 - Math.abs(model.bedrooms - current.bedrooms) * 15);
      const areaScore = Math.max(0, 45 - Math.abs(model.area - current.area) / 90);
      return { ...model, score: styleScore + bedScore + areaScore };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);

  if (related.length < 3) return;

  const panel = document.createElement('section');
  panel.className = 'related-models-panel';
  panel.setAttribute('aria-label', 'Similar Bauhu models');
  panel.innerHTML = `
    <div class="related-models-inner">
      <div class="related-models-heading">
        <div>
          <p class="home-kicker">You may also like</p>
          <h2>Explore similar Bauhu residences.</h2>
        </div>
      </div>
      <div class="related-models-grid">
        ${related.map((model) => {
          const publicSlug = model.slug.replace(/^bauhu-/, '');
          return `
            <a class="related-model-card" href="/homes/${publicSlug}/">
              <figure><img src="/images/models/${model.slug}/${model.slug}.webp" alt="${titleCase(model.slug)} Bauhu model" loading="lazy" onerror="this.src='/images/model-placeholder.svg'"></figure>
              <div class="related-model-card-copy">
                <h3>${titleCase(model.slug)}</h3>
                <p>${model.description}</p>
                <div class="related-model-meta"><span>${model.bedrooms} bed</span><span>${model.area.toLocaleString()} ft²</span><span>${model.style}</span></div>
              </div>
            </a>
          `;
        }).join('')}
      </div>
    </div>
  `;

  target.parentNode.insertBefore(panel, target);
})();
