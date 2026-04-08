import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Cpu, FolderGit2, User } from 'lucide-react';
import IntroAnimation from './components/IntroAnimation';
import SearchBar from './components/SearchBar';
import ComponentList from './components/ComponentList';
import ComponentDetail from './components/ComponentDetail';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import AdminPanel from './components/AdminPanel';
import AddComponentForm from './components/AddComponentForm';
import MouseTrail from './components/MouseTrail';
import ConfirmModal from './components/ConfirmModal';
import LandingPage from './components/LandingPage';
import { componentsData as mockComponents, projectsData as mockProjects, projectComponentsData as mockPC } from './data/mockData';
import { supabase, isSupabaseConfigured } from './lib/supabase';

function App({ isAdmin = false }) {
  const [hasEnteredSite, setHasEnteredSite] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('projects'); // 'projects' | 'components'
  
  // Selection States
  const [selectedComponent, setSelectedComponent] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [adminMode, setAdminMode] = useState(null); // null | 'project' | 'component'
  const [editingComponent, setEditingComponent] = useState(null); // component to edit
  const [confirmDialog, setConfirmDialog] = useState(null); // { message, onConfirm }
  
  // Data States
  const [components, setComponents] = useState([]);
  const [projects, setProjects] = useState([]);
  const [projectComponents, setProjectComponents] = useState([]);
  const [loading, setLoading] = useState(true);

  // System Log State
  const addLog = (msg) => {
    // System Terminal kaldirildi, loglari sadece gelistirici konsoluna basalim
    console.log("[System Log]:", msg);
  };

  useEffect(() => {
    async function fetchData() {
      if (isSupabaseConfigured) {
        try {
          // Promise.all ile paralel veri cekme
          const [compRes, projRes, pcRes] = await Promise.all([
            supabase.from('components').select('*'),
            supabase.from('projects').select('*'),
            supabase.from('project_components').select('*')
          ]);
          
          if (compRes.error) throw compRes.error;
          if (projRes.error) throw projRes.error;

          setComponents(compRes.data || []);
          setProjects(projRes.data || []);
          setProjectComponents(pcRes.data || []);
          addLog("Database fetch complete. Systems nominal.");

        } catch (err) {
          console.error("Supabase veri cekme hatasi:", err);
          setComponents(mockComponents);
          setProjects(mockProjects);
          setProjectComponents(mockPC);
        }
      } else {
        setComponents(mockComponents);
        setProjects(mockProjects);
        setProjectComponents(mockPC);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const handleComponentAdded = (newComp) => {
    setComponents(prev => [newComp, ...prev]);
    addLog(`Component ${newComp.name} added to database.`);
  };

  const handleComponentUpdated = (updatedComp) => {
    setComponents(prev => prev.map(c => c.id === updatedComp.id ? updatedComp : c));
    addLog(`Component ${updatedComp.name} updated in database.`);
    if (selectedComponent && selectedComponent.id === updatedComp.id) {
       setSelectedComponent(updatedComp);
    }
  };
  
  const handleProjectAdded = (newProj, cartData) => {
    setProjects(prev => [newProj, ...prev]);
    addLog(`Project ${newProj.name} successfully initialized.`);
    if (cartData && cartData.length > 0) {
      const newLinks = cartData.map(item => ({
         project_id: newProj.id,
         component_id: item.component.id,
         quantity: item.quantity
      }));
      setProjectComponents(prev => [...newLinks, ...prev]);
      addLog(`Attached ${cartData.length} BOM objects to ${newProj.name}.`);
    }
  };

  const handleDeleteProject = async (projectId) => {
    setConfirmDialog({
      message: "Bu projeyi ve içerdiği tüm bağlantılı BOM listelerini kalıcı olarak silmek istediğinize emin misiniz?",
      onConfirm: async () => {
        if (isSupabaseConfigured) {
          const { error } = await supabase.from('projects').delete().eq('id', projectId);
          if (error) {
            alert("Silme işlemi başarısız: " + error.message);
            setConfirmDialog(null);
            return;
          }
        }
        setProjects(prev => prev.filter(p => p.id !== projectId));
        setProjectComponents(prev => prev.filter(pc => pc.project_id !== projectId));
        setSelectedProject(null);
        setConfirmDialog(null);
        addLog(`Project PURGED from database.`);
      }
    });
  };

  const handleDeleteComponent = async (compId) => {
    setConfirmDialog({
      message: "Bu komponenti veritabanından kalıcı olarak silmek istediğinize emin misiniz? (Bağlı olduğu projelerden de silinecektir)",
      onConfirm: async () => {
        if (isSupabaseConfigured) {
          const { error } = await supabase.from('components').delete().eq('id', compId);
          if (error) {
            alert("Silme işlemi başarısız: " + error.message);
            setConfirmDialog(null);
            return;
          }
        }
        setComponents(prev => prev.filter(c => c.id !== compId));
        setProjectComponents(prev => prev.filter(pc => pc.component_id !== compId));
        setSelectedComponent(null);
        setConfirmDialog(null);
        addLog(`Component PURGED from library.`);
      }
    });
  };

  const handleUpdateBOMQuantity = async (projectId, componentId, delta) => {
    const existingLink = projectComponents.find(pc => pc.project_id === projectId && pc.component_id === componentId);
    if (!existingLink) return;
    
    const newQuantity = existingLink.quantity + delta;

    if (newQuantity <= 0) {
      if (isSupabaseConfigured) {
        await supabase.from('project_components').delete().match({ project_id: projectId, component_id: componentId });
      }
      setProjectComponents(prev => prev.filter(pc => !(pc.project_id === projectId && pc.component_id === componentId)));
    } else {
      if (isSupabaseConfigured) {
        await supabase.from('project_components').update({ quantity: newQuantity }).match({ project_id: projectId, component_id: componentId });
      }
      setProjectComponents(prev => prev.map(pc => {
         if (pc.project_id === projectId && pc.component_id === componentId) {
            return { ...pc, quantity: newQuantity };
         }
         return pc;
      }));
    }
  };

  // Unified Search Logic
  const filteredComponents = components.filter(comp => {
    const term = searchQuery.toLowerCase();
    const validTags = Array.isArray(comp.tags) ? comp.tags : [];
    return (
      comp.name?.toLowerCase().includes(term) ||
      comp.type?.toLowerCase().includes(term) ||
      comp.brand?.toLowerCase().includes(term) ||
      validTags.some(tag => tag?.toLowerCase().includes(term))
    );
  });

  const filteredProjects = projects.filter(proj => {
    const term = searchQuery.toLowerCase();
    
    // Projenin isminde/aciklamasinda var mi?
    if (proj.name?.toLowerCase().includes(term) || proj.description?.toLowerCase().includes(term)) return true;

    // Ya da projenin ICINDEKI komponentlerden biri bu aramaya uyuyor mu? (Akilli BOM Filtresi)
    const projCompLinks = projectComponents.filter(pc => pc.project_id === proj.id);
    const hasMatchingComponent = projCompLinks.some(link => {
       const matchedComp = components.find(c => c.id === link.component_id);
       if (!matchedComp) return false;
       return (
          matchedComp.name?.toLowerCase().includes(term) ||
          matchedComp.type?.toLowerCase().includes(term)
       );
    });
    
    return hasMatchingComponent;
  });

  // Get hydrated BOM list for selected project
  const getBOMForProject = (projId) => {
    const links = projectComponents.filter(pc => pc.project_id === projId);
    return links.map(link => {
      const comp = components.find(c => c.id === link.component_id);
      return {
        component: comp || { id: link.component_id, name: 'Bilinmeyen Komponent', type: '???', image: '' },
        quantity: link.quantity
      };
    });
  };

  return (
    <>
    <AnimatePresence mode="wait">
      {!hasEnteredSite ? (
        <motion.div
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(10px)', scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          <LandingPage onEnter={() => setHasEnteredSite(true)} />
        </motion.div>
      ) : (
        <motion.div
          key="workbench"
          initial={{ opacity: 0, filter: 'blur(10px)', scale: 1.05 }}
          animate={{ opacity: 1, filter: 'blur(0px)', scale: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut", delay: 0.2 }}
          className="min-h-screen relative overflow-hidden font-sans bg-dark-bg text-white"
        >
          {/* Eğer kullanıcı landing'den geldiğinde animasyon gereksiz gelirse, isterseniz introFinished=true başlatabilirsiniz. Ama mevcut intro süper. */}
          {!introFinished && <IntroAnimation onComplete={() => setIntroFinished(true)} />}

          <div className={`transition-opacity duration-1000 ${introFinished ? 'opacity-100' : 'opacity-0'} relative z-10`}>
            
            {/* Background Effect & Interactive Mouse Trail */}
            <div className="fixed inset-0 pointer-events-none z-0 opacity-10" style={{
              backgroundImage: 'radial-gradient(circle at 50% 50%, var(--color-electronic-blue) 0%, transparent 50%)',
              backgroundSize: '150% 150%',
            }}></div>
            <MouseTrail />

            <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen w-full">
              
              {/* TOP LEFT ALIGNED BACK BUTTON */}
              <div className="absolute top-6 left-6 md:top-8 md:left-8 z-50 flex gap-3">
                <button 
                  onClick={() => setHasEnteredSite(false)}
                  className="flex items-center gap-2 bg-dark-panel/80 hover:bg-white/10 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white px-5 py-2.5 rounded-full font-medium transition-all group backdrop-blur-md shadow-lg"
                  title="Hakkımda'ya Dön"
                >
                  <User className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                  <span className="hidden md:inline font-sans">Hakkımda</span>
                </button>

                {isAdmin && (
                  <button 
                    onClick={async () => {
                      await supabase.auth.signOut();
                      window.location.href = '/';
                    }}
                    className="flex items-center gap-2 bg-red-900/40 hover:bg-red-500/80 border border-red-500/50 text-red-100 hover:text-white px-5 py-2.5 rounded-full font-medium transition-all group backdrop-blur-md shadow-lg"
                    title="Sistemden Çıkış Yap"
                  >
                    <span className="font-sans">Çıkış Yap</span>
                  </button>
                )}
              </div>

              {/* TOP RIGHT ALIGNED ACTION BUTTON */}
              {isAdmin && activeTab === 'components' && (
                <div className="absolute top-6 right-6 md:top-8 md:right-8 z-50">
                  <button 
                    onClick={() => setAdminMode('component')}
                    className="flex items-center gap-2 bg-dark-panel/80 hover:bg-electronic-blue/20 border border-white/10 hover:border-electronic-blue/50 text-white px-5 py-2.5 rounded-full font-medium transition-all group backdrop-blur-md shadow-lg"
                  >
                    <Plus className="w-5 h-5 text-neon-green group-hover:rotate-90 transition-transform duration-300" />
                    <span className="hidden md:inline font-sans">Komponent Ekle</span>
                  </button>
                </div>
              )}

              <header className="mb-12 text-center relative max-w-4xl mx-auto mt-4">
                <motion.h1 
                  initial={{ backgroundPosition: '200% 50%' }}
                  animate={{ backgroundPosition: '-200% 50%' }}
                  transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                  className="text-4xl md:text-5xl font-mono font-bold tracking-tight mb-3 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400"
                  style={{ backgroundSize: '200% auto' }}
                >
                  ENGINEER'S WORKBENCH
                </motion.h1>
                <p className="text-gray-400 font-mono tracking-[0.1em] text-sm md:text-base">
                  Hardware Design • Embedded Systems • Component Inventory
                </p>
              </header>

              <div className="flex flex-col lg:flex-row gap-8 w-full max-w-6xl mx-auto">
                <main className="flex-1 w-full">
                  <div className="mb-6">
                    <SearchBar query={searchQuery} setQuery={setSearchQuery} />
                  </div>

                  {/* TABS */}
                  <div className="flex border-b border-gray-800 mb-8">
                    <button
                      onClick={() => setActiveTab('projects')}
                      className={`flex-1 md:flex-none flex items-center justify-center gap-2 py-4 px-8 font-medium transition-colors text-lg ${activeTab === 'projects' ? 'text-neon-green border-b-2 border-neon-green bg-neon-green/5' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
                    >
                      <FolderGit2 className="w-5 h-5" />
                      Projeler
                    </button>
                    <button
                      onClick={() => setActiveTab('components')}
                      className={`flex-1 md:flex-none flex items-center justify-center gap-2 py-4 px-8 font-medium transition-colors text-lg ${activeTab === 'components' ? 'text-electronic-blue border-b-2 border-electronic-blue bg-electronic-blue/5' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'}`}
                    >
                      <Cpu className="w-5 h-5" />
                      Komponent Kütüphanesi
                    </button>
                  </div>

                  {loading ? (
                    <div className="flex justify-center py-20">
                      <div className="w-8 h-8 rounded-full border-t-2 border-r-2 border-neon-green animate-spin"></div>
                    </div>
                  ) : (
                    <>
                      {activeTab === 'projects' && (
                        <div className="min-h-[300px]">
                          {filteredProjects.length === 0 ? (
                            <div className="text-center py-20 bg-dark-bg/40 border border-gray-800 rounded-2xl glass-panel">
                              <FolderGit2 className="w-16 h-16 text-gray-600 mx-auto mb-4 opacity-50" />
                              <h2 className="text-2xl font-bold text-gray-400 mb-2">Henüz Proje Yok</h2>
                              <p className="text-gray-500 mb-6">Aşağıdaki butona tıklayarak ilk projenizi inşa edin.</p>
                              {isAdmin && (
                                <button 
                                  onClick={() => setAdminMode('project')}
                                  className="bg-electronic-blue/20 hover:bg-electronic-blue/30 text-electronic-blue px-6 py-2 rounded-full border border-electronic-blue/50 transition-colors"
                                >
                                  Proje İnşa Et
                                </button>
                              )}
                            </div>
                          ) : (
                            <ProjectList 
                              projects={filteredProjects} 
                              onSelect={(proj) => setSelectedProject(proj)} 
                            />
                          )}
                        </div>
                      )}
                      {activeTab === 'components' && (
                        <ComponentList 
                          components={filteredComponents} 
                          onSelect={(comp) => {
                            setSelectedComponent(comp);
                            addLog(`Datasheet view requested for ${comp.name}.`);
                          }} 
                        />
                      )}
                    </>
                  )}
                </main>
              </div>
            </div>

          </div>
        </motion.div>
      )}
    </AnimatePresence>

    {/* MODALS - Moved outside to prevent 'transform' from capturing 'fixed' positioning */}
    <div className="font-sans text-white z-50">
      <AnimatePresence>
        {/* Component Detail slide-in */}
        {selectedComponent && (
          <ComponentDetail 
            key="component-detail"
            component={selectedComponent} 
            onClose={() => setSelectedComponent(null)} 
            onDelete={isAdmin ? handleDeleteComponent : null}
            onEdit={isAdmin ? (comp) => {
               setEditingComponent(comp);
               setSelectedComponent(null);
            } : null}
          />
        )}

        {/* Project Detail full-screen modal */}
        {selectedProject && (
          <ProjectDetail 
            key="project-detail"
            project={selectedProject} 
            projectComponents={getBOMForProject(selectedProject.id)}
            onComponentClick={(comp) => setSelectedComponent(comp)} 
            onUpdateQuantity={isAdmin ? handleUpdateBOMQuantity : null}
            onClose={() => setSelectedProject(null)} 
            onDelete={isAdmin ? handleDeleteProject : null}
          />
        )}

        {/* Admin Panel Modal */}
        {adminMode && (
          <AdminPanel 
            key="admin-panel"
            mode={adminMode}
            onClose={() => setAdminMode(null)} 
            onComponentAdded={handleComponentAdded}
            onProjectAdded={handleProjectAdded}
            onDeleteComponent={handleDeleteComponent}
            components={components}
          />
        )}

        {/* Edit Component Modal */}
        {editingComponent && (
          <AddComponentForm
            key="edit-component"
            initialData={editingComponent}
            onClose={() => setEditingComponent(null)}
            onUpdated={handleComponentUpdated}
          />
        )}

        {/* Custom Confirmation Modal */}
        {confirmDialog && (
          <ConfirmModal 
            key="confirm-modal"
            message={confirmDialog.message} 
            onConfirm={confirmDialog.onConfirm} 
            onCancel={() => setConfirmDialog(null)} 
          />
        )}
      </AnimatePresence>
    </div>
    </>
  );
}

export default App;
