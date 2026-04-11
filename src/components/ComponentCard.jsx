import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ComponentCard({ component, onSelect }) {
  const { t } = useLanguage();
  const [isHovered, setIsHovered] = useState(false);

  const getTagStyle = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('micro') || t.includes('mcu')) return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    if (t.includes('power') || t.includes('converter') || t.includes('regulator') || t.includes('güç')) return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
    if (t.includes('sensor') || t.includes('sensör')) return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
    if (t.includes('wireless') || t.includes('module') || t.includes('rf') || t.includes('kablosuz')) return 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10';
    return 'text-neon-green border-neon-green/30 bg-neon-green/5'; // default neon green
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      className="relative glass-panel rounded-xl p-5 cursor-pointer flex items-center justify-between group overflow-visible"
      onClick={onSelect}
      style={{ isolation: 'isolate' }}
    >
      {/* TEXT CONTENT (Hover Trigger Zone) */}
      <div 
        className="flex-1 max-w-[70%] flex items-center"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative w-fit pr-4">
          <h3 className="text-xl font-bold text-electronic-blue group-hover:text-neon-green transition-colors w-fit">
            {component.name}
          </h3>
          <p className="text-gray-400 text-sm mb-2 w-fit">{component.type}</p>
          <div className="flex flex-wrap gap-2 mt-2 py-1 w-fit">
            {component.tags.map(tag => (
              <span key={tag} className={`text-xs border px-2 py-1 rounded-md ${getTagStyle(component.type)}`}>
                {tag}
              </span>
            ))}
          </div>

          {/* FIXED CLEAN FLOATING IMAGE (Positioned exactly right to the text) */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: -10 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: 10 }}
                transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
                className="absolute left-[100%] ml-4 md:ml-8 top-1/2 -translate-y-1/2 z-50 pointer-events-none"
              >
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-white/5 border border-white/10 p-1 flex items-center justify-center shadow-2xl backdrop-blur-xl">
                  <img 
                    src={component.image} 
                    alt={component.name} 
                    className="max-w-full max-h-full object-contain rounded-md"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center text-gray-500 group-hover:text-electronic-blue transition-colors relative z-10 pl-4 bg-gradient-to-l from-dark-panel to-transparent">
        <span className="text-sm mr-2 opacity-0 group-hover:opacity-100 transition-opacity">{t?.detailsBtn}</span>
        <ChevronRight className="transition-transform group-hover:translate-x-2" />
      </div>
    </motion.div>
  );
}
