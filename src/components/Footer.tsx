"use client";

import { useState } from "react";
import { Globe, Share2, MessageCircle } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setMessage(data.message || data.error);
      if (data.success) setEmail("");
    } catch {
      setMessage("Failed to subscribe");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="w-full relative z-10 mt-32 border-t border-[#eaeaea] dark:border-[#333333] overflow-hidden bg-white dark:bg-black">
      {/* Background Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[#D4AF37]/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 pt-16 pb-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2">
            <div className="text-3xl font-serif text-black dark:text-white mb-6 tracking-widest uppercase">
              VOYAGE
            </div>
            <p className="text-[#888888] dark:text-[#a3a3a3] max-w-sm leading-relaxed mb-8">
              Curating ultra-premium travel experiences, bespoke itineraries, and immersive luxury exploration for the discerning traveler.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[#555555] dark:text-[#a3a3a3] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all"><Globe size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[#555555] dark:text-[#a3a3a3] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all"><Share2 size={20} /></a>
              <a href="#" className="w-10 h-10 rounded-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 flex items-center justify-center text-[#555555] dark:text-[#a3a3a3] hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all"><MessageCircle size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="text-black dark:text-white font-bold mb-6 tracking-widest uppercase text-xs">Platform</h4>
            <ul className="space-y-4">
              <li><a href="#destinations" className="text-[#888888] dark:text-[#a3a3a3] hover:text-[#D4AF37] transition-colors text-sm">Destinations</a></li>
              <li><a href="#ai-planner" className="text-[#888888] dark:text-[#a3a3a3] hover:text-[#D4AF37] transition-colors text-sm">Curated Itineraries</a></li>
              <li><a href="#packages" className="text-[#888888] dark:text-[#a3a3a3] hover:text-[#D4AF37] transition-colors text-sm">Bespoke Packages</a></li>
              <li><a href="#experiences" className="text-[#888888] dark:text-[#a3a3a3] hover:text-[#D4AF37] transition-colors text-sm">Travel Guides</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-black dark:text-white font-bold mb-6 tracking-widest uppercase text-xs">Newsletter</h4>
            <p className="text-[#888888] dark:text-[#a3a3a3] text-sm mb-4">Subscribe for exclusive luxury travel updates.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
                placeholder="Email Address" 
                className="w-full bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#D4AF37] transition-colors" 
              />
              <button 
                type="submit" 
                disabled={loading} 
                className="bg-[#D4AF37] hover:bg-[#b5952f] text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50"
              >
                {loading ? "..." : "Join"}
              </button>
            </form>
            {message && <p className="text-xs text-[#D4AF37] mt-2">{message}</p>}
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center pt-8 border-t border-[#eaeaea] dark:border-[#333333]">
          <p className="text-[#888888] dark:text-[#a3a3a3] text-sm mb-4 md:mb-0">
            © 2026 Voyage Luxury Travel. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
