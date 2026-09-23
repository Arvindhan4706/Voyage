"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin, Plane, CheckCircle2, Clock } from "lucide-react";

const mockBookings = [
  {
    id: "BKG-9921",
    destination: "Santorini, Greece",
    date: "Aug 15 - Aug 22, 2026",
    status: "Upcoming",
    hotel: "Canaves Oia Epitome",
    image: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "BKG-8810",
    destination: "Kyoto, Japan",
    date: "Apr 02 - Apr 10, 2026",
    status: "Completed",
    hotel: "Aman Kyoto",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=800",
  }
];

export default function BookingsPage() {
  return (
    <div className="min-h-screen pt-32 pb-20 px-6 sm:px-8 lg:px-12 bg-background relative overflow-hidden">
      <div className="absolute top-[20%] left-[80%] w-[30vw] h-[30vw] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">My Bookings</h1>
          <p className="text-muted-foreground text-lg">Your upcoming and past luxury journeys.</p>
        </motion.div>

        <div className="space-y-8">
          {mockBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="glass-panel rounded-3xl border border-border shadow-xl overflow-hidden flex flex-col md:flex-row group"
            >
              <div className="md:w-2/5 h-64 md:h-auto relative overflow-hidden">
                <img 
                  src={booking.image} 
                  alt={booking.destination} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                <div className="absolute bottom-4 left-4 md:hidden text-white">
                  <h3 className="text-2xl font-serif">{booking.destination}</h3>
                </div>
              </div>

              <div className="md:w-3/5 p-8 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="hidden md:block">
                      <h3 className="text-2xl font-serif mb-1">{booking.destination}</h3>
                      <p className="text-sm text-muted-foreground font-mono">{booking.id}</p>
                    </div>
                    
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1 ${
                      booking.status === "Upcoming" ? "bg-primary/20 text-primary border border-primary/30" : "bg-green-500/10 text-green-500 border border-green-500/20"
                    }`}>
                      {booking.status === "Upcoming" ? <Clock size={12} /> : <CheckCircle2 size={12} />}
                      {booking.status}
                    </span>
                  </div>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Calendar size={18} className="text-primary" />
                      <span>{booking.date}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <MapPin size={18} className="text-primary" />
                      <span>{booking.hotel}</span>
                    </div>
                    <div className="flex items-center gap-3 text-muted-foreground">
                      <Plane size={18} className="text-primary" />
                      <span>First Class Flights Included</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-primary/20">
                    View Itinerary
                  </button>
                  <button className="px-6 py-3 bg-background/50 border border-border hover:bg-muted/50 rounded-xl text-sm font-semibold transition-colors">
                    Support
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
