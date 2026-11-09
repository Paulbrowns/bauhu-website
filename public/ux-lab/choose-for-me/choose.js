(()=>{'use strict';
const lab=window.BauhuLab,spin=document.getElementById('spin'),status=document.getElementById('spin-status'),result=document.getElementById('results'),grid=document.getElementById('result-grid');
const reels=[...document.querySelectorAll('.reel')];let models=[],busy=false,timers=[];
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
const selectors={style:document.getElementById('style'),beds:document.getElementById('beds'),budget:document.getElementById('budget')};
const pools=[['Classic','Contemporary','Caribbean'],['1 BED','2 BEDS','3 BEDS','4 BEDS','5 BEDS'],['$199k','$342k','$562k','$995k','$1.3m']];
function stopTimers(){timers.forEach(clearInterval);timers=[];}
function getMatches(){
 const style=selectors.style.value,beds=selectors.beds.value,budget=selectors.budget.value;
 return models.filter(m=>(style==='any'||m.style===style)&&(beds==='any'||m.bedrooms!==null&&m.bedrooms>=Number(beds))&&(budget==='any'||m.price!==null&&m.price<=Number(budget)));
}
function showCandidates(matches,winner){
 const ranked=[winner,...matches.filter(m=>m.slug!==winner.slug).sort((a,b)=>{
   const score=x=>(x.price??1e10)/1e6 + Math.abs((x.bedrooms??0)-(winner.bedrooms??0))*.3;
   return score(a)-score(b);
 })].slice(0,3);
 grid.replaceChildren();
 for(const m of ranked){
  const article=document.createElement('article');article.className='result-card';
  const eyebrow=document.createElement('span');eyebrow.className='sectionlabel';eyebrow.textContent=m===winner?'THE REEL PICK':'ALSO WORTH EXPLORING';
  const h=document.createElement('h3');h.textContent=m.name;
  const p=document.createElement('p');p.textContent=m.style+' · '+(m.bedrooms==null?'Bedrooms unpublished':m.bedrooms+' bedrooms')+' · '+lab.price(m.price);
  const description=document.createElement('p');description.textContent=m.description;
  const link=document.createElement('a');link.href=lab.detail(m);link.target='_blank';link.rel='noopener noreferrer';link.textContent='EXPLORE THIS RESIDENCE ↗';
  article.append(eyebrow,h,p,description,link);grid.append(article);
 }
 const f=[];if(selectors.style.value!=='any')f.push(selectors.style.value+' style');if(selectors.beds.value!=='any')f.push('at least '+selectors.beds.value+' bedrooms');if(selectors.budget.value!=='any')f.push('published guide price at or below '+lab.price(Number(selectors.budget.value)));
 document.getElementById('result-explain').textContent='These '+matches.length+' model'+(matches.length===1?'':'s')+' match '+(f.length?f.join(', '):'your flexible preferences')+'. The reels picked one to explore; here are up to three relevant options.';
 result.classList.add('show');status.textContent='A real model match. Change the options and spin again.';
 result.scrollIntoView({behavior:reduced.matches?'instant':'smooth',block:'nearest'});
}
function valueFor(m,i){return i===0?m.style:i===1?(m.bedrooms===null?'TBD':m.bedrooms+' BED'+(m.bedrooms===1?'':'S')):lab.price(m.price);}
function startSpin(){
 if(busy||!models.length)return;
 const matches=getMatches();
 result.classList.remove('show');
 if(!matches.length){status.textContent='No published models match all three choices. Try changing the style, bedroom count or guide-price ceiling.';return}
 busy=true;spin.disabled=true;spin.textContent='MATCHING MODELS…';status.textContent='Finding model residences that match your preferences…';
 const winner=matches[Math.floor(Math.random()*matches.length)];
 if(reduced.matches){reels.forEach((r,i)=>r.querySelector('.reel-value').textContent=valueFor(winner,i));finish();return}
 reels.forEach((r,i)=>{
  r.classList.add('spinning');
  const el=r.querySelector('.reel-value');
  let tick=0;
  const timer=setInterval(()=>{el.textContent=pools[i][(tick++ + Math.floor(Math.random()*pools[i].length))%pools[i].length]},90);timers.push(timer);
  const end=setTimeout(()=>{
   clearInterval(timer);r.classList.remove('spinning');el.textContent=valueFor(winner,i);
   if(i===2)finish();
  },[1150,1650,2200][i]);
  timers.push(end);
 });
 function finish(){stopTimers();busy=false;spin.disabled=false;spin.textContent='SPIN AGAIN ↗';showCandidates(matches,winner);}
}
spin.addEventListener('click',startSpin);
Object.values(selectors).forEach(el=>el.addEventListener('change',()=>{if(!busy){result.classList.remove('show');status.textContent='Your preferences are set. Spin to discover a residence.'}}));
lab.loadModels().then(data=>{models=data;status.textContent='Explore '+models.length+' published model residences. Select your preferences and spin.'}).catch(()=>{spin.disabled=true;status.textContent='Model data unavailable. Please refresh the preview.'});
})();