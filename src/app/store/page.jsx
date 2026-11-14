import Link from "next/link";
import { FilmGrain, Product, SpotifyEmbed } from "../../components";
import { getContent } from "../../lib/content";
import { SPOTIFY_ARTIST_URL } from "../../utils/constants";

// Kept out of search while merch is unpublished — the page stays reachable by
// direct URL so the catalog can be previewed before it goes live.
export async function generateMetadata() {
  const { settings } = await getContent();
  return {
    title: "Store — SRRLOVYCH",
    description:
      "SRRLOVYCH merch. prints and apparel from the hehemonia era. orders go through telegram; the same pieces are listed on the spotify profile.",
    alternates: { canonical: "/store" },
    robots: settings.showStore ? undefined : { index: false, follow: false },
    openGraph: {
      title: "Store — SRRLOVYCH",
      description: "prints and apparel from the hehemonia era. orders go through telegram.",
      url: "/store",
    },
  };
}

const Store = async () => {
  const { products } = await getContent();

  return (
    <main className="min-h-[100dvh]">
      <header className="status">
        <Link href="/" className="ctl -ml-2">
          ← the block
        </Link>
        <span className="ml-auto text-ink">kiosk · merch</span>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <h1 className="font-display text-[clamp(40px,9vw,112px)] font-black leading-[0.9] tracking-tight">
          merch
        </h1>
        <p className="mt-3 max-w-[48ch] text-dim">
          the shutter is up. prints and apparel from the hehemonia era. pick one and write to telegram: srrl
          answers himself. the same pieces are on the spotify profile.
        </p>

        <section aria-label="Merch" className="mt-10 grid grid-cols-2 gap-6 md:mt-14 md:gap-8 lg:grid-cols-3">
          {products.map((product, i) => (
            <Product key={product.id} product={product} index={i} />
          ))}
        </section>

        <section aria-label="Listen" className="mt-16 md:mt-24">
          <h2 className="mb-3 text-dim">stands · listen while you look</h2>
          <div className="border border-line">
            <SpotifyEmbed />
          </div>
          <p className="mt-3 text-[12px] text-dim">
            <a href={SPOTIFY_ARTIST_URL} target="_blank" rel="noopener noreferrer" className="ctl -ml-2">
              open on spotify
            </a>
          </p>
        </section>
      </div>
      <FilmGrain />
    </main>
  );
};

export default Store;
