import { calculateAge } from "../../utils/dateUtils";
import { album as defaultAlbum } from "../../utils/constants";

const Info = ({ album = defaultAlbum }) => {
  const birthDate = "2000-10-14"; // October 14, 2000
  const age = calculateAge(birthDate);

  return (
    <div className="w-full flex items-end justify-between">
      <p>HQ</p>
      <div className="text-left">
        <p>{age} y.o, uzhhorod</p>
        <p>hip-hop artist</p>
      </div>
      <div className="text-left">
        <p>{album.title} — {album.status.toLowerCase()}</p>
        <p>soon xxx more</p>
      </div>
      <p><a target="_blank" rel="noopener" href="https://www.bytcd.com/">(001</a>)</p>
    </div>
  );
};

export default Info;
