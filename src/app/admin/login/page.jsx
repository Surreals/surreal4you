import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, isAdminEmail, signIn } from "@/auth";

export const metadata = {
  title: "Login — Admin",
  robots: { index: false, follow: false },
};

const LoginPage = async () => {
  const session = await auth();
  if (isAdminEmail(session?.user?.email)) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center bg-white px-6 text-black">
      <div className="w-full max-w-sm border-[3px] border-black p-8">
        <div className="mb-2 text-[11px] tracking-[0.18em] opacity-60">Srrl</div>
        <h1 className="mb-6 text-2xl font-black uppercase tracking-tight">Admin</h1>
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
        >
          <button
            type="submit"
            className="w-full border-[3px] border-black bg-black px-4 py-3 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white hover:text-black"
          >
            Sign in with Google
          </button>
        </form>
        <p className="mt-4 text-[11px] leading-relaxed opacity-60">
          Access is limited to allowlisted accounts.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block text-[11px] font-extrabold uppercase tracking-[0.1em] underline underline-offset-4"
        >
          ← Back to site
        </Link>
      </div>
    </main>
  );
};

export default LoginPage;
