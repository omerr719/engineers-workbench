import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function IntroAnimation({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Framer Motion variants for SVG traces
  const traceVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: { 
      pathLength: 1, 
      opacity: 1,
      transition: { duration: 2, ease: "easeInOut" }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg">
      <div className="relative w-64 h-64 flex items-center justify-center">
        {/* PCB Trace SVG Animation */}
        <svg className="absolute inset-0 w-full h-full circuit-glow" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <motion.path 
            d="M 10 50 L 30 50 L 40 30 L 60 30 L 70 50 L 90 50" 
            stroke="var(--color-neon-green)" 
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
            variants={traceVariants}
            initial="hidden"
            animate="visible"
          />
          <motion.path 
            d="M 20 80 L 40 80 L 50 60 L 70 60 L 80 80" 
            stroke="var(--color-electronic-blue)" 
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            variants={traceVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          />
          <motion.circle 
            cx="50" cy="50" r="4" 
            fill="var(--color-neon-green)" 
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 2.2, duration: 0.5, type: "spring" }}
          />
        </svg>

        {/* Text Fade In */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="absolute mt-20 text-center"
        >
          <span className="text-xl tracking-[0.2em] text-white font-light">SYSTEM</span>
          <br/>
          <span className="text-xs text-electronic-blue">INITIALIZING...</span>
        </motion.div>
      </div>
    </div>
  );
}
