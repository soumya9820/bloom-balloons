/* =====================================================================
   reveal.js — nav behaviour, mobile drawer, scroll reveals, the "Craft"
   story-band parallax, accessible project modal, and the shared toast.
   ===================================================================== */
(function () {
  'use strict';
  const nav = document.getElementById('nav');
  const navLinks = document.getElementById('navLinks');
  const menuBtn = document.getElementById('menuBtn');
  const hero = document.querySelector('.hero');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- nav: frosted-on-scroll; solid when there's no hero (e.g. Projects) ---- */
  if (nav) {
    if (!hero) nav.classList.add('scrolled');
    // Over the hero, keep the nav transparent/light; only frost once the
    // hero has been scrolled fully past.
    const onScroll = () => {
      if (!hero) return;
      const trigger = hero.offsetHeight - 80;
      nav.classList.toggle('scrolled', window.scrollY > trigger);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
  if (menuBtn && navLinks) {
    const setMenu = (open) => {
      navLinks.classList.toggle('open', open);
      menuBtn.setAttribute('aria-expanded', String(open));
      menuBtn.textContent = open ? '✕' : '☰';
      document.body.style.overflow = open ? 'hidden' : '';
    };
    menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
    navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  }

  /* ---- scroll reveals ---- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }),
    { threshold: 0.16 }
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  /* ---- "The Craft" story-band parallax (slow drift, GPU only) ---- */
  const band = document.querySelector('.story-bg');
  if (band && !reduce) {
    const story = band.closest('.story');
    let ticking = false;
    const move = () => {
      const r = story.getBoundingClientRect();
      const p = (r.top + r.height / 2 - innerHeight / 2) / innerHeight; // ~ -1..1
      band.style.transform = `translate3d(0, ${(-p * 230).toFixed(1)}px, 0)`;
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(move); } }, { passive: true });
    move();
  }

  /* ---- shared toast ---- */
  const toast = document.getElementById('toast');
  window.showToast = function (msg, ms) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => toast.classList.remove('show'), ms || 5200);
  };

  /* ---- projects grid + accessible modal (Projects page) ---- */
  const PROJECTS = [
    { slug: 'up-away', kicker: 'Baby Shower · Garden', title: 'Up & Away',
      images: ['up-away-1', 'up-away-2'],
      palette: ['#E7A4B8', '#CBA07C', '#F4E4DC'],
      t1: 'An open-air welcome for a baby girl, styled around a soft “up, up & away” daydream of hot-air balloons and pastel skies.',
      t2: 'Pink, rose-gold and pearl tumbled down a trio of dusty-rose arches in one organic garland — anchored by a watercolor balloon backdrop, a vintage floral carriage, stacked “BABY” blocks and a little candy cart. The kind of scene guests photograph before they find their seats.',
      stats: [['Triple arch', 'Backdrop'], ['Garden', 'Outdoor setup'], ['Carriage', '+ candy cart']] },
    { slug: 'baby-bloom', kicker: 'Baby Shower · Indoor', title: 'Baby in Bloom',
      images: ['baby-bloom'],
      palette: ['#F2C2CE', '#C7A26B', '#D8E2CF'],
      t1: 'An elegant indoor shower for a mum-to-be who wanted soft, modern and unmistakably feminine — pink and gold, nothing fussy.',
      t2: 'We framed a pair of blush arches with a free-flowing garland of pink, white and antique gold, threaded with trailing greenery, and finished the moment with a hand-lettered “Baby in Bloom” in gold script.',
      stats: [['Double arch', 'Backdrop'], ['Indoor', 'Venue'], ['Gold script', 'Custom sign']] },
    { slug: 'cocoa-cream', kicker: 'Baby Shower · Indoor', title: 'Cocoa & Cream',
      images: ['cocoa-cream'],
      palette: ['#8C6A52', '#C9A883', '#EFE3D2'],
      t1: 'A teddy-bear shower for a family who wanted grown-up and gender-neutral — all the warmth, not a single primary color in sight.',
      t2: 'Oversized orbs in cocoa, caramel, latte and pearl floated from the ceiling on satin ribbons and tiny bows, drifting softly over the room like a sky full of little bears.',
      stats: [['Ceiling', 'Installation'], ['Neutral', 'Palette'], ['Orbs', 'On satin ribbon']] },
    { slug: 'time-flies', kicker: '1st Birthday · Indoor', title: 'Time Flies',
      images: ['time-flies'],
      palette: ['#A9C2D6', '#B5673C', '#E9DCC4'],
      t1: 'A vintage-aviator first birthday for a little man about to turn one — dusty skies, propellers and well-worn leather.',
      t2: 'A full portal arch in powder blue, rust and cream, freckled with chrome gold, wrapped a “How Time Flies” banner of biplanes and hot-air balloons. Nostalgic, handsome, and built for the cake-smash photos.',
      stats: [['Full arch', 'Portal'], ['Aviator', 'Theme'], ['4', 'Custom colors']] },
    { slug: 'congrats-grad', kicker: 'Graduation · Evening', title: 'Congrats, Grad',
      images: ['congrats-grad'],
      palette: ['#C58B6F', '#2B2530', '#F1EAE2'],
      t1: 'A grown-up graduation moment for a new graduate who wanted glam — rose-gold, black and white, nothing that reads like a kid’s party.',
      t2: 'Chrome rose-gold, matte black and pearl white spiralled up an arched backdrop beside a hand-lettered “Congrats Grad”, with a matching cluster anchoring the frame — a photo wall built to hold its own in a dim, dramatic room.',
      stats: [['Twin arch', 'Backdrop'], ['Rose-gold', 'Metallics'], ['Evening', 'Event']] },
    { slug: 'barnyard-bash', kicker: 'Toddler Birthday · Outdoor', title: 'Barnyard Bash',
      images: ['barnyard-bash'],
      palette: ['#C5433B', '#A9C8E0', '#F0B98A'],
      t1: 'An outdoor barnyard bash for a toddler who loves animals — red barns, hay bales and a whole lot of moo.',
      t2: 'A bright, playful garland in sky blue, peach, barn-red and white — speckled with cow-print balloons — arched over a farmyard backdrop and a hay-bale table, cheerful enough to keep up with a two-year-old.',
      stats: [['Full arch', 'Barnyard'], ['Outdoor', 'Setting'], ['Cow-print', 'Accents']] },
  ];

  // single <img> for a project slug (jpg only — these are the real event photos)
  function imgTag(slug, alt, lazy) {
    return `<img src="assets/img/projects/${slug}.jpg" alt="${alt}"` +
           (lazy ? ' loading="lazy"' : '') + ' decoding="async">';
  }

  // modal hero: a single image, or a swipeable carousel when there are 2+ photos
  function heroMarkup(p) {
    if (p.images.length < 2) return imgTag(p.images[0], p.title, false);
    const slides = p.images
      .map((s, idx) => `<div class="car-slide">${imgTag(s, p.title + ' — photo ' + (idx + 1), false)}</div>`)
      .join('');
    const dots = p.images
      .map((_, idx) => `<button class="car-dot${idx === 0 ? ' on' : ''}" data-i="${idx}" aria-label="Show photo ${idx + 1}"></button>`)
      .join('');
    return `<div class="carousel" data-i="0">` +
           `<div class="car-track">${slides}</div>` +
           `<button class="car-arrow prev" aria-label="Previous photo">‹</button>` +
           `<button class="car-arrow next" aria-label="Next photo">›</button>` +
           `<div class="car-dots">${dots}</div></div>`;
  }

  const grid = document.getElementById('projGrid');
  if (grid) {
    PROJECTS.forEach((p, i) => {
      const btn = document.createElement('button');
      btn.className = 'proj reveal' + (i % 3 === 1 ? ' d1' : i % 3 === 2 ? ' d2' : '');
      btn.setAttribute('aria-haspopup', 'dialog');
      const multi = p.images.length > 1
        ? `<span class="proj-multi" aria-hidden="true">⧉ ${p.images.length}</span>` : '';
      btn.innerHTML =
        `<div class="proj-img">${imgTag(p.images[0], p.title + ' — ' + p.kicker, true)}</div>` + multi +
        `<div class="proj-overlay"><span class="k">${p.kicker}</span><h3>${p.title}</h3>` +
        `<div class="swatch-row">${p.palette.map((c) => `<i style="background:${c}"></i>`).join('')}</div>` +
        `<span class="open">Read the case study →</span></div>`;
      btn.addEventListener('click', () => openModal(p, btn));
      grid.appendChild(btn);
      io.observe(btn);
    });
  }

  /* modal */
  const modalBg = document.getElementById('modalBg');
  let lastFocus = null;
  let car = null; // active hero-carousel controller (null when a project has one photo)
  function openModal(p, trigger) {
    if (!modalBg) return;
    lastFocus = trigger || document.activeElement;
    document.getElementById('modalHero').innerHTML =
      heroMarkup(p) + '<button class="modal-close" id="modalClose" aria-label="Close">✕</button>';
    document.getElementById('modalKicker').textContent = p.kicker;
    document.getElementById('modalTitle').textContent = p.title;
    document.getElementById('modalText1').textContent = p.t1;
    document.getElementById('modalText2').textContent = p.t2;
    document.getElementById('modalPalette').innerHTML =
      p.palette.map((c) => `<i style="background:${c}"></i>`).join('') +
      '<span style="margin-left:8px;color:var(--ink-soft);font-size:.85rem">Palette</span>';
    document.getElementById('modalStats').innerHTML =
      p.stats.map((s) => `<div class="s"><span>${s[0]}</span><small>${s[1]}</small></div>`).join('');
    modalBg.classList.add('open');
    modalBg.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    document.getElementById('modalClose').addEventListener('click', closeModal);
    car = initCarousel();
    const modal = modalBg.querySelector('.modal');
    (modal.querySelector('.modal-close')).focus();
  }

  /* hero carousel — arrows, dots, swipe; returns a controller, or null for single-photo */
  function initCarousel() {
    const root = modalBg.querySelector('.carousel');
    if (!root) return null;
    const track = root.querySelector('.car-track');
    const dots = Array.prototype.slice.call(root.querySelectorAll('.car-dot'));
    const n = dots.length;
    let i = 0;
    const go = (to) => {
      i = (to + n) % n;
      track.style.transform = 'translateX(' + (-i * 100) + '%)';
      dots.forEach((d, k) => d.classList.toggle('on', k === i));
      root.setAttribute('data-i', String(i));
    };
    root.querySelector('.prev').addEventListener('click', () => go(i - 1));
    root.querySelector('.next').addEventListener('click', () => go(i + 1));
    dots.forEach((d) => d.addEventListener('click', () => go(parseInt(d.dataset.i, 10))));
    let x0 = null; // touch swipe
    root.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    root.addEventListener('touchend', (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0;
      if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1));
      x0 = null;
    }, { passive: true });
    return { prev: () => go(i - 1), next: () => go(i + 1) };
  }

  function closeModal() {
    if (!modalBg) return;
    modalBg.classList.remove('open');
    modalBg.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    car = null;
    if (lastFocus) lastFocus.focus();
  }
  if (modalBg) {
    modalBg.addEventListener('click', (e) => { if (e.target === modalBg) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (!modalBg.classList.contains('open')) return;
      if (e.key === 'Escape') closeModal();
      if (car && e.key === 'ArrowLeft') { e.preventDefault(); car.prev(); }
      if (car && e.key === 'ArrowRight') { e.preventDefault(); car.next(); }
      if (e.key === 'Tab') { // focus trap
        const f = modalBg.querySelectorAll('a[href],button,input,[tabindex]:not([tabindex="-1"])');
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    // featured cards on the home page open the modal right here (no page jump)
    document.querySelectorAll('a.proj[href*="#"]').forEach((a) => {
      const slug = a.getAttribute('href').split('#')[1] || '';
      const fp = PROJECTS.find((x) => x.slug === slug);
      if (fp) a.addEventListener('click', (e) => { e.preventDefault(); openModal(fp, a); });
    });
    // deep-link: projects.html#peaches opens that study
    const hash = decodeURIComponent(location.hash.slice(1));
    if (hash) { const p = PROJECTS.find((x) => x.slug === hash); if (p) setTimeout(() => openModal(p), 350); }
  }
})();
