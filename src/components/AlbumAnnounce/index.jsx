import Image from "next/image";
import { album as defaultAlbum } from "../../utils/constants";

const AlbumAnnounce = ({ album = defaultAlbum }) => {
  return (
    <div className="relative z-10 flex flex-col items-center gap-3 place-self-center">
      {album.cover ? (
        <a
          href={album.listenUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group block w-48 sm:w-56 md:w-64"
          aria-label={`Listen to ${album.title} on Spotify`}
        >
          <Image
            src={album.cover}
            alt={`${album.title} — album cover`}
            width={2048}
            height={2048}
            priority
            sizes="(min-width: 768px) 16rem, (min-width: 640px) 14rem, 12rem"
            className="w-full h-auto shadow-2xl transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </a>
      ) : null}
      <div className="text-center font-bold uppercase leading-tight">
        <p className="text-xs tracking-[0.3em] opacity-60">new album</p>
        <p className="text-2xl md:text-3xl tracking-wide">{album.title}</p>
        <a
          href={album.listenUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm tracking-widest hover:underline"
        >
          {album.status} — listen
        </a>
      </div>
    </div>
  );
};

export default AlbumAnnounce;
