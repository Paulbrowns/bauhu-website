(() => {
  if (!location.pathname.startsWith('/model-viewer/')) return;

  const slug = location.pathname.split('/').filter(Boolean).pop();
  if (!slug) return;

  const pairedGltfModels = new Set(['bahama-beach']);
  if (!pairedGltfModels.has(slug)) return;

  function configureViewer() {
    const viewer = document.getElementById('house-model-viewer');
    if (!viewer) return;

    const modelPath = `/models/3d/${slug}/${slug}.gltf`;
    viewer.setAttribute('src', modelPath);

    const page = document.querySelector('.viewer-page');
    page?.setAttribute('data-model-src', modelPath);

    const posterText = viewer.querySelector('.viewer-poster p');
    if (posterText) posterText.innerHTML = `Loading <code>${modelPath}</code>.`;

    const errorText = document.querySelector('#viewer-error p');
    if (errorText) {
      errorText.innerHTML = `Upload <code>${slug}.gltf</code> and <code>${slug}.bin</code> together in <code>public/models/3d/${slug}/</code>.`;
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', configureViewer, { once: true });
  } else {
    configureViewer();
  }
})();
