export const SITE_URL = "https://surreal4you.com";

// Share-tracking params that make the same profile look like different URLs.
const TRACKING_PARAMS = ["si", "igsh", "utm_source", "utm_medium", "utm_campaign"];

function canonicalUrl(raw) {
  try {
    const u = new URL(raw);
    TRACKING_PARAMS.forEach((p) => u.searchParams.delete(p));
    return u.toString();
  } catch {
    return null;
  }
}

// sameAs is built from the very links the station shows visitors (admin-
// editable, see src/lib/content.js), so search engines and people see the
// same profiles. Internal links like /store are skipped.
// TODO(maria): both Telegram links on the site go in here — the invite link
// (t.me/+…) and t.me/surrealenko. Confirm which one is the official channel.
export function sameAsFromLinks(links) {
  const all = [...(links?.main ?? []), ...(links?.side ?? [])];
  const urls = all
    .map((l) => (typeof l?.url === "string" ? l.url.trim() : ""))
    .filter((url) => /^https?:\/\//i.test(url))
    .map(canonicalUrl)
    .filter(Boolean);
  return [...new Set(urls)];
}

export function artistJsonLd(links) {
  return {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    "@id": `${SITE_URL}/#artist`,
    name: "Srrlovych",
    alternateName: ["Srrl", "surrealovych"],
    description: "Hip-hop artist from Uzhhorod, Ukraine. Album: HEHEMONIA.",
    url: `${SITE_URL}/`,
    image: `${SITE_URL}/og-image.png`,
    genre: ["Hip-Hop", "Rap"],
    foundingLocation: { "@type": "City", name: "Uzhhorod", addressCountry: "UA" },
    sameAs: sameAsFromLinks(links),
  };
}
