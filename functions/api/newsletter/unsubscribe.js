const document=(message,token='',status=200)=>new Response('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Bauhu Newsletter</title><body style="font:16px/1.6 system-ui;background:#17394c;color:#f8f6ef;padding:10vh 6vw"><h1>Bauhu Newsletter</h1><p>'+message+'</p>'+(token?'<form method="post"><input type="hidden" name="token" value="'+token+'"><button style="padding:13px 24px">Confirm unsubscribe</button></form>':'')+'<p><a style="color:#d0e9eb" href="https://bauhu.com/">Return to Bauhu</a></p></body></html>',{status,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store','referrer-policy':'no-referrer'}});
const valid=t=>/^[a-f0-9-]{60,100}$/i.test(t);
export function onRequestGet({request}){
 const token=new URL(request.url).searchParams.get('token')||'';
 return valid(token)?document('Confirm that you want to stop receiving Bauhu newsletters.',token):document('This unsubscribe link is invalid.', '',400);
}
export async function onRequestPost({request,env}){
 if(!env.DB)return document('Unsubscribe is temporarily unavailable.','',503);
 const form=await request.formData();const token=form.get('token')||'';
 if(typeof token!=='string'||!valid(token))return document('This unsubscribe link is invalid.','',400);
 try{
  const now=new Date().toISOString();
  await env.DB.prepare("UPDATE newsletter_subscribers SET status='unsubscribed', unsubscribed_at=?, updated_at=? WHERE unsubscribe_token=? AND status='subscribed'").bind(now,now,token).run();
  return document('You are unsubscribed. You will not receive further newsletters.');
 }catch{return document('Unsubscribe is temporarily unavailable. Please try again.','',503)}
}
