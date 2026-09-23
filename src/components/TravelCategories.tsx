"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Mountain, Waves, Flame, Utensils, Camera, Car, PawPrint, User, Users, Briefcase, Heart, TreePine, Play, Thermometer, MapPin, Star, Globe } from "lucide-react";
import { useState } from "react";

const categories = [
  { name: "Adventure", icon: Flame },
  { name: "Luxury", icon: Heart },
  { name: "Beach", icon: Waves },
  { name: "Nature", icon: TreePine },
  { name: "Spiritual", icon: Mountain },
  { name: "Culinary", icon: Utensils },
  { name: "Photography", icon: Camera },
  { name: "Road Trips", icon: Car },
  { name: "Wildlife", icon: PawPrint },
  { name: "Solo Travel", icon: User },
  { name: "Family", icon: Users },
  { name: "Business", icon: Briefcase },
];

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[240px] h-[340px] md:w-[280px] md:h-[400px] rounded-2xl overflow-hidden snap-center bg-[#eaeaea] dark:bg-[#333333] animate-pulse">
      <div className="w-full h-full bg-gradient-to-b from-black/5 to-transparent dark:from-white/5" />
    </div>
  );
}

export default function TravelCategories() {
  const t = useTranslations('Categories');
  
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const videoPool = [
    "https://cdn.pixabay.com/video/2020/05/10/38747-418759535_tiny.mp4",
    "https://cdn.pixabay.com/video/2019/04/10/22616-329437151_tiny.mp4",
    "https://cdn.pixabay.com/video/2020/02/16/32386-391851017_tiny.mp4",
    "https://cdn.pixabay.com/video/2020/06/13/41908-430378051_tiny.mp4",
  ];

  const handleCategoryClick = async (categoryName: string) => {
    if (selectedCategory === categoryName) return; // Already selected
    
    setSelectedCategory(categoryName);
    setLoading(true);
    setError(false);
    setRecommendations([]);

    try {
      // Just pass the categoryName; the API will append "tourist destination"
      const res = await fetch(`/api/destinations?q=${encodeURIComponent(categoryName)}`);
      const data = await res.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setRecommendations(
          data.map((d: any, i: number) => ({
            ...d,
            video: videoPool[i % videoPool.length],
          }))
        );
      } else {
        setError(true);
      }
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 border-t border-[#eaeaea] dark:border-[#333333]">
      <div className="text-center mb-16">
        <p className="text-[10px] tracking-[0.2em] uppercase text-[#888888] dark:text-[#a3a3a3] font-medium mb-3">{t("subtitle")}</p>
        <h2 className="text-4xl md:text-5xl font-serif text-black dark:text-white mb-4">{t("title")}</h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-12 mb-16">
        {categories.map((cat, index) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.name;
          
          return (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => handleCategoryClick(cat.name)}
              className="flex flex-col items-center justify-center gap-4 group cursor-pointer"
            >
              <div className={`w-16 h-16 rounded-full border flex items-center justify-center transition-all duration-500 
                ${isSelected ? 'border-[#D4AF37] bg-[#D4AF37] shadow-[0_0_20px_rgba(212,175,55,0.4)]' : 'bg-white dark:bg-black border-[#eaeaea] dark:border-[#333333] group-hover:border-[#D4AF37] group-hover:bg-[#D4AF37]/5'}
              `}>
                <Icon size={22} className={`transition-colors duration-500 ${isSelected ? 'text-white dark:text-black' : 'text-black dark:text-white group-hover:text-[#D4AF37]'}`} strokeWidth={1} />
              </div>
              <span className={`text-[11px] tracking-widest uppercase font-medium text-center transition-colors duration-500
                ${isSelected ? 'text-[#D4AF37]' : 'text-[#888888] dark:text-[#a3a3a3] group-hover:text-black dark:group-hover:text-white'}
              `}>{cat.name}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Dynamic Recommendations Section */}
      <AnimatePresence>
        {(selectedCategory || loading) && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden w-full flex flex-col items-center"
          >
            <div className="w-full h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mb-12" />
            
            <h3 className="text-2xl md:text-3xl font-serif text-center mb-8">
              Top <span className="text-[#D4AF37] italic">{selectedCategory}</span> Destinations
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4 pb-12 w-full max-w-7xl mx-auto">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="w-full h-[340px] md:h-[400px] rounded-2xl bg-[#eaeaea] dark:bg-[#333333] animate-pulse">
                    <div className="w-full h-full bg-gradient-to-b from-black/5 to-transparent dark:from-white/5" />
                  </div>
                ))
              ) : error ? (
                <div className="col-span-full flex items-center justify-center text-[#888888] py-12">
                  <p>Could not load recommendations. Please try another category.</p>
                </div>
              ) : (
                recommendations.map((place, idx) => (
                  <motion.div
                    key={place.id || idx}
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: (idx % 10) * 0.1, type: "spring", stiffness: 80 }}
                    onHoverStart={() => setHoveredId(place.id)}
                    onHoverEnd={() => setHoveredId(null)}
                    className="relative w-full h-[340px] md:h-[400px] rounded-2xl overflow-hidden cursor-pointer group"
                    style={{
                      transform: hoveredId === place.id ? "scale(1.05)" : hoveredId ? "scale(0.98)" : "scale(1)",
                      zIndex: hoveredId === place.id ? 50 : 10,
                      transition: "transform 0.4s ease",
                    }}
                  >
                    {/* Background */}
                    {hoveredId === place.id ? (
                      <video
                        src={place.video}
                        autoPlay loop muted playsInline
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    ) : place.image ? (
                      <img
                        src={place.image}
                        alt={place.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80";
                        }}
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/40 to-black/80" />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                    <div className="absolute bottom-0 left-0 w-full p-5">
                      <h4 className="text-xl font-black text-white mb-1 flex items-center gap-2">
                        <MapPin size={16} className="text-[#D4AF37] shrink-0" />
                        {place.name}
                      </h4>
                      {place.country && (
                        <p className="text-gray-300 text-xs mb-3 font-medium">{place.country}</p>
                      )}

                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div className="flex items-center justify-center gap-1 bg-white/10 backdrop-blur-md rounded-lg p-1.5">
                          <Thermometer size={12} className="text-orange-400" />
                          <span className="text-[10px] font-bold text-white">{place.temp ? `${place.temp}°C` : "N/A"}</span>
                        </div>
                        <div className="flex items-center justify-center gap-1 bg-white/10 backdrop-blur-md rounded-lg p-1.5">
                          <Star size={12} className="text-yellow-400" />
                          <span className="text-[10px] font-bold text-white">{place.ratings?.toFixed(1) || "4.5"}</span>
                        </div>
                      </div>

                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: hoveredId === place.id ? "auto" : 0, opacity: hoveredId === place.id ? 1 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-2 border-t border-white/20 mt-2">
                          <p className="text-[10px] text-gray-300 mb-2 line-clamp-3">{place.summary || place.extract}</p>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
