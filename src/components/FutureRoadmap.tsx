"use client";

import { motion } from "framer-motion";
import { Mic, Glasses, Cuboid, LocateFixed, Coins } from "lucide-react";

const features = [
  { title: "AI Voice Planner", desc: "Speak naturally: 'Plan a trip to Kerala next month.'", icon: Mic, col: "from-cyan-400 to-blue-500" },
  { title: "AR Travel Preview", desc: "View actual scale destination environments in AR.", icon: Glasses, col: "from-purple-400 to-pink-500" },
  { title: "VR Experience", desc: "Virtual 360° walkthroughs before you book.", icon: Cuboid, col: "from-emerald-400 to-green-500" },
  { title: "Digital Travel Twin", desc: "An AI clone that learns and evolves your preferences.", icon: LocateFixed, col: "from-yellow-400 to-orange-500" },
  { title: "Real-Time Crowd Prediction", desc: "ML models predicting foot traffic per hour.", icon: Coins, col: "from-red-400 to-rose-500" } // Reusing icon for visual placeholder
];

export default function FutureRoadmap() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10 border-t border-white/10 mt-24">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-4">
          Industry-Level <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500">Roadmap</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          The future of TravelGPT. Features currently in active R&D.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-4">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <motion.div 
              key={feat.title}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="glass-panel p-6 w-[280px] group hover:bg-white/5 transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.col} flex items-center justify-center mb-4 opacity-80 group-hover:opacity-100 transition-opacity`}>
                <Icon className="text-white" size={24} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{feat.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
