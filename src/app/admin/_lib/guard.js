import { auth, isAdminEmail } from "@/auth";

/**
 * Real authorization boundary for server actions. Middleware is only an
 * optimistic redirect, so every mutation must re-check the session here.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    throw new Error("Unauthorized");
  }
}
