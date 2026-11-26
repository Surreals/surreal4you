import { Toaster } from "sonner";
import "./admin.css";

// Points /adminka at its own web app manifest, so the panel installs as a
// separate "SRRLOVYCH Admin" app next to the public site.
export const metadata = {
  manifest: "/admin.webmanifest",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/icons/admin-apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: { title: "SRRLOVYCH Admin", statusBarStyle: "default" },
};

// Every admin style lives under .adm (admin.css). The toaster sits inside it
// so toasts pick up the same tokens.
const AdminLayout = ({ children }) => (
  <div className="adm">
    {children}
    <Toaster
      position="bottom-right"
      toastOptions={{
        unstyled: true,
        classNames: { toast: "adm-toast", error: "adm-toast-error" },
      }}
    />
  </div>
);

export default AdminLayout;
