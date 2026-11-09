(()=>{'use strict';
const demos={
 residence:{ref:'DEMO-001',project:'Private Caribbean residence',description:'An architect-designed home for a coastal Caribbean site.',location:'Eleuthera, The Bahamas',route:'Model residence / to refine',files:'Survey / not yet supplied'},
 resort:{ref:'DEMO-002',project:'Island resort development',description:'A group of hospitality residences for a remote Caribbean development.',location:'Exuma, The Bahamas',route:'Resort development / early planning',files:'Site and masterplan / to discuss'}
};
let active='residence';
const receipt=document.querySelector('.receipt');if(!receipt)return;
function setDemo(id){
 active=id;const d=demos[id];
 document.getElementById('receipt-ref').textContent=d.ref;
 document.getElementById('receipt-project').textContent=d.project;
 document.getElementById('receipt-description').textContent=d.description;
 document.getElementById('receipt-location').textContent=d.location;
 document.getElementById('receipt-route').textContent=d.route;
 document.getElementById('receipt-files').textContent=d.files;
 document.querySelectorAll('[data-demo]').forEach(b=>{const on=b.dataset.demo===id;b.classList.toggle('active',on);b.setAttribute('aria-pressed',String(on))});
 replay();
}
function replay(){receipt.classList.remove('is-appearing');void receipt.offsetWidth;receipt.classList.add('is-appearing')}
document.querySelectorAll('[data-demo]').forEach(b=>b.addEventListener('click',()=>setDemo(b.dataset.demo)));
document.getElementById('restart').addEventListener('click',replay);
document.getElementById('download-summary').addEventListener('click',()=>{
 const d=demos[active];const content=['BAUHU / PROJECT SUMMARY — DEMO ONLY','This is a sample prototype. No enquiry has been sent.','','Reference: '+d.ref,'Project: '+d.project,'Location: '+d.location,'Route: '+d.route,'Supporting information: '+d.files,'','Possible next steps:','1. Record the enquiry','2. Initial team review','3. Clarify requirements with the client','','For live enquiries, only server-confirmed submission details should be included.'].join('\n');
 const blob=new Blob([content],{type:'text/plain;charset=utf-8'});const url=URL.createObjectURL(blob);const link=document.createElement('a');link.href=url;link.download='bauhu-project-summary-demo.txt';document.body.appendChild(link);link.click();link.remove();window.setTimeout(()=>URL.revokeObjectURL(url),1000);
});
})();