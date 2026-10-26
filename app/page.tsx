import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { glass } from "@/components/glass";
import Parallax from "@/components/Parallax";
import NotifyButton from "@/components/NotifyButton";
import LuckyDraw from "@/components/LuckyDraw";
import { Welcome } from "@/components/Greeting";

const products = [
  {
    name: "愛文芒果",
    tag: "招牌",
    img: "mango-1",
    spec: "禮盒 5 斤｜約 8–10 顆",
    price: 680,
    desc: "果皮紅豔，果肉綿密、纖維少，香氣濃郁。夏天的第一口就選它。",
  },
  {
    name: "金煌芒果",
    tag: "大顆",
    img: "mango-2",
    spec: "禮盒 5 斤｜約 3–4 顆",
    price: 620,
    desc: "果型碩大，果肉結實，甜中帶微酸，切塊分享最合適。",
  },
  {
    name: "凱特芒果",
    tag: "晚收",
    img: "mango-5",
    spec: "禮盒 5 斤｜約 4–5 顆",
    price: 560,
    desc: "產季偏晚，果皮帶綠仍已熟成，肉質細緻、少纖維，甜味溫和。",
  },
  {
    name: "冰切芒果",
    tag: "即食",
    img: "mango-7",
    spec: "盒裝 600 g｜冷凍配送",
    price: 360,
    desc: "產季鮮果削皮切塊急速冷凍，隨時解凍，直接吃、打冰沙都好。",
  },
];

const steps = [
  { n: "01", title: "表達期待", text: "按下「通知我開賣」，讓我們知道你想吃。" },
  { n: "02", title: "我們準備中", text: "芒果依產季成熟度安排採收，準備上架。" },
  { n: "03", title: "等待好消息", text: "開賣的消息，會公布在這個網站。" },
];

export default function Home() {
  return (
    <div
      id="top"
      className="relative min-h-screen overflow-x-clip bg-[#f3ecdc] font-serif text-[#1d1a16]"
    >
      <Header />

      <main>
        {/* Hero：芒果圖作背景，前景以文字為主 */}
        <section className="mx-6 mb-8 sm:mx-8">
          <div className="relative isolate mx-auto flex min-h-[40rem] max-w-6xl flex-col justify-between overflow-hidden rounded-[2rem] px-6 py-10 text-[#fbf4e4] sm:min-h-[44rem] sm:rounded-[2.5rem] sm:px-14 sm:py-16">
            <Parallax speed={-0.25} className="absolute inset-x-0 -inset-y-[25%] -z-20">
              <Image
                src="/images/mango-1.jpg"
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-[60%_50%] md:object-[70%_50%]"
                priority
              />
            </Parallax>
            <div className="absolute inset-0 -z-10 bg-gradient-to-t from-black/80 via-black/45 to-black/25 md:bg-gradient-to-r md:from-black/75 md:via-black/45 md:to-black/10" />

            <div>
              <p className="font-sans text-xs tracking-[0.4em] text-[#fbf4e4]/80">
                即將開賣 — 6–8 月產季
              </p>
              <Welcome />
            </div>

            <Parallax speed={0.12}>
              <h1 className="text-[clamp(4rem,14vw,12rem)] font-black leading-[0.92] tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.35)]">
                一口
                <br />
                <span className="text-[#ffb347]">夏天</span>
                <br />
                <span className="ml-[0.6em] font-normal italic">就夠了</span>
              </h1>
              <p className="mt-8 max-w-md font-sans text-base leading-8 text-[#fbf4e4]/90">
                挑熟度、看產季，從果園到你家餐桌。每一顆芒果，都等到最甜的時候才出門。
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <a
                  href="#products"
                  className="rounded-full bg-[#fbf4e4] px-8 py-3.5 font-sans text-sm tracking-widest text-[#1d1a16] transition hover:bg-[#ffb347]"
                >
                  看看芒果
                </a>
                <a
                  href="#order"
                  className={`${glass} rounded-full px-8 py-3.5 font-sans text-sm tracking-widest text-[#fbf4e4]`}
                >
                  開賣通知我 ↓
                </a>
                <LuckyDraw />
              </div>
            </Parallax>
          </div>
        </section>

        {/* 商品 */}
        <section id="products" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16 sm:py-24">
          <div className="flex items-end justify-between border-b border-[#1d1a16] pb-4">
            <h2 className="text-4xl font-black sm:text-5xl">本季商品</h2>
            <span className="hidden font-sans text-xs tracking-[0.3em] text-[#1d1a16]/60 sm:inline">
              PRODUCTS
            </span>
          </div>

          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <article key={p.name} className="group flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl sm:aspect-[4/5]">
                  <Parallax speed={-0.08} className="absolute inset-x-0 -inset-y-[12%]">
                    <Image
                      src={`/images/${p.img}.jpg`}
                      alt={p.name}
                      fill
                      sizes="(min-width:1024px) 280px, (min-width:640px) 45vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </Parallax>
                  <span
                    className={`${glass} absolute left-4 top-4 rounded-full px-3 py-1 font-sans text-xs tracking-widest`}
                  >
                    {p.tag}
                  </span>
                </div>
                <h3 className="mt-5 text-2xl font-black">{p.name}</h3>
                <p className="mt-1 font-sans text-xs tracking-wider text-[#1d1a16]/50">
                  {p.spec}
                </p>
                <p className="mt-3 flex-1 font-sans text-[14px] leading-7 text-[#1d1a16]/80">
                  {p.desc}
                </p>
                <div className="mt-5 flex items-center justify-between border-t border-[#1d1a16]/20 pt-4">
                  <span className="text-2xl font-black text-[#e8571f]">
                    <span className="mr-1 font-sans text-xs font-normal text-[#1d1a16]/50">
                      預計
                    </span>
                    NT$ {p.price}
                  </span>
                  <a
                    href="#order"
                    className="rounded-full border border-[#1d1a16] px-5 py-2.5 font-sans text-xs tracking-widest transition hover:bg-[#1d1a16] hover:text-[#f3ecdc]"
                  >
                    通知我
                  </a>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* 產地故事 */}
        <section id="story" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16 sm:py-24">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 className="text-4xl font-black leading-tight sm:text-5xl">
                從樹上
                <br />
                到你手上
              </h2>
              <div className="mt-8 space-y-5 font-sans text-[15px] leading-8">
                <p>芒果在樹上慢慢轉色，我們等它到八、九分熟才採收，保留香氣，也留給你後熟的時間。</p>
                <p>採下後逐顆挑選、分級，只把外觀與熟度合格的裝進箱子。</p>
                <p>切開的那一刻，橙黃果肉飽滿多汁，就是我們想讓你看到的樣子。</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 lg:col-span-7">
              <div className="relative col-span-2 aspect-[16/9] overflow-hidden rounded-3xl">
                <Parallax speed={-0.12} className="absolute inset-x-0 -inset-y-[18%]">
                  <Image
                    src="/images/mango-4.jpg"
                    alt="掛在樹上的青芒果"
                    fill
                    sizes="(min-width:1024px) 600px, 100vw"
                    className="object-cover"
                  />
                </Parallax>
              </div>
              <div className="relative aspect-square overflow-hidden rounded-3xl">
                <Parallax speed={-0.1} className="absolute inset-x-0 -inset-y-[15%]">
                  <Image
                    src="/images/mango-8.jpg"
                    alt="熟透的芒果橫剖面"
                    fill
                    sizes="(min-width:1024px) 300px, 50vw"
                    className="object-cover"
                  />
                </Parallax>
              </div>
              <div className="relative aspect-square overflow-hidden rounded-3xl">
                <Parallax speed={-0.1} className="absolute inset-x-0 -inset-y-[15%]">
                  <Image
                    src="/images/mango-2.jpg"
                    alt="單顆黃色芒果"
                    fill
                    sizes="(min-width:1024px) 300px, 50vw"
                    className="object-cover"
                  />
                </Parallax>
              </div>
            </div>
          </div>
        </section>

        {/* 訂購 */}
        <section id="order" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-16 sm:py-24">
          <div className={`${glass} rounded-[2rem] px-6 py-10 sm:rounded-[2.5rem] sm:px-10 sm:py-14 lg:px-16`}>
            <div className="relative flex items-end justify-between border-b border-[#1d1a16]/40 pb-4">
              <h2 className="text-4xl font-black sm:text-5xl">開賣通知</h2>
              <span className="hidden font-sans text-xs tracking-[0.3em] text-[#1d1a16]/60 sm:inline">
                JOIN THE WAITLIST
              </span>
            </div>

            <ol className="relative mt-10 grid gap-8 sm:grid-cols-3">
              {steps.map((s) => (
                <li key={s.n}>
                  <span className="font-sans text-sm text-[#e8571f]">{s.n}</span>
                  <h3 className="mt-2 text-2xl font-black">{s.title}</h3>
                  <p className="mt-2 font-sans text-[15px] leading-7">{s.text}</p>
                </li>
              ))}
            </ol>

            <div className="relative mt-12 border-t border-[#1d1a16]/40 pt-8">
              <p className="mb-4 font-sans text-sm leading-7">
                芒果還在準備中，按下按鈕，一起期待開賣的好消息。
              </p>
              <NotifyButton />
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
