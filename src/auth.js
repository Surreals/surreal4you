import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Comma-separated allowlist from env. Google auto-reads AUTH_GOOGLE_ID /
// AUTH_GOOGLE_SECRET; AUTH_SECRET signs the JWT session.
const adminEmails = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

/** True only for emails on the admin allowlist. */
export function isAdminEmail(email) {
  if (!email) return false;
  return adminEmails.includes(email.toLowerCase());
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Trust the host header (Vercel auto-trusts; also covers local production).
  trustHost: true,
  providers: [Google],
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  callbacks: {
    // Runs at sign-in: reject anyone not on the allowlist.
    signIn({ profile, user }) {
      return isAdminEmail(profile?.email ?? user?.email);
    },
    // Optimistic guard used by middleware. The login page is always reachable;
    // everything else under /admin requires an allowlisted session.
    authorized({ auth: session, request }) {
      if (request.nextUrl.pathname === "/admin/login") return true;
      return isAdminEmail(session?.user?.email);
    },
  },
});
