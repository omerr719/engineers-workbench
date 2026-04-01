import React from 'react';
import { motion } from 'framer-motion';
import { FolderGit2 } from 'lucide-react';

export default function ProjectCard({ project, onSelect }) {
  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      className="relative glass-panel rounded-xl overflow-hidden cursor-pointer group"
      onClick={onSelect}
    >
      <div className="h-40 w-full relative">
        <img 
          src={project.cover_image} 
          alt={project.name} 
          className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg to-transparent"></div>
        <div className="absolute bottom-4 left-4 flex items-center gap-2">
          <FolderGit2 className="text-neon-green w-5 h-5" />
          <h3 className="text-xl font-bold text-white shadow-sm">
            {project.name}
          </h3>
        </div>
      </div>
      
      <div className="p-4">
        <p className="text-gray-400 text-sm line-clamp-2">{project.description}</p>
        <div className="mt-4 flex items-center text-electronic-blue text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Sistemi İncele &rarr;
        </div>
      </div>
    </motion.div>
  );
}
