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
    menuBtn.addEventListener('click', () => {
      const open = navLinks.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    navLinks.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      })
    );
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
      band.style.transform = `translate3d(0, ${(-p * 140).toFixed(1)}px, 0)`;
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
    { slug: 'peaches', kicker: 'Baby Shower · Garden', title: 'Peaches & Cream',
      palette: ['#FBE0CF', '#F6D4D8', '#FBEFCB'],
      t1: 'A soft, sun-warmed garland framing a dessert table for a spring baby shower of forty guests, set against weathered garden wood.',
      t2: 'We blended peach, blush and butter into an organic, asymmetric cloud that spilled gently down one side — relaxed, romantic and impossible to walk past without taking a photo.',
      stats: [['12 ft', 'Garland length'], ['3', 'Custom colors'], ['40', 'Guests']] },
    { slug: 'lavender', kicker: '1st Birthday · Indoor', title: 'Lavender Dream',
      palette: ['#E6DCF2', '#CDBEE6', '#F6D4D8'],
      t1: 'A dreamy lavender installation for a first birthday, glowing in the last light of a late-summer evening.',
      t2: 'Layered lilacs and a whisper of blush — anchored by a statement number — turned an open room into a soft, storybook frame the family will keep forever.',
      stats: [['Full arch', 'Statement size'], ['4', 'Custom colors'], ['On-site', 'Setup']] },
    { slug: 'blush', kicker: 'Wedding · Garden', title: 'Blush Ceremony',
      palette: ['#F6D4D8', '#FBE6E8', '#EFB7C0'],
      t1: 'A romantic half-moon arch behind the vows for an intimate garden wedding of one hundred and twenty.',
      t2: 'We kept the palette tight — three blush tones — so the greenery and the couple did the talking, with balloons that read like petals from across the lawn.',
      stats: [['Half-moon', 'Design'], ['3', 'Blush tones'], ['120', 'Guests']] },
    { slug: 'mint-gold', kicker: 'Grand Opening · Retail', title: 'Mint & Gold',
      palette: ['#D8EEE2', '#FBEFCB', '#C7A26B'],
      t1: 'A bright, photo-ready double arch flanking the entrance of a boutique’s grand opening.',
      t2: 'Fresh mint met butter and warm chrome gold for a storefront moment guests couldn’t resist sharing — on-brand, on-trend and built to last the whole weekend.',
      stats: [['Double arch', 'Design'], ['3', 'Custom colors'], ['Storefront', 'Install']] },
    { slug: 'midnight', kicker: 'Milestone · Evening', title: 'Midnight Bloom',
      palette: ['#6E5A78', '#B98AA0', '#F4E9DC'],
      t1: 'A moody, full-wall backdrop for a milestone birthday held after dark.',
      t2: 'Five deep tones — plum, dusty rose and cream among them — layered into a rich, candlelit bloom that made the room feel like a private, glamorous secret.',
      stats: [['Full wall', 'Backdrop'], ['5', 'Custom colors'], ['Evening', 'Event']] },
    { slug: 'sky-sage', kicker: 'Corporate · Launch', title: 'Sky & Sage',
      palette: ['#D9E8F3', '#C7DDC9', '#F4E9DC'],
      t1: 'A clean, considered garland for a corporate product launch, styled to read from the back of the room.',
      t2: 'Sky blue, sage and white in a sixteen-foot sweep gave the stage a calm, confident frame — modern enough for the brand, warm enough for the after-party.',
      stats: [['16 ft', 'Garland length'], ['3', 'Custom colors'], ['Stage', 'Corporate']] },
  ];

  function pic(slug, alt) {
    return `<picture><source type="image/webp" srcset="assets/img/projects/${slug}.webp">` +
           `<img src="assets/img/projects/${slug}.jpg" alt="${alt}" loading="lazy" decoding="async"></picture>`;
  }

  const grid = document.getElementById('projGrid');
  if (grid) {
    PROJECTS.forEach((p, i) => {
      const btn = document.createElement('button');
      btn.className = 'proj reveal' + (i % 3 === 1 ? ' d1' : i % 3 === 2 ? ' d2' : '');
      btn.setAttribute('aria-haspopup', 'dialog');
      btn.innerHTML =
        `<div class="proj-img">${pic(p.slug, p.title + ' — ' + p.kicker)}</div>` +
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
  function openModal(p, trigger) {
    if (!modalBg) return;
    lastFocus = trigger || document.activeElement;
    document.getElementById('modalHero').innerHTML =
      pic(p.slug, p.title) + '<button class="modal-close" id="modalClose" aria-label="Close">✕</button>';
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
    const modal = modalBg.querySelector('.modal');
    (modal.querySelector('.modal-close')).focus();
  }
  function closeModal() {
    if (!modalBg) return;
    modalBg.classList.remove('open');
    modalBg.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }
  if (modalBg) {
    modalBg.addEventListener('click', (e) => { if (e.target === modalBg) closeModal(); });
    document.addEventListener('keydown', (e) => {
      if (!modalBg.classList.contains('open')) return;
      if (e.key === 'Escape') closeModal();
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
