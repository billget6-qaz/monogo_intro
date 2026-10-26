import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BlogLayout({ children }: LayoutProps<"/blog">) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#f3ecdc] font-serif text-[#1d1a16]">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
