import { getContent } from "@/lib/content";
import ProductForm from "./ProductForm";
import DeleteButton from "./DeleteButton";

export const metadata = { robots: { index: false, follow: false } };

const ProductsPage = async () => {
  const { products } = await getContent();

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-black uppercase tracking-tight">Products</h1>

      <section className="border-[3px] border-black p-4 text-sm leading-relaxed">
        <h2 className="mb-2 text-[11px] font-extrabold uppercase tracking-[0.12em] opacity-60">
          Spotify merch setup
        </h2>
        <p>
          Spotify reads merch from Shopify, not directly from this website. Create the products in
          Shopify, connect that store in Spotify for Artists, then paste each Shopify product URL
          into Buy URL here so the site and Spotify point to the same catalog.
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-[11px] font-extrabold uppercase tracking-[0.1em]">
          <a
            href="https://artists.spotify.com/merch"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-2 underline-offset-4"
          >
            Spotify merch
          </a>
          <a
            href="https://apps.shopify.com/spotify"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-2 underline-offset-4"
          >
            Shopify app
          </a>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.12em] opacity-60">
          Add product
        </h2>
        <ProductForm />
      </section>

      <section className="space-y-6">
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.12em] opacity-60">
          Existing ({products.length})
        </h2>
        {products.length === 0 ? (
          <p className="text-sm opacity-60">No products yet.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="space-y-2">
              <div className="flex items-center justify-between gap-4">
                <span className="font-black uppercase">{product.name}</span>
                <DeleteButton id={product.id} name={product.name} />
              </div>
              <ProductForm product={product} />
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default ProductsPage;
