import { AlbumAnnounce, Info, Links, Title, TrackingCleaner } from "../components";
import { getContent } from "../lib/content";

const Home = async () => {
  const { album, links } = await getContent();

  return (
    <main className="h-screen p-0 md:p-32">
      <div className="container relative mx-auto flex size-full flex-col justify-between overflow-hidden bg-contain bg-center bg-no-repeat p-2 text-center md:max-w-4xl xl:max-w-6xl 2xl:max-w-full">
        <Title />
        <Links links={links} />
        <AlbumAnnounce album={album} />
        <Info album={album} />
      </div>
      <TrackingCleaner />
    </main>
  );
};

export default Home;
