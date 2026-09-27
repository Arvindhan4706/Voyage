import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-white dark:bg-black font-outfit">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-32">
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-[#D4AF37]">Privacy Policy</h1>
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          <section>
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">1. Information We Collect</h2>
            <p>We only collect the essential information needed to provide you with luxury travel itineraries. We do not sell your personal data to third parties.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">2. Data Deletion Requests</h2>
            <p>You have the right to request deletion of your data at any time. Contact us to process this request.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
