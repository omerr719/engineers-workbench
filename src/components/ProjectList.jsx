import React from 'react';
import { Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ProjectCard from './ProjectCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectList({ projects, onSelect }) {
  const { t } = useLanguage();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
      <AnimatePresence>
        {projects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center p-12 text-gray-500 border border-dashed border-gray-800 rounded-2xl bg-white/5 backdrop-blur-md col-span-full"
          >
            <Search className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-xl font-medium">{t?.noProjectFound || 'Sonuç bulunamadı...'}</p>
          </motion.div>
        )}
        
        {projects.map((proj) => (
          <ProjectCard 
            key={proj.id} 
            project={proj} 
            onSelect={() => onSelect(proj)} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
