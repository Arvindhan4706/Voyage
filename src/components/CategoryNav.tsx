"use client";

import { motion } from "framer-motion";
import { Plane, Building2, Train, Car, Umbrella, Map } from "lucide-react";

const categories = [
  { id: "flights", label: "Flights", icon: Plane },
  { id: "hotels", label: "Hotels", icon: Building2 },
  { id: "homestays", label: "Homestays", icon: Map },
  { id: "holidays", label: "Holidays", icon: Umbrella },
  { id: "trains", label: "Trains", icon: Train },
  { id: "cabs", label: "Cabs", icon: Car },
];

export default function CategoryNav() {
  return (
    <div className="w-full max-w-5xl mx-auto -mt-8 relative z-20 px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel flex items-center justify-between p-2 md:p-4"
      >
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          return (
            <button 
              key={cat.id}
              className="flex flex-col items-center justify-center gap-2 p-2 md:p-4 rounded-xl hover:bg-white/5 transition-colors group flex-1"
            >
              <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-all border border-white/10 group-hover:border-cyan-500/30">
                <Icon size={20} className="md:w-6 md:h-6" />
              </div>
              <span className="text-xs md:text-sm font-semibold text-gray-400 group-hover:text-white transition-colors">
                {cat.label}
              </span>
            </button>
          );
        })}
      </motion.div>
    </div>
  );
}
