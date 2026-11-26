"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../_lib/guard";
import { getContent, saveContent } from "@/lib/content";
import { TEXTS } from "@/lib/feeds";

const str = (formData, key) => (formData.get(key) ?? "").toString().trim();

// Field names are "group.key". Blanks go through as "" and saveContent puts
// the seed value back, so clearing a field restores the original line.
const group = (formData, name) =>
  Object.fromEntries(Object.keys(TEXTS[name]).map((k) => [k, str(formData, `${name}.${k}`)]));

export async function saveTexts(formData) {
  await requireAdmin();

  const content = await getContent();
  await saveContent({
    ...content,
    texts: {
      dossier: group(formData, "dossier"),
      map: group(formData, "map"),
      spots: group(formData, "spots"),
      log: (formData.get("log") ?? "").toString().split(/\r?\n/),
    },
  });

  revalidatePath("/");
  revalidatePath("/adminka/texts");
  revalidatePath("/adminka");
}
