import Image from "next/image";

const Product = ({ product }) => {
  const { name, detail, price, image, buyUrl } = product;
  return (
    <div className="flex flex-col">
      <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-neutral-100">
        {image ? (
          <Image
            src={image}
            alt={name}
            fill
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
            className="object-cover transition-transform duration-300 hover:scale-[1.03]"
          />
        ) : (
          <span className="px-4 text-center text-xs font-bold uppercase tracking-widest opacity-40">
            {name}
          </span>
        )}
      </div>
      <div className="mt-3 flex items-baseline justify-between font-bold uppercase">
        <span>{name}</span>
        <span>{price}</span>
      </div>
      {detail ? (
        <p className="text-sm opacity-60 normal-case">{detail}</p>
      ) : null}
      {buyUrl ? (
        <a
          href={buyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 border border-black py-2 text-center text-sm font-bold uppercase tracking-widest transition-colors hover:bg-black hover:text-white"
        >
          Buy
        </a>
      ) : null}
    </div>
  );
};

export default Product;
