import { setStoreVisibility } from "./actions";

/**
 * Master switch for the merch section. While it is off the STORE link is gone
 * from the landing page and /store is kept out of the sitemap and search —
 * but the page still opens by direct URL so the catalog can be previewed.
 */
const StoreVisibility = ({ visible }) => (
  <section className="border-[3px] border-black p-4">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="text-[11px] font-extrabold uppercase tracking-[0.12em] opacity-60">
          Merch on the site
        </h2>
        <p className="mt-1 text-2xl font-black uppercase tracking-tight">
          {visible ? "Published" : "Hidden"}
        </p>
        <p className="mt-1 max-w-prose text-[11px] leading-relaxed opacity-60">
          {visible
            ? "The STORE link is on the landing page and /store is in the sitemap."
            : "The STORE link is hidden and /store is out of the sitemap and search. You can still open /store directly to preview it."}
        </p>
      </div>
      <form action={setStoreVisibility}>
        <input type="hidden" name="showStore" value={visible ? "false" : "true"} />
        <button
          type="submit"
          className="border-[3px] border-black bg-black px-4 py-2 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white hover:text-black"
        >
          {visible ? "Hide merch" : "Publish merch"}
        </button>
      </form>
    </div>
    <p className="mt-4 text-[11px] leading-relaxed opacity-60">
      The link itself lives in{" "}
      <a href="/admin/links" className="underline decoration-2 underline-offset-4">
        Links
      </a>
      . Any link pointing at <span className="font-mono">/store</span> is hidden while merch is
      unpublished.
    </p>
  </section>
);

export default StoreVisibility;
