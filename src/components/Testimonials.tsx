"use client";

import { motion } from "framer-motion";

const testimonials = [
  { name: "Sarah Jenkins", role: "Solo Traveler", text: "TravelGPT completely changed how I travel. It found a hidden gem in Kyoto that I would have never discovered on my own. The budget prediction was accurate down to the dollar!", rating: 5 },
  { name: "David Chen", role: "Digital Nomad", text: "As someone who travels full-time, the MLOps pipeline behind this is insane. The recommendations adapt to seasons and my changing preferences flawlessly.", rating: 5 },
  { name: "Emily & Mark", role: "Honeymooners", text: "We wanted luxury but had a strict budget. The AI engine optimized our itinerary for the Maldives and saved us thousands while still feeling incredibly premium.", rating: 5 },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-4 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-[#050816] via-blue-900/10 to-[#050816] z-0" />
      
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Loved by <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Travelers</span>
          </h2>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -10 }}
              className="glass-panel p-8 max-w-sm relative"
            >
              <div className="text-yellow-400 mb-4 text-xl">
                {"★".repeat(t.rating)}
              </div>
              <p className="text-gray-300 italic mb-6">"{t.text}"</p>
              <div className="flex items-center gap-4 border-t border-white/10 pt-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <h4 className="text-white font-bold">{t.name}</h4>
                  <p className="text-xs text-cyan-400">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
