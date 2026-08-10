import Image from "next/image";

const Product = ({ product, index = 0 }) => {
  const { name, detail, price, image, buyUrl } = product;
  const tag = `mm-${String(index + 1).padStart(2, "0")}`;
  const hasBuyUrl = Boolean(buyUrl);
  return (
    <div className="group flex flex-col">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden border border-line bg-moss">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover [filter:grayscale(0.35)_contrast(1.02)_brightness(0.98)] transition-[filter,transform] duration-500 group-hover:scale-[1.03] group-hover:[filter:none]"
          />
        ) : (
          <span className="px-4 text-center text-xs font-extrabold uppercase tracking-widest text-lichen">
            {name}
          </span>
        )}
        {/* detection tag */}
        <span className="absolute left-2 top-2 bg-leaf px-1.5 py-px font-mono text-[9px] uppercase tracking-widest text-bark">
          {tag}
        </span>
      </div>
      <div className="mt-3 flex items-baseline justify-between font-extrabold uppercase">
        <span>{name}</span>
        <span className="font-mono text-leaf">{price}</span>
      </div>
      {detail ? (
        <p className="mt-1 font-mono text-[11px] normal-case tracking-wide text-lichen">
          {detail}
        </p>
      ) : null}
      {hasBuyUrl ? (
        <a
          href={buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`buy ${name}`}
          className="mt-3 inline-flex min-h-11 items-center justify-center border border-line py-2 text-center font-mono text-xs uppercase tracking-[0.2em] text-bone transition-[color,background-color,border-color,transform] duration-200 ease-out hover:border-leaf hover:bg-leaf hover:text-bark active:scale-[0.96]"
        >
          buy
        </a>
      ) : (
        <span className="mt-3 inline-flex min-h-11 items-center justify-center border border-line py-2 text-center font-mono text-xs uppercase tracking-[0.2em] text-lichen">
          soon
        </span>
      )}
    </div>
  );
};

export default Product;
