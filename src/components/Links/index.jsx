import Link from "next/link";
import { mainLinks, sideLinks } from "../../utils/constants";

const buildLink = ({ name, url, internal }) => {
  if (internal || url?.startsWith("/")) {
    return (
      <Link key={name} href={url} className="w-auto hover:underline">
        {name}
      </Link>
    );
  }
  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      key={name}
      href={url}
      className="w-auto hover:underline"
    >
      {name}
    </a>
  );
};

const Links = ({ links }) => {
  const main = links?.main ?? mainLinks;
  const side = links?.side ?? sideLinks;
  return (
    <div className="flex md:text-2xl text-3xl justify-between font-bold">
      <div className="flex flex-col text-left">{main.map((lnk) => buildLink(lnk))}</div>
      <div className="flex flex-col text-right">{side.map((lnk) => buildLink(lnk))}</div>
    </div>
  );
};

export default Links;
