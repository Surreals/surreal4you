"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../_lib/guard";
import { getContent, saveContent, uploadImage } from "@/lib/content";

const str = (formData, key) => (formData.get(key) ?? "").toString().trim();

function slugify(s) {
  return (s || "")
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function refresh() {
  revalidatePath("/store");
  revalidatePath("/admin/products");
  revalidatePath("/admin");
}

export async function saveProduct(formData) {
  await requireAdmin();

  const name = str(formData, "name");
  if (!name) throw new Error("Name is required");

  const id = str(formData, "id");
  let image = str(formData, "image");
  const uploaded = await uploadImage(formData.get("imageFile"));
  if (uploaded) image = uploaded;

  const productId = id || slugify(name) || `p-${Date.now()}`;
  const product = {
    id: productId,
    name,
    detail: str(formData, "detail"),
    price: str(formData, "price"),
    buyUrl: str(formData, "buyUrl"),
    image,
  };

  const content = await getContent();
  const products = [...content.products];
  const idx = products.findIndex((p) => p.id === productId);
  if (idx >= 0) products[idx] = { ...products[idx], ...product };
  else products.push(product);

  await saveContent({ ...content, products });
  refresh();
}

export async function deleteProduct(formData) {
  await requireAdmin();
  const id = str(formData, "id");
  const content = await getContent();
  await saveContent({
    ...content,
    products: content.products.filter((p) => p.id !== id),
  });
  refresh();
}
