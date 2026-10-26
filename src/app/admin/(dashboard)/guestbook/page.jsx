import { readGuestbook } from "@/lib/guestbook";
import { approveLine, hideLine, removeLine } from "./actions";

export const metadata = { robots: { index: false, follow: false } };

const btn =
  "border-2 border-black px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] transition-colors hover:bg-black hover:text-white";

const fmt = (iso) => {
  try {
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "short",
      timeStyle: "short",
      timeZone: "Europe/Kyiv",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
};

const Row = ({ e }) => (
  <div className="flex flex-wrap items-center justify-between gap-3 p-3">
    <div className="min-w-0 flex-1">
      <div className="font-mono text-sm">{e.msg}</div>
      <div className="mt-0.5 text-[11px] opacity-60">
        {fmt(e.at)} · visitor {e.who || "—"}
      </div>
    </div>
    <div className="flex gap-2">
      {e.status === "approved" ? (
        <form action={hideLine}>
          <input type="hidden" name="id" value={e.id} />
          <button type="submit" className={btn}>
            Hide
          </button>
        </form>
      ) : (
        <form action={approveLine}>
          <input type="hidden" name="id" value={e.id} />
          <button type="submit" className={`${btn} bg-black text-white hover:bg-white hover:text-black`}>
            Approve
          </button>
        </form>
      )}
      <form action={removeLine}>
        <input type="hidden" name="id" value={e.id} />
        <button type="submit" className={btn}>
          Delete
        </button>
      </form>
    </div>
  </div>
);

const Section = ({ title, items, empty }) => (
  <section>
    <h2 className="mb-3 text-[11px] font-extrabold uppercase tracking-[0.12em] opacity-60">
      {title} <span className="tabular-nums">({items.length})</span>
    </h2>
    {items.length ? (
      <div className="divide-y-2 divide-black border-[3px] border-black">
        {items.map((e) => (
          <Row key={e.id} e={e} />
        ))}
      </div>
    ) : (
      <p className="border-[3px] border-dashed border-black p-4 text-[11px] opacity-60">{empty}</p>
    )}
  </section>
);

const GuestbookPage = async () => {
  const { entries } = await readGuestbook();
  const pending = entries.filter((e) => e.status === "pending");
  const approved = entries.filter((e) => e.status === "approved");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tight">Guestbook</h1>
        <p className="mt-1 max-w-prose text-[11px] leading-relaxed opacity-60">
          Lines visitors type into the station log. Nothing shows publicly until you approve it. Approved
          lines drip into the log on the public site between the station&apos;s own entries.
        </p>
      </div>
      <Section title="Pending" items={pending} empty="Nothing waiting." />
      <Section title="Approved" items={approved} empty="No approved lines yet." />
    </div>
  );
};

export default GuestbookPage;
