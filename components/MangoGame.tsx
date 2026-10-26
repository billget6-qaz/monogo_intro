"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

// 虛擬畫布座標；實際顯示尺寸由 CSS 決定，繪圖時再縮放
const W = 400;
const H = 560;
const DURATION = 15; // 秒
const BASKET_W = 92;
const BASKET_H = 34;
const BASKET_Y = H - 66;
const KEY_SPEED = 420; // 鍵盤移動速度（px/s）

type Phase = "idle" | "playing" | "over";

type Item = {
  baseX: number;
  x: number;
  y: number;
  vy: number;
  r: number;
  rot: number;
  vr: number;
  sway: number;
  phase: number;
  golden: boolean;
};

type Pop = { x: number; y: number; text: string; life: number; golden: boolean };

type Game = {
  items: Item[];
  pops: Pop[];
  basketX: number;
  targetX: number;
  elapsed: number;
  spawn: number;
  score: number;
  left: boolean;
  right: boolean;
  playing: boolean;
};

function newGame(): Game {
  return {
    items: [],
    pops: [],
    basketX: W / 2,
    targetX: W / 2,
    elapsed: 0,
    spawn: 0.4,
    score: 0,
    left: false,
    right: false,
    playing: false,
  };
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const rand = (a: number, b: number) => a + Math.random() * (b - a);

function rating(score: number) {
  if (score >= 36) return "芒果之王";
  if (score >= 25) return "芒果達人";
  if (score >= 12) return "手感不錯";
  return "再接再厲";
}

function drawMango(ctx: CanvasRenderingContext2D, it: Item) {
  ctx.save();
  ctx.translate(it.x, it.y);
  ctx.rotate(it.rot);

  if (it.golden) {
    const glow = ctx.createRadialGradient(0, 0, it.r * 0.4, 0, 0, it.r * 2.2);
    glow.addColorStop(0, "rgba(255,220,90,0.55)");
    glow.addColorStop(1, "rgba(255,220,90,0)");
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(0, 0, it.r * 2.2, 0, Math.PI * 2);
    ctx.fill();
  }

  // 果身
  const body = ctx.createRadialGradient(-it.r * 0.3, -it.r * 0.4, it.r * 0.2, 0, 0, it.r * 1.3);
  if (it.golden) {
    body.addColorStop(0, "#fff6b8");
    body.addColorStop(0.55, "#f7c71f");
    body.addColorStop(1, "#c98a00");
  } else {
    body.addColorStop(0, "#ffd36b");
    body.addColorStop(0.5, "#f08a24");
    body.addColorStop(1, "#d0401a");
  }
  ctx.fillStyle = body;
  ctx.beginPath();
  ctx.ellipse(0, 0, it.r * 0.82, it.r * 1.05, 0, 0, Math.PI * 2);
  ctx.fill();

  // 高光
  ctx.fillStyle = "rgba(255,255,255,0.35)";
  ctx.beginPath();
  ctx.ellipse(-it.r * 0.3, -it.r * 0.35, it.r * 0.18, it.r * 0.3, -0.5, 0, Math.PI * 2);
  ctx.fill();

  // 蒂與葉
  ctx.strokeStyle = "#5a3a1a";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -it.r * 1.0);
  ctx.lineTo(1, -it.r * 1.25);
  ctx.stroke();
  ctx.fillStyle = "#4f8a3a";
  ctx.beginPath();
  ctx.ellipse(it.r * 0.35, -it.r * 1.2, it.r * 0.4, it.r * 0.16, -0.4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawBasket(ctx: CanvasRenderingContext2D, cx: number) {
  const top = BASKET_Y;
  const left = cx - BASKET_W / 2;
  const bottomInset = 10;

  ctx.fillStyle = "#b9772f";
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left + BASKET_W, top);
  ctx.lineTo(left + BASKET_W - bottomInset, top + BASKET_H);
  ctx.lineTo(left + bottomInset, top + BASKET_H);
  ctx.closePath();
  ctx.fill();

  // 編織紋
  ctx.strokeStyle = "rgba(90,50,10,0.35)";
  ctx.lineWidth = 1.5;
  for (let i = 1; i < 4; i++) {
    const y = top + (BASKET_H / 4) * i;
    ctx.beginPath();
    ctx.moveTo(left + 3, y);
    ctx.lineTo(left + BASKET_W - 3, y);
    ctx.stroke();
  }
  for (let i = 1; i < 7; i++) {
    const x = left + (BASKET_W / 7) * i;
    ctx.beginPath();
    ctx.moveTo(x, top);
    ctx.lineTo(x + (x < cx ? bottomInset * 0.4 : -bottomInset * 0.4), top + BASKET_H);
    ctx.stroke();
  }

  // 籃緣
  ctx.fillStyle = "#8a551b";
  ctx.beginPath();
  ctx.roundRect(left - 4, top - 6, BASKET_W + 8, 10, 5);
  ctx.fill();
}

function render(ctx: CanvasRenderingContext2D, g: Game, canvas: HTMLCanvasElement) {
  ctx.setTransform(canvas.width / W, 0, 0, canvas.height / H, 0, 0);

  const sky = ctx.createLinearGradient(0, 0, 0, H);
  sky.addColorStop(0, "#fff1c9");
  sky.addColorStop(1, "#f3dcb0");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, W, H);

  // 太陽
  ctx.fillStyle = "rgba(240,162,31,0.35)";
  ctx.beginPath();
  ctx.arc(W - 70, 80, 54, 0, Math.PI * 2);
  ctx.fill();

  // 地面
  ctx.fillStyle = "#6f9a3f";
  ctx.fillRect(0, H - 34, W, 34);
  ctx.fillStyle = "#5b8433";
  ctx.fillRect(0, H - 34, W, 6);

  for (const it of g.items) drawMango(ctx, it);
  drawBasket(ctx, g.basketX);

  ctx.textAlign = "center";
  for (const p of g.pops) {
    ctx.globalAlpha = clamp(p.life * 1.6, 0, 1);
    ctx.fillStyle = p.golden ? "#b87a00" : "#c5401a";
    ctx.font = `bold ${p.golden ? 26 : 20}px sans-serif`;
    ctx.fillText(p.text, p.x, p.y);
  }
  ctx.globalAlpha = 1;
}

export default function MangoGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<Game>(newGame());
  const rafRef = useRef(0);
  const shownRef = useRef({ score: 0, left: DURATION });

  const [phase, setPhase] = useState<Phase>("idle");
  const [score, setScore] = useState(0);
  const [left, setLeft] = useState(DURATION);
  const [best, setBest] = useState(0);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (canvas && ctx) render(ctx, gameRef.current, canvas);
  }, []);

  // 依顯示尺寸調整畫布解析度
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      draw();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);

  const finish = useCallback(() => {
    const g = gameRef.current;
    g.playing = false;
    g.items = [];
    setScore(g.score);
    setLeft(0);
    setBest((b) => Math.max(b, g.score));
    setPhase("over");
    draw();
  }, [draw]);

  const start = useCallback(() => {
    const g = newGame();
    g.playing = true;
    gameRef.current = g;
    shownRef.current = { score: 0, left: DURATION };
    setScore(0);
    setLeft(DURATION);
    setPhase("playing");

    let last = performance.now();
    const loop = (now: number) => {
      const cur = gameRef.current;
      if (cur !== g || !g.playing) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      g.elapsed += dt;
      if (g.elapsed >= DURATION) {
        finish();
        return;
      }

      // 籃子移動
      if (g.left) g.targetX -= KEY_SPEED * dt;
      if (g.right) g.targetX += KEY_SPEED * dt;
      g.targetX = clamp(g.targetX, BASKET_W / 2, W - BASKET_W / 2);
      g.basketX += (g.targetX - g.basketX) * Math.min(1, dt * 18);

      // 生成芒果：越後面越密、越快
      g.spawn -= dt;
      while (g.spawn <= 0) {
        const golden = Math.random() < 0.12;
        const baseX = rand(34, W - 34);
        g.items.push({
          baseX,
          x: baseX,
          y: -30,
          vy: 150 + g.elapsed * 9 + rand(0, 60),
          r: golden ? 19 : 16,
          rot: rand(-0.4, 0.4),
          vr: rand(-1.2, 1.2),
          sway: rand(0, 14),
          phase: rand(0, Math.PI * 2),
          golden,
        });
        g.spawn += Math.max(0.25, 0.75 - 0.4 * (g.elapsed / DURATION) + rand(-0.1, 0.1));
      }

      // 更新芒果與接取判定
      g.items = g.items.filter((it) => {
        it.y += it.vy * dt;
        it.x = it.baseX + Math.sin(it.phase + g.elapsed * 2.2) * it.sway;
        it.rot += it.vr * dt;

        const caught =
          it.y + it.r >= BASKET_Y &&
          it.y <= BASKET_Y + 22 &&
          Math.abs(it.x - g.basketX) < BASKET_W / 2 + 4;
        if (caught) {
          const pts = it.golden ? 5 : 1;
          g.score += pts;
          g.pops.push({ x: it.x, y: BASKET_Y - 12, text: `+${pts}`, life: 0.7, golden: it.golden });
          return false;
        }
        return it.y < H + 40;
      });

      g.pops = g.pops.filter((p) => {
        p.life -= dt;
        p.y -= 40 * dt;
        return p.life > 0;
      });

      draw();

      const remaining = Math.ceil(DURATION - g.elapsed);
      if (shownRef.current.score !== g.score) {
        shownRef.current.score = g.score;
        setScore(g.score);
      }
      if (shownRef.current.left !== remaining) {
        shownRef.current.left = remaining;
        setLeft(remaining);
      }

      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
  }, [draw, finish]);

  // 離開頁面時停止遊戲
  useEffect(
    () => () => {
      gameRef.current.playing = false;
      cancelAnimationFrame(rafRef.current);
    },
    [],
  );

  // 鍵盤操作
  useEffect(() => {
    const set = (e: KeyboardEvent, down: boolean) => {
      const g = gameRef.current;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        g.left = down;
        if (g.playing) e.preventDefault();
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        g.right = down;
        if (g.playing) e.preventDefault();
      }
    };
    const down = (e: KeyboardEvent) => set(e, true);
    const up = (e: KeyboardEvent) => set(e, false);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
    };
  }, []);

  function onPointer(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * W;
    gameRef.current.targetX = clamp(x, BASKET_W / 2, W - BASKET_W / 2);
    if (!gameRef.current.playing) {
      gameRef.current.basketX = gameRef.current.targetX;
      draw();
    }
  }

  return (
    <div className="mx-auto w-[min(100%,28rem,calc((100svh_-_17rem)*0.714))] min-w-[16rem]">
      <div className="mb-3 flex items-end justify-between font-sans">
        <div>
          <p className="text-xs tracking-widest text-[#1d1a16]/60">得分</p>
          <p className="font-serif text-4xl font-black leading-none text-[#e8571f]">{score}</p>
        </div>
        <div className="text-right">
          <p className="text-xs tracking-widest text-[#1d1a16]/60">剩餘時間</p>
          <p className="font-serif text-4xl font-black leading-none">{left}</p>
        </div>
      </div>

      <div className="mb-3 h-2 overflow-hidden rounded-full bg-[#1d1a16]/10" aria-hidden="true">
        <div
          className="h-full rounded-full bg-[#e8571f] transition-[width] duration-1000 ease-linear"
          style={{ width: `${phase === "idle" ? 100 : (left / DURATION) * 100}%` }}
        />
      </div>

      <div className="relative aspect-[400/560] overflow-hidden rounded-3xl border border-[#1d1a16]/15 shadow-xl">
        <canvas
          ref={canvasRef}
          role="img"
          aria-label="接芒果遊戲畫面"
          onPointerMove={onPointer}
          onPointerDown={onPointer}
          style={{ touchAction: "none" }}
          className="block h-full w-full cursor-grab"
        />

        {phase !== "playing" && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1d1a16]/50 p-6 text-center font-sans text-[#fbf4e4] backdrop-blur-sm">
            {phase === "idle" ? (
              <div>
                <p className="text-xs tracking-[0.4em] text-[#fbf4e4]/70">MINI GAME</p>
                <h2 className="mt-2 font-serif text-4xl font-black">接芒果</h2>
                <p className="mx-auto mt-4 max-w-xs text-sm leading-7 text-[#fbf4e4]/90">
                  左右移動籃子，在 {DURATION} 秒內接住越多芒果越好。
                  金色芒果一顆 5 分。
                </p>
                <p className="mt-2 text-xs text-[#fbf4e4]/70">
                  滑鼠或手指拖曳，也可用方向鍵 <span className="whitespace-nowrap">← →</span>
                </p>
                <button
                  type="button"
                  onClick={start}
                  autoFocus
                  className="mt-6 rounded-full bg-[#e8571f] px-10 py-3.5 text-sm tracking-widest text-[#fbf4e4] transition hover:bg-[#ffb347] hover:text-[#1d1a16]"
                >
                  開始遊戲
                </button>
              </div>
            ) : (
              <div aria-live="polite">
                <p className="text-xs tracking-[0.4em] text-[#fbf4e4]/70">TIME&apos;S UP</p>
                <p className="mt-2 text-sm">你的得分</p>
                <p className="font-serif text-7xl font-black text-[#ffb347]">{score}</p>
                <p className="mt-2 font-serif text-2xl font-black">{rating(score)}</p>
                <p className="mt-1 text-xs text-[#fbf4e4]/70">本次造訪最高分：{best}</p>
                <div className="mt-6 flex flex-col items-center gap-3">
                  <button
                    type="button"
                    onClick={start}
                    autoFocus
                    className="rounded-full bg-[#e8571f] px-10 py-3.5 text-sm tracking-widest text-[#fbf4e4] transition hover:bg-[#ffb347] hover:text-[#1d1a16]"
                  >
                    再玩一次
                  </button>
                  <Link
                    href="/"
                    className="text-xs tracking-widest text-[#fbf4e4]/80 underline-offset-4 hover:underline"
                  >
                    回首頁
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
