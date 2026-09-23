import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CheckoutFlow from "@/components/CheckoutFlow";

export default function CheckoutPage() {
  return (
    <main className="min-h-screen overflow-x-hidden relative font-outfit bg-background">
      <Header />
      <div className="pt-24 pb-12 relative z-10">
        {/* Background Orbs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
        <CheckoutFlow />
      </div>
      <Footer />
    </main>
  );
}
