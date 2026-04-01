import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Save, AlertCircle, FolderGit2, Cpu, Search, Minus, Trash2, Loader2 } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import AddComponentForm from './AddComponentForm';
// Admin panel will receive components list to allow adding them to a project
export default function AdminPanel({ onClose, onComponentAdded, onProjectAdded, components, mode, onDeleteComponent }) {
  // mode: 'project' | 'component'

  
  // Project Form State
  const [projectData, setProjectData] = useState({
    name: '',
    description: '',
    cover_image: '',
    schematic_pdf: ''
  });
  
  // BOM (Cart) State
  const [bomSearch, setBomSearch] = useState('');
  const [cart, setCart] = useState([]); // { component, quantity }
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // BOM Actions
  const addToCart = (comp) => {
    setCart(prev => {
      const existing = prev.find(item => item.component.id === comp.id);
      if (existing) {
        return prev.map(item => item.component.id === comp.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { component: comp, quantity: 1 }];
    });
  };

  const removeFromCart = (compId) => {
    setCart(prev => {
      const existing = prev.find(item => item.component.id === compId);
      if (existing.quantity > 1) {
         return prev.map(item => item.component.id === compId ? { ...item, quantity: item.quantity - 1 } : item);
      }
      return prev.filter(item => item.component.id !== compId);
    });
  };

  const filteredBOMComponents = components ? components.filter(c => 
    c.name?.toLowerCase().includes(bomSearch.toLowerCase()) || 
    c.type?.toLowerCase().includes(bomSearch.toLowerCase())
  ) : [];

  const handleProjectSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const newProject = {
      name: projectData.name,
      description: projectData.description,
      cover_image: projectData.cover_image || 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
      schematic_pdf: projectData.schematic_pdf
    };

    if (isSupabaseConfigured) {
      try {
        // 1. Insert Project
        const { data: projData, error: projError } = await supabase
          .from('projects')
          .insert([newProject])
          .select();
        
        if (projError) throw projError;
        
        const createdProject = projData[0];

        // 2. Insert BOM links
        if (cart.length > 0) {
          const bomInserts = cart.map(item => ({
            project_id: createdProject.id,
            component_id: item.component.id,
            quantity: item.quantity
          }));
          
          const { error: bomError } = await supabase
            .from('project_components')
            .insert(bomInserts);
            
          if (bomError) throw bomError;
        }

        if (onProjectAdded) onProjectAdded(createdProject, cart);
        onClose();
      } catch (err) {
        setError(err.message);
      }
    } else {
      // Mock Mod
      const fakeId = "PROJ-" + Math.random().toString(36).substr(2, 9);
      if (onProjectAdded) onProjectAdded({ ...newProject, id: fakeId }, cart);
      onClose();
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose}></div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`relative w-full ${mode === 'project' ? 'max-w-6xl' : 'max-w-2xl'} glass-panel rounded-2xl max-h-[95vh] flex flex-col overflow-hidden transition-all duration-500`}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-[70]"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8 pb-4">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            {mode === 'project' ? (
               <><FolderGit2 className="text-neon-green w-8 h-8" /> Proje İnşa Atölyesi</>
            ) : (
               <><Cpu className="text-electronic-blue w-8 h-8" /> Veritabanına Komponent Kaydet</>
            )}
          </h2>
        </div>

        <div className="p-8 pt-0 overflow-y-auto flex-1 custom-scrollbar">
          {mode === 'component' ? (
             <div className="relative">
                <AddComponentForm embedded={true} onClose={onClose} onAdded={onComponentAdded} />
             </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="h-full flex flex-col"
            >
              {!isSupabaseConfigured && (
                <div className="mb-6 p-4 rounded-lg bg-electronic-blue/20 border border-electronic-blue/50 flex items-start gap-3">
                  <AlertCircle className="text-electronic-blue mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-200">Mock (Deneme) Modundasınız. Eklenen projeler ve BOM verileri sadece geçici olarak görünecektir.</p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 flex items-start gap-3">
                  <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-red-200">{error}</p>
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-8 h-full">
                {/* SOL KOLON: PROJE BİLGİLERİ VE SEPET */}
                <div className="w-full lg:w-1/2 flex flex-col gap-6">
                  <form id="project-form" onSubmit={handleProjectSubmit} className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Proje Adı *</label>
                      <input 
                        required type="text" value={projectData.name} onChange={e => setProjectData({...projectData, name: e.target.value})}
                        className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-green transition-colors" placeholder="Örn: Pozisyoner Kartı"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Açıklama *</label>
                      <textarea 
                        required rows={3} value={projectData.description} onChange={e => setProjectData({...projectData, description: e.target.value})}
                        className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-green transition-colors resize-none" placeholder="Proje detayı..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Kapak Görseli URL</label>
                        <input 
                          type="url" value={projectData.cover_image} onChange={e => setProjectData({...projectData, cover_image: e.target.value})}
                          className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-green transition-colors text-sm" placeholder="https://..."
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm mb-1">Şematik (PDF) URL</label>
                        <input 
                          type="url" value={projectData.schematic_pdf} onChange={e => setProjectData({...projectData, schematic_pdf: e.target.value})}
                          className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-neon-green transition-colors text-sm" placeholder="https://..."
                        />
                      </div>
                    </div>
                  </form>

                  {/* EKLENEN MALZEMELER SEPETI */}
                  <div className="flex-1 bg-dark-bg/60 rounded-xl border border-gray-800 p-5 flex flex-col shadow-inner">
                    <h3 className="text-xl font-bold mb-4 text-neon-green flex items-center gap-2">
                       <Cpu className="w-5 h-5"/>
                       Seçilen Malzemeler (BOM)
                    </h3>
                    
                    <div className="flex-1 overflow-y-auto space-y-3 custom-scrollbar pr-2 min-h-[150px]">
                      {cart.length === 0 ? (
                        <p className="text-gray-500 text-center mt-10 text-sm italic">
                          Sağdaki listeden bu projeye eklenecek<br/>komponentleri arayıp seçin.
                        </p>
                      ) : (
                        cart.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between glass-panel p-3 rounded-lg border-l-2 border-l-electronic-blue">
                             <div className="flex items-center gap-3">
                                <img src={item.component.image} className="w-10 h-10 rounded-md object-cover bg-black" alt="" />
                                <div>
                                   <p className="text-white font-bold text-sm leading-tight">{item.component.name}</p>
                                   <p className="text-gray-400 text-xs">{item.component.type}</p>
                                </div>
                             </div>
                             
                             <div className="flex items-center gap-3 bg-dark-bg rounded-full border border-gray-700 px-2 py-1">
                               <button type="button" onClick={() => removeFromCart(item.component.id)} className="text-red-400 hover:text-red-300 p-1">
                                  <Minus className="w-4 h-4"/>
                               </button>
                               <span className="font-mono text-white text-sm w-4 text-center">{item.quantity}</span>
                               <button type="button" onClick={() => addToCart(item.component)} className="text-neon-green hover:text-green-300 p-1">
                                  <Plus className="w-4 h-4"/>
                               </button>
                             </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* SAĞ KOLON: KÜTÜPHANEDE ARA VE EKLE */}
                <div className="w-full lg:w-1/2 flex flex-col bg-dark-panel rounded-xl border border-glass-border p-5">
                   <h3 className="text-xl font-bold mb-4 text-electronic-blue">Kütüphaneden Ara</h3>
                   
                   <div className="relative mb-4">
                     <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                     <input 
                        type="text"
                        value={bomSearch}
                        onChange={(e) => setBomSearch(e.target.value)}
                        placeholder="MCU, Buck, LM358..."
                        className="w-full bg-dark-bg border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:border-electronic-blue transition-colors"
                     />
                   </div>

                   <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar pr-2 min-h-[300px] pb-4">
                      {filteredBOMComponents.length === 0 ? (
                        <p className="text-gray-500 text-center py-4">Sonuç bulunamadı.</p>
                      ) : (
                        filteredBOMComponents.map(comp => (
                          <div 
                            key={comp.id} 
                            onClick={() => addToCart(comp)}
                            className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-gray-700 group"
                          >
                             <img src={comp.image} className="w-12 h-12 rounded-md object-cover bg-black" alt="" />
                             <div className="flex-1">
                                <p className="text-white font-semibold text-sm group-hover:text-electronic-blue transition-colors">{comp.name}</p>
                                <p className="text-gray-400 text-xs">{comp.brand}</p>
                             </div>
                             
                             <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                               <button 
                                 onClick={(e) => { e.stopPropagation(); addToCart(comp); }} 
                                 className="text-gray-500 hover:text-neon-green p-2 transition-colors"
                               >
                                 <Plus className="w-5 h-5" />
                               </button>
                             </div>
                          </div>
                        ))
                      )}
                   </div>
                   
                   {/* Kaydet Butonu sağ alt kosede formun dısında, ama form=project-form yaparsak tetikleriz */}
                   <div className="pt-4 mt-auto border-t border-gray-800 flex justify-end gap-3">
                      <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-lg font-medium text-gray-400 hover:text-white hover:bg-white/10 transition-colors">İptal</button>
                      <button 
                        type="submit" 
                        form="project-form"
                        disabled={loading || !projectData.name} 
                        className="flex items-center justify-center gap-2 bg-gradient-to-r from-electronic-blue to-teal-500 text-white px-8 py-2.5 rounded-lg font-bold hover:shadow-[0_0_20px_rgba(10,132,255,0.5)] transition-all disabled:opacity-50 min-w-[200px]"
                      >
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Save className="w-5 h-5" />
                            Projeyi Canlıya Al
                          </>
                        )}
                      </button>
                   </div>
                </div>
              </div>

            </motion.div>
          )}
        </div>
      </motion.div>
      
      {/* Scrollbar stili icin minik ozel CSS (App.css'e gidebilirdi ama buraya scoped inline veya global koyabiliriz) */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}} />
    </div>
  );
}
