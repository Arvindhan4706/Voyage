"use client";

import { motion } from "framer-motion";
import { useTranslations } from 'next-intl';
import { Calendar, Users, IndianRupee, MapPin, Settings, Loader2, Cpu } from "lucide-react";
import { useState } from "react";
import Globe3D from "./Globe3D";
import TripMap from "./TripMap";
import FlightInsights from "./FlightInsights";
import WikipediaImage from "./WikipediaImage";

export default function AITripGenerator() {
  const t = useTranslations('AITrip');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [itinerary, setItinerary] = useState<any>(null);
  const [chatPrompt, setChatPrompt] = useState("");
  const [isChatting, setIsChatting] = useState(false);

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [budget, setBudget] = useState("");
  const [duration, setDuration] = useState("");
  const [style, setStyle] = useState("Adventure");
  const [flightPrediction, setFlightPrediction] = useState<any>(null);

  const handleGenerate = async () => {
    if (!source || !destination || !budget || !duration) {
      alert("Please fill in all details (Source, Destination, Budget, Duration) to generate a real-time itinerary.");
      return;
    }
    
    setIsGenerating(true);
    setItinerary(null);
    setFlightPrediction(null);
    
    try {
      const res = await fetch("/api/trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, destination, budget, duration, style }),
      });
      
      const data = await res.json();
      setItinerary(data);
      
      // Fetch ML flight prediction
      if (data && !data.error) {
        try {
          const priceRes = await fetch("/api/price", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              source, 
              destination, 
              dates: new Date().toISOString(), 
              passengers: 1,
              travelClass: "Economy"
            }),
          });
          const priceData = await priceRes.json();
          if (!priceData.error) {
            setFlightPrediction(priceData);
          }
        } catch (e) {
          console.warn("Could not fetch flight prediction:", e);
        }
      }
    } catch (error) {
      console.error("Failed to generate trip", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportPDF = async () => {
    const element = document.getElementById("itinerary-content");
    if (!element) return;
    
    const html2pdf = (await import("html2pdf.js")).default;
    
    const opt: any = {
      margin:       0.5,
      filename:     `VoyageAI-${destination}-Itinerary.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(element).save();
  };

  const handleSyncCalendar = () => {
    if (!itinerary || !itinerary.days) return;
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Voyage AI//Travel Itinerary//EN\n";
    
    const startDate = new Date();
    
    itinerary.days.forEach((day: any, i: number) => {
      const eventDate = new Date(startDate);
      eventDate.setDate(startDate.getDate() + i);
      const nextDate = new Date(eventDate);
      nextDate.setDate(eventDate.getDate() + 1);
      
      const formatDT = (d: Date) => d.toISOString().split('T')[0].replace(/-/g, '');
      
      const description = `Morning: ${day.morning || ''}\\nAfternoon: ${day.afternoon || ''}\\nEvening: ${day.evening || ''}`.replace(/\n/g, '\\n');
      
      icsContent += "BEGIN:VEVENT\n";
      icsContent += `UID:day${i}-${Date.now()}@voyageai\n`;
      icsContent += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\n`;
      icsContent += `DTSTART;VALUE=DATE:${formatDT(eventDate)}\n`;
      icsContent += `DTEND;VALUE=DATE:${formatDT(nextDate)}\n`;
      icsContent += `SUMMARY:Day ${day.day}: ${day.title}\n`;
      icsContent += `DESCRIPTION:${description}\n`;
      icsContent += "END:VEVENT\n";
    });
    
    icsContent += "END:VCALENDAR";
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `VoyageAI-${itinerary.destination.replace(/\s+/g, '-')}-Itinerary.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const res = await fetch("/api/checkout_sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination: itinerary.destination, budget: itinerary.estimated_budget }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Failed to initiate checkout");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleSaveTrip = async () => {
    try {
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itinerary),
      });
      const data = await res.json();
      if (data.success) {
        const url = `${window.location.origin}/en/trip/${data.id}`;
        prompt("Trip saved successfully! Share this link:", url);
      }
    } catch (error) {
      console.error(error);
      alert("Failed to save trip.");
    }
  };

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatPrompt.trim() || !itinerary) return;
    
    setIsChatting(true);
    try {
      const res = await fetch("/api/trip/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itinerary, prompt: chatPrompt }),
      });
      const data = await res.json();
      if (data.error) {
        alert(data.error);
      } else {
        setItinerary(data);
        setChatPrompt("");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update itinerary");
    } finally {
      setIsChatting(false);
    }
  };

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-4 flex items-center justify-center gap-3">
          Curated Trip <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-amber-600">Planner</span>
        </h2>
        <p className="text-gray-400 text-lg">Bespoke itineraries crafted to your exact preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Input Panel */}
        <div className="glass-panel p-8 lg:col-span-1 border border-cyan-500/30 h-fit">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><Settings className="text-cyan-400"/> Your Preferences</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">SOURCE</label>
              <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-2">
                <MapPin size={16} className="text-gray-400" />
                <input type="text" value={source} onChange={e => setSource(e.target.value)} placeholder="e.g. Chennai" className="bg-transparent border-none outline-none text-gray-900 dark:text-white w-full text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">DESTINATION</label>
              <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-2">
                <MapPin size={16} className="text-cyan-600 dark:text-cyan-400" />
                <input type="text" value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g. Bali, Paris, Manali" className="bg-transparent border-none outline-none text-gray-900 dark:text-white w-full text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">BUDGET</label>
              <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-2">
                <IndianRupee size={16} className="text-gray-400" />
                <input type="text" value={budget} onChange={e => setBudget(e.target.value)} placeholder="e.g. ₹25000" className="bg-transparent border-none outline-none text-gray-900 dark:text-white w-full text-sm" />
              </div>
            </div>
            
            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">DURATION</label>
              <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-2">
                <Calendar size={16} className="text-gray-400" />
                <input type="text" value={duration} onChange={e => setDuration(e.target.value)} placeholder="e.g. 4 Days" className="bg-transparent border-none outline-none text-gray-900 dark:text-white w-full text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-1 block">STYLE</label>
              <select value={style} onChange={e => setStyle(e.target.value)} className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg p-2 text-gray-900 dark:text-white w-full outline-none text-sm appearance-none cursor-pointer">
                <option>Relaxation</option>
                <option>Adventure</option>
                <option>Culture & Heritage</option>
              </select>
            </div>

            <button 
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-4 mt-4 bg-gradient-to-r from-[#D4AF37] to-amber-600 rounded-xl font-black text-[#111111] shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:scale-105 transition-transform disabled:opacity-50 disabled:hover:scale-100 flex justify-center items-center gap-2"
            >
              {isGenerating ? <><Loader2 className="animate-spin" size={18} /> Curating your journey...</> : "Generate Itinerary"}
            </button>
          </div>
        </div>

        {/* Output Panel / Loading State */}
        <div className="lg:col-span-2 space-y-6">
          {!itinerary && !isGenerating && (
            <div className="glass-panel p-12 h-full flex flex-col items-center justify-center text-center border-dashed border-2 border-white/10">
              <MapPin size={48} className="text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-gray-400">Ready to Explore?</h3>
              <p className="text-gray-500 text-sm mt-2 max-w-md">Enter your travel details on the left and our curation engine will design a complete day-by-day itinerary instantly.</p>
            </div>
          )}

          {isGenerating && (
            <div className="glass-panel p-12 h-full flex flex-col items-center justify-center text-center border-cyan-500/30">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-t-4 border-[#D4AF37] rounded-full animate-spin"></div>
                <div className="absolute inset-2 border-r-4 border-amber-600 rounded-full animate-spin direction-reverse"></div>
                <div className="absolute inset-4 border-b-4 border-white/20 rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Curating the perfect journey...</h3>
              <p className="text-[#D4AF37] text-sm animate-pulse mb-6">Selecting exclusive destinations and experiences</p>
              <button 
                onClick={() => { setIsGenerating(false); setItinerary(null); }}
                className="px-6 py-2 border border-white/20 hover:border-red-500/50 hover:bg-red-500/10 text-white rounded-lg text-sm font-bold transition-colors"
              >
                Cancel Generation
              </button>
            </div>
          )}

          {itinerary && !isGenerating && (
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6">
              
              <div className="flex justify-end">
                <button 
                  onClick={() => setItinerary(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-lg text-sm font-bold transition-colors"
                >
                  &larr; Start Over
                </button>
              </div>
              
              {/* Interactive 2D Map Visualization */}
              {itinerary.coordinates && (
                <div className="mb-8">
                  <TripMap lat={itinerary.coordinates.lat} lon={itinerary.coordinates.lon} destination={itinerary.destination} />
                </div>
              )}

              {/* Error Handling */}
              {itinerary.error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl">
                  <strong>Generation Error:</strong> {itinerary.error}
                </div>
              )}

              {/* PDF Wrapper */}
              <div id="itinerary-content" className="space-y-6 bg-slate-950 p-6 rounded-3xl">
                <div className="glass-panel p-4 bg-gradient-to-r from-emerald-500/10 to-transparent border-emerald-500/20 flex flex-wrap justify-between items-center gap-3">
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase block">Recommended Destination</span>
                  <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{itinerary.destination}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase block">Curation Rating</span>
                  <span className="text-2xl font-black text-[#D4AF37]">★ {itinerary.predicted_rating || 4.5}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase block">Estimated Budget</span>
                  <span className="text-2xl font-black text-gray-900 dark:text-white">{itinerary.estimated_budget}</span>
                </div>
              </div>

              {/* Real-time AI generated weather and info */}
              {(itinerary.current_weather || itinerary.about) && (
                <div className="glass-panel p-4 border border-cyan-500/20 grid grid-cols-1 md:grid-cols-2 gap-4">
                  {itinerary.current_weather && (
                    <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                      <span className="text-3xl">🌡️</span>
                      <div>
                        <span className="text-xs text-gray-500 font-bold uppercase block">Live Weather Now</span>
                        <span className="text-xl font-black text-orange-400">{itinerary.current_weather}</span>
                      </div>
                    </div>
                  )}
                  {itinerary.real_attractions_found > 0 && (
                    <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3">
                      <span className="text-3xl">📍</span>
                      <div>
                        <span className="text-xs text-gray-500 font-bold uppercase block">Real Attractions Found</span>
                        <span className="text-xl font-black text-cyan-400">{itinerary.real_attractions_found} from OpenStreetMap</span>
                      </div>
                    </div>
                  )}
                  {itinerary.about && (
                    <div className="col-span-1 md:col-span-2 bg-white/5 rounded-lg p-3">
                      <span className="text-xs text-gray-500 font-bold uppercase block mb-1">About (AI Generated)</span>
                      <p className="text-sm text-gray-300">{itinerary.about}</p>
                    </div>
                  )}
                </div>
              )}

              {itinerary.days && itinerary.days.map((day: any, idx: number) => {
                const colors = ['border-cyan-400', 'border-purple-400', 'border-orange-400', 'border-emerald-400'];
                const textColors = ['text-cyan-400', 'text-purple-400', 'text-orange-400', 'text-emerald-400'];
                const c = colors[idx % 4];
                const tc = textColors[idx % 4];

                return (
                  <motion.div key={idx} initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.1 }} className={`glass-panel p-6 border-l-4 ${c} overflow-hidden relative`}>
                    <WikipediaImage title={day.title} fallbackTitle={itinerary.destination} />
                    <div className="relative z-10">
                      <h4 className="text-2xl font-black mb-4">Day {day.day}: <span className={`${tc} text-lg`}>{day.title}</span></h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {day.morning && (
                          <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg flex items-center justify-between border border-white/5">
                            <div><span className="text-xs text-gray-400 block">Morning</span> <strong className="text-sm text-white">{day.morning}</strong></div>
                          </div>
                        )}
                        {day.afternoon && (
                          <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg flex items-center justify-between border border-white/5">
                            <div><span className="text-xs text-gray-400 block">Afternoon</span> <strong className="text-sm text-white">{day.afternoon}</strong></div>
                          </div>
                        )}
                        {day.evening && (
                          <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg flex items-center justify-between border border-white/5">
                            <div><span className="text-xs text-gray-400 block">Evening</span> <strong className="text-sm text-white">{day.evening}</strong></div>
                          </div>
                        )}
                        {day.full_day && (
                          <div className="bg-black/40 backdrop-blur-sm p-4 rounded-lg flex items-center justify-between col-span-1 md:col-span-2 border border-white/5">
                            <div><span className="text-xs text-gray-400 block">Full Day</span> <strong className="text-sm text-white">{day.full_day}</strong></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              </div>

              <FlightInsights 
                source={source} 
                destination={itinerary.destination} 
                budget={itinerary.estimated_budget}
                mlPrediction={flightPrediction}
              />
              
              {/* Auto Export Tools */}
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex justify-end gap-3 mt-6">
                <button onClick={handleSaveTrip} className="flex items-center gap-2 bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 border border-emerald-500/30 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  <Users size={16} /> Share & Save
                </button>
                <button onClick={handleExportPDF} className="flex items-center gap-2 bg-white/5 hover:bg-red-500/20 text-gray-300 hover:text-red-400 border border-white/10 hover:border-red-500/50 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  PDF Export
                </button>
                <button onClick={handleCheckout} disabled={isCheckingOut} className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-600 hover:scale-105 text-white px-6 py-2 rounded-lg text-sm font-black transition-transform shadow-[0_0_20px_rgba(168,85,247,0.4)] disabled:opacity-50">
                  {isCheckingOut ? <Loader2 size={16} className="animate-spin" /> : "Book This Trip"}
                </button>
                <button onClick={handleSyncCalendar} className="flex items-center gap-2 bg-cyan-500/20 hover:bg-cyan-500/40 text-cyan-400 border border-cyan-500/30 px-4 py-2 rounded-lg text-sm font-bold transition-colors">
                  <Calendar size={16} /> Sync Calendar
                </button>
              </motion.div>
              <div className="glass-panel p-6 border-[#D4AF37]/30 mt-8">
                <h4 className="text-xl font-bold mb-4 flex items-center gap-2"><Settings className="text-[#D4AF37]" /> Refine your Itinerary</h4>
                <form onSubmit={handleChatSubmit} className="flex gap-2">
                  <input
                    type="text"
                    value={chatPrompt}
                    onChange={(e) => setChatPrompt(e.target.value)}
                    placeholder="e.g. Swap day 2 morning with a museum visit..."
                    className="flex-1 bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-sm outline-none focus:border-indigo-500/50"
                  />
                  <button type="submit" disabled={isChatting} className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-6 rounded-lg font-bold transition-colors flex items-center justify-center min-w-[120px]">
                    {isChatting ? <Loader2 size={18} className="animate-spin" /> : "Update"}
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
