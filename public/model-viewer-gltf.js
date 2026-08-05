(() => {
  if (!location.pathname.startsWith('/model-viewer/')) return;

  const slug = location.pathname.split('/').filter(Boolean).pop();
  if (slug !== 'bahama-beach') return;

  const modelPath = `/models/3d/${slug}/${slug}.glb`;

  async function configureViewer() {
    const viewer = document.getElementById('house-model-viewer');
    const error = document.getElementById('viewer-error');
    const posterText = viewer?.querySelector('.viewer-poster p');
    const errorText = error?.querySelector('p');

    if (!viewer) return;

    if (!customElements.get('model-viewer')) {
      try {
        await import('https://unpkg.com/@google/model-viewer@4.2.0/dist/model-viewer.min.js');
        await customElements.whenDefined('model-viewer');
      } catch (loadError) {
        if (errorText) errorText.textContent = 'The 3D viewer library could not be loaded.';
        viewer.hidden = true;
        if (error) error.hidden = false;
        console.error('model-viewer library failed to load', loadError);
        return;
      }
    }

    const page = document.querySelector('.viewer-page');
    page?.setAttribute('data-model-src', modelPath);
    if (posterText) posterText.innerHTML = `Loading <code>${modelPath}</code>…`;

    viewer.addEventListener('load', () => {
      viewer.hidden = false;
      if (error) error.hidden = true;
      console.info('Bahama Beach GLB loaded', modelPath);
    }, { once: true });

    viewer.addEventListener('error', (event) => {
      viewer.hidden = true;
      if (error) error.hidden = false;
      if (errorText) {
        const detail = event?.detail?.type ? ` (${event.detail.type})` : '';
        errorText.innerHTML = `The model file was found but could not be rendered${detail}. Path: <code>${modelPath}</code>.`;
      }
      console.error('Bahama Beach GLB failed to render', event);
    }, { once: true });

    try {
      const response = await fetch(modelPath, { method: 'GET', cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const contentType = response.headers.get('content-type') || '';
      const buffer = await response.arrayBuffer();
      const header = new Uint8Array(buffer.slice(0, 4));
      const isGlb = header[0] === 0x67 && header[1] === 0x6c && header[2] === 0x54 && header[3] === 0x46;
      if (!isGlb) throw new Error(`Invalid GLB header; content-type ${contentType || 'unknown'}`);
      viewer.src = modelPath;
    } catch (assetError) {
      viewer.hidden = true;
      if (error) error.hidden = false;
      if (errorText) errorText.textContent = `The GLB asset could not be loaded: ${assetError.message}`;
      console.error('Bahama Beach GLB asset check failed', assetError);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', configureViewer, { once: true });
  } else {
    configureViewer();
  }
})();
