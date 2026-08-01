const html = document.documentElement;
const header = document.querySelector('.header');
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileLinks = document.querySelectorAll('.mobile-link');
const navLinks = document.querySelectorAll('.nav-link');
const themeBtns = document.querySelectorAll('#themeToggle, #themeToggleFooter');
const canvas = document.getElementById('particleCanvas');
const intro = document.getElementById('intro');
const cursorGlow = document.getElementById('cursorGlow');

/* ─── THEME ─── */

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  if (typeof updateParticleColor === 'function') updateParticleColor();
}

function toggleTheme() {
  const current = html.getAttribute('data-theme');
  setTheme(current === 'dark' ? 'light' : 'dark');
}

themeBtns.forEach(btn => btn.addEventListener('click', toggleTheme));

const savedTheme = localStorage.getItem('theme');
if (savedTheme) html.setAttribute('data-theme', savedTheme);

/* ─── INTRO ─── */

const introName = document.getElementById('introName');
const introRole = document.querySelector('.intro-role');
const introLineWrap = document.querySelector('.intro-line-wrap');
const introLine = document.querySelector('.intro-line');
const nameText = 'Uğur Kaan Eroğlu';

const chars = nameText.split('').map(ch => ch === ' ' ? 'space' : ch);
let charSpans = [];

chars.forEach((ch, i) => {
  const span = document.createElement('span');
  if (ch === 'space') {
    span.className = 'intro-char-space';
  } else {
    span.className = 'intro-char';
    span.textContent = ch;
  }
  introName.appendChild(span);
  charSpans.push(span);
});

const visibleChars = charSpans.filter(s => s.classList.contains('intro-char'));
const STAGGER = 40;
const CHAR_DELAY = 400;

visibleChars.forEach((span, i) => {
  setTimeout(() => {
    span.classList.add('visible');
    if (i === visibleChars.length - 1) {
      setTimeout(() => {
        charSpans.forEach(s => {
          if (s.classList.contains('intro-char')) s.classList.add('glowing');
        });
        introLineWrap.classList.add('visible');
        setTimeout(() => {
          introLine.classList.add('expanded');
          setTimeout(() => {
            introRole.classList.add('visible');
          }, 300);
        }, 100);
      }, 300);
    }
  }, CHAR_DELAY + i * STAGGER);
});

const INTRO_TOTAL = 3200;
const INTRO_FADE = 600;

setTimeout(() => {
  intro.classList.add('hide');
  setTimeout(() => {
    intro.style.display = 'none';
    cursorGlow.style.display = 'block';
    startEntrance();
  }, INTRO_FADE);
}, INTRO_TOTAL);

function startEntrance() {
  header.classList.add('visible');
  canvas.classList.add('show');
}

/* ─── CURSOR GLOW ─── */

let mouseX = -1000;
let mouseY = -1000;
let currentX = -1000;
let currentY = -1000;
let cursorVisible = false;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!cursorVisible) {
    currentX = mouseX;
    currentY = mouseY;
    cursorVisible = true;
  }
  cursorGlow.style.display = 'block';
});

document.addEventListener('mouseleave', () => {
  cursorGlow.style.display = 'none';
  cursorVisible = false;
});

function animateCursorGlow() {
  const speed = 0.08;
  currentX += (mouseX - currentX) * speed;
  currentY += (mouseY - currentY) * speed;

  const rgb = getAccentRgb();
  cursorGlow.style.background = `radial-gradient(500px at ${currentX}px ${currentY}px, rgba(${rgb}, 0.05), transparent 70%)`;

  requestAnimationFrame(animateCursorGlow);
}

animateCursorGlow();

/* ─── SCROLL HEADER ─── */

window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

/* ─── MOBILE MENU ─── */

menuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  const isOpen = mobileMenu.classList.toggle('open');
  mobileOverlay.classList.toggle('open');
  menuBtn.classList.toggle('active');
  menuBtn.setAttribute('aria-expanded', isOpen);
});

mobileOverlay.addEventListener('click', closeMobile);
mobileLinks.forEach(link => link.addEventListener('click', closeMobile));

function closeMobile() {
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('open');
  menuBtn.classList.remove('active');
  menuBtn.setAttribute('aria-expanded', 'false');
}

/* ─── SMOOTH SCROLL ─── */

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ─── ACTIVE NAV SECTION ─── */

const sections = [
  document.getElementById('hakkimda'),
  document.getElementById('yetenekler'),
  document.getElementById('isler'),
  document.getElementById('iletisim')
];

function updateActiveNav() {
  const scrollY = window.scrollY + 120;
  let current = '';

  sections.forEach((section, i) => {
    if (section && scrollY >= section.offsetTop && scrollY < section.offsetTop + section.offsetHeight) {
      current = navLinks[i]?.getAttribute('href') || '';
    }
  });

  navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === current);
  });
}

window.addEventListener('scroll', updateActiveNav);
window.addEventListener('load', updateActiveNav);

/* ─── SCROLL REVEAL ─── */

const revealElements = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay) || 0;
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealElements.forEach(el => observer.observe(el));

/* ─── COUNTER ANIMATION ─── */

const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.count) || 0;
      let current = 0;
      const step = Math.max(1, Math.floor(target / 30));

      const timer = setInterval(() => {
        current += step;
        if (current >= target) {
          el.textContent = target + (el.dataset.suffix || '');
          clearInterval(timer);
        } else {
          el.textContent = current;
        }
      }, 40);

      counterObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

/* ─── PARTICLE NETWORK ─── */

const ctx = canvas.getContext('2d');
let width, height, particles, particleColor;

function resize() {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
}

window.addEventListener('resize', resize);
resize();

function getAccentRgb() {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--accent-rgb').trim() || '217, 37, 52';
}

function updateParticleColor() {
  particleColor = getAccentRgb();
}

particleColor = getAccentRgb();

function initParticles() {
  const count = Math.min(55, Math.floor(width * height / 22000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.15,
    vy: (Math.random() - 0.5) * 0.15,
    r: Math.random() * 2 + 0.5,
    baseVx: (Math.random() - 0.5) * 0.15,
    baseVy: (Math.random() - 0.5) * 0.15,
  }));
}

initParticles();

window.addEventListener('resize', () => {
  resize();
  initParticles();
});

function drawParticles() {
  ctx.clearRect(0, 0, width, height);
  const rgb = particleColor;

  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    const dx = mouseX - p.x;
    const dy = mouseY - p.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 250 && dist > 0) {
      const force = (250 - dist) / 250 * 1.5;
      p.vx += (dx / dist) * force * 0.02;
      p.vy += (dy / dist) * force * 0.02;
    }

    p.vx += (p.baseVx - p.vx) * 0.008;
    p.vy += (p.baseVy - p.vy) * 0.008;

    p.x += p.vx;
    p.y += p.vy;

    if (p.x < -10) p.x = width + 10;
    if (p.x > width + 10) p.x = -10;
    if (p.y < -10) p.y = height + 10;
    if (p.y > height + 10) p.y = -10;

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const pdx = p.x - q.x;
      const pdy = p.y - q.y;
      const pdist = Math.sqrt(pdx * pdx + pdy * pdy);

      if (pdist < 180) {
        const alpha = (1 - pdist / 180) * 0.08;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.strokeStyle = `rgba(${rgb}, ${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }

    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${rgb}, 0.18)`;
    ctx.fill();
  }

  requestAnimationFrame(drawParticles);
}

drawParticles();
