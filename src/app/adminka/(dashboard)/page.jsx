import Link from "next/link";
import { getContent } from "@/lib/content";
import { readGuestbook } from "@/lib/guestbook";

const StatCard = ({ label, value, href }) => (
  <Link href={href} className="adm-stat">
    <div className="adm-label">{label}</div>
    <div className="adm-stat-value">{value}</div>
  </Link>
);

const Row = ({ label, children }) => (
  <div className="adm-row">
    <span className="text-dim">{label}</span>
    <span className="truncate font-bold">{children}</span>
  </div>
);

const AdminDashboard = async () => {
  const { products, album, links, settings, note } = await getContent();
  const { entries } = await readGuestbook();
  const pendingLines = entries.filter((e) => e.status === "pending").length;
  const linkCount = (links.main?.length ?? 0) + (links.side?.length ?? 0);
  const storeConfigured = process.env.BLOB_READ_WRITE_TOKEN ? "Vercel Blob" : "Local file (dev)";

  return (
    <div className="adm-page adm-stagger">
      <div>
        <h1 className="adm-title">Dashboard</h1>
        <p className="adm-lede">Manage what the public site shows.</p>
      </div>

      <div className="adm-stagger grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatCard
          label="merch"
          value={settings.showStore ? "published" : "hidden"}
          href="/adminka/products"
        />
        <StatCard label="products" value={products.length} href="/adminka/products" />
        <StatCard label="links" value={linkCount} href="/adminka/links" />
        <StatCard label="guestbook pending" value={pendingLines} href="/adminka/guestbook" />
        <StatCard label="note" value={note.date} href="/adminka/note" />
      </div>

      <section>
        <h2 className="adm-label">now showing</h2>
        <div className="adm-rows text-sm">
          <Row label="Album (info strip)">
            {album.title} — {album.status}
          </Row>
          <Row label="STORE link on landing">{settings.showStore ? "Visible" : "Hidden"}</Row>
          <Row label="Products in store">
            <span className="tabular-nums">{products.length}</span>
          </Row>
          <Row label="Content store">{storeConfigured}</Row>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
