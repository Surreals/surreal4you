import Link from "next/link";
import { Cursor, FilmGrain, Product, SpotifyEmbed } from "../../components";
import { getContent } from "../../lib/content";
import { SPOTIFY_ARTIST_URL } from "../../utils/constants";

// Kept out of search while merch is unpublished — the page stays reachable by
// direct URL so the catalog can be previewed before it goes live.
export async function generateMetadata() {
  const { settings } = await getContent();
  return {
    title: "Store — Srrlovych",
    description:
      "Srrlovych merch: prints and apparel from the HEHEMONIA era. Orders go through Telegram; the same pieces are listed on the Spotify artist profile.",
    alternates: { canonical: "/store" },
    robots: settings.showStore ? undefined : { index: false, follow: false },
    openGraph: {
      title: "Store — Srrlovych",
      description: "Prints and apparel from the HEHEMONIA era. Orders go through Telegram.",
      url: "/store",
    },
  };
}

const Store = async () => {
  const { products } = await getContent();

  return (
    <main className="min-h-[100dvh]">
      <div className="tape h-2" aria-hidden="true" />
      <header className="status">
        <Link href="/" className="ctl -ml-2">
          ← station
        </Link>
        <span className="ml-auto text-ink">cam-02 · merch</span>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <h1 className="font-display text-[clamp(40px,9vw,112px)] font-black leading-[0.9] tracking-tight">
          merch
        </h1>
        <p className="mt-3 max-w-[48ch] text-dim">
          prints and apparel from the hehemonia era. pick a piece, write to telegram, srrl answers himself.
          the same pieces are listed on the spotify profile.
        </p>

        <section aria-label="Merch" className="mt-10 grid grid-cols-2 gap-6 md:mt-14 md:gap-8 lg:grid-cols-3">
          {products.map((product, i) => (
            <Product key={product.id} product={product} index={i} />
          ))}
        </section>

        <section aria-label="Listen" className="mt-16 md:mt-24">
          <h2 className="mb-3 text-dim">cam-01 · listen while you browse</h2>
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
      <Cursor />
      <FilmGrain />
    </main>
  );
};

export default Store;
