"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "../../_lib/guard";
import { deleteGuestLine, setGuestStatus } from "@/lib/guestbook";

const field = (formData, key) => (formData.get(key) ?? "").toString();

const done = () => {
  revalidatePath("/admin/guestbook");
  revalidatePath("/admin");
};

export async function approveLine(formData) {
  await requireAdmin();
  await setGuestStatus(field(formData, "who"), field(formData, "id"), "approved");
  done();
}

export async function hideLine(formData) {
  await requireAdmin();
  await setGuestStatus(field(formData, "who"), field(formData, "id"), "pending");
  done();
}

export async function removeLine(formData) {
  await requireAdmin();
  await deleteGuestLine(field(formData, "who"), field(formData, "id"));
  done();
}
