"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bot } from "lucide-react";

export default function ChatAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, sender: "ai", text: "Hello! I'm TravelGPT. How can I help you plan your next adventure?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const getAIResponse = (msg: string): string => {
    const m = msg.toLowerCase();
    if (m.includes("budget") || m.includes("cheap") || m.includes("affordable")) {
      return "For budget travel in India, I recommend Rishikesh (₹10k), Hampi (₹8k), or Ooty (₹10k). International budget picks: Bali & Vietnam! 💰";
    } else if (m.includes("beach") || m.includes("sea") || m.includes("ocean")) {
      return "Top beach destinations: Goa 🏖️, Andaman Islands, Varkala Kerala, and Puri! Best time: October–March.";
    } else if (m.includes("hill") || m.includes("mountain") || m.includes("snow") || m.includes("cold")) {
      return "For hills & mountains: Manali, Spiti Valley, Darjeeling, Coorg, and Ooty! Best season: April–June & Oct–Nov. 🏔️";
    } else if (m.includes("honeymoon") || m.includes("couple") || m.includes("romantic")) {
      return "Best honeymoon spots: Bali 🌴, Santorini, Kerala backwaters, Andaman, and Coorg! Budget: ₹30k–₹80k for a week.";
    } else if (m.includes("adventure") || m.includes("trek") || m.includes("rafting")) {
      return "Adventure awaits! Top picks: Rishikesh (rafting), Manali (skiing), Spiti Valley (trekking), Coorg (zip-line). 🏄";
    } else if (m.includes("july") || m.includes("monsoon") || m.includes("rain")) {
      return "Best July destinations: Kerala Backwaters 🚢, Coorg (lush green), Ladakh, Rajasthan. Avoid beach destinations in monsoon!";
    } else if (m.includes("ooty") || m.includes("hidden") || m.includes("offbeat")) {
      return "Hidden gems near Ooty: Coonoor, Kotagiri, Mudumalai, and Hogenakkal Falls. 🌿 Perfect for a weekend getaway!";
    } else if (m.includes("visa") || m.includes("passport")) {
      return "For Indians: Bali (free on arrival), Thailand (free), Sri Lanka (free). Apply for Schengen/UK/USA visas 2–3 months in advance. 🛂";
    } else if (m.includes("hotel") || m.includes("stay") || m.includes("accomodation")) {
      return "I recommend booking via verified platforms. For budget: ₹800–₹2000/night. Mid-range: ₹2000–₹6000. Luxury: ₹6000+. 🏨";
    } else if (m.includes("flight") || m.includes("ticket") || m.includes("fly")) {
      return "Book flights 3–6 weeks in advance for best prices. Tuesday/Wednesday flights are usually cheapest. Check our Price Prediction section above! ✈️";
    } else {
      return "Great question! I can help with destinations, budgets, travel tips, visas, and itinerary planning. Try asking about specific places or travel styles! 🌍";
    }
  };

  const handleSend = () => {
    if (!input.trim()) return;
    
    // Add user message
    const newMsg = { id: Date.now(), sender: "user", text: input };
    const currentInput = input;
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    setIsTyping(true);

    // Smart AI response
    setTimeout(() => {
      const aiResponse = { 
        id: Date.now() + 1, 
        sender: "ai", 
        text: getAIResponse(currentInput)
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Floating Action Button */}
      <motion.button 
        className="fixed bottom-8 right-8 z-50 p-4 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)] hover:shadow-[0_0_30px_rgba(6,182,212,0.8)] transition-all"
        onClick={() => setIsOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <MessageSquare size={28} />
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-8 z-50 w-80 md:w-96 rounded-2xl glass-panel overflow-hidden border border-cyan-500/30 shadow-2xl flex flex-col h-[550px]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600/80 to-cyan-600/80 p-4 flex justify-between items-center backdrop-blur-md">
              <div className="flex items-center gap-2">
                <Bot size={24} className="text-white" />
                <div>
                  <h3 className="text-white font-bold leading-tight">TravelGPT Assistant</h3>
                  <p className="text-[10px] text-cyan-200">Online • Ready to plan</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
              {messages.map(msg => (
                <motion.div 
                  key={msg.id}
                  initial={{ opacity: 0, x: msg.sender === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`max-w-[85%] p-3 rounded-2xl ${msg.sender === "user" ? "bg-gradient-to-r from-cyan-500 to-blue-600 self-end rounded-tr-sm" : "bg-white/10 self-start rounded-tl-sm border border-white/10"}`}
                >
                  <p className="text-sm text-white leading-relaxed">{msg.text}</p>
                </motion.div>
              ))}
              
              {isTyping && (
                <div className="self-start bg-white/10 p-3 rounded-2xl rounded-tl-sm border border-white/10">
                  <div className="flex gap-1">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }} className="w-2 h-2 bg-cyan-400 rounded-full" />
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 0.6, delay: 0.4 }} className="w-2 h-2 bg-cyan-400 rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Prompts */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-col gap-2">
                <button onClick={() => { setInput("Where should I travel in July?"); handleSend(); }} className="text-left text-xs bg-black/40 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg p-2 transition-colors">"Where should I travel in July?"</button>
                <button onClick={() => { setInput("Suggest hidden gems near Ooty."); handleSend(); }} className="text-left text-xs bg-black/40 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg p-2 transition-colors">"Suggest hidden gems near Ooty."</button>
                <button onClick={() => { setInput("Plan a honeymoon under ₹50,000."); handleSend(); }} className="text-left text-xs bg-black/40 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg p-2 transition-colors">"Plan a honeymoon under ₹50,000."</button>
              </div>
            )}

            {/* Input Area */}
            <div className="p-4 border-t border-white/10 bg-black/60 backdrop-blur-xl">
              <div className="flex gap-2 mb-2">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask anything..."
                  className="flex-1 bg-white/5 border border-white/20 rounded-full px-4 py-2 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
                <button 
                  onClick={handleSend}
                  className="p-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:scale-105 transition-transform"
                >
                  <Send size={18} />
                </button>
              </div>
              <p className="text-center text-[9px] text-gray-500 font-bold tracking-widest uppercase">Powered by Travel LLM • RAG • Recommendation Engine</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
