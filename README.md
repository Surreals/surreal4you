# surreal4you

Official website of **SURREAL** — hip-hop artist from Uzhhorod, Ukraine.

Built with **Next.js (App Router, SSR)**, React 18 and Tailwind CSS.

## Pages

- `/` — landing page with the album announcement (cover + minimal text), links and bio.
- `/store` — catalog-only merch store with an embedded Spotify player.
- `/admin` — password-protected admin panel (Google login) to edit products, the album announcement and links.

## Admin panel

Google sign-in (NextAuth v5) restricted to an email allowlist. Edited content
(products, album, links) and uploaded images are stored in **Vercel Blob**;
the public pages read it at request time. Locally, if `BLOB_READ_WRITE_TOKEN`
is not set, content falls back to a `.data/content.json` file (dev only) and
image uploads are disabled (use the image-path field instead).

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

Catalog-only — products live in [`src/data/products.js`](src/data/products.js). "Buy"
buttons open the order channel set by `ORDER_URL` in
[`src/utils/constants.js`](src/utils/constants.js). There is no on-site checkout or
payment processing. Update prices, images and `ORDER_URL` with real values.

### Merch on Spotify

Listing merch **on the Spotify artist profile** is not a website feature — it is
configured in **Spotify for Artists** by linking an approved merch partner
(e.g. Shopify). The site supports this by embedding the Spotify player and linking
to the artist profile; the actual profile listing must be enabled in Spotify for
Artists once a merch partner is connected.

## Deploy

Targets **Vercel** (zero-config Next.js, SSR). Push the repo and import it in Vercel,
then point `surreal4you.com` at the deployment. `@vercel/analytics` and
`@vercel/speed-insights` are already wired in.
