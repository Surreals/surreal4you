import Link from "next/link";
import { FilmGrain } from "../components";

export const metadata = {
  title: "404 — Srrl",
  robots: { index: false, follow: false },
};

const NotFound = () => {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-7xl font-bold tracking-tight text-transparent [-webkit-text-stroke:1.5px_var(--leaf)] md:text-9xl">
        404
      </p>
      <p className="mt-5 font-mono text-xs uppercase tracking-[0.18em] text-lichen">not found</p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-11 items-center gap-2 border border-line px-5 py-2.5 font-mono text-xs tracking-[0.2em] text-bone transition-[color,background-color,border-color,transform] duration-200 ease-out hover:border-leaf hover:bg-leaf hover:text-bark active:scale-[0.96]"
      >
        <span aria-hidden="true">←</span> srrl
      </Link>
      <FilmGrain />
    </main>
  );
};

export default NotFound;
