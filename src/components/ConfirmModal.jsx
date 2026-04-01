import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Trash2, X } from 'lucide-react';

export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onCancel}></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="relative bg-dark-bg border border-red-500/30 rounded-2xl p-6 max-w-md w-full shadow-2xl overflow-hidden isolate"
      >
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-red-600 to-orange-500"></div>
        <div className="absolute inset-0 bg-red-500/5 pointer-events-none"></div>

        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-4 border border-red-500/20">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2">Emin misiniz?</h3>
          <p className="text-gray-400 mb-8 px-4 leading-relaxed">
            {message}
          </p>
          
          <div className="flex gap-4 w-full">
            <button 
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-glass-border text-white rounded-xl font-medium transition-colors"
            >
              Hayır, İptal
            </button>
            <button 
              onClick={onConfirm}
              className="flex-1 px-4 py-3 bg-red-600/90 hover:bg-red-500 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(220,38,38,0.3)]"
            >
              <Trash2 className="w-5 h-5" />
              Evet, Sil
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
