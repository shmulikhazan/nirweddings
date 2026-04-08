/* ===================================================
   NIR WEDDINGS – JavaScript
   =================================================== */

/* ---------- Navigation ---------- */
const nav      = document.getElementById('nav');
const burger   = document.getElementById('navBurger');
const navLinks = document.getElementById('navLinks');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 60);
});

burger.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

/* ---------- Footer year ---------- */
document.getElementById('footerYear').textContent = new Date().getFullYear();

/* ---------- Reveal on scroll ---------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

document.querySelectorAll(
  '.about__grid, .service-card, .testimonial, .contact__grid, .gallery__item'
).forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

/* ---------- Gallery Lightbox ---------- */
const galleryItems = Array.from(document.querySelectorAll('.gallery__item'));
const lightbox     = document.getElementById('lightbox');
const lightboxImg  = document.getElementById('lightboxImg');
const lbClose      = document.getElementById('lightboxClose');
const lbPrev       = document.getElementById('lightboxPrev');
const lbNext       = document.getElementById('lightboxNext');
let   currentIndex = 0;

function openLightbox(index) {
  currentIndex = index;
  const img  = galleryItems[index].querySelector('img');
  // Use a higher-res version if URL contains Unsplash size param
  lightboxImg.src = img.src.replace(/w=\d+/, 'w=1600');
  lightboxImg.alt = img.alt;
  lightbox.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  document.body.style.overflow = '';
}

function prevImage() {
  currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
  openLightbox(currentIndex);
}

function nextImage() {
  currentIndex = (currentIndex + 1) % galleryItems.length;
  openLightbox(currentIndex);
}

galleryItems.forEach((item, i) => {
  item.addEventListener('click', () => openLightbox(i));
});

lbClose.addEventListener('click', closeLightbox);
lbPrev.addEventListener('click', prevImage);
lbNext.addEventListener('click', nextImage);

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape')     closeLightbox();
  if (e.key === 'ArrowRight') prevImage();   // RTL: right = prev
  if (e.key === 'ArrowLeft')  nextImage();   // RTL: left  = next
});

// Touch/swipe support
let touchStartX = 0;
lightbox.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
lightbox.addEventListener('touchend', e => {
  const diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 50) diff > 0 ? nextImage() : prevImage();
});

/* ---------- Contact Form ---------- */
const form       = document.getElementById('contactForm');
const submitBtn  = document.getElementById('submitBtn');
const submitText = document.getElementById('submitText');
const submitLoader = document.getElementById('submitLoader');
const formSuccess  = document.getElementById('formSuccess');

function showError(fieldId, message) {
  const field = document.getElementById(fieldId);
  const error = document.getElementById(fieldId + 'Error');
  if (field) field.classList.add('error');
  if (error) error.textContent = message;
}

function clearErrors() {
  form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
  form.querySelectorAll('.form-error').forEach(el => el.textContent = '');
}

function validateForm() {
  clearErrors();
  let valid = true;

  const name    = document.getElementById('name').value.trim();
  const email   = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();

  if (!name) {
    showError('name', 'שם הוא שדה חובה');
    valid = false;
  }

  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    showError('email', 'אימייל הוא שדה חובה');
    valid = false;
  } else if (!emailRe.test(email)) {
    showError('email', 'כתובת אימייל לא תקינה');
    valid = false;
  }

  if (!message) {
    showError('message', 'אנא כתבו הודעה');
    valid = false;
  }

  return valid;
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  // Show loading state
  submitBtn.disabled = true;
  submitText.hidden  = true;
  submitLoader.hidden = false;

  /*
   * ── HOW TO CONNECT A REAL BACKEND ──────────────────────────────────
   * Replace the simulated delay below with a real fetch() call.
   *
   * Option A – Formspree (free, no backend):
   *   const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
   *     method: 'POST',
   *     headers: { 'Content-Type': 'application/json' },
   *     body: JSON.stringify({
   *       name:    document.getElementById('name').value,
   *       email:   document.getElementById('email').value,
   *       phone:   document.getElementById('phone').value,
   *       date:    document.getElementById('date').value,
   *       message: document.getElementById('message').value,
   *     }),
   *   });
   *   if (!res.ok) throw new Error('send failed');
   *
   * Option B – EmailJS (free, no backend):
   *   await emailjs.send('SERVICE_ID', 'TEMPLATE_ID', { ... });
   *
   * Option C – Your own API endpoint:
   *   await fetch('/api/contact', { method: 'POST', body: formData });
   * ───────────────────────────────────────────────────────────────────
   */

  await new Promise(r => setTimeout(r, 1200)); // ← simulate network

  submitBtn.disabled  = false;
  submitText.hidden   = false;
  submitLoader.hidden = true;

  form.reset();
  formSuccess.hidden = false;
  formSuccess.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  setTimeout(() => { formSuccess.hidden = true; }, 6000);
});

/* ---------- Smooth active nav link ---------- */
const sections = document.querySelectorAll('section[id]');

const navObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        document.querySelectorAll('.nav__links a').forEach(a => {
          a.style.color = a.getAttribute('href') === `#${id}`
            ? 'var(--gold)'
            : '';
        });
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);

sections.forEach(s => navObserver.observe(s));
