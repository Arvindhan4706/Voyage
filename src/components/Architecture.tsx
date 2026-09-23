"use client";

import { motion } from "framer-motion";
import { UserCircle, MonitorSmartphone, Server, BrainCircuit, Activity, ArrowDown } from "lucide-react";

const architecture = [
  {
    category: "Frontend (Next.js)",
    icon: MonitorSmartphone,
    color: "from-cyan-400 to-blue-500",
    techs: ["AI Trip Planner", "Recommendation Dashboard", "Interactive Maps", "3D Globe", "Booking Interface"]
  },
  {
    category: "Backend API",
    icon: Server,
    color: "from-purple-400 to-pink-500",
    techs: ["Authentication", "User Profiles", "Trip Management", "Reviews", "Analytics"]
  },
  {
    category: "Machine Learning Layer",
    icon: BrainCircuit,
    color: "from-emerald-400 to-green-500",
    techs: ["Recommendation Engine", "Price Prediction", "Sentiment Analysis", "User Profiling", "Itinerary Generator"]
  },
  {
    category: "MLOps Layer",
    icon: Activity,
    color: "from-red-400 to-orange-500",
    techs: ["Data Versioning", "Model Training", "Experiment Tracking", "Model Registry", "CI/CD", "Monitoring"]
  }
];

export default function Architecture() {
  return (
    <section className="py-24 max-w-4xl mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-4">
          System <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">Architecture</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          The end-to-end data flow powering TravelGPT's enterprise recommendation platform.
        </p>
      </div>

      <div className="flex flex-col items-center">
        
        {/* User Node */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center z-10 relative"
        >
          <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            <UserCircle size={32} className="text-white" />
          </div>
          <span className="mt-2 font-bold text-gray-300">User</span>
        </motion.div>

        {architecture.map((layer, idx) => {
          const Icon = layer.icon;
          return (
            <div key={layer.category} className="flex flex-col items-center w-full">
              {/* Arrow */}
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                whileInView={{ opacity: 1, height: "40px" }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="w-[2px] bg-gradient-to-b from-transparent to-white/50 relative my-2 flex justify-center items-end"
              >
                <ArrowDown size={16} className="text-white/50 absolute -bottom-3" />
              </motion.div>

              {/* Layer Node */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: (idx * 0.2) + 0.1 }}
                viewport={{ once: true }}
                className="glass-panel p-6 w-full max-w-3xl border-l-4 mt-4 relative overflow-hidden group hover:bg-white/5 transition-colors"
                style={{ borderLeftColor: layer.color.includes('cyan') ? '#22d3ee' : layer.color.includes('purple') ? '#c084fc' : layer.color.includes('emerald') ? '#34d399' : '#f87171' }}
              >
                {/* Glow */}
                <div className={`absolute top-1/2 -right-12 w-32 h-32 bg-gradient-to-r ${layer.color} opacity-10 rounded-full blur-3xl -translate-y-1/2 group-hover:opacity-20 transition-opacity`}></div>
                
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${layer.color} bg-opacity-20 shadow-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                  <h3 className="font-black text-white text-xl md:text-2xl">{layer.category}</h3>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {layer.techs.map((tech) => (
                    <span 
                      key={tech}
                      className="text-xs md:text-sm font-bold text-gray-300 bg-black/40 border border-white/10 px-3 py-1.5 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
