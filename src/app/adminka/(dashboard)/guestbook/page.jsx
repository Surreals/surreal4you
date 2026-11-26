import { readGuestbook } from "@/lib/guestbook";
import { approveLine, hideLine, removeLine } from "./actions";
import ActionForm from "../../_components/ActionForm";
import SubmitButton from "../../_components/SubmitButton";

export const metadata = { robots: { index: false, follow: false } };

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

// One line, one action: approve/hide or delete. Hidden fields carry who + id.
const LineAction = ({ e, action, success, children, pending, variant = "ghost" }) => (
  <ActionForm action={action} success={success}>
    <input type="hidden" name="id" value={e.id} />
    <input type="hidden" name="who" value={e.who} />
    <SubmitButton variant={variant} size="sm" pending={pending}>
      {children}
    </SubmitButton>
  </ActionForm>
);

const Row = ({ e }) => (
  <div className="adm-row">
    <div className="min-w-0 flex-1">
      <div className="text-sm">{e.msg}</div>
      <div className="mt-0.5 text-[11px] text-dim">
        {fmt(e.at)} · visitor {e.who || "—"}
      </div>
    </div>
    <div className="flex gap-2">
      {e.status === "approved" ? (
        <LineAction e={e} action={hideLine} success="line hidden" pending="hiding…">
          hide
        </LineAction>
      ) : (
        <LineAction e={e} action={approveLine} success="line approved" pending="approving…" variant="primary">
          approve
        </LineAction>
      )}
      <LineAction e={e} action={removeLine} success="line deleted" pending="deleting…" variant="danger">
        delete
      </LineAction>
    </div>
  </div>
);

const Section = ({ title, items, empty, loud }) => (
  <section>
    <h2 className="adm-label">
      {title} <span className="adm-badge" data-on={(loud && items.length > 0) || undefined}>{items.length}</span>
    </h2>
    {items.length ? (
      <div className="adm-rows">
        {items.map((e) => (
          <Row key={e.id} e={e} />
        ))}
      </div>
    ) : (
      <p className="adm-empty">{empty}</p>
    )}
  </section>
);

const GuestbookPage = async () => {
  const { entries } = await readGuestbook();
  const pending = entries.filter((e) => e.status === "pending");
  const approved = entries.filter((e) => e.status === "approved");

  return (
    <div className="adm-page adm-stagger">
      <div>
        <h1 className="adm-title">Guestbook</h1>
        <p className="adm-lede">
          Lines visitors type into the station log. Nothing shows publicly until you approve it. Approved
          lines drip into the log on the public site between the station&apos;s own entries.
        </p>
      </div>
      <Section title="pending" items={pending} loud empty="Nothing waiting." />
      <Section title="approved" items={approved} empty="No approved lines yet." />
    </div>
  );
};

export default GuestbookPage;
