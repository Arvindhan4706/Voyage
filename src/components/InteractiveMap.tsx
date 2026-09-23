"use client";

import { motion } from "framer-motion";
import { Map, Flame, Users, CloudRain, Navigation } from "lucide-react";

export default function InteractiveMap() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-4">Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Travel Map</span></h2>
        <p className="text-gray-400 text-lg">Real-time geospatial intelligence powered by Google Maps data architecture.</p>
      </div>

      <div className="glass-panel p-2 rounded-3xl overflow-hidden relative h-[600px] border border-white/10 group">
        
        {/* Placeholder for actual Google Maps API, using a high-quality stylized map image for UI demonstration */}
        <div className="absolute inset-0 bg-[#0a0f25]">
          <div className="w-full h-full opacity-60 mix-blend-screen" style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=1600&q=80')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'hue-rotate(180deg) saturate(2)'
          }}></div>
        </div>

        {/* Map Overlays UI */}
        <div className="absolute top-6 left-6 flex flex-col gap-3 z-20">
          <button className="bg-black/50 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-colors">
            <Flame size={16} className="text-orange-500" /> Destination Heatmap
          </button>
          <button className="bg-black/50 backdrop-blur-md border border-white/10 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-colors">
            <Users size={16} className="text-blue-500" /> Tourist Density
          </button>
          <button className="bg-black/50 backdrop-blur-md border border-cyan-500/50 text-cyan-400 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <CloudRain size={16} /> Live Weather Overlay
          </button>
        </div>

        <div className="absolute bottom-6 right-6 z-20 flex gap-2">
          <button className="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-2xl hover:scale-105 transition-transform">
            <Navigation size={20} className="fill-black" />
          </button>
        </div>

        {/* Simulated Map Elements */}
        <motion.div 
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute top-1/3 left-1/3 w-32 h-32 bg-red-500/20 rounded-full blur-xl z-10 pointer-events-none"
        ></motion.div>
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.8, 0.3, 0.8] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="absolute top-1/2 right-1/4 w-48 h-48 bg-cyan-500/20 rounded-full blur-2xl z-10 pointer-events-none"
        ></motion.div>

        {/* Simulated Hotel Cluster */}
        <div className="absolute top-[40%] left-[60%] z-20 flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 px-2 py-1 rounded-full cursor-pointer hover:bg-white/20 transition-colors">
          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span className="text-xs font-bold text-white">12 Hotels</span>
        </div>

      </div>
    </section>
  );
}
