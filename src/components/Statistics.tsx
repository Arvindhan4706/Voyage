"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Counter = ({ end, suffix = "", label }: { end: number, suffix?: string, label: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      // Easing function (easeOutExpo)
      const ease = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      
      setCount(Math.floor(end * ease));

      if (progress < duration) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [end]);

  return (
    <div className="flex flex-col items-center p-6 glass-panel border-t-4 border-t-cyan-500">
      <div className="text-4xl md:text-5xl font-black text-white mb-2">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-gray-400 font-semibold uppercase tracking-wider text-sm text-center">
        {label}
      </div>
    </div>
  );
};

export default function Statistics() {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Counter end={50000} suffix="+" label="Happy Travelers" />
        <Counter end={1000000} suffix="+" label="Recommendations Generated" />
        <Counter end={150} suffix="+" label="Countries Covered" />
        <Counter end={98} suffix="%" label="Prediction Accuracy" />
      </motion.div>
    </section>
  );
}
