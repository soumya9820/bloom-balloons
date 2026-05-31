/* =====================================================================
   parallax.js — the hero. ONE balloon-arch scene split into depth planes
   (Stepout-style): a sharp backdrop, the headline, and a soft foreground
   frame of balloon clusters cut from the same installation so they blend.
   Motion is buttery: EASED scroll + EASED mouse + a gentle perpetual float,
   all on GPU transforms (translate3d). Targets ~60fps.
   ===================================================================== */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;

  const layers = [...hero.querySelectorAll('[data-speed]')].map((el, i) => ({
    el,
    speed: parseFloat(el.dataset.speed),          // scroll multiplier
    depth: parseFloat(el.dataset.depth || 0),     // mouse multiplier (px)
    floatA: parseFloat(el.dataset.float || 0),    // perpetual float amplitude (px)
    phase: i * 1.7,                               // desync each layer's float
  }));

  let targetScroll = window.scrollY || 0;
  let sY = targetScroll;                          // eased scroll position
  let mxT = 0, myT = 0, mx = 0, my = 0;           // eased mouse (-0.5..0.5)

  window.addEventListener('scroll', () => { targetScroll = window.scrollY; }, { passive: true });

  if (!reduce && !coarse) {
    window.addEventListener('mousemove', (e) => {
      mxT = e.clientX / innerWidth - 0.5;
      myT = e.clientY / innerHeight - 0.5;
    }, { passive: true });
  }

  function tick(now) {
    sY += (targetScroll - sY) * 0.10;             // eased scroll → that "flowing" lag
    mx += (mxT - mx) * 0.06;                      // silky mouse lerp (≤ 0.1)
    my += (myT - my) * 0.06;
    const t = (now || 0) / 1000;
    const h = hero.offsetHeight || innerHeight;

    if (sY < h * 1.5) {
      for (const L of layers) {
        const fy = L.floatA ? Math.sin(t * 0.5 + L.phase) * L.floatA : 0;
        const fx = L.floatA ? Math.cos(t * 0.42 + L.phase) * L.floatA * 0.55 : 0;
        const ty = -sY * L.speed + (-my * L.depth) + fy;
        const tx = -mx * L.depth + fx;
        L.el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0)`;
      }
    }
    requestAnimationFrame(tick);
  }
  if (!reduce) requestAnimationFrame(tick);

  /* graceful gradient fallback if the backdrop 404s */
  function fallback() {
    hero.style.background =
      'radial-gradient(120% 90% at 72% 18%, #F3C2CC 0%, transparent 55%),' +
      'radial-gradient(110% 90% at 18% 92%, #D8CBEC 0%, transparent 55%),' +
      'linear-gradient(135deg, #FBE0CF, #C2E3D0)';
    hero.querySelectorAll('.plane img, .layer img').forEach((i) => (i.style.display = 'none'));
    const sc = hero.querySelector('.hero-scrim'); if (sc) sc.style.opacity = '.3';
  }
  const hb = document.getElementById('heroBack');
  if (hb) { hb.addEventListener('error', fallback); if (hb.complete && hb.naturalWidth === 0) fallback(); }
})();
