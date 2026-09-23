"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Star } from "lucide-react";
import Link from "next/link";

export default function DestinationCards({ showExploreLink = true }: { showExploreLink?: boolean }) {
  const t = useTranslations('Destinations');
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/destinations?q=luxury")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          setDestinations(data.slice(0, 4));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
        <div>
          <p className="text-[10px] tracking-[0.2em] uppercase text-[#888888] dark:text-[#a3a3a3] font-medium mb-3">{t("subtitle")}</p>
          <h2 className="text-4xl md:text-5xl font-serif text-black dark:text-white">{t("title")}</h2>
        </div>
        {showExploreLink && (
          <Link href="/destinations" className="text-[11px] tracking-[0.1em] uppercase text-black dark:text-white font-semibold hover:text-[#D4AF37] dark:hover:text-[#D4AF37] transition-colors border-b border-black dark:border-white hover:border-[#D4AF37] dark:hover:border-[#D4AF37] pb-1 cursor-pointer">{t("explore")}</Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="animate-pulse flex flex-col">
              <div className="relative aspect-[3/4] overflow-hidden mb-6 bg-[#eaeaea] dark:bg-[#333]" />
              <div className="h-6 bg-[#eaeaea] dark:bg-[#333] w-3/4 mb-2" />
              <div className="h-4 bg-[#eaeaea] dark:bg-[#333] w-1/2" />
            </div>
          ))
        ) : (
          destinations.map((rec, index) => (
            <motion.div
              key={rec.name || index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="group cursor-pointer flex flex-col glass-panel overflow-hidden"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-white dark:bg-black">
                <img 
                  src={rec.image || "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"} 
                  alt={rec.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-[0.16,1,0.3,1]" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="absolute top-4 right-4 bg-white/80 dark:bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-medium flex items-center gap-1.5 shadow-sm text-black dark:text-white tracking-widest border border-white/20">
                  <Star size={10} className="fill-[#D4AF37] text-[#D4AF37]" /> {rec.ratings?.toFixed(1) || "4.8"}
                </div>
                
                <div className="absolute bottom-0 left-0 w-full p-6 flex justify-between items-end transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                  <div className="pr-2 text-white">
                    <p className="text-white/80 text-[10px] tracking-[0.2em] uppercase mb-1 drop-shadow-md">
                      {rec.country}
                    </p>
                    <h3 className="font-serif text-2xl mb-1 group-hover:text-[#D4AF37] transition-colors truncate max-w-[150px] drop-shadow-lg">{rec.name}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-[10px] tracking-[0.2em] text-white/80 uppercase mb-1 drop-shadow-md">{t("from")}</p>
                    <p className="font-medium text-white drop-shadow-lg">₹{(Math.floor(Math.random() * 40) + 20)},000</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </section>
  );
}
