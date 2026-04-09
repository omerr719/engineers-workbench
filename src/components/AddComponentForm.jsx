import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Save, AlertCircle, Loader2, FileText, Image as ImageIcon } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import TechBackground from './TechBackground';
import AssistantBot from './AssistantBot';

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
  const [focusedField, setFocusedField] = useState(null);
  const [status, setStatus] = useState('idle');

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

    const finalizeSuccess = (data) => {
      setStatus('success');
      setTimeout(() => {
        if (initialData && onUpdated && data) {
           onUpdated(data);
        } else if (!initialData && onAdded && data) {
           onAdded(data);
        }
        onClose();
        setStatus('idle');
      }, 1500); // Show happy robot for 1.5s
    };

    if (isSupabaseConfigured) {
      try {
        let sbResponse;
        if (initialData && initialData.id) {
          sbResponse = await supabase.from('components').update(newComponent).eq('id', initialData.id).select();
        } else {
          sbResponse = await supabase.from('components').insert([newComponent]).select();
        }
        
        if (sbResponse.error) throw sbResponse.error;
        finalizeSuccess(sbResponse.data[0]);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    } else {
      setLoading(false);
      if (initialData && onUpdated) {
        finalizeSuccess({ ...newComponent, id: initialData.id });
      } else if (onAdded) {
        const fakeId = "COMP-" + Math.random().toString(36).substr(2, 9);
        finalizeSuccess({ ...newComponent, id: fakeId });
      }
    }
  };

  const formContent = (
    <div className={`relative w-full max-w-2xl ${status === 'success' ? 'opacity-80 pointer-events-none' : ''} ${!embedded ? 'glass-panel bg-dark-panel/90 backdrop-blur-xl rounded-2xl p-8 max-h-[90vh] overflow-y-auto border border-gray-800 shadow-2xl' : ''}`}>
      {!embedded && (
        <>
          <button 
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors z-50"
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
                onFocus={() => setFocusedField('name')}
                onBlur={() => setFocusedField(null)}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electronic-blue focus:ring-1 focus:ring-electronic-blue transition-colors"
                placeholder="Örn: LM358"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Tipi *</label>
              <input 
                required
                type="text" 
                value={formData.type}
                onFocus={() => setFocusedField('type')}
                onBlur={() => setFocusedField(null)}
                onChange={e => setFormData({...formData, type: e.target.value})}
                className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electronic-blue focus:ring-1 focus:ring-electronic-blue transition-colors"
                placeholder="Örn: Op-Amp"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm mb-1">Marka/Üretici</label>
              <input 
                type="text" 
                value={formData.brand}
                onFocus={() => setFocusedField('brand')}
                onBlur={() => setFocusedField(null)}
                onChange={e => setFormData({...formData, brand: e.target.value})}
                className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electronic-blue focus:ring-1 focus:ring-electronic-blue transition-colors"
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
              onFocus={() => setFocusedField('description')}
              onBlur={() => setFocusedField(null)}
              onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electronic-blue focus:ring-1 focus:ring-electronic-blue transition-colors resize-none"
              placeholder="Bileşenin kısa açıklaması..."
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Etiketler (Virgülle ayırın)</label>
            <input 
              type="text" 
              value={formData.tags}
              onFocus={() => setFocusedField('tags')}
              onBlur={() => setFocusedField(null)}
              onChange={e => setFormData({...formData, tags: e.target.value})}
              className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electronic-blue focus:ring-1 focus:ring-electronic-blue transition-colors"
              placeholder="Örn: Analog, Yükselteç, TI"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-1">Görsel URL (İsteğe bağlı)</label>
            <input 
              type="url" 
              value={formData.image}
              onFocus={() => setFocusedField('image')}
              onBlur={() => setFocusedField(null)}
              onChange={e => setFormData({...formData, image: e.target.value})}
              className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electronic-blue focus:ring-1 focus:ring-electronic-blue transition-colors"
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
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-700">
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
                onFocus={() => setFocusedField('datasheet')}
                onBlur={() => setFocusedField(null)}
                onChange={e => setFormData({...formData, datasheet: e.target.value})}
                className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electronic-blue focus:ring-1 focus:ring-electronic-blue transition-colors"
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
                onFocus={() => setFocusedField('buyLink')}
                onBlur={() => setFocusedField(null)}
                onChange={e => setFormData({...formData, buyLink: e.target.value})}
                className="w-full bg-dark-bg border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-electronic-blue focus:ring-1 focus:ring-electronic-blue transition-colors"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-4 relative">
             {status === 'success' && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="absolute right-36 top-1/2 -translate-y-1/2 text-neon-green font-mono font-bold"
                >
                  Sistem Kaydedildi!
                </motion.div>
             )}
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
            >
              İptal
            </button>
            <button 
              type="submit"
              disabled={loading || status === 'success'}
              className="flex items-center justify-center gap-2 bg-neon-green text-dark-bg px-8 py-3 rounded-lg font-bold hover:bg-[#2ce210] shadow-[0_0_15px_rgba(57,255,20,0.4)] hover:shadow-[0_0_25px_rgba(57,255,20,0.6)] transition-all disabled:opacity-50 min-w-[140px]"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : status === 'success' ? (
                "Başarılı!"
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
      {/* Interactive Network Background instead of plain black */}
      <TechBackground />
      
      {/* Click outside closer overlay */}
      <div className="absolute inset-0 z-10" onClick={onClose}></div>
      
      <div className="relative z-20 w-full max-w-2xl flex justify-center mb-20 pointer-events-none">
        {/* Assistant Bot anchored left of the modal */}
        <AssistantBot focusedField={focusedField} status={status} />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="w-full relative z-30 pointer-events-auto"
        >
          {formContent}
        </motion.div>
      </div>
    </div>
  );
}
