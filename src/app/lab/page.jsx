import Link from "next/link";
import Block3D from "./Block3D";

export const metadata = {
  title: "lab · the block with depth — SRRLOVYCH",
  alternates: { canonical: "/lab" },
  // A trial, not a page of the site: kept out of search.
  robots: { index: false, follow: false },
};

const Lab = () => (
  <main className="flex min-h-[100dvh] flex-col">
    <header className="status flex items-center gap-1 px-3 pb-2">
      <Link href="/" className="ctl">
        ← the block
      </Link>
      <Link href="/lab/full" className="ctl">
        paper
      </Link>
      <span className="ml-auto text-ink">lab · depth</span>
    </header>
    <Block3D />
  </main>
);

export default Lab;
