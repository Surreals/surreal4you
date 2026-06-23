import Link from "next/link";
import { mainLinks, sideLinks } from "../../utils/constants";
import ScrambleText from "../ScrambleText";

// Catalogued links — each tagged with a forensic two-digit index.
const buildLink = ({ name, url, internal }, index, align) => {
  const tag = (
    <span className="font-mono text-[10px] tracking-widest text-concrete transition-colors group-hover:text-signal">
      {String(index + 1).padStart(2, "0")}
    </span>
  );
  const label = <ScrambleText text={name} />;
  const inner =
    align === "right" ? (
      <>
        {label}
        {tag}
      </>
    ) : (
      <>
        {tag}
        {label}
      </>
    );

  const className =
    "group flex w-auto items-center gap-2 transition-colors hover:text-xray";

  if (internal || url?.startsWith("/")) {
    return (
      <Link key={name} href={url} className={className}>
        {inner}
      </Link>
    );
  }
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      key={name}
      href={url}
      className={className}
    >
      {inner}
    </a>
  );
};

const Links = ({ links }) => {
  const main = links?.main ?? mainLinks;
  const side = links?.side ?? sideLinks;
  return (
    <div className="flex justify-between gap-4 text-xl font-extrabold uppercase sm:text-2xl">
      <div className="flex flex-col items-start gap-1 text-left">
        {main.map((lnk, i) => buildLink(lnk, i, "left"))}
      </div>
      <div className="flex flex-col items-end gap-1 text-right">
        {side.map((lnk, i) => buildLink(lnk, i, "right"))}
      </div>
    </div>
  );
};

export default Links;
