import React from 'react';
import { motion } from 'framer-motion';
import { X, FileText, ShoppingCart, Info, Trash2 } from 'lucide-react';

export default function ComponentDetail({ component, onClose, onDelete }) {
  const getTagStyle = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('micro') || t.includes('mcu')) return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    if (t.includes('power') || t.includes('converter') || t.includes('regulator') || t.includes('güç')) return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
    if (t.includes('sensor') || t.includes('sensör')) return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
    if (t.includes('wireless') || t.includes('module') || t.includes('rf') || t.includes('kablosuz')) return 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10';
    return 'text-neon-green border-neon-green/30 bg-neon-green/5'; 
  };

  return (
    <motion.div 
      initial={{ x: '100%' }}
      animate={{ x: 0 }}
      exit={{ x: '100%' }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-y-0 right-0 w-full md:w-3/4 max-w-4xl glass-panel border-l border-glass-border shadow-2xl z-40 overflow-y-auto"
      style={{ isolation: 'isolate' }}
    >
      <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
        {onDelete && (
           <button 
             onClick={() => onDelete(component.id)}
             className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all border border-red-500/30"
             title="Komponenti Sil"
           >
             <Trash2 className="w-6 h-6" />
           </button>
        )}
        <button 
          onClick={onClose}
          className="p-2 bg-dark-bg/50 text-white rounded-full hover:bg-white/10 transition-colors"
          title="Kapat"
        >
          <X className="w-8 h-8" />
        </button>
      </div>

      <div className="flex flex-col md:flex-row h-full">
        {/* Left Section: Image rendering */}
        <div className="w-full md:w-1/3 bg-dark-bg p-8 flex items-center justify-center border-b md:border-b-0 md:border-r border-glass-border relative">
          <motion.img 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            src={component.image} 
            alt={component.name}
            className="w-full h-64 object-cover rounded-xl shadow-[0_0_30px_rgba(10,132,255,0.2)]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 to-transparent pointer-events-none md:hidden"></div>
        </div>

        {/* Middle Section: Information */}
        <div className="w-full md:w-2/3 p-8 flex flex-col">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-electronic-blue/20 text-electronic-blue text-xs font-bold px-3 py-1 rounded-full border border-electronic-blue/30 uppercase tracking-widest">
                {component.type}
              </span>
            </div>
            
            <h2 className="text-4xl font-bold text-white mb-6">
              {component.name}
            </h2>
            
            <div className="flex items-start gap-4 mb-8">
              <Info className="text-neon-green mt-1 flex-shrink-0" />
              <p className="text-gray-300 leading-relaxed text-lg">
                {component.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 mb-10">
              {component.tags.map(tag => (
                <span key={tag} className={`text-sm border px-3 py-1.5 rounded-md ${getTagStyle(component.type)}`}>
                  {tag}
                </span>
              ))}
            </div>
            
            <div className="flex gap-4 mt-auto border-t border-glass-border pt-8">
              <a 
                href={component.buyLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-gradient-to-r from-electronic-blue to-blue-600 hover:from-blue-600 hover:to-electronic-blue text-white px-6 py-3 rounded-lg font-medium shadow-lg hover:shadow-electronic-blue/50 transition-all flex-1 justify-center"
              >
                <ShoppingCart className="w-5 h-5" />
                Satın Al
              </a>
              
              <a 
                href={component.datasheet}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all flex-1 justify-center"
              >
                <FileText className="w-5 h-5" />
                Datasheet
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
