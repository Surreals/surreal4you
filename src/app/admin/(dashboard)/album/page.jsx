import { getContent } from "@/lib/content";
import { saveAlbum } from "./actions";

export const metadata = { robots: { index: false, follow: false } };

const inputClass = "w-full border-2 border-black bg-white px-2 py-1.5 text-sm";
const labelClass = "block text-[11px] font-extrabold uppercase tracking-[0.08em] opacity-60";

const Field = ({ label, children }) => (
  <label className="block space-y-1">
    <span className={labelClass}>{label}</span>
    {children}
  </label>
);

const AlbumPage = async () => {
  const { album } = await getContent();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black uppercase tracking-tight">Album</h1>
      <p className="max-w-prose text-[11px] leading-relaxed opacity-60">
        The landing page no longer carries an album announcement block. These two values feed the
        mono info strip at the bottom of the landing page, which reads{" "}
        <span className="font-mono">
          {album.title} — {(album.status ?? "").toLowerCase()}
        </span>
        .
      </p>

      <form action={saveAlbum} className="space-y-3 border-[3px] border-black p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Title">
            <input name="title" defaultValue={album.title ?? ""} required className={inputClass} />
          </Field>
          <Field label="Status">
            <input name="status" defaultValue={album.status ?? ""} placeholder="OUT NOW" className={inputClass} />
          </Field>
        </div>
        <button
          type="submit"
          className="border-[3px] border-black bg-black px-4 py-2 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white hover:text-black"
        >
          Save album
        </button>
      </form>
    </div>
  );
};

export default AlbumPage;
