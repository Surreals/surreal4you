import { getContent } from "@/lib/content";
import ProductForm from "./ProductForm";
import DeleteButton from "./DeleteButton";
import StoreVisibility from "./StoreVisibility";

export const metadata = { robots: { index: false, follow: false } };

const ProductsPage = async () => {
  const { products, settings } = await getContent();

  return (
    <div className="adm-page adm-stagger">
      <div className="adm-page-head">
        <h1 className="adm-title">Merch</h1>
        <a href="/store" target="_blank" rel="noopener noreferrer" className="adm-link">
          preview /store ↗
        </a>
      </div>

      <StoreVisibility visible={settings.showStore} />

      <section className="adm-card text-sm">
        <h2 className="adm-label">spotify merch setup</h2>
        <p>
          Spotify reads merch from Shopify, not directly from this website. Create the products in
          Shopify, connect that store in Spotify for Artists, then paste each Shopify product URL
          into Buy URL here so the site and Spotify point to the same catalog.
        </p>
        <div className="mt-3 flex flex-wrap gap-4">
          <a
            href="https://artists.spotify.com/merch"
            target="_blank"
            rel="noopener noreferrer"
            className="adm-link"
          >
            spotify merch ↗
          </a>
          <a
            href="https://apps.shopify.com/spotify"
            target="_blank"
            rel="noopener noreferrer"
            className="adm-link"
          >
            shopify app ↗
          </a>
        </div>
      </section>

      <section>
        <h2 className="adm-label">add product</h2>
        <ProductForm />
      </section>

      <section>
        <h2 className="adm-label">
          existing <span className="adm-badge">{products.length}</span>
        </h2>
        {products.length === 0 ? (
          <p className="adm-empty">No products yet.</p>
        ) : (
          <div className="space-y-6">
            {products.map((product) => (
              <div key={product.id} className="space-y-2">
                <div className="flex items-center justify-between gap-4">
                  <span className="font-bold">{product.name}</span>
                  <DeleteButton id={product.id} name={product.name} />
                </div>
                <ProductForm product={product} />
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductsPage;
