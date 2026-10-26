import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, posts } from "@/lib/posts";

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return { title: `${post.title} | 芒果山房`, description: post.excerpt };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = posts.filter((p) => p.slug !== post.slug);

  return (
    <article className="mx-auto max-w-3xl px-6 pb-24 pt-8 sm:pt-12">
      <Link
        href="/blog"
        className="font-sans text-sm tracking-widest text-[#1d1a16]/60 transition hover:text-[#e8571f]"
      >
        ← 返回文章列表
      </Link>

      <p className="mt-8 font-sans text-xs tracking-widest text-[#1d1a16]/50">
        {post.date} · 閱讀約 {post.readMinutes} 分鐘
      </p>
      <h1 className="mt-3 text-4xl font-black leading-tight sm:text-5xl">{post.title}</h1>

      <div className="relative mt-10 aspect-[16/9] overflow-hidden rounded-3xl">
        <Image
          src={`/images/${post.cover}.jpg`}
          alt={post.coverAlt}
          fill
          sizes="(min-width:768px) 768px, 100vw"
          className="object-cover"
          priority
        />
      </div>

      <div className="mt-12 font-sans text-[16px] leading-9 text-[#1d1a16]/90">
        {post.sections.map((s, i) => (
          <section key={i} className={i > 0 ? "mt-10" : undefined}>
            {s.heading && (
              <h2 className="mb-4 font-serif text-2xl font-black text-[#1d1a16]">
                {s.heading}
              </h2>
            )}
            <div className="space-y-5">
              {s.paragraphs.map((t, j) => (
                <p key={j}>{t}</p>
              ))}
            </div>
          </section>
        ))}
      </div>

      <div className="mt-16 border-t border-[#1d1a16]/30 pt-10">
        <h2 className="text-2xl font-black">繼續閱讀</h2>
        <ul className="mt-5 space-y-3 font-sans">
          {others.map((p) => (
            <li key={p.slug}>
              <Link
                href={`/blog/${p.slug}`}
                className="transition hover:text-[#e8571f]"
              >
                {p.title} →
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/#order"
          className="mt-10 inline-block rounded-full bg-[#1d1a16] px-8 py-3.5 font-sans text-sm tracking-widest text-[#f3ecdc] transition hover:bg-[#e8571f]"
        >
          開賣時通知我
        </Link>
      </div>
    </article>
  );
}
