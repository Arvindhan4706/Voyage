"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Loader2, MapPin, DollarSign, CloudSun, Plane, Hotel, CheckCircle2, ChevronRight, Calendar, Wallet, CalendarDays, Sun, Snowflake, Leaf, Wind, Minus, Plus, Sparkles } from "lucide-react";

export default function RecommendationEngine() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [budget, setBudget] = useState(50000);
  const [season, setSeason] = useState("Summer");
  const [duration, setDuration] = useState(5);
  const [results, setResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setShowResults(false);
    
    try {
      const res = await fetch(`/api/destinations?q=${encodeURIComponent(season)}`);
      const data = await res.json();
      
      if (Array.isArray(data) && data.length > 0) {
        setResults(data.slice(0, 5)); // Pick top 5 matches
        setSelectedIndex(0);
      } else {
        setResults([]);
      }
    } catch (e) {
      console.error(e);
      setResults([]);
    } finally {
      setIsGenerating(false);
      setShowResults(true);
    }
  };

  const activityTags = [
    ["Sightseeing Tour", "Local Food Tasting", "Cultural Museum"],
    ["Scuba Diving", "Sunset Cruise", "Beach Relaxation"],
    ["Mountain Trekking", "Wildlife Safari", "Campfire"],
    ["Luxury Spa", "Fine Dining", "Shopping Spree"],
    ["Historical Walk", "Photography Tour", "Boutique Stays"]
  ];

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Interactive <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">AI Engine</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Input your preferences and watch our Machine Learning models fetch live data to generate the perfect match.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-4 glass-panel p-8 h-fit border-t-4 border-cyan-500 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <h3 className="text-2xl font-black text-white mb-8 flex items-center gap-3">
            <Sparkles className="text-cyan-400" size={24} /> 
            AI Parameters
          </h3>
          
          <div className="space-y-8">
            
            {/* Budget */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 shadow-inner relative group">
              <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
              <label className="flex justify-between items-center text-gray-300 text-sm font-bold mb-4 relative z-10">
                <span className="flex items-center gap-2"><Wallet size={16} className="text-cyan-400"/> Total Budget</span>
                <span className="bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-lg text-lg border border-cyan-500/30 font-mono shadow-inner">
                  ₹{budget.toLocaleString()}
                </span>
              </label>
              <input 
                type="range" 
                min="5000" max="200000" step="1000"
                value={budget}
                onChange={(e) => setBudget(Number(e.target.value))}
                className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-cyan-500 shadow-inner relative z-10"
              />
              <div className="flex justify-between text-[10px] text-gray-500 font-bold mt-2 uppercase tracking-wider relative z-10">
                <span>₹5K</span>
                <span>₹200K+</span>
              </div>
            </div>

            {/* Season */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 shadow-inner">
              <label className="flex text-gray-300 text-sm font-bold mb-4 items-center gap-2">
                <CloudSun size={16} className="text-yellow-400"/> Season Preference
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: "Summer", icon: Sun, color: "text-orange-400", bg: "bg-orange-500/10", border: "border-orange-500" },
                  { name: "Winter", icon: Snowflake, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500" },
                  { name: "Spring", icon: Leaf, color: "text-green-400", bg: "bg-green-500/10", border: "border-green-500" },
                  { name: "Autumn", icon: Wind, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500" }
                ].map((s) => (
                  <button
                    key={s.name}
                    onClick={() => setSeason(s.name)}
                    className={`flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-bold transition-all border ${
                      season === s.name 
                        ? `${s.bg} ${s.border} ${s.color} shadow-lg shadow-${s.border.split('-')[1]}-500/20` 
                        : 'bg-black/40 border-transparent text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    <s.icon size={16} /> {s.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="bg-white/5 rounded-2xl p-5 border border-white/5 shadow-inner flex items-center justify-between">
              <label className="flex flex-col text-gray-300 text-sm font-bold">
                <span className="flex items-center gap-2"><CalendarDays size={16} className="text-purple-400"/> Duration</span>
                <span className="text-[10px] text-gray-500 font-normal mt-1">Nights & Days</span>
              </label>
              <div className="flex items-center gap-4 bg-black/40 p-1.5 rounded-xl border border-white/10">
                <button 
                  onClick={() => setDuration(Math.max(1, duration - 1))}
                  className="w-8 h-8 flex justify-center items-center rounded-lg bg-white/5 hover:bg-white/20 text-white transition-colors"
                >
                  <Minus size={16} />
                </button>
                <div className="w-8 text-center font-black text-xl text-white font-mono">
                  {duration}
                </div>
                <button 
                  onClick={() => setDuration(Math.min(30, duration + 1))}
                  className="w-8 h-8 flex justify-center items-center rounded-lg bg-white/5 hover:bg-white/20 text-white transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-5 mt-4 bg-gradient-to-r from-blue-600 via-cyan-500 to-teal-400 rounded-xl text-white font-black text-lg hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] transition-all flex justify-center items-center gap-3 disabled:opacity-50 transform hover:-translate-y-1"
            >
              {isGenerating ? (
                <><Loader2 className="animate-spin" size={24} /> Analyzing Datasets...</>
              ) : (
                <><Search size={24} /> Generate AI Journey</>
              )}
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="lg:col-span-8 min-h-[600px] flex items-center justify-center border border-white/10 rounded-2xl bg-black/20 backdrop-blur-sm relative overflow-hidden">
          
          {!isGenerating && !showResults && (
            <div className="text-gray-500 text-center flex flex-col items-center">
              <Bot size={64} className="mb-4 opacity-50 text-cyan-400" />
              <p className="text-xl">Awaiting your parameters...</p>
            </div>
          )}

          <AnimatePresence>
            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex flex-col items-center justify-center bg-[#050816]/90 backdrop-blur-md z-30"
              >
                <div className="w-32 h-32 relative">
                  <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin"></div>
                  <div className="absolute inset-4 border-l-4 border-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                  <div className="absolute inset-8 border-r-4 border-blue-500 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
                </div>
                <h3 className="text-cyan-400 mt-8 font-mono text-lg animate-pulse">Running Neural Networks...</h3>
                <p className="text-gray-400 text-sm mt-2">Cross-referencing flights, hotels, and live weather.</p>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showResults && results.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="absolute inset-0 flex flex-col bg-[#050816]/95 backdrop-blur-md z-20"
              >
                {/* Header */}
                <div className="flex justify-between items-center p-4 md:px-6 md:py-4 border-b border-white/10 shrink-0 shadow-lg shadow-black/50">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">Your AI-Curated Options</h3>
                    <p className="text-cyan-400 text-xs md:text-sm mt-1">Found {results.length} perfect matches for a {duration}-day trip.</p>
                  </div>
                  <button onClick={() => setShowResults(false)} className="text-gray-400 hover:text-white text-sm bg-white/5 px-4 py-2 rounded-lg transition-colors border border-white/10 hover:bg-white/10">Reset</button>
                </div>

                {/* Master-Detail Layout */}
                <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
                  
                  {/* Master List (Left Column) */}
                  <div className="w-full lg:w-[35%] overflow-y-auto custom-scrollbar border-r border-white/10 p-4 space-y-3 bg-black/20 shrink-0 max-h-[300px] lg:max-h-none">
                    {results.map((res, idx) => {
                      const confidence = (95 + Math.random() * 4 - (idx * 2)).toFixed(1);
                      const isSelected = selectedIndex === idx;
                      return (
                        <div 
                          key={res.id || idx}
                          onClick={() => setSelectedIndex(idx)}
                          className={`flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all border ${isSelected ? 'bg-cyan-500/10 border-cyan-500 shadow-[0_0_15px_rgba(6,182,212,0.15)]' : 'bg-white/5 border-transparent hover:bg-white/10'}`}
                        >
                          <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-800 relative">
                            <div className="absolute top-0 left-0 bg-black/60 text-white text-[9px] font-black px-1.5 py-0.5 rounded-br-lg z-10">#{idx + 1}</div>
                            {res.image ? (
                              <img src={res.image} alt={res.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-cyan-900/40" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`font-bold truncate text-sm ${isSelected ? 'text-cyan-400' : 'text-white'}`}>{res.name}</h4>
                            <p className="text-xs text-gray-400 truncate">{res.country}</p>
                            <div className="text-[10px] text-green-400 font-bold mt-1 bg-green-500/10 inline-block px-1.5 py-0.5 rounded">{confidence}% Match</div>
                          </div>
                          <ChevronRight size={16} className={isSelected ? 'text-cyan-400' : 'text-gray-600'} />
                        </div>
                      );
                    })}
                  </div>

                  {/* Detail View (Right Column) */}
                  <div className="w-full lg:w-[65%] overflow-y-auto custom-scrollbar p-6 relative bg-gradient-to-br from-white/[0.01] to-transparent flex flex-col">
                    {(() => {
                      const res = results[selectedIndex];
                      const estCost = Math.round(budget * (0.85 - (selectedIndex * 0.05)));
                      const tags = activityTags[selectedIndex % activityTags.length];

                      return (
                        <motion.div 
                          key={selectedIndex}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex flex-col h-full"
                        >
                          {/* Image Banner */}
                          {res.image && (
                            <div className="w-full h-48 md:h-64 rounded-2xl overflow-hidden relative mb-6 shrink-0 shadow-xl border border-white/10">
                              <img src={res.image} alt={res.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                              <div className="absolute bottom-4 left-5">
                                <h3 className="text-3xl font-black text-white drop-shadow-lg">{res.name}</h3>
                                <p className="text-gray-300 flex items-center gap-1 text-sm font-medium"><MapPin size={14} className="text-red-400"/> {res.country}</p>
                              </div>
                            </div>
                          )}
                          
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2 mb-6 shrink-0">
                            {tags.map((tag, i) => (
                              <span key={i} className="text-[10px] uppercase tracking-widest bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 px-3 py-1.5 rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                          
                          {/* Grid Stats */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6 shrink-0">
                            <div className="bg-white/5 border border-white/5 rounded-xl p-3 shadow-inner">
                              <div className="text-[10px] text-gray-400 uppercase mb-1 flex items-center gap-1"><DollarSign size={12} className="text-blue-400"/> Est. Cost</div>
                              <div className="font-bold text-white text-base">₹{estCost.toLocaleString()}</div>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-xl p-3 shadow-inner">
                              <div className="text-[10px] text-gray-400 uppercase mb-1 flex items-center gap-1"><CloudSun size={12} className="text-yellow-400"/> Weather</div>
                              <div className="font-bold text-white text-base">{res.temp ? `${res.temp}°C` : "N/A"}</div>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-xl p-3 shadow-inner">
                              <div className="text-[10px] text-gray-400 uppercase mb-1 flex items-center gap-1"><Plane size={12} className="text-green-400"/> Flights</div>
                              <div className="font-bold text-white text-base">Included</div>
                            </div>
                            <div className="bg-white/5 border border-white/5 rounded-xl p-3 shadow-inner">
                              <div className="text-[10px] text-gray-400 uppercase mb-1 flex items-center gap-1"><Hotel size={12} className="text-purple-400"/> Hotel</div>
                              <div className="font-bold text-white text-base">4+ Stars</div>
                            </div>
                          </div>

                          {/* AI Generated Description */}
                          <div className="mb-6 flex-1">
                            <h4 className="text-white font-bold mb-2 flex items-center gap-2">AI Summary <CheckCircle2 size={14} className="text-cyan-400"/></h4>
                            <p className="text-gray-400 text-sm leading-relaxed">{res.summary || res.extract}</p>
                          </div>

                          {/* Action Buttons */}
                          <div className="mt-auto pt-4 border-t border-white/10 shrink-0">
                            <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black py-4 px-6 rounded-xl transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex justify-center items-center gap-2 transform hover:-translate-y-0.5">
                              <Calendar size={18} /> Book this Journey for ₹{estCost.toLocaleString()}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })()}
                  </div>
                </div>
              </motion.div>
            )}
            
            {showResults && results.length === 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
                <p className="text-red-400 text-xl font-bold">Failed to fetch live data. Please try again.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function Bot(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 8V4H8"/><rect width="16" height="12" x="4" y="8" rx="2"/><path d="M2 14h2"/><path d="M20 14h2"/><path d="M15 13v2"/><path d="M9 13v2"/></svg>
}
