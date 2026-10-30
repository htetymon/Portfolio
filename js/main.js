(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const menuToggle = document.querySelector('.menu-toggle');
  const primaryNavigation = document.querySelector('#primary-navigation');
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

  if (menuToggle && primaryNavigation) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', `${isOpen ? 'Close' : 'Open'} navigation menu`);
      primaryNavigation.dataset.open = String(isOpen);
      const icon = menuToggle.querySelector('[aria-hidden="true"]');
      if (icon) icon.textContent = isOpen ? '×' : '☰';
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-label', 'Open navigation menu');
        primaryNavigation.dataset.open = 'false';
        const icon = menuToggle.querySelector('[aria-hidden="true"]');
        if (icon) icon.textContent = '☰';
        menuToggle.focus();
      }
    });
  }

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

  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    const fields = [
      { input: contactForm.elements.name, error: document.querySelector('#name-error'), label: 'Name' },
      { input: contactForm.elements.email, error: document.querySelector('#email-error'), label: 'Email address' },
      { input: contactForm.elements.message, error: document.querySelector('#message-error'), label: 'Message' },
    ];
    const status = document.querySelector('#form-status');
    const messageCount = document.querySelector('#message-count');
    const confirmationDialog = document.querySelector('#message-confirmation');
    const messageField = contactForm.elements.message;

    function updateMessageCount() {
      if (messageCount) {
        messageCount.textContent = `${messageField.value.length} / ${messageField.maxLength} characters`;
      }
    }

    updateMessageCount();

    function validateField(field) {
      const { input, error, label } = field;
      const value = input.value.trim();
      let errorMessage = '';

      if (!value) {
        errorMessage = `${label} is required.`;
      } else if (input.type === 'email' && input.validity.typeMismatch) {
        errorMessage = 'Enter a valid email address, such as name@example.com.';
      } else if (input.minLength > 0 && value.length < input.minLength) {
        errorMessage = `${label} must be at least ${input.minLength} characters.`;
      } else if (input.maxLength > 0 && value.length > input.maxLength) {
        errorMessage = `${label} must be ${input.maxLength} characters or fewer.`;
      }

      error.textContent = errorMessage;
      input.setAttribute('aria-invalid', String(Boolean(errorMessage)));
      return !errorMessage;
    }

    messageField.addEventListener('input', updateMessageCount);

    fields.forEach((field) => {
      field.input.addEventListener('input', () => {
        if (field.input.getAttribute('aria-invalid') === 'true') validateField(field);
        if (status) status.textContent = '';
      });
    });

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const invalidFields = fields.filter((field) => !validateField(field));
      if (invalidFields.length) {
        if (status) status.textContent = 'Please fix the highlighted fields and try again.';
        invalidFields[0].input.focus();
        return;
      }

      if (status) status.textContent = '';
      if (confirmationDialog?.showModal) {
        confirmationDialog.showModal();
      } else {
        window.alert('Demo only. Your message has not been sent.');
      }
    });
  }

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
