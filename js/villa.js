// Villa detail page — villa selector, image viewer, galleries, lightbox
import { VILLA_COUNT, PLOT_AREAS } from './villa-data.js';

document.addEventListener('DOMContentLoaded', () => {

  const DIS_COUNT = 38;
  const IC_COUNT = 20;

  const pad = i => String(i).padStart(2, '0');
  const src = (set, i) => `/assets/img/${set}/${set}-${pad(i)}.webp`;
  const thumbSrc = (set, i) => `/assets/img/${set}/thumb/${set}-${pad(i)}.webp`;
  const SETS = {
    dis: { label: 'Dış Cephe', count: DIS_COUNT },
    ic:  { label: 'İç Dizayn', count: IC_COUNT }
  };

  /* ---------- which villa? (from #vNN — hash survives every host & file://) ---------- */
  const chips = document.getElementById('villaChips');
  const villaTitle = document.getElementById('villaTitle');
  const specNo = document.getElementById('specNo');
  const specPlot = document.getElementById('specPlot');

  function currentVilla(){
    const raw = parseInt(location.hash.replace(/^#v?/, ''), 10);
    return (Number.isInteger(raw) && raw >= 1 && raw <= VILLA_COUNT) ? raw : 1;
  }

  function renderVilla(){
    const no = currentVilla();
    const label = String(no).padStart(2, '0');
    villaTitle.textContent = `VİLLA ${label}`;
    specNo.textContent = label;
    specPlot.textContent = `${PLOT_AREAS[no]} m²`;
    document.title = `Villa ${label} | Casa Vera Oasis`;
    chips.querySelectorAll('a').forEach(a => {
      a.classList.toggle('active', Number(a.dataset.no) === no);
    });
  }

  chips.innerHTML = Array.from({ length: VILLA_COUNT }, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    return `<a href="#v${n}" data-no="${i + 1}">${i + 1}</a>`;
  }).join('');

  renderVilla();
  window.addEventListener('hashchange', renderVilla);

  /* ---------- image viewer ---------- */
  const viewerImg = document.getElementById('viewerImg');
  const viewerCounter = document.getElementById('viewerCounter');
  const viewerThumbs = document.getElementById('viewerThumbs');
  const viewerTabs = document.getElementById('viewerTabs');

  let currentSet = 'dis';
  let currentIndex = 1;

  function renderThumbs(){
    const { count } = SETS[currentSet];
    viewerThumbs.innerHTML = Array.from({ length: count }, (_, i) => {
      const n = i + 1;
      return `<img src="${thumbSrc(currentSet, n)}" data-i="${n}" alt="${SETS[currentSet].label} ${n}" loading="lazy"${n === currentIndex ? ' class="active"' : ''}>`;
    }).join('');
  }

  function showImage(i){
    const { count, label } = SETS[currentSet];
    currentIndex = ((i - 1 + count) % count) + 1;
    viewerImg.src = src(currentSet, currentIndex);
    viewerImg.alt = `${label} ${currentIndex}`;
    viewerCounter.textContent = `${label} · ${currentIndex} / ${count}`;
    viewerThumbs.querySelectorAll('img').forEach(t => {
      t.classList.toggle('active', Number(t.dataset.i) === currentIndex);
    });
    const active = viewerThumbs.querySelector('img.active');
    if (active) active.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }

  function switchSet(set){
    currentSet = set;
    renderThumbs();
    showImage(1);
    viewerTabs.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.set === set));
  }

  document.getElementById('countDis').textContent = `(${DIS_COUNT})`;
  document.getElementById('countIc').textContent = `(${IC_COUNT})`;

  renderThumbs();
  showImage(1);

  viewerTabs.querySelectorAll('button').forEach(btn => {
    btn.addEventListener('click', () => switchSet(btn.dataset.set));
  });
  viewerThumbs.addEventListener('click', e => {
    if (e.target.tagName === 'IMG') showImage(Number(e.target.dataset.i));
  });
  document.getElementById('viewerPrev').addEventListener('click', () => showImage(currentIndex - 1));
  document.getElementById('viewerNext').addEventListener('click', () => showImage(currentIndex + 1));

  /* ---------- full galleries ---------- */
  function buildGrid(container, set){
    const { count, label } = SETS[set];
    container.innerHTML = Array.from({ length: count }, (_, i) => {
      const n = i + 1;
      return `<figure data-src="${src(set, n)}" data-cap="${label} ${n}">
                <img data-src="${thumbSrc(set, n)}" alt="${label} ${n}">
              </figure>`;
    }).join('');
  }
  buildGrid(document.getElementById('gridDis'), 'dis');
  buildGrid(document.getElementById('gridIc'), 'ic');

  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const img = entry.target;
      img.src = img.dataset.src;
      img.addEventListener('load', () => img.classList.add('loaded'), { once: true });
      imgObserver.unobserve(img);
    });
  }, { rootMargin: '200px' });
  document.querySelectorAll('.villa-grid img[data-src]').forEach(img => imgObserver.observe(img));

  document.querySelectorAll('#villaTabs button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#villaTabs button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      document.querySelectorAll('.villa-grid-wrap').forEach(w => {
        w.classList.toggle('active', w.dataset.tabPanel === btn.dataset.tab);
      });
    });
  });

  /* ---------- lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCap = document.getElementById('lightboxCap');

  function openLightbox(imgSrc, caption){
    lightboxImg.src = imgSrc;
    lightboxCap.textContent = caption || '';
    lightbox.classList.add('is-open');
  }
  function closeLightbox(){ lightbox.classList.remove('is-open'); }

  document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.getElementById('viewerFull').addEventListener('click', () => {
    openLightbox(viewerImg.src, `${SETS[currentSet].label} ${currentIndex}`);
  });
  document.addEventListener('click', e => {
    const fig = e.target.closest('.villa-grid figure');
    if (fig) openLightbox(fig.dataset.src, fig.dataset.cap);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
    if (lightbox.classList.contains('is-open')) return;
    if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
    if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  });

});
