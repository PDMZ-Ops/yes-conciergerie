
import React, { useState, useMemo, useEffect } from 'react';
import { 
  LayoutDashboard, 
  FolderPlus, 
  Search, 
  ChevronRight, 
  Files, 
  Info, 
  Plus, 
  Sparkles,
  ArrowLeft,
  Key,
  Send,
  Library
} from 'lucide-react';
import { Project, ViewState, ProjectInfo } from './types';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import CreateProjectModal from './components/CreateProjectModal';
import WebhookModal from './components/WebhookModal';
import ResourcesModal from './components/ResourcesModal';

const LOGO_URL = 'https://i.postimg.cc/hPC0kRrK/logo-Yes.png';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('yes_projects');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('yes_projects', JSON.stringify(projects));
  }, [projects]);

  // --- API BRIDGE IMPLEMENTATION ---
  useEffect(() => {
    (window as any).yesApi = {
      createProject: (data: Partial<Project> & { info?: Partial<ProjectInfo> }) => {
        if (!data.firstName || !data.lastName || !data.location) {
          console.error("Erreur API Yes: firstName, lastName et location sont obligatoires.");
          return { success: false, error: "Missing required fields" };
        }

        const newProject: Project = {
          id: crypto.randomUUID(),
          firstName: data.firstName,
          lastName: data.lastName,
          location: data.location,
          createdAt: new Date().toISOString(),
          documents: [],
          info: {
            email: data.info?.email || '',
            phone: data.info?.phone || '',
            profession: data.info?.profession || '',
            conciergeCommission: data.info?.conciergeCommission || '',
            exchangeDate: data.info?.exchangeDate || new Date().toISOString().split('T')[0],
            strengths: data.info?.strengths || '',
            biography: data.info?.biography || '',
            goals: data.info?.goals || '',
            targetRevenueY1: data.info?.targetRevenueY1 || '',
            targetRevenueY2: data.info?.targetRevenueY2 || '',
            targetRevenueY3: data.info?.targetRevenueY3 || '',
            targetGrossMargin: data.info?.targetGrossMargin || '',
            callTranscript: data.info?.callTranscript || '',
            description: '',
            budget: '',
            deadline: '',
            notes: ''
          }
        };

        setProjects(prev => [newProject, ...prev]);
        console.log(`✅ Dossier créé avec succès via API: ${newProject.firstName} ${newProject.lastName}`);
        return { success: true, project: newProject };
      },
      listProjects: () => projects,
      getProject: (id: string) => projects.find(p => p.id === id)
    };
  }, [projects]);
  // ---------------------------------

  const filteredProjects = useMemo(() => {
    return projects.filter(p => 
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const selectedProject = useMemo(() => 
    projects.find(p => p.id === selectedProjectId),
  [projects, selectedProjectId]);

  const handleCreateProject = (firstName: string, lastName: string, location: string) => {
    const emptyInfo: ProjectInfo = {
      email: '', 
      phone: '', 
      profession: '',
      conciergeCommission: '',
      exchangeDate: new Date().toISOString().split('T')[0],
      strengths: '', 
      biography: '', 
      goals: '',
      targetRevenueY1: '', 
      targetRevenueY2: '', 
      targetRevenueY3: '',
      targetGrossMargin: '', 
      callTranscript: '',
      description: '', 
      budget: '', 
      deadline: '', 
      notes: ''
    };

    const newProject: Project = {
      id: crypto.randomUUID(),
      firstName, lastName, location,
      createdAt: new Date().toISOString(),
      documents: [],
      info: emptyInfo
    };
    setProjects(prev => [newProject, ...prev]);
    setIsCreateModalOpen(false);
  };

  const handleUpdateProject = (updatedProject: Project) => {
    setProjects(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
  };

  const openProject = (id: string) => {
    setSelectedProjectId(id);
    setView('project-detail');
  };

  return (
    <div className="flex h-screen bg-app-light overflow-hidden font-sans">
      {/* Sidebar - Modern White Style */}
      <aside className="w-72 bg-white flex flex-col hidden md:flex border-r border-slate-100 shadow-sm z-20">
        <div className="p-8">
          <div className="flex flex-col items-center gap-1">
             <div className="w-full flex justify-start mb-2">
                <img src={LOGO_URL} alt="Yes Conciergerie Logo" className="h-16 object-contain" />
             </div>
             <p className="w-full text-[9px] uppercase tracking-[0.4em] text-slate-400 font-bold pl-1">Espace Partenaire</p>
          </div>
        </div>
        
        <nav className="flex-1 px-6 space-y-1.5 mt-4">
          <button 
            onClick={() => setView('dashboard')}
            className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-yes ${view === 'dashboard' ? 'bg-orange-50 text-yes-orange font-bold' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
          >
            <LayoutDashboard className="w-5 h-5" />
            <span className="text-sm">Tableau de Bord</span>
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-yes"
          >
            <FolderPlus className="w-5 h-5" />
            <span className="text-sm font-medium">Nouveau Dossier</span>
          </button>
          <button 
            onClick={() => setIsWebhookModalOpen(true)}
            className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-yes"
          >
            <Send className="w-5 h-5" />
            <span className="text-sm font-medium">Flux n8n</span>
          </button>
        </nav>

        <div className="p-8 mt-auto border-t border-slate-50">
          <div className="text-[10px] uppercase tracking-widest text-slate-300 font-bold text-center">
            Yes Conciergerie v1.0
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-10 shrink-0">
          <div className="flex items-center gap-6">
            {view === 'project-detail' && (
              <button 
                onClick={() => setView('dashboard')}
                className="p-2 text-slate-300 hover:text-yes-orange transition-yes"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div className="text-[10px] uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2 font-bold">
              <span className="cursor-pointer hover:text-yes-orange transition-yes" onClick={() => setView('dashboard')}>Dossiers</span>
              {view === 'project-detail' && selectedProject && (
                <>
                  <ChevronRight className="w-3 h-3 text-slate-200" />
                  <span className="font-bold text-slate-800 normal-case tracking-normal text-sm">{selectedProject.firstName} {selectedProject.lastName}</span>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="text" 
                placeholder="Rechercher un client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-yes-orange focus:ring-4 focus:ring-orange-50 rounded-2xl text-sm transition-yes w-80 outline-none"
              />
            </div>
            
            <button 
              onClick={() => setIsResourcesModalOpen(true)}
              className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-100 text-slate-600 rounded-2xl text-xs font-bold transition-yes hover:bg-slate-50 hover:text-yes-orange hover:border-yes-orange/30 shadow-sm"
            >
              <Library className="w-4 h-4" />
              <span className="hidden lg:inline">Ressources</span>
            </button>

            <button className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-yes-orange transition-yes">
              <Info className="w-5 h-5" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-10">
          {view === 'dashboard' ? (
            <ProjectList 
              projects={filteredProjects} 
              onOpenProject={openProject} 
              onCreateClick={() => setIsCreateModalOpen(true)}
              onWebhookClick={() => setIsWebhookModalOpen(true)}
            />
          ) : (
            selectedProject && (
              <ProjectDetail 
                project={selectedProject} 
                onUpdateProject={handleUpdateProject} 
              />
            )
          )}
        </div>
      </main>

      {isCreateModalOpen && (
        <CreateProjectModal 
          onClose={() => setIsCreateModalOpen(false)}
          onConfirm={handleCreateProject}
        />
      )}

      {isWebhookModalOpen && (
        <WebhookModal 
          onClose={() => setIsWebhookModalOpen(false)}
        />
      )}

      {isResourcesModalOpen && (
        <ResourcesModal 
          onClose={() => setIsResourcesModalOpen(false)}
        />
      )}
    </div>
  );
};

export default App;
