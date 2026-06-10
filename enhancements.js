/* ===========================================
   STACKLY — PREMIUM ENHANCEMENTS JS
   Animations, cursor, parallax, transitions
   =========================================== */

'use strict';

/* ── CUSTOM CURSOR ── */
(function initCursor() {
  if (window.matchMedia('(hover: none)').matches) return;

  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  }, { passive: true });

  (function animate() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animate);
  })();

  const hoverEls = 'a, button, .cause-card, .campaign-card, .vol-card, .blog-card, .social-btn, .t-nav-btn';
  document.querySelectorAll(hoverEls).forEach(el => {
    el.addEventListener('mouseenter', () => { dot.classList.add('hovered'); ring.classList.add('hovered'); });
    el.addEventListener('mouseleave', () => { dot.classList.remove('hovered'); ring.classList.remove('hovered'); });
  });
})();

/* ── FLOATING PARTICLES ── */
(function initParticles() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const container = document.createElement('div');
  container.className = 'particles-container';
  container.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:0;overflow:hidden;';
  hero.style.position = 'relative';
  hero.insertBefore(container, hero.firstChild);

  const count = window.innerWidth < 768 ? 8 : 14;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    const size = Math.random() * 8 + 4;
    const left = Math.random() * 100;
    const duration = Math.random() * 12 + 10;
    const delay = Math.random() * 8;
    p.style.cssText = `
      position:absolute;
      width:${size}px; height:${size}px;
      background:rgba(34,197,94,${Math.random() * 0.12 + 0.03});
      border-radius:50%;
      left:${left}%;
      bottom:-20px;
      animation:particleFloat ${duration}s ${delay}s linear infinite;
    `;
    container.appendChild(p);
  }
})();

/* ── RIPPLE EFFECT ON BUTTONS ── */
(function initRipple() {
  document.querySelectorAll('.btn-primary, .btn-outline, .btn-donate, .t-nav-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height) * 2;
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top  - size / 2;
      const ripple = document.createElement('span');
      ripple.className = 'ripple-circle';
      ripple.style.cssText = `
        width:${size}px; height:${size}px;
        left:${x}px; top:${y}px;
      `;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 700);
    });
  });
})();

/* ── PAGE TRANSITION ── */
(function initPageTransition() {
  const overlay = document.createElement('div');
  overlay.id = 'page-transition';
  document.body.appendChild(overlay);

  // Exclude hash links, external links, and non-html links
  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;
    if (href.includes('.html') || href === 'index.html' || !href.includes('.')) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        const target = this.href;
        overlay.classList.add('entering');
        setTimeout(() => { window.location.href = target; }, 350);
      });
    }
  });

  window.addEventListener('pageshow', () => {
    overlay.classList.remove('entering');
  });
})();

/* ── MOUSE PARALLAX ── */
(function initParallax() {
  const hero = document.querySelector('.hero-inner');
  if (!hero || window.innerWidth < 768) return;

  const targets = document.querySelectorAll('.hero-floating-card, .hero-img-main, .about-badge');

  document.addEventListener('mousemove', e => {
    const cx = window.innerWidth  / 2;
    const cy = window.innerHeight / 2;
    const dx = (e.clientX - cx) / cx;
    const dy = (e.clientY - cy) / cy;

    targets.forEach((el, i) => {
      const factor = (i % 2 === 0) ? 10 : 15;
      el.style.transform = `translate(${dx * factor}px, ${dy * factor}px)`;
    });
  }, { passive: true });
})();

/* ── COUNTER ANIMATION ENHANCED ── */
(function enhanceCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted2) {
        entry.target.dataset.counted2 = 'true';
        const parent = entry.target.closest('.stat-item');
        if (parent) {
          parent.style.animation = 'none';
          parent.style.transform = 'translateY(0)';
          // Bounce in
          setTimeout(() => {
            parent.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
            parent.style.transform = 'translateY(-5px)';
            setTimeout(() => { parent.style.transform = ''; }, 500);
          }, 200 * Array.from(counters).indexOf(entry.target));
        }
      }
    });
  }, { threshold: 0.4 });

  counters.forEach(c => observer.observe(c));
})();

/* ── TESTIMONIAL DOTS ── */
(function initTestimonialDots() {
  const track   = document.querySelector('.testimonials-track');
  const navArea = document.querySelector('.testimonials-nav');
  if (!track || !navArea) return;

  const cards = track.querySelectorAll('.testimonial-card');
  if (!cards.length) return;

  const dotsWrap = document.createElement('div');
  dotsWrap.className = 't-dots';

  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 't-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
    dot.addEventListener('click', () => {
      document.querySelectorAll('.t-dot').forEach(d => d.classList.remove('active'));
      dot.classList.add('active');
    });
    dotsWrap.appendChild(dot);
  });

  navArea.after(dotsWrap);

  // Sync dots with carousel navigation
  const prevBtn = document.querySelector('.t-prev');
  const nextBtn = document.querySelector('.t-next');
  let currentIndex = 0;

  function updateDots(idx) {
    currentIndex = idx;
    document.querySelectorAll('.t-dot').forEach((d, i) => {
      d.classList.toggle('active', i === idx % cards.length);
    });
  }

  if (nextBtn) nextBtn.addEventListener('click', () => updateDots(currentIndex + 1));
  if (prevBtn) prevBtn.addEventListener('click', () => updateDots(Math.max(0, currentIndex - 1)));
})();

/* ── SECTION REVEAL ── */
(function initSectionReveal() {
  const sections = document.querySelectorAll('section');
  if (!sections.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05 });

  sections.forEach(sec => {
    sec.classList.add('reveal-section');
    observer.observe(sec);
  });
})();

/* ── ENHANCED SCROLL PROGRESS BAR ── */
(function initScrollProgressEnhanced() {
  // Remove any existing progress bar added by main.js
  const existing = document.querySelectorAll('div[style*="position:fixed;top:0;left:0;height:2px"]');
  existing.forEach(el => el.remove());

  const bar = document.createElement('div');
  bar.id = 'scroll-progress-bar';
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const total  = document.documentElement.scrollHeight - window.innerHeight;
    const pct    = Math.min(100, (window.scrollY / total) * 100);
    bar.style.width = pct + '%';
  }, { passive: true });
})();

/* ── SOCIAL MEDIA SAFE REDIRECT ── */
(function initSocialLinks() {
  document.querySelectorAll('.footer-social .social-btn, .team-social a').forEach(link => {
    const href = link.getAttribute('href') || '';
    // If href is empty, '#', or points to index.html — keep as-is (already redirects home)
    // If it's a real social URL, leave it alone
    // Ensure none produce 404
    if (!href || href === '#') {
      link.setAttribute('href', 'index.html');
    }
    link.addEventListener('click', function(e) {
      const h = this.getAttribute('href') || '';
      if (!h || h === '#') {
        e.preventDefault();
        window.location.href = 'index.html';
      }
    });
  });
})();

/* ── DEAD LINK PREVENTION ── */
(function preventDeadLinks() {
  // Pages that don't exist yet — redirect to 404 or home
  const missingPages = ['blog.html', 'volunteer.html', 'contact.html', 'login.html', 'dashboard.html', 'register.html', 'forgot-password.html', 'reset-password.html'];

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href') || '';
    const page = href.split('/').pop().split('?')[0].split('#')[0];

    if (missingPages.includes(page)) {
      link.addEventListener('click', function(e) {
        const h = this.getAttribute('href') || '';
        // Only intercept if it's a missing page
        if (missingPages.includes(h.split('/').pop().split('?')[0])) {
          e.preventDefault();
          // Show friendly message
          if (typeof showToast === 'function') {
            showToast('🚧 This page is coming soon! Redirecting home...');
            setTimeout(() => { window.location.href = 'index.html'; }, 1500);
          } else {
            window.location.href = 'index.html';
          }
        }
      });
    }
  });
})();

/* ── LOGO CLICK → HOME ── */
document.querySelectorAll('.nav-logo, .footer-brand .nav-logo').forEach(logo => {
  logo.setAttribute('href', 'index.html');
});

/* ── NAVBAR LINKS ACTIVE HIGHLIGHT ── */
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href') || '';
    const page = href.split('/').pop();
    if (page === path || (path === '' && page === 'index.html') || (path === 'index.html' && page === 'index.html')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
})();

/* ── ENHANCED FAQ ACCORDION ── */
(function enhanceFAQ() {
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('button, .faq-question');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const icon = btn.querySelector('i, .fa-chevron-down, .fa-plus');
      if (icon) {
        const isOpen = item.classList.contains('open');
        icon.style.transition = 'transform 0.3s ease';
        icon.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(180deg)';
      }
    });
  });
})();

/* ── CARD HOVER TILT (override main.js with smoother version) ── */
(function initCardTilt() {
  const cards = document.querySelectorAll('.cause-card, .campaign-card, .vol-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;
      card.style.transform = `translateY(-10px) rotateY(${x}deg) rotateX(${y}deg) scale(1.01)`;
      card.style.transition = 'transform 0.1s ease';
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
})();

/* ── ANIMATED STATISTICS IN HERO ── */
(function animateHeroStats() {
  const statNums = document.querySelectorAll('.hero-stat-num');
  if (!statNums.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        if (el.dataset.animated) return;
        el.dataset.animated = 'true';
        const text = el.textContent.trim();
        const num  = parseFloat(text.replace(/[^0-9.]/g, ''));
        const suffix = text.replace(/[0-9.]/g, '');
        if (!isNaN(num)) {
          let start = null;
          const step = ts => {
            if (!start) start = ts;
            const p = Math.min((ts - start) / 1400, 1);
            const e = 1 - Math.pow(1 - p, 3);
            el.textContent = (e * num % 1 !== 0 ? (e * num).toFixed(0) : Math.floor(e * num)) + suffix;
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = num + suffix;
          };
          requestAnimationFrame(step);
        }
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
})();

/* ── SMOOTH ANCHOR SCROLLING ── */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── NAVBAR: HIDE ON SCROLL DOWN, SHOW ON SCROLL UP ── */
(function initSmartNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;

  let lastY = 0;
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const y = window.scrollY;
        if (y > lastY && y > 150) {
          navbar.style.transform = 'translateY(-100%)';
        } else {
          navbar.style.transform = 'translateY(0)';
        }
        navbar.style.transition = 'transform 0.35s ease, background 0.3s ease, box-shadow 0.3s ease';
        lastY = y;
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

/* ── LAZY LOAD SECTIONS ── */
(function initLazyLoad() {
  const images = document.querySelectorAll('img[loading="lazy"]');
  if ('loading' in HTMLImageElement.prototype) return; // native support

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) { img.src = img.dataset.src; }
        observer.unobserve(img);
      }
    });
  });
  images.forEach(img => observer.observe(img));
})();

/* ── MOBILE SWIPE FOR TESTIMONIALS ── */
(function initSwipe() {
  const track = document.querySelector('.testimonials-track');
  if (!track) return;

  let startX = 0, isDragging = false;

  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    isDragging = true;
  }, { passive: true });

  track.addEventListener('touchend', e => {
    if (!isDragging) return;
    const diff = startX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      const btn = diff > 0
        ? document.querySelector('.t-next')
        : document.querySelector('.t-prev');
      if (btn) btn.click();
    }
    isDragging = false;
  }, { passive: true });
})();

/* ── TYPING CURSOR BLINK ── */
(function addTypingCursor() {
  const typingEl = document.querySelector('[data-typing]');
  if (!typingEl) return;
  typingEl.style.borderRight = '3px solid #22c55e';
  typingEl.style.paddingRight = '2px';
  typingEl.style.animation = 'typingCursorBlink 0.7s step-end infinite';

  const style = document.createElement('style');
  style.textContent = `
    @keyframes typingCursorBlink {
      0%,100% { border-right-color: #22c55e; }
      50%      { border-right-color: transparent; }
    }
  `;
  document.head.appendChild(style);
})();

/* ── MOBILE MENU CLOSE ON OUTSIDE TAP ── */
document.addEventListener('touchstart', e => {
  const menu  = document.getElementById('mobileMenu');
  const burger = document.getElementById('hamburger');
  const navbar = document.getElementById('navbar');
  if (!menu || !menu.classList.contains('open')) return;
  if (!menu.contains(e.target) && !navbar.contains(e.target)) {
    menu.classList.remove('open');
    if (burger) burger.classList.remove('open');
    document.body.style.overflow = '';
  }
}, { passive: true });

/* ── PERFORMANCE: WILL-CHANGE CLEANUP ── */
document.addEventListener('scroll', () => {
  document.querySelectorAll('.parallax-target').forEach(el => {
    el.style.willChange = 'transform';
  });
}, { passive: true, once: true });