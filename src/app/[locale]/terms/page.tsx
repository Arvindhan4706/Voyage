import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsAndConditions() {
  return (
    <main className="min-h-screen bg-white dark:bg-black font-outfit">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-32">
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-[#D4AF37]">Terms & Conditions</h1>
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          <section>
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">1. Acceptance of Terms</h2>
            <p>By accessing Voyage, you agree to be bound by these Terms and Conditions of Use.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">2. Refund Policy</h2>
            <p>All bookings made through our platform are subject to the specific cancellation and refund policies of the respective airlines and hotels.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
