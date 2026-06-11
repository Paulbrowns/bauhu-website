import fs from 'node:fs';
import path from 'node:path';

export type BauhuModel = {
  slug: string;
  name: string;
  style: 'Classic' | 'Contemporary' | 'Caribbean';
  guidePriceUsd: number | null;
  guidePriceUsdMax: number | null;
  guidePriceLabel: string;
  bedroomsMin: number | null;
  bedroomsMax: number | null;
  bedroomsLabel: string;
  bathroomsMin: number | null;
  bathroomsMax: number | null;
  bathroomsLabel: string;
  storeysMin: number | null;
  storeysMax: number | null;
  storeysLabel: string;
  builtAreaSqftMin: number | null;
  builtAreaSqftMax: number | null;
  builtAreaLabel: string;
  shortDescription: string;
  image: string;
};

type CsvRow = {
  name: string;
  style: string;
  guide_price_usd: string;
  bedrooms: string;
  bathrooms: string;
  Levels: string;
  total_built_area_sqft: string;
  short_description: string;
};

const csvPath = path.join(process.cwd(), 'src', 'data', 'models.csv');

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function displayName(value: string) {
  return value
    .trim()
    .replace(/^bauhu[-_\s]+/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .toUpperCase();
}

function parseNumber(value: string) {
  const cleaned = value.trim().replace(/,/g, '');
  if (!cleaned) return null;
  const number = Number(cleaned);
  return Number.isFinite(number) ? number : null;
}

function simpleNumberLabel(value: number | null) {
  if (value === null) return 'TBD';
  return Number.isInteger(value) ? `${value}` : `${value}`.replace(/0+$/, '').replace(/\.$/, '');
}

function areaLabel(value: number | null) {
  if (value === null) return 'TBD';
  return Number.isInteger(value) ? value.toLocaleString('en-US') : simpleNumberLabel(value);
}

function priceLabel(value: number | null) {
  if (value === null) return 'Price on request';
  return `Guide price $${value.toLocaleString('en-US')}`;
}

function cleanStyle(value: string): BauhuModel['style'] {
  const style = value.trim();
  if (style === 'Classic' || style === 'Caribbean' || style === 'Contemporary') return style;
  return 'Contemporary';
}

function parseCsv(content: string): CsvRow[] {
  const lines = content
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const [headerLine, ...bodyLines] = lines;
  const headers = headerLine.split(';').map((header) => header.trim());

  return bodyLines.map((line) => {
    const values = line.split(';');
    return headers.reduce((row, header, index) => {
      row[header as keyof CsvRow] = (values[index] ?? '').trim();
      return row;
    }, {} as CsvRow);
  });
}

function imageForModel(slug: string, bedrooms: number | null) {
  if (slug === 'bauhu-coconut-villa' && bedrooms !== null) {
    return `/images/models/${slug}-${simpleNumberLabel(bedrooms)}-bedroom.webp`;
  }

  return `/images/models/${slug}.webp`;
}

function toModel(row: CsvRow): BauhuModel {
  const slug = slugify(row.name);
  const price = parseNumber(row.guide_price_usd);
  const bedrooms = parseNumber(row.bedrooms);
  const bathrooms = parseNumber(row.bathrooms);
  const storeys = parseNumber(row.Levels);
  const builtArea = parseNumber(row.total_built_area_sqft);

  return {
    slug,
    name: displayName(row.name),
    style: cleanStyle(row.style),
    guidePriceUsd: price,
    guidePriceUsdMax: price,
    guidePriceLabel: priceLabel(price),
    bedroomsMin: bedrooms,
    bedroomsMax: bedrooms,
    bedroomsLabel: simpleNumberLabel(bedrooms),
    bathroomsMin: bathrooms,
    bathroomsMax: bathrooms,
    bathroomsLabel: simpleNumberLabel(bathrooms),
    storeysMin: storeys,
    storeysMax: storeys,
    storeysLabel: simpleNumberLabel(storeys),
    builtAreaSqftMin: builtArea,
    builtAreaSqftMax: builtArea,
    builtAreaLabel: areaLabel(builtArea),
    shortDescription: row.short_description,
    image: imageForModel(slug, bedrooms),
  };
}

export const bauhuModels: BauhuModel[] = parseCsv(fs.readFileSync(csvPath, 'utf8')).map(toModel);
