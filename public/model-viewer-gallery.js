(() => {
  if (!location.pathname.startsWith('/model-viewer/')) return;

  const slug = location.pathname.split('/').filter(Boolean).pop();
  if (!slug) return;

  const page = document.querySelector('.viewer-page');
  const shell = document.querySelector('.viewer-shell');
  const aside = document.querySelector('.viewer-actions');
  if (!page || !shell || !aside) return;

  const modelFolder = `bauhu-${slug}`;
  const folder = `/images/models/${modelFolder}`;
  const heroSrc = `${folder}/${modelFolder}.webp`;
  const galleryCandidates = Array.from({ length: 9 }, (_, index) => `${folder}/${index + 1}.webp`);

  const style = document.createElement('style');
  style.textContent = `
    .viewer-actions .viewer-side-image{margin:.1rem 0 1.15rem;aspect-ratio:4/3;overflow:hidden;background:#d9ddd6}
    .viewer-actions .viewer-side-image img{display:block;width:100%;height:100%;object-fit:cover}
    .viewer-actions dl{display:none!important}
    .viewer-gallery{padding:1.4rem 4vw 2.2rem;background:#ebe9e2;border-top:1px solid rgba(23,57,76,.16)}
    .viewer-gallery[hidden]{display:none}
    .viewer-gallery-head{display:flex;align-items:end;justify-content:space-between;gap:1rem;margin-bottom:.85rem}
    .viewer-gallery-head h2{margin:0;font:400 clamp(1.8rem,3vw,2.7rem)/1 'Cormorant Garamond',serif;color:#17394c}
    .viewer-gallery-head p{margin:0;font:600 .62rem/1 Inter,sans-serif;letter-spacing:.14em;color:#9b7b49}
    .viewer-gallery-row{display:grid;grid-auto-flow:column;grid-auto-columns:minmax(230px,1fr);gap:.75rem;overflow-x:auto;scroll-snap-type:x mandatory;padding-bottom:.35rem}
    .viewer-gallery-item{margin:0;aspect-ratio:16/10;overflow:hidden;background:#d9ddd6;scroll-snap-align:start}
    .viewer-gallery-item img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .35s ease}
    .viewer-gallery-item:hover img{transform:scale(1.025)}
    @media(max-width:820px){.viewer-actions .viewer-side-image{aspect-ratio:16/9}.viewer-gallery{padding:1.2rem 1rem 1.8rem}.viewer-gallery-row{grid-auto-columns:minmax(76vw,1fr)}}
  `;
  document.head.appendChild(style);

  const heading = aside.querySelector('h2');
  if (heading && !aside.querySelector('.viewer-side-image')) {
    const figure = document.createElement('figure');
    figure.className = 'viewer-side-image';
    const image = document.createElement('img');
    image.src = heroSrc;
    image.alt = `${heading.textContent?.trim() || 'Bauhu home'} exterior`;
    image.loading = 'eager';
    image.decoding = 'async';
    image.addEventListener('error', () => figure.remove(), { once: true });
    figure.appendChild(image);
    heading.insertAdjacentElement('afterend', figure);
  }

  if (!document.querySelector('.viewer-gallery')) {
    const section = document.createElement('section');
    section.className = 'viewer-gallery';
    section.hidden = true;
    section.innerHTML = `
      <div class="viewer-gallery-head">
        <h2>More views</h2>
        <p>IMAGE GALLERY</p>
      </div>
      <div class="viewer-gallery-row"></div>
    `;

    const row = section.querySelector('.viewer-gallery-row');

    galleryCandidates.forEach((src, index) => {
      const figure = document.createElement('figure');
      figure.className = 'viewer-gallery-item';
      const image = document.createElement('img');
      image.src = src;
      image.alt = `${heading?.textContent?.trim() || 'Bauhu home'} view ${index + 1}`;
      image.loading = 'lazy';
      image.decoding = 'async';
      image.addEventListener('load', () => {
        section.hidden = false;
      }, { once: true });
      image.addEventListener('error', () => {
        figure.remove();
        if (!row?.children.length) section.remove();
      }, { once: true });
      figure.appendChild(image);
      row?.appendChild(figure);
    });

    shell.insertAdjacentElement('afterend', section);
  }
})();
