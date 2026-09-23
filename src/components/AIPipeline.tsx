"use client";

import { motion } from "framer-motion";
import { Database, GitCommit, ListTree, RefreshCw, Activity } from "lucide-react";

export default function AIPipeline() {
  const steps = [
    { 
      title: "Data Versioning", 
      tool: "DVC",
      desc: "Versioning tourism datasets & review streams.",
      icon: <Database size={24} className="text-blue-400" />
    },
    { 
      title: "Experiment Tracking", 
      tool: "MLflow",
      desc: "Tracking Model Accuracy, Version, Hyperparameters, Training Time.",
      icon: <GitCommit size={24} className="text-purple-400" />
    },
    { 
      title: "Model Registry", 
      tool: "Storage",
      desc: "Recommendation Model v1 & v2, Price Prediction v3.",
      icon: <ListTree size={24} className="text-cyan-400" />
    },
    { 
      title: "Continuous Training", 
      tool: "Workflow",
      desc: "New Reviews → Retrain → Gen → Val → Deploy.",
      icon: <RefreshCw size={24} className="text-emerald-400" />
    },
    { 
      title: "Monitoring", 
      tool: "Grafana",
      desc: "Accuracy, Latency, Drift Detection, User Engagement.",
      icon: <Activity size={24} className="text-pink-400" />
    },
  ];

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto overflow-hidden relative">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Enterprise <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500">MLOps</span> Pipeline
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Industry-level infrastructure ensuring continuous deployment and high-accuracy models.
        </p>
      </div>

      <div className="relative mt-20">
        {/* Animated Connecting Line */}
        <div className="absolute top-12 left-0 w-full h-1 bg-white/10 hidden md:block">
          <motion.div 
            className="h-full bg-gradient-to-r from-cyan-500 to-purple-500"
            initial={{ width: "0%" }}
            whileInView={{ width: "100%" }}
            transition={{ duration: 2, ease: "easeInOut" }}
            viewport={{ once: true, margin: "-100px" }}
          />
        </div>

        {/* Pipeline Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative z-10">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              viewport={{ once: true, margin: "-50px" }}
              className="flex flex-col items-center text-center group"
            >
              <div className="w-24 h-24 rounded-2xl glass-panel flex flex-col items-center justify-center mb-6 border border-white/20 group-hover:border-cyan-400 transition-colors shadow-[0_0_15px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_20px_rgba(6,182,212,0.6)] bg-[#050816] z-10 relative">
                {step.icon}
                <span className="text-[10px] uppercase font-bold text-gray-500 mt-2">{step.tool}</span>
              </div>
              <h4 className="text-white font-bold mb-2 text-lg">{step.title}</h4>
              <p className="text-sm text-gray-400 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5">{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
