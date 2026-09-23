"use client";

import { motion } from "framer-motion";
import { Heart, MapPin, ArrowRight } from "lucide-react";

const mockWishlist = [
  {
    id: 1,
    name: "Maldives Private Island",
    location: "Indian Ocean",
    image: "https://images.unsplash.com/photo-1514282401047-d79a71a590e8?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 2,
    name: "Amalfi Coast Villa",
    location: "Italy",
    image: "https://images.unsplash.com/photo-1533090161767-e6ffed986c88?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 3,
    name: "Swiss Alps Chalet",
    location: "Switzerland",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: 4,
    name: "Bali Jungle Retreat",
    location: "Indonesia",
    image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&q=80&w=800",
  }
];

export default function WishlistPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8 lg:px-12 bg-background relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">Wishlist</h1>
            <p className="text-muted-foreground text-lg">Your curated collection of dream destinations.</p>
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-background/50 border border-border hover:bg-muted/50 rounded-xl text-sm font-semibold transition-colors w-fit">
            Share Collection
          </button>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mockWishlist.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="group cursor-pointer"
            >
              <div className="relative h-80 rounded-3xl overflow-hidden mb-4 border border-border/50 shadow-lg">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60 opacity-80" />
                
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-colors z-10">
                  <Heart size={18} fill="currentColor" />
                </button>

                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-2xl font-serif text-white mb-2">{item.name}</h3>
                  <div className="flex items-center gap-2 text-white/80 text-sm">
                    <MapPin size={14} />
                    {item.location}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between px-2">
                <span className="text-sm font-semibold text-primary">Plan Trip</span>
                <ArrowRight size={16} className="text-primary transform transition-transform group-hover:translate-x-1" />
              </div>
            </motion.div>
          ))}

          {/* Empty Add New Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: mockWishlist.length * 0.1 }}
            className="h-80 rounded-3xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-4 text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer"
          >
            <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center">
              <span className="text-3xl">+</span>
            </div>
            <p className="font-semibold">Discover More</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
