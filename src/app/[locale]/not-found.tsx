import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white dark:bg-black font-outfit flex flex-col">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-32">
        <h1 className="text-9xl font-black text-[#D4AF37] mb-4">404</h1>
        <h2 className="text-3xl font-bold text-black dark:text-white mb-6">Lost in transit?</h2>
        <p className="text-gray-500 max-w-md mx-auto mb-8">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <Link href="/" className="bg-[#D4AF37] text-white px-8 py-3 rounded-md font-bold hover:bg-[#b5952f] transition-colors">
          Return to Basecamp
        </Link>
      </div>
      <Footer />
    </main>
  );
}
