(()=>{'use strict';
const lab=window.BauhuLab,spin=document.getElementById('spin'),status=document.getElementById('spin-status'),result=document.getElementById('results'),grid=document.getElementById('result-grid');
const reels=[...document.querySelectorAll('.reel')];let models=[],busy=false,timers=[];
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const selectors={style:document.getElementById('style'),beds:document.getElementById('beds'),budget:document.getElementById('budget')};
const modelImage=m=>{
 if(m.slug==='caribbean-cottage')return 'https://bauhu.com/images/models/bauhu-caribbean-cottage/caribbean-cottage-original-hero.webp';
 if(m.slug==='caribbean-cottage-compact')return 'https://bauhu.com/images/models/bauhu-caribbean-cottage/bauhu-caribbean-cottage.webp';
 return 'https://bauhu.com/images/models/bauhu-'+encodeURIComponent(m.slug)+'/bauhu-'+encodeURIComponent(m.slug)+'.webp';
};
function clearTimers(){timers.forEach(clearTimeout);timers=[];}
function getMatches(){
 const style=selectors.style.value,beds=selectors.beds.value,budget=selectors.budget.value;
 return models.filter(m=>(style==='any'||m.style===style)&&(beds==='any'||m.bedrooms!==null&&m.bedrooms>=Number(beds))&&(budget==='any'||m.price!==null&&m.price<=Number(budget)));
}
function shuffle(a){const copy=[...a];for(let i=copy.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[copy[i],copy[j]]=[copy[j],copy[i]];}return copy;}
function renderReel(reel,model){
 const cell=reel.querySelector('.reel-value');cell.replaceChildren();
 if(!model){cell.textContent='—';return;}
 const img=document.createElement('img');img.src=modelImage(model);img.alt='';img.loading='eager';img.decoding='async';
 img.onerror=()=>{img.remove();cell.classList.add('image-unavailable');};
 cell.classList.remove('image-unavailable');
 const name=document.createElement('span');name.className='reel-model-name';name.textContent=model.name;
 cell.append(img,name);
}
function showCandidates(matches,picks){
 grid.replaceChildren();
 for(const [i,m] of picks.entries()){
  const article=document.createElement('article');article.className='result-card';
  const eyebrow=document.createElement('span');eyebrow.className='sectionlabel';eyebrow.textContent=i===0?'THE REEL PICK':'ALSO WORTH EXPLORING';
  const photo=document.createElement('img');photo.className='result-model-image';photo.src=modelImage(m);photo.alt=m.name+' Bauhu model residence';photo.loading='lazy';
  photo.onerror=()=>photo.remove();
  const h=document.createElement('h3');h.textContent=m.name;
  const p=document.createElement('p');p.textContent=m.style+' · '+(m.bedrooms==null?'Bedrooms unpublished':m.bedrooms+' bedrooms')+' · '+lab.price(m.price);
  const description=document.createElement('p');description.textContent=m.description;
  const link=document.createElement('a');link.href='https://bauhu.com'+lab.detail(m);link.target='_blank';link.rel='noopener noreferrer';link.textContent='EXPLORE THIS RESIDENCE ↗';
  article.append(eyebrow,photo,h,p,description,link);grid.append(article);
 }
 const f=[];if(selectors.style.value!=='any')f.push(selectors.style.value+' style');if(selectors.beds.value!=='any')f.push('at least '+selectors.beds.value+' bedrooms');if(selectors.budget.value!=='any')f.push('published guide price at or below '+lab.price(Number(selectors.budget.value)));
 document.getElementById('result-explain').textContent='These '+matches.length+' model'+(matches.length===1?'':'s')+' match '+(f.length?f.join(', '):'your flexible preferences')+'. The reels reveal '+picks.length+' distinct model'+(picks.length===1?'':'s')+' to explore.';
 result.classList.add('show');status.textContent='Your matching models are revealed. Change the options and spin again.';
 result.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'nearest'});
}
function startSpin(){
 if(busy||!models.length)return;
 const matches=getMatches();result.classList.remove('show');
 if(!matches.length){status.textContent='No published models match all three choices. Try changing the style, bedroom count or guide-price ceiling.';return;}
 busy=true;spin.disabled=true;spin.textContent='MATCHING MODELS…';status.textContent='Selecting three Bauhu residences that match your preferences…';
 const picks=shuffle(matches).slice(0,3);
 if(reduced.matches){reels.forEach((r,i)=>renderReel(r,picks[i]));finish();return;}
 reels.forEach((r,i)=>{
  r.classList.add('spinning');
  const pool=shuffle(matches),endAt=[1250,1780,2320][i];
  let tick=0,elapsed=0;
  const step=()=>{
   renderReel(r,pool[tick++%pool.length]);
   const delay=elapsed<endAt-550?110:elapsed<endAt-250?180:260;
   elapsed+=delay;
   if(elapsed<endAt){timers.push(setTimeout(step,delay));}else{
    r.classList.remove('spinning');renderReel(r,picks[i]);
    if(i===2)finish();
   }
  };
  step();
 });
 function finish(){clearTimers();busy=false;spin.disabled=false;spin.textContent='SPIN AGAIN ↗';showCandidates(matches,picks);}
}
spin.addEventListener('click',startSpin);
Object.values(selectors).forEach(el=>el.addEventListener('change',()=>{if(!busy){result.classList.remove('show');status.textContent='Your preferences are set. Spin to discover Bauhu residences.'}}));
lab.loadModels().then(data=>{models=[...new Map(data.filter(m=>m.slug).map(m=>[m.slug,m])).values()];status.textContent='Explore '+models.length+' published model residences. Select your preferences and spin.';}).catch(()=>{spin.disabled=true;status.textContent='Model data unavailable. Please refresh the preview.'});
})();