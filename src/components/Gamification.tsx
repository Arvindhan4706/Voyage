"use client";

import { motion } from "framer-motion";
import { Award, Compass, Globe, Mountain, Anchor, Umbrella, Map } from "lucide-react";

export default function Gamification() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 flex items-center gap-3">
            Travel <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-amber-600">Passport</span> <Award className="text-yellow-400" size={40} />
          </h2>
          <p className="text-gray-400 text-lg">Your digital travel legacy. Unlock achievements as you explore the world.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Passport Status Panel */}
        <div className="glass-panel p-8 bg-gradient-to-b from-yellow-500/10 to-transparent border-yellow-500/20">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 p-[2px]">
              <div className="w-full h-full bg-black rounded-full flex items-center justify-center border border-white/10">
                <Globe size={28} className="text-yellow-400" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-black text-white">Global Explorer</h3>
              <p className="text-sm text-yellow-400 font-bold">Level 14 Travel Master</p>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-300 mb-2">
                <span>Countries Visited</span>
                <span className="text-white">12 / 195</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '6%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-300 mb-2">
                <span>Cities Explored</span>
                <span className="text-white">34</span>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold text-gray-300 mb-2">
                <span>Next Milestone: Continent Hopper</span>
                <span className="text-yellow-400">80%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-2">
                <div className="bg-gradient-to-r from-yellow-400 to-amber-500 h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="md:col-span-2 glass-panel p-8">
          <h4 className="text-xl font-bold text-white mb-6 flex items-center gap-2"><Compass className="text-gray-400" /> Earned Badges</h4>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center group cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all">
                <Map size={24} className="text-gray-300" />
              </div>
              <h5 className="font-bold text-white text-sm mb-1">Explorer</h5>
              <p className="text-[10px] text-gray-500">Visited 5 unique regions</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center group cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(52,211,153,0.3)] group-hover:shadow-[0_0_20px_rgba(52,211,153,0.5)] transition-all">
                <Mountain size={24} className="text-white" />
              </div>
              <h5 className="font-bold text-white text-sm mb-1">Mountain Conqueror</h5>
              <p className="text-[10px] text-gray-400">Reached 3,000m elevation</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center group cursor-pointer">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center mb-3 shadow-[0_0_15px_rgba(34,211,238,0.3)] group-hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all">
                <Umbrella size={24} className="text-white" />
              </div>
              <h5 className="font-bold text-white text-sm mb-1">Beach Lover</h5>
              <p className="text-[10px] text-gray-400">5 trips to coastal cities</p>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} className="bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center text-center group cursor-pointer opacity-50 grayscale hover:grayscale-0 transition-all">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-600 flex items-center justify-center mb-3">
                <Anchor size={24} className="text-white" />
              </div>
              <h5 className="font-bold text-white text-sm mb-1">Deep Blue</h5>
              <p className="text-[10px] text-gray-500">Locked: Book a cruise</p>
            </motion.div>

          </div>
        </div>

      </div>
    </section>
  );
}
