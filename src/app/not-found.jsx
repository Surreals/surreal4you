import Link from "next/link";

export const metadata = {
  title: "404 — Srrl",
  robots: { index: false, follow: false },
};

const NotFound = () => {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-5 text-center">
      <p className="font-mono text-7xl font-bold tracking-tight text-transparent [-webkit-text-stroke:1.5px_#d11a2a] md:text-9xl">
        404
      </p>
      <p className="mt-5 font-mono text-xs tracking-[0.18em] text-concrete">не знайдено</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center gap-2 border border-line px-5 py-2.5 font-mono text-xs tracking-[0.2em] text-cold transition-colors hover:border-signal hover:bg-signal hover:text-cold"
      >
        <span aria-hidden="true">←</span> srrl
      </Link>
    </main>
  );
};

export default NotFound;
