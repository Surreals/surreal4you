"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../_lib/guard";
import { getContent, saveContent } from "@/lib/content";

// One link per line: "NAME | URL". A URL starting with "/" is treated as an
// internal (in-app) link; everything else opens in a new tab.
function parseLinks(text) {
  return (text ?? "")
    .toString()
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, url] = line.split("|").map((s) => (s ?? "").trim());
      const link = { name, url };
      if (url?.startsWith("/")) link.internal = true;
      return link;
    })
    .filter((l) => l.name && l.url);
}

export async function saveLinks(formData) {
  await requireAdmin();

  const main = parseLinks(formData.get("main"));
  const side = parseLinks(formData.get("side"));

  const content = await getContent();
  await saveContent({ ...content, links: { main, side } });

  revalidatePath("/");
  revalidatePath("/admin/links");
  revalidatePath("/admin");
}
