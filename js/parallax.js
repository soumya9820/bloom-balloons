/* =====================================================================
   parallax.js — the hero. Option A: discrete real-photo cutout layers
   over a background scene. Layers move at different speeds on SCROLL and
   eased MOUSE; the headline is interleaved between layers. One rAF loop,
   lerp-eased mouse, GPU transforms only (translate3d). ~60fps.
   ===================================================================== */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches; // touch → no mouse parallax

  const layers = [...hero.querySelectorAll('[data-speed]')].map((el) => ({
    el,
    speed: parseFloat(el.dataset.speed),   // scroll multiplier
    depth: parseFloat(el.dataset.depth),   // mouse multiplier (px)
  }));

  let scrollY = window.scrollY || 0;
  let mxT = 0, myT = 0, mx = 0, my = 0;    // target vs eased mouse (-0.5..0.5)

  window.addEventListener('scroll', () => { scrollY = window.scrollY; }, { passive: true });

  if (!reduce && !coarse) {
    hero.addEventListener('mousemove', (e) => {
      const r = hero.getBoundingClientRect();
      mxT = (e.clientX - r.width / 2) / r.width;
      myT = (e.clientY - r.height / 2) / r.height;
    });
    hero.addEventListener('mouseleave', () => { mxT = 0; myT = 0; });
  }

  function tick() {
    mx += (mxT - mx) * 0.06;               // silky lerp — keep ≤ 0.1
    my += (myT - my) * 0.06;
    const h = hero.offsetHeight || innerHeight;
    if (scrollY < h * 1.4) {               // stop working once hero is offscreen
      for (const { el, speed, depth } of layers) {
        const ty = -scrollY * speed + (-my * depth);
        const tx = -mx * depth;
        el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      }
    }
    requestAnimationFrame(tick);
  }

  // Reduced motion → static composed scene (no scroll/mouse transforms).
  if (!reduce) requestAnimationFrame(tick);

  /* Graceful gradient fallback if the hero photo 404s (per spec §5.3). */
  function fallback() {
    hero.style.background =
      'radial-gradient(120% 90% at 72% 18%, #F3C2CC 0%, transparent 55%),' +
      'radial-gradient(110% 90% at 18% 92%, #D8CBEC 0%, transparent 55%),' +
      'linear-gradient(135deg, #FBE0CF, #C2E3D0)';
    hero.querySelectorAll('.plane img, .layer img').forEach((i) => (i.style.display = 'none'));
    const sc = hero.querySelector('.hero-scrim'); if (sc) sc.style.opacity = '.28';
  }
  const hb = document.getElementById('heroBack');
  if (hb) {
    hb.addEventListener('error', fallback);
    if (hb.complete && hb.naturalWidth === 0) fallback();
  }
})();
