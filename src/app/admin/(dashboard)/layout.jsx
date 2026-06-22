import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, isAdminEmail, signOut } from "@/auth";

export const metadata = {
  title: "Admin — Srrl",
  robots: { index: false, follow: false },
};

const NAV = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/album", label: "Album" },
  { href: "/admin/links", label: "Links" },
];

const DashboardLayout = async ({ children }) => {
  const session = await auth();
  const email = session?.user?.email;
  if (!isAdminEmail(email)) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-white text-black">
      <header className="border-b-[3px] border-black">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3">
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-[11px] font-black uppercase tracking-[0.18em]">
              <a
                href="/"
                target="_blank"
                rel="noopener noreferrer"
                title="Open site in a new tab"
                className="hover:underline"
              >
                Srrl
              </a>{" "}
              · Admin
            </span>
            <nav className="flex flex-wrap gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-[12px] font-extrabold uppercase tracking-[0.08em] transition-colors hover:bg-black hover:text-white"
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[11px] opacity-60">{email ?? ""}</span>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/login" });
              }}
            >
              <button
                type="submit"
                className="border-2 border-black px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] transition-colors hover:bg-black hover:text-white"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-6 py-8">{children}</main>
    </div>
  );
};

export default DashboardLayout;
