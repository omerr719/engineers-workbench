import React, { useEffect, useRef } from 'react';
import { Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SystemTerminal({ logs }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  if (!logs || logs.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[90] w-80 lg:w-96 rounded-xl overflow-hidden glass-panel border-gray-800 shadow-[0_0_20px_rgba(0,0,0,0.8)] flex flex-col pointer-events-none opacity-80 backdrop-blur-md">
      <div className="bg-[#09090b]/90 px-3 py-2 border-b border-glass-border flex items-center gap-2">
         <Terminal className="w-4 h-4 text-neon-green" />
         <span className="text-[10px] text-gray-400 font-mono tracking-widest uppercase">System Terminal</span>
      </div>
      <div 
         ref={scrollRef}
         className="h-36 bg-black/60 p-3 overflow-y-auto overflow-x-hidden font-mono text-xs flex flex-col justify-end custom-scrollbar"
         style={{ scrollBehavior: 'smooth' }}
      >
        <AnimatePresence>
          {logs.map((log) => (
            <motion.div 
              key={log.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              transition={{ duration: 0.3 }}
              className="text-neon-green break-words mb-1.5 leading-relaxed drop-shadow-[0_0_5px_rgba(57,255,20,0.3)] flex items-start"
            >
              <span className="text-gray-500 mr-2 flex-shrink-0 mt-0.5">{'>'}</span> 
              <span>
                <span className="text-gray-400 mr-1">[{new Date(log.timestamp).toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                {log.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
