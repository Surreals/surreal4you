import { setStoreVisibility } from "./actions";
import ActionForm from "../../_components/ActionForm";
import SubmitButton from "../../_components/SubmitButton";

/**
 * Master switch for the merch section. While it is off the STORE link is gone
 * from the landing page and /store is kept out of the sitemap and search —
 * but the page still opens by direct URL so the catalog can be previewed.
 */
const StoreVisibility = ({ visible }) => (
  <section className="adm-card">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h2 className="adm-label">merch on the site</h2>
        <p className="adm-title adm-title-sm">{visible ? "published" : "hidden"}</p>
        <p className="adm-lede">
          {visible
            ? "The STORE link is on the landing page and /store is in the sitemap."
            : "The STORE link is hidden and /store is out of the sitemap and search. You can still open /store directly to preview it."}
        </p>
      </div>
      <ActionForm action={setStoreVisibility} success={visible ? "merch hidden" : "merch published"}>
        <input type="hidden" name="showStore" value={visible ? "false" : "true"} />
        <SubmitButton variant={visible ? "ghost" : "primary"} pending={visible ? "hiding…" : "publishing…"}>
          {visible ? "hide merch" : "publish merch"}
        </SubmitButton>
      </ActionForm>
    </div>
    <p className="adm-lede">
      The link itself lives in{" "}
      <a href="/adminka/links" className="adm-link">
        links
      </a>
      . Any link pointing at <code>/store</code> is hidden while merch is unpublished.
    </p>
  </section>
);

export default StoreVisibility;
