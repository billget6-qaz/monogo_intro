"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Next 的 Link 在網址已有相同 hash 時不會重新捲動，
// 所以在首頁時改由程式主動捲到目標區塊；在其他頁面則照常導向首頁。
export default function HashLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  function onClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (pathname !== "/") return;
    const id = href.split("#")[1];
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    e.preventDefault();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    window.history.replaceState(null, "", href);
  }

  return (
    <Link href={href} onClick={onClick} className={className}>
      {children}
    </Link>
  );
}
