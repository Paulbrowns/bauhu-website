import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, '..');
const sourceRoot = process.env.BAUHU_IMAGE_SOURCE || path.resolve(repoRoot, '..', 'bauhu-media-source');
const publicImagesRoot = path.resolve(repoRoot, 'public', 'images');
const [, , requestedCollection, requestedItem] = process.argv;

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
    nested: true,
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

function isImageFile(fileName) {
  return validExtensions.has(path.extname(fileName).toLowerCase());
}

async function convertImage(inputPath, outputPath, config) {
  await ensureDirectory(path.dirname(outputPath));

  await sharp(inputPath)
    .rotate()
    .resize({ width: config.width, withoutEnlargement: true })
    .webp({ quality: config.quality })
    .toFile(outputPath);
}

async function importFlatCollection(name, config) {
  await ensureDirectory(config.output);

  const entries = await fs.readdir(config.source, { withFileTypes: true });
  const files = entries
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .filter(isImageFile)
    .filter((fileName) => !requestedItem || slugify(path.basename(fileName, path.extname(fileName))) === requestedItem)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const imported = [];

  for (const fileName of files) {
    const inputPath = path.join(config.source, fileName);
    const baseName = slugify(path.basename(fileName, path.extname(fileName)));
    const outputName = `${baseName}.webp`;
    const outputPath = path.join(config.output, outputName);

    await convertImage(inputPath, outputPath, config);

    imported.push(`/images/${name}/${outputName}`);
    console.log(`Imported ${name}/${fileName} -> public/images/${name}/${outputName}`);
  }

  if (requestedItem && imported.length === 0) {
    console.log(`No matching image found for ${name}/${requestedItem}`);
  }

  return imported;
}

async function importNestedModelCollection(name, config) {
  await ensureDirectory(config.output);

  const modelFolders = (await fs.readdir(config.source, { withFileTypes: true }))
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((folderName) => !requestedItem || folderName === requestedItem)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  const imported = [];

  if (requestedItem && modelFolders.length === 0) {
    console.log(`No matching model folder found at ${path.join(config.source, requestedItem)}`);
    return imported;
  }

  for (const folderName of modelFolders) {
    const sourceFolder = path.join(config.source, folderName);
    const outputFolder = path.join(config.output, folderName);
    const entries = await fs.readdir(sourceFolder, { withFileTypes: true });
    const files = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter(isImageFile)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    for (const fileName of files) {
      const inputPath = path.join(sourceFolder, fileName);
      const baseName = slugify(path.basename(fileName, path.extname(fileName)));
      const outputName = `${baseName}.webp`;
      const outputPath = path.join(outputFolder, outputName);

      await convertImage(inputPath, outputPath, config);

      imported.push(`/images/${name}/${folderName}/${outputName}`);
      console.log(`Imported ${name}/${folderName}/${fileName} -> public/images/${name}/${folderName}/${outputName}`);
    }
  }

  return imported;
}

async function importCollection(name, config) {
  if (!(await pathExists(config.source))) {
    console.log(`Skipping ${name}: source folder not found at ${config.source}`);
    return [];
  }

  if (config.nested) {
    return importNestedModelCollection(name, config);
  }

  return importFlatCollection(name, config);
}

function selectedCollections() {
  if (!requestedCollection) return Object.entries(collections);

  if (!collections[requestedCollection]) {
    throw new Error(`Unknown image collection: ${requestedCollection}. Valid collections are: ${Object.keys(collections).join(', ')}`);
  }

  return [[requestedCollection, collections[requestedCollection]]];
}

async function main() {
  console.log(`Using source image folder: ${sourceRoot}`);
  console.log('Set BAUHU_IMAGE_SOURCE to override this path.');

  if (requestedCollection) {
    console.log(`Import filter: ${requestedCollection}${requestedItem ? `/${requestedItem}` : ''}`);
  }

  let total = 0;

  for (const [name, config] of selectedCollections()) {
    const imported = await importCollection(name, config);
    total += imported.length;
  }

  console.log(`Done. Imported ${total} image${total === 1 ? '' : 's'}.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
