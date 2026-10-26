import Link from "next/link";
import Product from "../../Product";

// cam-02: the catalog. While merch is unpublished the window keeps the secret
// — the same rule that strips /store from the landing page links.
const Merch = ({ products, showStore }) => {
  if (!showStore) {
    return (
      <div className="p-5">
        <p className="font-display text-2xl font-black leading-tight">merch is coming</p>
        <p className="mt-2 max-w-[40ch] text-dim">
          cam-02 is watching the warehouse. the first frame lands here as soon as something arrives.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-5">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {products.map((p, i) => (
          <Product key={p.id} product={p} index={i} compact />
        ))}
      </div>
      <p className="mt-4 text-dim">
        <Link href="/store" className="ctl -ml-2 border-line">
          full catalog
        </Link>
      </p>
    </div>
  );
};

export default Merch;
