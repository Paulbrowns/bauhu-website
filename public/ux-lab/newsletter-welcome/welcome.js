(()=>{'use strict';
const stage=document.getElementById('welcome-stage'),form=document.getElementById('newsletter-form'),container=document.getElementById('particles'),reset=document.getElementById('reset'),status=document.getElementById('signup-status'),submit=document.getElementById('signup-submit');if(!form||!stage)return;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let timer=null;
function makeParticles(){container.replaceChildren();for(let i=0;i<72;i++){const p=document.createElement('i');p.className='particle';p.style.setProperty('--angle',(i*137.508)+'deg');p.style.setProperty('--radius',(80+(i*23)%230)+'px');p.style.setProperty('--delay',((i%8)*0.022)+'s');p.style.background=i%4===0?'#a68d62':i%4===1?'#8eb3a1':i%4===2?'#488096':'#dce7d9';container.append(p);}}
function showWelcome(){stage.classList.remove('finished','celebrate');if(reduced.matches){stage.classList.add('finished');reset.focus();return;}makeParticles();void stage.offsetWidth;stage.classList.add('celebrate');timer=window.setTimeout(()=>{stage.classList.remove('celebrate');stage.classList.add('finished');reset.focus({preventScroll:true});},1250);}
form.addEventListener('submit',async event=>{
 event.preventDefault();if(!form.reportValidity())return;
 const token=window.turnstile?.getResponse?.()||'';
 if(!token){status.textContent='Please complete the security check.';return;}
 submit.disabled=true;submit.textContent='SUBSCRIBING…';status.textContent='Saving your subscription…';
 try{
  const response=await fetch('/api/newsletter/subscribe',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({email:document.getElementById('email').value,consent:document.getElementById('consent').checked,website:document.getElementById('newsletter-website').value,turnstileToken:token})});
  const data=await response.json().catch(()=>({}));
  if(!response.ok||!data.ok)throw new Error(data.error||'Subscription could not be saved. Please try again.');
  showWelcome();
 }catch(error){status.textContent=error.message||'Unable to save your subscription.';window.turnstile?.reset?.();}
 finally{submit.disabled=false;submit.textContent='SUBSCRIBE ↗';}
});
reset.addEventListener('click',()=>{if(timer!==null)clearTimeout(timer);timer=null;stage.classList.remove('celebrate','finished');container.replaceChildren();form.reset();window.turnstile?.reset?.();status.textContent='Your subscription will be stored securely by Bauhu.';document.getElementById('email').focus();});
})();