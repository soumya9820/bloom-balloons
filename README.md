# BLOOM · Balloon Atelier — marketing site (design prototype)

A story-driven, Apple-esque static marketing site for a balloon-arch decoration
business. The centerpiece is a **multi-layer 3D parallax hero** built from real
photographic balloon cutouts (Option A in the build spec): discrete depth layers
that move at different speeds on **scroll** and **eased mouse**, with the headline
**interleaved** between layers.

> **Status: design prototype.** Branding is mocked ("BLOOM", placeholder wordmark),
> imagery is premium stock used as a placeholder, and contact details / socials are
> fake. The quote form's submit is **stubbed** (shows a success toast) until a real
> Formspree endpoint is wired in.

## Live site
`https://soumya9820.github.io/bloom-balloons/`

## Structure
```
bloom-balloons/
├─ index.html          # Home: hero, intro, services, the craft, featured projects, quote, contact
├─ projects.html       # 6 case studies + accessible detail modal
├─ .nojekyll           # let GitHub Pages serve /assets untouched
├─ css/styles.css      # design tokens (spec §4) + all components
├─ js/
│  ├─ parallax.js      # the hero parallax engine (scroll + lerp-eased mouse, GPU only)
│  ├─ reveal.js        # nav, scroll reveals, story-band parallax, project modal, toast
│  └─ quote.js         # quote builder + live pricing (+ stubbed submit)
└─ assets/img/         # optimized WebP (+ JPEG fallbacks); hero cutouts are alpha WebP
```

## The hero (Option A)
- `assets/img/hero/scene.*` — background installation scene (overscanned to avoid edge reveal).
- `assets/img/hero/balloon-1…3.webp` — transparent balloon cutouts (made with `rembg`),
  placed at varying depths. `balloon-1` sits **behind** the headline; `balloon-2/3` sit
  **in front**, at the edges, so they never cover the text.
- Tuning lives in `js/parallax.js`: scroll speeds 0.10 → 0.58, mouse lerp `0.06`, all
  movement via `translate3d`. Honors `prefers-reduced-motion` (static scene) and disables
  mouse parallax on touch devices.

## Quote builder pricing (spec §7.3)
- Balloon Arch **base = $150** (includes 1 color).
- Each additional **accent color = +$20** (no cap).
- Designs and **arch size are visual-only** (no price impact).
- **Full Backdrop Decor** is disabled → friendly "coming soon" toast.

## Run locally
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy (GitHub Pages)
Settings → Pages → Deploy from a branch → **main** / **/ (root)**. The site uses
**relative** asset paths so it works from the `/bloom-balloons/` subpath.

## To finish for launch (deferred — owner to provide)
- Real business name + logo/wordmark.
- The business's own photography (file names are stable for easy swaps).
- A real **Formspree** endpoint for the quote form.
- Real contact details / social handles, and (optionally) a custom domain.

## Image attribution
Placeholder photography sourced from Pexels & Unsplash for this mockup only; replace
with the business's own images before launch.
