import { Header } from "../components/Header";
import { HeroBanner } from "../components/HeroBanner";
import { NowShowing } from "../components/NowShowing";
import { ComingSoon } from "../components/ComingSoon";
import { PromoBanner } from "../components/PromoBanner";
import { Footer } from "../components/Footer";

export function Home() {
  return (
    <div
      className="min-h-screen w-full"
      style={{ backgroundColor: "#0a0a0f", color: "#ffffff", fontFamily: "'Inter', 'system-ui', sans-serif" }}
    >
      <Header />
      <div className="pt-16">
        <HeroBanner />
        <NowShowing />
        <ComingSoon />
        <PromoBanner />
        <Footer />
      </div>
    </div>
  );
}
