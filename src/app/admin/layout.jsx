// Points /admin at its own web app manifest, so the panel installs as a
// separate "SRRLOVYCH Admin" app next to the public site.
export const metadata = {
  manifest: "/admin.webmanifest",
  icons: {
    icon: [{ url: "/icon.png", type: "image/png", sizes: "32x32" }],
    apple: [{ url: "/icons/admin-apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: { title: "SRRLOVYCH Admin", statusBarStyle: "default" },
};

const AdminLayout = ({ children }) => children;

export default AdminLayout;
