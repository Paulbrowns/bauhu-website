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
  'NOBILIA-SENSO-490': { supplier:'Nobilia',range:'Senso',variant:'490 · Premium honed alpine white',slot:'Kitchen front',image:'https://www.nobilia.de/fileadmin/_processed_/1/1/csm_front_senso_490_8ce9d6f859.webp',source:'https://www.nobilia.de/en/products/kitchens/modern-kitchens/senso-490/' },
  'NOBILIA-LASER-463': { supplier:'Nobilia',range:'Laser',variant:'463 · Black concrete reproduction',slot:'Kitchen front',image:'https://www.nobilia.de/fileadmin/_processed_/9/e/csm_front_laser_463_b2b1964c96.webp',source:'https://www.nobilia.de/en/products/kitchens/designer-kitchens/laser-463/' },
  'NOBILIA-NORDIC-788': { supplier:'Nobilia',range:'Nordic',variant:'788 · Perfect honed sand',slot:'Kitchen front',image:'https://www.nobilia.de/fileadmin/_processed_/d/b/csm_front_nordic_788_8d2af65c90.webp',source:'https://www.nobilia.de/en/products/kitchens/modern-cottage-style/nordic-788/' },
  'NOBILIA-NATURA-744': { supplier:'Nobilia',range:'Natura',variant:'744 · Oak Montreal reproduction',slot:'Kitchen front',image:'https://www.nobilia.de/fileadmin/_processed_/a/3/csm_front_natura_744_3194946265.webp',source:'https://www.nobilia.de/en/products/kitchens/natural-scandi/natura-744/' },
  'NOBILIA-CASCADA-774': { supplier:'Nobilia',range:'Cascada',variant:'774 · White',slot:'Kitchen front',image:'https://www.nobilia.de/fileadmin/_processed_/5/3/csm_front_cascada_774_22cb1ddf4c.webp',source:'https://www.nobilia.de/en/products/bathroom-designs/cascada-774/' },
  'NOBILIA-SYLT-848': { supplier:'Nobilia',range:'Sylt',variant:'848 · Sand Perfect matt',slot:'Kitchen front',image:'https://www.nobilia.de/fileadmin/_processed_/e/1/csm_front_sylt_848_61b7127943.webp',source:'https://www.nobilia.de/en/products/kitchens/modern-cottage-style/sylt-848/' },
} as const;

type SupplierProductImage = (typeof supplierProductImages)[keyof typeof supplierProductImages];
const chosenFronts: Record<string, keyof typeof supplierProductImages> = {
  'contemporary/pure': 'NOBILIA-SENSO-490',
  'contemporary/graphite': 'NOBILIA-LASER-463',
  'contemporary/mineral': 'NOBILIA-NORDIC-788',
  'signature/atelier': 'NOBILIA-NATURA-744',
  'signature/gallery': 'NOBILIA-SYLT-849',
  'signature/noir': 'NOBILIA-LASER-463',
  'tropical/canopy': 'NOBILIA-NATURA-744',
  'tropical/lagoon': 'NOBILIA-CASCADA-774',
  'tropical/terracotta': 'NOBILIA-SYLT-848'
};
export function verifiedSupplierImage(item: {supplier?:string;range?:string;slot?:string;finish?:string}, scheme?:string): SupplierProductImage | undefined {
  if (item.supplier==='Bruma'&&item.range==='Ginger'&&item.slot==='Kitchen faucet' && /chrome/i.test(item.finish||'')) return supplierProductImages['BRUMA-GINGER-1227003CR'];
  if (item.supplier==='Bruma'&&item.range==='Avalon'&&item.slot==='Basin faucet' && /chrome/i.test(item.finish||'')) return supplierProductImages['BRUMA-AVALON-1890101CR'];
  if (scheme==='signature/gallery'&&item.supplier==='Nobilia'&&item.slot==='Countertop') return supplierProductImages['NOBILIA-WORKTOP-376'];
  if (item.supplier==='Nobilia'&&item.slot==='Kitchen front'&&scheme&&chosenFronts[scheme]){
    const p=supplierProductImages[chosenFronts[scheme]];
    return p.range===item.range?p:undefined;
  }
  return undefined;
}
