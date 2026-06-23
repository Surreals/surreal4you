import Image from "next/image";
import Link from "next/link";
import { Cursor, Scanline } from "../../components";

export const metadata = {
  title: "Visual System — Srrl",
  description:
    "SRRL visual system — steel, asphalt and x-ray blue with one surgical red. Surveillance · forensics · x-ray.",
  alternates: { canonical: "/moodboard" },
  // Public (no auth) but kept out of search — it's a design reference.
  robots: { index: false, follow: false },
};

const PALETTE = [
  { name: "asphalt", hex: "#0a0c0e", dark: true, role: "background" },
  { name: "graphite", hex: "#23282e", dark: true, role: "surface" },
  { name: "concrete", hex: "#6e7b86", dark: true, role: "muted text" },
  { name: "x-ray", hex: "#7fa8c9", dark: false, role: "cool accent" },
  { name: "cold white", hex: "#e8eef2", dark: false, role: "text" },
  { name: "signal", hex: "#d11a2a", dark: true, role: "the red" },
];

const TREATMENTS = [
  { label: "film grain", x: false },
  { label: "detection frame", x: false },
  { label: "x-ray / forensic photo", x: true },
  { label: "status · rec line", x: false },
  { label: "section index", x: false },
  { label: "night camera", x: true },
];

const PLATES = [
  { src: "/moodboard/hero.webp", tag: "subject_01 · hero", role: "hero / press", desc: "" },
  { src: "/moodboard/night.webp", tag: "subject_01 · night", role: "press portrait", desc: "night" },
  { src: "/moodboard/car-night.webp", tag: "obj · mb_w211", role: "motif: auto", desc: "night · cctv" },
  { src: "/moodboard/car-street.webp", tag: "obj · mb_w211", role: "motif: auto", desc: "" },
  { src: "/moodboard/car-field.webp", tag: "obj · mb_w211", role: "motif: auto", desc: "" },
  { src: "/moodboard/xray.webp", tag: "texture · x-ray", role: "texture", desc: "" },
  { src: "/moodboard/chroma.webp", tag: "accent · chroma", role: "accent", desc: "rainbow", wide: true },
];

const RULES = [
  "one red. no second accent.",
  "hairlines. red only on detection frames.",
  "photos desaturated → color on hover.",
  "mono is latin: codes, coordinates.",
  "rock salt — signature only.",
  "sharp corners. no warm tones. no #000.",
];

const Section = ({ n, title, children }) => (
  <section className="border-b border-line py-12 md:py-16">
    <div className="mb-7 flex items-baseline gap-3">
      <span className="font-mono text-xs text-signal">{n}</span>
      <h2 className="text-lg font-extrabold uppercase tracking-wide md:text-2xl">{title}</h2>
    </div>
    {children}
  </section>
);

const Moodboard = () => {
  return (
    <main className="mx-auto max-w-5xl px-5 md:px-8">
      <header className="relative border-b border-line pb-8 pt-14">
        <span className="pointer-events-none absolute right-0 top-14 size-12 border border-signal opacity-80" aria-hidden="true" />
        <div className="flex flex-wrap items-start justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-concrete">
          <span>visual system / moodboard</span>
          <span>uzh · 48.62n 22.29e</span>
        </div>
        <p className="mt-5 font-display text-5xl leading-none text-cold sm:text-7xl md:text-8xl">
          Srrl
        </p>
        <p className="mt-3 text-base font-extrabold uppercase tracking-wide md:text-xl">
          cold surreal — <span className="text-xray">surveillance · forensics · x-ray</span>
        </p>
      </header>

      <Section n="00" title="Concept">
        <div className="grid items-center gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <p className="max-w-[62ch] text-sm leading-relaxed text-concrete">
            The cold side: not warm browns but steel, asphalt and x-ray blue with one surgical{" "}
            <span className="text-signal">red</span>. The throughline is{" "}
            <span className="text-cold">surveillance</span>: detection frames, blurred plates,
            x-ray frames, night camera. The artist is an object under observation. Surreal.
          </p>
          <div className="group relative border border-line">
            <span className="pointer-events-none absolute -inset-1.5 border border-signal opacity-70" aria-hidden="true" />
            <Image
              src="/hehemonia.png"
              alt="hehemonia — cover"
              width={1024}
              height={1024}
              className="h-auto w-full [filter:grayscale(0.4)_contrast(1.05)_brightness(0.92)] transition-[filter] duration-500 group-hover:[filter:none]"
            />
            <span className="absolute bottom-2 left-2 bg-asphalt px-1.5 py-px font-mono text-[9px] uppercase tracking-widest text-concrete">
              obj-01
            </span>
          </div>
        </div>
      </Section>

      <Section n="01" title="Palette">
        <div className="grid grid-cols-3 border border-line md:grid-cols-6">
          {PALETTE.map((c) => (
            <div
              key={c.name}
              style={{ backgroundColor: c.hex }}
              className="flex aspect-[1/1.15] flex-col justify-end border-r border-line p-2.5 last:border-r-0"
            >
              <span className={`text-[11px] font-bold uppercase tracking-wide ${c.dark ? "text-cold" : "text-asphalt"}`}>
                {c.name}
              </span>
              <span className={`font-mono text-[10px] ${c.dark ? "text-cold/75" : "text-asphalt/75"}`}>
                {c.hex}
              </span>
              <span className={`mt-0.5 font-mono text-[9px] uppercase ${c.dark ? "text-cold/55" : "text-asphalt/55"}`}>
                {c.role}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section n="02" title="Type">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex min-h-[150px] flex-col justify-between border border-line p-5">
            <span className="font-display text-4xl text-cold">Srrl</span>
            <span className="font-mono text-[11px] uppercase tracking-wide text-concrete">
              rock salt — <span className="text-cold">signature only</span>
            </span>
          </div>
          <div className="flex min-h-[150px] flex-col justify-between border border-line p-5">
            <span className="text-4xl font-extrabold uppercase leading-none">Archivo</span>
            <span className="font-mono text-[11px] uppercase tracking-wide text-concrete">
              archivo 800 — <span className="text-cold">body + headings</span>
            </span>
          </div>
          <div className="flex min-h-[150px] flex-col justify-between border border-line p-5">
            <span className="font-mono text-2xl text-xray">48.62N 22.29E</span>
            <span className="font-mono text-[11px] uppercase tracking-wide text-concrete">
              space mono — <span className="text-cold">labels</span>
            </span>
          </div>
        </div>
      </Section>

      <Section n="03" title="Treatments">
        <div className="flex flex-wrap gap-2.5">
          {TREATMENTS.map((t) => (
            <span key={t.label} className="flex items-center gap-2.5 border border-line px-3.5 py-2.5 text-sm">
              <span className={`size-[7px] ${t.x ? "bg-xray" : "bg-signal"}`} aria-hidden="true" />
              {t.label}
            </span>
          ))}
        </div>
      </Section>

      <Section n="04" title="Photos → roles">
        <div className="grid gap-3 sm:grid-cols-3">
          {PLATES.map((p) => (
            <figure
              key={p.tag}
              className={`group relative overflow-hidden border border-line bg-graphite ${p.wide ? "sm:col-span-3" : ""}`}
            >
              <Image
                src={p.src}
                alt={`srrl — ${p.role}`}
                width={p.wide ? 1280 : 768}
                height={p.wide ? 560 : 1024}
                className={`w-full object-cover [filter:grayscale(0.3)_contrast(1.02)] transition-[filter,transform] duration-500 group-hover:scale-[1.02] group-hover:[filter:none] ${
                  p.wide ? "aspect-[16/7]" : "aspect-[3/4]"
                }`}
              />
              <span className="pointer-events-none absolute inset-3.5 border border-signal opacity-80" aria-hidden="true">
                <span className="absolute -top-[9px] left-0 bg-signal px-1.5 py-px font-mono text-[9px] uppercase tracking-widest text-cold">
                  {p.tag}
                </span>
              </span>
              <figcaption className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between">
                <span className="bg-asphalt px-1.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em]">{p.role}</span>
                {p.desc ? (
                  <span className="font-mono text-[10px] text-concrete">{p.desc}</span>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section n="05" title="Rules">
        <div className="grid gap-3.5 md:grid-cols-2">
          {RULES.map((r) => (
            <p key={r} className="border-l-2 border-signal pl-3.5 font-mono text-[13px] leading-relaxed text-concrete">
              {r}
            </p>
          ))}
        </div>
      </Section>

      <footer className="flex flex-wrap justify-between gap-2.5 py-10 font-mono text-[11px] uppercase tracking-[0.1em] text-concrete">
        <Link href="/" className="transition-colors hover:text-xray">
          ← srrl
        </Link>
        <span>srrl · visual system</span>
      </footer>
      <Cursor />
      <Scanline />
    </main>
  );
};

export default Moodboard;
