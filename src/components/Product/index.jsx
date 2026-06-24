import Image from "next/image";

const Product = ({ product, index = 0 }) => {
  const { name, detail, price, image, buyUrl } = product;
  const tag = `mm-${String(index + 1).padStart(2, "0")}`;
  const hasBuyUrl = Boolean(buyUrl);
  return (
    <div className="group flex flex-col">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden border border-line bg-graphite">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover [filter:grayscale(0.4)_contrast(1.05)_brightness(0.92)] transition-[filter,transform] duration-500 group-hover:scale-[1.03] group-hover:[filter:none]"
          />
        ) : (
          <span className="px-4 text-center text-xs font-extrabold uppercase tracking-widest text-concrete">
            {name}
          </span>
        )}
        {/* detection tag */}
        <span className="absolute left-2 top-2 bg-signal px-1.5 py-px font-mono text-[9px] uppercase tracking-widest text-cold">
          {tag}
        </span>
      </div>
      <div className="mt-3 flex items-baseline justify-between font-extrabold uppercase">
        <span>{name}</span>
        <span className="font-mono text-xray">{price}</span>
      </div>
      {detail ? (
        <p className="mt-1 font-mono text-[11px] normal-case tracking-wide text-concrete">
          {detail}
        </p>
      ) : null}
      {hasBuyUrl ? (
        <a
          href={buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center justify-center border border-line py-2 text-center font-mono text-xs uppercase tracking-[0.2em] text-cold transition-colors hover:border-xray hover:bg-xray hover:text-asphalt"
        >
          buy
        </a>
      ) : (
        <span className="mt-3 inline-flex items-center justify-center border border-line py-2 text-center font-mono text-xs uppercase tracking-[0.2em] text-concrete">
          soon
        </span>
      )}
    </div>
  );
};

export default Product;
