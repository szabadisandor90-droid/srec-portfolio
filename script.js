/* ─────────────────────────────────────────
   PAGE LOADER — counting number + split reveal
───────────────────────────────────────── */
const loader      = document.getElementById('loader');
const loaderCount = document.getElementById('loader-count');
const loaderLogo  = document.getElementById('loader-logo-reveal');
let countVal = 0;
let countDone = false;

function finishLoader() {
  if (countDone) return;
  countDone = true;

  // 1) count snaps to 100, shrinks out
  if (loaderCount) loaderCount.textContent = '100';
  setTimeout(() => {
    if (loaderCount) loaderCount.classList.add('morph-out');
  }, 80);

  // 2) logo scales in
  setTimeout(() => {
    if (loaderLogo) loaderLogo.classList.add('visible');
  }, 280);

  // 3) logo fades out, then panels split
  setTimeout(() => {
    if (loaderLogo) loaderLogo.classList.add('fade-out');
  }, 1000);

  setTimeout(() => {
    loader?.classList.add('done');
  }, 1350);
}

const countInterval = setInterval(() => {
  countVal += Math.floor(Math.random() * 11) + 4;
  if (countVal >= 100) {
    countVal = 100;
    clearInterval(countInterval);
    finishLoader();
    return;
  }
  if (loaderCount) loaderCount.textContent = countVal;
}, 38);

window.addEventListener('load', () => {
  // Safety fallback if interval didn't reach 100 yet
  setTimeout(() => { if (!countDone) finishLoader(); }, 3500);
});

/* ─────────────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let rX = 0, rY = 0, mX = 0, mY = 0;

document.addEventListener('mousemove', (e) => {
  mX = e.clientX; mY = e.clientY;
  document.body.classList.add('cursor-ready');
  if (dot) { dot.style.left = mX + 'px'; dot.style.top = mY + 'px'; }
});

(function animRing() {
  rX += (mX - rX) * 0.1;
  rY += (mY - rY) * 0.1;
  if (ring) { ring.style.left = rX + 'px'; ring.style.top = rY + 'px'; }
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .work-card, .filter-btn').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
});

/* ─────────────────────────────────────────
   SCROLL PROGRESS
───────────────────────────────────────── */
const progressBar = document.getElementById('progress-bar');

function updateProgress() {
  const pct = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
  if (progressBar) progressBar.style.width = pct + '%';
}

/* ─────────────────────────────────────────
   NAV: shrink + hide on scroll down
───────────────────────────────────────── */
const nav = document.getElementById('nav');
let lastScrollY = 0;

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 60);
  if (y > lastScrollY && y > 120) nav.classList.add('nav-hidden');
  else nav.classList.remove('nav-hidden');
  lastScrollY = y;
  updateProgress();
}, { passive: true });

/* ─────────────────────────────────────────
   NAV: mobile burger
───────────────────────────────────────── */
const burger   = document.querySelector('.nav-burger');
const navLinks = document.querySelector('.nav-links');

burger?.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ─────────────────────────────────────────
   HERO: Vimeo sound toggle + volume slider
───────────────────────────────────────── */
const soundBtn     = document.getElementById('hero-sound');
const volumeWrap   = document.getElementById('hero-volume');
const volumeSlider = document.getElementById('volume-slider');

let heroPlayer = null;
let heroMuted  = true;

// Init Vimeo player once SDK is ready
const heroIframe = document.getElementById('hero-iframe');
if (heroIframe && window.Vimeo) {
  heroPlayer = new Vimeo.Player(heroIframe);
}

function setHeroSound(mute) {
  heroMuted = mute;
  const vol = mute ? 0 : parseFloat(volumeSlider?.value ?? 0.5);
  heroPlayer?.setVolume(vol);

  const iconMuted = soundBtn?.querySelector('.icon-muted');
  const iconSound = soundBtn?.querySelector('.icon-sound');
  if (iconMuted) iconMuted.style.display = mute ? '' : 'none';
  if (iconSound) iconSound.style.display = mute ? 'none' : '';
  soundBtn?.classList.toggle('is-on', !mute);
  soundBtn?.setAttribute('aria-label', mute ? 'Unmute video' : 'Mute video');
  volumeWrap?.classList.toggle('visible', !mute);
}

soundBtn?.addEventListener('click', () => setHeroSound(!heroMuted));

volumeSlider?.addEventListener('input', () => {
  if (heroMuted) setHeroSound(false);
  else heroPlayer?.setVolume(parseFloat(volumeSlider.value));
});

/* ─────────────────────────────────────────
   HERO: scroll parallax
───────────────────────────────────────── */
const heroText = document.querySelector('.hero-text');
const heroMeta = document.querySelector('.hero-meta');

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  if (heroText) heroText.style.transform = `translateY(calc(-52% + ${y * 0.14}px))`;
  if (heroMeta) heroMeta.style.opacity   = Math.max(0, 1 - y / 480);
}, { passive: true });

/* ─────────────────────────────────────────
   MAGNETIC BUTTONS
───────────────────────────────────────── */
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mousemove', (e) => {
    const r  = el.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) * 0.28;
    const dy = (e.clientY - (r.top  + r.height / 2)) * 0.28;
    el.style.transform = `translate(${dx}px, ${dy}px)`;
  });
  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });
});

/* ─────────────────────────────────────────
   TEXT SCRAMBLE on section heading
───────────────────────────────────────── */
function scramble(el) {
  const chars    = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const original = el.textContent;
  let iter = 0;
  const id = setInterval(() => {
    el.textContent = original.split('').map((c, i) => {
      if (c === ' ') return ' ';
      if (i < iter)  return original[i];
      return chars[Math.floor(Math.random() * chars.length)];
    }).join('');
    if (iter >= original.length) clearInterval(id);
    iter += 0.4;
  }, 28);
}

const scrambleTarget = document.getElementById('work-title');
let scrambleDone = false;
new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting && !scrambleDone) {
      scrambleDone = true;
      scramble(scrambleTarget);
    }
  });
}, { threshold: 0.6 }).observe(scrambleTarget);

/* ─────────────────────────────────────────
   SCROLL REVEAL: work cards + stat items
───────────────────────────────────────── */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.work-card, .stat-item').forEach(el => revealObs.observe(el));

/* ─────────────────────────────────────────
   SECTION DIVIDER — animated line reveal
───────────────────────────────────────── */
const divider = document.getElementById('section-divider');
if (divider) {
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
      }
    });
  }, { threshold: 0.5 }).observe(divider);
}

/* ─────────────────────────────────────────
   COUNTER ANIMATION
───────────────────────────────────────── */
function animCount(el) {
  const target   = parseInt(el.dataset.target);
  const duration = 1800;
  const start    = Date.now();
  (function tick() {
    const p = Math.min((Date.now() - start) / duration, 1);
    const v = 1 - Math.pow(1 - p, 3); // easeOutCubic
    el.textContent = Math.floor(v * target);
    if (p < 1) requestAnimationFrame(tick);
    else el.textContent = target;
  })();
}

new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.count').forEach(animCount);
    }
  });
}, { threshold: 0.5 }).observe(document.querySelector('.stats-strip'));

/* ─────────────────────────────────────────
   LIGHTBOX
───────────────────────────────────────── */
const lightbox = document.getElementById('lightbox');
const backdrop = document.getElementById('lightbox-backdrop');
const closeBtn = document.querySelector('.lightbox-close');

function openLightbox() {
  lightbox.classList.add('open');
  backdrop.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  backdrop.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  const inner = lightbox.querySelector('.lightbox-inner');
  if (inner) { inner.innerHTML = ''; inner.classList.remove('portrait'); }
}

document.querySelectorAll('.play-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const card     = btn.closest('.work-card');
    const videoSrc = card?.dataset.video;
    const inner    = document.querySelector('.lightbox-inner');
    inner.innerHTML = '';
    inner.classList.remove('portrait');
    if (videoSrc) {
      // Portrait aspect ratio for Social Media cards
      if (card.dataset.category === 'Social Media') {
        inner.classList.add('portrait');
      }
      const iframe = document.createElement('iframe');
      iframe.src = videoSrc;
      iframe.setAttribute('frameborder', '0');
      iframe.setAttribute('allow', 'autoplay; fullscreen; picture-in-picture');
      iframe.setAttribute('allowfullscreen', '');
      inner.appendChild(iframe);
    } else {
      inner.innerHTML = '<p style="font-family:sans-serif;color:#555;text-align:center;padding:2rem">No video attached</p>';
    }
    openLightbox();
  });
});

closeBtn?.addEventListener('click', closeLightbox);
backdrop?.addEventListener('click', closeLightbox);
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLightbox(); });

/* ─────────────────────────────────────────
   FILTER
───────────────────────────────────────── */
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards  = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    workCards.forEach(card => {
      const match = f === 'all' || card.dataset.category === f;
      card.classList.toggle('hidden', !match);
    });
  });
});

/* ─────────────────────────────────────────
   SMOOTH ACTIVE NAV STATE
───────────────────────────────────────── */
const sections   = document.querySelectorAll('section[id], footer[id]');
const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');

new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      navAnchors.forEach(a => {
        a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--fg)' : '';
      });
    }
  });
}, { threshold: 0.4 }).observe(...[sections].flat());

sections.forEach(s =>
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const id = e.target.id;
        navAnchors.forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}` ? 'var(--fg)' : '';
        });
      }
    });
  }, { threshold: 0.4 }).observe(s)
);
