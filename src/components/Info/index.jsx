import { calculateAge } from "../../utils/dateUtils";

const Info = () => {
  const birthDate = "2000-10-14"; // October 14, 2000
  const age = calculateAge(birthDate);

  return (
    <div className="w-full flex items-end justify-between">
      <p>HQ</p>
      <div className="text-left">
        <p>{age} y.o, Uzhhorod</p>
        <p>Hip-hop Artist</p>
      </div>
      <div className="text-left">
        <p>First album soon</p>
        <p>Subscribe for more</p>
      </div>
      <p><a target="_blank" href="https://www.bytcd.com/">(001</a>)</p>
    </div>
  );
};

export default Info;