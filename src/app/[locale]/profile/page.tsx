"use client";

import { motion } from "framer-motion";
import { User, MapPin, Compass, Star, Camera, Shield, Coins, Medal, Users, Plus, Edit2, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import PriceAlerts from "@/components/PriceAlerts";

export default function ProfilePage() {
  const { data: session } = useSession();

  // Mock data for loyalty and travelers
  const loyaltyTier = "SILVER";
  const voyageCoins = 12500;
  
  const [savedTravelers, setSavedTravelers] = useState([
    { id: 1, name: "Alice Smith", relation: "Spouse", dob: "1990-05-15" },
    { id: 2, name: "Bob Smith", relation: "Child", dob: "2015-08-20" }
  ]);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8 lg:px-12 bg-white dark:bg-black relative overflow-hidden font-outfit">
      
      {/* Background Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-yellow-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[30vw] h-[30vw] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4 text-black dark:text-white">My Profile</h1>
          <p className="text-[#888888] dark:text-[#a3a3a3] text-lg">Manage your luxury travel preferences, rewards, and saved travelers.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: User Card & Loyalty */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="col-span-1 space-y-6"
          >
            {/* User Card */}
            <div className="glass-panel p-8 rounded-3xl text-center border border-[#eaeaea] dark:border-[#333333] shadow-xl relative overflow-hidden bg-white/50 dark:bg-white/5 backdrop-blur-md">
              <div className="w-32 h-32 mx-auto bg-white dark:bg-black rounded-full flex items-center justify-center mb-6 border-2 border-yellow-500/30 shadow-inner relative">
                <User size={48} className="text-[#888888] dark:text-[#a3a3a3]" />
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-gray-300 to-gray-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg border-2 border-white dark:border-black">
                  {loyaltyTier}
                </div>
              </div>
              <h2 className="text-2xl font-bold tracking-tight mb-1 text-black dark:text-white">{session?.user?.name || "Distinguished Guest"}</h2>
              <p className="text-sm text-[#888888] dark:text-[#a3a3a3] mb-6">{session?.user?.email || "guest@voyage.ai"}</p>
              
              <button className="w-full py-3 bg-[#eaeaea] dark:bg-[#333333] hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-xl text-sm font-semibold transition-all duration-300">
                Edit Profile
              </button>
            </div>

            {/* Loyalty / VoyageCoins */}
            <div className="glass-panel p-6 rounded-3xl border border-yellow-500/30 shadow-xl bg-gradient-to-br from-yellow-500/10 to-transparent">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-yellow-600 dark:text-yellow-500">
                <Medal size={20} /> Voyage Rewards
              </h3>
              
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-[#888888] dark:text-[#a3a3a3] uppercase tracking-wider font-bold mb-1">VoyageCoins Balance</p>
                  <p className="text-3xl font-black text-black dark:text-white flex items-center gap-2">
                    <Coins className="text-yellow-500" /> {voyageCoins.toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="w-full bg-[#eaeaea] dark:bg-[#333333] h-2 rounded-full mb-2 overflow-hidden">
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-full w-[65%] rounded-full"></div>
              </div>
              <p className="text-xs text-[#888888] dark:text-[#a3a3a3]">Earn 2,500 more coins to reach <strong className="text-yellow-600 dark:text-yellow-500">GOLD</strong> tier.</p>
            </div>
          </motion.div>

          {/* Right Column: Travel DNA & Travelers */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="col-span-1 lg:col-span-2 space-y-6"
          >
            {/* Saved Travelers */}
            <div className="glass-panel p-8 rounded-3xl border border-[#eaeaea] dark:border-[#333333] shadow-xl bg-white/50 dark:bg-white/5 backdrop-blur-md">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="text-xl font-bold flex items-center gap-2 text-black dark:text-white">
                   <Users className="text-blue-500" size={24} /> 
                   Saved Travelers
                 </h3>
                 <button className="text-sm font-bold text-blue-500 hover:text-blue-600 flex items-center gap-1">
                   <Plus size={16}/> Add New
                 </button>
               </div>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {savedTravelers.map((traveler) => (
                   <div key={traveler.id} className="p-4 rounded-2xl border border-[#eaeaea] dark:border-[#333333] bg-white dark:bg-black flex justify-between items-center group">
                     <div>
                       <h4 className="font-bold text-black dark:text-white text-lg">{traveler.name}</h4>
                       <p className="text-xs text-[#888888] dark:text-[#a3a3a3] uppercase tracking-wider">{traveler.relation} • {traveler.dob}</p>
                     </div>
                     <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 text-[#888888] hover:text-blue-500 transition-colors"><Edit2 size={16}/></button>
                       <button className="p-2 text-[#888888] hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                     </div>
                   </div>
                 ))}
                 
                 {/* Add new card placeholder */}
                 <button className="p-4 rounded-2xl border-2 border-dashed border-[#eaeaea] dark:border-[#333333] hover:border-blue-500/50 hover:bg-blue-500/5 transition-colors flex flex-col items-center justify-center text-[#888888] dark:text-[#a3a3a3] min-h-[90px]">
                   <Plus size={24} className="mb-1 text-blue-500" />
                   <span className="text-sm font-bold">Add Traveler</span>
                 </button>
               </div>
            </div>

            {/* Travel DNA */}
            <div className="glass-panel p-8 rounded-3xl border border-[#eaeaea] dark:border-[#333333] shadow-xl bg-white/50 dark:bg-white/5 backdrop-blur-md">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-black dark:text-white">
                <Compass className="text-green-500" size={24} /> 
                Travel DNA
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[
                  { icon: <MapPin size={20}/>, title: "Preferred Destinations", value: "Tropical, European Cities" },
                  { icon: <Star size={20}/>, title: "Travel Style", value: "Ultra-Luxury, Wellness" },
                  { icon: <Shield size={20}/>, title: "Dietary Requirements", value: "None" },
                  { icon: <Camera size={20}/>, title: "Interests", value: "Photography, Fine Dining" },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-black p-4 rounded-2xl border border-[#eaeaea] dark:border-[#333333]">
                    <div className="flex items-center gap-3 text-[#888888] dark:text-[#a3a3a3] mb-2">
                      {item.icon}
                      <span className="text-xs uppercase tracking-wider font-semibold">{item.title}</span>
                    </div>
                    <p className="font-medium text-black dark:text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Price Alerts */}
            <PriceAlerts />

          </motion.div>
        </div>
      </div>
    </div>
  );
}
