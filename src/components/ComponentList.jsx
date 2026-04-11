import React from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ComponentCard from './ComponentCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function ComponentList({ components, onSelect }) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4 relative">
      <AnimatePresence>
        {components.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-12 text-gray-500 border border-dashed border-gray-800 rounded-2xl bg-white/5 backdrop-blur-md"
          >
            <Search className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-xl font-medium">{t?.noComponentFound}</p>
          </motion.div>
        )}
        
        {components.map((comp) => (
          <ComponentCard 
            key={comp.id} 
            component={comp} 
            onSelect={() => onSelect(comp)} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
