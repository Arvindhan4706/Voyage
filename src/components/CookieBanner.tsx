"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookieConsent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-[#111] border-t border-gray-200 dark:border-gray-800 z-[100] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="text-sm text-gray-700 dark:text-gray-300">
            We use cookies to improve your experience and for analytics. By continuing to use this site, you agree to our <a href="/privacy" className="text-[#D4AF37] hover:underline">Privacy Policy</a> and <a href="/cookie-policy" className="text-[#D4AF37] hover:underline">Cookie Policy</a>.
          </div>
          <div className="flex gap-4 shrink-0">
            <button 
              onClick={acceptCookies}
              className="px-6 py-2 bg-[#D4AF37] text-white text-sm font-bold rounded-md hover:bg-[#b5952f] transition-colors"
            >
              Accept All
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
