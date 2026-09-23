"use client";

import { motion } from "framer-motion";
import { BrainCircuit, TrendingDown, Map, CloudSun, ArrowUpRight } from "lucide-react";

const features = [
  {
    icon: BrainCircuit,
    title: "AI Recommendations",
    desc: "Personalized itineraries built using deep learning and user behavior analysis.",
    color: "from-cyan-500/20 to-blue-500/5",
    iconColor: "text-cyan-400",
    borderGlow: "group-hover:border-cyan-400/50"
  },
  {
    icon: TrendingDown,
    title: "Price Prediction",
    desc: "ML models predict flight and hotel prices to tell you exactly when to book.",
    color: "from-purple-500/20 to-pink-500/5",
    iconColor: "text-purple-400",
    borderGlow: "group-hover:border-purple-400/50"
  },
  {
    icon: Map,
    title: "Smart Itinerary",
    desc: "Dynamic day-by-day generation of places, hotels, and local food spots.",
    color: "from-blue-500/20 to-indigo-500/5",
    iconColor: "text-blue-400",
    borderGlow: "group-hover:border-blue-400/50"
  },
  {
    icon: CloudSun,
    title: "Real-time Weather",
    desc: "Routes optimized based on live weather data and historical climate patterns.",
    color: "from-emerald-500/20 to-teal-500/5",
    iconColor: "text-emerald-400",
    borderGlow: "group-hover:border-emerald-400/50"
  }
];

export default function WhyChooseUs() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
        <div className="max-w-2xl">
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight"
          >
            Why Choose <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-amber-200 animate-pulse-glow inline-block">TravelGPT</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 dark:text-gray-400 text-lg md:text-xl font-serif"
          >
            Our proprietary machine learning engine completely rethinks how you plan, book, and experience travel.
          </motion.p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
        {features.map((feat, index) => {
          const Icon = feat.icon;
          // Staggered grid logic: 
          // 1st item: 7 cols (large)
          // 2nd item: 5 cols (smaller)
          // 3rd item: 5 cols (smaller)
          // 4th item: 7 cols (large)
          const colSpan = index === 0 || index === 3 ? "lg:col-span-7" : "lg:col-span-5";
          const minHeight = index === 0 || index === 3 ? "min-h-[320px]" : "min-h-[280px]";

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className={`group relative overflow-hidden rounded-3xl glass-panel ${colSpan} ${minHeight} p-8 md:p-10 flex flex-col justify-between transition-all duration-500 hover:-translate-y-2 ${feat.borderGlow}`}
            >
              {/* Animated gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
              
              <div className="relative z-10 flex justify-between items-start">
                <div className={`w-16 h-16 rounded-2xl bg-white dark:bg-black/40 border border-black/5 dark:border-white/10 shadow-lg flex items-center justify-center backdrop-blur-md ${feat.iconColor} transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <Icon size={32} strokeWidth={1.5} />
                </div>
                
                <div className="w-10 h-10 rounded-full border border-black/10 dark:border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-x-4 -translate-y-4 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 bg-white/50 dark:bg-black/50 backdrop-blur-md">
                  <ArrowUpRight size={20} className={feat.iconColor} />
                </div>
              </div>

              <div className="relative z-10 mt-12">
                <h3 className="text-2xl md:text-3xl font-black mb-4 tracking-tight group-hover:translate-x-2 transition-transform duration-500">{feat.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-base md:text-lg max-w-sm group-hover:text-gray-900 dark:group-hover:text-gray-200 transition-colors duration-500">
                  {feat.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
