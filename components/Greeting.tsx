"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";

// 稱呼存在 localStorage：下次進站直接顯示，不再詢問。
const STORAGE_KEY = "mango-house:name";
const MAX_LENGTH = 20;

function readStoredName() {
  try {
    return (localStorage.getItem(STORAGE_KEY) ?? "").trim().slice(0, MAX_LENGTH);
  } catch {
    return ""; // 無痕模式或被封鎖時讀不到，當作沒有稱呼
  }
}

function writeStoredName(value: string) {
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // 寫入失敗就只保留在本次瀏覽
  }
}

const NameContext = createContext({ name: "", change: () => {} });

export function GreetingProvider({ children }: { children: React.ReactNode }) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [name, setName] = useState("");
  const [draft, setDraft] = useState("");

  useEffect(() => {
    const stored = readStoredName();
    if (stored) {
      setName(stored);
      return;
    }
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  function change() {
    const dialog = dialogRef.current;
    if (!dialog || dialog.open) return;
    setDraft(name);
    dialog.showModal();
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const value = draft.trim();
    if (!value) return;
    setName(value);
    writeStoredName(value);
    dialogRef.current?.close();
  }

  return (
    <NameContext.Provider value={{ name, change }}>
      {children}

      <dialog
        ref={dialogRef}
        aria-labelledby="greeting-title"
        className="m-auto w-[calc(100%-3rem)] max-w-md rounded-[2rem] border border-white/60 bg-[#f7f0e0] p-0 text-[#1d1a16] shadow-2xl backdrop:bg-black/55 backdrop:backdrop-blur-sm"
      >
        <form onSubmit={submit} className="px-8 pb-8 pt-10 text-center font-sans">
          <p className="text-xs tracking-[0.4em] text-[#1d1a16]/60">WELCOME</p>
          <h2 id="greeting-title" className="mt-3 font-serif text-3xl font-black">
            歡迎光臨芒果山房
          </h2>
          <p className="mt-3 text-sm leading-7 text-[#1d1a16]/70">請問怎麼稱呼你？</p>

          <label htmlFor="greeting-name" className="sr-only">
            你的稱呼
          </label>
          <input
            id="greeting-name"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            maxLength={20}
            autoComplete="off"
            autoFocus
            placeholder="例如：小明"
            className="mt-6 w-full rounded-full border border-[#1d1a16]/40 bg-white/60 px-6 py-3.5 text-center text-base outline-none transition placeholder:text-[#1d1a16]/40 focus:border-[#e8571f] focus:ring-2 focus:ring-[#e8571f]/30"
          />

          <button
            type="submit"
            disabled={!draft.trim()}
            className="mt-5 w-full rounded-full bg-[#1d1a16] px-8 py-3.5 text-sm tracking-widest text-[#f7f0e0] transition hover:bg-[#e8571f] disabled:opacity-40 disabled:hover:bg-[#1d1a16]"
          >
            進入官網
          </button>
          <button
            type="button"
            onClick={() => dialogRef.current?.close()}
            className="mt-3 text-xs tracking-widest text-[#1d1a16]/60 underline-offset-4 transition hover:text-[#1d1a16] hover:underline"
          >
            先不用，直接逛逛
          </button>
        </form>
      </dialog>
    </NameContext.Provider>
  );
}

export function HeaderName() {
  const { name, change } = useContext(NameContext);
  if (!name) return null;
  return (
    <p className="mt-0.5 font-sans text-[11px] tracking-wider text-[#e8571f] sm:text-xs">
      <button
        type="button"
        onClick={change}
        title="更改稱呼"
        aria-label={`嗨，${name}，點擊更改稱呼`}
        className="block max-w-[6.5rem] truncate text-left underline-offset-4 hover:underline min-[360px]:max-w-[7.5rem] sm:max-w-xs"
      >
        嗨，{name}
      </button>
    </p>
  );
}

export function Welcome() {
  const { name } = useContext(NameContext);
  if (!name) return null;
  return (
    <p className="mt-4 font-serif text-2xl font-black text-[#ffb347] sm:text-3xl">
      歡迎你，{name}！
    </p>
  );
}
