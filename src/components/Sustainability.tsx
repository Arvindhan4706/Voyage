"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Leaf, TreePine, Wind, Zap } from 'lucide-react';

const stats = [
  { id: 1, name: 'Carbon Offset', value: '2.4 Tons', icon: Wind, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  { id: 2, name: 'Trees Planted', value: '14', icon: TreePine, color: 'text-green-400', bg: 'bg-green-400/10' },
  { id: 3, name: 'Eco-Stays', value: '5 Nights', icon: Leaf, color: 'text-teal-400', bg: 'bg-teal-400/10' },
  { id: 4, name: 'Energy Saved', value: '340 kWh', icon: Zap, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
];

export default function Sustainability() {
  return (
    <section id="sustainability" className="relative py-24 bg-black overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-emerald-900/20 via-black to-black" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
            <Leaf className="w-4 h-4" />
            <span>Voyage Earth Initiative</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
            Travel That Leaves a <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Green Footprint</span>
          </h2>
          <p className="text-lg text-gray-400">
            We automatically calculate and offset the carbon footprint of your AI-planned trips. 
            Track your positive environmental impact globally.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <div className={`w-12 h-12 rounded-2xl ${stat.bg} flex items-center justify-center mb-6`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-3xl font-black text-white mb-2">{stat.value}</div>
                <div className="text-sm font-medium text-gray-400">{stat.name}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Progress Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-12 p-8 rounded-3xl bg-emerald-900/20 border border-emerald-500/20 flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-white mb-2">Voyage Global Goal 2026</h3>
            <p className="text-gray-400 mb-4">Help us reach 1,000,000 tons of carbon offset by choosing eco-friendly travel options recommended by our AI.</p>
            <div className="w-full h-3 bg-black/50 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "42%" }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
              />
            </div>
            <div className="flex justify-between mt-2 text-sm font-medium">
              <span className="text-emerald-400">420,000 Tons Offset</span>
              <span className="text-gray-500">1,000,000 Goal</span>
            </div>
          </div>
          <button className="px-8 py-4 rounded-full bg-emerald-500 hover:bg-emerald-400 text-black font-bold transition-colors shrink-0">
            View My Impact Report
          </button>
        </motion.div>
      </div>
    </section>
  );
}
