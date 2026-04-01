import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { motion } from 'framer-motion';

const placeholders = ["'Buck Converter'", "'MCU'", "'Sensör'", "'STM32'", "'LDO Regulator'", "'4-20mA Transmitter'"];

export default function SearchBar({ query, setQuery }) {
  const [isFocused, setIsFocused] = useState(false);
  
  // Typing Effect State
  const [placeholderText, setPlaceholderText] = useState('');
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);
  const [showCursor, setShowCursor] = useState(true);

  // Blinking Cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  useEffect(() => {
    if (subIndex === placeholders[index].length + 1 && !reverse) {
      const waitTimeout = setTimeout(() => setReverse(true), 1500); // Kelime bitince bekle
      return () => clearTimeout(waitTimeout);
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % placeholders.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, reverse ? 40 : 100);

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  useEffect(() => {
    setPlaceholderText(placeholders[index].substring(0, subIndex));
  }, [subIndex, index]);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      <motion.div 
        animate={{ 
          boxShadow: isFocused ? "0 0 20px rgba(10, 132, 255, 0.4)" : "0 0 0px rgba(10, 132, 255, 0)",
          borderColor: isFocused ? "var(--color-electronic-blue)" : "var(--color-glass-border)"
        }}
        className="relative flex items-center w-full glass-panel rounded-full px-6 py-4 overflow-hidden transition-colors"
      >
        <Search className={`w-6 h-6 mr-4 transition-colors ${isFocused ? 'text-electronic-blue' : 'text-gray-400'}`} />
        
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={`Ara: ${placeholderText}${showCursor ? '|' : ' '}`}
          className="flex-1 bg-transparent border-none outline-none text-lg text-white placeholder-gray-500 font-mono tracking-wide"
        />

        {/* Oscilloscope wave line effect when focused */}
        {isFocused && (
          <motion.div 
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            exit={{ opacity: 0, scaleX: 0 }}
            className="absolute bottom-0 left-0 h-1 bg-electronic-blue w-full scale-x-0 origin-left"
            style={{
              backgroundImage: 'linear-gradient(90deg, transparent, var(--color-neon-green) 50%, transparent)'
            }}
          />
        )}
      </motion.div>
    </div>
  );
}
