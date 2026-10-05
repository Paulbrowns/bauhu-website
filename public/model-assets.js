(() => {
  const page = document.querySelector('.home-detail[data-model-name][data-model-slug]');
  if (!page) return;

  const modelName = page.getAttribute('data-model-name') || '';
  const publicSlug = page.getAttribute('data-model-slug') || '';
  const assetSlug = modelName.startsWith('bauhu-') ? modelName : `bauhu-${publicSlug}`;
  const basePath = `/images/models/${assetSlug}`;

  const insertBefore = (section, selector) => {
    const target = document.querySelector(selector);
    if (target?.parentNode) {
      target.parentNode.insertBefore(section, target);
      return;
    }
    page.appendChild(section);
  };

  const titleCase = (value) => value
    .replace(/\.[^.]+$/, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const fileExists = async (url) => {
    try {
      const response = await fetch(url, { method: 'HEAD', cache: 'no-store' });
      return response.ok;
    } catch {
      return false;
    }
  };

  const loadManifest = async () => {
    try {
      const response = await fetch(`${basePath}/assets.json`, { cache: 'no-store' });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  };

  const conventionalVideos = ['1.mp4', '2.mp4', '3.mp4', '4.mp4', '5.mp4', '6.mp4', 'video.mp4', 'video-1.mp4', 'video-2.mp4'];
  const conventionalDownloads = [
    'floorplan.pdf',
    'floorplans.pdf',
    'plans.pdf',
    'architectural-plans.pdf',
    `${publicSlug}-floorplan.pdf`,
    `${publicSlug}-plans.pdf`,
    `${assetSlug}-floorplan.pdf`,
    `${assetSlug}-plans.pdf`,
  ];

  const normaliseManifestFiles = (files = []) => files
    .filter(Boolean)
    .map((fileName) => ({
      fileName,
      href: `${basePath}/${fileName}`,
      label: titleCase(fileName),
    }));

  const probeFiles = async (fileNames) => {
    const uniqueFiles = [...new Set(fileNames)];
    const results = [];

    for (const fileName of uniqueFiles) {
      const href = `${basePath}/${fileName}`;
      if (await fileExists(href)) {
        results.push({ fileName, href, label: titleCase(fileName) });
      }
    }

    return results;
  };

  const createVideoSection = (videos) => {
    if (!videos.length) return;

    const section = document.createElement('section');
    section.className = 'model-assets-section model-video-section';
    section.setAttribute('aria-label', `${assetSlug} videos`);
    section.innerHTML = `
      <div class="model-assets-heading">
        <p>Video</p>
        <h2>See the model in motion.</h2>
      </div>
      <div class="model-assets-grid"></div>
    `;

    const grid = section.querySelector('.model-assets-grid');
    videos.forEach((video) => {
      const figure = document.createElement('figure');
      figure.className = 'model-video-card';
      figure.innerHTML = `
        <video controls playsinline preload="metadata">
          <source src="${video.href}" type="${video.fileName.endsWith('.webm') ? 'video/webm' : 'video/mp4'}" />
        </video>
        <figcaption>${video.label}</figcaption>
      `;
      grid.appendChild(figure);
    });

    insertBefore(section, '.home-gallery');
  };

  const createDownloadSection = (downloads) => {
    if (!downloads.length) return;

    const section = document.createElement('section');
    section.className = 'model-assets-section model-download-section';
    section.setAttribute('aria-label', `${assetSlug} downloads`);
    section.innerHTML = `
      <div class="model-assets-heading">
        <p>Downloads</p>
        <h2>Reference documents for this model.</h2>
      </div>
      <div class="model-assets-grid"></div>
    `;

    const grid = section.querySelector('.model-assets-grid');
    downloads.forEach((download) => {
      const link = document.createElement('a');
      link.className = 'model-download-card';
      link.href = download.href;
      link.target = '_blank';
      link.rel = 'noopener';
      link.innerHTML = `<span>${download.label}</span><strong>Open PDF ↗</strong>`;
      grid.appendChild(link);
    });

    insertBefore(section, '.home-delivery');
  };

  const init = async () => {
    const manifest = await loadManifest();

    const videos = manifest?.videos?.length
      ? normaliseManifestFiles(manifest.videos)
      : await probeFiles(conventionalVideos);

    const downloads = manifest?.downloads?.length
      ? normaliseManifestFiles(manifest.downloads)
      : await probeFiles(conventionalDownloads);

    createVideoSection(videos);
    createDownloadSection(downloads);
  };

  init();
})();
