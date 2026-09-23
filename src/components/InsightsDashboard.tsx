"use client";

import { motion } from "framer-motion";
import { TrendingUp, Map, Users, Globe, Building, Percent, Heart, PlaneTakeoff } from "lucide-react";

export default function InsightsDashboard() {
  
  // Hardcoded premium destinations instead of raw Wikipedia data
  const trendingPlaces = [
    { name: "Bali", country: "Indonesia", trend: "+14%" },
    { name: "Paris", country: "France", trend: "+11%" },
    { name: "Santorini", country: "Greece", trend: "+9%" },
    { name: "Kyoto", country: "Japan", trend: "+7%" },
    { name: "Swiss Alps", country: "Switzerland", trend: "+5%" },
  ];

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto relative">
      <div className="text-center mb-16 relative z-10">
        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 flex items-center justify-center gap-3">
          <Globe className="text-cyan-400" size={40} /> Global Travel Trends
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Discover where our travelers are heading and how much they're saving globally.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 relative z-10">
        
        {/* KPI Cards */}
        <div className="col-span-1 md:col-span-2 lg:col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-2">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-500/20 rounded-xl"><Heart className="text-blue-400" size={20} /></div>
              <span className="text-green-400 text-xs font-bold bg-green-500/10 px-2 py-1 rounded">+12.5%</span>
            </div>
            <h4 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Happy Travelers</h4>
            <p className="text-3xl font-black text-white">124,592</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-green-500/20 rounded-xl"><Map className="text-green-400" size={20} /></div>
            </div>
            <h4 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Destinations Covered</h4>
            <p className="text-3xl font-black text-white">1,204</p>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-lg backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-purple-500/20 rounded-xl"><Building className="text-purple-400" size={20} /></div>
            </div>
            <h4 className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">Partner Hotels</h4>
            <p className="text-3xl font-black text-white">45,000<span className="text-lg text-gray-500">+</span></p>
          </div>
          
          <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-2xl p-6 shadow-[0_0_20px_rgba(6,182,212,0.1)] backdrop-blur-md">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-cyan-500/20 rounded-xl"><Percent className="text-cyan-400" size={20} /></div>
            </div>
            <h4 className="text-cyan-100 text-sm font-bold uppercase tracking-wider mb-1">Average Savings</h4>
            <p className="text-3xl font-black text-white">34%</p>
          </div>
        </div>

        {/* Trend Graph */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:col-span-8 bg-black border border-white/10 rounded-2xl p-6 shadow-xl"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2"><TrendingUp className="text-cyan-400" size={18} /> Monthly Bookings Volume</h3>
              <p className="text-xs text-gray-500 mt-1">Comparing bookings with previous year</p>
            </div>
            <div className="flex gap-4 text-xs font-bold">
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-cyan-400 rounded-full"></div> This Year</div>
              <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white/20 rounded-full"></div> Last Year</div>
            </div>
          </div>
          <div className="h-64 flex items-end justify-between gap-1 md:gap-3 relative">
            {/* Grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="w-full h-px bg-gray-500"></div>
              <div className="w-full h-px bg-gray-500"></div>
              <div className="w-full h-px bg-gray-500"></div>
              <div className="w-full h-px bg-gray-500"></div>
            </div>
            
            {/* Bars */}
            {[45, 60, 55, 75, 65, 85, 70, 95, 80, 100].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col justify-end items-center gap-1 h-full z-10 group">
                <div className="w-full max-w-[40px] flex justify-center items-end gap-1 h-full relative">
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height}%` }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className="w-full bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-sm opacity-90 group-hover:opacity-100 transition-opacity absolute bottom-0 left-0"
                  />
                  <motion.div 
                    initial={{ height: 0 }}
                    whileInView={{ height: `${height * 0.6 + (Math.random() * 10 - 5)}%` }}
                    transition={{ duration: 1, delay: i * 0.05 }}
                    viewport={{ once: true }}
                    className="w-full bg-white/10 rounded-t-sm opacity-50 absolute bottom-0 left-0"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Top Destinations Leaderboard */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-4 bg-black border border-white/10 rounded-2xl p-6 shadow-xl flex flex-col"
        >
          <div className="mb-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2"><PlaneTakeoff className="text-yellow-400" size={18} /> Trending Destinations</h3>
            <p className="text-xs text-gray-500 mt-1">Most booked places this week</p>
          </div>
          
          <div className="flex-1 flex flex-col gap-3">
            {trendingPlaces.map((d, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-xl hover:bg-white/10 transition-colors cursor-default">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center font-bold text-white text-xs shrink-0">
                    #{i + 1}
                  </div>
                  <div className="truncate">
                    <h4 className="text-sm font-bold text-white truncate">{d.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest">{d.country}</p>
                  </div>
                </div>
                <div className="text-right pl-2 shrink-0">
                  <div className="text-green-400 font-bold text-sm">{d.trend}</div>
                  <div className="text-[9px] text-gray-500 uppercase">Growth</div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
