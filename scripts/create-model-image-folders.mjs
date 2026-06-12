import fs from 'node:fs';
import path from 'node:path';

const repoRoot = process.cwd();
const csvPath = path.join(repoRoot, 'src', 'data', 'models.csv');
const websiteModelsDir = path.join(repoRoot, 'public', 'images', 'models');
const mediaSourceModelsDir = path.resolve(repoRoot, '..', 'bauhu-media-source', 'models');
const placeholderContent = '';

function slugify(value) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function parseCsv(content) {
  const lines = content
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const [headerLine, ...bodyLines] = lines;
  const headers = headerLine.split(';').map((header) => header.trim());
  const nameIndex = headers.indexOf('name');

  if (nameIndex === -1) {
    throw new Error('Could not find a `name` column in src/data/models.csv');
  }

  return bodyLines.map((line) => slugify((line.split(';')[nameIndex] ?? '').trim())).filter(Boolean);
}

function ensureFile(filePath, content = placeholderContent) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
  }
}

function ensureModelFolder(baseDir, slug, includePlaceholders = false) {
  const modelDir = path.join(baseDir, slug);
  fs.mkdirSync(modelDir, { recursive: true });

  if (includePlaceholders) {
    [
      `${slug}.webp`,
      '1.webp',
      '2.webp',
      '3.webp',
      '4.webp',
      'floorplan.webp',
    ].forEach((filename) => ensureFile(path.join(modelDir, filename)));
  }

  ensureFile(
    path.join(modelDir, 'README.md'),
    `# ${slug}\n\nExpected files:\n\n- ${slug}.webp\n- 1.webp\n- 2.webp\n- 3.webp\n- 4.webp\n- floorplan.webp\n`
  );
}

const slugs = parseCsv(fs.readFileSync(csvPath, 'utf8'));

fs.mkdirSync(websiteModelsDir, { recursive: true });
fs.mkdirSync(mediaSourceModelsDir, { recursive: true });

slugs.forEach((slug) => {
  ensureModelFolder(websiteModelsDir, slug, false);
  ensureModelFolder(mediaSourceModelsDir, slug, false);
});

console.log(`Created or checked ${slugs.length} model folders.`);
console.log(`Website target: ${websiteModelsDir}`);
console.log(`Media source target: ${mediaSourceModelsDir}`);
