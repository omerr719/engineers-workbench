import React from 'react';
import ComponentCard from './ComponentCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function ComponentList({ components, onSelect }) {
  return (
    <div className="flex flex-col gap-4 relative">
      <AnimatePresence>
        {components.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="text-center text-gray-500 py-10"
          >
            Sonuç bulunamadı...
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
