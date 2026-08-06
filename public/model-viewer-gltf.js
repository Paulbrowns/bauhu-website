(() => {
  if (!location.pathname.startsWith('/model-viewer/')) return;
  const slug = location.pathname.split('/').filter(Boolean).pop();
  const supportedModels = new Set(['bahama-beach', 'coconut-villa-2']);
  if (!slug || !supportedModels.has(slug)) return;

  const modelPath = `/models/3d/${slug}/${slug}.glb`;
  const modelName = slug.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
  const defaultOrbit = '35deg 68deg 110%';
  const defaultTarget = 'auto auto auto';
  const defaultFov = '35deg';

  function statusBox(stage) {
    const box = document.createElement('div');
    box.id = 'viewer-live-status';
    box.style.cssText = 'position:absolute;left:1rem;top:1rem;z-index:30;padding:.75rem .9rem;max-width:calc(100% - 2rem);background:rgba(247,245,239,.96);border:1px solid rgba(23,57,76,.22);color:#17394c;font:600 12px/1.45 Inter,sans-serif;box-shadow:0 8px 24px rgba(23,57,76,.12)';
    box.textContent = 'Loading 3D model…';
    stage.appendChild(box);
    return box;
  }

  async function ensureLibrary() {
    if (customElements.get('model-viewer')) return;
    const script = document.createElement('script');
    script.type = 'module';
    script.src = 'https://cdn.jsdelivr.net/npm/@google/model-viewer@4.2.0/dist/model-viewer.min.js';
    document.head.appendChild(script);
    await Promise.race([
      customElements.whenDefined('model-viewer'),
      new Promise((_, reject) => setTimeout(() => reject(new Error('viewer library timed out')), 15000))
    ]);
  }

  function bindControls(viewer) {
    const reset = document.getElementById('reset-view');
    const rotate = document.getElementById('toggle-autorotate');
    const fullscreen = document.getElementById('fullscreen-view');

    reset?.addEventListener('click', () => {
      viewer.autoRotate = false;
      viewer.cameraTarget = defaultTarget;
      viewer.cameraOrbit = defaultOrbit;
      viewer.fieldOfView = defaultFov;
      viewer.jumpCameraToGoal?.();
      if (rotate) {
        rotate.setAttribute('aria-pressed', 'false');
        rotate.textContent = 'Auto rotate';
      }
    });

    rotate?.addEventListener('click', () => {
      viewer.autoRotate = !viewer.autoRotate;
      rotate.setAttribute('aria-pressed', String(viewer.autoRotate));
      rotate.textContent = viewer.autoRotate ? 'Stop rotation' : 'Auto rotate';
    });

    fullscreen?.addEventListener('click', () => {
      document.querySelector('.viewer-stage')?.requestFullscreen?.();
    });
  }

  async function start() {
    const stage = document.querySelector('.viewer-stage');
    if (!stage) return;

    document.getElementById('viewer-error')?.remove();
    document.getElementById('house-model-viewer')?.remove();

    const status = statusBox(stage);

    try {
      const response = await fetch(modelPath, { cache: 'no-store' });
      if (!response.ok) throw new Error(`GLB request returned HTTP ${response.status}`);
      const buffer = await response.arrayBuffer();
      const bytes = new Uint8Array(buffer, 0, Math.min(4, buffer.byteLength));
      if (bytes.length < 4 || bytes[0] !== 0x67 || bytes[1] !== 0x6c || bytes[2] !== 0x54 || bytes[3] !== 0x46) {
        throw new Error('file is not a valid GLB binary');
      }

      status.textContent = 'Loading 3D viewer…';
      await ensureLibrary();

      const viewer = document.createElement('model-viewer');
      viewer.id = 'house-model-viewer-live';
      viewer.src = modelPath;
      viewer.alt = `Interactive 3D model of ${modelName}`;
      viewer.setAttribute('camera-controls', '');
      viewer.setAttribute('touch-action', 'pan-y');
      viewer.setAttribute('shadow-intensity', '1');
      viewer.setAttribute('shadow-softness', '.8');
      viewer.setAttribute('exposure', '1.15');
      viewer.setAttribute('environment-image', 'neutral');
      viewer.setAttribute('loading', 'eager');
      viewer.setAttribute('reveal', 'auto');
      viewer.setAttribute('field-of-view', defaultFov);
      viewer.style.cssText = 'display:block;width:100%;height:100%;min-height:720px;background:transparent';

      bindControls(viewer);

      viewer.addEventListener('load', async () => {
        await viewer.updateComplete;
        viewer.cameraTarget = defaultTarget;
        viewer.cameraOrbit = defaultOrbit;
        viewer.fieldOfView = defaultFov;
        viewer.jumpCameraToGoal?.();
        const dimensions = viewer.getDimensions?.();
        status.textContent = dimensions
          ? `3D model loaded — ${Number(dimensions.x).toFixed(2)} × ${Number(dimensions.y).toFixed(2)} × ${Number(dimensions.z).toFixed(2)} m`
          : '3D model loaded';
        setTimeout(() => status.remove(), 8000);
      }, { once: true });

      viewer.addEventListener('error', (event) => {
        status.textContent = `3D render error: ${event?.detail?.type || 'unknown error'}`;
        status.style.background = '#fff1ee';
        status.style.borderColor = '#b54a35';
      });

      stage.prepend(viewer);
      status.textContent = `Loading ${(buffer.byteLength / 1048576).toFixed(1)} MB 3D model…`;
    } catch (error) {
      status.textContent = `3D viewer error: ${error.message}`;
      status.style.background = '#fff1ee';
      status.style.borderColor = '#b54a35';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true });
  } else {
    start();
  }
})();
