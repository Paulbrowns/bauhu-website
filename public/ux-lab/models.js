/* Shared Bauhu prototype data — source: src/data/models.csv, copied without editing. */
window.BauhuLab = {
 async loadModels(){
  const response=await fetch('/ux-lab/models-data.csv',{cache:'no-store'});
  if(!response.ok)throw new Error('Model data unavailable');
  const text=await response.text();
  const lines=text.replace(/^\uFEFF/,'').trim().split(/\r?\n/);
  const headers=lines.shift().split(';');
  return lines.map(line=>{
   const values=line.split(';');const raw=Object.fromEntries(headers.map((key,i)=>[key,values[i]||'']));
   const num=x=>{const n=Number(x);return x.trim()&&Number.isFinite(n)?n:null};
   const slug=raw.name.replace(/^bauhu-/,'');
   return {slug,name:slug.replace(/-/g,' ').toUpperCase(),style:raw.style.trim(),
    price:num(raw.guide_price_usd),bedrooms:num(raw.bedrooms),bathrooms:num(raw.bathrooms),
    storeys:num(raw.Levels),area:num(raw.total_built_area_sqft),description:raw.short_description.trim()};
  }).filter(m=>m.slug);
 },
 price(value){return value==null?'Price on request':'$'+Math.round(value).toLocaleString('en-US')},
 detail(model){return '/homes/'+encodeURIComponent(model.slug)+'/';},
 escape(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
};
