(() => {
  const root = document.querySelector('.home-detail[data-model-slug]');
  if (!root) return;

  const copyBySlug = {
    'jimmy-hill': {
      title: 'Contemporary living, seamless indoor-outdoor design.',
      paragraphs: [
        'Jimmy Hill is an architect-designed modular residence offering approximately 3,900 square feet of contemporary living space, with four or five bedrooms and a strong indoor-outdoor living concept.',
        'The design is defined by clean lines, expansive glass facades and open, light-filled spaces. Large sliding glass doors connect the open-plan ground floor with the outdoor living areas, while the upper level includes generously sized bedrooms with floor-to-ceiling windows.',
        'Sleek geometric forms, covered terraces and integrated shading elements give the home a refined modern character. Like all Bauhu homes, Jimmy Hill is designed around climate resilience, durable materials, energy efficiency and practical long-term comfort.'
      ]
    },
    jamaica: {
      title: 'A striking Caribbean villa beside the water.',
      paragraphs: [
        'Jamaica is based on Xenjoh Villa, the first Bauhu Homes villa constructed in Jamaica. It is a substantial seven-bedroom, seven-and-a-half-bathroom residence that blends contemporary design with the natural beauty of its coastal setting.',
        'The villa is arranged around generous indoor and outdoor living, with a swimming pool, bold pergola structures providing shade, and sun deck areas positioned to make the most of Caribbean Sea views.',
        'Just steps from calm bay waters, the design combines resort-style outdoor living with the resilience and precision of the Bauhu construction system.'
      ]
    }
  };

  const currentPublicSlug = root.dataset.modelSlug;
  const modelCopy = copyBySlug[currentPublicSlug];
  if (!modelCopy) return;

  const overview = root.querySelector('.home-overview');
  const heading = overview?.querySelector('h2');
  const copy = overview?.querySelector('.home-copy');
  if (!overview || !heading || !copy) return;

  heading.textContent = modelCopy.title;
  copy.replaceChildren(...modelCopy.paragraphs.map((text) => {
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    return paragraph;
  }));
})();
