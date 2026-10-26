# surreal4you

Official website of **Srrlovych** — hip-hop artist from Uzhhorod, Ukraine.

Built with **Next.js (App Router, SSR)**, React 18 and Tailwind CSS.

## Pages

- `/` — the **station**: a four-camera surveillance console. Each feed loops a few seconds
  of video and opens a window (music, merch, archive, subject); windows drag on desktop and
  become sheets on mobile. Live Uzhhorod clock, a self-writing event log visitors can write
  into (moderated), the artist's note, a radar map, a terminal, keyboard shortcuts
  (`1–4`, `n`, `l`, `m`, `` ` ``, `t`, `Esc`) and a couple of easter eggs. By day (07–19
  Uzhhorod time, or by toggle) the same station is a bare concrete desk with folders.
  See [`DESIGN.md`](DESIGN.md) and the spec in `docs/superpowers/specs/`.
- `/store` — catalog-only merch store with an embedded Spotify player.
- `/moodboard` — the visual system reference (see [`DESIGN.md`](DESIGN.md)).
- `/admin` — admin panel (Google login) to manage merch, its visibility, the album, links,
  the artist's note and the guestbook queue.

## Admin panel

Google sign-in (NextAuth v5) restricted to an email allowlist. Edited content
(products, settings, album, links, note) and uploaded images are stored in **Vercel Blob**;
the public pages read it at request time. Locally, if `BLOB_READ_WRITE_TOKEN`
is not set, content falls back to a `.data/content.json` file (dev only) and
image uploads are disabled (use the image-path field instead).

### Guestbook

Visitors can type a line into the station log (`POST /api/guestbook`, 2–80 chars,
no links, one per minute, at most 10 *waiting* lines per visitor, 300 waiting in total;
approved history never blocks the queue). Every line is its own **private** blob under
`guestbook/<status>/<visitor>/<id>.json` (or a file under `.data/guestbook/` locally), so
visitors never overwrite each other or a moderation decision. Nothing is public until
approved in `/admin/guestbook`; approving rebuilds `guestbook/feed.json`, the only thing
the public endpoint reads. Approved lines drip into every visitor's log between the
station's own entries. The visitor identity comes from `x-real-ip`, which Vercel sets;
client-sent `x-forwarded-for` is ignored.

Until an admin saves anything, the site shows the seed content in
[`src/data/products.js`](src/data/products.js) and [`src/utils/constants.js`](src/utils/constants.js).

### Environment

Copy [`.env.example`](.env.example) to `.env.local` and fill in:

- `AUTH_SECRET` — `npx auth secret`
- `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` — Google OAuth client. Redirect URI:
  `https://surreal4you.com/api/auth/callback/google` (and the `localhost:3000`
  variant for dev).
- `ADMIN_EMAILS` — comma-separated allowlist of admin Google accounts.
- `BLOB_READ_WRITE_TOKEN` — auto-injected on Vercel once a Blob store is connected;
  pull locally with `vercel env pull .env.local`.

## Develop

```bash
pnpm install
pnpm dev      # http://localhost:3000
```

Other scripts: `pnpm build`, `pnpm start`, `pnpm lint`.

## Store

Catalog-only — seed products live in [`src/data/products.js`](src/data/products.js), and are
managed from `/admin/products` once an admin saves. "Buy" buttons open the order channel set by
`ORDER_URL` in [`src/utils/constants.js`](src/utils/constants.js). There is no on-site checkout or
payment processing.

**Visibility.** `/admin/products` carries a master switch (`settings.showStore`). While merch is
hidden, any link pointing at `/store` is stripped from the landing page and `/store` is left out of
[`src/app/sitemap.js`](src/app/sitemap.js) and marked `noindex` — but the page still opens by
direct URL so the catalog can be previewed before it goes live.

### Merch on Spotify

Current setup flow:

1. Create the products in Shopify.
2. Install / connect the Spotify for Artists Shopify sales channel:
   <https://apps.shopify.com/spotify>
3. In Spotify for Artists, open Merch & Events and connect the Shopify store:
   <https://artists.spotify.com/merch>
4. Publish the Shopify products to Spotify, then pin/tag featured merch in
   Spotify for Artists.
5. Paste the same Shopify product URLs into `/admin/products` as `Buy URL` so
   the website store links to the catalog Spotify uses.

Listing merch **on the Spotify artist profile** is not a website feature — it is
configured in **Spotify for Artists** by linking an approved merch partner
(e.g. Shopify). The site supports this by embedding the Spotify player and linking
to the artist profile; the actual profile listing must be enabled in Spotify for
Artists once a merch partner is connected.

## Installable app (PWA)

The site and the admin panel install from the browser as two separate apps:
`public/manifest.webmanifest` (linked from the root layout) and `public/admin.webmanifest`
(linked from `src/app/admin/layout.jsx`, kept outside `/admin/` so the middleware never
redirects it). Icons live in `public/icons/` — admin variants carry an "ADM" tag.
`public/sw.js` caches only `public/offline.html` and serves it when a page can't load offline;
nothing else is cached. It is registered in production only by
[`src/components/ServiceWorker`](src/components/ServiceWorker/index.jsx). Bump `CACHE` in
`sw.js` after editing `offline.html`.

## Deploy

Targets **Vercel** (zero-config Next.js, SSR). Push the repo and import it in Vercel,
then point `surreal4you.com` at the deployment. `@vercel/analytics` and
`@vercel/speed-insights` are already wired in.
