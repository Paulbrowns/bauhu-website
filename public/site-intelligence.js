(() => {
  const page = document.querySelector('.site-fit-page');
  if (!page || document.getElementById('site-intelligence')) return;

  const get = (id) => document.getElementById(id);
  const latInput = get('latitude');
  const lngInput = get('longitude');
  const confirmLocation = get('confirm-location');
  if (!latInput || !lngInput || !confirmLocation) return;

  const host = document.createElement('section');
  host.id = 'site-intelligence';
  host.className = 'site-intelligence is-locked';
  host.innerHTML = `
    <header class="si-header">
      <div>
        <p class="si-kicker">SITE INTELLIGENCE</p>
        <h2>Sun, climate and preliminary hazard screening</h2>
        <p>Calculated from the confirmed coordinates and supplemented with public screening datasets. Results are preliminary and do not replace professional site investigations.</p>
      </div>
      <div class="si-location">
        <span>Confirmed coordinates</span>
        <strong id="si-coordinates">Confirm a location to begin</strong>
        <small id="si-updated">Awaiting location</small>
      </div>
    </header>

    <div class="si-tabs" role="tablist">
      <button class="is-active" data-panel="sun">Sun study</button>
      <button data-panel="climate">Climate</button>
      <button data-panel="hazards">Hazards</button>
    </div>

    <div class="si-panel is-active" data-si-panel="sun">
      <div class="si-sun-grid">
        <div class="si-sun-diagram">
          <div class="si-compass">
            <span class="north">N</span><span class="east">E</span><span class="south">S</span><span class="west">W</span>
            <div class="si-horizon"></div>
            <div id="si-sunrise-ray" class="si-ray sunrise"></div>
            <div id="si-sunset-ray" class="si-ray sunset"></div>
            <div class="si-site-dot"></div>
          </div>
          <p>Current-day sunrise and sunset bearings</p>
        </div>
        <div class="si-metrics">
          <article><span>Sunrise</span><strong id="si-sunrise">—</strong><small id="si-sunrise-bearing">—</small></article>
          <article><span>Sunset</span><strong id="si-sunset">—</strong><small id="si-sunset-bearing">—</small></article>
          <article><span>Daylight</span><strong id="si-daylight">—</strong><small>Calculated</small></article>
          <article><span>Solar noon altitude</span><strong id="si-noon-altitude">—</strong><small>Approximate</small></article>
        </div>
      </div>
      <div class="si-season-table">
        <div><span>Date</span><span>Sunrise bearing</span><span>Sunset bearing</span><span>Daylight</span></div>
        <div><strong>March equinox</strong><span id="si-mar-rise">—</span><span id="si-mar-set">—</span><span id="si-mar-day">—</span></div>
        <div><strong>June solstice</strong><span id="si-jun-rise">—</span><span id="si-jun-set">—</span><span id="si-jun-day">—</span></div>
        <div><strong>September equinox</strong><span id="si-sep-rise">—</span><span id="si-sep-set">—</span><span id="si-sep-day">—</span></div>
        <div><strong>December solstice</strong><span id="si-dec-rise">—</span><span id="si-dec-set">—</span><span id="si-dec-day">—</span></div>
      </div>
      <div class="si-guidance" id="si-sun-guidance">Confirm the location to calculate the solar orientation.</div>
    </div>

    <div class="si-panel" data-si-panel="climate">
      <div id="si-climate-loading" class="si-loading">Confirm the location to load NASA POWER climate data.</div>
      <div id="si-climate-grid" class="si-climate-grid" hidden>
        <article><span>Annual mean temperature</span><strong id="si-temp">—</strong><small>NASA POWER climatology</small></article>
        <article><span>Relative humidity</span><strong id="si-humidity">—</strong><small>NASA POWER climatology</small></article>
        <article><span>Wind speed at 10 m</span><strong id="si-wind">—</strong><small>NASA POWER climatology</small></article>
        <article><span>Solar radiation</span><strong id="si-solar">—</strong><small>NASA POWER climatology</small></article>
        <article><span>Precipitation</span><strong id="si-rain">—</strong><small>NASA POWER climatology</small></article>
      </div>
      <p class="si-source-note">Source: NASA POWER monthly climatology point service. Data are screening-level gridded climate values, not measurements from the property.</p>
    </div>

    <div class="si-panel" data-si-panel="hazards">
      <div class="si-hazard-grid">
        <article id="si-coastal-card"><div><span>Coastal exposure</span><b class="si-confidence">Screening</b></div><strong id="si-coastal-title">Awaiting location</strong><p id="si-coastal-text">Confirm the location to check relevant coastal screening sources.</p><a id="si-coastal-link" href="https://www.coast.noaa.gov/digitalcoast/tools/slr.html" target="_blank" rel="noreferrer">NOAA Sea Level Rise Viewer</a></article>
        <article><div><span>Flood mapping</span><b class="si-confidence">Authoritative source</b></div><strong id="si-flood-title">Mapping review required</strong><p id="si-flood-text">Use FEMA or the relevant local authority to confirm mapped flood zones and regulatory elevations.</p><a href="https://msc.fema.gov/portal/home" target="_blank" rel="noreferrer">FEMA Map Service Center</a></article>
        <article><div><span>Wind and storm</span><b class="si-confidence">Preliminary</b></div><strong id="si-wind-title">Regional review required</strong><p id="si-wind-text">Confirm the location to identify whether tropical-cyclone design review should be prioritised.</p></article>
        <article><div><span>Seismic context</span><b class="si-confidence">Preliminary</b></div><strong>Engineering review required</strong><p>Regional seismic hazard must be verified against the governing structural code and authoritative hazard maps.</p><a href="https://earthquake.usgs.gov/hazards/interactive/" target="_blank" rel="noreferrer">USGS seismic tools</a></article>
        <article><div><span>Terrain and slope</span><b class="si-confidence">Survey-led</b></div><strong id="si-terrain-title">Survey preferred</strong><p id="si-terrain-text">Contours, banks, retaining conditions and access gradients should be read from the uploaded survey or a verified topographic model.</p></article>
      </div>
      <p class="si-source-note">Hazard cards identify the next authoritative check. They do not declare a property safe, unsafe, buildable or unbuildable.</p>
    </div>
  `;

  const insertBefore = document.querySelector('.disclaimer');
  if (insertBefore?.parentNode) insertBefore.parentNode.insertBefore(host, insertBefore);
  else page.appendChild(host);

  const tabs = [...host.querySelectorAll('.si-tabs button')];
  const panels = [...host.querySelectorAll('[data-si-panel]')];
  tabs.forEach((button) => button.addEventListener('click', () => {
    tabs.forEach((item) => item.classList.toggle('is-active', item === button));
    panels.forEach((panel) => panel.classList.toggle('is-active', panel.dataset.siPanel === button.dataset.panel));
  }));

  const rad = (degrees) => degrees * Math.PI / 180;
  const deg = (radians) => radians * 180 / Math.PI;
  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const formatBearing = (value) => `${Math.round((value + 360) % 360)}°`;
  const formatHours = (hours) => {
    const totalMinutes = Math.round(hours * 60);
    return `${Math.floor(totalMinutes / 60)}h ${String(totalMinutes % 60).padStart(2, '0')}m`;
  };
  const formatClock = (hours) => {
    let totalMinutes = Math.round(hours * 60);
    totalMinutes = ((totalMinutes % 1440) + 1440) % 1440;
    const h = Math.floor(totalMinutes / 60);
    const m = totalMinutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
  };

  function dayOfYear(date) {
    const start = Date.UTC(date.getUTCFullYear(), 0, 0);
    return Math.floor((Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()) - start) / 86400000);
  }

  function solarForDate(lat, lng, date) {
    const n = dayOfYear(date);
    const gamma = 2 * Math.PI / 365 * (n - 1);
    const equationOfTime = 229.18 * (0.000075 + 0.001868 * Math.cos(gamma) - 0.032077 * Math.sin(gamma) - 0.014615 * Math.cos(2 * gamma) - 0.040849 * Math.sin(2 * gamma));
    const declination = 0.006918 - 0.399912 * Math.cos(gamma) + 0.070257 * Math.sin(gamma) - 0.006758 * Math.cos(2 * gamma) + 0.000907 * Math.sin(2 * gamma) - 0.002697 * Math.cos(3 * gamma) + 0.00148 * Math.sin(3 * gamma);
    const latRad = rad(lat);
    const zenith = rad(90.833);
    const cosHour = clamp((Math.cos(zenith) / (Math.cos(latRad) * Math.cos(declination))) - Math.tan(latRad) * Math.tan(declination), -1, 1);
    const hourAngle = Math.acos(cosHour);
    const daylight = 2 * deg(hourAngle) / 15;
    const solarNoonUtc = (720 - 4 * lng - equationOfTime) / 60;
    const sunriseUtc = solarNoonUtc - daylight / 2;
    const sunsetUtc = solarNoonUtc + daylight / 2;
    const azimuth = deg(Math.acos(clamp((Math.sin(declination) - Math.sin(latRad) * Math.cos(zenith)) / (Math.cos(latRad) * Math.sin(zenith)), -1, 1)));
    const sunriseAzimuth = azimuth;
    const sunsetAzimuth = 360 - azimuth;
    const noonAltitude = 90 - Math.abs(lat - deg(declination));
    return { sunriseUtc, sunsetUtc, daylight, sunriseAzimuth, sunsetAzimuth, noonAltitude };
  }

  function setRay(id, bearing) {
    const element = get(id);
    if (element) element.style.transform = `translate(-50%, -100%) rotate(${bearing}deg)`;
  }

  function updateSeason(prefix, data) {
    get(`si-${prefix}-rise`).textContent = formatBearing(data.sunriseAzimuth);
    get(`si-${prefix}-set`).textContent = formatBearing(data.sunsetAzimuth);
    get(`si-${prefix}-day`).textContent = formatHours(data.daylight);
  }

  function renderSun(lat, lng) {
    const today = new Date();
    const current = solarForDate(lat, lng, today);
    get('si-sunrise').textContent = `${formatClock(current.sunriseUtc)} UTC`;
    get('si-sunset').textContent = `${formatClock(current.sunsetUtc)} UTC`;
    get('si-daylight').textContent = formatHours(current.daylight);
    get('si-noon-altitude').textContent = `${Math.round(current.noonAltitude)}°`;
    get('si-sunrise-bearing').textContent = `${formatBearing(current.sunriseAzimuth)} from north`;
    get('si-sunset-bearing').textContent = `${formatBearing(current.sunsetAzimuth)} from north`;
    setRay('si-sunrise-ray', current.sunriseAzimuth);
    setRay('si-sunset-ray', current.sunsetAzimuth);

    const year = today.getUTCFullYear();
    updateSeason('mar', solarForDate(lat, lng, new Date(Date.UTC(year, 2, 20))));
    updateSeason('jun', solarForDate(lat, lng, new Date(Date.UTC(year, 5, 21))));
    updateSeason('sep', solarForDate(lat, lng, new Date(Date.UTC(year, 8, 22))));
    updateSeason('dec', solarForDate(lat, lng, new Date(Date.UTC(year, 11, 21))));

    const hemisphere = lat >= 0 ? 'south-facing façades generally receive the strongest annual solar exposure' : 'north-facing façades generally receive the strongest annual solar exposure';
    get('si-sun-guidance').textContent = `At this latitude, ${hemisphere}. West-facing glazing and terraces should be reviewed carefully for afternoon heat, while the final orientation should also respond to views, access, wind and topography.`;
  }

  function isUsvi(lat, lng) {
    return lat >= 17.62 && lat <= 18.48 && lng >= -65.15 && lng <= -64.45;
  }

  function isCaribbean(lat, lng) {
    return lat >= 9 && lat <= 28 && lng >= -89 && lng <= -58;
  }

  function renderHazards(lat, lng) {
    if (isUsvi(lat, lng)) {
      get('si-coastal-title').textContent = 'USVI coastal screening available';
      get('si-coastal-text').textContent = 'NOAA provides coastal and sea-level-rise screening resources for the U.S. Virgin Islands. Confirm site elevation and mapped inundation separately.';
      get('si-flood-title').textContent = 'FEMA and local mapping review required';
      get('si-flood-text').textContent = 'Check the effective Flood Insurance Rate Map, mapped flood zone and any base flood elevation applying to the parcel.';
      get('si-wind-title').textContent = 'Hurricane-region design review';
      get('si-wind-text').textContent = 'The selected coordinates are within the U.S. Virgin Islands. Wind speed, exposure category, topographic effects and component pressures require project-specific engineering.';
    } else if (isCaribbean(lat, lng)) {
      get('si-coastal-title').textContent = 'Coastal screening strongly recommended';
      get('si-coastal-text').textContent = 'The selected coordinates are in the wider Caribbean screening region. Confirm storm surge, coastal flooding and sea-level data with the relevant national authority.';
      get('si-wind-title').textContent = 'Tropical-cyclone review recommended';
      get('si-wind-text').textContent = 'Project-specific wind design criteria and local code requirements should be established before structural design.';
    } else {
      get('si-coastal-title').textContent = 'Check local coastal datasets';
      get('si-coastal-text').textContent = 'Use the appropriate national or regional authority to establish coastal flood, storm surge and sea-level exposure.';
      get('si-wind-title').textContent = 'Local wind design review required';
      get('si-wind-text').textContent = 'Confirm the governing basic wind speed, exposure, topography and code requirements for this jurisdiction.';
    }

    const surveyText = document.body.textContent.includes('Survey added') || document.body.textContent.includes('survey uploaded');
    get('si-terrain-title').textContent = surveyText ? 'Uploaded survey can inform terrain review' : 'Topographic survey recommended';
    get('si-terrain-text').textContent = surveyText
      ? 'Use the uploaded survey to review contours, banks, retaining conditions, access gradients and likely cut-and-fill implications.'
      : 'A topographic survey is the preferred source for contours, banks, access gradients and preliminary grading review.';
  }

  function annualValue(parameter) {
    if (!parameter) return null;
    if (Number.isFinite(Number(parameter.ANN))) return Number(parameter.ANN);
    const values = Object.entries(parameter)
      .filter(([key, value]) => key !== 'ANN' && Number.isFinite(Number(value)) && Number(value) > -900)
      .map(([, value]) => Number(value));
    return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : null;
  }

  async function loadClimate(lat, lng) {
    const loading = get('si-climate-loading');
    const grid = get('si-climate-grid');
    loading.hidden = false;
    grid.hidden = true;
    loading.textContent = 'Loading NASA POWER climate normals…';
    const url = `https://power.larc.nasa.gov/api/temporal/climatology/point?parameters=T2M,RH2M,WS10M,ALLSKY_SFC_SW_DWN,PRECTOTCORR&community=SB&longitude=${encodeURIComponent(lng)}&latitude=${encodeURIComponent(lat)}&format=JSON`;
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Climate request failed');
      const data = await response.json();
      const parameters = data?.properties?.parameter || {};
      const temp = annualValue(parameters.T2M);
      const humidity = annualValue(parameters.RH2M);
      const wind = annualValue(parameters.WS10M);
      const solar = annualValue(parameters.ALLSKY_SFC_SW_DWN);
      const rain = annualValue(parameters.PRECTOTCORR);
      get('si-temp').textContent = temp == null ? 'Unavailable' : `${temp.toFixed(1)} °C`;
      get('si-humidity').textContent = humidity == null ? 'Unavailable' : `${humidity.toFixed(0)}%`;
      get('si-wind').textContent = wind == null ? 'Unavailable' : `${wind.toFixed(1)} m/s`;
      get('si-solar').textContent = solar == null ? 'Unavailable' : `${solar.toFixed(1)} kWh/m²/day`;
      get('si-rain').textContent = rain == null ? 'Unavailable' : `${rain.toFixed(1)} mm/day`;
      loading.hidden = true;
      grid.hidden = false;
    } catch (error) {
      loading.textContent = 'NASA POWER climate data are temporarily unavailable. The calculated sun study remains available.';
    }
  }

  function activate() {
    const lat = Number(latInput.value);
    const lng = Number(lngInput.value);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;
    host.classList.remove('is-locked');
    get('si-coordinates').textContent = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    get('si-updated').textContent = `Updated ${new Date().toLocaleString()}`;
    renderSun(lat, lng);
    renderHazards(lat, lng);
    loadClimate(lat, lng);
  }

  confirmLocation.addEventListener('click', () => setTimeout(activate, 0));
  const locationStatus = get('location-status');
  if (locationStatus?.textContent?.toLowerCase().includes('confirmed')) activate();
})();
