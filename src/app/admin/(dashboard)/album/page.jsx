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
      <h1 className="text-3xl font-black uppercase tracking-tight">Album announcement</h1>

      <form action={saveAlbum} className="space-y-3 border-[3px] border-black p-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="Title">
            <input name="title" defaultValue={album.title ?? ""} required className={inputClass} />
          </Field>
          <Field label="Status">
            <input name="status" defaultValue={album.status ?? ""} placeholder="OUT NOW" className={inputClass} />
          </Field>
          <Field label="Listen URL">
            <input name="listenUrl" defaultValue={album.listenUrl ?? ""} placeholder="https://open.spotify.com/…" className={inputClass} />
          </Field>
          <Field label="Cover path or URL">
            <input name="cover" defaultValue={album.cover ?? ""} placeholder="/hehemonia.png or https://…" className={inputClass} />
          </Field>
          <Field label="Or upload cover">
            <input type="file" name="coverFile" accept="image/*" className="w-full text-sm" />
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
