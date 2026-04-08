import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ShoppingCart, Info, Trash2, Edit2 } from 'lucide-react';

export default function ComponentDetail({ component, onClose, onDelete, onEdit }) {
  const getTagStyle = (type) => {
    const t = (type || '').toLowerCase();
    if (t.includes('micro') || t.includes('mcu')) return 'text-blue-400 border-blue-400/30 bg-blue-400/10';
    if (t.includes('power') || t.includes('converter') || t.includes('regulator') || t.includes('güç')) return 'text-orange-400 border-orange-400/30 bg-orange-400/10';
    if (t.includes('sensor') || t.includes('sensör')) return 'text-purple-400 border-purple-400/30 bg-purple-400/10';
    if (t.includes('wireless') || t.includes('module') || t.includes('rf') || t.includes('kablosuz')) return 'text-cyan-400 border-cyan-400/30 bg-cyan-400/10';
    return 'text-neon-green border-neon-green/30 bg-neon-green/5'; 
  };

  return (
    <>
      <div className="fixed inset-0 z-30" onClick={onClose}></div>
      
      {/* Outer Scrollable Container */}
      <div className="fixed inset-0 z-40 overflow-y-auto flex justify-end pointer-events-none">
        <motion.div 
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="w-full md:w-[600px] min-h-full bg-dark-panel border-l border-gray-800 shadow-2xl relative pointer-events-auto"
          style={{ isolation: 'isolate' }}
        >
          <div className="absolute top-6 right-6 z-50 flex items-center gap-3 bg-dark-bg/40 backdrop-blur-md rounded-full p-1 border border-white/5">
            {onEdit && (
               <button 
                 onClick={() => onEdit(component)}
                 className="p-2 bg-blue-500/20 text-blue-400 rounded-full hover:bg-blue-500 hover:text-white transition-all border border-blue-500/30"
                 title="Komponenti Düzenle"
               >
                 <Edit2 className="w-5 h-5" />
               </button>
            )}
            {onDelete && (
               <button 
                 onClick={() => onDelete(component.id)}
                 className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all border border-red-500/30"
                 title="Komponenti Sil"
               >
                 <Trash2 className="w-5 h-5" />
               </button>
            )}
          </div>

          <div className="w-full p-8 md:p-10 pt-16 mt-4 relative flex flex-col">
            
            {/* FLOATING IMAGE ON LEFT - MATCHES TEXT BLOCK HEIGHT AND ALIGNS TO BOTTOM */}
            <div className="absolute top-0 bottom-0 pb-8 md:pb-10 right-[100%] mr-8 w-[250px] hidden md:flex flex-col justify-end pointer-events-none z-50">
               <motion.img 
                 initial={{ opacity: 0, scale: 0.8 }}
                 animate={{ opacity: 1, scale: 1 }}
                 transition={{ delay: 0.1, type: "spring" }}
                 src={component.image} 
                 alt={component.name}
                 className="w-full h-auto object-contain rounded-xl shadow-[0_0_40px_rgba(10,132,255,0.15)] border border-glass-border pointer-events-auto bg-dark-bg"
               />
            </div>
            {/* Mobile Image (Hidden on Desktop) */}
            <div className="w-full mb-8 md:hidden">
              <img 
                src={component.image} 
                alt={component.name} 
                className="w-full h-64 object-cover rounded-xl shadow-lg border border-white/10" 
              />
            </div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-electronic-blue/20 text-electronic-blue text-xs font-bold px-3 py-1 rounded-full border border-electronic-blue/30 uppercase tracking-widest">
                  {component.type}
                </span>
                <span className="text-gray-400 text-sm">{component.brand}</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                {component.name}
              </h2>
              
              <div className="flex items-start gap-4 mb-6">
                <Info className="text-neon-green mt-1 flex-shrink-0" />
                <p className="text-gray-300 leading-relaxed md:text-lg">
                  {component.description}
                </p>
              </div>

              {/* Manufacturer Info */}
              {component.brand && (
                <div className="mb-6 ml-10">
                  <span className="text-gray-400 text-sm font-mono opacity-80 uppercase tracking-widest">
                    Manufacturer: 
                  </span>
                  <span className="text-electronic-blue font-semibold ml-2">
                    ({component.brand})
                  </span>
                </div>
              )}


              
              <div className="flex flex-col sm:flex-row gap-4 border-t border-gray-800/60 pt-8 mt-4">
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
                  className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-6 py-3 rounded-lg font-medium transition-all flex-1 justify-center"
                >
                  <FileText className="w-5 h-5" />
                  Datasheet
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
