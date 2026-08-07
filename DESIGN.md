---
name: srrl-visual-system
description: >
  Visual system for the SRRL artist site — a night field: bark, moss and bone
  with one living leaf-green. The throughline motif is SURVEILLANCE — detection
  frames, blurred plates, night-camera grain. The artist is an object under
  observation in a strange, slightly unreal world. That is "Surreal".
---

# SRRL — Visual System

> Mood: сюр у природі — спостереження · форензика · заростання.

## Color

One dark, slightly green canvas, one family of natural greens/greys, **one** leaf-green accent.
Never add a second accent — consistency beats variety.

| Token (code)      | Hex                       | Role                                             |
|-------------------|---------------------------|--------------------------------------------------|
| `bark`            | `#141811`                 | Page background (charcoal-green, never `#000`)   |
| `moss`            | `#262b21`                 | Raised surfaces, image wells, placeholders       |
| `lichen`          | `#7e8a74`                 | Muted text, mono labels                          |
| `leaf` (DEFAULT)  | `#8fbf6a`                 | **The** accent — detection tags, REC dot, prices, links, CTA fill |
| `leaf.pale`       | `#c3d9ac`                 | Lightest tint — hover, secondary markers         |
| `bone`            | `#eef1e8`                 | Primary text (warm off-white)                    |
| `line`            | `rgba(238,241,232,.12)`   | Hairlines / borders                              |

`leaf` is bright, so anything **filled** with it carries `text-bark`, never `text-bone`
(`bone` on `leaf` is 1.87:1 — unreadable). `bark` on `leaf` is 8.41:1.

Shadows, if any, stay near-black and green-tinted. No cool steel blues, no red, no purple/blue
"AI gradient".

CSS variables live in [`src/app/globals.css`](src/app/globals.css); Tailwind tokens in
[`tailwind.config.js`](tailwind.config.js). Use the Tailwind names (`bg-bark`, `text-lichen`,
`border-line`, `bg-leaf`, `text-leaf`) in components.

## Typography

Three voices, wired via `next/font` in [`src/app/layout.jsx`](src/app/layout.jsx):

- **Archivo** (`font-sans`, variable 100–900) — body + headings. Headings: `font-extrabold`
  (800), `uppercase`, tight tracking. The workhorse.
- **Space Mono** (`font-mono`, 400/700) — technical/forensic labels, codes, coordinates, prices,
  section numbers. Always `uppercase` + positive tracking (`tracking-[0.14em]`–`[0.18em]`),
  usually `text-lichen`.
- **Rock Salt** (`font-display`) — handwritten signature. Use **sparingly** — the SRRL signature
  only, never body copy. As the full-bleed watermark it takes the `.watermark` treatment: no fill,
  debossed into the surface with a shadow along the top lip and a highlight along the bottom.
  A translucent fill is wrong here at any opacity — its hard alpha edge always reads as a decal
  sitting on the page.

Cyrillic (e.g. `гегемонія`): Archivo's latin subset falls back to `system-ui`; that is intended.
Keep Space Mono / Rock Salt text Latin (codes, `OUT NOW`, coordinates) so the mono voice stays
consistent.

## Motifs (the surveillance throughline)

1. **Old-film stock** — the `<FilmGrain />` component: a fixed, `pointer-events-none` pair of
   layers over the whole page. Desaturated SVG fractal noise that *jumps* between 10 discrete
   positions at ~12fps (grain is re-exposed every frame, so it must never slide), plus a radial
   projector vignette whose opacity wobbles like an unsteady lamp. Breaks digital flatness; reads
   as projected film rather than a clean screen. Tune with `--grain-opacity` /
   `--vignette-strength` on `.film`. Both animations stop under `prefers-reduced-motion` while the
   texture stays. Rendered per public page, never in the root layout — `/admin` must stay clean.
2. **Detection frame** — a thin `leaf` border offset around a subject (product, plate), with a
   small Space Mono **corner tag** (e.g. `MM-01`) in `bg-leaf text-bark`. The subject is "tagged".
3. **Forensic photo treatment** — images render `grayscale(.35) contrast(1.02) brightness(.98)`
   and resolve to full color on hover (`group-hover:[filter:none]`). The subject "comes into
   focus" under observation.
4. **Status / REC line** — Space Mono label strips with a pulsing `leaf` square (REC dot) and
   real coordinates (Uzhhorod `48.62N 22.29E`).
5. **Section index** — `leaf` two-digit mono numbers (`01`, `02`) prefix section headers.

## Component rules

- **Backgrounds**: page `bg-bark`; image wells / placeholders `bg-moss`.
- **Borders**: hairlines use `border-line`. The only green borders are detection frames / CTA hover.
- **Hover/active**: every interactive element shifts color (`hover:text-leaf`) or fills
  (`hover:bg-leaf hover:text-bark`); add `transition-colors` (200–500ms). Keyboard
  `:focus-visible` shows a `leaf` outline (global).
- **Buttons (CTA)**: hairline border at rest → fill `leaf` (+ `text-bark`) on hover. Mono label,
  wide tracking, trailing `→`.
- **Motion**: animate `transform`/`opacity`/`filter` only (GPU). No `top/left/width` animation.
- **Layout**: full-screen sections use `min-h-[100dvh]` (not `100vh`). Single-screen landing keeps
  its top / bottom rhythm.

## Don't

- No second accent color; no red; no cool steel blue; no pure `#000` background or `#fff` text.
- Never put `bone` text on a `leaf` fill.
- No Rock Salt outside the signature; no Cyrillic in the mono voice.
- Don't restyle the `/admin` panel under this system unless asked — it's a private tool, not a
  public surface.
