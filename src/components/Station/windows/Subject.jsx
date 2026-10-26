import Image from "next/image";
import { calculateAge } from "../../../utils/dateUtils";
import { HQ } from "../../../lib/feeds";

const BIRTH = "2000-10-14";

// cam-04: the dossier. Who the station is watching.
const Subject = ({ album, links }) => {
  const age = calculateAge(BIRTH);
  const channels = [...links.main, ...links.side].filter((l) => !l.url.startsWith("/"));

  return (
    <div className="grid gap-5 p-4 sm:grid-cols-[180px_1fr] sm:p-5">
      <div className="plate aspect-[3/4]">
        <Image src="/moodboard/night.webp" alt="Srrlovych" fill sizes="180px" className="object-cover" />
        <span className="plate-tag">sub-01</span>
      </div>
      <dl className="dossier content-start">
        <dt>ім’я</dt>
        <dd className="font-display text-base font-bold">Srrlovych</dd>
        <dt>також</dt>
        <dd>srrl · surrealovych</dd>
        <dt>вік</dt>
        <dd className="tnum">{age}</dd>
        <dt>місто</dt>
        <dd>
          {HQ.city} · {HQ.lat} {HQ.lon}
        </dd>
        <dt>жанр</dt>
        <dd>hip-hop</dd>
        <dt>альбом</dt>
        <dd>
          {album.title} · <span className="text-red">{(album.status ?? "").toLowerCase()}</span>
        </dd>
        <dt>статус</dt>
        <dd>під наглядом</dd>
        <dt>канали</dt>
        <dd className="-ml-2 flex flex-wrap">
          {channels.map((l) => (
            <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer" className="ctl">
              {l.name.toLowerCase()}
            </a>
          ))}
        </dd>
      </dl>
    </div>
  );
};

export default Subject;
