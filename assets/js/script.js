
const header = document.querySelector('.site-header');
const mobileToggle = document.querySelector('.mobile-toggle');
const navMenu = document.querySelector('.nav-menu');
const dropdowns = document.querySelectorAll('.dropdown');
const year = document.querySelector('[data-year]');
const filterButtons = document.querySelectorAll('[data-filter]');
const portfolioItems = document.querySelectorAll('[data-category]');
const contactForm = document.querySelector('[data-contact-form]');

if (year) {
  year.textContent = new Date().getFullYear();
}

const isMobileNav = () => window.matchMedia('(max-width: 920px)').matches;

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 12);
};

const closeDropdowns = () => {
  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove('open');
    const trigger = dropdown.querySelector('.dropdown-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });
};

const closeMobileMenu = () => {
  if (!mobileToggle || !navMenu) return;
  mobileToggle.classList.remove('active');
  navMenu.classList.remove('active');
  document.body.classList.remove('menu-open');
  mobileToggle.setAttribute('aria-expanded', 'false');
  closeDropdowns();
};

const openMobileMenu = () => {
  if (!mobileToggle || !navMenu) return;
  mobileToggle.classList.add('active');
  navMenu.classList.add('active');
  document.body.classList.add('menu-open');
  mobileToggle.setAttribute('aria-expanded', 'true');
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

if (mobileToggle && navMenu) {
  mobileToggle.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('active');
    isOpen ? closeMobileMenu() : openMobileMenu();
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });
}

dropdowns.forEach((dropdown) => {
  const trigger = dropdown.querySelector('.dropdown-trigger');
  if (!trigger) return;

  trigger.addEventListener('click', (event) => {
    if (!isMobileNav()) {
      event.preventDefault();
      return;
    }

    event.preventDefault();

    dropdowns.forEach((item) => {
      if (item !== dropdown) {
        item.classList.remove('open');
        const otherTrigger = item.querySelector('.dropdown-trigger');
        if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    const isOpen = dropdown.classList.toggle('open');
    trigger.setAttribute('aria-expanded', String(isOpen));
  });

  dropdown.addEventListener('mouseenter', () => {
    if (isMobileNav()) return;
    closeDropdowns();
    dropdown.classList.add('open');
    trigger.setAttribute('aria-expanded', 'true');
  });

  dropdown.addEventListener('mouseleave', () => {
    if (isMobileNav()) return;
    dropdown.classList.remove('open');
    trigger.setAttribute('aria-expanded', 'false');
  });
});

document.addEventListener('click', (event) => {
  const clickedDropdown = event.target.closest('.dropdown');
  const clickedMenu = event.target.closest('.nav-menu');
  const clickedToggle = event.target.closest('.mobile-toggle');

  if (!clickedDropdown) closeDropdowns();

  if (isMobileNav() && document.body.classList.contains('menu-open') && !clickedMenu && !clickedToggle) {
    closeMobileMenu();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;
  closeDropdowns();
  closeMobileMenu();
});

window.addEventListener('resize', () => {
  if (!isMobileNav()) {
    closeMobileMenu();
  }
});

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('visible'));
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((btn) => btn.classList.remove('active'));
    button.classList.add('active');

    portfolioItems.forEach((item) => {
      const shouldShow = filter === 'all' || item.dataset.category === filter;
      item.style.display = shouldShow ? '' : 'none';
    });
  });
});

if (contactForm) {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const data = new FormData(contactForm);
    const name = data.get('name') || '';
    const email = data.get('email') || '';
    const service = data.get('service') || '';
    const phone = data.get('phone') || '';
    const message = data.get('message') || '';
    const subject = encodeURIComponent(`New Nexio project inquiry from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nService: ${service}\n\nProject details:\n${message}`
    );

    window.location.href = `mailto:hello@nexio.am?subject=${subject}&body=${body}`;
  });
}

const spotlightCards = document.querySelectorAll('.service-card, .work-card, .value-card, .process-card, .testimonial-card, .contact-card, .info-panel, .price-card, .service-detail, .case-card');

spotlightCards.forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty('--mx', `${x}%`);
    card.style.setProperty('--my', `${y}%`);
  });
});


// Before / After comparison sliders
document.querySelectorAll('.ba-slider').forEach((slider) => {
  const range = slider.querySelector('.ba-range');
  const afterWrap = slider.querySelector('.ba-after-wrap');
  const handle = slider.querySelector('.ba-handle');

  const updateSlider = (value) => {
    const percentage = `${value}%`;
    afterWrap.style.width = percentage;
    handle.style.left = percentage;
  };

  if (range && afterWrap && handle) {
    updateSlider(range.value);
    range.addEventListener('input', (event) => updateSlider(event.target.value));
  }
});


// Center service cards / anchor targets instead of placing them at the very top
(() => {
  const centerAnchorTarget = (hash, delay = 0) => {
    if (!hash || hash === '#') return;

    const targetId = decodeURIComponent(hash.slice(1));
    const target = document.getElementById(targetId);

    if (!target) return;

    window.setTimeout(() => {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }, delay);
  };

  // When opening a page with a hash, center the target after the browser's default jump.
  if (window.location.hash) {
    centerAnchorTarget(window.location.hash, 180);
  }

  // When clicking an anchor on the same page, center the selected section/card.
  document.querySelectorAll('a[href*="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;

      const url = new URL(href, window.location.href);
      const samePage =
        url.pathname === window.location.pathname &&
        url.origin === window.location.origin;

      if (!samePage || !url.hash) return;

      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;

      event.preventDefault();
      history.pushState(null, '', url.hash);
      centerAnchorTarget(url.hash, 0);

      // Close mobile menu if it is open.
      const navMenu = document.querySelector('.nav-menu');
      const mobileToggle = document.querySelector('.mobile-toggle');
      if (navMenu && mobileToggle) {
        navMenu.classList.remove('active');
        mobileToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();
