import Link from "next/link";

const DockLink = ({ link }) => {
  const label = link.name.toLowerCase();
  if (link.internal || link.url?.startsWith("/")) {
    return (
      <Link href={link.url} className="ctl">
        {label}
      </Link>
    );
  }
  return (
    <a href={link.url} target="_blank" rel="noopener noreferrer" className="ctl">
      {label}
    </a>
  );
};

// The line under the block: every channel the artist is on. One scrollable
// row on mobile, sticky so the links stay within reach.
const Dock = ({ links, attribution }) => {
  return (
    <div className="dock">
      <nav aria-label="links" className="flex flex-wrap items-center gap-0">
        {[...links.main, ...links.side].map((l) => (
          <DockLink key={l.name} link={l} />
        ))}
      </nav>
      {attribution ? <span className="ml-auto hidden text-[11px] lg:flex">{attribution}</span> : null}
    </div>
  );
};

export default Dock;
