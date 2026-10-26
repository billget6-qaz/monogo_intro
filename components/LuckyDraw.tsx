"use client";

import { useEffect, useRef, useState } from "react";

type Phase = "idle" | "spinning" | "win" | "lose";

const WIN_RATE = 0.2; // 20% 中獎
const COUPON_PREFIX = "MANGO90";
// 去掉容易混淆的 0/O、1/I，共 32 個字元（256 可被 32 整除，取餘數不產生偏差）
const CODE_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const SPIN_MS = 1600;

function draw() {
  const [n] = crypto.getRandomValues(new Uint32Array(1));
  return n / 2 ** 32 < WIN_RATE;
}

function makeCouponCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const suffix = Array.from(bytes, (b) => CODE_CHARS[b % CODE_CHARS.length]).join("");
  return `${COUPON_PREFIX}-${suffix}`;
}

export default function LuckyDraw() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [copied, setCopied] = useState(false);
  const [code, setCode] = useState("");

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  function open() {
    setPhase("idle");
    setCopied(false);
    dialogRef.current?.showModal();
  }

  function close() {
    if (timer.current) clearTimeout(timer.current);
    dialogRef.current?.close();
    setPhase("idle");
  }

  function start() {
    if (phase === "spinning") return;
    setCopied(false);
    setPhase("spinning");
    timer.current = setTimeout(() => {
      if (draw()) {
        setCode(makeCouponCode());
        setPhase("win");
      } else {
        setPhase("lose");
      }
    }, SPIN_MS);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="rounded-full bg-[#e8571f] px-8 py-3.5 font-sans text-sm tracking-widest text-[#fbf4e4] transition hover:bg-[#ffb347] hover:text-[#1d1a16]"
      >
        試試手氣
      </button>

      <dialog
        ref={dialogRef}
        aria-labelledby="lucky-title"
        onClick={(e) => {
          if (e.target === dialogRef.current) close();
        }}
        onClose={() => setPhase("idle")}
        className="m-auto w-[calc(100%-3rem)] max-w-md rounded-[2rem] border border-white/60 bg-[#f7f0e0] p-0 text-[#1d1a16] shadow-2xl backdrop:bg-black/55 backdrop:backdrop-blur-sm"
      >
        <div className="relative px-8 pb-8 pt-10 text-center font-sans">
          <button
            type="button"
            onClick={close}
            aria-label="關閉"
            className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center rounded-full text-xl leading-none transition hover:bg-[#1d1a16]/10"
          >
            ×
          </button>

          <p className="text-xs tracking-[0.4em] text-[#1d1a16]/60">LUCKY DRAW</p>
          <h2 id="lucky-title" className="mt-3 font-serif text-3xl font-black">
            芒果抽獎
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#1d1a16]/70">
            每次有 20% 機會抽中芒果優惠券 9 折。
          </p>

          <div
            className="mt-8 flex min-h-48 items-center justify-center"
            aria-live="polite"
          >
            {phase === "idle" && (
              <div className="flex h-36 w-36 items-center justify-center rounded-full border-4 border-dashed border-[#e8571f]/60 font-serif text-5xl font-black text-[#e8571f]">
                ?
              </div>
            )}

            {phase === "spinning" && (
              <div className="relative h-36 w-36">
                <div className="absolute inset-0 animate-spin rounded-full bg-[conic-gradient(from_0deg,#e8571f,#ffb347,#f3ecdc,#e8571f)]" />
                <div className="absolute inset-3 flex items-center justify-center rounded-full bg-[#f7f0e0] text-sm tracking-widest">
                  抽獎中…
                </div>
              </div>
            )}

            {phase === "win" && (
              <div className="w-full">
                <p className="font-serif text-3xl font-black text-[#e8571f]">恭喜中獎！</p>
                <p className="mt-2 text-base">芒果優惠券 9 折</p>
                <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-[#e8571f] bg-white/60 px-3 py-4 min-[360px]:gap-3 min-[360px]:px-5">
                  <span className="whitespace-nowrap font-mono text-base font-bold tracking-normal min-[360px]:text-2xl min-[360px]:tracking-widest">
                    {code}
                  </span>
                  <button
                    type="button"
                    onClick={copy}
                    className="shrink-0 whitespace-nowrap rounded-full border border-[#1d1a16] px-3 py-1.5 text-xs tracking-widest min-[360px]:px-4 transition hover:bg-[#1d1a16] hover:text-[#f7f0e0]"
                  >
                    {copied ? "已複製" : "複製"}
                  </button>
                </div>
                <p className="mt-3 text-xs text-[#1d1a16]/60">請截圖或複製券碼，開賣時使用。</p>
              </div>
            )}

            {phase === "lose" && (
              <div>
                <p className="font-serif text-3xl font-black">差一點點</p>
                <p className="mt-2 text-sm text-[#1d1a16]/70">這次沒有中獎，再試一次吧。</p>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={start}
            disabled={phase === "spinning"}
            className="mt-8 w-full rounded-full bg-[#1d1a16] px-8 py-3.5 text-sm tracking-widest text-[#f7f0e0] transition hover:bg-[#e8571f] disabled:opacity-50"
          >
            {phase === "idle" ? "開始抽獎" : phase === "spinning" ? "抽獎中…" : "再抽一次"}
          </button>
        </div>
      </dialog>
    </>
  );
}
