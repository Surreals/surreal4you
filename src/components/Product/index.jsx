import Image from "next/image";

// Merch tile: an evidence plate with a price. `compact` drops the detail line
// for the station window; the /store page shows everything.
const Product = ({ product, index = 0, compact = false }) => {
  const { name, detail, price, image, buyUrl } = product;
  const tag = `mm-${String(index + 1).padStart(2, "0")}`;
  return (
    <div className="flex flex-col">
      <div className="plate aspect-square">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 50vw"
            className="object-cover"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center px-4 text-center text-dim">{name}</span>
        )}
        <span className="plate-tag">{tag}</span>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <span className="font-bold">{name}</span>
        <span className="font-display text-sm font-bold text-red">{price}</span>
      </div>
      {detail && !compact ? <p className="mt-1 text-[12px] text-dim">{detail}</p> : null}
      {buyUrl ? (
        <a
          href={buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`buy: ${name}`}
          className="ctl mt-3 min-h-11 justify-center border-ink"
        >
          buy
        </a>
      ) : (
        <span className="ctl mt-3 min-h-11 justify-center border-line text-dim">soon</span>
      )}
    </div>
  );
};

export default Product;
