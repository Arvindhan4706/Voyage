"use client";

import { motion } from "framer-motion";
import { Play, Heart, Bookmark, Share2, Sparkles, Navigation } from "lucide-react";
import { useState } from "react";

const reels = [
  {
    id: 1,
    title: "Hidden Waterfalls of Bali",
    video: "https://cdn.pixabay.com/video/2020/05/10/38747-418759535_tiny.mp4",
    summary: "A 4-hour trek reveals pristine, untouched waterfalls. Perfect for nature lovers.",
    match: 94
  },
  {
    id: 2,
    title: "Street Food Tour: Kyoto",
    video: "https://cdn.pixabay.com/video/2019/04/10/22616-329437151_tiny.mp4",
    summary: "Rated 4.9 stars by local guides. Top recommended dishes: Takoyaki & Matcha Ice Cream.",
    match: 89
  },
  {
    id: 3,
    title: "Paragliding in the Swiss Alps",
    video: "https://cdn.pixabay.com/video/2020/02/16/32386-391851017_tiny.mp4",
    summary: "Extreme sports package with AI-certified safety vendors. Best wind conditions in October.",
    match: 96
  }
];

export default function TravelReels() {
  const [activeReel, setActiveReel] = useState(0);

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10 flex flex-col md:flex-row gap-12 items-center">
      
      {/* Description Panel */}
      <div className="flex-1 text-left">
        <h2 className="text-4xl md:text-6xl font-black mb-6">
          Immersive <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-pink-500">Reels</span>
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-md leading-relaxed">
          Swipe through vertical travel experiences. Our AI generates instant summaries of the video content and automatically matches them to your travel profile.
        </p>

        <div className="space-y-4 max-w-md">
          {reels.map((reel, idx) => (
            <motion.div 
              key={reel.id}
              onClick={() => setActiveReel(idx)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${activeReel === idx ? 'bg-white/10 border-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.3)]' : 'bg-transparent border-white/10 hover:border-white/30'}`}
            >
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-bold text-white flex items-center gap-2"><Play size={14} className={activeReel === idx ? "text-pink-500" : "text-gray-500"} /> {reel.title}</h4>
                <span className="text-xs font-black text-cyan-400">{reel.match}% Match</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Vertical Reel Player */}
      <div className="flex-1 flex justify-center md:justify-end w-full">
        <motion.div 
          key={activeReel}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-[320px] h-[600px] bg-black rounded-[40px] border-8 border-gray-900 shadow-2xl overflow-hidden flex-shrink-0"
        >
          <video 
            src={reels[activeReel].video} 
            autoPlay 
            loop 
            muted 
            className="w-full h-full object-cover"
          />

          {/* Reel Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent pointer-events-none"></div>

          {/* Action Buttons (Right side vertical) */}
          <div className="absolute right-4 bottom-32 flex flex-col gap-6 items-center z-20">
            <button className="flex flex-col items-center gap-1 group">
              <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-pink-500/50 transition-colors">
                <Heart size={20} className="text-white" />
              </div>
              <span className="text-[10px] font-bold text-white drop-shadow-md">12.4K</span>
            </button>
            <button className="flex flex-col items-center gap-1 group">
              <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-emerald-500/50 transition-colors">
                <Bookmark size={20} className="text-white" />
              </div>
              <span className="text-[10px] font-bold text-white drop-shadow-md">Save</span>
            </button>
            <button className="flex flex-col items-center gap-1 group">
              <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-blue-500/50 transition-colors">
                <Share2 size={20} className="text-white" />
              </div>
              <span className="text-[10px] font-bold text-white drop-shadow-md">Share</span>
            </button>
          </div>

          {/* Content Info (Bottom) */}
          <div className="absolute bottom-0 left-0 w-full p-6 z-20">
            <h3 className="text-xl font-black text-white mb-2">{reels[activeReel].title}</h3>
            
            {/* AI Summary Box */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3">
              <div className="flex items-center gap-1 text-xs font-bold text-cyan-400 mb-1">
                <Sparkles size={12} /> AI Summary
              </div>
              <p className="text-xs text-gray-200 leading-tight">
                {reels[activeReel].summary}
              </p>
            </div>
            
            <button className="w-full mt-4 py-3 bg-white text-black font-black text-sm rounded-xl hover:scale-105 transition-transform flex items-center justify-center gap-2">
              <Navigation size={16} /> Add to Itinerary
            </button>
          </div>

        </motion.div>
      </div>

    </section>
  );
}
