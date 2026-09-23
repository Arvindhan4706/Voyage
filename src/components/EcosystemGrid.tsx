"use client";

import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { CloudRain, Activity, Users, Trophy, BarChart3, Database, TrendingUp, CalendarDays, Music, Sparkles } from "lucide-react";
import { MouseEvent } from "react";

function SpotlightCard({ children, className = "" }: { children: React.ReactNode, className?: string }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  return (
    <div
      className={`group relative rounded-xl border border-white/10 bg-black/40 overflow-hidden ${className}`}
      onMouseMove={handleMouseMove}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              600px circle at ${mouseX}px ${mouseY}px,
              rgba(6, 182, 212, 0.15),
              transparent 80%
            )
          `,
        }}
      />
      {children}
    </div>
  );
}

export default function EcosystemGrid() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-4">
          The <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-500">Ecosystem</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          A unified dashboard merging real-time weather, social leaderboards, local events, and admin-level ML analytics.
        </p>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[200px]">
        
        {/* Weather Intelligence (Span 2 cols) */}
        <SpotlightCard className="col-span-1 md:col-span-2 row-span-1">
          <div className="p-6 h-full flex flex-col justify-between relative z-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl -mr-10 -mt-10"></div>
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-1"><CloudRain className="text-blue-400" size={18} /> Weather Intelligence</h4>
              <p className="text-xs text-gray-400">Live 7-Day Forecast & Suitability</p>
            </div>
            <div className="flex justify-between items-end">
              <div>
                <span className="text-4xl font-black text-white">28°C</span>
                <span className="block text-sm font-bold text-blue-400">85% Suitability Score</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-red-400 font-bold block mb-1">Alert: 40% Rain Probability</span>
                <span className="text-xs text-gray-400">Tomorrow</span>
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* Social Features (Leaderboard) */}
        <SpotlightCard className="col-span-1 row-span-2">
          <div className="p-6 h-full flex flex-col justify-between relative z-10">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-2xl -ml-10 -mb-10"></div>
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-1"><Trophy className="text-purple-400" size={18} /> Leaderboards</h4>
              <p className="text-xs text-gray-400">Travel Challenges</p>
            </div>
            <div className="space-y-4 mt-4 relative z-10">
              <div className="flex items-center gap-3 bg-black/40 p-2 rounded-lg border border-purple-500/30">
                <span className="text-purple-400 font-black">1</span>
                <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                <div className="flex-1"><p className="text-xs text-white font-bold">@alex_travels</p><p className="text-[10px] text-gray-400">14k pts</p></div>
              </div>
              <div className="flex items-center gap-3 bg-black/20 p-2 rounded-lg">
                <span className="text-gray-400 font-black">2</span>
                <div className="w-8 h-8 rounded-full bg-gray-700"></div>
                <div className="flex-1"><p className="text-xs text-white font-bold">@sarah_world</p><p className="text-[10px] text-gray-400">12k pts</p></div>
              </div>
              <div className="flex items-center gap-3 bg-black/20 p-2 rounded-lg border border-white/10 opacity-50">
                <span className="text-gray-500 font-black">24</span>
                <div className="w-8 h-8 rounded-full bg-cyan-900 border border-cyan-500"></div>
                <div className="flex-1"><p className="text-xs text-cyan-400 font-bold">You</p><p className="text-[10px] text-gray-400">3k pts</p></div>
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* Personalized Dashboard (Replaces Admin/Dashboard) */}
        <SpotlightCard className="col-span-1 md:col-span-2 row-span-2 border-emerald-500/20">
          <div className="p-6 h-full flex flex-col justify-between relative z-10">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-xl font-bold text-white flex items-center gap-2 mb-1"><Activity className="text-emerald-400" size={24} /> Travel Hub</h4>
                <p className="text-xs text-gray-400">Your Personalized Dashboard</p>
              </div>
              <div className="bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                <span className="text-xs font-bold text-emerald-400">Explorer Level 12</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
              <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                <span className="block text-[10px] text-gray-500 font-bold uppercase mb-2">Upcoming Trip</span>
                <span className="text-2xl font-black text-white block mb-1">Ooty</span>
                <span className="text-xs font-bold text-cyan-400 bg-cyan-500/20 px-2 py-1 rounded">15 Days Remaining</span>
              </div>
              <div className="bg-black/40 border border-white/5 rounded-xl p-4">
                <span className="block text-[10px] text-gray-500 font-bold uppercase mb-2">Spending Analytics</span>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs"><span className="text-gray-400">Hotels</span> <span className="text-white font-bold">₹12,000</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-400">Transport</span> <span className="text-white font-bold">₹8,000</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-400">Food</span> <span className="text-white font-bold">₹5,000</span></div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-white/10 rounded-xl p-4 relative z-10">
              <span className="block text-[10px] text-gray-400 font-bold uppercase mb-2 flex items-center gap-2"><Sparkles size={12} className="text-cyan-400"/> AI Suggestions</span>
              <p className="text-sm text-white font-bold mb-2">You enjoy hill stations. Based on your profile, we recommend:</p>
              <div className="flex gap-2">
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">Munnar</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">Coorg</span>
                <span className="text-xs bg-white/10 px-2 py-1 rounded text-gray-300">Kodaikanal</span>
              </div>
            </div>
          </div>
        </SpotlightCard>

        {/* Event Discovery */}
        <SpotlightCard className="col-span-1 md:col-span-1 row-span-1 border-pink-500/20">
          <div className="p-6 h-full flex flex-col justify-between relative z-10">
            <div>
              <h4 className="text-lg font-bold text-white flex items-center gap-2 mb-1"><Music className="text-pink-400" size={18} /> Events</h4>
              <p className="text-xs text-gray-400">Chennai, India</p>
            </div>
            <div className="mt-2 space-y-2">
              <div className="flex items-center gap-2 text-xs text-white bg-white/5 p-2 rounded">
                <CalendarDays size={12} className="text-pink-400"/> Margazhi Music Fest
              </div>
              <div className="flex items-center gap-2 text-xs text-white bg-white/5 p-2 rounded">
                <CalendarDays size={12} className="text-cyan-400"/> Tech Conference 26
              </div>
            </div>
          </div>
        </SpotlightCard>

      </div>
    </section>
  );
}
