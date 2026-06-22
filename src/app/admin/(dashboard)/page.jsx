import Link from "next/link";
import { getContent } from "@/lib/content";

const StatCard = ({ label, value, href }) => (
  <Link
    href={href}
    className="block border-[3px] border-black p-4 transition-colors hover:bg-black hover:text-white"
  >
    <div className="text-[11px] font-extrabold uppercase tracking-[0.1em] opacity-60">{label}</div>
    <div className="mt-1 truncate text-4xl font-black tracking-tight">{value}</div>
  </Link>
);

const AdminDashboard = async () => {
  const { products, album, links } = await getContent();
  const linkCount = (links.main?.length ?? 0) + (links.side?.length ?? 0);
  const storeConfigured = process.env.BLOB_READ_WRITE_TOKEN ? "Vercel Blob" : "Local file (dev)";

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-1 text-3xl font-black uppercase tracking-tight">Dashboard</h1>
        <p className="text-[11px] opacity-60">Manage what the public site shows.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        <StatCard label="Products" value={products.length} href="/admin/products" />
        <StatCard label="Album status" value={album.status || "—"} href="/admin/album" />
        <StatCard label="Links" value={linkCount} href="/admin/links" />
      </div>

      <section>
        <h2 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.12em] opacity-60">
          Now showing
        </h2>
        <div className="divide-y-2 divide-black border-[3px] border-black text-sm">
          <div className="flex justify-between gap-4 p-3">
            <span>Album</span>
            <span className="truncate font-black">{album.title} — {album.status}</span>
          </div>
          <div className="flex justify-between gap-4 p-3">
            <span>Products in store</span>
            <span className="font-black tabular-nums">{products.length}</span>
          </div>
          <div className="flex justify-between gap-4 p-3">
            <span>Content store</span>
            <span className="font-black">{storeConfigured}</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
