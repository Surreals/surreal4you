// The station's event log, newest first. Real events and ambient lines share
// one list on purpose — the reader should not be sure which is which.
const Log = ({ entries }) => {
  return (
    <div className="p-4 sm:p-5">
      <ol className="log" aria-live="polite">
        {entries.map((e) => (
          <li key={e.id}>
            <time className="tnum">{e.t}</time>
            <span>{e.msg}</span>
          </li>
        ))}
      </ol>
    </div>
  );
};

export default Log;
