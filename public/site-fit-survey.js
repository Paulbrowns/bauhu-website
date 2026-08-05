(() => {
  if (!location.pathname.startsWith('/site-fit/')) return;

  const ready = (fn) => document.readyState === 'loading'
    ? document.addEventListener('DOMContentLoaded', fn, { once: true })
    : fn();

  ready(() => {
    const parcelControls = document.getElementById('parcel-controls');
    const mapStage = document.querySelector('.map-stage');
    const nextStep = document.getElementById('next-step');
    if (!parcelControls || !mapStage || document.getElementById('survey-step')) return;

    const style = document.createElement('style');
    style.textContent = `
      .survey-step{margin-top:1.4rem;padding-top:1.3rem;border-top:1px solid rgba(23,57,76,.15)}
      .survey-heading{display:flex;gap:.8rem;margin-bottom:1rem}.survey-heading>b{display:grid;place-items:center;flex:0 0 32px;height:32px;border-radius:50%;background:#c5a66a;color:#17394c;font:700 .68rem Inter,sans-serif}.survey-heading strong,.survey-heading small{display:block;font-family:Inter,sans-serif}.survey-heading strong{font-size:.82rem}.survey-heading small{margin-top:.2rem;color:rgba(23,57,76,.58);line-height:1.4}
      .survey-drop{display:grid;gap:.45rem;padding:1rem;border:1px dashed rgba(23,57,76,.32);background:#fff;text-align:center;cursor:pointer}.survey-drop strong{font:700 .72rem Inter,sans-serif}.survey-drop span{font:400 .62rem/1.45 Inter,sans-serif;color:rgba(23,57,76,.58)}.survey-drop input{position:absolute;opacity:0;pointer-events:none}
      .survey-status{display:grid;gap:.25rem;margin-top:.75rem;padding:.8rem;background:#ece9df;font-family:Inter,sans-serif}.survey-status strong{font-size:.68rem}.survey-status span{font-size:.6rem;color:rgba(23,57,76,.6)}
      .survey-actions{display:grid;gap:.55rem;margin-top:.75rem}.survey-actions button{width:100%;padding:.72rem;font:700 .66rem Inter,sans-serif;cursor:pointer}.survey-preview-button{border:0;background:#17394c;color:#fff}.survey-skip{border:1px solid rgba(23,57,76,.24);background:transparent;color:#17394c}.survey-remove{border:0;background:none;color:#7c4037;text-decoration:underline}
      .survey-overlay{position:absolute;inset:1rem;z-index:1050;display:grid;grid-template-rows:auto 1fr;background:#f7f5ef;box-shadow:0 18px 50px rgba(23,57,76,.28)}.survey-overlay[hidden]{display:none}.survey-overlay-header{display:flex;justify-content:space-between;gap:1rem;align-items:center;padding:.75rem 1rem;border-bottom:1px solid rgba(23,57,76,.15);font-family:Inter,sans-serif}.survey-overlay-header strong{font-size:.72rem}.survey-overlay-header button{border:1px solid rgba(23,57,76,.2);background:#fff;padding:.5rem .7rem;color:#17394c;font-weight:700}.survey-overlay iframe{width:100%;height:100%;border:0;background:#fff}
      @media(max-width:760px){.survey-overlay{inset:.5rem}.survey-overlay-header{align-items:flex-start;flex-direction:column}}
    `;
    document.head.appendChild(style);

    const section = document.createElement('section');
    section.id = 'survey-step';
    section.className = 'survey-step';
    section.innerHTML = `
      <div class="survey-heading">
        <b>02</b>
        <div><strong>Do you have a site survey?</strong><small>If you have a site survey, upload it. If not, continue to the next step.</small></div>
      </div>
      <label class="survey-drop" for="survey-pdf">
        <strong>Upload site survey PDF</strong>
        <span>PDF only · used locally in this browser for the prototype</span>
        <input id="survey-pdf" type="file" accept="application/pdf,.pdf" />
      </label>
      <div id="survey-status" class="survey-status" hidden>
        <strong id="survey-name"></strong>
        <span id="survey-meta"></span>
      </div>
      <div class="survey-actions">
        <button id="preview-survey" class="survey-preview-button" type="button" hidden>Preview survey</button>
        <button id="skip-survey" class="survey-skip" type="button">Skip — continue without a survey</button>
        <button id="remove-survey" class="survey-remove" type="button" hidden>Remove survey</button>
      </div>
    `;

    const firstCompactStep = parcelControls.querySelector('.step.compact');
    if (firstCompactStep) {
      firstCompactStep.querySelector('b').textContent = '03';
      parcelControls.insertBefore(section, firstCompactStep);
    } else {
      parcelControls.prepend(section);
    }

    const overlay = document.createElement('div');
    overlay.className = 'survey-overlay';
    overlay.hidden = true;
    overlay.innerHTML = `
      <div class="survey-overlay-header"><strong id="survey-preview-title">Site survey preview</strong><button id="close-survey-preview" type="button">Close preview</button></div>
      <iframe id="survey-frame" title="Site survey PDF preview"></iframe>
    `;
    mapStage.appendChild(overlay);

    const input = document.getElementById('survey-pdf');
    const status = document.getElementById('survey-status');
    const name = document.getElementById('survey-name');
    const meta = document.getElementById('survey-meta');
    const preview = document.getElementById('preview-survey');
    const remove = document.getElementById('remove-survey');
    const skip = document.getElementById('skip-survey');
    const frame = document.getElementById('survey-frame');
    const title = document.getElementById('survey-preview-title');
    let objectUrl = '';

    function clearSurvey() {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = '';
      input.value = '';
      status.hidden = true;
      preview.hidden = true;
      remove.hidden = true;
      overlay.hidden = true;
      frame.removeAttribute('src');
      delete document.documentElement.dataset.siteSurvey;
    }

    input.addEventListener('change', () => {
      const file = input.files && input.files[0];
      if (!file) return;
      const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
      if (!isPdf) {
        clearSurvey();
        alert('Please select a PDF site survey.');
        return;
      }
      if (file.size > 30 * 1024 * 1024) {
        clearSurvey();
        alert('Please select a PDF smaller than 30 MB for this prototype.');
        return;
      }
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      objectUrl = URL.createObjectURL(file);
      name.textContent = file.name;
      meta.textContent = `${(file.size / 1024 / 1024).toFixed(2)} MB · Ready to preview`;
      status.hidden = false;
      preview.hidden = false;
      remove.hidden = false;
      document.documentElement.dataset.siteSurvey = file.name;
      if (nextStep) nextStep.textContent = 'Review survey or confirm parcel';
    });

    preview.addEventListener('click', () => {
      if (!objectUrl) return;
      frame.src = objectUrl;
      title.textContent = name.textContent || 'Site survey preview';
      overlay.hidden = false;
    });
    document.getElementById('close-survey-preview').addEventListener('click', () => { overlay.hidden = true; });
    remove.addEventListener('click', clearSurvey);
    skip.addEventListener('click', () => {
      section.dataset.skipped = 'true';
      skip.textContent = 'Continuing without a survey';
      skip.disabled = true;
      if (nextStep) nextStep.textContent = 'Confirm parcel boundary';
      const target = parcelControls.querySelector('.step.compact');
      target?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  });
})();
