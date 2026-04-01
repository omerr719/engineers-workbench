import React from 'react';
import { Cpu, Zap, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function InteractivePCB({ onSelectTag }) {
  return (
    <div className="glass-panel rounded-xl p-6 h-full flex flex-col relative overflow-hidden">
      <h3 className="text-lg font-bold text-gray-200 mb-6 flex items-center gap-2">
        <Activity className="text-neon-green" />
        Sistem Durumu
      </h3>
      
      <div className="flex-1 border-2 border-dashed border-gray-700/50 rounded-lg p-4 relative group">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+PHBhdGggZD0iTTEgMWgxOHYxOEgxeiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjMjIycSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] opacity-20 transition-opacity group-hover:opacity-40"></div>
        
        {/* Fake MCU Hotspot */}
        <motion.div 
          whileHover={{ scale: 1.1 }}
          onClick={() => onSelectTag('MCU')}
          className="absolute top-1/4 left-1/4 w-16 h-16 bg-dark-bg border border-neon-green rounded flex items-center justify-center cursor-pointer group/mcu shadow-[0_0_15px_rgba(57,255,20,0.2)] hover:shadow-[0_0_25px_rgba(57,255,20,0.8)] transition-all z-10"
        >
          <Cpu className="text-gray-500 group-hover/mcu:text-neon-green" />
          <span className="absolute -bottom-6 text-xs text-gray-400 opacity-0 group-hover/mcu:opacity-100 font-mono">MCU</span>
        </motion.div>

        {/* Fake Power/LDO Hotspot */}
        <motion.div 
          whileHover={{ scale: 1.1 }}
          onClick={() => onSelectTag('Power')}
          className="absolute bottom-1/3 right-1/4 w-12 h-8 bg-dark-bg border border-electronic-blue rounded flex items-center justify-center cursor-pointer group/power shadow-[0_0_15px_rgba(10,132,255,0.2)] hover:shadow-[0_0_25px_rgba(10,132,255,0.8)] transition-all z-10"
        >
          <Zap className="text-gray-500 group-hover/power:text-electronic-blue w-4 h-4" />
          <span className="absolute -top-6 text-xs text-gray-400 opacity-0 group-hover/power:opacity-100 font-mono">PWR</span>
        </motion.div>

        {/* Traces */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 60 70 L 90 70 L 100 90 L 130 90" fill="none" stroke="var(--color-glass-border)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 70 120 L 70 150 L 90 150 M 140 100 L 140 140 L 100 140" fill="none" stroke="var(--color-electronic-blue)" opacity="0.5" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 text-center pointer-events-none">
          <p className="text-xs text-gray-500 font-mono tracking-widest opacity-30 mt-10">PCB DIAGNOSTIC</p>
        </div>
      </div>
    </div>
  );
}
