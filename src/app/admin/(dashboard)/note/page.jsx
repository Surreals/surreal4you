import { getContent } from "@/lib/content";
import { saveNote } from "./actions";

export const metadata = { robots: { index: false, follow: false } };

const inputClass = "w-full border-2 border-black bg-white px-2 py-1.5 text-sm";
const labelClass = "block text-[11px] font-extrabold uppercase tracking-[0.08em] opacity-60";

const Field = ({ label, children }) => (
  <label className="block space-y-1">
    <span className={labelClass}>{label}</span>
    {children}
  </label>
);

const NotePage = async () => {
  const { note } = await getContent();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black uppercase tracking-tight">Note</h1>
      <p className="max-w-prose text-[11px] leading-relaxed opacity-60">
        The artist&apos;s note: a folder on the day desk and the <span className="font-mono">note</span> window
        on the station (key <span className="font-mono">n</span>). Plain text; a blank line starts a new
        paragraph. The site shows it lowercase.
      </p>

      <form action={saveNote} className="space-y-3 border-[3px] border-black p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Title (folder name)">
            <input name="title" defaultValue={note.title ?? ""} required className={inputClass} />
          </Field>
          <Field label="Date">
            <input name="date" type="date" defaultValue={note.date ?? ""} className={inputClass} />
          </Field>
        </div>
        <Field label="Text">
          <textarea
            name="body"
            defaultValue={note.body ?? ""}
            rows={10}
            className={`${inputClass} font-mono`}
            placeholder="what the station should say"
          />
        </Field>
        <button
          type="submit"
          className="border-[3px] border-black bg-black px-4 py-2 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white hover:text-black"
        >
          Save note
        </button>
      </form>
    </div>
  );
};

export default NotePage;
