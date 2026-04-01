import React from 'react';
import { motion } from 'framer-motion';
import { X, FileText, Cpu, Download, Trash2, Plus, Minus } from 'lucide-react';
import * as XLSX from 'xlsx';

export default function ProjectDetail({ project, projectComponents, onClose, onComponentClick, onDelete, onUpdateQuantity }) {
  const handleExportExcel = () => {
    if (!projectComponents || projectComponents.length === 0) return;

    // Excel verisini 'Array of Arrays' formatinda hazirla (Basliga proje ismini ekliyoruz)
    const wsData = [
      [`${project.name} - BOM (Kullanılan Malzemeler) Listesi`],
      [], // Bos satir
      ['Komponent Adı', 'Miktar', 'Tip/Kategori', 'Marka/Üretici', 'Datasheet Linki', 'Satın Alma Linki'],
      ...projectComponents.map(item => [
        item.component.name,
        item.quantity,
        item.component.type || '-',
        item.component.brand || '-',
        item.component.datasheet || '-',
        item.component.buyLink || '-'
      ])
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(wsData);
    
    // Baslik satirini kalin (bold) yapmak icin ufak bir dokunus (xlsx bazen tam desteklemese de visual excel dosyasi acar)
    // Sütun genisliklerini ayarlayalim
    worksheet['!cols'] = [
      { wch: 25 }, { wch: 10 }, { wch: 20 }, { wch: 20 }, { wch: 40 }, { wch: 40 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "BOM");
    
    // Proje ismine gore dosyayi indir
    XLSX.writeFile(workbook, `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_BOM.xlsx`);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className="fixed inset-0 z-50 flex p-4 md:p-10"
    >
      <div className="absolute inset-0 bg-dark-bg/90 backdrop-blur-md" onClick={onClose}></div>
      
      <div className="relative w-full h-full glass-panel border border-glass-border shadow-2xl rounded-2xl flex flex-col md:flex-row overflow-hidden isolate">
        <div className="absolute top-6 right-6 z-50 flex items-center gap-3">
          {onDelete && (
            <button 
              onClick={() => onDelete(project.id)}
              className="p-2 bg-red-500/20 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-all border border-red-500/30"
              title="Projeyi Sil"
            >
              <Trash2 className="w-6 h-6" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="p-2 bg-dark-bg/50 text-white rounded-full hover:bg-white/10 transition-colors"
            title="Kapat"
          >
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* Sol Bölüm: Kapak ve Açıklama */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto border-b md:border-b-0 md:border-r border-glass-border relative">
          <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden mb-8 relative">
            <img 
              src={project.cover_image} 
              alt={project.name} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-bg to-transparent"></div>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-electronic-blue to-neon-green mb-6">
            {project.name}
          </h2>
          
          <p className="text-gray-300 text-lg leading-relaxed mb-8">
            {project.description}
          </p>

          <a 
            href={project.schematic_pdf}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 py-3 rounded-lg font-medium transition-all"
          >
            <FileText className="w-5 h-5" />
            Şematik (PDF) Göster
          </a>
        </div>

        {/* Sağ Bölüm: BOM (Kullanılan Komponentler) */}
        <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto bg-dark-bg/40">
          <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-3">
            <Cpu className="text-electronic-blue" />
            BOM (Kullanılan Malzemeler)
          </h3>
          
          <div className="flex flex-col gap-4">
            {projectComponents.map((item, idx) => (
              <motion.div 
                key={item.component.id + idx}
                whileHover={{ scale: 1.02, x: 5 }}
                onClick={() => onComponentClick(item.component)}
                className="glass-panel p-4 rounded-xl flex items-center gap-4 cursor-pointer group border-l-4 border-l-transparent hover:border-l-electronic-blue transition-all"
              >
                <img 
                  src={item.component.image} 
                  className="w-16 h-16 rounded-lg object-cover bg-dark-bg" 
                  alt={item.component.name} 
                />
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-white group-hover:text-neon-green transition-colors">{item.component.name}</h4>
                  <p className="text-sm text-gray-400">{item.component.type} • {item.component.brand}</p>
                </div>
                <div 
                  className="flex items-center gap-2 bg-dark-bg rounded-full border border-gray-700 px-2 py-1 ml-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button 
                    onClick={() => onUpdateQuantity && onUpdateQuantity(project.id, item.component.id, -1)} 
                    className="text-red-400 hover:text-red-300 p-1 transition-colors"
                  >
                     <Minus className="w-4 h-4"/>
                  </button>
                  <span className="font-mono text-white text-sm w-4 text-center select-none">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity && onUpdateQuantity(project.id, item.component.id, 1)} 
                    className="text-neon-green hover:text-green-300 p-1 transition-colors"
                  >
                     <Plus className="w-4 h-4"/>
                  </button>
                </div>
              </motion.div>
            ))}
            
            {projectComponents.length === 0 && (
              <p className="text-gray-500">Bu projede kayıtlı komponent bulunamadı.</p>
            )}
          </div>
          
          {projectComponents.length > 0 && (
            <div className="mt-8 pt-6 border-t border-gray-800">
              <button 
                onClick={handleExportExcel}
                className="w-full flex items-center justify-center gap-2 bg-[#107c41]/20 hover:bg-[#107c41]/40 border border-[#107c41]/50 text-white px-6 py-4 rounded-xl font-bold transition-all group"
              >
                <Download className="w-5 h-5 text-[#21a366] group-hover:-translate-y-1 transition-transform" />
                BOM Listesini Excel Olarak İndir
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
