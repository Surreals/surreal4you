import { calculateAge } from "../../utils/dateUtils";
import { album as defaultAlbum } from "../../utils/constants";
import HqMarker from "../HqMarker";

const Info = ({ album = defaultAlbum }) => {
  const birthDate = "2000-10-14"; // October 14, 2000
  const age = calculateAge(birthDate);

  return (
    <div className="grid w-full grid-cols-2 items-end gap-x-4 gap-y-4 font-mono text-[10px] tracking-[0.14em] text-concrete sm:text-[11px] md:flex md:justify-between md:gap-3">
      <HqMarker />
      <div className="justify-self-end text-right text-cold/80 md:justify-self-auto md:text-left">
        <p>{age} · uzh</p>
        <p>hip-hop</p>
      </div>
      <div className="text-left text-cold/80">
        <p>
          {album.title} — {album.status.toLowerCase()}
        </p>
        <p>soon xxx more</p>
      </div>
      <p className="justify-self-end text-right">
        <a
          target="_blank"
          rel="noopener"
          href="https://www.bytcd.com/"
          className="underline underline-offset-2 transition-colors hover:text-xray"
        >
          bytcd
        </a>
      </p>
    </div>
  );
};

export default Info;
