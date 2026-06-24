import Link from "next/link";
import { Cursor, Product, Scanline, SpotifyEmbed } from "../../components";
import { getContent } from "../../lib/content";
import { SPOTIFY_ARTIST_URL } from "../../utils/constants";

export const metadata = {
  title: "Store — Srrl",
  description:
    "Official Srrl merch. Prints and apparel from the HEHEMONIA era. Also available on the Srrl Spotify artist profile.",
  alternates: { canonical: "/store" },
  openGraph: {
    title: "Store — Srrl",
    description:
      "Official Srrl merch. Prints and apparel from the HEHEMONIA era.",
    url: "/store",
  },
};

const Store = async () => {
  const { products } = await getContent();

  return (
    <main className="mx-auto min-h-[100dvh] max-w-6xl px-4 py-8 md:px-8 md:py-16">
      <header className="flex items-baseline justify-between border-b border-line pb-5 font-mono text-xs uppercase tracking-[0.18em] text-concrete">
        <Link href="/" className="transition-colors hover:text-xray">
          ← srrl
        </Link>
        <span className="text-cold">
          <span className="text-signal">01</span> / store
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
        <h2 className="mb-4 font-mono text-xs uppercase tracking-[0.18em] text-concrete">
          <span className="text-signal">02</span> / listen while you browse
        </h2>
        <div className="overflow-hidden rounded-xl border border-line">
          <SpotifyEmbed />
        </div>
        <p className="mt-4 font-mono text-[11px] uppercase tracking-wide text-concrete">
          spotify merch is powered by the same shopify catalog once connected.{" "}
          <a
            href={SPOTIFY_ARTIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xray transition-colors hover:text-cold"
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
