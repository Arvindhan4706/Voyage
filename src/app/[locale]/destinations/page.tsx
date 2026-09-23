"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DestinationCards from "@/components/DestinationCards";
import TrendingDestinations from "@/components/TrendingDestinations";

export default function DestinationsPage() {
  return (
    <main className="min-h-screen overflow-x-hidden relative font-sans bg-white dark:bg-black">
      <Header />
      
      <div className="pt-32 pb-16 px-6 max-w-7xl mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-serif text-black dark:text-white mb-6">
          All Destinations
        </h1>
        <p className="text-[#888888] dark:text-[#a3a3a3] max-w-2xl mx-auto tracking-wide">
          Explore our complete collection of handpicked, luxury locales designed for the discerning traveler.
        </p>
      </div>

      <TrendingDestinations />
      <DestinationCards showExploreLink={false} />
      
      <Footer />
    </main>
  );
}
