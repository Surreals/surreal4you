import Image from "next/image";
import SpotifyEmbed from "../../SpotifyEmbed";

const STREAMING = ["SPOTIFY", "APPLE", "YOUTUBE"];

// cam-01: the album. Cover, the title as a wall of type, and the player.
const Music = ({ album, links }) => {
  const streaming = links.main.filter((l) => STREAMING.includes(l.name.toUpperCase()));
  return (
    <div className="p-4 sm:p-5">
      <div className="grid gap-4 sm:grid-cols-[160px_1fr] sm:items-end">
        <div className="plate aspect-square">
          <Image src="/hehemonia.png" alt="гегемонія — обкладинка" fill sizes="160px" className="object-cover" />
          <span className="plate-tag">obj-01</span>
        </div>
        <div>
          <h2 className="font-display text-[clamp(34px,6vw,56px)] font-black leading-[0.95] tracking-tight">
            {album.title}
          </h2>
          <p className="mt-2 text-dim">
            альбом · <span className="text-red">{(album.status ?? "").toLowerCase()}</span>
          </p>
          <ul className="mt-3 flex flex-wrap gap-1">
            {streaming.map((l) => (
              <li key={l.name}>
                <a href={l.url} target="_blank" rel="noopener noreferrer" className="ctl border-line">
                  {l.name.toLowerCase()}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="mt-4 border border-line">
        <SpotifyEmbed height={352} />
      </div>
    </div>
  );
};

export default Music;
