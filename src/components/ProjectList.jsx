import React from 'react';
import ProjectCard from './ProjectCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProjectList({ projects, onSelect }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
      <AnimatePresence>
        {projects.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="text-center text-gray-500 py-10 col-span-2"
          >
            Sonuç bulunamadı...
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
