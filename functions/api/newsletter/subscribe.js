const respond = (body, status=200) => new Response(JSON.stringify(body), {status,headers:{'content-type':'application/json; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff'}});
const consentVersion='bauhu-newsletter-v1';
const emailOK = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length<=254;
export async function onRequestPost({request,env}){
 if(!env.DB)return respond({error:'Newsletter storage is not configured.'},503);
 const type=request.headers.get('content-type')||'';
 if(!type.includes('application/json'))return respond({error:'Expected JSON.'},415);
 if(Number(request.headers.get('content-length')||0)>4096)return respond({error:'Request too large.'},413);
 let data;try{data=await request.json()}catch{return respond({error:'Invalid request.'},400)}
 const email=typeof data?.email==='string'?data.email.trim().toLowerCase():'';
 if(!emailOK(email)||data?.consent!==true)return respond({error:'A valid email and explicit consent are required.'},400);
 // Honeypot: accept silently but do not store.
 if(typeof data?.website==='string'&&data.website.trim())return respond({ok:true},200);
 if(!env.TURNSTILE_SECRET_KEY)return respond({error:'Newsletter verification is not configured.'},503);
 const token=typeof data?.turnstileToken==='string'?data.turnstileToken:'';
 if(!token)return respond({error:'Please complete the security check.'},400);
 try{
  const form=new FormData();form.set('secret',env.TURNSTILE_SECRET_KEY);form.set('response',token);
  const cfIp=request.headers.get('CF-Connecting-IP');if(cfIp)form.set('remoteip',cfIp);
  const verification=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:form});
  if(!verification.ok||(await verification.json()).success!==true)return respond({error:'Security check failed. Please try again.'},400);
 }catch{return respond({error:'Security check unavailable. Please try again.'},503)}
 const now=new Date().toISOString();
 try{
  const existing=await env.DB.prepare('SELECT status FROM newsletter_subscribers WHERE email=?').bind(email).first();
  if(existing?.status==='subscribed')return respond({ok:true,alreadySubscribed:true});
  if(existing?.status==='unsubscribed')return respond({error:'This email was previously unsubscribed. Please contact Bauhu to renew your consent.'},409);
  const id=crypto.randomUUID(),unsubscribeToken=crypto.randomUUID()+crypto.randomUUID().replace(/-/g,'');
  await env.DB.prepare('INSERT INTO newsletter_subscribers (id,email,status,consent_at,consent_version,subscribed_at,unsubscribed_at,source,unsubscribe_token,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?)')
   .bind(id,email,'subscribed',now,consentVersion,now,null,'website-newsletter',unsubscribeToken,now,now).run();
  return respond({ok:true},201);
 }catch(e){
  // Race-safe duplicate, without leaking whether an address exists.
  if(String(e).includes('UNIQUE constraint failed'))return respond({ok:true,alreadySubscribed:true});
  return respond({error:'Subscription could not be saved. Please try again.'},503);
 }
}
