---
name: srrl-visual-system
description: >
  Visual system for the SRRL artist site — the COLD side: steel, asphalt and
  x-ray blue with one surgical red. The throughline
  motif (not in the reference) is SURVEILLANCE — detection frames, blurred plates,
  x-ray plates, night-camera grain. The artist is an object under observation in a
  strange, slightly unreal world. That is "Surreal".
---

# SRRL — Visual System

> Mood: холодний сюр — спостереження · форензика · рентген.

## Color

One dark canvas, one cool family of greys/blues, **one** surgical red accent. Never add a
second accent — consistency beats variety.

| Token (code)      | Hex                     | Role                                            |
|-------------------|-------------------------|-------------------------------------------------|
| `asphalt`         | `#0a0c0e`               | Page background (off-black, cool-tinted)        |
| `graphite`        | `#23282e`               | Raised surfaces, image wells, placeholders      |
| `concrete`        | `#6e7b86`               | Muted text, mono labels                         |
| `xray` (DEFAULT)  | `#7fa8c9`               | Cool accent — prices, listen links, hover       |
| `xray.pale`       | `#b9d3e3`               | Lightest cool tint                              |
| `cold` (cold-white)| `#e8eef2`              | Primary text                                    |
| `signal` (the red)| `#d11a2a`               | Surgical accent — detection tags, REC dot, CTAs |
| `line`            | `rgba(255,255,255,.10)` | Hairlines / borders                             |

Shadows, if any, stay near-black and cool. No warm browns — this is the cold inversion.
No purple/blue "AI gradient".

CSS variables live in [`src/app/globals.css`](src/app/globals.css); Tailwind tokens in
[`tailwind.config.js`](tailwind.config.js). Use the Tailwind names (`bg-asphalt`, `text-concrete`,
`border-line`, `bg-signal`, `text-xray`) in components.

## Typography

Three voices, wired via `next/font` in [`src/app/layout.jsx`](src/app/layout.jsx):

- **Archivo** (`font-sans`, variable 100–900) — body + headings. Headings: `font-extrabold`
  (800), `uppercase`, tight tracking. The workhorse.
- **Space Mono** (`font-mono`, 400/700) — technical/forensic labels, codes, coordinates, prices,
  section numbers. Always `uppercase` + positive tracking (`tracking-[0.14em]`–`[0.18em]`),
  usually `text-concrete`.
- **Rock Salt** (`font-display`) — handwritten signature. Use **sparingly** — the SRRL signature
  only, never body copy.

Cyrillic (e.g. `гегемонія`): Archivo's latin subset falls back to `system-ui`; that is intended.
Keep Space Mono / Rock Salt text Latin (codes, `OUT NOW`, coordinates) so the mono voice stays
consistent.

## Motifs (the surveillance throughline)

1. **Film grain** — a fixed, `pointer-events-none` SVG fractal-noise overlay at ~6% opacity over
   the whole page (`body::after`). Breaks digital flatness; reads as night-camera.
2. **Detection frame** — a thin `signal` (red) border offset around a subject (album cover,
   product), with a small Space Mono **corner tag** (e.g. `OUT NOW`, `MM-01`). The subject is
   "tagged".
3. **X-ray / forensic photo treatment** — images render `grayscale(.35) contrast(1.05)
   brightness(.94)` and resolve to full color on hover (`group-hover:[filter:none]`). The subject
   "comes into focus" under observation.
4. **Status / REC line** — Space Mono label strips with a pulsing `signal` square (REC dot) and
   real coordinates (Uzhhorod `48.62N 22.29E`).
5. **Section index** — `signal` two-digit mono numbers (`01`, `02`) prefix section headers.

## Component rules

- **Backgrounds**: page `bg-asphalt`; image wells / placeholders `bg-graphite`.
- **Borders**: hairlines use `border-line`. The only red borders are detection frames / CTA hover.
- **Hover/active**: every interactive element shifts color (`hover:text-xray`) or fills
  (`hover:bg-signal`); add `transition-colors` (200–500ms). Keyboard `:focus-visible` shows an
  `xray` outline (global).
- **Buttons (CTA)**: hairline border at rest → fill `signal` on hover. Mono label, wide tracking,
  trailing `→`.
- **Motion**: animate `transform`/`opacity`/`filter` only (GPU). No `top/left/width` animation.
- **Layout**: full-screen sections use `min-h-[100dvh]` (not `100vh`). Single-screen landing keeps
  its top / center / bottom rhythm.

## Don't

- No second accent color; no warm tones; no pure `#000` background.
- No Rock Salt outside the signature; no Cyrillic in the mono voice.
- Don't restyle the `/admin` panel under this system unless asked — it's a private tool, not a
  public surface.
