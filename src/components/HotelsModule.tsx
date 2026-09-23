"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Star, MapPin, Search, Filter, Coffee, Wifi, Car, Home } from "lucide-react";
import { useState, useEffect } from "react";

const hotelImages = [
  "/images/hotel_1.png",
  "/images/hotel_2.png",
  "/images/hotel_3.png",
  "/images/hotel_4.png",
];

function HotelSkeleton() {
  return (
    <div className="glass-panel p-4 flex flex-col md:flex-row gap-6 animate-pulse">
      <div className="w-full md:w-64 h-48 bg-white/5 shrink-0 rounded-lg" />
      <div className="flex-1 space-y-4 py-2 w-full">
        <div className="h-6 bg-white/10 w-3/4 rounded" />
        <div className="h-4 bg-white/5 w-1/2 rounded" />
        <div className="h-4 bg-white/5 w-2/3 mt-4 rounded" />
      </div>
    </div>
  );
}

export default function HotelsModule() {
  const [hotels, setHotels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState("Bali");
  const [inputValue, setInputValue] = useState("Bali");
  
  // Advanced filters
  const [minRating, setMinRating] = useState(3);
  const [selectedHotel, setSelectedHotel] = useState<any>(null);

  const fetchHotels = async (place: string) => {
    setLoading(true);
    setSelectedHotel(null);
    try {
      const res = await fetch(`/api/hotels?location=${encodeURIComponent(place)}`);
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setHotels(
          data.slice(0, 6).map((h: any, idx: number) => ({
            ...h,
            id: h.id || idx,
            image: hotelImages[idx % hotelImages.length],
            priceNum: Math.round(h.price || 3500),
            displayPrice: `₹${Math.round(h.price || 3500).toLocaleString()}`,
            rating: h.ratings || 4 + Math.random(),
            amenities: ["Free WiFi", "Breakfast Included", "Pool"].slice(0, Math.floor(Math.random() * 3) + 1)
          }))
        );
      } else {
        setHotels([]);
      }
    } catch {
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHotels("Bali"); }, []);

  const filteredHotels = hotels.filter(h => h.rating >= minRating);

  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
      
      {/* Search Header */}
      <div className="glass-panel p-6 mb-8 bg-gradient-to-r from-blue-900/30 to-purple-900/20 border-b-4 border-purple-500">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-2">
              <Home className="text-purple-400" /> Find Stays in {location}
            </h2>
            <p className="text-gray-400 text-sm mt-1">Discover luxury hotels, villas, and budget stays.</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
            <div className="flex-1 md:w-64 bg-black/40 border border-white/10 rounded-lg p-3 flex items-center gap-2">
              <MapPin size={16} className="text-purple-400" />
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { setLocation(inputValue); fetchHotels(inputValue); } }}
                placeholder="Search City or Hotel..."
                className="bg-transparent border-none outline-none text-white w-full text-sm"
              />
            </div>
            <button
              onClick={() => { setLocation(inputValue); fetchHotels(inputValue); }}
              className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2 shadow-lg shadow-purple-500/25"
            >
              <Search size={16} /> Search
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="glass-panel p-5">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-4"><Filter size={16} className="text-purple-400"/> Filter By</h3>
            
            <div className="mb-6">
              <label className="text-xs font-bold text-gray-500 mb-3 block uppercase">Star Rating</label>
              <div className="space-y-2">
                {[5, 4, 3].map(star => (
                  <label key={star} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="rating" 
                      checked={minRating === star}
                      onChange={() => setMinRating(star)}
                      className="accent-purple-500"
                    />
                    <div className="flex items-center gap-1 text-sm text-gray-300 group-hover:text-white">
                      {Array.from({length: star}).map((_, i) => <Star key={i} size={12} className="fill-purple-400 text-purple-400" />)}
                      <span className="text-xs ml-1">& Up</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-500 mb-3 block uppercase">Popular Amenities</label>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 hover:text-white">
                  <input type="checkbox" className="accent-purple-500 rounded" /> <Wifi size={14}/> Free WiFi
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 hover:text-white">
                  <input type="checkbox" className="accent-purple-500 rounded" /> <Coffee size={14}/> Breakfast Included
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300 hover:text-white">
                  <input type="checkbox" className="accent-purple-500 rounded" /> <Car size={14}/> Parking
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Results / Room Selection */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            
            {/* Detailed Room Selection View */}
            {selectedHotel ? (
              <motion.div key="room-selection" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <button onClick={() => setSelectedHotel(null)} className="text-purple-400 text-sm font-bold mb-4 hover:text-purple-300 flex items-center gap-1">
                  ← Back to search results
                </button>
                
                <div className="glass-panel overflow-hidden mb-6">
                  <div className="h-64 w-full relative">
                    <img src={selectedHotel.image} alt={selectedHotel.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                      <div>
                        <div className="flex items-center gap-1 mb-2">
                          {Array.from({length: Math.floor(selectedHotel.rating)}).map((_, i) => <Star key={i} size={14} className="fill-purple-400 text-purple-400" />)}
                        </div>
                        <h2 className="text-3xl font-black text-white">{selectedHotel.name}</h2>
                        <p className="text-gray-300 text-sm flex items-center gap-1 mt-1"><MapPin size={12}/> {selectedHotel.location}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-black/20">
                    <h3 className="text-xl font-bold text-white mb-4">Available Rooms</h3>
                    <div className="space-y-4">
                      {/* Standard Room */}
                      <div className="border border-white/10 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-white/5 hover:bg-white/10 transition-colors">
                        <div>
                          <h4 className="text-lg font-bold text-white">Standard Room</h4>
                          <p className="text-sm text-gray-400">1 Queen Bed • City View</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Non-Refundable</span>
                            <span className="text-[10px] bg-green-500/20 text-green-300 px-2 py-1 rounded">Breakfast ₹500</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-white">₹{selectedHotel.priceNum.toLocaleString()}</p>
                          <p className="text-[10px] text-gray-500 mb-2">+ ₹{(selectedHotel.priceNum * 0.18).toFixed(0)} taxes & fees</p>
                          <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-lg w-full md:w-auto shadow-lg shadow-purple-500/20 transition-transform hover:-translate-y-0.5">
                            Select Room
                          </button>
                        </div>
                      </div>

                      {/* Premium Room */}
                      <div className="border border-purple-500/30 rounded-lg p-4 flex flex-col md:flex-row justify-between items-center gap-4 bg-purple-900/10 hover:bg-purple-900/20 transition-colors">
                        <div>
                          <h4 className="text-lg font-bold text-white">Premium Suite <span className="text-[10px] bg-purple-500 text-white px-1.5 py-0.5 rounded ml-2">RECOMMENDED</span></h4>
                          <p className="text-sm text-gray-400">1 King Bed • Ocean View • Free Minibar</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-[10px] bg-green-500/20 text-green-300 px-2 py-1 rounded">Free Cancellation</span>
                            <span className="text-[10px] bg-green-500/20 text-green-300 px-2 py-1 rounded">Breakfast Included</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-black text-white">₹{(selectedHotel.priceNum * 1.5).toLocaleString()}</p>
                          <p className="text-[10px] text-gray-500 mb-2">+ ₹{(selectedHotel.priceNum * 1.5 * 0.18).toFixed(0)} taxes & fees</p>
                          <button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-2 px-6 rounded-lg w-full md:w-auto shadow-lg shadow-purple-500/40 transition-transform hover:-translate-y-0.5">
                            Select Room
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Search Results List */
              <motion.div key="results-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => <HotelSkeleton key={i} />)
                ) : filteredHotels.length === 0 ? (
                  <div className="glass-panel p-16 text-center border-dashed border-2 border-white/10">
                    <MapPin size={48} className="text-gray-600 mx-auto mb-4" />
                    <p className="text-xl font-bold text-gray-300 mb-2">No properties found</p>
                    <p className="text-gray-500 text-sm">Try adjusting your filters or search for a different city.</p>
                  </div>
                ) : (
                  filteredHotels.map((hotel) => (
                    <div key={hotel.id} className="glass-panel flex flex-col md:flex-row overflow-hidden hover:border-purple-500/50 transition-colors group">
                      <div className="w-full md:w-72 h-48 md:h-auto relative overflow-hidden shrink-0">
                        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        {hotel.rating >= 4.8 && (
                          <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-500 to-yellow-600 text-black text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase tracking-wider">
                            Exceptional
                          </div>
                        )}
                      </div>
                      
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-1">
                            <h3 className="font-black text-xl text-white group-hover:text-purple-400 transition-colors cursor-pointer" onClick={() => setSelectedHotel(hotel)}>
                              {hotel.name}
                            </h3>
                            <div className="bg-purple-900/50 border border-purple-500/30 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
                              {hotel.rating.toFixed(1)} <Star size={10} className="fill-purple-400 text-purple-400" />
                            </div>
                          </div>
                          
                          <p className="text-gray-400 text-xs flex items-center gap-1 mb-3">
                            <MapPin size={12} /> {hotel.location} <span className="text-purple-400 hover:underline cursor-pointer ml-1">Show on map</span>
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {hotel.amenities.map((amenity: string, i: number) => (
                              <span key={i} className="text-[10px] border border-white/10 text-gray-300 px-2 py-1 rounded bg-white/5">
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-end">
                          <p className="text-xs text-green-400 font-bold bg-green-400/10 px-2 py-1 rounded">
                            ✓ Free Cancellation
                          </p>
                          <div className="text-right">
                            <span className="text-[10px] text-gray-500 line-through">₹{(hotel.priceNum * 1.2).toLocaleString()}</span>
                            <div className="text-2xl font-black text-white">{hotel.displayPrice}</div>
                            <span className="text-[10px] text-gray-500 block mb-2">+ taxes & fees / night</span>
                            <button 
                              onClick={() => setSelectedHotel(hotel)}
                              className="bg-purple-500/20 hover:bg-purple-500 text-purple-300 hover:text-white font-bold py-1.5 px-6 rounded transition-colors text-sm"
                            >
                              See availability
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
