import Image from "next/image";
import { album as defaultAlbum } from "../../utils/constants";

const AlbumAnnounce = ({ album = defaultAlbum }) => {
  return (
    <div className="relative z-10 flex flex-col items-center gap-5 place-self-center">
      {album.cover ? (
        <a
          href={album.listenUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative block w-48 sm:w-56 md:w-64"
          aria-label={`Listen to ${album.title} on Spotify`}
        >
          {/* detection frame — the subject is tagged */}
          <span className="pointer-events-none absolute -inset-2 border border-signal opacity-80">
            <span className="absolute -top-[9px] left-0 bg-signal px-1.5 py-px font-mono text-[9px] uppercase tracking-widest text-cold">
              {album.status}
            </span>
          </span>
          <Image
            src={album.cover}
            alt={`${album.title} — album cover`}
            width={2048}
            height={2048}
            priority
            sizes="(min-width: 768px) 16rem, (min-width: 640px) 14rem, 12rem"
            className="h-auto w-full [filter:grayscale(0.35)_contrast(1.05)_brightness(0.94)] transition-[filter,transform] duration-500 group-hover:scale-[1.02] group-hover:[filter:none]"
          />
        </a>
      ) : null}
      <div className="text-center leading-tight">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-concrete">
          {album.status}
        </p>
        <p className="mt-1 text-2xl font-extrabold uppercase tracking-wide md:text-3xl">
          {album.title}
        </p>
        <a
          href={album.listenUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-xray transition-colors hover:text-cold"
        >
          <span aria-hidden="true">▸</span> listen
        </a>
      </div>
    </div>
  );
};

export default AlbumAnnounce;
