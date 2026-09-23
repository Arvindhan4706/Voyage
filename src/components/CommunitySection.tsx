"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2, MoreHorizontal, MapPin, Sparkles } from "lucide-react";

const posts = [
  {
    id: 1,
    user: "Sarah Explorer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&q=80",
    location: "Swiss Alps, Switzerland",
    image: "https://images.unsplash.com/photo-1531366936337-77df329004eb?w=800&q=80",
    likes: "2.4k",
    comments: "142",
    caption: "The AI recommendation was spot on! Best snowboarding conditions I've ever seen. Worth every penny of the predicted budget. 🏂❄️ #TravelGPT",
    tags: ["#Snowboarding", "#Alps", "#AIPlanner"]
  },
  {
    id: 2,
    user: "David Chen",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80",
    location: "Kyoto, Japan",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    likes: "5.1k",
    comments: "320",
    caption: "Avoided the massive crowds at the bamboo forest thanks to the real-time Tourist Density map. Magical experience! 🎋",
    tags: ["#Kyoto", "#SmartTravel", "#Japan"]
  },
  {
    id: 3,
    user: "Emma Travels",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80",
    location: "Santorini, Greece",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&q=80",
    likes: "8.9k",
    comments: "567",
    caption: "Snagged a luxury hotel at 40% off using the Smart Budget Optimizer alerts. Sunset views are unmatched. 🌅",
    tags: ["#Santorini", "#BudgetHacks", "#LuxuryOnABudget"]
  }
];

export default function CommunitySection() {
  return (
    <section className="py-24 max-w-7xl mx-auto px-4 relative z-10">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-4">Travel<span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-orange-400">Community</span></h2>
        <p className="text-gray-400 text-lg">Real stories, real-time tips, and curated experiences from millions of smart travelers.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {posts.map((post, idx) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="glass-panel overflow-hidden flex flex-col group"
          >
            {/* Header */}
            <div className="p-4 flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                <img src={post.avatar} alt={post.user} className="w-10 h-10 rounded-full object-cover border border-cyan-500/50" />
                <div>
                  <h4 className="text-sm font-bold text-white leading-tight">{post.user}</h4>
                  <p className="text-[10px] text-cyan-400 flex items-center gap-1"><MapPin size={10} /> {post.location}</p>
                </div>
              </div>
              <button className="text-gray-500 hover:text-white transition-colors"><MoreHorizontal size={20}/></button>
            </div>

            {/* Image */}
            <div className="relative h-64 w-full overflow-hidden">
              <img src={post.image} alt="Travel Post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>

            {/* Actions */}
            <div className="p-4 border-b border-white/5">
              <div className="flex items-center gap-6 mb-3">
                <button className="flex items-center gap-2 text-gray-400 hover:text-pink-500 transition-colors">
                  <Heart size={20} /> <span className="text-sm font-bold">{post.likes}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-blue-500 transition-colors">
                  <MessageCircle size={20} /> <span className="text-sm font-bold">{post.comments}</span>
                </button>
                <button className="flex items-center gap-2 text-gray-400 hover:text-emerald-500 transition-colors ml-auto">
                  <Share2 size={20} />
                </button>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed mb-2">
                <span className="font-bold text-white mr-2">{post.user}</span>
                {post.caption}
              </p>
              <p className="text-xs text-cyan-400 font-semibold">{post.tags.join(" ")}</p>
            </div>

            {/* ML Summary Box */}
            <div className="p-4 bg-purple-500/5 mt-auto">
              <div className="flex items-center gap-2 text-xs font-bold text-purple-400 mb-1">
                <Sparkles size={12} /> AI Insight
              </div>
              <p className="text-[11px] text-gray-400">Based on user reviews, this destination matches your "Adventure" preference perfectly.</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
