/* ===========================================
   STACKLY NGO — MAIN JAVASCRIPT
   =========================================== */

'use strict';

/* ── PAGE LOADER ── */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 800);
  }
});

/* ── NAVBAR SCROLL ── */
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

/* ── HAMBURGER / MOBILE MENU ── */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    }
  });
}

/* ── AOS — SCROLL REVEAL ── */
function initAOS() {
  const els = document.querySelectorAll('[data-aos]');
  if (!els.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = parseInt(entry.target.dataset.aosDelay || 0);
        setTimeout(() => {
          entry.target.classList.add('aos-animate');
        }, delay);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => observer.observe(el));
}
initAOS();

/* ── COUNTER ANIMATION ── */
function animateCounter(el, target, duration = 1800) {
  const suffix = target >= 1000000 ? '' : '';
  let start = null;
  const step = (timestamp) => {
    if (!start) start = timestamp;
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    // Format large numbers
    el.textContent = current >= 1000000
      ? (current / 1000000).toFixed(1) + 'M'
      : current >= 1000
      ? current.toLocaleString()
      : current;
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target >= 1000000
      ? (target / 1000000).toFixed(1) + 'M'
      : target >= 1000
      ? target.toLocaleString()
      : target;
  };
  requestAnimationFrame(step);
}

function initCounters() {
  const counters = document.querySelectorAll('[data-counter]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const target = parseInt(entry.target.dataset.target);
        animateCounter(entry.target, target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(c => observer.observe(c));
}
initCounters();

/* ── TYPING EFFECT ── */
function initTyping() {
  const el = document.querySelector('[data-typing]');
  if (!el) return;

  let words, wordArr;
  try { words = JSON.parse(el.getAttribute('data-typing')); }
  catch(e) { return; }

  let wordIndex = 0, charIndex = 0, isDeleting = false;

  function type() {
    const word = words[wordIndex];
    if (isDeleting) {
      el.textContent = word.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = word.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 60 : 120;
    if (!isDeleting && charIndex === word.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = 400;
    }
    setTimeout(type, delay);
  }
  setTimeout(type, 800);
}
initTyping();

/* ── TESTIMONIALS CAROUSEL ── */
function initTestimonials() {
  const track = document.querySelector('.testimonials-track');
  const prevBtn = document.querySelector('.t-prev');
  const nextBtn = document.querySelector('.t-next');
  if (!track || !prevBtn || !nextBtn) return;

  let index = 0;
  const cards = track.querySelectorAll('.testimonial-card');
  const total = cards.length;

  function getVisible() {
    return window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
  }

  function update() {
    const visible = getVisible();
    const cardWidth = cards[0].offsetWidth + 24; // gap
    const max = Math.max(0, total - visible);
    index = Math.min(index, max);
    track.style.transform = `translateX(-${index * cardWidth}px)`;
  }

  nextBtn.addEventListener('click', () => { index++; update(); });
  prevBtn.addEventListener('click', () => { index = Math.max(0, index - 1); update(); });
  window.addEventListener('resize', update, { passive: true });

  // Auto-slide
  setInterval(() => { index++; update(); }, 5000);
}
initTestimonials();

/* ── PROGRESS BARS (animated on scroll) ── */
function initProgressBars() {
  const bars = document.querySelectorAll('.progress-bar-fill, .cpr-fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // width set via CSS animation (barGrow), so just ensure it runs
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  bars.forEach(b => {
    b.style.animationPlayState = 'paused';
    observer.observe(b);
  });
}
initProgressBars();

/* ── NEWSLETTER FORMS ── */
document.querySelectorAll('[data-form="newsletter"]').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input[type="email"]');
    if (input && input.value) {
      showToast('✅ Subscribed! Thank you for joining STACKLY.');
      input.value = '';
    }
  });
});

/* ── CONTACT FORMS ── */
document.querySelectorAll('[data-form="contact"]').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('✅ Message sent! We\'ll get back to you within 24 hours.');
    form.reset();
  });
});

/* ── VOLUNTEER FORM ── */
document.querySelectorAll('[data-form="volunteer"]').forEach(form => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('✅ Application submitted! Our team will contact you soon.');
    form.reset();
  });
});

/* ── FAQ ACCORDION ── */
function initFAQ() {
  // Standard FAQ (index/about pages)
  document.querySelectorAll('.faq-item').forEach(item => {
    const btn = item.querySelector('.faq-question, button');
    const ans = item.querySelector('.faq-answer, .faq-a, div:last-child');
    if (!btn || !ans) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-answer, .faq-a, div:last-child');
        if (a) a.style.display = 'none';
      });
      if (!isOpen) {
        item.classList.add('open');
        ans.style.display = 'block';
      }
    });
  });

  // Contact page FAQ
  document.querySelectorAll('.faq-item-c').forEach(item => {
    const btn = item.querySelector('.faq-q-c');
    const ans = item.querySelector('.faq-a-c');
    if (!btn || !ans) return;

    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item-c.open').forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-a-c');
        if (a) a.style.display = 'none';
      });
      if (!isOpen) {
        item.classList.add('open');
        ans.style.display = 'block';
      }
    });
  });
}
initFAQ();

/* ── TOAST NOTIFICATION ── */
function showToast(msg) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}
window.showToast = showToast;

/* ── BACK TO TOP ── */
function initBackToTop() {
  const btn = document.createElement('button');
  btn.id = 'back-to-top';
  btn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  btn.setAttribute('aria-label', 'Back to top');
  document.body.appendChild(btn);

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
initBackToTop();

/* ── AUTH — LOGIN ── */
function initLogin() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  const togglePw = document.querySelectorAll('.toggle-pw');
  togglePw.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.previousElementSibling;
      if (input && input.type) {
        input.type = input.type === 'password' ? 'text' : 'password';
        btn.querySelector('i').classList.toggle('fa-eye', input.type === 'password');
        btn.querySelector('i').classList.toggle('fa-eye-slash', input.type !== 'password');
      }
    });
  });

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail')?.value;
    const pass = document.getElementById('loginPass')?.value;
    if (!email || !pass) { showToast('⚠️ Please fill in all fields.'); return; }
    showToast('✅ Login successful! Redirecting...');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 1200);
  });
}
initLogin();

/* ── AUTH — REGISTER ── */
function initRegister() {
  const form = document.getElementById('registerForm');
  if (!form) return;

  const alert = document.getElementById('registerSuccess');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('regEmail')?.value || '';
    if (!email.includes('@') || !email.includes('.')) {
      showToast('⚠️ Please enter a valid email address.'); return;
    }
    if (alert) alert.classList.add('show');
    showToast('✅ Account created! Welcome to STACKLY.');
    setTimeout(() => { window.location.href = 'dashboard.html'; }, 2000);
  });
}
initRegister();

/* ── AUTH — FORGOT PASSWORD ── */
function initForgot() {
  const form = document.getElementById('forgotForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('✅ If that email exists, a reset link has been sent.');
  });
}
initForgot();

/* ── AUTH — RESET PASSWORD ── */
function initReset() {
  const form = document.getElementById('resetForm');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('✅ Password reset successful! Redirecting to login...');
    setTimeout(() => { window.location.href = 'login.html'; }, 1500);
  });
}
initReset();

/* ── DASHBOARD ── */
function initDashboard() {
  const body = document.body;
  if (!body.classList.contains('dash-body')) return;

  // Sidebar toggle
  const sidebar = document.querySelector('.dash-sidebar');
  const toggleBtn = document.querySelector('.dash-toggle-btn');
  const closeBtn = document.querySelector('.ds-close');

  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      sidebar.classList.toggle('collapsed');
    });
  }
  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
      sidebar.classList.add('collapsed');
    });
  }

  // Overlay close on mobile
  document.addEventListener('click', (e) => {
    if (sidebar && window.innerWidth < 900) {
      if (!sidebar.contains(e.target) && !(toggleBtn && toggleBtn.contains(e.target))) {
        sidebar.classList.remove('open');
      }
    }
  });

  // Nav sections
  const navItems = document.querySelectorAll('.ds-nav-item[data-section]');
  const sections = document.querySelectorAll('.dash-section');

  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const target = item.dataset.section;

      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      sections.forEach(s => s.classList.remove('active'));
      const sec = document.getElementById('dash-' + target);
      if (sec) sec.classList.add('active');

      // Update header title
      const titleEl = document.querySelector('.dash-section-title');
      if (titleEl) titleEl.textContent = item.querySelector('span')?.textContent || target;

      // Close sidebar on mobile after nav
      if (window.innerWidth < 900 && sidebar) {
        sidebar.classList.remove('open');
      }
    });
  });

  // Dark/Light toggle
  const themeToggle = document.querySelector('.toggle-switch');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      themeToggle.classList.toggle('on');
      document.documentElement.classList.toggle('light-mode');
    });
  }

  // Notification bell
  const notifBtn = document.querySelector('.dh-notif-btn');
  if (notifBtn) {
    notifBtn.addEventListener('click', () => {
      const target = document.getElementById('dash-notifications');
      if (target) {
        document.querySelectorAll('.dash-section').forEach(s => s.classList.remove('active'));
        target.classList.add('active');
        document.querySelectorAll('.ds-nav-item').forEach(i => i.classList.remove('active'));
      }
    });
  }

  // Animate dashboard charts
  animateDashCharts();
}

function animateDashCharts() {
  const bars = document.querySelectorAll('.sc-bar');
  if (!bars.length) return;
  const heights = [40, 65, 50, 80, 70, 45, 30]; // %
  bars.forEach((bar, i) => {
    setTimeout(() => {
      bar.style.height = (heights[i] || 40) + '%';
    }, 100 + i * 80);
  });
}

initDashboard();

/* ── CAMPAIGN DONATE BUTTONS ── */
document.querySelectorAll('[data-donate]').forEach(btn => {
  btn.addEventListener('click', () => {
    showToast('❤️ Thank you! Redirecting to secure donation page...');
    setTimeout(() => { window.location.href = 'campaigns.html'; }, 1000);
  });
});

/* ── SCROLL PROGRESS BAR ── */
function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position:fixed;top:0;left:0;height:2px;width:0%;
    background:linear-gradient(90deg,#22c55e,#86efac);
    z-index:99999;transition:width 0.1s;pointer-events:none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = Math.min(100, (scroll / total) * 100) + '%';
  }, { passive: true });
}
initScrollProgress();

/* ── SMOOTH HOVER CARD TILT (subtle) ── */
document.querySelectorAll('.cause-card, .campaign-card, .vol-card, .dash-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 6;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -6;
    card.style.transform = `translateY(-6px) rotateY(${x}deg) rotateX(${y}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s ease';
  });
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'transform 0.15s ease';
  });
});

/* ── LAZY LOAD IMAGES (if any) ── */
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          imgObserver.unobserve(img);
        }
      }
    });
  });
  document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}

/* ── ACTIVE NAV LINK (current page) ── */
(function() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      a.classList.add('active');
    }
  });
})();