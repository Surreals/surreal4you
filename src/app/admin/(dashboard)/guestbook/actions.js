"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../_lib/guard";
import { deleteGuestLine, setGuestStatus } from "@/lib/guestbook";

const id = (formData) => (formData.get("id") ?? "").toString();

export async function approveLine(formData) {
  await requireAdmin();
  await setGuestStatus(id(formData), "approved");
  revalidatePath("/admin/guestbook");
  revalidatePath("/admin");
}

export async function hideLine(formData) {
  await requireAdmin();
  await setGuestStatus(id(formData), "pending");
  revalidatePath("/admin/guestbook");
  revalidatePath("/admin");
}

export async function removeLine(formData) {
  await requireAdmin();
  await deleteGuestLine(id(formData));
  revalidatePath("/admin/guestbook");
  revalidatePath("/admin");
}
