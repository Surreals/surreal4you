import {
  AlbumAnnounce,
  BootIntro,
  Countdown,
  Cursor,
  Info,
  Links,
  MusicPlayer,
  StatusLine,
  Title,
  TrackingCleaner,
} from "../components";
import { getContent } from "../lib/content";
import { showAlbumAnnounce } from "../utils/constants";

const Home = async () => {
  const { album, links } = await getContent();

  return (
    <main className="flex min-h-[100dvh] flex-col p-0 md:p-24 lg:p-32">
      <div className="container relative mx-auto flex w-full flex-1 flex-col justify-between overflow-hidden p-5 pb-16 text-center md:max-w-4xl md:p-6 xl:max-w-6xl 2xl:max-w-full">
        <Title />

        <div className="rise relative z-10 flex flex-col gap-5">
          <StatusLine />
          <Links links={links} />
        </div>

        {showAlbumAnnounce ? (
          <AlbumAnnounce album={album} />
        ) : (
          <Countdown title={album.title} />
        )}

        <div className="rise [animation-delay:240ms]">
          <Info album={album} />
        </div>
      </div>
      <MusicPlayer />
      <Cursor />
      <BootIntro />
      <TrackingCleaner />
    </main>
  );
};

export default Home;
