// ── NAVİGASYON ──────────────────────────────────────────────────
const navbar = document.getElementById('navbar');
const navLinks = document.getElementById('navLinks');
const menuIcon = document.getElementById('menuIcon');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

function scrollToTop() { window.scrollTo({ top: 0, behavior: 'smooth' }); }

function toggleMenu() {
  navLinks.classList.toggle('open');
  menuIcon.classList.toggle('fa-bars');
  menuIcon.classList.toggle('fa-times');
}

function closeMenu() {
  navLinks.classList.remove('open');
  menuIcon.classList.remove('fa-times');
  menuIcon.classList.add('fa-bars');
}

// ── SCROLL REVEAL ────────────────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── SAYAÇ ────────────────────────────────────────────────────────
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.getAttribute('data-target'));
    let count = 0;
    const increment = target / (2000 / 16);
    const timer = setInterval(() => {
      count += increment;
      if (count >= target) { el.textContent = target; clearInterval(timer); }
      else { el.textContent = Math.ceil(count); }
    }, 16);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(c => counterObserver.observe(c));

// ── PARTİKÜL ────────────────────────────────────────────────────
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
function createParticles() {
  particles = Array.from({ length: 70 }, () => ({
    x: Math.random() * canvas.width, y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.5, dx: (Math.random() - 0.5) * 0.4, dy: (Math.random() - 0.5) * 0.4,
  }));
}
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => {
    p.x += p.dx; p.y += p.dy;
    if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
    if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(212,175,55,0.12)'; ctx.fill();
  });
  requestAnimationFrame(animateParticles);
}
resize(); createParticles(); animateParticles();
window.addEventListener('resize', () => { resize(); createParticles(); });

// ── GALERİ VERİSİ ────────────────────────────────────────────────
const GALLERY_KEY = 'dicle_firat_gallery_photos';

const defaultPhotos = [
  { id: 'd1', src: '', label: 'Güneş Enerjisi Kurulumu' },
  { id: 'd2', src: '', label: 'Saha Çalışmamız' },
  { id: 'd3', src: '', label: 'Saha Çalışmamız' },
  { id: 'd4', src: '', label: 'Yerimiz' },
  { id: 'd5', src: '', label: 'Elektrik Taahhüt' },
  { id: 'd6', src: '', label: 'Çevre Dostu' },
  { id: 'd7', src: '', label: 'Saha Çalışmamız' },
  { id: 'd8', src: '', label: 'Logo Tasarımımız' },
  { id: 'd9', src: '', label: 'Proje Çalışmalarımız' },
];

function getAllPhotos() {
  try {
    const saved = localStorage.getItem(GALLERY_KEY);
    const custom = saved ? JSON.parse(saved) : [];
    return [...defaultPhotos, ...custom];
  } catch { return [...defaultPhotos]; }
}

// Galeri Önizleme (ilk 6)
function renderGalleryPreview() {
  const container = document.getElementById('galleryPreview');
  if (!container) return;
  const photos = getAllPhotos().slice(0, 6);
  container.innerHTML = photos.map(p => `
    <div class="gp-item" onclick="openGalleryModal()">
      ${p.src ? `<img src="${p.src}" alt="${p.label}" loading="lazy" />` : `<div class="gp-placeholder"><i class="fas fa-bolt"></i></div>`}
      <div class="gp-overlay"><div class="gp-label">${p.label}</div></div>
    </div>
  `).join('');
}

// ── GALERİ MODAL ─────────────────────────────────────────────────
let lbIndex = 0;
let lbPhotos = [];

function openGalleryModal() {
  lbPhotos = getAllPhotos();
  const modal = document.getElementById('galleryModal');
  const body = document.getElementById('gmBody');
  const count = document.getElementById('gm-count');
  count.textContent = `(${lbPhotos.length} fotoğraf)`;

  body.innerHTML = `<div class="gm-grid">${lbPhotos.map((p, i) => `
    <div class="gm-item" onclick="openLightbox(${i})">
      ${p.src ? `<img src="${p.src}" alt="${p.label}" loading="lazy" />` : `<div class="gm-item-placeholder"><i class="fas fa-bolt"></i></div>`}
      <div class="gm-item-label">${p.label}</div>
    </div>
  `).join('')}</div>`;

  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeGalleryModal() {
  document.getElementById('galleryModal').classList.remove('open');
  closeLightbox();
  document.body.style.overflow = '';
}

// ── LIGHTBOX ─────────────────────────────────────────────────────
function openLightbox(index) {
  lbIndex = index;
  const lb = document.getElementById('lightbox');
  lb.classList.add('open');
  renderLightbox();
}

function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
}

function renderLightbox() {
  const photo = lbPhotos[lbIndex];
  const img = document.getElementById('lbImg');
  const placeholder = document.getElementById('lbPlaceholder');
  if (photo.src) {
    img.src = photo.src; img.style.display = 'block';
    placeholder.style.display = 'none';
  } else {
    img.style.display = 'none';
    placeholder.style.display = 'flex';
  }
  document.getElementById('lbLabel').textContent = photo.label;
  document.getElementById('lbCounter').textContent = `${lbIndex + 1} / ${lbPhotos.length}`;
}

function lbPrev() { lbIndex = (lbIndex - 1 + lbPhotos.length) % lbPhotos.length; renderLightbox(); }
function lbNext() { lbIndex = (lbIndex + 1) % lbPhotos.length; renderLightbox(); }

document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  const modal = document.getElementById('galleryModal');
  if (e.key === 'Escape') { if (lb.classList.contains('open')) closeLightbox(); else if (modal.classList.contains('open')) closeGalleryModal(); }
  if (lb.classList.contains('open')) {
    if (e.key === 'ArrowLeft') lbPrev();
    if (e.key === 'ArrowRight') lbNext();
  }
});

// ── YORUMLAR ─────────────────────────────────────────────────────
const COMMENTS_KEY = 'dicle_firat_comments';
let currentRating = 5;

function setRating(val) {
  currentRating = val;
  const stars = document.querySelectorAll('#starInput i');
  stars.forEach((s, i) => {
    s.classList.toggle('inactive', i >= val);
  });
}

function loadComments() {
  try { return JSON.parse(localStorage.getItem(COMMENTS_KEY)) || []; } catch { return []; }
}

function renderComments() {
  const list = document.getElementById('commentsList');
  const comments = loadComments();
  if (comments.length === 0) {
    list.innerHTML = `<div class="comments-empty"><i class="fas fa-comment-slash"></i><p>Henüz yorum yok. İlk yorumu siz yapın!</p></div>`;
    return;
  }
  list.innerHTML = comments.map(c => `
    <div class="comment-card">
      <div class="comment-card-top">
        <div class="comment-author">
          <div class="comment-avatar">${c.name.charAt(0).toUpperCase()}</div>
          <div>
            <div class="comment-name">${c.name}</div>
            <div class="comment-date">${c.date}</div>
          </div>
        </div>
        <div class="comment-stars">
          ${[1,2,3,4,5].map(s => `<i class="fas fa-star${s > c.rating ? ' empty' : ''}"></i>`).join('')}
        </div>
      </div>
      <div class="comment-text">${c.text}</div>
    </div>
  `).join('');
}

function submitComment(e) {
  e.preventDefault();
  const name = document.getElementById('cName').value.trim();
  const text = document.getElementById('cText').value.trim();
  if (!name || !text) return;

  const newComment = {
    id: 'c_' + Date.now(), name, rating: currentRating, text,
    date: new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })
  };

  const comments = [newComment, ...loadComments()];
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));

  document.getElementById('cName').value = '';
  document.getElementById('cText').value = '';
  setRating(5);

  const success = document.getElementById('formSuccess');
  success.classList.add('visible');
  setTimeout(() => success.classList.remove('visible'), 3000);

  renderComments();
}

// ── BAŞLAT ───────────────────────────────────────────────────────
renderGalleryPreview();
renderComments();