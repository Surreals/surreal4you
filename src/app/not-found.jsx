import Link from "next/link";
import { FilmGrain } from "../components";

export const metadata = {
  title: "404 — Srrlovych",
  robots: { index: false, follow: false },
};

const NotFound = () => {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-[clamp(72px,20vw,200px)] font-black leading-none tracking-tight text-red">
        404
      </p>
      <p className="mt-4 text-dim">camera not found · signal lost</p>
      <Link href="/" className="ctl mt-8 min-h-11 border-ink px-5">
        ← station
      </Link>
      <FilmGrain />
    </main>
  );
};

export default NotFound;
