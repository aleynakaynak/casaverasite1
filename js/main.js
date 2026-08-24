import '../css/overrides.css';
import { VILLA_COUNT, PLOT_AREAS, HERO_POINTS, SOLD_VILLAS, UNNUMBERED_SOLD_POINT, villaHref } from './villa-data.js';

document.addEventListener('DOMContentLoaded', () => {
  const header = document.getElementById('header');
  const menuBtn = document.getElementById('menuBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const langBtn = document.getElementById('langBtn');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  let lang = 'tr';

  const closeMenu = () => {
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
    menuBtn.setAttribute('aria-label', 'Menüyü aç');
  };

  menuBtn.addEventListener('click', () => {
    const open = !mobileMenu.classList.contains('open');
    mobileMenu.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 20), {passive:true});

  langBtn.addEventListener('click', () => {
    lang = lang === 'tr' ? 'en' : 'tr';
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-tr][data-en]').forEach(el => {
      el.textContent = el.dataset[lang];
    });
    document.querySelectorAll('[data-tr-placeholder][data-en-placeholder]').forEach(el => {
      el.placeholder = el.dataset[`${lang}Placeholder`];
    });
    langBtn.querySelectorAll('span').forEach((span, i) => span.classList.toggle('active', (lang === 'tr' && i === 0) || (lang === 'en' && i === 1)));
    document.title = lang === 'tr' ? "Casa Vera Oasis | Assos'ta Ayrıcalıklı Villa Yaşamı" : 'Casa Vera Oasis | Exclusive Villa Living in Assos';
  });

  const openLightbox = src => {
    lightboxImg.src = src;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  };
  const closeLightbox = () => {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  };
  const heroPins = Array.from({ length: VILLA_COUNT }, (_, i) => {
    const no = i + 1;
    const [x, y] = HERO_POINTS[no];
    if (SOLD_VILLAS.has(no)) {
      return `<div class="hero-pin sold" style="left:${x}%;top:${y}%" role="img" aria-label="Villa ${no} satıldı"><b>${no}</b><small data-tr="SATILDI" data-en="SOLD">SATILDI</small></div>`;
    }
    return `<a class="hero-pin" href="${villaHref(no)}" style="left:${x}%;top:${y}%" aria-label="Villa ${no} · ${PLOT_AREAS[no]} m² · detayları görüntüle"><b>${no}</b><span>${PLOT_AREAS[no]} m²</span></a>`;
  }).join('');

  const [soldX, soldY] = UNNUMBERED_SOLD_POINT;
  const unnumberedSold = `<div class="hero-pin sold unnumbered" style="left:${soldX}%;top:${soldY}%" role="img" aria-label="Numarasız villa satıldı"><b data-tr="SATILDI" data-en="SOLD">SATILDI</b></div>`;
  document.getElementById('heroHotspots').innerHTML = heroPins + unnumberedSold;

  document.getElementById('villaQuick').innerHTML = Array.from({ length: VILLA_COUNT }, (_, i) => {
    const no = i + 1;
    if (SOLD_VILLAS.has(no)) {
      return `<span class="sold" aria-label="Villa ${no} satıldı"><b>${no}</b><small data-tr="SATILDI" data-en="SOLD">SATILDI</small></span>`;
    }
    return `<a href="${villaHref(no)}" aria-label="Villa ${no} detayları">${no}</a>`;
  }).join('');
  document.querySelectorAll('#galleryGrid figure').forEach(figure => figure.addEventListener('click', () => openLightbox(figure.querySelector('img').src)));
  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeLightbox(); closeMenu(); } });

  document.getElementById('contactForm').addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('fullName').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();
    const text = lang === 'tr'
      ? `Casa Vera Oasis bilgi talebi\nAd Soyad: ${name}\nTelefon: ${phone}\nMesaj: ${message}`
      : `Casa Vera Oasis information request\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`;
    window.open(`https://wa.me/905322181184?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  });

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), {threshold:.12});
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
});
