import { saveProduct } from "./actions";
import ActionForm from "../../_components/ActionForm";
import Field from "../../_components/Field";
import SubmitButton from "../../_components/SubmitButton";

const ProductForm = ({ product }) => {
  const editing = Boolean(product);

  return (
    <ActionForm
      action={saveProduct}
      success={editing ? "product saved" : "product added"}
      reset={!editing}
      className="adm-card space-y-4"
    >
      {editing ? <input type="hidden" name="id" value={product.id} /> : null}
      <div className="grid gap-3 md:grid-cols-2">
        <Field label="name">
          <input name="name" defaultValue={product?.name ?? ""} required className="adm-input" />
        </Field>
        <Field label="price">
          <input name="price" defaultValue={product?.price ?? ""} placeholder="₴900" className="adm-input" />
        </Field>
        <Field label="detail">
          <input name="detail" defaultValue={product?.detail ?? ""} className="adm-input" />
        </Field>
        <Field label="buy url">
          <input
            name="buyUrl"
            defaultValue={product?.buyUrl ?? ""}
            placeholder="https://your-store.myshopify.com/products/..."
            className="adm-input"
          />
        </Field>
        <Field label="image path or url">
          <input
            name="image"
            defaultValue={product?.image ?? ""}
            placeholder="/dil.png or https://…"
            className="adm-input"
          />
        </Field>
        <Field label="or upload image">
          <input type="file" name="imageFile" accept="image/*" className="adm-input" />
        </Field>
      </div>
      <SubmitButton pending={editing ? "saving…" : "adding…"}>
        {editing ? "save changes" : "add product"}
      </SubmitButton>
    </ActionForm>
  );
};

export default ProductForm;
