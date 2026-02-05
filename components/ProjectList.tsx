
import React from 'react';
import { Project } from '../types';
import { MapPin, Calendar, Users, ChevronRight, Plus, FileText, Send } from 'lucide-react';

const LOGO_URL = 'https://i.postimg.cc/hPC0kRrK/logo-Yes.png';

interface ProjectListProps {
  projects: Project[];
  onOpenProject: (id: string) => void;
  onCreateClick: () => void;
  onWebhookClick: () => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ projects, onOpenProject, onCreateClick, onWebhookClick }) => {
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-20 animate-in fade-in zoom-in duration-500">
        <div className="mb-12">
          <img src={LOGO_URL} alt="Yes Conciergerie" className="h-32 object-contain animate-pulse" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-3 tracking-tight">Bienvenue chez Yes.</h2>
        <p className="text-slate-500 mb-12 max-w-sm leading-relaxed">Votre espace de gestion documentaire est prêt. Initialisez un nouveau dossier pour commencer à travailler.</p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button 
            onClick={onCreateClick}
            className="flex items-center gap-3 px-10 py-5 bg-yes-orange text-white rounded-3xl font-bold transition-yes shadow-xl shadow-orange-200 hover:scale-105 active:scale-95 uppercase tracking-widest text-[11px]"
          >
            <Plus className="w-5 h-5" />
            Nouveau Dossier Client
          </button>
          <button 
            onClick={onWebhookClick}
            className="flex items-center gap-3 px-10 py-5 bg-slate-900 text-white rounded-3xl font-bold transition-yes shadow-xl hover:scale-105 active:scale-95 uppercase tracking-widest text-[11px]"
          >
            <Send className="w-5 h-5" />
            Flux n8n
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-in fade-in duration-700">
      <div className="flex items-end justify-between mb-14">
        <div>
          <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Vos Dossiers Clients</h2>
          <p className="text-[11px] uppercase tracking-[0.3em] text-yes-orange mt-3 font-bold">Gestion Privée • {projects.length} dossiers actifs</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onWebhookClick}
            className="flex items-center gap-2 px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl text-[11px] uppercase tracking-widest font-bold hover:bg-slate-900 hover:text-white transition-yes border border-slate-200"
          >
            <Send className="w-4 h-4" />
            Envoyer Webhook
          </button>
          <button 
            onClick={onCreateClick}
            className="flex items-center gap-2 px-8 py-4 bg-yes-orange text-white rounded-2xl text-[11px] uppercase tracking-widest font-bold hover:bg-slate-900 transition-yes shadow-lg shadow-orange-100"
          >
            <Plus className="w-4 h-4" />
            Initialiser
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {projects.map((project) => (
          <div 
            key={project.id}
            onClick={() => onOpenProject(project.id)}
            className="group bg-white p-10 rounded-[2.5rem] border border-slate-100 hover:border-yes-orange/20 hover:shadow-[0_40px_80px_-20px_rgba(223,99,56,0.12)] transition-yes cursor-pointer relative"
          >
            <div className="flex items-center gap-6 mb-10">
              <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center font-bold text-xl text-yes-orange group-hover:bg-yes-orange group-hover:text-white transition-yes">
                {project.firstName[0]}{project.lastName[0]}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight group-hover:text-yes-orange transition-yes">
                  {project.firstName} {project.lastName}
                </h3>
                <div className="flex items-center gap-2 text-slate-400 text-[11px] uppercase tracking-widest mt-2 font-bold">
                  <MapPin className="w-3.5 h-3.5" />
                  {project.location}
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-10">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-widest">
                <span className="text-slate-400 font-bold flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Ouverture
                </span>
                <span className="text-slate-700 font-bold">
                  {new Date(project.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] uppercase tracking-widest">
                <span className="text-slate-400 font-bold flex items-center gap-2">
                  <FileText className="w-4 h-4" /> Pièces
                </span>
                <span className="text-slate-700 font-bold">
                  {project.documents.length}
                </span>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
              <div className="flex -space-x-2">
                {project.documents.slice(0, 3).map((_, i) => (
                  <div key={i} className="w-9 h-9 rounded-2xl border-2 border-white bg-slate-50 flex items-center justify-center shadow-sm">
                    <FileText className="w-4 h-4 text-yes-orange" />
                  </div>
                ))}
                {project.documents.length > 3 && (
                  <div className="w-9 h-9 rounded-2xl border-2 border-white bg-orange-50 text-[10px] font-bold text-yes-orange flex items-center justify-center">
                    +{project.documents.length - 3}
                  </div>
                )}
              </div>
              <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-yes-orange group-hover:bg-orange-50 transition-yes">
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectList;
