// Standalone Cloudflare Worker for legacy img.bauhu.com URLs.
// Does not touch the Cloudflare Pages site, its assets, or the old tunnel.
const REPLACEMENTS = new Map(Object.entries({
  '/assets/images/angel-13.jpg': '/images/models/bauhu-angel/angel-13.webp',
  '/assets/images/angel-7.jpg': '/images/models/bauhu-angel/angel-7.webp',
  '/assets/images/firefly-11.jpg': '/images/models/bauhu-firefly/firefly-11.webp',
  '/assets/images/firefly-4.jpg': '/images/models/bauhu-firefly/firefly-4.webp',
  '/assets/images/caribbean-cottage-18.jpg': '/images/models/bauhu-caribbean-cottage/caribbean-cottage-18.webp',
  '/assets/images/casa-lavanda20_900x506.jpg': '/images/models/bauhu-casa-lavanda/casa-lavanda20_900x506.webp',
  '/assets/images/north-beach2_900x506.jpg': '/images/models/bauhu-north-beach/north-beach2_900x506.webp',
  '/assets/images/red-hawk-ridge19_900x506.jpg': '/images/models/bauhu-red-hawk-ridge/red-hawk-ridge19_900x506.webp',
  '/assets/images/grenada-luxe-two-bed11_900x506.jpg': '/images/models/bauhu-grenada-luxe/grenada-luxe-two-bed11_900x506.webp',
  '/assets/images/coral-bay.jpg': '/images/models/bauhu-barbados-blue/coral-bay.webp',
  '/assets/images/whale-point34_900x506.jpg': '/images/models/bauhu-sailfish/whale-point34_900x506.webp'
}));

export function parseOriginalImagePath(requestUrl) {
  const url = new URL(requestUrl);
  const prefix = '/g:sm/';
  const pos = url.pathname.indexOf(prefix);
  if (!url.pathname.startsWith('/pr:sharp/') || pos === -1) return null;
  const encoded = url.pathname.slice(pos + prefix.length);
  let original;
  try {
    if (encoded.startsWith('plain/')) {
      original = decodeURIComponent(encoded.slice('plain/'.length));
    } else {
      // Old processor URLs sometimes append '.jpg' after the base64url token.
      const token = encoded.replace(/\.jpg$/i, '');
      if (!/^[a-zA-Z0-9_-]+={0,2}$/.test(token)) return null;
      const b64 = token.replace(/-/g, '+').replace(/_/g, '/');
      original = atob(b64.padEnd(Math.ceil(b64.length / 4) * 4, '='));
    }
    const source = new URL(original);
    if (!['bauhu.com', 'www.bauhu.com'].includes(source.hostname)) return null;
    if (!['http:', 'https:'].includes(source.protocol)) return null;
    if (!source.pathname.startsWith('/assets/images/')) return null;
    return source.pathname;
  } catch {
    return null;
  }
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    if (url.pathname === '/robots.txt') {
      return new Response('User-agent: *\nAllow: /\n', {
        headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=3600' }
      });
    }
    const path = parseOriginalImagePath(request.url);
    const replacement = path && REPLACEMENTS.get(path);
    if (!replacement) {
      // Deliberately do not redirect unknown photographs to unrelated model heroes.
      return new Response('Legacy image not available', {
        status: 404, headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=300' }
      });
    }
    return new Response(null, {
      status: 301,
      headers: {
        Location: 'https://bauhu.com' + replacement,
        'Cache-Control': 'public, max-age=3600'
      }
    });
  }
};
