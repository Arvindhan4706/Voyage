"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, CreditCard, User, Plane, Hotel, ChevronRight, ChevronLeft, ShieldCheck, Tag } from "lucide-react";
import { useState } from "react";

const STEPS = ["Review Trip", "Guest Details", "Add-ons", "Payment"];

export default function CheckoutFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [payLater, setPayLater] = useState(false);
  const [useCoins, setUseCoins] = useState(false);
  
  const basePrice = 45000;
  const taxes = 8100;
  const coinDiscount = useCoins ? 2500 : 0;
  const total = basePrice + taxes - coinDiscount;
  const deposit = payLater ? total * 0.2 : total;

  return (
    <div className="max-w-4xl mx-auto py-12 px-4 font-outfit">
      
      {/* Progress Bar */}
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4 relative">
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-[#eaeaea] dark:bg-[#333333] -z-10"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-blue-500 -z-10 transition-all duration-500" style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}></div>
          
          {STEPS.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 bg-white dark:bg-black px-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${idx <= currentStep ? 'bg-blue-500 text-white' : 'bg-[#eaeaea] dark:bg-[#333333] text-[#888888]'}`}>
                {idx < currentStep ? <CheckCircle2 size={16} /> : idx + 1}
              </div>
              <span className={`text-xs uppercase tracking-wider font-bold ${idx <= currentStep ? 'text-black dark:text-white' : 'text-[#888888]'}`}>{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Form Area */}
        <div className="md:col-span-2">
          <AnimatePresence mode="wait">
            
            {/* Step 0: Review Trip */}
            {currentStep === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-black dark:text-white">Review Your Selection</h2>
                
                <div className="glass-panel p-6 border border-[#eaeaea] dark:border-[#333333] rounded-2xl flex gap-6">
                  <div className="w-24 h-24 rounded-lg bg-[#eaeaea] dark:bg-[#333333] shrink-0 overflow-hidden">
                    <img src="/images/bali_resort.png" alt="Hotel" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-black dark:text-white mb-1">Four Seasons Resort Bali at Sayan</h3>
                    <p className="text-sm text-[#888888] dark:text-[#a3a3a3] mb-4">Ubud, Bali • Premium River View Suite</p>
                    <div className="flex gap-2">
                      <span className="text-xs bg-green-500/10 text-green-600 dark:text-green-400 px-2 py-1 rounded">Free Cancellation before Oct 10</span>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6 border border-[#eaeaea] dark:border-[#333333] rounded-2xl">
                  <h3 className="font-bold text-lg text-black dark:text-white mb-4">Dates & Guests</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-[#888888] uppercase mb-1">Check-in</p>
                      <p className="font-bold text-black dark:text-white">Oct 15, 2026</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#888888] uppercase mb-1">Check-out</p>
                      <p className="font-bold text-black dark:text-white">Oct 20, 2026</p>
                    </div>
                    <div>
                      <p className="text-xs text-[#888888] uppercase mb-1">Guests</p>
                      <p className="font-bold text-black dark:text-white">2 Adults, 1 Room</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 1: Guest Details */}
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-black dark:text-white">Who's traveling?</h2>
                
                <div className="glass-panel p-6 border border-blue-500/30 bg-blue-500/5 rounded-2xl mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="text-blue-500" />
                      <div>
                        <p className="font-bold text-black dark:text-white">Log in to book faster</p>
                        <p className="text-xs text-[#888888]">Use your saved travelers and VoyageCoins.</p>
                      </div>
                    </div>
                    <button className="text-sm font-bold text-blue-500 hover:underline">Log in</button>
                  </div>
                </div>

                <div className="glass-panel p-6 border border-[#eaeaea] dark:border-[#333333] rounded-2xl space-y-4">
                  <h3 className="font-bold text-lg text-black dark:text-white">Primary Guest</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name" className="p-3 bg-white dark:bg-black border border-[#eaeaea] dark:border-[#333333] rounded-lg outline-none text-black dark:text-white" />
                    <input type="text" placeholder="Last Name" className="p-3 bg-white dark:bg-black border border-[#eaeaea] dark:border-[#333333] rounded-lg outline-none text-black dark:text-white" />
                    <input type="email" placeholder="Email Address" className="col-span-2 p-3 bg-white dark:bg-black border border-[#eaeaea] dark:border-[#333333] rounded-lg outline-none text-black dark:text-white" />
                    <input type="tel" placeholder="Phone Number" className="col-span-2 p-3 bg-white dark:bg-black border border-[#eaeaea] dark:border-[#333333] rounded-lg outline-none text-black dark:text-white" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Add-ons */}
            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-black dark:text-white">Enhance your stay</h2>
                
                <div className="glass-panel p-6 border border-[#eaeaea] dark:border-[#333333] rounded-2xl flex justify-between items-center cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Plane className="text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black dark:text-white">Airport Transfer</h3>
                      <p className="text-xs text-[#888888]">Private luxury car from DPS airport</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-black dark:text-white">+₹3,500</p>
                    <button className="text-xs text-blue-500 font-bold uppercase mt-1">Add</button>
                  </div>
                </div>

                <div className="glass-panel p-6 border border-[#eaeaea] dark:border-[#333333] rounded-2xl flex justify-between items-center cursor-pointer hover:border-blue-500 transition-colors">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <Hotel className="text-yellow-600 dark:text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-black dark:text-white">Spa Package</h3>
                      <p className="text-xs text-[#888888]">90-min couples massage</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-black dark:text-white">+₹8,000</p>
                    <button className="text-xs text-blue-500 font-bold uppercase mt-1">Add</button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <h2 className="text-2xl font-bold text-black dark:text-white">Payment</h2>
                
                <div className="glass-panel p-6 border border-[#eaeaea] dark:border-[#333333] rounded-2xl space-y-4">
                  <label className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${!payLater ? 'border-blue-500 bg-blue-500/5' : 'border-[#eaeaea] dark:border-[#333333]'}`}>
                    <input type="radio" name="paymentOption" className="mt-1" checked={!payLater} onChange={() => setPayLater(false)} />
                    <div>
                      <h3 className="font-bold text-black dark:text-white">Pay Now</h3>
                      <p className="text-xs text-[#888888]">Pay the full amount now and lock in this price.</p>
                    </div>
                    <p className="ml-auto font-bold text-lg text-black dark:text-white">₹{total.toLocaleString()}</p>
                  </label>
                  
                  <label className={`flex gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${payLater ? 'border-blue-500 bg-blue-500/5' : 'border-[#eaeaea] dark:border-[#333333]'}`}>
                    <input type="radio" name="paymentOption" className="mt-1" checked={payLater} onChange={() => setPayLater(true)} />
                    <div>
                      <h3 className="font-bold text-black dark:text-white">Pay Part Now, Rest Later</h3>
                      <p className="text-xs text-[#888888]">Pay 20% today, and the rest by Oct 10.</p>
                    </div>
                    <p className="ml-auto font-bold text-lg text-black dark:text-white">₹{(total * 0.2).toLocaleString()}</p>
                  </label>
                </div>

                <div className="glass-panel p-6 border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 to-transparent rounded-2xl flex justify-between items-center">
                  <div className="flex gap-3 items-center">
                    <Tag className="text-yellow-600 dark:text-yellow-500" />
                    <div>
                      <h3 className="font-bold text-black dark:text-white">Use VoyageCoins</h3>
                      <p className="text-xs text-[#888888]">You have 12,500 coins (Value: ₹2,500)</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setUseCoins(!useCoins)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${useCoins ? 'bg-yellow-500 text-white' : 'bg-[#eaeaea] dark:bg-[#333333] text-black dark:text-white'}`}
                  >
                    {useCoins ? 'Applied' : 'Apply'}
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            <button 
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-opacity ${currentStep === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:bg-[#eaeaea] dark:hover:bg-[#333333] text-black dark:text-white'}`}
            >
              <ChevronLeft size={20} /> Back
            </button>
            
            <button 
              onClick={async () => {
                if (currentStep === STEPS.length - 1) {
                  try {
                    const res = await fetch("/api/checkout_sessions", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        destination: "Bali Full Package",
                        basePrice: basePrice,
                        payLater: payLater,
                        useCoins: useCoins
                      })
                    });
                    const data = await res.json();
                    if (data.url) {
                      window.location.href = data.url;
                    } else {
                      alert("Error initiating checkout");
                    }
                  } catch (error) {
                    console.error(error);
                    alert("Error initiating checkout");
                  }
                } else {
                  setCurrentStep(prev => Math.min(STEPS.length - 1, prev + 1));
                }
              }}
              className="flex items-center gap-2 px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/25 transition-transform hover:-translate-y-0.5"
            >
              {currentStep === STEPS.length - 1 ? (
                <><ShieldCheck size={20} /> Pay ₹{deposit.toLocaleString()}</>
              ) : (
                <>Next <ChevronRight size={20} /></>
              )}
            </button>
          </div>
        </div>

        {/* Right Sidebar: Price Summary */}
        <div className="md:col-span-1">
          <div className="glass-panel p-6 border border-[#eaeaea] dark:border-[#333333] rounded-2xl sticky top-24">
            <h3 className="font-bold text-xl text-black dark:text-white mb-6">Price Summary</h3>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-[#888888]">
                <span>1 Room x 5 Nights</span>
                <span>₹{basePrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#888888]">
                <span>Taxes & Fees (18%)</span>
                <span>₹{taxes.toLocaleString()}</span>
              </div>
              {useCoins && (
                <div className="flex justify-between text-yellow-600 dark:text-yellow-500 font-bold">
                  <span>VoyageCoins Applied</span>
                  <span>-₹{coinDiscount.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            <div className="pt-4 border-t border-[#eaeaea] dark:border-[#333333] mb-6">
              <div className="flex justify-between items-end mb-2">
                <span className="font-bold text-black dark:text-white">Total</span>
                <span className="text-2xl font-black text-black dark:text-white">₹{total.toLocaleString()}</span>
              </div>
              {payLater && (
                <div className="flex justify-between text-blue-500 font-bold text-sm bg-blue-500/10 p-3 rounded-lg mt-4">
                  <span>Due Today</span>
                  <span>₹{deposit.toLocaleString()}</span>
                </div>
              )}
            </div>

            <p className="text-[10px] text-[#888888] text-center">
              By proceeding, you agree to our Terms of Service and Privacy Policy. Payments are securely processed by Stripe.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
