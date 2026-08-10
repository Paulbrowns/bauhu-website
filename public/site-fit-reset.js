(() => {
  function init() {
    const siteFitPage = document.querySelector('.site-fit-page');
    const toolbar = document.querySelector('.map-toolbar');
    if (!siteFitPage || !toolbar) return;

    const heading = document.querySelector('.site-fit-header h1');
    if (heading) heading.textContent = 'Locate your site';

    const headerCopy = document.querySelector('.site-fit-header > div');
    if (headerCopy && !document.getElementById('site-fit-skip')) {
      const skipLink = document.createElement('a');
      skipLink.id = 'site-fit-skip';
      skipLink.className = 'site-fit-skip';
      skipLink.href = '/start-your-project?skipSite=1';
      skipLink.textContent = 'Not found a site yet? Skip this step';
      headerCopy.appendChild(skipLink);
    }

    if (document.getElementById('site-fit-reset')) return;

    const button = document.createElement('button');
    button.id = 'site-fit-reset';
    button.type = 'button';
    button.className = 'site-fit-reset';
    button.textContent = 'Start again';
    button.setAttribute('aria-label', 'Clear this site and start again');

    button.addEventListener('click', () => {
      try {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('bauhu-site-fit:') || key.startsWith('bauhu-survey:')) {
            localStorage.removeItem(key);
          }
        });
        Object.keys(sessionStorage).forEach((key) => {
          if (key.startsWith('bauhu-site-fit:') || key.startsWith('bauhu-survey:')) {
            sessionStorage.removeItem(key);
          }
        });
      } catch {
        // Storage may be unavailable; reloading still clears all in-memory map state.
      }

      const cleanUrl = `${window.location.pathname}${window.location.hash || ''}`;
      window.location.replace(cleanUrl);
    });

    const firstGroup = toolbar.firstElementChild;
    if (firstGroup) firstGroup.appendChild(button);
    else toolbar.prepend(button);

    const style = document.createElement('style');
    style.textContent = `
      .site-fit-skip {
        display: inline-block;
        margin-top: 1.15rem;
        padding: .78rem 1rem;
        border: 1px solid rgba(23, 57, 76, .24);
        color: #17394c;
        background: rgba(247, 245, 239, .72);
        text-decoration: none;
        font: 700 .72rem/1 Inter, sans-serif;
        letter-spacing: .04em;
      }
      .site-fit-skip:hover,
      .site-fit-skip:focus-visible {
        background: #17394c;
        color: #fff;
      }
      .site-fit-reset {
        margin-left: .45rem;
        border-color: rgba(124, 64, 55, .32) !important;
        color: #7c4037 !important;
        background: transparent !important;
      }
      .site-fit-reset:hover,
      .site-fit-reset:focus-visible {
        border-color: #7c4037 !important;
        background: rgba(124, 64, 55, .08) !important;
      }
    `;
    document.head.appendChild(style);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
