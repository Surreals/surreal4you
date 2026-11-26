import Link from "next/link";
import { redirect } from "next/navigation";
import { auth, isAdminEmail, signIn } from "@/auth";
import SubmitButton from "../_components/SubmitButton";

export const metadata = {
  title: "Login — Admin",
  robots: { index: false, follow: false },
};

const LoginPage = async () => {
  const session = await auth();
  if (isAdminEmail(session?.user?.email)) redirect("/adminka");

  return (
    <main className="adm-login">
      <div className="adm-login-card adm-stagger">
        <div>
          <div className="adm-label">SRRLOVYCH</div>
          <h1 className="adm-title">admin</h1>
        </div>
        <form
          className="mt-6"
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/adminka" });
          }}
        >
          <SubmitButton block pending="opening google…">
            Sign in with Google
          </SubmitButton>
        </form>
        <p className="adm-lede">Access is limited to allowlisted accounts.</p>
        <Link href="/" className="adm-link mt-6 inline-block">
          ← back to site
        </Link>
      </div>
    </main>
  );
};

export default LoginPage;
