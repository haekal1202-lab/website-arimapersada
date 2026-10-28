(() => {
  'use strict';

  const body = document.body;
  const nav = document.querySelector('nav');

  // Mobile navigation: add a real keyboard-accessible toggle without
  // changing the content hierarchy or links in the HTML.
  if (nav) {
    const links = nav.querySelector('.nav-links');
    const cta = nav.querySelector('.nav-cta');
    if (links && !nav.querySelector('.nav-menu-toggle')) {
      const toggle = document.createElement('button');
      toggle.className = 'nav-menu-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-label', 'Buka menu navigasi');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-controls', 'primary-navigation');
      toggle.innerHTML = '<span></span><span></span>';
      links.id = 'primary-navigation';
      if (cta && cta.parentNode === nav) cta.insertAdjacentElement('afterend', toggle);
      else nav.appendChild(toggle);

      const setMenu = (open) => {
        nav.classList.toggle('menu-open', open);
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
      };
      toggle.addEventListener('click', () => {
        setMenu(toggle.getAttribute('aria-expanded') !== 'true');
      });
      links.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => setMenu(false));
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape') setMenu(false);
      });
      document.addEventListener('click', event => {
        if (!nav.contains(event.target)) setMenu(false);
      });
      window.addEventListener('resize', () => {
        if (window.innerWidth > 820) setMenu(false);
      });
    }

    const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 24);
    updateNav();
    window.addEventListener('scroll', updateNav, { passive: true });
  }

  // Keep all content visible if IntersectionObserver isn't supported.
  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealElements.length) {
    body.classList.add('js-ready');
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
    revealElements.forEach(el => revealObserver.observe(el));
  }

  // FAQ accordion with keyboard and assistive-technology support.
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item, index) => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    const icon = question ? question.querySelector('span') : null;
    if (!question || !answer) return;

    const answerId = answer.id || `faq-answer-${index + 1}`;
    answer.id = answerId;
    question.setAttribute('role', 'button');
    question.setAttribute('tabindex', '0');
    question.setAttribute('aria-controls', answerId);
    question.setAttribute('aria-expanded', String(item.classList.contains('active')));

    const closeItem = other => {
      other.classList.remove('active');
      const q = other.querySelector('.faq-question');
      const i = q && q.querySelector('span');
      if (q) q.setAttribute('aria-expanded', 'false');
      if (i) i.textContent = '+';
    };
    const toggleItem = () => {
      const willOpen = !item.classList.contains('active');
      faqItems.forEach(other => { if (other !== item) closeItem(other); });
      item.classList.toggle('active', willOpen);
      question.setAttribute('aria-expanded', String(willOpen));
      if (icon) icon.textContent = willOpen ? '−' : '+';
    };

    question.addEventListener('click', toggleItem);
    question.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        toggleItem();
      }
    });
  });

  // Allow a card opened from another page to align below the fixed header.
  if (window.location.hash) {
    window.addEventListener('load', () => {
      const target = document.getElementById(decodeURIComponent(window.location.hash.slice(1)));
      if (target) setTimeout(() => target.scrollIntoView({ block: 'start' }), 80);
    }, { once: true });
  }
})();