(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const themeStorageKey = 'htet-yee-mon-theme';

  const requestedTheme = new URLSearchParams(window.location.search).get('theme');
  let savedTheme = requestedTheme === 'dark' || requestedTheme === 'light' ? requestedTheme : 'light';
  try {
    const preference = localStorage.getItem(themeStorageKey);
    if (!requestedTheme && (preference === 'dark' || preference === 'light')) savedTheme = preference;
  } catch {
    // The site still works when browser storage is unavailable.
  }

  function applyTheme(theme) {
    root.dataset.theme = theme;
    if (themeToggle) {
      const isDark = theme === 'dark';
      themeToggle.setAttribute('aria-pressed', String(isDark));
      themeToggle.setAttribute('aria-label', `Switch to ${isDark ? 'light' : 'dark'} theme`);
      const label = themeToggle.querySelector('.theme-toggle-label');
      if (label) label.textContent = isDark ? 'Dark mode' : 'Light mode';
      const icon = themeToggle.querySelector('[aria-hidden="true"]');
      if (icon) icon.textContent = isDark ? '☀' : '☾';
    }

    document.querySelectorAll('img').forEach((image) => {
      if (image.src.includes('lightmode-avatar.png')) {
        image.src = `../assets/images/${theme}mode-avatar.png`;
      } else if (image.src.includes('darkmode-avatar.png')) {
        image.src = `../assets/images/${theme}mode-avatar.png`;
      } else if (image.src.includes('lightmode-contact.png')) {
        image.src = `../assets/images/${theme}mode-contact.png`;
      } else if (image.src.includes('darkmode-contact.png')) {
        image.src = `../assets/images/${theme}mode-contact.png`;
      }
    });
  }

  applyTheme(savedTheme);

  themeToggle?.addEventListener('click', () => {
    const theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(theme);
    try {
      localStorage.setItem(themeStorageKey, theme);
    } catch {
      // Keep the selection for this page even if it cannot be persisted.
    }
  });

  // Browsers can isolate storage between file:// pages. Carry the preference
  // on local page links in that case so it survives navigation in a static copy.
  if (window.location.protocol === 'file:') {
    document.querySelectorAll('a[href]').forEach((link) => {
      link.addEventListener('click', () => {
        const destination = new URL(link.href, window.location.href);
        if (destination.protocol !== 'file:' || !destination.pathname.endsWith('.html')) return;
        destination.searchParams.set('theme', root.dataset.theme || savedTheme);
        link.href = destination.href;
      });
    });
  }
})();
