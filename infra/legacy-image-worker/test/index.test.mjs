import test from 'node:test';
import assert from 'node:assert/strict';
import worker, { parseOriginalImagePath } from '../src/index.js';

function encoded(source, extra = '') {
  return 'https://test.workers.dev/pr:sharp/rs:fill:900/rot:0/wm:1/g:sm/' +
    Buffer.from(source).toString('base64url') + extra;
}

test('decodes a recovered original and redirects to the correct WebP', async () => {
  const url = encoded('http://bauhu.com/assets/images/angel-7.jpg');
  assert.equal(parseOriginalImagePath(url), '/assets/images/angel-7.jpg');
  const res = await worker.fetch(new Request(url));
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), 'https://bauhu.com/images/models/bauhu-angel/angel-7.webp');
});

test('handles extra .jpg suffix on encoded legacy URL', async () => {
  const url = encoded('http://bauhu.com/assets/images/firefly-11.jpg', '.jpg');
  const res = await worker.fetch(new Request(url));
  assert.equal(res.status, 301);
  assert.equal(res.headers.get('location'), 'https://bauhu.com/images/models/bauhu-firefly/firefly-11.webp');
});

test('supports plain format for exact recovered file', async () => {
  const url = 'https://test.workers.dev/pr:sharp/wm:1/g:sm/plain/http://bauhu.com/assets/images/angel-13.jpg';
  const res = await worker.fetch(new Request(url));
  assert.equal(res.status, 301);
});

test('does not redirect missing or unrelated image sources', async () => {
  for (const src of [
    'http://bauhu.com/assets/images/unknown.jpg',
    'http://evil.example/assets/images/angel-7.jpg',
    'http://bauhu.com/private/angel-7.jpg',
  ]) {
    assert.equal((await worker.fetch(new Request(encoded(src)))).status, 404);
  }
});

test('handles robots and disallows mutations', async () => {
  assert.equal((await worker.fetch(new Request('https://test.workers.dev/robots.txt'))).status, 200);
  assert.equal((await worker.fetch(new Request('https://test.workers.dev/', {method:'POST'}))).status, 405);
});
