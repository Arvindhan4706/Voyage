import Header from "@/components/Header";
import DestinationCards from "@/components/DestinationCards";
import TrendingDestinations from "@/components/TrendingDestinations";
import TravelCategories from "@/components/TravelCategories";
import HotelsModule from "@/components/HotelsModule";
import FlightsModule from "@/components/FlightsModule";
import PackagesModule from "@/components/PackagesModule";
import Hero from "@/components/Hero";
import AISearch from "@/components/AISearch";
import AITripGenerator from "@/components/AITripGenerator";
import RecommendationEngine from "@/components/RecommendationEngine";
import InsightsDashboard from "@/components/InsightsDashboard";
import AIPipeline from "@/components/AIPipeline";
import WhyChooseUs from "@/components/WhyChooseUs";
import TrustedMarquee from "@/components/TrustedMarquee";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden relative font-outfit">
      <Header />
      <Hero />
      <div id="home" className="relative z-10 -mt-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AISearch />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div id="ai-planner" className="py-12" />
        <AITripGenerator />

        <div className="py-12" />
        <TrustedMarquee />
        
        <div className="py-12" />
        <WhyChooseUs />
        
        <div id="experiences" className="py-12" />
        <TravelCategories />

        <div id="destinations" className="py-12" />
        <DestinationCards />
        
        <div id="flights" className="py-12" />
        <FlightsModule />

        <div id="hotels" className="py-12" />
        <HotelsModule />
        
        <div id="packages" className="py-12" />
        <PackagesModule />
        
        <div id="recommendations" className="py-12" />
        <RecommendationEngine />
        
        <div id="insights" className="py-12" />
        <InsightsDashboard />

        <div id="pipeline" className="py-12" />
        <AIPipeline />
        
        <div className="py-12" />
        <TrendingDestinations />
      </div>
      
      <Footer />
    </main>
  );
}
