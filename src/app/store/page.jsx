import Link from "next/link";
import { Product, SpotifyEmbed } from "../../components";
import { getContent } from "../../lib/content";
import { SPOTIFY_ARTIST_URL } from "../../utils/constants";

export const metadata = {
  title: "Store — SURREAL",
  description:
    "Official SURREAL merch. Prints and apparel from the HEHEMONIA era. Also available on the SURREAL Spotify artist profile.",
  alternates: { canonical: "/store" },
  openGraph: {
    title: "Store — SURREAL",
    description:
      "Official SURREAL merch. Prints and apparel from the HEHEMONIA era.",
    url: "/store",
  },
};

const Store = async () => {
  const { products } = await getContent();

  return (
    <main className="mx-auto min-h-screen max-w-6xl px-4 py-8 md:px-8 md:py-16">
      <header className="flex items-baseline justify-between font-bold uppercase tracking-wide">
        <Link href="/" className="hover:underline">
          ← surreal
        </Link>
        <span>Store</span>
      </header>

      <section
        aria-label="Merch"
        className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 md:mt-16 md:gap-10 lg:grid-cols-3"
      >
        {products.map((product) => (
          <Product key={product.id} product={product} />
        ))}
      </section>

      <section aria-label="Listen" className="mt-16 md:mt-24">
        <h2 className="mb-4 font-bold uppercase tracking-wide">Listen while you browse</h2>
        <SpotifyEmbed />
        <p className="mt-4 text-sm opacity-70">
          Merch is also listed on the SURREAL Spotify artist profile.{" "}
          <a
            href={SPOTIFY_ARTIST_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold underline"
          >
            Open on Spotify
          </a>
        </p>
      </section>
    </main>
  );
};

export default Store;
