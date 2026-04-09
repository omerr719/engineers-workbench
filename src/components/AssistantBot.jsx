import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AssistantBot({ focusedField, status }) {
  // Determine eye offset based on active field index or general area
  // We'll map inputs to rough Y positions. 
  // 'top', 'middle', 'bottom'
  let eyeY = 0;
  let eyeX = 0;

  if (focusedField) {
    eyeX = 5; // Look slightly right towards the form
    if (['name', 'type', 'brand'].includes(focusedField)) eyeY = -4;
    else if (['description', 'tags'].includes(focusedField)) eyeY = 0;
    else if (['image', 'datasheet', 'buyLink'].includes(focusedField)) eyeY = 4;
  }

  // If status is success, do a happy bounce and close eyes or shape them
  const isSuccess = status === 'success';

  return (
    <motion.div 
      className="absolute -left-32 md:-left-40 top-1/2 -translate-y-1/2 z-50 pointer-events-none drop-shadow-2xl hidden sm:flex"
      initial={{ x: -50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="relative w-28 h-32 md:w-32 md:h-36">
        {/* Antennas */}
        <motion.div 
          animate={isSuccess ? { y: [-2, 4, -2] } : { y: [-2, 2, -2] }} 
          transition={{ repeat: Infinity, duration: isSuccess ? 0.5 : 3 }}
          className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-10 flex justify-between"
        >
          <div className="w-1 h-full bg-gray-600 rounded-t-full relative">
            <div className={`absolute -top-2 -left-1 w-3 h-3 rounded-full ${isSuccess ? 'bg-neon-green shadow-[0_0_10px_#39FF14]' : 'bg-electronic-blue shadow-[0_0_8px_#0A84FF]'}`}></div>
          </div>
          <div className="w-1 h-full bg-gray-600 rounded-t-full relative">
            <div className={`absolute -top-2 -left-1 w-3 h-3 rounded-full ${isSuccess ? 'bg-neon-green shadow-[0_0_10px_#39FF14]' : 'bg-electronic-blue shadow-[0_0_8px_#0A84FF]'}`}></div>
          </div>
        </motion.div>

        {/* Floating Body */}
        <motion.div 
          animate={isSuccess ? { y: [-5, 10, -5], rotate: [0, -10, 10, 0] } : { y: [-5, 5, -5] }} 
          transition={{ repeat: Infinity, duration: isSuccess ? 1 : 4, ease: "easeInOut" }}
          className="absolute bottom-0 w-full h-[80%] bg-dark-panel border-2 border-gray-700 rounded-2xl flex items-center justify-center shadow-xl overflow-hidden"
        >
          {/* Inner details / Circuit patterns */}
          <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
              backgroundSize: '10px 10px'
          }}></div>

          {/* Screen Face */}
          <div className="w-[85%] h-[60%] bg-black/80 rounded-xl border border-gray-800 flex items-center justify-center relative shadow-inner">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                 <motion.div 
                   key="happy"
                   initial={{ scale: 0 }}
                   animate={{ scale: 1 }}
                   exit={{ scale: 0 }}
                   className="flex gap-4"
                 >
                    {/* Happy Eyes ^ ^ */}
                    <svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 15Q10 5 15 15M25 15Q30 5 35 15" stroke="#39FF14" strokeWidth="4" strokeLinecap="round"/>
                    </svg>
                 </motion.div>
              ) : (
                <motion.div 
                  key="tracking"
                  animate={{ x: eyeX, y: eyeY }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="flex gap-4"
                >
                  {/* Normal tracking eyes */}
                  <div className={`w-3 h-5 rounded-full ${focusedField ? 'bg-electronic-blue shadow-[0_0_10px_#0A84FF]' : 'bg-gray-500'} transition-colors duration-300`}></div>
                  <div className={`w-3 h-5 rounded-full ${focusedField ? 'bg-electronic-blue shadow-[0_0_10px_#0A84FF]' : 'bg-gray-500'} transition-colors duration-300`}></div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Floating Thumbs Up Hand (Only on Success) */}
        <AnimatePresence>
          {isSuccess && (
            <motion.div
              initial={{ scale: 0, x: -20, y: 20, rotate: -45 }}
              animate={{ scale: 1, x: -10, y: 15, rotate: 0 }}
              exit={{ scale: 0, rotate: -45 }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="absolute -right-4 bottom-2 w-10 h-10 bg-dark-panel border-2 border-neon-green rounded-full flex items-center justify-center shadow-[0_0_15px_#39FF14]"
            >
               <span className="text-neon-green font-bold text-lg">✓</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
