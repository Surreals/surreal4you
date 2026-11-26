import { getContent } from "@/lib/content";
import { saveAlbum } from "./actions";
import ActionForm from "../../_components/ActionForm";
import Field from "../../_components/Field";
import SubmitButton from "../../_components/SubmitButton";

export const metadata = { robots: { index: false, follow: false } };

const AlbumPage = async () => {
  const { album } = await getContent();

  return (
    <div className="adm-page adm-stagger">
      <div>
        <h1 className="adm-title">Album</h1>
        <p className="adm-lede">
          The title sits large over the block, on the music camera and in the dossier. The status goes
          on the listen button, lowercase: <code>{(album.status ?? "").toLowerCase()} · listen</code>.
        </p>
      </div>

      <ActionForm action={saveAlbum} success="album saved" className="adm-card space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="title">
            <input name="title" defaultValue={album.title ?? ""} required className="adm-input" />
          </Field>
          <Field label="status">
            <input name="status" defaultValue={album.status ?? ""} placeholder="OUT NOW" className="adm-input" />
          </Field>
        </div>
        <SubmitButton>save album</SubmitButton>
      </ActionForm>
    </div>
  );
};

export default AlbumPage;
