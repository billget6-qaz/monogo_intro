export default function Footer() {
  return (
    <footer className="mx-auto max-w-6xl border-t border-[#1d1a16]/20 px-6 py-8">
      <div className="flex flex-col justify-between gap-2 text-xs tracking-widest text-[#1d1a16]/60 sm:flex-row">
        <span className="font-serif font-black text-[#1d1a16]">芒果山房 MANGO HOUSE</span>
        <span>即將開賣 · 產季 6–8 月</span>
        <span>© 2026</span>
      </div>
      <p className="mt-4 text-[11px] leading-5 text-[#1d1a16]/40">
        圖片來源：Wikimedia Commons，作者與授權詳見 public/images/credits.json。
      </p>
    </footer>
  );
}
