import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Cpu, Layers, Radio, Box, TerminalSquare, ArrowRight, Mail, Linkedin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import ProfileCard from './ProfileCard';

function PCBTraces() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const traces = [];
    const numTraces = 30; // Devre yollari (elektronlar)

    class Trace {
      constructor() {
        this.reset();
      }
      
      reset() {
        this.path = [];
        this.gridSize = 40; 
        
        let startX = Math.floor(Math.random() * (width / this.gridSize)) * this.gridSize;
        let startY = Math.floor(Math.random() * (height / this.gridSize)) * this.gridSize;
        
        this.path.push({x: startX, y: startY});
        
        let currentX = startX;
        let currentY = startY;
        
        let segments = Math.floor(Math.random() * 5) + 3; // 3 to 7 lines per trace
        let currentDir = Math.floor(Math.random() * 4); 
        
        for(let i=0; i<segments; i++) {
           let length = (Math.floor(Math.random() * 6) + 2) * this.gridSize;
           let isDiagonal = Math.random() > 0.8; // 20% chace for 45-deg routing
           
           if (isDiagonal) {
              let diagDirX = Math.random() > 0.5 ? 1 : -1;
              let diagDirY = Math.random() > 0.5 ? 1 : -1;
              currentX += length * diagDirX;
              currentY += length * diagDirY;
           } else {
              if (currentDir === 0) currentY -= length;
              else if (currentDir === 1) currentX += length;
              else if (currentDir === 2) currentY += length;
              else if (currentDir === 3) currentX -= length;
              
              currentDir = (currentDir + (Math.random() > 0.5 ? 1 : -1) + 4) % 4;
           }
           
           this.path.push({x: currentX, y: currentY});
        }
        
        this.totalLength = this.calculateTotalLength();
        this.progress = -Math.random() * 400; // Delay start
        this.speed = Math.random() * 2 + 1.5; // velocity of electron
        this.color = Math.random() > 0.5 ? 'rgba(57, 255, 20,' : 'rgba(10, 132, 255,';
        this.tailLength = 150;
      }
      
      calculateTotalLength() {
        let len = 0;
        for(let i=0; i<this.path.length - 1; i++) {
           let dx = this.path[i+1].x - this.path[i].x;
           let dy = this.path[i+1].y - this.path[i].y;
           len += Math.sqrt(dx*dx + dy*dy);
        }
        return len;
      }
      
      getPointAtDistance(d) {
         if (d <= 0) return this.path[0];
         if (d >= this.totalLength) return this.path[this.path.length - 1];
         
         let currentLen = 0;
         for(let i=0; i<this.path.length - 1; i++) {
            let dx = this.path[i+1].x - this.path[i].x;
            let dy = this.path[i+1].y - this.path[i].y;
            let segLen = Math.sqrt(dx*dx + dy*dy);
            
            if (currentLen + segLen >= d) {
               let ratio = (d - currentLen) / segLen;
               return {
                  x: this.path[i].x + dx * ratio,
                  y: this.path[i].y + dy * ratio
               };
            }
            currentLen += segLen;
         }
         return this.path[this.path.length - 1];
      }
      
      update() {
        this.progress += this.speed;
        if (this.progress > this.totalLength + this.tailLength) {
           this.reset();
        }
      }
      
      draw() {
         // Draw faint copper trace
         ctx.beginPath();
         ctx.moveTo(this.path[0].x, this.path[0].y);
         for(let i=1; i<this.path.length; i++) {
            ctx.lineTo(this.path[i].x, this.path[i].y);
         }
         ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
         ctx.lineWidth = 1;
         ctx.lineJoin = 'round';
         ctx.stroke();
         
         if (this.progress > 0) {
           let headDist = Math.min(this.progress, this.totalLength);
           let tailDist = Math.max(0, this.progress - this.tailLength);
           
           if (tailDist < this.totalLength) {
               let head = this.getPointAtDistance(headDist);
               
               // Head Core
               ctx.beginPath();
               ctx.arc(head.x, head.y, 2.5, 0, Math.PI * 2);
               ctx.fillStyle = `${this.color} 1)`;
               ctx.fill();
               
               // Head Glow 
               ctx.beginPath();
               ctx.arc(head.x, head.y, 8, 0, Math.PI * 2);
               ctx.fillStyle = `${this.color} 0.3)`;
               ctx.fill();
               
               // Trail (history dots)
               const trailCount = 20;
               for (let idx=1; idx <= trailCount; idx++) {
                   let d = headDist - (idx * 6); 
                   if (d > tailDist && d > 0) {
                       let p = this.getPointAtDistance(d);
                       let opacity = 1 - (idx / trailCount);
                       ctx.beginPath();
                       ctx.arc(p.x, p.y, Math.max(0.5, 2 * opacity), 0, Math.PI * 2);
                       ctx.fillStyle = `${this.color} ${opacity * 0.6})`;
                       ctx.fill();
                   }
               }
           }
         }
      }
    }

    for (let i = 0; i < numTraces; i++) {
      traces.push(new Trace());
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = 'rgba(255, 255, 255, 0.02)';
      for(let x = 0; x < width; x += 40) {
         for(let y = 0; y < height; y += 40) {
            ctx.beginPath();
            ctx.arc(x, y, 1, 0, Math.PI * 2);
            ctx.fill();
         }
      }

      traces.forEach(t => {
        t.update();
        t.draw();
      });
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 bg-dark-bg opacity-70"
    />
  );
}

export default function LandingPage({ onEnter }) {
  const { lang, t } = useLanguage();

  // Profil efekti icin animasyon varyantlari
  const imageVariants = {
    hidden: { filter: 'blur(30px)', opacity: 0, scale: 1.1 },
    visible: { 
      filter: 'blur(0px)', 
      opacity: 1, 
      scale: 1,
      transition: { duration: 2, ease: "easeOut" }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({ 
      opacity: 1, 
      y: 0,
      transition: { delay: i * 0.2 + 0.5, duration: 0.8, ease: "easeOut" }
    })
  };

  return (
    <div className="relative min-h-screen font-sans text-white overflow-x-hidden bg-dark-bg">
      <PCBTraces />
      
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-12 md:py-24">
        
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* SOL KOLON: SABIT (STICKY) RESIM */}
          <div className="w-full lg:w-5/12 static lg:sticky top-24">
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={imageVariants}
            >
              <ProfileCard
                name={t?.name}
                title={t?.jobTitle}
                handle="omerrilhan"
                status="Online"
                contactText={t?.aboutHeader}
                avatarUrl="/profile.jpg.jpeg"
                showUserInfo={true}
                enableTilt={true}
                enableMobileTilt={true}
                onContactClick={() => {
                  const mailto = "mailto:omerrilhan34@gmail.com";
                  window.location.href = mailto;
                }}
                behindGlowColor="rgba(125, 190, 255, 0.67)"
                behindGlowEnabled={true}
                innerGradient="linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)"
              />
            </motion.div>
          </div>

          {/* SAĞ KOLON: İÇERİK (HAKKIMDA) */}
          <div className="w-full lg:w-7/12 pt-8 lg:pt-0">
            
            <motion.div custom={1} initial="hidden" animate="visible" variants={textVariants}>
              <div className="flex items-center gap-3 mb-6">
                <TerminalSquare className="w-8 h-8 text-electronic-blue" />
                <h3 className="text-sm font-bold tracking-[0.2em] text-electronic-blue uppercase">{t?.aboutHeader}</h3>
              </div>
              <p className="text-xl leading-relaxed text-gray-300 font-light mb-8">
                {t?.aboutP1}
              </p>
              <p className="text-xl leading-relaxed text-gray-300 font-light mb-16">
                {t?.aboutP2}
              </p>
            </motion.div>

            <motion.div custom={2} initial="hidden" animate="visible" variants={textVariants} className="mb-16">
               <h3 className="text-2xl font-bold text-white mb-8 border-b border-gray-800 pb-4">{t?.techExpertise}</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {/* KART 1 */}
                 <div className="glass-panel p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300 border-t border-t-electronic-blue/30">
                   <Cpu className="w-8 h-8 text-electronic-blue mb-4" />
                   <h4 className="text-lg font-bold text-white mb-2">{t?.expertise1Title}</h4>
                   <p className="text-sm text-gray-400 leading-relaxed">
                     {t?.expertise1Desc}
                   </p>
                 </div>

                 {/* KART 2 */}
                 <div className="glass-panel p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300 border-t border-t-neon-green/30">
                   <Layers className="w-8 h-8 text-neon-green mb-4" />
                   <h4 className="text-lg font-bold text-white mb-2">{t?.expertise2Title}</h4>
                   <p className="text-sm text-gray-400 leading-relaxed">
                     {t?.expertise2Desc}
                   </p>
                 </div>

                 {/* KART 3 */}
                 <div className="glass-panel p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300 border-t border-t-yellow-500/30">
                   <Radio className="w-8 h-8 text-yellow-500 mb-4" />
                   <h4 className="text-lg font-bold text-white mb-2">{t?.expertise3Title}</h4>
                   <p className="text-sm text-gray-400 leading-relaxed">
                     {t?.expertise3Desc}
                   </p>
                 </div>

                 {/* KART 4 */}
                 <div className="glass-panel p-6 rounded-2xl hover:-translate-y-2 transition-transform duration-300 border-t border-t-purple-500/30">
                   <Box className="w-8 h-8 text-purple-500 mb-4" />
                   <h4 className="text-lg font-bold text-white mb-2">{t?.expertise4Title}</h4>
                   <p className="text-sm text-gray-400 leading-relaxed">
                     {t?.expertise4Desc}
                   </p>
                 </div>
               </div>
            </motion.div>

            <motion.div custom={3} initial="hidden" animate="visible" variants={textVariants} className="mb-20">
               <p className="text-lg text-gray-300 italic p-6 border-l-4 border-electronic-blue bg-electronic-blue/5 rounded-r-xl">
                 {t?.quote} <br/><br/>
                 {t?.contactInfo}
               </p>

               <div className="flex flex-wrap items-center gap-6 mt-8">
                 <a href="mailto:omerrilhan34@gmail.com" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group">
                    <div className="p-3 rounded-full bg-white/5 group-hover:bg-red-500/20 group-hover:text-red-400 transition-colors">
                      <Mail className="w-5 h-5" />
                    </div>
                    <span>omerrilhan34@gmail.com</span>
                 </a>
                 <a href="https://www.linkedin.com/in/ömer-faruk-ilhan-a7864495" target="_blank" rel="noreferrer" className="flex items-center gap-3 text-gray-300 hover:text-white transition-colors group">
                    <div className="p-3 rounded-full bg-white/5 group-hover:bg-blue-500/20 group-hover:text-blue-400 transition-colors">
                      <Linkedin className="w-5 h-5" />
                    </div>
                    <span>{t?.linkedin}</span>
                 </a>
               </div>
            </motion.div>

            {/* DEVAM BUTONU */}
            <motion.div custom={4} initial="hidden" animate="visible" variants={textVariants}>
              <button 
                onClick={onEnter}
                className="group w-full md:w-auto flex items-center justify-center gap-4 bg-gradient-to-r from-electronic-blue to-neon-green text-dark-bg px-10 py-5 rounded-2xl font-bold text-xl hover:shadow-[0_0_40px_rgba(57,255,20,0.4)] transition-all hover:-translate-y-1"
              >
                {t?.enterBtn}
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}
