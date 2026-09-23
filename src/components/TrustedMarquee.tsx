"use client";

import { motion } from "framer-motion";

const companiesRow1 = [
  "Google", "Microsoft", "Airbnb", "Booking.com", "Expedia", "TripAdvisor"
];

const companiesRow2 = [
  "Kayak", "Skyscanner", "MakeMyTrip", "Agoda", "Uber", "Lyft"
];

export default function TrustedMarquee() {
  return (
    <section className="py-16 border-y border-white/5 bg-[#050816] overflow-hidden relative flex flex-col gap-8 justify-center">
      <div className="absolute left-0 top-0 w-40 h-full bg-gradient-to-r from-[#050816] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 w-40 h-full bg-gradient-to-l from-[#050816] to-transparent z-10 pointer-events-none" />
      
      {/* Row 1: Scrolls Left */}
      <motion.div 
        className="flex whitespace-nowrap gap-20 items-center px-4 w-max"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
      >
        {[...companiesRow1, ...companiesRow1, ...companiesRow1].map((company, i) => (
          <div key={i} className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white/40 to-white/10 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 cursor-pointer select-none">
            {company}
          </div>
        ))}
      </motion.div>

      {/* Row 2: Scrolls Right */}
      <motion.div 
        className="flex whitespace-nowrap gap-20 items-center px-4 w-max"
        animate={{ x: ["-50%", "0%"] }}
        transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
      >
        {[...companiesRow2, ...companiesRow2, ...companiesRow2].map((company, i) => (
          <div key={i} className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white/40 to-white/10 hover:from-purple-400 hover:to-pink-500 transition-all duration-300 cursor-pointer select-none">
            {company}
          </div>
        ))}
      </motion.div>
    </section>
  );
}
