"use client";

import { motion } from "framer-motion";
import { Check, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function PricingFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    { q: "How accurate are the AI recommendations?", a: "Our models boast a 98% prediction accuracy, trained continuously via our advanced MLOps pipeline on global tourism datasets." },
    { q: "Can I book flights directly?", a: "Currently, TravelGPT acts as your ultimate intelligent itinerary planner. Direct booking integration is launching in Q4 2026." },
    { q: "Is my personal data safe?", a: "Absolutely. We employ enterprise-grade encryption and strict anonymization protocols during feature engineering." }
  ];

  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      {/* Pricing */}
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-aurora-green to-cyan-400">Pricing</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
        {/* Free Plan */}
        <motion.div className="glass-panel p-8 flex flex-col" whileHover={{ y: -10 }}>
          <h3 className="text-2xl font-bold text-white mb-2">Free Plan</h3>
          <p className="text-gray-400 mb-6">Basic AI recommendations.</p>
          <div className="text-4xl font-black text-white mb-6">₹0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex gap-2 text-gray-300"><Check className="text-cyan-400" size={20} /> 3 searches per day</li>
            <li className="flex gap-2 text-gray-300"><Check className="text-cyan-400" size={20} /> Standard ML Model</li>
          </ul>
          <button className="w-full py-3 rounded-lg border border-white/20 text-white font-bold hover:bg-white/10 transition-colors">Get Started</button>
        </motion.div>

        {/* Pro Plan */}
        <motion.div className="glass-panel p-8 flex flex-col relative border-cyan-500 shadow-[0_0_30px_rgba(6,182,212,0.2)] md:-translate-y-4" whileHover={{ y: -14 }}>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-cyan-500 to-blue-500 px-4 py-1 rounded-full text-sm font-bold text-white">Most Popular</div>
          <h3 className="text-2xl font-bold text-white mb-2">Pro AI Plan</h3>
          <p className="text-gray-400 mb-6">Unlimited, deep personalization.</p>
          <div className="text-4xl font-black text-white mb-6">₹999<span className="text-lg text-gray-500 font-normal">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex gap-2 text-gray-300"><Check className="text-cyan-400" size={20} /> Unlimited searches</li>
            <li className="flex gap-2 text-gray-300"><Check className="text-cyan-400" size={20} /> Advanced XGBoost Model</li>
            <li className="flex gap-2 text-gray-300"><Check className="text-cyan-400" size={20} /> Interactive Chatbot Access</li>
          </ul>
          <button className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-bold hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] transition-all">Upgrade Now</button>
        </motion.div>

        {/* Enterprise */}
        <motion.div className="glass-panel p-8 flex flex-col" whileHover={{ y: -10 }}>
          <h3 className="text-2xl font-bold text-white mb-2">Enterprise</h3>
          <p className="text-gray-400 mb-6">API access for travel agencies.</p>
          <div className="text-4xl font-black text-white mb-6">Custom</div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex gap-2 text-gray-300"><Check className="text-cyan-400" size={20} /> REST API Access</li>
            <li className="flex gap-2 text-gray-300"><Check className="text-cyan-400" size={20} /> Dedicated MLOps Support</li>
          </ul>
          <button className="w-full py-3 rounded-lg border border-white/20 text-white font-bold hover:bg-white/10 transition-colors">Contact Sales</button>
        </motion.div>
      </div>

      {/* FAQ */}
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-extrabold text-white mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass-panel overflow-hidden">
              <button 
                className="w-full p-6 text-left flex justify-between items-center text-white font-bold"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                <ChevronDown className={`transition-transform ${openFaq === i ? 'rotate-180 text-cyan-400' : ''}`} />
              </button>
              <motion.div 
                initial={false}
                animate={{ height: openFaq === i ? 'auto' : 0, opacity: openFaq === i ? 1 : 0 }}
                className="px-6 text-gray-400"
              >
                <div className="pb-6">{faq.a}</div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
