"use client";

import { useState } from "react";
import { Plane, Building2, Map, Train, Bus, Car, Building, ChevronDown } from "lucide-react";

const categories = [
  { id: "flights", label: "Flights", icon: Plane },
  { id: "hotels", label: "Hotels", icon: Building2 },
  { id: "homestays", label: "Homestays", icon: Building },
  { id: "holidays", label: "Holiday Packages", icon: Map },
  { id: "trains", label: "Trains", icon: Train },
  { id: "buses", label: "Buses", icon: Bus },
  { id: "cabs", label: "Cabs", icon: Car },
];

export default function BookingWidget() {
  const [activeTab, setActiveTab] = useState("flights");
  const [tripType, setTripType] = useState("round");

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 -mt-16 relative z-20 pb-16">
      
      {/* Category Nav Bar */}
      <div className="bg-white rounded-xl mmt-shadow flex justify-between items-center px-4 py-2 mb-2 max-w-[800px] mx-auto">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isActive = activeTab === cat.id;
          return (
            <button 
              key={cat.id}
              onClick={() => setActiveTab(cat.id)}
              className={`flex flex-col items-center gap-1 p-2 min-w-[70px] ${isActive ? 'text-[#008cff] border-b-2 border-[#008cff]' : 'text-gray-500 hover:text-[#008cff]'}`}
            >
              <Icon size={24} />
              <span className="text-[11px] font-bold">{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Widget Box */}
      <div className="bg-white rounded-xl mmt-shadow p-6 relative pt-10">
        
        {/* Radio Options */}
        {activeTab === 'flights' && (
          <div className="flex gap-6 mb-6">
            {['one-way', 'round', 'multi'].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="radio" 
                  name="tripType" 
                  checked={tripType === type}
                  onChange={() => setTripType(type)}
                  className="w-4 h-4 accent-[#008cff]"
                />
                <span className={`text-sm font-bold ${tripType === type ? 'text-black' : 'text-gray-600'}`}>
                  {type === 'one-way' ? 'One Way' : type === 'round' ? 'Round Trip' : 'Multi City'}
                </span>
              </label>
            ))}
            <span className="text-sm font-bold text-gray-500 ml-auto flex items-center">Book International and Domestic Flights</span>
          </div>
        )}

        {/* Input Grid */}
        <div className="flex rounded-md border border-gray-300">
          
          <div className="flex-1 p-3 border-r border-gray-300 hover:bg-blue-50 cursor-pointer group">
            <span className="text-sm text-gray-500 font-bold block">From</span>
            <div className="text-3xl font-black text-black">Delhi</div>
            <span className="text-xs text-gray-500 truncate block">DEL, Delhi Airport India</span>
          </div>

          <div className="flex-1 p-3 border-r border-gray-300 hover:bg-blue-50 cursor-pointer group">
            <span className="text-sm text-gray-500 font-bold block">To</span>
            <div className="text-3xl font-black text-black">Bengaluru</div>
            <span className="text-xs text-gray-500 truncate block">BLR, Bengaluru International Airport</span>
          </div>

          <div className="flex-1 p-3 border-r border-gray-300 hover:bg-blue-50 cursor-pointer group">
            <span className="text-sm text-gray-500 font-bold block flex items-center gap-1">Departure <ChevronDown size={14}/></span>
            <div className="text-3xl font-black text-black flex items-baseline gap-1">24 <span className="text-xl">Jun</span><span className="text-sm">26</span></div>
            <span className="text-xs text-gray-500 block">Wednesday</span>
          </div>

          <div className="flex-1 p-3 border-r border-gray-300 hover:bg-blue-50 cursor-pointer group">
            <span className="text-sm text-gray-500 font-bold block flex items-center gap-1">Return <ChevronDown size={14}/></span>
            <div className="text-sm font-bold text-gray-400 mt-3">Tap to add a return date for cheaper flights</div>
          </div>

          <div className="flex-1 p-3 hover:bg-blue-50 cursor-pointer group relative">
            <span className="text-sm text-gray-500 font-bold block flex items-center gap-1">Travellers & Class <ChevronDown size={14}/></span>
            <div className="text-3xl font-black text-black flex items-baseline gap-1">1 <span className="text-xl">Adult</span></div>
            <span className="text-xs text-gray-500 block">Economy/Premium Economy</span>
          </div>
          
        </div>

        {/* Fare Types */}
        {activeTab === 'flights' && (
          <div className="mt-4 flex items-center gap-4 text-xs font-bold text-gray-600">
            <span className="text-black">Select A Fare Type:</span>
            {['Regular', 'Armed Forces', 'Student', 'Senior Citizen', 'Doctors & Nurses'].map((fare) => (
              <label key={fare} className="flex items-center gap-1 cursor-pointer bg-gray-100 px-3 py-1 rounded hover:bg-gray-200">
                <input type="radio" name="fareType" className="accent-[#008cff]" /> {fare}
              </label>
            ))}
          </div>
        )}

        {/* Search Button */}
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2">
          <button className="px-16 py-3 bg-gradient-to-r from-[#008cff] to-[#0051ff] rounded-full text-white font-bold text-2xl mmt-shadow">
            SEARCH
          </button>
        </div>
      </div>
    </div>
  );
}
