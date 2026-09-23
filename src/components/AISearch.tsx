"use client";

import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Search } from "lucide-react";
import { useState } from "react";

export default function AISearch() {
  const t = useTranslations('Search');
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    const el = document.getElementById("destinations");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const suggestions = [
    "Hallstatt, Austria",
    "Giethoorn, Netherlands",
    "Gokarna, India",
    "Shirakawa-go, Japan",
    "Cinque Terre, Italy"
  ];

  return (
    <div className="w-full max-w-4xl mx-auto -mt-10 relative z-30 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="glass-panel p-2 mb-6 group transition-all duration-500 hover:shadow-[0_0_40px_rgba(212,175,55,0.15)] focus-within:shadow-[0_0_40px_rgba(212,175,55,0.2)] focus-within:border-[#D4AF37]/50"
      >
        <form onSubmit={handleSearch} className="flex items-center w-full">
          <div className="pl-6 pr-4 text-[#D4AF37] group-focus-within:animate-pulse">
            <Search size={22} strokeWidth={1.5} />
          </div>
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("placeholder")} 
            className="flex-1 bg-transparent border-none outline-none text-[#2a2a2a] dark:text-white text-xl font-serif placeholder:text-[#888888]/70 dark:placeholder:text-[#a3a3a3]/70 placeholder:font-serif placeholder:italic py-4 transition-all"
          />
          <button 
            type="submit"
            className="bg-black dark:bg-white hover:bg-[#D4AF37] dark:hover:bg-[#D4AF37] text-white dark:text-black text-[11px] tracking-[0.2em] uppercase font-semibold px-10 py-4 rounded-full transition-all duration-500 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
          >{t("button")}</button>
        </form>
      </motion.div>

      {/* Small Places Recommendations */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="flex flex-wrap items-center justify-center gap-2 mt-4"
      >
        <span className="text-sm text-gray-500 dark:text-gray-400 mr-2 font-serif italic">Hidden Gems:</span>
        {suggestions.map((place, i) => (
          <motion.button
            key={place}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 + i * 0.1, duration: 0.3 }}
            onClick={() => setQuery(place)}
            className="text-xs px-3 py-1.5 rounded-full border border-[#D4AF37]/30 bg-white/50 dark:bg-black/30 hover:bg-[#D4AF37]/10 hover:border-[#D4AF37] text-[#555] dark:text-[#ccc] transition-all cursor-pointer backdrop-blur-sm"
          >
            {place}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
