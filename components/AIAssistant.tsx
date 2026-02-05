
import React, { useState } from 'react';
import { Project } from '../types';
import { Sparkles, Loader2, Wand2, FileSearch, Send, Key, Info } from 'lucide-react';
import { generateProjectSummary } from '../services/gemini';

interface AIAssistantProps {
  project: Project;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ project }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateSummary = async () => {
    setLoading(true);
    setError(null);
    try {
      const summary = await generateProjectSummary(project);
      setResult(summary || "Une erreur est survenue lors de l'analyse.");
    } catch (err) {
      setError("Le service d'intelligence Yes est momentanément indisponible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in duration-700">
      <div className="lg:col-span-1 space-y-8">
        <div className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-yes">
            <Key size={120} className="rotate-45" />
          </div>
          
          <div className="flex items-center gap-3 text-yes-orange mb-8 relative z-10">
            <Sparkles className="w-8 h-8" />
            <h4 className="text-2xl font-bold tracking-tight">Intelligence Assistée</h4>
          </div>
          <p className="text-sm text-slate-400 leading-relaxed mb-12 relative z-10">
            Exploitez la puissance de Gemini pour analyser les documents et les données de votre client en quelques secondes.
          </p>
          <div className="space-y-4 relative z-10">
            <button 
              onClick={handleGenerateSummary}
              disabled={loading}
              className="w-full flex items-center justify-between px-8 py-5 bg-yes-orange text-white rounded-2xl text-[11px] font-extrabold uppercase tracking-widest hover:bg-white hover:text-yes-orange transition-yes group disabled:opacity-50"
            >
              <span className="flex items-center gap-4">
                <FileSearch className="w-5 h-5" />
                Générer Synthèse
              </span>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-yes" />}
            </button>
            <button 
              disabled={true}
              className="w-full flex items-center gap-4 px-8 py-5 bg-white/5 border border-white/10 text-slate-500 rounded-2xl text-[10px] font-bold uppercase tracking-widest cursor-not-allowed"
            >
              <Wand2 className="w-5 h-5" />
              Rédaction Stratégique
            </button>
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-sm">
          <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-8 ml-2">Qualité des données</h5>
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">Pièces indexées</span>
              <span className="text-sm font-extrabold text-yes-orange">{project.documents.length}</span>
            </div>
            <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
               <div className="bg-yes-orange h-full transition-all duration-1000" style={{ width: `${Math.min(100, (Object.values(project.info).filter(v => v !== '').length / 10) * 100)}%` }}></div>
            </div>
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase">Complétion profil</span>
              <span className="text-xs font-bold text-slate-700">{Math.round((Object.values(project.info).filter(v => v !== '').length / 10) * 100)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:col-span-2 min-h-[650px]">
        {!result && !loading && !error && (
          <div className="h-full bg-white border border-slate-100 rounded-[3rem] flex flex-col items-center justify-center p-20 text-center shadow-sm">
            <div className="bg-slate-50 p-10 rounded-[2.5rem] mb-8">
              <Sparkles className="w-12 h-12 text-slate-200" />
            </div>
            <h5 className="text-2xl font-bold text-slate-800 mb-3 tracking-tight">Prêt pour l'analyse.</h5>
            <p className="text-sm text-slate-400 max-w-xs mx-auto leading-relaxed">Cliquez sur le bouton de génération pour lancer le traitement intelligent du dossier.</p>
          </div>
        )}

        {loading && (
          <div className="h-full bg-white border border-slate-100 rounded-[3rem] flex flex-col items-center justify-center p-20 text-center shadow-sm">
            <div className="relative">
              <Loader2 className="w-16 h-16 text-yes-orange animate-spin mb-10" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Sparkles size={20} className="text-yes-orange/50 animate-pulse" />
              </div>
            </div>
            <h5 className="text-2xl font-extrabold text-slate-900 tracking-tight">Traitement Intelligent Yes.</h5>
            <p className="text-[11px] uppercase tracking-[0.3em] text-yes-orange mt-4 font-bold animate-pulse">Analyse multidimensionnelle en cours</p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-100 rounded-[2rem] p-10 text-red-900 flex items-center gap-6 shadow-sm">
            <div className="bg-red-100 p-4 rounded-2xl text-red-600">
               <Info size={24} />
            </div>
            <div>
              <p className="font-extrabold text-lg tracking-tight">Une erreur est survenue</p>
              <p className="text-sm text-red-600/70 font-medium">{error}</p>
            </div>
          </div>
        )}

        {result && !loading && (
          <div className="bg-white border border-slate-100 rounded-[3rem] p-14 shadow-xl animate-in fade-in slide-in-from-right-10 duration-1000 relative">
            <div className="flex items-center justify-between mb-12 pb-8 border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="bg-orange-50 p-3 rounded-2xl">
                  <FileSearch className="w-6 h-6 text-yes-orange" />
                </div>
                <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  Synthèse Stratégique
                </h4>
              </div>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(result);
                  alert("Note confidentielle copiée.");
                }}
                className="text-[10px] font-bold text-yes-orange hover:bg-yes-orange hover:text-white transition-yes uppercase tracking-[0.2em] px-6 py-3 border border-orange-100 rounded-2xl"
              >
                Copier le texte
              </button>
            </div>
            <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-[15px]">
              {result.split('\n').map((line, i) => {
                const trimmed = line.trim();
                if (trimmed.startsWith('#')) {
                  return <p key={i} className="text-xl font-extrabold text-slate-900 mt-10 mb-6 tracking-tight">{trimmed.replace(/[#*]/g, '')}</p>;
                }
                if (trimmed.startsWith('**') && trimmed.endsWith('**')) {
                  return <p key={i} className="font-extrabold text-slate-800 mt-6 mb-2 tracking-tight">{trimmed.replace(/[#*]/g, '')}</p>;
                }
                return <p key={i} className="mb-5 font-medium text-slate-500 leading-loose">{line}</p>;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistant;
