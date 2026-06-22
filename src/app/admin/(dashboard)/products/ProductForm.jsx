import { saveProduct } from "./actions";

const inputClass = "w-full border-2 border-black bg-white px-2 py-1.5 text-sm";
const labelClass = "block text-[11px] font-extrabold uppercase tracking-[0.08em] opacity-60";

const Field = ({ label, children }) => (
  <label className="block space-y-1">
    <span className={labelClass}>{label}</span>
    {children}
  </label>
);

const ProductForm = ({ product }) => {
  const editing = Boolean(product);

  return (
    <form action={saveProduct} className="space-y-3 border-[3px] border-black p-4">
      {editing ? <input type="hidden" name="id" value={product.id} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="Name">
          <input name="name" defaultValue={product?.name ?? ""} required className={inputClass} />
        </Field>
        <Field label="Price">
          <input name="price" defaultValue={product?.price ?? ""} placeholder="₴900" className={inputClass} />
        </Field>
        <Field label="Detail">
          <input name="detail" defaultValue={product?.detail ?? ""} className={inputClass} />
        </Field>
        <Field label="Buy URL">
          <input name="buyUrl" defaultValue={product?.buyUrl ?? ""} placeholder="https://t.me/..." className={inputClass} />
        </Field>
        <Field label="Image path or URL">
          <input name="image" defaultValue={product?.image ?? ""} placeholder="/dil.png or https://…" className={inputClass} />
        </Field>
        <Field label="Or upload image">
          <input type="file" name="imageFile" accept="image/*" className="w-full text-sm" />
        </Field>
      </div>
      <button
        type="submit"
        className="border-[3px] border-black bg-black px-4 py-2 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white hover:text-black"
      >
        {editing ? "Save changes" : "Add product"}
      </button>
    </form>
  );
};

export default ProductForm;
