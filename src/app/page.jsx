import { AlbumAnnounce, Info, Links, MusicPlayer, Title, TrackingCleaner } from "../components";
import { getContent } from "../lib/content";
import { showAlbumAnnounce } from "../utils/constants";

const Home = async () => {
  const { album, links } = await getContent();

  return (
    <main className="flex min-h-[100dvh] flex-col p-0 md:p-24 lg:p-32">
      <div className="container relative mx-auto flex w-full flex-1 flex-col justify-between overflow-hidden p-5 pb-16 text-center md:max-w-4xl md:p-6 xl:max-w-6xl 2xl:max-w-full">
        <Title />

        <div className="rise relative z-10 flex flex-col gap-5">
          <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em] text-concrete">
            <span className="flex items-center gap-2">
              <span className="size-1.5 animate-pulse bg-signal" aria-hidden="true" />
              srrl
            </span>
            <span>uzh · 48.62n 22.29e</span>
          </div>
          <Links links={links} />
        </div>

        {showAlbumAnnounce ? (
          <AlbumAnnounce album={album} />
        ) : (
          <div className="rise relative z-10 flex flex-col items-center gap-2 place-self-center [animation-delay:120ms]">
            <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-concrete">
              <span className="size-1.5 animate-pulse bg-signal" aria-hidden="true" />
              next
            </span>
            <span className="font-mono text-4xl font-bold tracking-[0.05em] text-cold md:text-5xl">
              03.07
            </span>
            <span className="text-xs font-extrabold tracking-[0.18em] text-concrete">
              {album.title}
            </span>
          </div>
        )}

        <div className="rise [animation-delay:240ms]">
          <Info album={album} />
        </div>
      </div>
      <MusicPlayer />
      <TrackingCleaner />
    </main>
  );
};

export default Home;
