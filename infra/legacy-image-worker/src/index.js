// Image recovery via private R2; does not reproduce historic Sharp transformations.
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
  const pos = url.pathname.indexOf('/g:sm/');
  if (!url.pathname.startsWith('/pr:sharp/') || pos < 0) return null;
  const encoded = url.pathname.slice(pos + '/g:sm/'.length);
  try {
    let original;
    if (encoded.startsWith('plain/')) {
      original = decodeURIComponent(encoded.slice(6));
    } else {
      const token = encoded.replace(/\.jpg$/i, '');
      if (!/^[a-zA-Z0-9_-]+={0,2}$/.test(token)) return null;
      original = atob(token.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(token.length / 4) * 4, '='));
    }
    const source = new URL(original);
    if (!['bauhu.com', 'www.bauhu.com'].includes(source.hostname)) return null;
    if (!['http:', 'https:'].includes(source.protocol)) return null;
    const segments = source.pathname.split('/');
    if (segments.some(part => part === '..' || part === '.')) return null;
    if (!source.pathname.startsWith('/assets/images/')) return null;
    return source.pathname;
  } catch {
    return null;
  }
}

function mimeType(key) {
  const ext = key.split('.').pop().toLowerCase();
  return ({jpg:'image/jpeg', jpeg:'image/jpeg', png:'image/png', webp:'image/webp', gif:'image/gif', avif:'image/avif'})[ext] || 'application/octet-stream';
}
const notFound = () => new Response('Legacy image not available', {status:404, headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'public, max-age=300'}});

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response('Method not allowed', {status:405,headers:{Allow:'GET, HEAD'}});
    }
    if (url.pathname === '/robots.txt') {
      return new Response('User-agent: *\nAllow: /\n', {headers:{'Content-Type':'text/plain; charset=utf-8'}});
    }
    const originalPath = parseOriginalImagePath(request.url);
    if (!originalPath) return notFound();

    // Exact image recovery from the private archive takes precedence. All
    // other legacy filenames can therefore work without individual mappings.
    if (env?.LEGACY_MEDIA) {
      const object = await env.LEGACY_MEDIA.get(originalPath.slice(1));
      if (object) {
        const headers = new Headers();
        object.writeHttpMetadata(headers);
        if (!headers.has('Content-Type')) headers.set('Content-Type', mimeType(originalPath));
        headers.set('Cache-Control', 'public, max-age=86400');
        headers.set('ETag', object.httpEtag);
        return new Response(request.method === 'HEAD' ? null : object.body, {status:200,headers});
      }
    }

    // Fallback for files known to exist on the new site. Only use exact matches.
    const replacement = REPLACEMENTS.get(originalPath);
    if (replacement) return new Response(null, {status:301,headers:{Location:'https://bauhu.com'+replacement,'Cache-Control':'public, max-age=3600'}});
    return notFound();
  }
};
