/* =====================================================================
   parallax.js — hero scroll parallax. Scroll-ONLY and tied 1:1 to the
   scroll position (read fresh every frame), so it's perfectly stable:
   the backdrop lags the scroll while the headline lifts. No mouse drift,
   no float, no easing wobble. GPU transforms only.
   ===================================================================== */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const layers = [...hero.querySelectorAll('[data-speed]')].map((el) => ({
    el,
    speed: parseFloat(el.dataset.speed),        // <0 lags (moves down), >0 lifts (moves up)
    scaleF: parseFloat(el.dataset.scale || 0),  // optional gentle scroll-zoom
  }));

  let raf = 0, lastY = -1;
  function render() {
    const y = window.scrollY || 0;
    const h = hero.offsetHeight || innerHeight;
    if (y !== lastY && y < h * 1.3) {           // only touch the DOM while the hero is on screen
      lastY = y;
      for (const L of layers) {
        const ty = -y * L.speed;
        let tr = `translate3d(0, ${ty.toFixed(2)}px, 0)`;
        if (L.scaleF) tr += ` scale(${(1 + y * L.scaleF).toFixed(4)})`;
        L.el.style.transform = tr;
      }
    }
    raf = requestAnimationFrame(render);
  }
  if (!reduce) raf = requestAnimationFrame(render);

  /* graceful gradient fallback if the backdrop 404s */
  function fallback() {
    hero.style.background =
      'radial-gradient(120% 90% at 72% 18%, #F3C2CC 0%, transparent 55%),' +
      'radial-gradient(110% 90% at 18% 92%, #D8CBEC 0%, transparent 55%),' +
      'linear-gradient(135deg, #FBE0CF, #C2E3D0)';
    hero.querySelectorAll('.plane img').forEach((i) => (i.style.display = 'none'));
    const sc = hero.querySelector('.hero-scrim'); if (sc) sc.style.opacity = '.3';
  }
  const hb = document.getElementById('heroBack');
  if (hb) { hb.addEventListener('error', fallback); if (hb.complete && hb.naturalWidth === 0) fallback(); }
})();
