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
        <dt>місце</dt>
        <dd>{HQ.city}, закарпаття</dd>
        <dt>координати</dt>
        <dd>
          {HQ.lat} {HQ.lon}
        </dd>
        <dt>час</dt>
        <dd className="tnum">{clock.time}</dd>
        <dt>дата</dt>
        <dd className="tnum">{clock.date}</dd>
        <dt>зона</dt>
        <dd>{HQ.tz}</dd>
        <dt>стан</dt>
        <dd className="text-red">суб’єкт у радіусі</dd>
      </dl>
    </div>
  );
};

export default Map;
