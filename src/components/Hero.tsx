"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useTranslations } from 'next-intl';
import { useRef } from "react";

export default function Hero() {
  const t = useTranslations('Hero');
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);

  return (
    <section ref={ref} className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center mt-0 pt-20 overflow-hidden">
      {/* Background Video - Parallax & Gradient */}
      <motion.div 
        className="absolute inset-0 z-0 bg-black overflow-hidden"
        style={{ y }}
      >
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          src="https://cdn.pixabay.com/video/2023/06/17/167610-836798030_large.mp4"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-white dark:to-black pointer-events-none" />
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10 flex flex-col items-center text-center">
        
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.1,
              }
            }
          }}
          className="max-w-3xl"
        >
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-[10px] md:text-xs tracking-[0.3em] uppercase text-[#D4AF37] font-semibold mb-6"
          >
            {t('subtitle')}
          </motion.p>
          <motion.h1 
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-5xl md:text-7xl font-serif text-white mb-6 tracking-wide drop-shadow-lg font-medium"
          >
            {t('title')}
          </motion.h1>
          <motion.p 
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
            }}
            className="text-sm md:text-base text-white/90 mb-10 drop-shadow-md tracking-[0.05em]"
          >
            {t('description')}
          </motion.p>
        </motion.div>
        
      </div>
    </section>
  );
}
