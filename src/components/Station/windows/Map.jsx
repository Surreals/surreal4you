import { HQ } from "../../../lib/feeds";

// Where the station is. A radar rather than a map: the point is the sweep.
const Map = ({ clock }) => {
  return (
    <div className="grid gap-5 p-4 sm:grid-cols-[200px_1fr] sm:p-5">
      <div className="radar" aria-hidden="true">
        <span className="radar-sweep" />
        <span className="radar-dot" />
      </div>
      <dl className="dossier content-start">
        <dt>place</dt>
        <dd>{HQ.city}, zakarpattia</dd>
        <dt>coordinates</dt>
        <dd>
          {HQ.lat} {HQ.lon}
        </dd>
        <dt>time</dt>
        <dd className="tnum">{clock.time}</dd>
        <dt>date</dt>
        <dd className="tnum">{clock.date}</dd>
        <dt>zone</dt>
        <dd>{HQ.tz}</dd>
        <dt>state</dt>
        <dd className="text-red">subject within range</dd>
      </dl>
    </div>
  );
};

export default Map;
