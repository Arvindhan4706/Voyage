"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, BellRing, Plane, LineChart, Cpu, MapPin, Loader2, Calendar, Users, Briefcase, Plus, X } from "lucide-react";
import { useState } from "react";

type TripType = "oneway" | "roundtrip" | "multicity";

export default function FlightsModule() {
  const [tripType, setTripType] = useState<TripType>("oneway");
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [departDate, setDepartDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState(1);
  const [travelClass, setTravelClass] = useState("Economy");
  
  // Multi-city state
  const [multiCityRoutes, setMultiCityRoutes] = useState([{ source: "", destination: "", date: "" }, { source: "", destination: "", date: "" }]);

  const [isPredicting, setIsPredicting] = useState(false);
  const [prediction, setPrediction] = useState<any>(null);

  const handlePredict = async () => {
    if (tripType !== "multicity" && (!source || !destination)) {
      alert("Please enter both source and destination.");
      return;
    }

    setIsPredicting(true);
    setPrediction(null);

    // For multi-city, we just use the first leg for the prediction demo
    const searchSource = tripType === "multicity" ? multiCityRoutes[0].source : source;
    const searchDest = tripType === "multicity" ? multiCityRoutes[0].destination : destination;

    try {
      const res = await fetch("/api/price", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: searchSource, destination: searchDest, dates: departDate || new Date().toISOString(), passengers })
      });
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);
      
      // Multiply prediction for roundtrip
      if (tripType === "roundtrip") {
        data.price *= 1.8; // Round trip discount
        data.historical_low *= 1.8;
        data.historical_high *= 1.8;
      }
      
      setPrediction(data);
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Failed to predict price. Please check destinations.");
    } finally {
      setIsPredicting(false);
    }
  };

  const addMultiCityRoute = () => {
    if (multiCityRoutes.length < 5) {
      setMultiCityRoutes([...multiCityRoutes, { source: "", destination: "", date: "" }]);
    }
  };

  const updateMultiCity = (index: number, field: string, value: string) => {
    const newRoutes = [...multiCityRoutes];
    (newRoutes[index] as any)[field] = value;
    setMultiCityRoutes(newRoutes);
  };

  const removeMultiCityRoute = (index: number) => {
    const newRoutes = [...multiCityRoutes];
    newRoutes.splice(index, 1);
    setMultiCityRoutes(newRoutes);
  };

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 flex items-center gap-3">
            Advanced <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">Flight Search</span> <Plane className="text-cyan-400" size={40} />
          </h2>
          <p className="text-gray-400 text-lg">Powered by AI pricing predictions & dynamic mapping.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Advanced OTA Input Panel */}
        <div className="glass-panel p-6 h-fit border-t-4 border-cyan-500 lg:col-span-1">
          
          <div className="flex gap-2 mb-6 bg-black/40 p-1 rounded-lg">
            <button onClick={() => setTripType("oneway")} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${tripType === "oneway" ? "bg-cyan-500 text-white" : "text-gray-400 hover:text-white"}`}>One Way</button>
            <button onClick={() => setTripType("roundtrip")} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${tripType === "roundtrip" ? "bg-cyan-500 text-white" : "text-gray-400 hover:text-white"}`}>Round Trip</button>
            <button onClick={() => setTripType("multicity")} className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${tripType === "multicity" ? "bg-cyan-500 text-white" : "text-gray-400 hover:text-white"}`}>Multi-City</button>
          </div>
          
          <div className="space-y-4">
            
            {(tripType === "oneway" || tripType === "roundtrip") && (
              <>
                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">FROM</label>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2 hover:border-cyan-500/50 transition-colors">
                    <MapPin size={16} className="text-gray-400" />
                    <input type="text" value={source} onChange={e => setSource(e.target.value)} placeholder="e.g. Delhi (DEL)" className="bg-transparent border-none outline-none text-white w-full text-sm font-semibold" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">TO</label>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2 hover:border-cyan-500/50 transition-colors">
                    <MapPin size={16} className="text-cyan-400" />
                    <input type="text" value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g. Bali (DPS)" className="bg-transparent border-none outline-none text-white w-full text-sm font-semibold" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-bold text-gray-500 mb-1 block">DEPART</label>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2 hover:border-cyan-500/50 transition-colors">
                      <Calendar size={14} className="text-gray-400" />
                      <input type="date" value={departDate} onChange={e => setDepartDate(e.target.value)} className="bg-transparent border-none outline-none text-white w-full text-xs" />
                    </div>
                  </div>
                  
                  {tripType === "roundtrip" && (
                    <div>
                      <label className="text-xs font-bold text-gray-500 mb-1 block">RETURN</label>
                      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2 hover:border-cyan-500/50 transition-colors">
                        <Calendar size={14} className="text-cyan-400" />
                        <input type="date" value={returnDate} onChange={e => setReturnDate(e.target.value)} className="bg-transparent border-none outline-none text-white w-full text-xs" />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {tripType === "multicity" && (
              <div className="space-y-4">
                {multiCityRoutes.map((route, i) => (
                  <div key={i} className="p-3 bg-white/5 border border-white/10 rounded-lg relative">
                    {i > 1 && (
                      <button onClick={() => removeMultiCityRoute(i)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600">
                        <X size={12} />
                      </button>
                    )}
                    <p className="text-[10px] text-gray-500 font-bold mb-2 uppercase tracking-wider">Flight {i + 1}</p>
                    <input type="text" value={route.source} onChange={e => updateMultiCity(i, 'source', e.target.value)} placeholder="From" className="bg-black/30 border border-white/10 rounded p-1.5 w-full text-xs text-white mb-2" />
                    <input type="text" value={route.destination} onChange={e => updateMultiCity(i, 'destination', e.target.value)} placeholder="To" className="bg-black/30 border border-white/10 rounded p-1.5 w-full text-xs text-white mb-2" />
                    <input type="date" value={route.date} onChange={e => updateMultiCity(i, 'date', e.target.value)} className="bg-black/30 border border-white/10 rounded p-1.5 w-full text-xs text-gray-400" />
                  </div>
                ))}
                {multiCityRoutes.length < 5 && (
                  <button onClick={addMultiCityRoute} className="w-full py-2 text-xs font-bold text-cyan-400 flex items-center justify-center gap-1 border border-dashed border-cyan-500/30 rounded-lg hover:bg-cyan-500/10">
                    <Plus size={14} /> Add Flight
                  </button>
                )}
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
               <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">PASSENGERS</label>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
                    <Users size={14} className="text-gray-400" />
                    <select value={passengers} onChange={e => setPassengers(parseInt(e.target.value))} className="bg-transparent border-none outline-none text-white w-full text-xs appearance-none">
                      {[1,2,3,4,5,6,7,8,9].map(n => <option key={n} value={n} className="bg-gray-900">{n}</option>)}
                    </select>
                  </div>
               </div>
               <div>
                  <label className="text-xs font-bold text-gray-500 mb-1 block">CLASS</label>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg p-2">
                    <Briefcase size={14} className="text-gray-400" />
                    <select value={travelClass} onChange={e => setTravelClass(e.target.value)} className="bg-transparent border-none outline-none text-white w-full text-xs appearance-none">
                      <option className="bg-gray-900">Economy</option>
                      <option className="bg-gray-900">Premium</option>
                      <option className="bg-gray-900">Business</option>
                      <option className="bg-gray-900">First</option>
                    </select>
                  </div>
               </div>
            </div>

            <button 
              onClick={handlePredict}
              disabled={isPredicting}
              className="w-full py-4 mt-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-black rounded-lg shadow-lg hover:shadow-cyan-500/25 transition-all flex justify-center items-center gap-2 transform hover:-translate-y-1"
            >
              {isPredicting ? <><Loader2 className="animate-spin" size={18}/> Searching Airlines...</> : "Search Flights"}
            </button>
          </div>
        </div>

        {/* Dynamic Search Results & Predictions */}
        <div className="lg:col-span-3 space-y-6">
          {!prediction && !isPredicting && (
             <div className="glass-panel p-12 h-full flex flex-col items-center justify-center text-center border-dashed border-2 border-white/10">
               <Plane size={64} className="text-gray-700 mb-6 transform -rotate-45" />
               <h3 className="text-2xl font-bold text-gray-300">Where to next?</h3>
               <p className="text-gray-500 text-sm mt-3 max-w-md">Search hundreds of airlines and millions of routes to find the best prices. Our AI model will predict the optimal time to book.</p>
             </div>
          )}

          {isPredicting && (
            <div className="glass-panel p-12 h-full flex flex-col items-center justify-center">
              <Loader2 size={48} className="text-cyan-400 animate-spin mb-4" />
              <p className="text-cyan-400 font-bold animate-pulse">Running advanced ML pricing models...</p>
            </div>
          )}

          <AnimatePresence>
            {prediction && !isPredicting && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                
                {/* Advanced Search Results Header */}
                <div className="glass-panel p-6 flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-cyan-900/30 to-blue-900/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center text-cyan-400">
                      <Plane size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-white">
                        {tripType === "multicity" ? "Multi-City Itinerary" : `${source} to ${destination}`}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {tripType === "roundtrip" ? "Round Trip" : tripType === "multicity" ? `${multiCityRoutes.length} Flights` : "One Way"} • {passengers} Passenger(s) • {travelClass}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <p className="text-sm text-gray-400">Best Price Guaranteed</p>
                    <p className="text-3xl font-black text-white">₹{prediction.price.toLocaleString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Price Prediction Graph (Maintained & Upgraded) */}
                  <div className="glass-panel p-6 relative overflow-hidden group">
                    <div className="flex justify-between items-center mb-8">
                      <div>
                        <h3 className="text-lg font-black text-white flex items-center gap-2">
                          <LineChart className="text-cyan-400 shrink-0" /> AI Price Trend
                        </h3>
                        <p className="text-gray-400 text-[10px] mt-1">Based on historical data for {prediction.distance_km}km flights</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block text-[10px] text-cyan-400 font-bold uppercase tracking-wider">AI Recommendation</span>
                        <span className="text-sm font-black text-white px-2 py-1 bg-gradient-to-r from-emerald-500 to-green-600 rounded mt-1 inline-block">
                          {prediction.trend === "rising" ? "Book Now" : "Wait to Book"}
                        </span>
                      </div>
                    </div>

                    {/* Graph Visualization */}
                    <div className="relative h-48 w-full flex items-end justify-between px-2 pb-6 border-b border-l border-white/20">
                      <div className="w-[12%] bg-blue-500/20 h-[40%] rounded-t-sm"></div>
                      <div className="w-[12%] bg-blue-500/30 h-[50%] rounded-t-sm"></div>
                      <div className="w-[12%] bg-blue-500/40 h-[60%] rounded-t-sm relative"><span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">₹{prediction.historical_low.toLocaleString()}</span></div>
                      
                      {/* Today */}
                      <div className="w-[12%] bg-cyan-500/60 h-[75%] rounded-t-sm relative">
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-cyan-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded shadow-[0_0_10px_rgba(6,182,212,0.6)] whitespace-nowrap z-10 flex flex-col items-center">
                          <span>Today</span>
                          <span>₹{prediction.price.toLocaleString()}</span>
                        </div>
                      </div>
                      
                      {/* Simulated Data Points (Predicted) */}
                      <div className={`w-[12%] border border-dashed ${prediction.trend === 'rising' ? 'border-red-500/50 bg-red-500/20' : 'border-green-500/50 bg-green-500/20'} h-[${prediction.trend === 'rising' ? '85' : '65'}%] rounded-t-sm`}></div>
                      <div className={`w-[12%] border border-dashed ${prediction.trend === 'rising' ? 'border-red-500/50 bg-red-500/40' : 'border-green-500/50 bg-green-500/40'} h-[${prediction.trend === 'rising' ? '95' : '55'}%] rounded-t-sm relative`}>
                        <div className={`absolute -top-10 left-1/2 -translate-x-1/2 ${prediction.trend === 'rising' ? 'bg-red-500' : 'bg-green-500'} text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg whitespace-nowrap z-10 flex flex-col items-center`}>
                          <span>Expected</span>
                          <span>₹{prediction.historical_high.toLocaleString()}</span>
                        </div>
                      </div>
                      <div className={`w-[12%] border border-dashed ${prediction.trend === 'rising' ? 'border-red-500/50 bg-red-500/20' : 'border-green-500/50 bg-green-500/20'} h-[${prediction.trend === 'rising' ? '100' : '45'}%] rounded-t-sm`}></div>
                    </div>
                  </div>

                  {/* Flight Selection / Dynamic Real Results */}
                  <div className="flex flex-col gap-4">
                    {prediction.real_flights && prediction.real_flights.length > 0 ? (
                      prediction.real_flights.map((flight: any, index: number) => (
                        <div key={index} className="glass-panel p-4 hover:border-cyan-500/50 transition-colors cursor-pointer group">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-white flex items-center gap-2 group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">
                              {flight.logo && <img src={flight.logo} alt={flight.airline} className="h-4 w-4 object-contain rounded-sm" />}
                              {flight.airline}
                            </span>
                            <span className="text-sm font-bold text-white">₹{flight.price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-gray-400 text-sm">
                            <span>{new Date(flight.departure).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                            <div className="flex-1 px-4 flex flex-col items-center">
                              <span className="text-[10px] uppercase">{Math.floor(flight.duration / 60)}h {flight.duration % 60}m</span>
                              <div className="w-full h-[1px] bg-white/20 relative my-1">
                                <Plane size={10} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50" />
                              </div>
                              <span className="text-[10px] text-green-400">Non-stop</span>
                            </div>
                            <span>{new Date(flight.arrival).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <>
                        <div className="glass-panel p-4 hover:border-cyan-500/50 transition-colors cursor-pointer group">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-white group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">Vistara Airlines</span>
                            <span className="text-sm font-bold text-white">₹{prediction.price.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-gray-400 text-sm">
                            <span>10:00 AM</span>
                            <div className="flex-1 px-4 flex flex-col items-center">
                              <span className="text-[10px] uppercase">2h 15m</span>
                              <div className="w-full h-[1px] bg-white/20 relative my-1">
                                <Plane size={10} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50" />
                              </div>
                              <span className="text-[10px] text-green-400">Non-stop</span>
                            </div>
                            <span>12:15 PM</span>
                          </div>
                        </div>

                        <div className="glass-panel p-4 hover:border-cyan-500/50 transition-colors cursor-pointer group opacity-80">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold bg-white/10 px-2 py-1 rounded text-white group-hover:bg-cyan-500/20 group-hover:text-cyan-400 transition-colors">IndiGo</span>
                            <span className="text-sm font-bold text-white">₹{(prediction.price * 1.05).toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between items-center text-gray-400 text-sm">
                            <span>14:30 PM</span>
                            <div className="flex-1 px-4 flex flex-col items-center">
                              <span className="text-[10px] uppercase">2h 45m</span>
                              <div className="w-full h-[1px] bg-white/20 relative my-1">
                                <Plane size={10} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/50" />
                              </div>
                              <span className="text-[10px] text-green-400">Non-stop</span>
                            </div>
                            <span>17:15 PM</span>
                          </div>
                        </div>
                      </>
                    )}
                    
                    <button className="w-full mt-auto py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-sm font-bold text-cyan-400 transition-colors">
                      View All 24 Flights
                    </button>
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
