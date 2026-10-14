(() => {
  const KEY = 'bauhu_meta_tracking_consent_v1';
  const PIXEL_ID = '1831541731214364';
  let enabled = false;
  const choice = () => { try { return localStorage.getItem(KEY); } catch { return null; } };
  const remember = value => { try { localStorage.setItem(KEY, value); } catch {} };
  function enable() {
    if (enabled) return;
    enabled = true;
    !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
    window.fbq('init', PIXEL_ID);
    window.fbq('track', 'PageView');
    window.dispatchEvent(new Event('bauhu:meta-ready'));
  }
  function dismiss() { document.getElementById('bauhu-meta-consent')?.remove(); }
  function showChoices() {
    if (document.getElementById('bauhu-meta-consent')) return;
    const box = document.createElement('div');
    box.id = 'bauhu-meta-consent';
    box.setAttribute('role','dialog');
    box.setAttribute('aria-label','Optional advertising tracking');
    box.style.cssText = 'position:fixed;z-index:9999;bottom:16px;left:16px;right:16px;max-width:520px;padding:20px;background:#f6f3ec;color:#17394c;border:1px solid #b89a62;box-shadow:0 10px 35px #0003;font:14px/1.5 Inter,sans-serif';
    const text = document.createElement('p');
    text.textContent = 'Bauhu would like to use optional Meta advertising cookies to measure visits and project enquiries. You can accept or decline. See our Privacy Notice.';
    text.style.margin = '0 0 12px';
    const buttons = document.createElement('div');
    buttons.style.cssText = 'display:flex;gap:10px;flex-wrap:wrap';
    function button(label, value) {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = label;
      b.style.cssText = 'padding:9px 16px;cursor:pointer;border:1px solid #17394c;background:'+(value==='accepted'?'#17394c':'transparent')+';color:'+(value==='accepted'?'#fff':'#17394c');
      b.addEventListener('click', () => { remember(value); dismiss(); if (value==='accepted') enable(); });
      return b;
    }
    buttons.append(button('Accept', 'accepted'),button('Decline','declined'));
    box.append(text,buttons);
    document.body.append(box);
  }
  window.bauhuMeta = {
    resetConsent: () => { try { localStorage.removeItem(KEY); } catch {} showChoices(); },
    trackLead: () => { if (enabled && typeof window.fbq === 'function') { window.fbq('track','Lead'); return true; } return false; }
  };
  const selected = choice();
  if (selected === 'accepted') enable();
  else if (selected !== 'declined') showChoices();
})();