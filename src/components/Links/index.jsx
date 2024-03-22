import { mainLinks, sideLinks } from "../../utils/constants";

const Links = () => {
  const buildLink = ({ name, url }) => {
    return (
      <a target="_blank" key={name} href={url} className="w-auto hover:underline">
        {name}
      </a>
    );
  };
  return (
    <div className="flex md:text-2xl text-3xl justify-between font-bold">
      <div className="flex flex-col text-left">{mainLinks.map((lnk) => buildLink(lnk))}</div>
      <div className="flex flex-col text-right">{sideLinks.map((lnk) => buildLink(lnk))}</div>
    </div>
  );
};

export default Links;
