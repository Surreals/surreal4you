import Image from "next/image";
import Link from "next/link";
import { Cursor, FilmGrain, Scanline } from "../../components";

export const metadata = {
  title: "Visual System — Srrl",
  description:
    "SRRL visual system — bark, moss and bone with one leaf-green accent. Surveillance · forensics · overgrowth.",
  alternates: { canonical: "/moodboard" },
  // Public (no auth) but kept out of search — it's a design reference.
  robots: { index: false, follow: false },
};

const PALETTE = [
  { name: "bark", hex: "#141811", dark: true, role: "background" },
  { name: "moss", hex: "#262b21", dark: true, role: "surface" },
  { name: "lichen", hex: "#7e8a74", dark: false, role: "muted text" },
  { name: "leaf", hex: "#8fbf6a", dark: false, role: "the accent" },
  { name: "leaf pale", hex: "#c3d9ac", dark: false, role: "hover / tint" },
  { name: "bone", hex: "#eef1e8", dark: false, role: "text" },
];

const TREATMENTS = [
  { label: "film grain", pale: false },
  { label: "detection frame", pale: false },
  { label: "forensic photo", pale: true },
  { label: "status · rec line", pale: false },
  { label: "section index", pale: false },
  { label: "night camera", pale: true },
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
  "one green. no second accent.",
  "hairlines. leaf only on detection frames.",
  "green fills carry bark text, never bone.",
  "photos desaturated → color on hover.",
  "mono is latin: codes, coordinates.",
  "rock salt — signature only.",
  "sharp corners. no #000, no pure white.",
];

const Section = ({ n, title, children }) => (
  <section className="border-b border-line py-12 md:py-16">
    <div className="mb-7 flex items-baseline gap-3">
      <span className="font-mono text-xs text-leaf">{n}</span>
      <h2 className="text-lg font-extrabold uppercase tracking-wide md:text-2xl">{title}</h2>
    </div>
    {children}
  </section>
);

const Moodboard = () => {
  return (
    <main className="mx-auto max-w-5xl px-5 md:px-8">
      <header className="relative border-b border-line pb-8 pt-14">
        <span className="pointer-events-none absolute right-0 top-14 size-12 border border-leaf opacity-80" aria-hidden="true" />
        <div className="flex flex-wrap items-start justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-lichen">
          <span>visual system / moodboard</span>
          <span>uzh · 48.62n 22.29e</span>
        </div>
        <p className="mt-5 font-display text-5xl leading-none text-bone sm:text-7xl md:text-8xl">
          Srrl
        </p>
        <p className="mt-3 text-base font-extrabold uppercase tracking-wide md:text-xl">
          forest night — <span className="text-leaf">surveillance · forensics · overgrowth</span>
        </p>
      </header>

      <Section n="00" title="Concept">
        <div className="grid items-center gap-6 md:grid-cols-[1.1fr_0.9fr]">
          <p className="max-w-[62ch] text-sm leading-relaxed text-lichen">
            Not steel and asphalt but bark, moss and bone — a night field rather than a car park,
            lit by one living <span className="text-leaf">green</span>. The throughline is still{" "}
            <span className="text-bone">surveillance</span>: detection frames, blurred plates,
            night camera. The artist is an object under observation, only now the thing observing
            him is growing. Surreal.
          </p>
          <div className="group relative border border-line">
            <span className="pointer-events-none absolute -inset-1.5 border border-leaf opacity-70" aria-hidden="true" />
            <Image
              src="/hehemonia.png"
              alt="hehemonia — cover"
              width={1024}
              height={1024}
              className="h-auto w-full [filter:grayscale(0.35)_contrast(1.02)_brightness(0.98)] transition-[filter] duration-500 group-hover:[filter:none]"
            />
            <span className="absolute bottom-2 left-2 bg-bark px-1.5 py-px font-mono text-[9px] uppercase tracking-widest text-lichen">
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
              <span className={`text-[11px] font-bold uppercase tracking-wide ${c.dark ? "text-bone" : "text-bark"}`}>
                {c.name}
              </span>
              <span className={`font-mono text-[10px] ${c.dark ? "text-bone/75" : "text-bark/75"}`}>
                {c.hex}
              </span>
              <span className={`mt-0.5 font-mono text-[9px] uppercase ${c.dark ? "text-bone/55" : "text-bark/70"}`}>
                {c.role}
              </span>
            </div>
          ))}
        </div>
      </Section>

      <Section n="02" title="Type">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex min-h-[150px] flex-col justify-between border border-line p-5">
            <span className="font-display text-4xl text-bone">Srrl</span>
            <span className="font-mono text-[11px] uppercase tracking-wide text-lichen">
              rock salt — <span className="text-bone">signature only</span>
            </span>
          </div>
          <div className="flex min-h-[150px] flex-col justify-between border border-line p-5">
            <span className="text-4xl font-extrabold uppercase leading-none">Archivo</span>
            <span className="font-mono text-[11px] uppercase tracking-wide text-lichen">
              archivo 800 — <span className="text-bone">body + headings</span>
            </span>
          </div>
          <div className="flex min-h-[150px] flex-col justify-between border border-line p-5">
            <span className="font-mono text-2xl text-leaf">48.62N 22.29E</span>
            <span className="font-mono text-[11px] uppercase tracking-wide text-lichen">
              space mono — <span className="text-bone">labels</span>
            </span>
          </div>
        </div>
      </Section>

      <Section n="03" title="Treatments">
        <div className="flex flex-wrap gap-2.5">
          {TREATMENTS.map((t) => (
            <span key={t.label} className="flex items-center gap-2.5 border border-line px-3.5 py-2.5 text-sm">
              <span className={`size-[7px] ${t.pale ? "bg-leaf-pale" : "bg-leaf"}`} aria-hidden="true" />
              {t.label}
            </span>
          ))}
        </div>
      </Section>

      <Section n="04" title="Photos → roles">
        <div className="grid gap-3 sm:grid-cols-3">
          {PLATES.map((p) => (
            <figure
              key={p.src}
              className={`group relative overflow-hidden border border-line bg-moss ${p.wide ? "sm:col-span-3" : ""}`}
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
              <span className="pointer-events-none absolute inset-3.5 border border-leaf opacity-80" aria-hidden="true">
                <span className="absolute -top-[9px] left-0 bg-leaf px-1.5 py-px font-mono text-[9px] uppercase tracking-widest text-bark">
                  {p.tag}
                </span>
              </span>
              <figcaption className="absolute inset-x-2.5 bottom-2.5 flex items-center justify-between">
                <span className="bg-bark px-1.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em]">{p.role}</span>
                {p.desc ? (
                  <span className="bg-bark px-1.5 py-1 font-mono text-[10px] text-lichen">{p.desc}</span>
                ) : null}
              </figcaption>
            </figure>
          ))}
        </div>
      </Section>

      <Section n="05" title="Rules">
        <div className="grid gap-3.5 md:grid-cols-2">
          {RULES.map((r) => (
            <p key={r} className="border-l-2 border-leaf pl-3.5 font-mono text-[13px] leading-relaxed text-lichen">
              {r}
            </p>
          ))}
        </div>
      </Section>

      <footer className="flex flex-wrap justify-between gap-2.5 py-10 font-mono text-[11px] uppercase tracking-[0.1em] text-lichen">
        <Link
          href="/"
          className="relative transition-colors before:absolute before:-inset-x-2 before:-inset-y-3 before:content-[''] hover:text-leaf"
        >
          ← srrl
        </Link>
        <span>srrl · visual system</span>
      </footer>
      <Cursor />
      <Scanline />
      <FilmGrain />
    </main>
  );
};

export default Moodboard;
