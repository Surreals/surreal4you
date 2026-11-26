import { redirect } from "next/navigation";
import { auth, isAdminEmail, signOut } from "@/auth";
import { getContent } from "@/lib/content";
import Nav from "../_components/Nav";
import SubmitButton from "../_components/SubmitButton";
import Pulse from "../_components/Pulse";

export const metadata = {
  title: "Admin — SRRLOVYCH",
  robots: { index: false, follow: false },
};

const DashboardLayout = async ({ children }) => {
  const session = await auth();
  const email = session?.user?.email;
  if (!isAdminEmail(email)) redirect("/adminka/login");
  const { texts } = await getContent();

  return (
    <>
      <header className="adm-head">
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="adm-brand">
            <a href="/" target="_blank" rel="noopener noreferrer" title="Open site in a new tab">
              SRRLOVYCH
            </a>
            admin
          </span>
          <Nav />
        </div>
        <Pulse lines={texts.log} />
        <div className="adm-user">
          <span>{email ?? ""}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/adminka/login" });
            }}
          >
            <SubmitButton variant="ghost" size="sm" pending="leaving…">
              sign out
            </SubmitButton>
          </form>
        </div>
      </header>
      <main className="adm-main">{children}</main>
    </>
  );
};

export default DashboardLayout;
