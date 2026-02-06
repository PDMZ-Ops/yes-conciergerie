
import React, { useState } from 'react';
import { Project, ProjectInfo, ProjectDocument } from '../types';
import { Info, Files, Save, Upload, FileText, Trash2, Phone, Mail, User, MapPin, Target, TrendingUp, BookOpen, Star, Calendar, Briefcase, Percent, Eye, X, Download, Terminal, FileCheck, Mic, Maximize2, Check } from 'lucide-react';
import DocumentViewer from './DocumentViewer';
import PromptModal from './PromptModal';
import { supabase } from '../services/supabase';

interface ProjectDetailProps {
  project: Project;
  onUpdateProject: (project: Project) => void;
  onDeleteProject: (projectId: string) => void;
}

const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, onUpdateProject, onDeleteProject }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'docs'>('info');
  const [formData, setFormData] = useState<ProjectInfo>(project.info);
  const [basicInfo, setBasicInfo] = useState({
    firstName: project.firstName,
    lastName: project.lastName,
    location: project.location
  });

  // Synchroniser les données quand le projet change (notamment les documents)
  React.useEffect(() => {
    setFormData(project.info);
    setBasicInfo({
      firstName: project.firstName,
      lastName: project.lastName,
      location: project.location
    });
    console.log('[ProjectDetail] Projet mis à jour:', {
      id: project.id,
      documentsCount: project.documents?.length || 0,
      documents: project.documents
    });
  }, [project.id, project.documents?.length, JSON.stringify(project.documents)]);
  const [selectedDoc, setSelectedDoc] = useState<ProjectDocument | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [promptType, setPromptType] = useState<'EM' | 'DIP'>('EM');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  // State for the full screen text editor
  const [fullTextModal, setFullTextModal] = useState<{
    isOpen: boolean;
    title: string;
    field: keyof ProjectInfo;
    value: string;
  }>({
    isOpen: false,
    title: '',
    field: 'biography',
    value: ''
  });

  const handleSaveAll = () => {
    onUpdateProject({ 
      ...project, 
      firstName: basicInfo.firstName,
      lastName: basicInfo.lastName,
      location: basicInfo.location,
      info: formData 
    });
    alert("Dossier mis à jour avec succès.");
  };

  const openPrompt = (type: 'EM' | 'DIP') => {
    setPromptType(type);
    setIsPromptModalOpen(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);

    try {
      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Vous devez être connecté pour uploader des fichiers.');
        setIsUploading(false);
        return;
      }

      const uploadedDocs: ProjectDocument[] = [];

      // Upload chaque fichier vers Supabase Storage
      for (const file of Array.from(files)) {
        const fileId = crypto.randomUUID();
        const fileExt = file.name.split('.').pop();
        const fileName = `${fileId}.${fileExt}`;
        const filePath = `${user.id}/${project.id}/${fileName}`;

        // Note: On ne vérifie plus si le bucket existe car listBuckets() peut échouer
        // même si le bucket existe. On laisse l'upload échouer avec un message d'erreur clair si nécessaire.

        // Upload vers Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Erreur upload fichier:', uploadError);
          
          // Message d'erreur plus clair selon le type d'erreur
          let errorMessage = uploadError.message;
          if (uploadError.message?.includes('Bucket not found') || uploadError.message?.includes('not found')) {
            errorMessage = 'Le bucket "documents" n\'existe pas dans Supabase Storage. Va dans Storage → New bucket et crée un bucket nommé "documents" (public).';
          } else if (uploadError.message?.includes('new row violates row-level security') || uploadError.message?.includes('row-level security')) {
            errorMessage = 'Erreur de permissions. Vérifie les politiques de sécurité du bucket "documents" dans Supabase. Le bucket doit être public ou avoir des politiques qui autorisent l\'upload.';
          }
          
          alert(`Erreur lors de l'upload de ${file.name}:\n\n${errorMessage}`);
          continue;
        }

        // Obtenir l'URL publique du fichier
        // Si le bucket n'est pas public, on utilisera une URL signée
        let fileUrl: string;
        
        try {
          const { data: urlData } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath);

          if (urlData?.publicUrl) {
            fileUrl = urlData.publicUrl;
            console.log('[handleFileUpload] URL publique obtenue:', fileUrl);
          } else {
            // Si l'URL publique ne fonctionne pas, utiliser une URL signée
            console.log('[handleFileUpload] Tentative avec URL signée...');
            const { data: signedData, error: signedError } = await supabase.storage
              .from('documents')
              .createSignedUrl(filePath, 3600); // Valide 1 heure

          if (signedError || !signedData?.signedUrl) {
            console.error('Erreur création URL signée:', signedError);
            alert(`Erreur: Impossible d'obtenir l'URL pour ${file.name}. Vérifie que le bucket "documents" est public dans Supabase.`);
            continue;
          }
          fileUrl = signedData.signedUrl;
          console.log('[handleFileUpload] URL signée obtenue:', fileUrl);
        }
        } catch (urlError: any) {
          console.error('Erreur obtention URL:', urlError);
          alert(`Erreur: Impossible d'obtenir l'URL pour ${file.name}. Vérifie les permissions du bucket "documents".`);
          continue;
        }

        console.log('[handleFileUpload] Fichier uploadé:', {
          name: file.name,
          path: filePath,
          url: fileUrl
        });

        const doc: ProjectDocument = {
          id: fileId,
          name: file.name,
          type: file.type,
          size: file.size,
          uploadedAt: new Date().toISOString(),
          previewUrl: fileUrl, // URL depuis Supabase Storage (publique ou signée)
          content: `Extrait de contenu simulé pour ${file.name}. Ce document est de type ${file.type}.`
        };

        uploadedDocs.push(doc);
      }

      if (uploadedDocs.length > 0) {
        // Sauvegarder les métadonnées en base de données
        onUpdateProject({
          ...project,
          documents: [...project.documents, ...uploadedDocs]
        });
      }

      // Réinitialiser l'input
      e.target.value = '';
    } catch (error: any) {
      console.error('Erreur upload:', error);
      alert('Erreur lors de l\'upload: ' + (error?.message ?? String(error)));
    } finally {
      setIsUploading(false);
    }
  };

  const removeDocument = async (id: string) => {
    const doc = project.documents.find(d => d.id === id);
    if (!doc) return;

    try {
      // Récupérer l'utilisateur connecté
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert('Vous devez être connecté pour supprimer des fichiers.');
        return;
      }

      // Extraire le chemin du fichier depuis l'URL
      // Format: https://xxx.supabase.co/storage/v1/object/public/documents/user_id/project_id/filename
      const urlParts = doc.previewUrl?.split('/');
      if (urlParts && urlParts.length > 0) {
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `${user.id}/${project.id}/${fileName}`;

        // Supprimer le fichier de Supabase Storage
        const { error: deleteError } = await supabase.storage
          .from('documents')
          .remove([filePath]);

        if (deleteError) {
          console.error('Erreur suppression fichier:', deleteError);
          // On continue quand même pour supprimer de la liste
        }
      }

      // Supprimer de la liste des documents
      onUpdateProject({
        ...project,
        documents: project.documents.filter(d => d.id !== id)
      });
    } catch (error: any) {
      console.error('Erreur suppression:', error);
      // On supprime quand même de la liste même en cas d'erreur
      onUpdateProject({
        ...project,
        documents: project.documents.filter(d => d.id !== id)
      });
    }
  };

  const openFullEditor = (title: string, field: keyof ProjectInfo) => {
    setFullTextModal({
      isOpen: true,
      title,
      field,
      value: formData[field] as string
    });
  };

  const saveFullEditor = () => {
    setFormData(prev => ({
      ...prev,
      [fullTextModal.field]: fullTextModal.value
    }));
    setFullTextModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
      {/* Tab Switcher */}
      <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-sm inline-flex mb-12">
        <button 
          onClick={() => setActiveTab('info')}
          className={`px-8 py-3 rounded-[1.5rem] flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-yes ${activeTab === 'info' ? 'bg-yes-orange text-white shadow-lg shadow-orange-100' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Info size={16} /> Fiche Client
        </button>
        <button 
          onClick={() => setActiveTab('docs')}
          className={`px-8 py-3 rounded-[1.5rem] flex items-center gap-2 text-xs font-bold uppercase tracking-widest transition-yes ${activeTab === 'docs' ? 'bg-yes-orange text-white shadow-lg shadow-orange-100' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <Files size={16} /> Drive ({project.documents.length})
        </button>
      </div>

      <div className="animate-in slide-in-from-bottom-8 duration-700">
        {activeTab === 'info' && (
          <div className="bg-white rounded-[3rem] border border-slate-100 p-12 shadow-sm">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6">
              <div>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Détails de l'échange</h3>
                <p className="text-sm text-slate-400 mt-2 font-medium">Consultez et modifiez les informations stratégiques du client.</p>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => openPrompt('EM')}
                  className="flex items-center gap-2 px-6 py-4 bg-orange-50 text-yes-orange text-[10px] uppercase tracking-[0.2em] font-bold rounded-2xl hover:bg-yes-orange hover:text-white transition-yes border border-orange-100 shadow-sm"
                >
                  <Terminal className="w-4 h-4" /> Prompte EM
                </button>
                <button 
                  onClick={() => openPrompt('DIP')}
                  className="flex items-center gap-2 px-6 py-4 bg-slate-50 text-slate-600 text-[10px] uppercase tracking-[0.2em] font-bold rounded-2xl hover:bg-slate-900 hover:text-white transition-yes border border-slate-200 shadow-sm"
                >
                  <FileCheck className="w-4 h-4" /> Prompte DIP
                </button>
                <button 
                  onClick={handleSaveAll}
                  className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white text-[10px] uppercase tracking-[0.2em] font-bold rounded-2xl hover:bg-yes-orange transition-yes shadow-lg"
                >
                  <Save className="w-4 h-4" /> Enregistrer
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              <Section title="Coordonnées Client" icon={<User className="text-yes-orange" size={18} />}>
                <Field label="Prénom" value={basicInfo.firstName} onChange={(v) => setBasicInfo(b => ({...b, firstName: v}))} />
                <Field label="Nom" value={basicInfo.lastName} onChange={(v) => setBasicInfo(b => ({...b, lastName: v}))} />
                <Field label="Métier du client" icon={<Briefcase size={14} />} value={formData.profession} onChange={(v) => setFormData(f => ({...f, profession: v}))} placeholder="ex: Architecte" />
                <Field label="E-mail" value={formData.email} onChange={(v) => setFormData(f => ({...f, email: v}))} placeholder="client@yes.com" />
                <Field label="Téléphone" value={formData.phone} onChange={(v) => setFormData(f => ({...f, phone: v}))} placeholder="+33 6 ..." />
                <Field label="Ville du Projet" value={basicInfo.location} onChange={(v) => setBasicInfo(b => ({...b, location: v}))} />
              </Section>

              <Section title="Profil & Parcours" icon={<BookOpen className="text-yes-orange" size={18} />}>
                <Field label="Date de l'échange" type="date" value={formData.exchangeDate} onChange={(v) => setFormData(f => ({...f, exchangeDate: v}))} />
                <TextArea label="Points forts" value={formData.strengths} onChange={(v) => setFormData(f => ({...f, strengths: v}))} placeholder="Atouts du client..." />
                <TextArea 
                  label="Biographie" 
                  value={formData.biography} 
                  onChange={(v) => setFormData(f => ({...f, biography: v}))} 
                  placeholder="Historique..." 
                  onExpand={() => openFullEditor("Biographie du Client", "biography")}
                />
                <TextArea 
                  label="Transcript appel" 
                  icon={<Mic size={14} className="inline mr-1" />} 
                  value={formData.callTranscript} 
                  onChange={(v) => setFormData(f => ({...f, callTranscript: v}))} 
                  placeholder="Contenu de l'appel téléphonique..." 
                  onExpand={() => openFullEditor("Transcript de l'Appel", "callTranscript")}
                />
              </Section>

              <Section title="Trajectoire Financière" icon={<TrendingUp className="text-yes-orange" size={18} />}>
                <TextArea label="Objectifs Généraux" value={formData.goals} onChange={(v) => setFormData(f => ({...f, goals: v}))} placeholder="Vision stratégique..." />
                <div className="grid grid-cols-1 gap-4">
                  <Field label="Commission conciergerie (%)" icon={<Percent size={14} />} value={formData.conciergeCommission} onChange={(v) => setFormData(f => ({...f, conciergeCommission: v}))} placeholder="ex: 15" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="CA Cible Y1" value={formData.targetRevenueY1} onChange={(v) => setFormData(f => ({...f, targetRevenueY1: v}))} />
                  <Field label="CA Cible Y2" value={formData.targetRevenueY2} onChange={(v) => setFormData(f => ({...f, targetRevenueY2: v}))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="CA Cible Y3" value={formData.targetRevenueY3} onChange={(v) => setFormData(f => ({...f, targetRevenueY3: v}))} />
                  <Field label="Marge brute cible" value={formData.targetGrossMargin} onChange={(v) => setFormData(f => ({...f, targetGrossMargin: v}))} placeholder="%" />
                </div>
              </Section>
            </div>

            {/* Bouton de suppression en bas à droite */}
            <div className="mt-12 flex justify-end">
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="flex items-center gap-3 px-6 py-4 bg-red-50 text-red-600 border border-red-100 rounded-2xl hover:bg-red-100 hover:border-red-200 transition-yes shadow-sm"
                title="Supprimer le projet"
              >
                <Trash2 className="w-5 h-5" />
                <span className="text-sm font-bold">Supprimer le projet</span>
              </button>
            </div>
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="space-y-10">
            <div className="bg-white rounded-[3rem] border border-slate-100 p-16 text-center shadow-sm">
              <div className={`flex flex-col items-center justify-center border-2 border-dashed rounded-[2.5rem] p-16 transition-yes relative group ${
                isUploading 
                  ? 'border-yes-orange bg-orange-50/50 cursor-wait' 
                  : 'border-slate-100 hover:border-yes-orange/30 hover:bg-orange-50/10 cursor-pointer'
              }`}>
                <input 
                  type="file" 
                  multiple 
                  onChange={handleFileUpload} 
                  disabled={isUploading}
                  className="absolute inset-0 opacity-0 cursor-pointer disabled:cursor-wait" 
                />
                <div className={`w-20 h-20 bg-orange-50 border border-orange-100 rounded-3xl flex items-center justify-center mb-8 text-yes-orange transition-yes ${
                  isUploading ? 'animate-pulse' : 'group-hover:scale-110'
                }`}>
                  {isUploading ? (
                    <div className="w-10 h-10 border-4 border-yes-orange border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Upload className="w-10 h-10" />
                  )}
                </div>
                <h4 className="text-2xl font-extrabold text-slate-800 mb-2">
                  {isUploading ? 'Upload en cours...' : 'Importer vos documents'}
                </h4>
                <p className="text-[11px] text-slate-400 uppercase tracking-[0.2em] font-bold">
                  {isUploading ? 'Veuillez patienter' : 'PDF, Word, Images • Drive Sécurisé'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {(!project.documents || project.documents.length === 0) ? (
                <div className="col-span-full text-center py-12 text-slate-400">
                  <FileText className="w-16 h-16 mx-auto mb-4 opacity-20" />
                  <p className="text-sm font-medium">Aucun document uploadé</p>
                </div>
              ) : (
                project.documents.map((doc) => (
                  <div key={doc.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 flex flex-col group hover:border-yes-orange/20 hover:shadow-xl transition-yes">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-5 overflow-hidden">
                        <div className="w-14 h-14 bg-slate-50 text-yes-orange rounded-2xl flex items-center justify-center shrink-0 border border-slate-100">
                          <FileText className="w-7 h-7" />
                        </div>
                        <div className="overflow-hidden">
                          <h5 className="text-sm font-bold text-slate-800 truncate" title={doc.name}>{doc.name}</h5>
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1 font-bold">
                            {(doc.size / 1024).toFixed(0)} KB • {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-slate-50 opacity-0 group-hover:opacity-100 transition-yes">
                      <button 
                        onClick={() => setSelectedDoc(doc)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-yes-orange transition-yes"
                      >
                        <Eye size={14} /> Lire
                      </button>
                      <button 
                        onClick={() => removeDocument(doc.id)}
                        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-yes"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {selectedDoc && (
        <DocumentViewer 
          document={selectedDoc} 
          onClose={() => setSelectedDoc(null)}
          onDelete={removeDocument}
        />
      )}

      {isPromptModalOpen && (
        <PromptModal 
          project={project}
          type={promptType}
          onClose={() => setIsPromptModalOpen(false)}
        />
      )}

      {/* Modal de confirmation de suppression */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setIsDeleteModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center text-red-600">
                  <Trash2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Supprimer le projet</h3>
                  <p className="text-sm text-slate-400 mt-1 font-medium">Cette action est irréversible</p>
                </div>
              </div>
              
              <p className="text-slate-600 mb-8 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer le dossier de <strong>{project.firstName} {project.lastName}</strong> ? 
                Toutes les données associées seront définitivement supprimées.
              </p>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-6 py-4 text-slate-400 text-sm font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-yes border border-slate-100"
                >
                  Annuler
                </button>
                <button 
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    onDeleteProject(project.id);
                  }}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-red-600 text-white text-sm font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-red-100 hover:bg-red-700 transition-yes"
                >
                  <Trash2 size={18} /> Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Text Editor Modal */}
      {fullTextModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setFullTextModal(p => ({...p, isOpen: false}))} />
          <div className="relative bg-white w-full max-w-5xl h-full max-h-[90vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
            <header className="px-10 py-8 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="bg-yes-orange p-3 rounded-2xl text-white shadow-lg shadow-orange-100">
                  <Maximize2 size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{fullTextModal.title}</h3>
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 mt-1 font-bold">Édition immersive</p>
                </div>
              </div>
              <button 
                onClick={() => setFullTextModal(p => ({...p, isOpen: false}))}
                className="w-12 h-12 flex items-center justify-center bg-white border border-slate-100 text-slate-300 hover:text-slate-900 rounded-2xl transition-yes shadow-sm"
              >
                <X size={24} />
              </button>
            </header>
            
            <div className="flex-1 p-10 overflow-hidden">
              <textarea 
                value={fullTextModal.value}
                onChange={(e) => setFullTextModal(p => ({...p, value: e.target.value}))}
                className="w-full h-full p-8 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] outline-none focus:bg-white focus:border-yes-orange transition-yes text-lg font-medium leading-relaxed resize-none no-scrollbar shadow-inner"
                placeholder="Rédigez ici..."
                autoFocus
              />
            </div>

            <footer className="px-10 py-8 border-t border-slate-100 flex items-center justify-between bg-white">
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Modifications synchronisées avec la fiche client</p>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setFullTextModal(p => ({...p, isOpen: false}))}
                  className="px-8 py-4 text-slate-400 text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-yes"
                >
                  Annuler
                </button>
                <button 
                  onClick={saveFullEditor}
                  className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white text-xs font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-200 hover:bg-yes-orange transition-yes"
                >
                  <Check size={18} /> Valider les modifications
                </button>
              </div>
            </footer>
          </div>
        </div>
      )}
    </div>
  );
};

/* Modern UI Components */
const Section = ({ title, icon, children }: any) => (
  <div className="space-y-8">
    <div className="flex items-center gap-3 border-b border-slate-50 pb-4">
      {icon}
      <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.2em]">{title}</h4>
    </div>
    <div className="space-y-6">
      {children}
    </div>
  </div>
);

const Field = ({ label, value, onChange, placeholder, type = "text", icon }: any) => (
  <div className="space-y-2">
    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1.5">
      {icon} {label}
    </label>
    <input 
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-5 py-3.5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-yes-orange focus:ring-4 focus:ring-orange-50 rounded-2xl outline-none transition-yes text-sm font-medium"
      placeholder={placeholder}
    />
  </div>
);

const TextArea = ({ label, value, onChange, placeholder, icon, onExpand }: any) => (
  <div className="space-y-2 relative group">
    <div className="flex items-center justify-between">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1 flex items-center gap-1.5">
        {icon} {label}
      </label>
      {onExpand && (
        <button 
          onClick={onExpand}
          className="p-1.5 text-slate-300 hover:text-yes-orange transition-yes opacity-0 group-hover:opacity-100"
          title="Agrandir l'éditeur"
        >
          <Maximize2 size={12} />
        </button>
      )}
    </div>
    <textarea 
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-yes-orange focus:ring-4 focus:ring-orange-50 rounded-2xl outline-none transition-yes text-sm font-medium min-h-[120px] resize-none leading-relaxed"
      placeholder={placeholder}
    />
  </div>
);

export default ProjectDetail;
