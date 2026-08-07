import Link from "next/link";
import { Cursor, Product, Scanline, SpotifyEmbed } from "../../components";
import { getContent } from "../../lib/content";
import { SPOTIFY_ARTIST_URL } from "../../utils/constants";

// Kept out of search while merch is unpublished — the page stays reachable by
// direct URL so the catalog can be previewed before it goes live.
export async function generateMetadata() {
  const { settings } = await getContent();
  return {
    title: "Store — Srrl",
    description:
      "Official Srrl merch. Prints and apparel from the HEHEMONIA era. Also available on the Srrl Spotify artist profile.",
    alternates: { canonical: "/store" },
    robots: settings.showStore ? undefined : { index: false, follow: false },
    openGraph: {
      title: "Store — Srrl",
      description:
        "Official Srrl merch. Prints and apparel from the HEHEMONIA era.",
      url: "/store",
    },
  };
}

const Store = async () => {
  const { products } = await getContent();

  return (
    <main className="mx-auto min-h-[100dvh] max-w-6xl px-4 py-8 md:px-8 md:py-16">
      <header className="flex items-baseline justify-between border-b border-line pb-5 font-mono text-xs uppercase tracking-[0.18em] text-lichen">
        <Link href="/" className="transition-colors hover:text-leaf">
          ← srrl
        </Link>
        <span className="text-bone">
          <span className="text-leaf">01</span> / store
        </span>
      </header>

      <section
        aria-label="Merch"
        className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mt-16 md:gap-10 lg:grid-cols-3"
      >
        {products.map((product, i) => (
          <Product key={product.id} product={product} index={i} />
        ))}
      </section>

      <section aria-label="Listen" className="mt-16 md:mt-24">
        <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-lichen">
          <span className="text-leaf">02</span> / listen while you browse
        </h2>
        <div className="overflow-hidden rounded-xl border border-line">
          <SpotifyEmbed />
        </div>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-wide text-lichen">
          spotify merch is powered by the same shopify catalog once connected.{" "}
          <a
            href={SPOTIFY_ARTIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-leaf transition-colors hover:text-bone"
          >
            open on spotify →
          </a>
        </p>
      </section>
      <Cursor />
      <Scanline />
    </main>
  );
};

export default Store;
