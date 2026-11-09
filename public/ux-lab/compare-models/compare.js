(()=>{'use strict';const lab=window.BauhuLab,list=document.getElementById('model-list'),grid=document.getElementById('comparison-grid'),search=document.getElementById('model-search'),count=document.getElementById('selected-count'),feedback=document.getElementById('compare-feedback');let models=[],selected=[];
const display=n=>n==null?'Not published':Number(n).toLocaleString('en-US');
function renderList(){
 const query=search.value.trim().toLowerCase();
 const shown=models.filter(m=>m.name.toLowerCase().includes(query)).slice(0,58);
 list.replaceChildren();
 if(!shown.length){list.textContent='No matching model names.';return}
 for(const m of shown){
  const card=document.createElement('div');card.className='pick-card';
  const info=document.createElement('div');const strong=document.createElement('strong');strong.textContent=m.name;const small=document.createElement('small');small.textContent=m.style+' · '+(m.bedrooms==null?'Beds unpublished':m.bedrooms+' beds')+' · '+lab.price(m.price);info.append(strong,small);
  const b=document.createElement('button');b.type='button';const on=selected.includes(m.slug);b.textContent=on?'REMOVE ✓':'+ COMPARE';b.setAttribute('aria-pressed',String(on));b.disabled=!on&&selected.length>=3;b.addEventListener('click',()=>{selected=on?selected.filter(s=>s!==m.slug):[...selected,m.slug];render()});card.append(info,b);list.append(card);
 }
}
function render(){
 count.textContent=selected.length+' / 3 SELECTED';feedback.textContent=selected.length?'Comparing '+selected.length+' residence'+(selected.length>1?'s':''): 'Select a residence to begin.';
 grid.replaceChildren();
 if(!selected.length){const d=document.createElement('div');d.className='empty';d.textContent='CHOOSE YOUR FIRST MODEL ↗';grid.append(d)}
 for(const slug of selected){
  const m=models.find(x=>x.slug===slug);if(!m)continue;
  const card=document.createElement('article');card.className='compare-item';
  const label=document.createElement('span');label.className='meta';label.textContent=m.style.toUpperCase();
  const h=document.createElement('h3');h.textContent=m.name;
  const specs=[['GUIDE PRICE',lab.price(m.price)],['BEDROOMS',display(m.bedrooms)],['BATHROOMS',display(m.bathrooms)],['STOREYS',display(m.storeys)],['BUILT AREA',m.area==null?'Not published':display(m.area)+' ft²']];
  card.append(label,h);
  for(const [key,value] of specs){const row=document.createElement('div');row.className='spec';const title=document.createElement('span');title.textContent=key;const val=document.createElement('strong');val.textContent=value;row.append(title,val);card.append(row)}
  const p=document.createElement('p');p.className='small';p.textContent=m.description;card.append(p);
  const a=document.createElement('a');a.href=lab.detail(m);a.target='_blank';a.rel='noopener noreferrer';a.textContent='VIEW RESIDENCE ↗';card.append(a);
  const b=document.createElement('button');b.type='button';b.textContent='REMOVE FROM COMPARISON';b.addEventListener('click',()=>{selected=selected.filter(s=>s!==slug);render()});card.append(b);grid.append(card);
 }
 renderList();
}
search.addEventListener('input',renderList);document.getElementById('clear').addEventListener('click',()=>{selected=[];search.value='';render()});
lab.loadModels().then(data=>{models=data;render()}).catch(()=>{list.textContent='Unable to load model data. Please refresh.'});
})();