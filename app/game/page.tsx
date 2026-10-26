import type { Metadata } from "next";
import MangoGame from "@/components/MangoGame";

export const metadata: Metadata = {
  title: "接芒果小遊戲 | 芒果山房",
  description: "15 秒接芒果小遊戲，單純娛樂，看看你能拿幾分。",
};

export default function GamePage() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-12 pt-3 sm:pt-5">
      <h1 className="mb-4 text-center text-3xl font-black sm:text-4xl">接芒果</h1>
      <MangoGame />
    </section>
  );
}
