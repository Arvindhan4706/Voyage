import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function CookiePolicy() {
  return (
    <main className="min-h-screen bg-white dark:bg-black font-outfit">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-32">
        <h1 className="text-4xl md:text-5xl font-black mb-8 text-[#D4AF37]">Cookie Policy</h1>
        <div className="space-y-6 text-gray-700 dark:text-gray-300">
          <p>Last Updated: {new Date().toLocaleDateString()}</p>
          <section>
            <h2 className="text-2xl font-bold mb-4 text-black dark:text-white">1. What are cookies?</h2>
            <p>Cookies are small text files placed on your device to help the site provide a better user experience. In general, cookies are used to retain user preferences, store information for things like shopping carts, and provide anonymised tracking data to third party applications like Google Analytics.</p>
          </section>
        </div>
      </div>
      <Footer />
    </main>
  );
}
