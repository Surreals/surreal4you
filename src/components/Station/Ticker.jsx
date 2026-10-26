// Caution-tape strip with a slow marquee under it. The track is rendered twice
// so the loop is seamless; the copy is only read once by assistive tech.
const Ticker = ({ items }) => {
  const line = items.join("   ··   ");
  return (
    <div className="ticker" role="marquee" aria-label={line}>
      <div className="tape h-2" aria-hidden="true" />
      <div className="ticker-track py-1.5 text-[12px] text-ink" aria-hidden="true">
        <span className="pr-12">{line}   ··   </span>
        <span className="pr-12">{line}   ··   </span>
      </div>
    </div>
  );
};

export default Ticker;
