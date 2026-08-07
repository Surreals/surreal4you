import { getContent } from "../lib/content";

const SITE_URL = "https://surreal4you.com";

/**
 * Hand-maintained, like the static sitemap.xml this replaced: bump a route's
 * date when its content meaningfully changes, not on every deploy. A build
 * timestamp here would tell crawlers the pages changed every time anything
 * ships, which is how a sitemap loses its credibility.
 */
const LAST_MODIFIED = {
  home: "2026-08-07", // album announcement removed
  store: "2026-08-07", // palette reworked
};

// Generated rather than static: /store only belongs in the sitemap while merch
// is published from /admin/products.
const sitemap = async () => {
  const { settings } = await getContent();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: LAST_MODIFIED.home,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...(settings.showStore
      ? [
          {
            url: `${SITE_URL}/store`,
            lastModified: LAST_MODIFIED.store,
            changeFrequency: "weekly",
            priority: 0.8,
          },
        ]
      : []),
  ];
};

export default sitemap;
