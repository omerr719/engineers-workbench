import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Save, AlertCircle, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function AddComponentForm({ onClose, onAdded, onUpdated, initialData = null, embedded = false }) {
  const [formData, setFormData] = useState(initialData ? {
    name: initialData.name || '',
    type: initialData.type || '',
    brand: initialData.brand || '',
    description: initialData.description || '',
    tags: Array.isArray(initialData.tags) ? initialData.tags.join(', ') : '',
    image: initialData.image || '',
    datasheet: initialData.datasheet || '',
    buyLink: initialData.buyLink || ''
  } : {
    name: '',
    type: '',
    brand: '',
    description: '',
    tags: '',
    image: '',
    datasheet: '',
    buyLink: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const newComponent = {
      name: formData.name,
      type: formData.type,
      brand: formData.brand,
      description: formData.description,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      image: formData.image || 'https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
      datasheet: formData.datasheet,
      buyLink: formData.buyLink
    };

    if (isSupabaseConfigured) {
      try {
        let sbResponse;
        if (initialData && initialData.id) {
          // UPDATE
          sbResponse = await supabase
            .from('components')
            .update(newComponent)
            .eq('id', initialData.id)
            .select();
        } else {
          // INSERT
          sbResponse = await supabase
            .from('components')
            .insert([newComponent])
            .select();
        }
        
        if (sbResponse.error) throw sbResponse.error;
        
        if (initialData && onUpdated && sbResponse.data) {
           onUpdated(sbResponse.data[0]);
        } else if (!initialData && onAdded && sbResponse.data) {
           onAdded(sbResponse.data[0]);
        }
        
        onClose();
      } catch (err) {
        setError(err.message);
      }
    } else {
      // Mock modda calisirken Local olarak ekleyelim
      if (initialData && onUpdated) {
        onUpdated({ ...newComponent, id: initialData.id });
      } else if (onAdded) {
        const fakeId = "COMP-" + Math.random().toString(36).substr(2, 9);
        onAdded({ ...newComponent, id: fakeId });
      }
      onClose();
    }
    setLoading(false);
  };

  const formContent = (
    <div className={`relative w-full max-w-2xl ${!embedded ? 'glass-panel rounded-2xl p-8 max-h-[90vh] overflow-y-auto' : ''}`}>
      {!embedded && (
        <>
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>

          <h2 className="text-3xl font-bold mb-6 text-white flex items-center gap-3">
            <Plus className="text-neon-green w-8 h-8" />
            {initialData ? "Bileşeni Düzenle" : "Yenı Bıleşen Ekle"}
          </h2>
        </>
      )}

      {!isSupabaseConfigured && (
          <div className="mb-6 p-4 rounded-lg bg-electronic-blue/20 border border-electronic-blue/50 flex items-start gap-3">
            <AlertCircle className="text-electronic-blue mt-0.5 flex-shrink-0" />
            <p className="text-sm text-blue-200">
              Şu an Mock (Deneme) Modundayız. Supabase kurulumu yapılmadığı için eklediğiniz veriler sadece tarayıcıda geçici olarak görünecektir.
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/50 flex items-start gap-3">
            <AlertCircle className="text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-200">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Bileşen Adı *</label>
              <input 
                required
                type="text" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-colors"
                placeholder="Örn: LM358"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Tipi *</label>
              <input 
                required
                type="text" 
                value={formData.type}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-colors"
                placeholder="Örn: Op-Amp"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Marka/Üretici</label>
              <input 
                type="text" 
                value={formData.brand}
                onChange={e => setFormData({...formData, brand: e.target.value})}
                className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-colors"
                placeholder="Örn: Texas Instruments"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Açıklama *</label>
            <textarea 
              required
              rows={3}
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-colors resize-none"
              placeholder="Bileşenin kısa açıklaması..."
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Etiketler (Virgülle ayırın)</label>
            <input 
              type="text" 
              value={formData.tags}
              onChange={e => setFormData({...formData, tags: e.target.value})}
              className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-colors"
              placeholder="Örn: Analog, Yükselteç, TI"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Görsel URL (İsteğe bağlı)</label>
            <input 
              type="url" 
              value={formData.image}
              onChange={e => setFormData({...formData, image: e.target.value})}
              className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-colors"
              placeholder="https://..."
            />
            {/* Auto Image Preview */}
            <AnimatePresence>
              {formData.image && formData.image.startsWith('http') && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }} 
                  animate={{ opacity: 1, height: 'auto' }} 
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-3 flex items-center gap-3 bg-dark-bg/50 border border-gray-800 p-2 rounded-xl w-max"
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-glass-border">
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover bg-black/50" onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1518770660439-4636190af475?ixlib=rb-4.0.3&w=100&q=80"; e.target.className += " grayscale"; }} />
                  </div>
                  <div className="pr-4">
                     <span className="text-xs text-gray-400 flex items-center gap-1"><ImageIcon className="w-3 h-3"/> Görsel Teyit Edildi</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-gray-400 text-sm mb-1">Datasheet PDF URL</label>
              <input 
                type="url" 
                value={formData.datasheet}
                onChange={e => setFormData({...formData, datasheet: e.target.value})}
                className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-colors"
                placeholder="https://..."
              />
              {/* Auto PDF Preview */}
              <AnimatePresence>
                {formData.datasheet && formData.datasheet.startsWith('http') && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }} 
                    animate={{ opacity: 1, y: 0 }} 
                    exit={{ opacity: 0, y: -10 }}
                    className="mt-3 flex items-center gap-2 text-sm text-neon-green bg-neon-green/10 px-3 py-2 rounded-lg border border-neon-green/20 w-max shadow-[0_0_10px_rgba(57,255,20,0.1)]"
                  >
                    <FileText className="w-4 h-4" /> PDF Linki Bağlandı
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Satın Alma Linki</label>
              <input 
                type="url" 
                value={formData.buyLink}
                onChange={e => setFormData({...formData, buyLink: e.target.value})}
                className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-neon-green transition-colors"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              İptal
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-neon-green text-dark-bg px-8 py-3 rounded-lg font-bold hover:bg-[#2ce210] shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:shadow-[0_0_25px_rgba(57,255,20,0.6)] transition-all disabled:opacity-50 min-w-[140px]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Kaydet
                </>
              )}
            </button>
          </div>
        </form>
    </div>
  );

  if (embedded) {
    return formContent;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start pt-20 justify-center p-4 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        className="w-full max-w-2xl relative z-10 mb-20"
      >
        {formContent}
      </motion.div>
    </div>
  );
}
