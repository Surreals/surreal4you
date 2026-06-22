"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../_lib/guard";
import { getContent, saveContent, uploadImage } from "@/lib/content";

const str = (formData, key) => (formData.get(key) ?? "").toString().trim();

export async function saveAlbum(formData) {
  await requireAdmin();

  let cover = str(formData, "cover");
  const uploaded = await uploadImage(formData.get("coverFile"));
  if (uploaded) cover = uploaded;

  const content = await getContent();
  await saveContent({
    ...content,
    album: {
      ...content.album,
      title: str(formData, "title"),
      status: str(formData, "status"),
      listenUrl: str(formData, "listenUrl"),
      cover,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/album");
  revalidatePath("/admin");
}
