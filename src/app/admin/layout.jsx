// Points /admin at its own web app manifest, so the panel installs as a
// separate "Srrlovych Admin" app next to the public site.
export const metadata = {
  manifest: "/admin.webmanifest",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/admin-apple-touch-icon.png", sizes: "180x180" }],
  },
  appleWebApp: { title: "Srrlovych Admin", statusBarStyle: "default" },
};

const AdminLayout = ({ children }) => children;

export default AdminLayout;
