import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const sourceRoot = process.env.BAUHU_IMAGE_SOURCE || path.resolve(repoRoot, '..', 'bauhu-media-source');
const publicImagesRoot = path.resolve(repoRoot, 'public', 'images');

const collections = {
  home: {
    source: path.join(sourceRoot, 'home'),
    output: path.join(publicImagesRoot, 'home'),
    width: 2000,
    quality: 84,
  },
  residences: {
    source: path.join(sourceRoot, 'residences'),
    output: path.join(publicImagesRoot, 'residences'),
    width: 1800,
    quality: 82,
  },
  developments: {
    source: path.join(sourceRoot, 'developments'),
    output: path.join(publicImagesRoot, 'developments'),
    width: 1800,
    quality: 82,
  },
  projects: {
    source: path.join(sourceRoot, 'projects'),
    output: path.join(publicImagesRoot, 'projects'),
    width: 1800,
    quality: 82,
  },
  models: {
    source: path.join(sourceRoot, 'models'),
    output: path.join(publicImagesRoot, 'models'),
    width: 1600,
    quality: 80,
  },
  engineering: {
    source: path.join(sourceRoot, 'engineering'),
    output: path.join(publicImagesRoot, 'engineering'),
    width: 1600,
    quality: 80,
  },
};

const validExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff']);

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function ensureDirectory(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

async function importCollection(name, config) {
  if (!(await pathExists(config.source))) {
    console.log(`Skipping ${name}: source folder not found at ${config.source}`);
    return [];
  }

  await ensureDirectory(config.output);

  const entries = await fs.readdir(config.source, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter((fileName) => validExtensions.has(path.extname(fileName).toLowerCase()))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const imported = [];

  for (const fileName of files) {
    const inputPath = path.join(config.source, fileName);
    const baseName = slugify(path.basename(fileName, path.extname(fileName)));
    const outputName = `${baseName}.webp`;
    const outputPath = path.join(config.output, outputName);

    await sharp(inputPath)
      .rotate()
      .resize({ width: config.width, withoutEnlargement: true })
      .webp({ quality: config.quality })
      .toFile(outputPath);

    imported.push(`/images/${name}/${outputName}`);
    console.log(`Imported ${name}/${fileName} -> public/images/${name}/${outputName}`);
  }

  return imported;
}

async function main() {
  console.log(`Using source image folder: ${sourceRoot}`);
  console.log('Set BAUHU_IMAGE_SOURCE to override this path.');

  let total = 0;

  for (const [name, config] of Object.entries(collections)) {
    const imported = await importCollection(name, config);
    total += imported.length;
  }

  console.log(`Done. Imported ${total} image${total === 1 ? '' : 's'}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
