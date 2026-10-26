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
      "Official Srrlovych merch. Prints and apparel from the HEHEMONIA era. Also available on the Srrlovych Spotify artist profile.",
    alternates: { canonical: "/store" },
    robots: settings.showStore ? undefined : { index: false, follow: false },
    openGraph: {
      title: "Store — Srrlovych",
      description: "Official Srrlovych merch. Prints and apparel from the HEHEMONIA era.",
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
          ← станція
        </Link>
        <span className="ml-auto text-ink">cam-02 · merch</span>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8 md:px-8 md:py-12">
        <h1 className="font-display text-[clamp(40px,9vw,112px)] font-black leading-[0.9] tracking-tight">
          мерч
        </h1>
        <p className="mt-3 max-w-[48ch] text-dim">
          принти та одяг ери «гегемонії». замовлення — у телеграмі; ті самі речі видно і на профілі в
          spotify.
        </p>

        <section aria-label="Merch" className="mt-10 grid grid-cols-2 gap-6 md:mt-14 md:gap-8 lg:grid-cols-3">
          {products.map((product, i) => (
            <Product key={product.id} product={product} index={i} />
          ))}
        </section>

        <section aria-label="Listen" className="mt-16 md:mt-24">
          <h2 className="mb-3 text-dim">cam-01 · слухати, поки дивишся</h2>
          <div className="border border-line">
            <SpotifyEmbed />
          </div>
          <p className="mt-3 text-[12px] text-dim">
            <a href={SPOTIFY_ARTIST_URL} target="_blank" rel="noopener noreferrer" className="ctl -ml-2">
              відкрити в spotify
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
