"use client";

import { motion } from "framer-motion";
import { Plane, Home, MapPin, Search, Calendar, Star, Tag, ChevronRight, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function PackagesModule() {
  const [destination, setDestination] = useState("");
  const [month, setMonth] = useState("Anytime");
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPackages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/packages?destination=${encodeURIComponent(destination)}&month=${encodeURIComponent(month)}`);
      const data = await res.json();
      setPackages(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPackages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
      
      {/* Header & Search */}
      <div className="glass-panel p-8 mb-12 bg-gradient-to-r from-orange-900/30 to-red-900/20 border-b-4 border-orange-500">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            Curated <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">Holiday Packages</span>
          </h2>
          <p className="text-gray-300 text-lg">Bundle Flights + Hotels and save up to 30% on your next trip.</p>
        </div>

        <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-2">
          <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-2 hover:border-orange-500/50 transition-colors">
            <MapPin size={18} className="text-orange-400" />
            <input 
              type="text" 
              placeholder="Where do you want to go?" 
              className="bg-transparent border-none outline-none text-white w-full font-bold"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          <div className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-2 hover:border-orange-500/50 transition-colors">
            <Calendar size={18} className="text-orange-400" />
            <select 
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="bg-transparent border-none outline-none text-white w-full font-bold appearance-none"
            >
              <option className="bg-gray-900">Anytime</option>
              <option className="bg-gray-900">Next Month</option>
              <option className="bg-gray-900">Summer 2026</option>
              <option className="bg-gray-900">Winter 2026</option>
            </select>
          </div>
          <button 
            onClick={fetchPackages}
            className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 rounded-lg font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />} 
            {loading ? "Searching..." : "Search Deals"}
          </button>
        </div>
      </div>

      {/* Package Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 text-orange-400">
          <Loader2 size={48} className="animate-spin mb-4" />
          <p className="font-bold tracking-widest uppercase">Gemini is curating luxury packages...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {packages.map((pkg, i) => (
            <motion.div 
              key={pkg.id || i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-panel overflow-hidden group hover:border-orange-500/50 transition-colors cursor-pointer flex flex-col"
            >
              <div className="h-48 relative overflow-hidden">
                <img 
                  src={pkg.image || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"} 
                  alt={pkg.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80";
                  }}
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase">
                  Save {Math.round((1 - pkg.price/pkg.originalPrice) * 100)}%
                </div>
              </div>
              
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-lg text-white group-hover:text-orange-400 transition-colors leading-tight">{pkg.title}</h3>
                </div>
                <p className="text-gray-400 text-xs flex items-center gap-1 mb-3"><MapPin size={12}/> {pkg.location}</p>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="bg-orange-500/20 text-orange-400 text-xs font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                    {pkg.rating} <Star size={10} className="fill-orange-400" />
                  </div>
                  <span className="text-[10px] text-gray-500">({pkg.reviews} reviews)</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {pkg.tags?.map((tag: string) => (
                    <span key={tag} className="text-[9px] uppercase tracking-wider bg-white/5 border border-white/10 text-gray-300 px-2 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="mt-auto space-y-2 mb-4">
                  <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Includes:</p>
                  <div className="flex flex-wrap gap-2 text-xs text-gray-300">
                    {pkg.includes?.map((inc: string) => (
                      <span key={inc} className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded">
                        {inc.includes('Flight') ? <Plane size={10} className="text-orange-400"/> : 
                         inc.includes('Hotel') || inc.includes('Villa') || inc.includes('Chalet') ? <Home size={10} className="text-orange-400"/> : 
                         <Tag size={10} className="text-orange-400"/>}
                        {inc}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex justify-between items-end mt-auto">
                  <div>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider block">{pkg.days}</span>
                    <span className="text-xs text-gray-500 line-through">₹{pkg.originalPrice?.toLocaleString()}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 block mb-[-2px]">per person</span>
                    <span className="text-2xl font-black text-white">₹{pkg.price?.toLocaleString()}</span>
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    const el = document.getElementById('ai-planner');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full mt-4 py-2 bg-white/5 group-hover:bg-orange-500 group-hover:text-white border border-white/10 group-hover:border-orange-500 rounded-lg text-sm font-bold text-orange-400 transition-colors flex items-center justify-center gap-1">
                  View Itinerary <ChevronRight size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
}
