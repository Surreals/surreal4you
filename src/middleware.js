// Optimistic guard: redirects unauthenticated visitors away from /admin early
// using the `authorized` callback in auth.js. Real enforcement lives in the
// admin layout and in every server action (requireAdmin / await auth()).
export { auth as default } from "@/auth";

export const config = {
  matcher: ["/admin/:path*"],
};
