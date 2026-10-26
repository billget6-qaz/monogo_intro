import Link from "next/link";
import { glass } from "./glass";
import { HeaderName } from "./Greeting";
import HashLink from "./HashLink";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[#1d1a16]/10 bg-[#f3ecdc]/75 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-4 sm:py-5">
        <div className="min-w-0">
          <Link
            href="/"
            className="whitespace-nowrap font-serif text-lg font-black tracking-[0.12em] sm:text-xl sm:tracking-[0.2em]"
          >
            芒果山房
          </Link>
          <HeaderName />
        </div>
        <nav
          className={`${glass} flex gap-2.5 whitespace-nowrap rounded-full px-3.5 py-2.5 text-xs tracking-normal min-[360px]:gap-4 min-[360px]:px-4 min-[360px]:tracking-wider sm:gap-8 sm:px-7 sm:text-[13px] sm:tracking-widest`}
        >
          <HashLink href="/#products" className="transition hover:text-[#e8571f]">商品</HashLink>
          <HashLink href="/#story" className="hidden transition hover:text-[#e8571f] sm:inline">產地</HashLink>
          <Link href="/blog" className="transition hover:text-[#e8571f]">文章</Link>
          <Link href="/game" className="transition hover:text-[#e8571f]">遊戲</Link>
          <HashLink href="/#order" className="transition hover:text-[#e8571f]">開賣通知</HashLink>
        </nav>
      </div>
    </header>
  );
}
