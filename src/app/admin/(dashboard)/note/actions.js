"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../_lib/guard";
import { getContent, saveContent } from "@/lib/content";

const str = (formData, key) => (formData.get(key) ?? "").toString().trim();

export async function saveNote(formData) {
  await requireAdmin();

  const content = await getContent();
  const date = str(formData, "date") || new Date().toISOString().slice(0, 10);
  await saveContent({
    ...content,
    note: {
      title: str(formData, "title") || content.note.title,
      body: (formData.get("body") ?? "").toString().replace(/\r\n/g, "\n").trim(),
      date,
    },
  });

  revalidatePath("/");
  revalidatePath("/admin/note");
  revalidatePath("/admin");
}
