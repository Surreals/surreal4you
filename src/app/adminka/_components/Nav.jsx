"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/adminka", label: "dashboard" },
  { href: "/adminka/products", label: "merch" },
  { href: "/adminka/album", label: "album" },
  { href: "/adminka/links", label: "links" },
  { href: "/adminka/note", label: "note" },
  { href: "/adminka/texts", label: "texts" },
  { href: "/adminka/guestbook", label: "guestbook" },
];

const Nav = () => {
  const path = usePathname();

  return (
    <nav className="adm-nav" aria-label="Admin">
      {NAV.map((item) => {
        const current = item.href === "/adminka" ? path === item.href : path.startsWith(item.href);
        return (
          <Link key={item.href} href={item.href} aria-current={current ? "page" : undefined}>
            {item.label}
          </Link>
        );
      })}
      <a href="/moodboard" target="_blank" rel="noopener noreferrer">
        moodboard ↗
      </a>
    </nav>
  );
};

export default Nav;
