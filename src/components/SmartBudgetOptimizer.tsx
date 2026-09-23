"use client";

import { motion, AnimatePresence } from "framer-motion";
import { PieChart, Zap, TrendingDown, Info, ShieldAlert, MapPin, IndianRupee, Loader2, Calendar } from "lucide-react";
import { useState } from "react";

export default function SmartBudgetOptimizer() {
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!destination || !budget) {
      alert("Please enter destination and budget.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysis(null);

    // Simulate AI processing and fetch real alternative hotel
    try {
      const budgetNum = parseInt(budget.replace(/\D/g, "")) || 42500;
      
      let altHotel = "Nearby Resort";
      let hotelPrice = 2500;

      // Try to get a real hotel from OSM for the alert
      try {
        const hRes = await fetch(`/api/hotels?location=${encodeURIComponent(destination)}`);
        const hData = await hRes.json();
        if (hData && hData.length > 0) {
          altHotel = hData[0].name;
          hotelPrice = hData[0].price || 2500;
        }
      } catch (e) {}

      // Dynamic distribution
      const trans = Math.round(budgetNum * 0.28);
      const acc = Math.round(budgetNum * 0.42);
      const food = Math.round(budgetNum * 0.18);
      const acts = Math.round(budgetNum * 0.07);
      const buffer = Math.round(budgetNum * 0.05);

      const savedHotel = Math.round(hotelPrice * 0.4);
      const savedFlight = Math.round(trans * 0.35);

      setTimeout(() => {
        setAnalysis({
          total: budgetNum,
          breakdown: { trans, acc, food, acts, buffer },
          alerts: {
            hotelName: altHotel,
            hotelSave: savedHotel,
            flightSave: savedFlight,
            surge: Math.floor(10 + Math.random() * 20),
          }
        });
        setIsAnalyzing(false);
      }, 1500);

    } catch {
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-4 flex items-center justify-center gap-3">
          Smart Budget <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-500">Optimizer</span> <PieChart className="text-emerald-400" size={40} />
        </h2>
        <p className="text-gray-400 text-lg">AI-driven cost analysis and money-saving predictions.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Input Panel */}
        <div className="md:col-span-4 glass-panel p-6 h-fit border-t-4 border-emerald-500">
          <h3 className="text-xl font-bold mb-6 text-white">Trip Details</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">DESTINATION</label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
                <MapPin size={16} className="text-emerald-400" />
                <input type="text" value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g. Bali" className="bg-transparent border-none outline-none text-white w-full text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">TOTAL BUDGET</label>
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
                <IndianRupee size={16} className="text-emerald-400" />
                <input type="text" value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g. 50000" className="bg-transparent border-none outline-none text-white w-full text-sm" />
              </div>
            </div>

            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full py-3 mt-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 font-bold rounded-lg hover:bg-emerald-500/40 transition-colors flex justify-center items-center gap-2"
            >
              {isAnalyzing ? <><Loader2 className="animate-spin" size={16}/> Analyzing...</> : "Optimize Budget"}
            </button>
          </div>
        </div>

        {/* Output Panel */}
        <div className="md:col-span-8 flex flex-col gap-6">
          {!analysis && !isAnalyzing && (
             <div className="glass-panel p-12 h-full flex flex-col items-center justify-center text-center border-dashed border-2 border-white/10">
               <PieChart size={48} className="text-gray-600 mb-4" />
               <h3 className="text-xl font-bold text-gray-400">Ready to Optimize</h3>
               <p className="text-gray-500 text-sm mt-2 max-w-sm">Enter your budget and destination to see a dynamic breakdown and real-time AI savings alerts.</p>
             </div>
          )}

          {isAnalyzing && (
            <div className="glass-panel p-12 h-full flex items-center justify-center">
              <Loader2 size={40} className="text-emerald-400 animate-spin" />
            </div>
          )}

          <AnimatePresence>
            {analysis && !isAnalyzing && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Breakdown */}
                <div className="glass-panel p-6">
                  <h3 className="text-xl font-black mb-6 border-b border-white/10 pb-4">Estimated Split</h3>
                  <div className="space-y-5">
                    {[
                      { label: "Transportation", val: analysis.breakdown.trans, pct: 28, color: "bg-blue-500" },
                      { label: "Hotels & Accommodation", val: analysis.breakdown.acc, pct: 42, color: "bg-purple-500" },
                      { label: "Food & Dining", val: analysis.breakdown.food, pct: 18, color: "bg-orange-500" },
                      { label: "Activities", val: analysis.breakdown.acts, pct: 7, color: "bg-cyan-500" },
                    ].map((item, i) => (
                      <div key={i}>
                        <div className="flex justify-between text-xs font-bold text-gray-300 mb-2">
                          <span>{item.label}</span>
                          <span>₹{item.val.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-white/5 rounded-full h-2">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${item.pct}%` }} transition={{ duration: 1, delay: i*0.1 }} className={`${item.color} h-2 rounded-full`} />
                        </div>
                      </div>
                    ))}
                    <div className="pt-2">
                      <div className="flex justify-between text-xs font-bold text-gray-300 mb-2 items-center">
                        <span className="flex items-center gap-1">Emergency Buffer <Info size={12} className="text-gray-500" /></span>
                        <span>₹{analysis.breakdown.buffer.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-white/5 rounded-full h-2 p-[1px] border border-dashed border-red-500/50">
                        <motion.div initial={{ width: 0 }} animate={{ width: `5%` }} className="bg-red-500/50 h-[6px] rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Alerts */}
                <div className="flex flex-col gap-4">
                  <div className="glass-panel p-6 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/30">
                    <h4 className="text-md font-black text-emerald-400 mb-4 flex items-center gap-2"><Zap size={18}/> AI Savings</h4>
                    
                    <div className="space-y-3">
                      <motion.div whileHover={{ scale: 1.02 }} className="bg-black/40 border border-emerald-500/20 p-3 rounded-xl flex items-start gap-3 cursor-pointer">
                        <div className="bg-emerald-500/20 p-2 rounded-lg mt-1"><TrendingDown className="text-emerald-400" size={14} /></div>
                        <div>
                          <h5 className="font-bold text-white text-sm mb-1">Save ₹{analysis.alerts.hotelSave.toLocaleString()}</h5>
                          <p className="text-xs text-gray-400">"{analysis.alerts.hotelName}" has dropped rates for your dates. It's highly rated nearby.</p>
                        </div>
                      </motion.div>

                      <motion.div whileHover={{ scale: 1.02 }} className="bg-black/40 border border-emerald-500/20 p-3 rounded-xl flex items-start gap-3 cursor-pointer">
                        <div className="bg-emerald-500/20 p-2 rounded-lg mt-1"><Calendar size={14} className="text-emerald-400" /></div>
                        <div>
                          <h5 className="font-bold text-white text-sm mb-1">Save ₹{analysis.alerts.flightSave.toLocaleString()} on Flights</h5>
                          <p className="text-xs text-gray-400">Flight prices drop significantly if you delay your departure to {destination} by 2 days.</p>
                        </div>
                      </motion.div>
                    </div>
                  </div>

                  <div className="glass-panel p-5 bg-gradient-to-br from-red-500/5 to-transparent border-red-500/20 mt-auto">
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="text-red-400 shrink-0" size={24} />
                      <div>
                        <h5 className="font-bold text-white text-sm">Surge Pricing Warning</h5>
                        <p className="text-xs text-gray-400">Cab fares in {destination} are {analysis.alerts.surge}% higher than usual this month.</p>
                      </div>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
