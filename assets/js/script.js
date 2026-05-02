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

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle('scrolled', window.scrollY > 16);
};

setHeaderState();
window.addEventListener('scroll', setHeaderState, { passive: true });

if (mobileToggle && navMenu) {
  mobileToggle.addEventListener('click', () => {
    const isOpen = mobileToggle.classList.toggle('active');
    navMenu.classList.toggle('active', isOpen);
    document.body.classList.toggle('menu-open', isOpen);
    mobileToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      navMenu.classList.remove('active');
      document.body.classList.remove('menu-open');
      mobileToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

dropdowns.forEach((dropdown) => {
  const trigger = dropdown.querySelector('.dropdown-trigger');
  const panel = dropdown.querySelector('.dropdown-panel');

  if (!trigger || !panel) return;

  trigger.addEventListener('click', (event) => {
    const isMobile = window.matchMedia('(max-width: 920px)').matches;
    if (isMobile) {
      event.preventDefault();
    }

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
});

document.addEventListener('click', (event) => {
  const clickedDropdown = event.target.closest('.dropdown');
  if (!clickedDropdown) {
    dropdowns.forEach((dropdown) => {
      dropdown.classList.remove('open');
      const trigger = dropdown.querySelector('.dropdown-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key !== 'Escape') return;

  dropdowns.forEach((dropdown) => {
    dropdown.classList.remove('open');
    const trigger = dropdown.querySelector('.dropdown-trigger');
    if (trigger) trigger.setAttribute('aria-expanded', 'false');
  });

  if (mobileToggle && navMenu) {
    mobileToggle.classList.remove('active');
    navMenu.classList.remove('active');
    document.body.classList.remove('menu-open');
    mobileToggle.setAttribute('aria-expanded', 'false');
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


// Premium card spotlight effect
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
