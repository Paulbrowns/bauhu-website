(()=>{'use strict';
const stage=document.getElementById('welcome-stage'),form=document.getElementById('newsletter-form'),container=document.getElementById('particles'),reset=document.getElementById('reset'),status=document.getElementById('signup-status');if(!form||!stage)return;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let timer=null;
function makeParticles(){container.replaceChildren();for(let i=0;i<72;i++){const p=document.createElement('i');p.className='particle';p.style.setProperty('--angle',(i*137.508)+'deg');p.style.setProperty('--radius',(80+(i*23)%230)+'px');p.style.setProperty('--delay',((i%8)*0.022)+'s');p.style.background=i%4===0?'#a68d62':i%4===1?'#8eb3a1':i%4===2?'#488096':'#dce7d9';container.append(p);}}
form.addEventListener('submit',event=>{
 event.preventDefault();if(!form.reportValidity())return;
 status.textContent='Demo animation only. Nothing was sent.';
 stage.classList.remove('finished','celebrate');
 if(reduced.matches){stage.classList.add('finished');reset.focus();return}
 makeParticles();void stage.offsetWidth;stage.classList.add('celebrate');
 timer=window.setTimeout(()=>{stage.classList.remove('celebrate');stage.classList.add('finished');reset.focus({preventScroll:true})},1250);
});
reset.addEventListener('click',()=>{
 if(timer!==null)clearTimeout(timer);timer=null;
 stage.classList.remove('celebrate','finished');container.replaceChildren();form.reset();
 status.textContent='DEMO MODE / NOTHING WILL BE SUBSCRIBED OR STORED.';
 document.getElementById('email').focus();
});
})();