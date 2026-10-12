/**
 * Official supplier-hosted product imagery, selected from the manufacturer's live catalogue.
 * These images are linked directly (Bauhu has permission to use supplier photography).
 * Retain traceable official page + exact product / finish reference and verify before client approval.
 * Never infer URL patterns: only use a verified image URL.
 */
export const supplierProductImages = {
  'NOBILIA-SYLT-849': {
    supplier:'Nobilia', range:'Sylt', variant:'849 · Honed ivory', slot:'Kitchen front',
    image:'https://www.nobilia.de/fileadmin/_processed_/3/3/csm_front_sylt_849_76bac33f32.webp',
    source:'https://www.nobilia.de/en/products/kitchens/modern-cottage-style/sylt-849/'
  },
  'NOBILIA-WORKTOP-376': {
    supplier:'Nobilia', range:'Worktop', variant:'376 · Limestone reproduction', slot:'Countertop',
    image:'https://www.nobilia.de/fileadmin/_processed_/1/e/csm_376_5760d954c1.webp',
    source:'https://www.nobilia.de/en/products/kitchens/modern-cottage-style/sylt-849/'
  },
  'BRUMA-GINGER-1227003CR': {
    supplier:'Bruma', range:'Ginger', variant:'122 700 3 · CR Chrome', slot:'Kitchen faucet',
    image:'https://bruma.pt/_next/image?q=75&url=https%3A%2F%2Fnbg1.your-objectstorage.com%2Fbackupamos%2Fbruma%2F122%2520700%25203CR.jpg&w=1920',
    source:'https://bruma.pt/en/p/1922-sink-mixer-with-swivel-spout-and-pull-out-handshower---ginger'
  },
  'BRUMA-AVALON-1890101CR': {
    supplier:'Bruma', range:'Avalon', variant:'189 010 1 · CR Chrome', slot:'Basin faucet',
    image:'https://bruma.pt/_next/image?q=75&url=https%3A%2F%2Fnbg1.your-objectstorage.com%2Fbackupamos%2Fbruma%2F189%2520010%25201CR.webp&w=1920',
    source:'https://bruma.pt/en/p/599-basin-mixer'
  }
} as const;

type SupplierProductImage = (typeof supplierProductImages)[keyof typeof supplierProductImages];
const values: SupplierProductImage[] = Object.values(supplierProductImages);
export function verifiedSupplierImage(item: {supplier?:string;range?:string;slot?:string;finish?:string}, scheme?:string): SupplierProductImage | undefined {
  if (item.supplier==='Bruma'&&item.range==='Ginger'&&item.slot==='Kitchen faucet' && /chrome/i.test(item.finish||'')) return supplierProductImages['BRUMA-GINGER-1227003CR'];
  if (item.supplier==='Bruma'&&item.range==='Avalon'&&item.slot==='Basin faucet' && /chrome/i.test(item.finish||'')) return supplierProductImages['BRUMA-AVALON-1890101CR'];
  if (scheme==='signature/gallery'&&item.supplier==='Nobilia'&&item.range==='Sylt'&&item.slot==='Kitchen front') return supplierProductImages['NOBILIA-SYLT-849'];
  if (scheme==='signature/gallery'&&item.supplier==='Nobilia'&&item.slot==='Countertop') return supplierProductImages['NOBILIA-WORKTOP-376'];
  return undefined;
}
