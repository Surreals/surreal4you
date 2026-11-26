import { getContent } from "@/lib/content";
import { SPOTS, TEXTS } from "@/lib/feeds";
import { saveTexts } from "./actions";
import ActionForm from "../../_components/ActionForm";
import Field from "../../_components/Field";
import SubmitButton from "../../_components/SubmitButton";

export const metadata = { robots: { index: false, follow: false } };

const DOSSIER = [
  ["aka", "aka"],
  ["genre", "genre"],
  ["status", "status"],
  ["lastSeen", "last seen"],
];

// One input per line of text. The placeholder is the seed: clear the field
// and save, and the station goes back to it.
const Line = ({ name, label, value, seed }) => (
  <Field label={label}>
    <input name={name} defaultValue={value} placeholder={seed} maxLength={120} className="adm-input" />
  </Field>
);

const TextsPage = async () => {
  const { texts } = await getContent();
  const spots = SPOTS.filter((s) => s.id in TEXTS.spots);

  return (
    <div className="adm-page adm-stagger">
      <div>
        <h1 className="adm-title">Texts</h1>
        <p className="adm-lede">
          The words on the block: the dossier under the lamp, the mast&apos;s map, the captions on the
          hover cards and the lines the log writes by itself. Clear a field and save to get the original
          line back.
        </p>
      </div>

      <ActionForm action={saveTexts} success="texts saved" className="space-y-6">
        <section className="adm-card space-y-4">
          <h2 className="adm-label">
            lamp · subject <span className="text-ink">(dossier, also <code>whois srrl</code> in the terminal)</span>
          </h2>
          <div className="grid gap-3 md:grid-cols-2">
            {DOSSIER.map(([k, label]) => (
              <Line key={k} name={`dossier.${k}`} label={label} value={texts.dossier[k]} seed={TEXTS.dossier[k]} />
            ))}
          </div>
        </section>

        <section className="adm-card space-y-4">
          <h2 className="adm-label">mast · map</h2>
          <div className="grid gap-3 md:grid-cols-2">
            <Line name="map.region" label="region (after the city)" value={texts.map.region} seed={TEXTS.map.region} />
            <Line name="map.state" label="state (the red line)" value={texts.map.state} seed={TEXTS.map.state} />
          </div>
        </section>

        <section className="adm-card space-y-4">
          <h2 className="adm-label">
            hover-card captions <span className="text-ink">(music and note show the album and note titles)</span>
          </h2>
          <div className="grid gap-3 md:grid-cols-3">
            {spots.map((s) => (
              <Line
                key={s.id}
                name={`spots.${s.id}`}
                label={`${s.place} · key ${s.key}`}
                value={texts.spots[s.id]}
                seed={TEXTS.spots[s.id]}
              />
            ))}
          </div>
        </section>

        <section className="adm-card space-y-4">
          <Field label={`log · ${texts.log.length} lines, one per line; the station picks one every 18–35 s`}>
            <textarea name="log" defaultValue={texts.log.join("\n")} rows={14} className="adm-textarea" />
          </Field>
        </section>

        <SubmitButton>save texts</SubmitButton>
      </ActionForm>
    </div>
  );
};

export default TextsPage;
