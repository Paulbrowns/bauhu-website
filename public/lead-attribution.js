(() => {
  const STORAGE_KEY = 'bauhu_attribution_v1';
  const RETENTION_DAYS = 90;
  const now = new Date().toISOString();
  const params = new URLSearchParams(window.location.search);

  const readStored = () => {
    try {
      const value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      if (!value.createdAt) return {};
      const age = Date.now() - new Date(value.createdAt).getTime();
      if (age > RETENTION_DAYS * 24 * 60 * 60 * 1000) return {};
      return value;
    } catch {
      return {};
    }
  };

  const writeStored = (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    } catch {}
  };

  const classifyReferrer = (referrer) => {
    if (!referrer) return { source: 'direct', medium: 'direct' };
    let host = '';
    try { host = new URL(referrer).hostname.replace(/^www\./, '').toLowerCase(); } catch {}
    if (!host) return { source: 'unknown-referrer', medium: 'referral' };
    if (host.includes('google.')) return { source: 'google', medium: 'organic' };
    if (host.includes('bing.')) return { source: 'bing', medium: 'organic' };
    if (host.includes('yahoo.')) return { source: 'yahoo', medium: 'organic' };
    if (host.includes('duckduckgo.')) return { source: 'duckduckgo', medium: 'organic' };
    if (host.includes('chatgpt.com') || host.includes('openai.com')) return { source: 'chatgpt', medium: 'ai-referral' };
    if (host.includes('perplexity.ai')) return { source: 'perplexity', medium: 'ai-referral' };
    if (host.includes('copilot.microsoft.com')) return { source: 'copilot', medium: 'ai-referral' };
    if (host.includes('claude.ai') || host.includes('anthropic.com')) return { source: 'claude', medium: 'ai-referral' };
    if (host.includes('facebook.com') || host.includes('instagram.com')) return { source: 'meta', medium: 'social' };
    if (host.includes('linkedin.com')) return { source: 'linkedin', medium: 'social' };
    return { source: host, medium: 'referral' };
  };

  const getClickId = () => ({
    gclid: params.get('gclid') || '',
    fbclid: params.get('fbclid') || '',
    msclkid: params.get('msclkid') || '',
  });

  const deriveTouch = () => {
    const inferred = classifyReferrer(document.referrer);
    const clickIds = getClickId();
    const utmSource = params.get('utm_source');
    const utmMedium = params.get('utm_medium');
    const utmCampaign = params.get('utm_campaign');

    let source = utmSource || inferred.source;
    let medium = utmMedium || inferred.medium;
    if (clickIds.gclid && !utmSource) { source = 'google'; medium = 'paid-search'; }
    if (clickIds.fbclid && !utmSource) { source = 'meta'; medium = 'paid-social'; }
    if (clickIds.msclkid && !utmSource) { source = 'bing'; medium = 'paid-search'; }

    return {
      source,
      medium,
      campaign: utmCampaign || '',
      content: params.get('utm_content') || '',
      term: params.get('utm_term') || '',
      landingPage: window.location.pathname + window.location.search,
      referrer: document.referrer || '',
      createdAt: now,
      ...clickIds,
    };
  };

  const matomoEventDefaults = {
    lead_intent_site_fit_click: ['Lead intent', 'Site fit click'],
    lead_intent_project_details_click: ['Lead intent', 'Project details click'],
    partner_intent_click: ['Partner intent', 'Work with Bauhu click'],
    contact_click: ['Contact intent', 'Contact click'],
    lead_enquiry_submitted: ['Lead', 'Enquiry submitted'],
    partner_profile_submit: ['Partner', 'Partner profile submit'],
    partner_profile_complete: ['Partner', 'Partner profile complete'],
  };

  const trackMatomoEvent = (eventName, detail = {}) => {
    const queue = window._paq = window._paq || [];
    const defaults = matomoEventDefaults[eventName] || ['Bauhu', eventName];
    const category = detail.matomoCategory || defaults[0];
    const action = detail.matomoAction || defaults[1];
    const name = detail.matomoName || detail.reference || detail.classification || detail.href || window.location.pathname;
    const value = Number.isFinite(Number(detail.matomoValue)) ? Number(detail.matomoValue) : undefined;

    if (value === undefined) {
      queue.push(['trackEvent', category, action, name]);
    } else {
      queue.push(['trackEvent', category, action, name, value]);
    }
  };

  const stored = readStored();
  const lastTouch = deriveTouch();
  const attribution = {
    firstTouch: stored.firstTouch || lastTouch,
    lastTouch,
    createdAt: stored.createdAt || now,
    updatedAt: now,
  };
  writeStored(attribution);

  window.bauhuAttribution = {
    get() { return readStored(); },
    asPayload() {
      const current = readStored();
      const first = current.firstTouch || {};
      const last = current.lastTouch || {};
      return {
        utmSource: last.source || '',
        utmMedium: last.medium || '',
        utmCampaign: last.campaign || '',
        utmContent: last.content || '',
        utmTerm: last.term || '',
        landingPage: first.landingPage || last.landingPage || window.location.pathname,
        referrer: first.referrer || last.referrer || '',
        firstTouchSource: first.source || '',
        firstTouchMedium: first.medium || '',
        firstTouchCampaign: first.campaign || '',
        firstTouchLandingPage: first.landingPage || '',
        lastTouchSource: last.source || '',
        lastTouchMedium: last.medium || '',
        lastTouchCampaign: last.campaign || '',
        currentPage: window.location.pathname,
        gclid: last.gclid || first.gclid || '',
        fbclid: last.fbclid || first.fbclid || '',
        msclkid: last.msclkid || first.msclkid || '',
      };
    },
    track(eventName, detail = {}) {
      window.dataLayer = window.dataLayer || [];
      const payload = { event: eventName, ...detail, attribution: this.asPayload() };
      window.dataLayer.push(payload);
      trackMatomoEvent(eventName, detail);
      window.dispatchEvent(new CustomEvent(`bauhu:${eventName}`, { detail: payload }));
    },
  };

  document.addEventListener('click', (event) => {
    const link = event.target.closest?.('a[href]');
    if (!link) return;
    const href = link.getAttribute('href') || '';
    if (href.includes('/site-fit')) window.bauhuAttribution.track('lead_intent_site_fit_click', { href });
    if (href.includes('/project-details')) window.bauhuAttribution.track('lead_intent_project_details_click', { href });
    if (href.includes('/work-with-bauhu')) window.bauhuAttribution.track('partner_intent_click', { href });
    if (href.startsWith('mailto:') || href.startsWith('tel:')) window.bauhuAttribution.track('contact_click', { href });
  }, { capture: true });
})();
