(()=>{'use strict';
const stage=document.getElementById('welcome-stage'),form=document.getElementById('newsletter-form'),container=document.getElementById('particles'),status=document.getElementById('signup-status'),submit=document.getElementById('signup-submit');if(!form||!stage)return;
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
let timer=null;
status.textContent='Ready to subscribe. Complete the security check, then select Subscribe.';
function makeParticles(){container.replaceChildren();for(let i=0;i<72;i++){const p=document.createElement('i');p.className='particle';p.style.setProperty('--angle',(i*137.508)+'deg');p.style.setProperty('--radius',(80+(i*23)%230)+'px');p.style.setProperty('--delay',((i%8)*0.022)+'s');p.style.background=i%4===0?'#a68d62':i%4===1?'#8eb3a1':i%4===2?'#488096':'#dce7d9';container.append(p);}}
function showWelcome(){stage.classList.remove('finished','celebrate');if(reduced.matches){stage.classList.add('finished');document.getElementById('return-home')?.focus();return;}makeParticles();void stage.offsetWidth;stage.classList.add('celebrate');timer=window.setTimeout(()=>{stage.classList.remove('celebrate');stage.classList.add('finished');document.getElementById('return-home')?.focus({preventScroll:true});},1250);}
form.addEventListener('submit',async event=>{
 event.preventDefault();if(!form.reportValidity())return;
 status.textContent='Checking your details…';
 const token=window.turnstile?.getResponse?.()||'';
 if(!token){status.textContent='Please complete the security check above the Subscribe button.';status.scrollIntoView({block:'nearest'});return;}
 submit.disabled=true;submit.textContent='SUBSCRIBING…';status.textContent='Saving your subscription…';
 try{
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),15000);
  let response;
  try { response=await fetch('/api/newsletter/subscribe',{method:'POST',headers:{'content-type':'application/json'},signal:controller.signal,body:JSON.stringify({email:document.getElementById('email').value,consent:document.getElementById('consent').checked,website:document.getElementById('newsletter-website').value,turnstileToken:token})}); }
  finally { clearTimeout(timeout); }
  const data=await response.json().catch(()=>({}));
  if(!response.ok||!data.ok)throw new Error(data.error||'Subscription could not be saved. Please try again.');
  status.textContent='Subscription confirmed.';showWelcome();
 }catch(error){status.textContent=error?.name==='AbortError'?'The request timed out. Please try again.':(error.message||'Unable to save your subscription.');status.scrollIntoView({block:'nearest'});window.turnstile?.reset?.();}
 finally{submit.disabled=false;submit.textContent='SUBSCRIBE ↗';}
});
})();