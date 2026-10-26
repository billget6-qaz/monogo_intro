"use client";

import { useState } from "react";

// 開賣前先不收集任何資料：按下只顯示訊息，不送出、不儲存。
export default function NotifyButton() {
  const [clicked, setClicked] = useState(false);

  return (
    <div className="relative font-sans">
      <button
        type="button"
        onClick={() => setClicked(true)}
        disabled={clicked}
        className="rounded-full bg-[#1d1a16] px-10 py-3.5 text-sm tracking-widest text-[#f3ecdc] transition hover:bg-[#e8571f] disabled:opacity-60 disabled:hover:bg-[#1d1a16]"
      >
        {clicked ? "已收到" : "通知我開賣"}
      </button>

      <div role="status" className="mt-4 min-h-14">
        {clicked && (
          <div className="rounded-2xl border border-[#1d1a16]/30 bg-white/40 px-6 py-4 text-sm leading-7">
            <p className="text-lg font-bold">謝謝你的關注！</p>
            <p className="mt-1">芒果還在準備中，請等待好消息。</p>
          </div>
        )}
      </div>
    </div>
  );
}
