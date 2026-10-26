---
name: srrl-station-system
description: >
  Visual system for the Srrlovych site — a night-watch surveillance station in
  Uzhhorod. Four camera feeds, draggable windows, a log that writes itself and
  one caution-tape red. The artist is the subject under observation; the world
  the cameras see is slightly off. That is "Surreal".
---

# SRRL — Station system

> Концепт: пульт нічного відеоспостереження. Камери — двері в розділи. Сюр — у
> тому, що станція бачить світ трохи не таким, як він є.

Спека редизайну: [`docs/superpowers/specs/2026-10-26-station-redesign-design.md`](docs/superpowers/specs/2026-10-26-station-redesign-design.md).
Живий референс: `/moodboard`.

## Колір

Усе через CSS-токени в [`src/app/globals.css`](src/app/globals.css) (ніч за замовчуванням,
`:root[data-theme="day"]` — день) і Tailwind-імена в [`tailwind.config.js`](tailwind.config.js):
`bg-bg`, `bg-panel`, `bg-panel-2`, `border-line`, `text-ink`, `text-dim`, `text-red`.

| токен | ніч | день | роль |
|---|---|---|---|
| `--bg` | `#0c0c0e` | `#e6e4df` | фон — асфальт / бетон |
| `--panel` | `#141417` | `#f6f5f2` | вікна, статус, док |
| `--panel-2` | `#1c1c20` | `#ffffff` | заголовки вікон, підняті ряди |
| `--line` | `rgba(243,241,236,.14)` | `rgba(12,12,14,.16)` | лінії |
| `--ink` | `#f3f1ec` | `#121214` | текст, рамки вікон |
| `--dim` | `#8e8d93` | `#67666c` | другорядний текст |
| `--red` | `#d9291f` | `#d9291f` | **єдиний акцент** |

Тема визначається до першого кадру скриптом у [`src/app/layout.jsx`](src/app/layout.jsx):
збережений вибір (`localStorage.srrl-theme`) або час Ужгорода (07:00–19:00 — день).

Правила: один акцент; жодного зеленого; білий текст на червоному (`#fff`), ніколи `--ink`
на червоному в денній темі; нема чистого `#000` фону.

## Стрічка (tape)

`--tape` — повторюваний градієнт 135°, червоний / `--ink`, крок 24px. Клас `.tape`.
Це **єдиний** декоративний прийом, і він з'являється лише як тонка смуга:

- 8px над тікером (і над сторінками `/store`, `/moodboard`);
- 6px у заголовку вікна, що у фокусі (`.window[data-focused]`);
- ніколи як фон під текстом.

## Шрифти

Підключені через `next/font` у `layout.jsx`:

- **Unbounded** (`font-display`, 500/700/900, кирилиця) — лише великі слова: назви камер на
  OSD, «гегемонія», заголовки сторінок, ціни. Завжди нижній регістр, `tracking-tight`,
  `leading` 0.9–0.95.
- **JetBrains Mono** (`font-mono`, 400/700, кирилиця) — весь інший текст: UI, OSD, журнал,
  досьє, посилання. Базовий розмір 14px / 1.5; лейбли 11–12px. Нижній регістр; без
  розтягнутого трекінгу і капслоку.
- **Rock Salt** (`font-sign`) — тільки підпис «Srrlovych»: `.signature` поверх мультив'ю
  (`mix-blend-mode: difference`) і один рядок на мобільному / `/moodboard`.

Людський текст — українською, машинні коди (`cam-01`, `rec`, координати, `log`) — латиницею.

## Станція

[`src/components/Station`](src/components/Station) — єдиний клієнтський оркестратор.

- **Ticker** — стрічка + марки (`.ticker-track`, 48s, пауза при наведенні).
- **StatusBar** — `rec` (клік = втрата сигналу на 1.8с), час Ужгорода, координати, кнопки
  `log` / `map` / тема.
- **Feed** ×4 — фото + OSD (`.feed-osd`): cam-id, rec + час, дисплейна назва, дата,
  координати. Накладки: сканлінії + віньєтка (`.feed-scan`), статика при втраті сигналу
  (`.feed-static`), червона рамка 2px на 6px від краю при hover / focus / відкритому вікні
  (`.feed-frame`). Фото вночі десатуровані (`--feed-filter`), повний колір при наведенні.
- **Window** — 2px рамка `--ink`, шарова тінь, заголовок на `--panel-2`. На ≥1024px —
  абсолютне позиціонування через `--x/--y` + `translate3d`, перетягування за заголовок
  (pointer events, без ре-рендеру), каскад при відкритті, фокус по кліку. <1024px —
  повноекранний sheet, сторінка за ним заблокована (`html[data-modal]`).
- **Dock** — плеєр (відкриває `music`) + усі посилання. На мобільному — sticky, один рядок
  з горизонтальним скролом.
- **Log** — події станції (нові зверху, максимум 60). Реальні події (запуск, вікна, тема,
  сигнал) і `AMBIENT_LOG` з [`src/lib/feeds.js`](src/lib/feeds.js) кожні 18–35с.
- **Map** — радар (`.radar` + `.radar-sweep`), координати, час.
- **Boot** — раз на сесію, ~1с, рядки з `BOOT_LINES`; `html[data-boot]` тримає `.rise`.

Клавіатура: `1–4` камери, `l` журнал, `m` карта, `t` тема, `Esc` закрити верхнє вікно,
набір `srrl` — рентген (`html[data-xray]`, invert + hue-rotate).

## Компоненти

- **Кнопки / посилання** — `.ctl`: 32px, без рамки у спокої, заливка `--red` + білий текст
  при hover, `scale(.96)` при натисканні, псевдоелемент тягне зону кліку до 44px.
  `.ctl.border-ink` / `.ctl.border-line` — варіанти з рамкою (CTA, стрімінг).
- **Plate** — `.plate`: фото в `--panel-2` з 1px лінією, червоний тег `.plate-tag` у
  лівому верхньому куті (`obj-01`, `sub-01`, `mm-01`). Фото десатуроване до наведення.
- **Dossier** — `.dossier`: `dl` сіткою `max-content 1fr`, `dt` в `--dim`.
- **Іконки** — inline SVG на сітці 16, `currentColor`, stroke 1.5–1.75. Без текстових гліфів.
- **Радіуси** — немає. Тіні — тільки на вікнах, шарові напівпрозорі.
- **Плівка** — `<FilmGrain />` (`.film`): зерно 12fps + віньєтка; дозується
  `--grain-opacity` / `--vignette-strength` у токенах теми. Тільки публічні сторінки.
- **Курсор** — `<Cursor />`: червоний приціл, лише fine pointer.

## Рух

Один оркестрований момент — boot + `.rise` мультив'ю. Далі лише у відповідь на дію:
вікно 200ms in / 160ms out (`opacity` + `translateY` 8px), hover фото 500–700ms,
`.ctl` 150ms. Анімуються тільки `transform` / `opacity` / `filter`; ніякого
`transition: all`. Під `prefers-reduced-motion` тікер, `rec`, радар, зерно, boot і
статика зупиняються; колір і текст лишаються.

## Не робити

- Другий акцент, зелений, градієнти, радіуси, емодзі-іконки.
- Стрічка як фон під текстом або більша за смугу.
- Unbounded для абзаців; Rock Salt поза підписом; капслок-лейбли з трекінгом.
- Чіпати `/admin` — це приватний інструмент поза цією системою.
