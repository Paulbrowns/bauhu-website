import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Project workflow routes are customer tools, not organic landing pages.
// Keep model detail pages, Interiors, Locations and editorial content indexable.
const nonIndexableRoutes = /^\/(?:site-fit|model-viewer|project-enquiry|project-summary|site-placement)(?:\/|$)/;

export default defineConfig({
  site: 'https://bauhu.com',
  integrations: [sitemap({ filter: (page) => !nonIndexableRoutes.test(new URL(page).pathname) })],
  output: 'static',
});
