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
      .survey-status{display:grid;gap:.55rem;margin-top:.75rem}.survey-file{display:grid;grid-template-columns:1fr auto;gap:.25rem .6rem;align-items:center;padding:.8rem;background:#ece9df;font-family:Inter,sans-serif}.survey-file strong{font-size:.68rem}.survey-file span{font-size:.6rem;color:rgba(23,57,76,.6)}.survey-file button{grid-row:1/3;grid-column:2;border:0;background:none;color:#7c4037;text-decoration:underline;cursor:pointer}
      .survey-checks{display:grid;gap:.45rem;margin-top:.75rem;padding:.8rem;background:#f3f0e8;font:400 .62rem/1.4 Inter,sans-serif}.survey-checks strong{font-size:.66rem}.survey-checks label{display:flex;gap:.5rem;align-items:flex-start}.survey-checks input{margin-top:.1rem}
      .survey-actions{display:grid;gap:.55rem;margin-top:.75rem}.survey-actions button{width:100%;padding:.72rem;font:700 .66rem Inter,sans-serif;cursor:pointer}.survey-preview-button{border:0;background:#17394c;color:#fff}.survey-skip{border:1px solid rgba(23,57,76,.24);background:transparent;color:#17394c}
      .survey-overlay{position:absolute;inset:1rem;z-index:1050;display:grid;grid-template-rows:auto 1fr;background:#f7f5ef;box-shadow:0 18px 50px rgba(23,57,76,.28)}.survey-overlay[hidden]{display:none}.survey-overlay-header{display:flex;justify-content:space-between;gap:1rem;align-items:center;padding:.75rem 1rem;border-bottom:1px solid rgba(23,57,76,.15);font-family:Inter,sans-serif}.survey-overlay-header strong{font-size:.72rem}.survey-overlay-header select,.survey-overlay-header button{border:1px solid rgba(23,57,76,.2);background:#fff;padding:.5rem .7rem;color:#17394c;font-weight:700}.survey-overlay iframe{width:100%;height:100%;border:0;background:#fff}
      .model-panel,.model-card,.model-map-label{display:none!important}.leaflet-overlay-pane path[fill="#17394c"]{display:none!important}
      @media(max-width:760px){.survey-overlay{inset:.5rem}.survey-overlay-header{align-items:flex-start;flex-direction:column}}
    `;
    document.head.appendChild(style);

    const section = document.createElement('section');
    section.id = 'survey-step';
    section.className = 'survey-step';
    section.innerHTML = `
      <div class="survey-heading">
        <b>02</b>
        <div><strong>Upload a site survey or topographic plan</strong><small>Your survey may already include contours, elevations, access and other topographic information. Upload one PDF, or add another only when the information is split across separate documents.</small></div>
      </div>
      <label class="survey-drop" for="survey-pdf">
        <strong>Upload optional site documents</strong>
        <span>One or more PDFs · maximum 30 MB each · kept locally in this browser</span>
        <input id="survey-pdf" type="file" accept="application/pdf,.pdf" multiple />
      </label>
      <div id="survey-status" class="survey-status" hidden></div>
      <div id="survey-checks" class="survey-checks" hidden>
        <strong>What information is included?</strong>
        <label><input type="checkbox" value="boundary" /> Parcel boundary and dimensions</label>
        <label><input type="checkbox" value="topography" /> Contours, elevations or site grade</label>
        <label><input type="checkbox" value="access" /> Road, driveway or access information</label>
        <label><input type="checkbox" value="constraints" /> Easements, banks or other constraints</label>
      </div>
      <div class="survey-actions">
        <button id="preview-survey" class="survey-preview-button" type="button" hidden>Preview uploaded PDF</button>
        <button id="skip-survey" class="survey-skip" type="button">Skip — continue without documents</button>
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
      <div class="survey-overlay-header"><strong>Site document preview</strong><select id="survey-preview-select" aria-label="Choose PDF to preview"></select><button id="close-survey-preview" type="button">Close preview</button></div>
      <iframe id="survey-frame" title="Site document PDF preview"></iframe>
    `;
    mapStage.appendChild(overlay);

    const input = document.getElementById('survey-pdf');
    const status = document.getElementById('survey-status');
    const checks = document.getElementById('survey-checks');
    const preview = document.getElementById('preview-survey');
    const skip = document.getElementById('skip-survey');
    const frame = document.getElementById('survey-frame');
    const select = document.getElementById('survey-preview-select');
    const files = [];

    function syncDataset() {
      if (!files.length) {
        delete document.documentElement.dataset.siteSurvey;
        delete document.documentElement.dataset.siteDocuments;
      } else {
        document.documentElement.dataset.siteSurvey = files[0].file.name;
        document.documentElement.dataset.siteDocuments = String(files.length);
      }
    }

    function renderFiles() {
      status.innerHTML = '';
      select.innerHTML = '';
      files.forEach((entry, index) => {
        const row = document.createElement('div');
        row.className = 'survey-file';
        row.innerHTML = `<strong></strong><span></span><button type="button">Remove</button>`;
        row.querySelector('strong').textContent = entry.file.name;
        row.querySelector('span').textContent = `${(entry.file.size / 1024 / 1024).toFixed(2)} MB`;
        row.querySelector('button').addEventListener('click', () => {
          URL.revokeObjectURL(entry.url);
          files.splice(index, 1);
          renderFiles();
        });
        status.appendChild(row);
        const option = document.createElement('option');
        option.value = String(index);
        option.textContent = entry.file.name;
        select.appendChild(option);
      });
      status.hidden = files.length === 0;
      checks.hidden = files.length === 0;
      preview.hidden = files.length === 0;
      syncDataset();
      if (files.length && nextStep) nextStep.textContent = 'Review documents or confirm parcel';
    }

    input.addEventListener('change', () => {
      const selected = Array.from(input.files || []);
      for (const file of selected) {
        const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
        if (!isPdf) {
          alert(`${file.name} is not a PDF and was not added.`);
          continue;
        }
        if (file.size > 30 * 1024 * 1024) {
          alert(`${file.name} is larger than 30 MB and was not added.`);
          continue;
        }
        if (files.some((entry) => entry.file.name === file.name && entry.file.size === file.size)) continue;
        files.push({ file, url: URL.createObjectURL(file) });
      }
      input.value = '';
      renderFiles();
    });

    function showSelectedPreview() {
      const entry = files[Number(select.value || 0)];
      if (!entry) return;
      frame.src = entry.url;
      overlay.hidden = false;
    }

    preview.addEventListener('click', showSelectedPreview);
    select.addEventListener('change', showSelectedPreview);
    document.getElementById('close-survey-preview').addEventListener('click', () => { overlay.hidden = true; });
    skip.addEventListener('click', () => {
      section.dataset.skipped = 'true';
      skip.textContent = 'Continuing without site documents';
      skip.disabled = true;
      if (nextStep) nextStep.textContent = 'Confirm parcel boundary';
      const target = parcelControls.querySelector('.step.compact');
      target?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });

    const process = document.querySelector('.process');
    if (process) process.innerHTML = '<div class="done"><b>1</b><span>Locate property</span></div><div class="current"><b>2</b><span>Confirm site information</span></div><div><b>3</b><span>House placement</span></div><div><b>4</b><span>Send to Bauhu</span></div>';
  });
})();
