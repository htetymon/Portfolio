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

  const projectFilters = document.querySelectorAll('.project-filters [data-filter]');
  const projectCards = document.querySelectorAll('.project-card[data-category]');
  const projectFilterStatus = document.querySelector('#project-filter-status');

  projectFilters.forEach((button) => {
    button.addEventListener('click', () => {
      const selectedCategory = button.dataset.filter;
      let visibleCount = 0;

      projectFilters.forEach((filterButton) => {
        filterButton.setAttribute('aria-pressed', String(filterButton === button));
      });

      projectCards.forEach((card) => {
        const isVisible = selectedCategory === 'all' || card.dataset.category === selectedCategory;
        card.hidden = !isVisible;
        if (isVisible) visibleCount += 1;
      });

      if (projectFilterStatus) {
        const categoryName = button.textContent.trim();
        projectFilterStatus.textContent = `${visibleCount} ${visibleCount === 1 ? 'project' : 'projects'} shown for ${categoryName}.`;
      }
    });
  });

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
