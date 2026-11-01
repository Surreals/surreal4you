import { Cursor, FilmGrain, Station, TrackingCleaner } from "../components";
import { getContent } from "../lib/content";
import { isStoreLink } from "../lib/store";
import { artistJsonLd } from "../lib/jsonLd";

const Home = async () => {
  const { album, links, settings, products, note } = await getContent();

  // The store link only exists on the landing page while merch is published.
  const visible = (list) => (settings.showStore ? list : list.filter((l) => !isStoreLink(l)));
  const publicLinks = { main: visible(links.main), side: visible(links.side) };

  // "<" is escaped so an admin-entered URL can never close the script tag.
  const jsonLd = JSON.stringify(artistJsonLd(publicLinks)).replace(/</g, "\\u003c");

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
      <Station
        album={album}
        links={publicLinks}
        settings={settings}
        products={products}
        note={note}
        attribution={
          <a
            href="https://www.bytcd.com/"
            target="_blank"
            rel="noopener"
            className="ctl -mr-2 text-dim"
          >
            by bytcd.com
          </a>
        }
      />
      <Cursor />
      <FilmGrain />
      <TrackingCleaner />
    </main>
  );
};

export default Home;
