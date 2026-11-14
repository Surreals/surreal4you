import Image from "next/image";
import Link from "next/link";
import { FilmGrain } from "../../components";
import { PLATES } from "../../lib/feeds";

export const metadata = {
  title: "Visual System — SRRLOVYCH",
  description: "The SRRL station system: asphalt, concrete and one caution-tape red. The site is one watched block of Uzhhorod, and the artist is the one being watched.",
  alternates: { canonical: "/moodboard" },
  // Public (no auth) but kept out of search — it's a design reference.
  robots: { index: false, follow: false },
};

const PALETTE = [
  { name: "bg", night: "#0c0c0e", day: "#e6e4df", role: "background · asphalt / concrete" },
  { name: "panel", night: "#141417", day: "#f6f5f2", role: "windows, dock" },
  { name: "panel-2", night: "#1c1c20", day: "#ffffff", role: "rows, raised surfaces" },
  { name: "ink", night: "#f3f1ec", day: "#121214", role: "text" },
  { name: "dim", night: "#8e8d93", day: "#67666c", role: "secondary text" },
  { name: "red", night: "#d9291f", day: "#d9291f", role: "accent · tape, rec, prices" },
];

const RULES = [
  "one accent — red. no green.",
  "tape only as a strip: above the status line, on the focused window bar.",
  "no radius. 1px lines, 2px window frames.",
  "plates desaturate at night; full colour on hover. the block itself is never filtered.",
  "inter tight 900 — the name and big words. jetbrains mono — everything else, lowercase.",
  "motion only answers an action, except one boot.",
];

const Section = ({ title, children }) => (
  <section className="border-b border-line py-10 md:py-14">
    <h2 className="mb-6 font-display text-xl font-bold md:text-2xl">{title}</h2>
    {children}
  </section>
);

const Moodboard = () => {
  return (
    <main className="min-h-[100dvh]">
      <header className="status">
        <Link href="/" className="ctl -ml-2">
          ← the block
        </Link>
        <span className="ml-auto text-ink">visual system</span>
      </header>

      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <div className="border-b border-line pb-8 pt-10">
          <p className="font-display text-5xl font-black leading-none tracking-tight sm:text-7xl">SRRLOVYCH</p>
          <p className="mt-4 font-display text-2xl font-black leading-tight md:text-4xl">
            one block · night watch in uzhhorod
          </p>
          <p className="mt-3 max-w-[60ch] text-dim">
            the artist is the one under observation. one block of the town stands cut out like a model:
            seven things on it, each one opens a window, and the log keeps writing whether anyone reads it
            or not. the surreal part is that the block is slightly wrong: the street lamp shines upward, a
            tennis ball rolls off the edge on its own, a cat crosses cam-02 at 3am.
          </p>
        </div>

        <Section title="palette">
          <div className="grid gap-px border border-line bg-line sm:grid-cols-2">
            {PALETTE.map((c) => (
              <div key={c.name} className="grid grid-cols-[72px_72px_1fr] items-stretch bg-panel">
                <span style={{ background: c.night }} className="h-16" title={c.night} />
                <span style={{ background: c.day }} className="h-16" title={c.day} />
                <span className="flex flex-col justify-center px-3 text-[12px]">
                  <span className="font-bold">--{c.name}</span>
                  <span className="text-dim">
                    {c.night} / {c.day} · {c.role}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Section>

        <Section title="type">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex min-h-[150px] flex-col justify-between border border-line p-5">
              <span className="font-display text-4xl font-black leading-none">hehemonia</span>
              <span className="text-[12px] text-dim">inter tight 900 — the name, big words</span>
            </div>
            <div className="flex min-h-[150px] flex-col justify-between border border-line p-5">
              <span className="text-2xl">05:12:33 · cam-01</span>
              <span className="text-[12px] text-dim">jetbrains mono — ui, log, osd</span>
            </div>
          </div>
        </Section>

        <Section title="tape">
          <div className="tape h-3" aria-hidden="true" />
          <p className="mt-3 max-w-[60ch] text-dim">
            repeating 135° gradient, red / ink, 24px step. never a background under text.
          </p>
        </Section>

        <Section title="plates">
          <div className="grid grid-cols-2 gap-px bg-line p-px sm:grid-cols-4">
            {PLATES.map((p) => (
              <figure key={p.src} className="plate aspect-square border-0">
                <Image src={p.src} alt={p.tag} fill sizes="(min-width: 640px) 25vw, 50vw" className="object-cover" />
                <figcaption className="plate-tag">{p.tag}</figcaption>
              </figure>
            ))}
          </div>
        </Section>

        <Section title="rules">
          <ul className="grid gap-3 md:grid-cols-2">
            {RULES.map((r) => (
              <li key={r} className="border-l-2 border-red pl-3 text-[13px] text-dim">
                {r}
              </li>
            ))}
          </ul>
        </Section>

        <footer className="flex justify-between py-8 text-[12px] text-dim">
          <Link href="/" className="ctl -ml-2">
            ← the block
          </Link>
          <span>SRRLOVYCH · visual system</span>
        </footer>
      </div>
      <FilmGrain />
    </main>
  );
};

export default Moodboard;
