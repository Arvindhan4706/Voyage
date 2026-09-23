"use client";

import { motion } from "framer-motion";
import { Bell, BellOff, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";

const initialAlerts = [
  { id: 1, route: "BOM → DXB", date: "Oct 15 - Oct 22", targetPrice: 18000, currentPrice: 17500, trend: "down", active: true },
  { id: 2, route: "Four Seasons Bali", date: "Dec 10 - Dec 15", targetPrice: 250000, currentPrice: 265000, trend: "up", active: true },
  { id: 3, route: "DEL → LHR", date: "Nov 01 - Nov 15", targetPrice: 45000, currentPrice: 48000, trend: "up", active: false }
];

export default function PriceAlerts() {
  const [alerts, setAlerts] = useState(initialAlerts);

  const toggleAlert = (id: number) => {
    setAlerts(alerts.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <div className="glass-panel p-8 rounded-3xl border border-[#eaeaea] dark:border-[#333333] shadow-xl bg-white/50 dark:bg-white/5 backdrop-blur-md">
      <h3 className="text-xl font-bold flex items-center gap-2 mb-6 text-black dark:text-white">
        <Bell className="text-purple-500" size={24} /> 
        Active Price Alerts
      </h3>
      
      <div className="space-y-4">
        {alerts.map(alert => (
          <div key={alert.id} className={`p-4 rounded-2xl border ${alert.active ? 'border-purple-500/30 bg-purple-500/5' : 'border-[#eaeaea] dark:border-[#333333] bg-white dark:bg-black opacity-60'} flex flex-col md:flex-row justify-between items-center transition-all`}>
            
            <div className="flex-1 mb-4 md:mb-0">
              <h4 className="font-bold text-black dark:text-white text-lg">{alert.route}</h4>
              <p className="text-xs text-[#888888] dark:text-[#a3a3a3] uppercase tracking-wider">{alert.date}</p>
            </div>
            
            <div className="flex items-center gap-8 w-full md:w-auto">
              <div>
                <p className="text-[10px] text-[#888888] uppercase tracking-wider block mb-1">Target</p>
                <p className="font-bold text-black dark:text-white">₹{alert.targetPrice.toLocaleString()}</p>
              </div>
              
              <div>
                <p className="text-[10px] text-[#888888] uppercase tracking-wider block mb-1">Current</p>
                <p className={`font-bold flex items-center gap-1 ${alert.trend === 'down' ? 'text-green-500' : 'text-red-500'}`}>
                  ₹{alert.currentPrice.toLocaleString()}
                  {alert.trend === 'down' ? <ArrowDownRight size={14}/> : <ArrowUpRight size={14}/>}
                </p>
              </div>
              
              <button 
                onClick={() => toggleAlert(alert.id)}
                className={`p-3 rounded-full transition-colors ${alert.active ? 'bg-purple-500 text-white shadow-lg shadow-purple-500/30' : 'bg-[#eaeaea] dark:bg-[#333333] text-[#888888]'}`}
              >
                {alert.active ? <Bell size={18} /> : <BellOff size={18} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
