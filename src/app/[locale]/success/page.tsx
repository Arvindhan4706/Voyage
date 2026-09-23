"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

export default function SuccessPage() {
  useEffect(() => {
    // Fire confetti on load
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 bg-background flex flex-col items-center justify-center text-center relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-background to-background" />
      
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="mb-8 relative z-10"
      >
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/30">
          <CheckCircle className="w-12 h-12 text-emerald-400" />
        </div>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative z-10 max-w-lg"
      >
        <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">Booking Confirmed!</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Your exclusive Voyage AI luxury trip has been successfully booked. Our concierge team is now preparing your personalized travel documents.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/bookings" className="px-8 py-3 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl font-bold transition-colors shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
            View My Bookings <ArrowRight size={18} />
          </Link>
          <Link href="/" className="px-8 py-3 bg-background/50 border border-border hover:bg-muted/50 rounded-xl font-bold transition-colors flex items-center justify-center">
            Return Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
