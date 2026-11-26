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
  const { products, album, links, settings, note, texts } = await getContent();
  const { entries } = await readGuestbook();
  const pending = entries.filter((e) => e.status === "pending");
  const pendingLines = pending.length;
  const linkCount = (links.main?.length ?? 0) + (links.side?.length ?? 0);
  const storeConfigured = process.env.BLOB_READ_WRITE_TOKEN ? "Vercel Blob" : "Local file (dev)";

  return (
    <div className="adm-page adm-stagger">
      <div>
        <h1 className="adm-title">Dashboard</h1>
        <p className="adm-lede">What the block shows right now. Every card opens its section.</p>
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
        <StatCard label="log lines" value={texts.log.length} href="/adminka/texts" />
      </div>

      {pendingLines ? (
        <section>
          <h2 className="adm-label">
            waiting in the guestbook ·{" "}
            <Link href="/adminka/guestbook" className="adm-link">
              review all
            </Link>
          </h2>
          <div className="adm-rows text-sm">
            {pending.slice(0, 3).map((e) => (
              <div key={e.id} className="adm-row">
                <span className="truncate">{e.msg}</span>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section>
        <h2 className="adm-label">now showing</h2>
        <div className="adm-rows text-sm">
          <Row label="Album over the block">
            {album.title} — {(album.status ?? "").toLowerCase()} · listen
          </Row>
          <Row label="Dossier status">{texts.dossier.status}</Row>
          <Row label="Map state">{texts.map.state}</Row>
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
