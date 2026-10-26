import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { posts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "芒果文章 | 芒果山房",
  description: "芒果的挑選、保存、切法與品種介紹。",
};

export default function BlogPage() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24 pt-8 sm:pt-16">
      <p className="font-sans text-xs tracking-[0.4em] text-[#1d1a16]/60">BLOG</p>
      <h1 className="mt-4 text-5xl font-black leading-tight sm:text-7xl">芒果文章</h1>
      <p className="mt-6 max-w-xl font-sans text-base leading-8 text-[#1d1a16]/80">
        怎麼挑、怎麼放、怎麼切，還有台灣芒果的品種與產季。
      </p>

      <div className="mt-12 grid gap-10 md:grid-cols-3">
        {posts.map((p) => (
          <article key={p.slug} className="group flex flex-col">
            <Link href={`/blog/${p.slug}`} className="flex flex-1 flex-col">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                <Image
                  src={`/images/${p.cover}.jpg`}
                  alt={p.coverAlt}
                  fill
                  sizes="(min-width:768px) 360px, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <p className="mt-5 font-sans text-xs tracking-widest text-[#1d1a16]/50">
                {p.date} · 閱讀約 {p.readMinutes} 分鐘
              </p>
              <h2 className="mt-2 text-2xl font-black leading-snug transition-colors group-hover:text-[#e8571f]">
                {p.title}
              </h2>
              <p className="mt-3 flex-1 font-sans text-[14px] leading-7 text-[#1d1a16]/80">
                {p.excerpt}
              </p>
              <span className="mt-4 font-sans text-sm tracking-widest text-[#e8571f]">
                閱讀全文 →
              </span>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
