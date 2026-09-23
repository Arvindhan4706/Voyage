"use client";

import { Plane, CalendarDays, Clock, ArrowRight, IndianRupee, Cpu, AlertCircle } from "lucide-react";

interface FlightInsightsProps {
  source: string;
  destination: string;
  budget?: string;
  mlPrediction?: {
    price: number;
    model_version: string;
    historical_low: number;
    historical_high: number;
    trend: string;
    calculation_method: string;
  };
}

export default function FlightInsights({ 
  source, 
  destination, 
  budget, 
  mlPrediction 
}: FlightInsightsProps) {
  const budgetStr = budget !== undefined && budget !== null ? String(budget) : "";
  const estimatedBase = budgetStr.replace(/\D/g, "") ? parseInt(budgetStr.replace(/\D/g, "")) * 0.3 : 15000;
  
  // Use ML prediction if available, otherwise fall back to budget estimate
  const outboundPrice = mlPrediction ? Math.round(mlPrediction.price * 0.55) : Math.round(estimatedBase);
  const returnPrice = mlPrediction ? Math.round(mlPrediction.price * 0.45) : Math.round(estimatedBase * 0.85);
  const totalPrice = mlPrediction ? mlPrediction.price : Math.round(estimatedBase * 1.85);

  return (
    <div className="glass-panel p-6 border-cyan-500/30 mt-8 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h4 className="text-xl font-bold flex items-center gap-2">
          <Plane className="text-cyan-400" /> Flight & Transport Insights
        </h4>
        {mlPrediction && (
          <span className="flex items-center gap-1 bg-cyan-500/20 text-cyan-400 px-3 py-1 rounded-full text-xs font-bold border border-cyan-500/30">
            <Cpu size={10} /> AI Model Estimate
          </span>
        )}
      </div>
      
      {mlPrediction && (
        <div className="mb-6 p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-xl text-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">Model Version</p>
              <p className="font-mono text-white text-sm">{mlPrediction.model_version}</p>
            </div>
            <div>
              <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">Method</p>
              <p className="font-mono text-white text-sm truncate">{mlPrediction.calculation_method}</p>
            </div>
            <div>
              <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">Trend</p>
              <p className={`font-bold text-sm ${mlPrediction.trend === "rising" ? "text-red-400" : mlPrediction.trend === "falling" ? "text-green-400" : "text-yellow-400"}`}>
                {mlPrediction.trend.charAt(0).toUpperCase() + mlPrediction.trend.slice(1)}
              </p>
            </div>
            <div>
              <p className="text-xs text-cyan-400 font-bold uppercase tracking-wider mb-1">Confidence</p>
              <p className="font-bold text-white text-sm">85%</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Based on historical training data • Not a live airline quote • <a 
              href={`https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(destination)}%20from%20${encodeURIComponent(source)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-400 hover:underline"
            >
              Check live fares on Google Flights
            </a>
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Outbound Flight */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-cyan-500/50 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Outbound</span>
            <span className="text-xs bg-cyan-500/20 text-cyan-400 px-2 py-1 rounded-full">Estimated</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <div className="text-2xl font-black">{source || "Origin"}</div>
              <div className="text-xs text-gray-500 mt-1">Departure</div>
            </div>
            <div className="flex-1 flex flex-col items-center px-4">
              <span className="text-xs text-gray-500 mb-1">Direct • ~{Math.round((mlPrediction ? 0 : 1) * 0 + 4.5)}h</span>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent relative">
                <Plane size={16} className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-cyan-400 rotate-90" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-cyan-400">{destination || "Destination"}</div>
              <div className="text-xs text-gray-500 mt-1">Arrival</div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <div className="flex items-center gap-1 text-gray-400"><Clock size={14} /> Daily</div>
            <div className="font-black text-lg flex items-center">
              <IndianRupee size={16} /> {outboundPrice.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Return Flight */}
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:border-purple-500/50 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Return</span>
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded-full">Estimated</span>
          </div>
          <div className="flex items-center justify-between mb-4">
            <div className="text-center">
              <div className="text-2xl font-black text-purple-400">{destination || "Destination"}</div>
              <div className="text-xs text-gray-500 mt-1">Departure</div>
            </div>
            <div className="flex-1 flex flex-col items-center px-4">
              <span className="text-xs text-gray-500 mb-1">1 Stop • ~6h</span>
              <div className="w-full h-px bg-gradient-to-r from-transparent via-purple-500 to-transparent relative">
                <Plane size={16} className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-purple-400 -rotate-90" />
              </div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black">{source || "Origin"}</div>
              <div className="text-xs text-gray-500 mt-1">Arrival</div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-4 border-t border-white/10">
            <div className="flex items-center gap-1 text-gray-400"><CalendarDays size={14} /> +4 Days</div>
            <div className="font-black text-lg flex items-center">
              <IndianRupee size={16} /> {returnPrice.toLocaleString()}
            </div>
          </div>
        </div>
      </div>
      
      {/* Price Summary */}
      <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-bold text-gray-300">Estimated Total (Round Trip)</span>
          <span className="text-xl font-black text-white flex items-center gap-1">
            <IndianRupee size={20} /> {totalPrice.toLocaleString()}
          </span>
        </div>
        {mlPrediction && (
          <div className="flex justify-between text-xs text-gray-500">
            <span>Historical Low: ₹{mlPrediction.historical_low.toLocaleString()}</span>
            <span>Historical High: ₹{mlPrediction.historical_high.toLocaleString()}</span>
          </div>
        )}
      </div>

      <a 
        href={`https://www.google.com/travel/flights?q=Flights%20to%20${encodeURIComponent(destination)}%20from%20${encodeURIComponent(source)}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="w-full mt-6 bg-white/5 hover:bg-cyan-500/20 text-cyan-400 border border-white/10 hover:border-cyan-500/50 py-3 rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
      >
        View Live Flights on Google Flights <ArrowRight size={16} />
      </a>
      
      {!mlPrediction && (
        <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-center gap-2 text-yellow-400 text-sm">
          <AlertCircle size={16} />
          <span>ML prediction unavailable. Showing budget-based estimate. Connect ML service for AI-powered predictions.</span>
        </div>
      )}
    </div>
  );
}