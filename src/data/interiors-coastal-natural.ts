/**
 * Bauhu Coastal Natural / curated first-pass candidate schedule.
 * This is a selection proposal, not a final approved procurement schedule.
 * Items with status "confirmed-rule" follow client-specified Bauhu range restrictions.
 * Items with status "candidate" require exact SKU, colour, dimensions and product photography.
 */
export const coastalNatural = {
  id:'BAU-COA-01',
  name:'Coastal Natural',
  hero:'/images/residences/luxuma-living-area.webp',
  boards:[
    {id:'finishes',title:'Finishes',subtitle:'Natural stone tones, warm whites, crisp detailing',items:[
      {slot:'floor-tile',bauhuId:'BAU-COA01-FIN-001',label:'Floor tile',supplier:'Dominó',range:'Ecoliving',model:null,finish:null,image:null,status:'candidate'},
      {slot:'wall-tile',bauhuId:'BAU-COA01-FIN-002',label:'Wall tile',supplier:'Dominó',range:'Tokyo',model:null,finish:null,image:null,status:'candidate'},
      {slot:'paint-walls',bauhuId:'BAU-COA01-FIN-003',label:'Wall paint',supplier:'CIN',range:'Cináqua GC 300',model:'10300',finish:'Warm off-white — final CIN shade pending',image:null,status:'confirmed-rule'},
      {slot:'paint-ceilings',bauhuId:'BAU-COA01-FIN-004',label:'Ceiling paint',supplier:'CIN',range:'Cináqua GC 300',model:'10300',finish:'White — exact shade pending',image:null,status:'confirmed-rule'},
      {slot:'render',bauhuId:'BAU-COA01-FIN-005',label:'Exterior render',supplier:'Sto',range:'Stolit K fine grain',model:'RAL 9003',finish:'Signal White',image:null,status:'confirmed-rule',fixed:true},
      {slot:'frames',bauhuId:'BAU-COA01-FIN-006',label:'Windows and exterior doors',supplier:'Cortizo',range:'Aluminium frames',model:'RAL 9010',finish:'Pure White',image:null,status:'confirmed-rule'},
      {slot:'interior-door',bauhuId:'BAU-COA01-FIN-007',label:'Interior doors',supplier:'Compincar',range:'Lisa',model:null,finish:'Matt white proposal',image:null,status:'candidate'}
    ]},
    {id:'kitchens',title:'Kitchens',subtitle:'Quiet cabinetry, pale stone and clean metal accents',items:[
      {slot:'front',bauhuId:'BAU-COA01-KIT-001',label:'Kitchen fronts',supplier:'Nobilia',range:'LASER',model:'418',finish:'Ivory matt',image:'https://www.nobilia.de/fileadmin/_processed_/4/c/csm_418_laser_g1_c7ec336585.webp',url:'https://www.nobilia.de/en/products/kitchens/modern-kitchens/laser-418/',status:'manufacturer-reference'},
      {slot:'handles',bauhuId:'BAU-COA01-KIT-002',label:'Cabinet handles',supplier:'Nobilia',range:'Coordinated handle',model:null,finish:'Minimal metal',image:null,status:'candidate'},
      {slot:'countertop',bauhuId:'BAU-COA01-KIT-003',label:'Countertop',supplier:'Nobilia',range:'Limestone reproduction laminate',model:'376',finish:'Light stone-effect',image:null,status:'documented-example'},
      {slot:'sink',bauhuId:'BAU-COA01-KIT-004',label:'Kitchen sink',supplier:'Schock / Bauhu kitchen supply',range:'To be selected',model:null,finish:'Neutral sink',image:null,status:'candidate'},
      {slot:'faucet',bauhuId:'BAU-COA01-KIT-005',label:'Kitchen faucet',supplier:'Bruma',range:'Ginger',model:'1227003',finish:'Chrome',image:null,status:'confirmed-rule'}
    ]},
    {id:'bathrooms',title:'Bathrooms',subtitle:'White sanitaryware and a carefully coordinated faucet suite',items:[
      {slot:'vanity',bauhuId:'BAU-COA01-BTH-001',label:'Vanity furniture',supplier:'Kitbanho',range:'Olimpo',model:null,finish:'Light neutral proposal',image:null,status:'candidate'},
      {slot:'basin',bauhuId:'BAU-COA01-BTH-002',label:'Washbasin',supplier:'Kitbanho',range:'Kloss STD alt.10',model:null,finish:'White',image:null,status:'manufacturer-reference'},
      {slot:'basin-tap',bauhuId:'BAU-COA01-BTH-003',label:'Basin faucet',supplier:'Bruma',range:'Nautic',model:null,finish:'Chrome',image:null,status:'candidate',matchGroup:'bathroom-taps'},
      {slot:'shower-tap',bauhuId:'BAU-COA01-BTH-004',label:'Shower faucet',supplier:'Bruma',range:'Nautic',model:null,finish:'Chrome',image:null,status:'candidate',matchGroup:'bathroom-taps'},
      {slot:'wall-tile',bauhuId:'BAU-COA01-BTH-005',label:'Bathroom wall tile',supplier:'Dominó',range:'Tokyo',model:null,finish:null,image:null,status:'candidate'},
      {slot:'toilet',bauhuId:'BAU-COA01-BTH-006',label:'Toilet',supplier:'Sanindusa',range:'URB.Y close coupled',model:'140052004',finish:'White',image:null,status:'confirmed-rule'},
      {slot:'shower-tray',bauhuId:'BAU-COA01-BTH-007',label:'Shower tray',supplier:'Sanindusa',range:'Marina Star',model:null,finish:'Colour to confirm',image:null,status:'candidate'},
      {slot:'shower-enclosure',bauhuId:'BAU-COA01-BTH-008',label:'Shower enclosure',supplier:'Sanindusa',range:'Safira',model:null,finish:'Configuration by bathroom layout',image:null,status:'candidate'}
    ]}
  ]
} as const;
