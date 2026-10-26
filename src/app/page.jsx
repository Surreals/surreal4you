import { Cursor, FilmGrain, Station, TrackingCleaner } from "../components";
import { getContent } from "../lib/content";
import { isStoreLink } from "../lib/store";

const Home = async () => {
  const { album, links, settings, products } = await getContent();

  // The store link only exists on the landing page while merch is published.
  const visible = (list) => (settings.showStore ? list : list.filter((l) => !isStoreLink(l)));
  const publicLinks = { main: visible(links.main), side: visible(links.side) };

  return (
    <main>
      <Station
        album={album}
        links={publicLinks}
        settings={settings}
        products={products}
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
