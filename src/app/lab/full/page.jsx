import Link from "next/link";
import Diorama from "./Diorama";

export const metadata = {
  title: "lab · the block as a model — SRRLOVYCH",
  alternates: { canonical: "/lab/full" },
  // A trial, not a page of the site: kept out of search.
  robots: { index: false, follow: false },
};

const LabFull = () => (
  <main className="flex min-h-[100dvh] flex-col">
    <header className="status flex items-center gap-1 px-3 pb-2">
      <Link href="/" className="ctl">
        ← the block
      </Link>
      <Link href="/lab" className="ctl">
        depth
      </Link>
      <span className="ml-auto text-ink">lab · full 3d</span>
    </header>
    <Diorama />
  </main>
);

export default LabFull;
