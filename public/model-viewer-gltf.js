(() => {
  if (!location.pathname.startsWith('/model-viewer/')) return;

  const slug = location.pathname.split('/').filter(Boolean).pop();
  if (slug !== 'bahama-beach') return;

  const modelPath = `/models/3d/${slug}/${slug}.glb`;

  function makeStatus(stage) {
    let status = document.getElementById('viewer-live-status');
    if (status) return status;

    status = document.createElement('div');
    status.id = 'viewer-live-status';
    status.style.cssText = [
      'position:absolute','inset:1rem auto auto 1rem','z-index:20',
      'max-width:min(560px,calc(100% - 2rem))','padding:.75rem .9rem',
      'background:rgba(247,245,239,.96)','border:1px solid rgba(23,57,76,.22)',
      'color:#17394c','font:600 12px/1.45 Inter,sans-serif',
      'box-shadow:0 8px 24px rgba(23,57,76,.12)'
    ].join(';');
    status.textContent = 'Preparing 3D viewer…';
    stage.appendChild(status);
    return status;
  }

  async function ensureLibrary() {
    if (customElements.get('model-viewer')) return;
    if (!document.querySelector('script[data-bauhu-model-viewer]')) {
      const script = document.createElement('script');
      script.type = 'module';
      script.dataset.bauhuModelViewer = 'true';
      script.src = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@4.2.0/dist/model-viewer.min.js';
      document.head.appendChild(script);
    }
    await Promise.race([
      customElements.whenDefined('model-viewer'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('3D viewer library timed out')), 15000))
    ]);
  }

  async function start() {
    const stage = document.querySelector('.viewer-stage');
    const oldViewer = document.getElementById('house-model-viewer');
    const oldError = document.getElementById('viewer-error');
    if (!stage) return;

    const status = makeStatus(stage);
    status.textContent = 'Checking 3D model file…';

    try {
      const response = await fetch(modelPath, { cache: 'no-store' });
      if (!response.ok) throw new Error(`model request returned HTTP ${response.status}`);
      const reader = response.body?.getReader();
      const first = reader ? await reader.read() : null;
      if (reader) await reader.cancel();
      const bytes = first?.value || new Uint8Array(await response.arrayBuffer());
      if (bytes.length < 4 || bytes[0] !== 0x67 || bytes[1] !== 0x6c || bytes[2] !== 0x54 || bytes[3] !== 0x46) {
        throw new Error('file is not a valid GLB binary');
      }

      status.textContent = 'Loading 3D viewer library…';
      await ensureLibrary();

      const viewer = document.createElement('model-viewer');
      viewer.id = 'house-model-viewer-live';
      viewer.setAttribute('src', modelPath);
      viewer.setAttribute('alt', 'Interactive 3D model of Bahama Beach');
      viewer.setAttribute('camera-controls', '');
      viewer.setAttribute('touch-action', 'pan-y');
      viewer.setAttribute('shadow-intensity', '1');
      viewer.setAttribute('shadow-softness', '.8');
      viewer.setAttribute('exposure', '1.15');
      viewer.setAttribute('environment-image', 'neutral');
      viewer.setAttribute('interaction-prompt', 'auto');
      viewer.setAttribute('loading', 'eager');
      viewer.setAttribute('reveal', 'auto');
      viewer.setAttribute('field-of-view', '35deg');
      viewer.style.cssText = 'display:block;width:100%;height:100%;min-height:720px;background:transparent';

      viewer.addEventListener('load', async () => {
        try {
          await viewer.updateComplete;
          const dimensions = viewer.getDimensions?.();
          const box = viewer.getBoundingBox?.();
          const center = box?.getCenter?.();

          if (center && Number.isFinite(center.x) && Number.isFinite(center.y) && Number.isFinite(center.z)) {
            viewer.cameraTarget = `${center.x}m ${center.y}m ${center.z}m`;
          } else {
            viewer.cameraTarget = 'auto auto auto';
          }

          viewer.cameraOrbit = '35deg 68deg 110%';
          viewer.jumpCameraToGoal?.();

          if (dimensions) {
            const x = Number(dimensions.x).toFixed(2);
            const y = Number(dimensions.y).toFixed(2);
            const z = Number(dimensions.z).toFixed(2);
            status.textContent = `3D model loaded — size ${x} × ${y} × ${z} m`;
          } else {
            status.textContent = '3D model loaded — camera framed automatically';
          }

          setTimeout(() => status.remove(), 8000);
        } catch (cameraError) {
          status.textContent = `Model loaded, but camera framing failed: ${cameraError.message}`;
          console.error('Camera framing failed', cameraError);
        }
      }, { once: true });

      viewer.addEventListener('error', (event) => {
        const type = event?.detail?.type || 'rendering error';
        status.textContent = `3D model failed to render: ${type}`;
        status.style.background = '#fff1ee';
        status.style.borderColor = '#b54a35';
        console.error('model-viewer error', event);
      });

      oldViewer?.remove();
      if (oldError) oldError.hidden = true;
      stage.prepend(viewer);
      status.textContent = 'Loading 17 MB 3D model…';
    } catch (error) {
      status.textContent = `3D viewer error: ${error.message}`;
      status.style.background = '#fff1ee';
      status.style.borderColor = '#b54a35';
      if (oldViewer) oldViewer.hidden = true;
      if (oldError) oldError.hidden = true;
      console.error('Bahama Beach viewer failed', error);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
