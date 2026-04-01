import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

export default function ComponentCard({ component, onSelect }) {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    // Determine bounds and position relatively near the mouse
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left + 20; // 20px offset to the right
    const y = e.clientY - rect.top - 50;  // 50px offset up
    setMousePos({ x, y });
  };

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      onClick={onSelect}
      style={{ isolation: 'isolate' }}
    >
      <div className="flex-1">
        <h3 className="text-xl font-bold text-electronic-blue group-hover:text-neon-green transition-colors">
          {component.name}
        </h3>
        <p className="text-gray-400 text-sm mb-2">{component.type}</p>
        <div className="flex flex-wrap gap-2 mt-2 overflow-hidden">
          {component.tags.map(tag => (
            <span key={tag} className={`text-xs border px-2 py-1 rounded-md ${getTagStyle(component.type)}`}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="flex items-center text-gray-500 group-hover:text-electronic-blue transition-colors">
        <span className="text-sm mr-2 opacity-0 group-hover:opacity-100 transition-opacity">Detay</span>
        <ChevronRight className="transition-transform group-hover:translate-x-2" />
      </div>

      {/* Floating Image Portal Effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ 
              y: { repeat: Infinity, duration: 4, ease: "easeInOut" },
              opacity: { duration: 0.2 },
              scale: { duration: 0.2 }
            }}
            style={{
              position: 'absolute',
              left: mousePos.x,
              top: mousePos.y,
              zIndex: 100,
              pointerEvents: 'none'
            }}
            className="w-48 h-48 rounded-xl glass-panel p-2 shadow-2xl flex items-center justify-center border-neon-green/30"
          >
            <img 
              src={component.image} 
              alt={component.name} 
              className="w-full h-full object-cover rounded-lg"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
