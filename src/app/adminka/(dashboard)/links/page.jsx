import { getContent } from "@/lib/content";
import { saveLinks } from "./actions";
import ActionForm from "../../_components/ActionForm";
import Field from "../../_components/Field";
import SubmitButton from "../../_components/SubmitButton";

export const metadata = { robots: { index: false, follow: false } };

const toLines = (arr) => (arr ?? []).map((l) => `${l.name} | ${l.url}`).join("\n");

const LinksPage = async () => {
  const { links } = await getContent();

  return (
    <div className="adm-page adm-stagger">
      <div>
        <h1 className="adm-title">Links</h1>
        <p className="adm-lede">
          One link per line: <code>NAME | URL</code>. A URL starting with <code>/</code> (e.g.{" "}
          <code>/store</code>) is an internal link; everything else opens in a new tab.
        </p>
      </div>

      <ActionForm action={saveLinks} success="links saved" className="adm-card space-y-4">
        <Field label="main column (left)">
          <textarea name="main" defaultValue={toLines(links.main)} className="adm-textarea" />
        </Field>
        <Field label="side column (right)">
          <textarea name="side" defaultValue={toLines(links.side)} className="adm-textarea" />
        </Field>
        <SubmitButton>save links</SubmitButton>
      </ActionForm>
    </div>
  );
};

export default LinksPage;
