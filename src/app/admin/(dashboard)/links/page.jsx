import { getContent } from "@/lib/content";
import { saveLinks } from "./actions";

export const metadata = { robots: { index: false, follow: false } };

const toLines = (arr) => (arr ?? []).map((l) => `${l.name} | ${l.url}`).join("\n");

const textareaClass = "w-full border-2 border-black bg-white px-2 py-2 text-sm font-mono min-h-40";
const labelClass = "block text-[11px] font-extrabold uppercase tracking-[0.08em] opacity-60";

const LinksPage = async () => {
  const { links } = await getContent();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black uppercase tracking-tight">Links</h1>
      <p className="text-[11px] opacity-60">
        One link per line: <span className="font-mono">NAME | URL</span>. A URL starting with{" "}
        <span className="font-mono">/</span> (e.g. <span className="font-mono">/store</span>) is an
        internal link; everything else opens in a new tab.
      </p>

      <form action={saveLinks} className="space-y-4 border-[3px] border-black p-4">
        <label className="block space-y-1">
          <span className={labelClass}>Main column (left)</span>
          <textarea name="main" defaultValue={toLines(links.main)} className={textareaClass} />
        </label>
        <label className="block space-y-1">
          <span className={labelClass}>Side column (right)</span>
          <textarea name="side" defaultValue={toLines(links.side)} className={textareaClass} />
        </label>
        <button
          type="submit"
          className="border-[3px] border-black bg-black px-4 py-2 text-sm font-extrabold uppercase tracking-[0.1em] text-white transition-colors hover:bg-white hover:text-black"
        >
          Save links
        </button>
      </form>
    </div>
  );
};

export default LinksPage;
