import { getContent } from "@/lib/content";
import { saveNote } from "./actions";
import ActionForm from "../../_components/ActionForm";
import Field from "../../_components/Field";
import SubmitButton from "../../_components/SubmitButton";

export const metadata = { robots: { index: false, follow: false } };

const NotePage = async () => {
  const { note } = await getContent();

  return (
    <div className="adm-page adm-stagger">
      <div>
        <h1 className="adm-title">Note</h1>
        <p className="adm-lede">
          The artist&apos;s note: the <code>note</code> window on the station (key <code>n</code>). Plain
          text; a blank line starts a new paragraph. The site shows it lowercase.
        </p>
      </div>

      <ActionForm action={saveNote} success="note saved" className="adm-card space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <Field label="title (file name)">
            <input name="title" defaultValue={note.title ?? ""} required className="adm-input" />
          </Field>
          <Field label="date">
            <input name="date" type="date" defaultValue={note.date ?? ""} className="adm-input" />
          </Field>
        </div>
        <Field label="text">
          <textarea
            name="body"
            defaultValue={note.body ?? ""}
            rows={10}
            className="adm-textarea"
            placeholder="what the station should say"
          />
        </Field>
        <SubmitButton>save note</SubmitButton>
      </ActionForm>
    </div>
  );
};

export default NotePage;
