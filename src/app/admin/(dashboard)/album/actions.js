"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../_lib/guard";
import { getContent, saveContent } from "@/lib/content";

const str = (formData, key) => (formData.get(key) ?? "").toString().trim();

export async function saveAlbum(formData) {
  await requireAdmin();

  const content = await getContent();
  await saveContent({
    ...content,
    album: {
      ...content.album,
      title: str(formData, "title"),
      status: str(formData, "status"),
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/album");
  revalidatePath("/admin");
}
