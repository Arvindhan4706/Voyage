"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Play, Thermometer, MapPin, Star, Globe } from "lucide-react";
import { useState, useEffect } from "react";

function SkeletonCard() {
  return (
    <div className="flex-shrink-0 w-[280px] h-[420px] md:w-[320px] md:h-[460px] rounded-2xl overflow-hidden snap-center bg-white/5 animate-pulse">
      <div className="w-full h-full bg-gradient-to-b from-white/10 to-transparent" />
    </div>
  );
}

export default function TrendingDestinations() {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const videoPool = [
    "https://cdn.pixabay.com/video/2020/05/10/38747-418759535_tiny.mp4",
    "https://cdn.pixabay.com/video/2019/04/10/22616-329437151_tiny.mp4",
    "https://cdn.pixabay.com/video/2020/02/16/32386-391851017_tiny.mp4",
    "https://cdn.pixabay.com/video/2020/06/13/41908-430378051_tiny.mp4",
  ];

  useEffect(() => {
    fetch("/api/destinations")
      .then((r) => r.json())
      .then((data: any[]) => {
        if (Array.isArray(data) && data.length > 0) {
          setDestinations(
            data.slice(0, 6).map((d, i) => ({
              ...d,
              video: videoPool[i % videoPool.length],
            }))
          );
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 w-full relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-10 flex items-end justify-between">
        <div>
          <h2 className="text-4xl md:text-5xl font-black mb-2">
            Trending{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
              Live
            </span>
          </h2>
          <p className="text-gray-400 flex items-center gap-2">
            <Globe size={14} className="text-cyan-400" /> AI Curated Destinations · Gemini Forecasts
          </p>
        </div>
        {!loading && !error && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xs text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full"
          >
            ● Live Data
          </motion.span>
        )}
      </div>

      <div className="flex overflow-x-auto gap-5 px-4 pb-12 custom-scrollbar pl-4 md:pl-16 snap-x">
        <AnimatePresence>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : error ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 py-12">
              <p>Could not load live data. Please refresh.</p>
            </div>
          ) : (
            destinations.map((place, idx) => (
              <motion.div
                key={place.id || idx}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, type: "spring", stiffness: 80 }}
                onHoverStart={() => setHoveredId(place.id)}
                onHoverEnd={() => setHoveredId(null)}
                className="relative flex-shrink-0 w-[280px] h-[420px] md:w-[320px] md:h-[460px] rounded-2xl overflow-hidden cursor-pointer snap-center group"
                style={{
                  transform:
                    hoveredId === place.id
                      ? "scale(1.07)"
                      : hoveredId
                      ? "scale(0.96)"
                      : "scale(1)",
                  zIndex: hoveredId === place.id ? 50 : 10,
                  transition: "transform 0.4s ease",
                }}
              >
                {/* Background: real Wikipedia image or video on hover */}
                {hoveredId === place.id ? (
                  <video
                    src={place.video}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : place.image ? (
                  <img
                    src={place.image}
                    alt={place.name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80";
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-b from-cyan-900/40 to-blue-900/80" />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 w-full p-6">
                  <h3 className="text-2xl font-black text-white mb-1 flex items-center gap-2">
                    <MapPin size={18} className="text-red-400 shrink-0" />
                    {place.name}
                  </h3>
                  {place.country && (
                    <p className="text-gray-300 text-xs mb-3 font-medium">{place.country}</p>
                  )}

                  <div className="grid grid-cols-3 gap-2 mb-2">
                    <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-lg p-2">
                      <Thermometer size={14} className="text-orange-400 mb-1" />
                      <span className="text-xs font-bold">{place.temp ? `${place.temp}°C` : "N/A"}</span>
                    </div>
                    <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-lg p-2">
                      <Star size={14} className="text-yellow-400 mb-1" />
                      <span className="text-xs font-bold">{place.ratings?.toFixed(1) || "4.5"}</span>
                    </div>
                    <div className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-lg p-2">
                      <Globe size={14} className="text-cyan-400 mb-1" />
                      <span className="text-xs font-bold">Live</span>
                    </div>
                  </div>

                  {/* Hover expand: real description */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{
                      height: hoveredId === place.id ? "auto" : 0,
                      opacity: hoveredId === place.id ? 1 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 border-t border-white/20 mt-1">
                      <p className="text-xs text-gray-300 mb-3 line-clamp-3">{place.summary || place.extract}</p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
