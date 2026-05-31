/* =====================================================================
   quote.js — interactive quote builder with live pricing.
   Pricing (authoritative, spec §7.3):
     Balloon Arch base = $150 (includes 1 color)
     each additional accent color = +$20  (no cap)
   Designs & arch size are visual-only (no price impact).
   "Full Backdrop Decor" is disabled → friendly toast.
   Submit is stubbed (no Formspree yet) → success toast.
   ===================================================================== */
(function () {
  'use strict';
  const builder = document.getElementById('builder');
  if (!builder) return;

  const BASE = 150, ACCENT = 20;

  const PALETTE = [
    { n: 'Blush', c: '#F6D4D8' }, { n: 'Rose', c: '#EFB7C0' }, { n: 'Peach', c: '#FBE0CF' },
    { n: 'Butter', c: '#FBEFCB' }, { n: 'Mint', c: '#D8EEE2' }, { n: 'Sage', c: '#C7DDC9' },
    { n: 'Sky', c: '#D9E8F3' }, { n: 'Lavender', c: '#E6DCF2' }, { n: 'Lilac', c: '#CDBEE6' },
    { n: 'Cream', c: '#F4E9DC' }, { n: 'Coral', c: '#F4B8A1' }, { n: 'Dusty Blue', c: '#B8CBD9' },
  ];
  const DESIGNS = [
    { id: 'garland', name: 'Organic Garland', svg: '<ellipse cx="20" cy="34" rx="9" ry="10" fill="#F6D4D8"/><ellipse cx="34" cy="24" rx="8" ry="9" fill="#EFB7C0"/><ellipse cx="50" cy="20" rx="9" ry="10" fill="#FBE0CF"/><ellipse cx="66" cy="24" rx="8" ry="9" fill="#E6DCF2"/><ellipse cx="80" cy="34" rx="9" ry="10" fill="#FBEFCB"/>' },
    { id: 'halfmoon', name: 'Half-Moon', svg: '<path d="M14 50 A36 36 0 0 1 86 50" fill="none" stroke="#EFB7C0" stroke-width="9" stroke-linecap="round"/><path d="M22 50 A28 28 0 0 1 78 50" fill="none" stroke="#F6D4D8" stroke-width="7" stroke-linecap="round"/>' },
    { id: 'double', name: 'Double Arch', svg: '<path d="M16 52 Q30 14 44 52" fill="none" stroke="#E6DCF2" stroke-width="8" stroke-linecap="round"/><path d="M52 52 Q66 14 80 52" fill="none" stroke="#FBE0CF" stroke-width="8" stroke-linecap="round"/>' },
    { id: 'full', name: 'Full Arch', svg: '<path d="M14 54 Q14 12 50 12 Q86 12 86 54" fill="none" stroke="#F6D4D8" stroke-width="9" stroke-linecap="round"/><path d="M24 54 Q24 22 50 22 Q76 22 76 54" fill="none" stroke="#EFB7C0" stroke-width="6" stroke-linecap="round"/>' },
  ];
  const SIZES = ['6 ft', '12 ft', 'Full'];

  const state = { service: 'arch', design: 'garland', size: '12 ft', primary: 0, accents: [] };

  /* ---- designs ---- */
  const designRow = document.getElementById('designRow');
  DESIGNS.forEach((d, i) => {
    const el = document.createElement('button');
    el.className = 'chip' + (i === 0 ? ' active' : '');
    el.type = 'button';
    el.innerHTML = `<svg viewBox="0 0 100 64" aria-hidden="true">${d.svg}</svg><span>${d.name}</span>`;
    el.addEventListener('click', () => {
      designRow.querySelectorAll('.chip').forEach((x) => x.classList.remove('active'));
      el.classList.add('active'); state.design = d.id; update();
    });
    designRow.appendChild(el);
  });

  /* ---- size (visual only, no price impact) ---- */
  const sizeRow = document.getElementById('sizeRow');
  SIZES.forEach((s) => {
    const el = document.createElement('button');
    el.className = 'chip' + (s === state.size ? ' active' : '');
    el.type = 'button';
    el.innerHTML = `<span style="margin-top:0;font-size:.95rem">${s}</span>`;
    el.addEventListener('click', () => {
      sizeRow.querySelectorAll('.chip').forEach((x) => x.classList.remove('active'));
      el.classList.add('active'); state.size = s; update();
    });
    sizeRow.appendChild(el);
  });

  /* ---- swatches ---- */
  function buildSwatches(container, mode) {
    PALETTE.forEach((p, i) => {
      const s = document.createElement('button');
      s.type = 'button';
      s.className = 'sw' + (mode === 'primary' && i === 0 ? ' sel' : '');
      s.style.background = p.c;
      s.title = p.n;
      s.setAttribute('aria-label', (mode === 'primary' ? 'Primary color ' : 'Accent color ') + p.n);
      s.innerHTML = '<span class="check" aria-hidden="true">✓</span>';
      s.addEventListener('click', () => {
        if (mode === 'primary') {
          container.querySelectorAll('.sw').forEach((x) => x.classList.remove('sel'));
          s.classList.add('sel'); state.primary = i;
          state.accents = state.accents.filter((a) => a !== i); // can't be accent + primary
        } else {
          if (i === state.primary) return;
          if (state.accents.includes(i)) { state.accents = state.accents.filter((a) => a !== i); }
          else { state.accents.push(i); }
        }
        update();
      });
      container.appendChild(s);
    });
  }
  const primaryEl = document.getElementById('primarySwatches');
  const accentEl = document.getElementById('accentSwatches');
  buildSwatches(primaryEl, 'primary');
  buildSwatches(accentEl, 'accent');

  function syncSwatches() {
    primaryEl.querySelectorAll('.sw').forEach((s, i) => s.classList.toggle('sel', i === state.primary));
    accentEl.querySelectorAll('.sw').forEach((s, i) => {
      s.classList.toggle('sel', state.accents.includes(i));
      const isPrimary = i === state.primary;
      s.style.opacity = isPrimary ? '.28' : '1';
      s.style.pointerEvents = isPrimary ? 'none' : 'auto';
    });
  }

  /* ---- live summary ---- */
  const totalAmt = document.getElementById('totalAmt');
  function update() {
    syncSwatches();
    const accentCount = state.accents.length;
    const total = BASE + accentCount * ACCENT;

    document.getElementById('sumDesign').textContent = DESIGNS.find((d) => d.id === state.design).name;
    document.getElementById('sumSize').textContent = state.size;

    const accentLine = document.getElementById('accentLine');
    if (accentCount > 0) {
      accentLine.style.display = 'flex';
      document.getElementById('accentCount').textContent = `(${accentCount} × $20)`;
      document.getElementById('accentTotal').textContent = `$${accentCount * ACCENT}`;
    } else accentLine.style.display = 'none';

    const ids = [state.primary, ...state.accents];
    document.getElementById('paletteDots').innerHTML = ids.map((i) => `<i style="background:${PALETTE[i].c}"></i>`).join('');

    totalAmt.textContent = `$${total}`;
    totalAmt.classList.add('bump');
    setTimeout(() => totalAmt.classList.remove('bump'), 300);

    document.getElementById('accentHint').textContent =
      accentCount === 0 ? 'Tap to add as many accent colors as you like — each is +$20.'
        : `${accentCount} accent color${accentCount > 1 ? 's' : ''} added — +$${accentCount * ACCENT}.`;
  }

  /* event date: default min = today */
  const dateInput = document.getElementById('qDate');
  if (dateInput) { dateInput.min = new Date().toISOString().split('T')[0]; }

  update();

  /* ---- disabled "Full Backdrop" feedback ---- */
  const backdrop = document.getElementById('optBackdrop');
  if (backdrop) backdrop.addEventListener('click', () =>
    window.showToast('Full Backdrop Decor is coming soon — want to be the first to know when it launches?'));

  /* ---- request quote (stubbed submit → success toast; Formspree wired later) ---- */
  document.getElementById('quoteForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const ids = [state.primary, ...state.accents];
    const colors = ids.map((i) => PALETTE[i].n).join(', ');
    const total = BASE + state.accents.length * ACCENT;
    const name = (document.getElementById('qName').value || '').trim();
    const date = document.getElementById('qDate').value;
    const design = DESIGNS.find((d) => d.id === state.design).name;

    // (Prototype) — payload assembled & ready for a real Formspree endpoint later.
    const payload = { service: 'Balloon Arch', design, size: state.size, eventDate: date,
      primary: PALETTE[state.primary].n, accents: state.accents.map((i) => PALETTE[i].n), estimate: total };
    console.log('Quote request (stub):', payload);

    const who = name ? name.split(' ')[0] : 'there';
    window.showToast(`Thank you, ${who}! Your ${design} in ${colors} (est. $${total}) is saved — we’ll be in touch within 24 hours. ✦`, 6500);
    e.target.reset();
    if (dateInput) dateInput.min = new Date().toISOString().split('T')[0];
  });
})();
