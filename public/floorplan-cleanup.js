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

  wireFloorplan();
  window.addEventListener('load', wireFloorplan, { once: true });
})();
