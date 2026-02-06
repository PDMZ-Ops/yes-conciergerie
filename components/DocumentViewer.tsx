
import React from 'react';
import { ProjectDocument } from '../types';
import { X, Download, FileText, Share2, Printer, Key, Trash2 } from 'lucide-react';

interface DocumentViewerProps {
  document: ProjectDocument;
  onClose: () => void;
  onDelete?: (documentId: string) => void;
}

const DocumentViewer: React.FC<DocumentViewerProps> = ({ document, onClose, onDelete }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  console.log('[DocumentViewer] Document reçu:', {
    name: document.name,
    type: document.type,
    previewUrl: document.previewUrl,
    hasPreviewUrl: !!document.previewUrl
  });

  const isImage = document.type.startsWith('image/');
  const isPdf = document.type === 'application/pdf';
  
  // Simulation de rendu pour formats complexes (PPTX, DOCX) 
  // Dans une vraie application, on utiliserait un service de conversion ou un viewer spécialisé
  const isComplex = !isImage && !isPdf;

  const handleDelete = () => {
    if (onDelete) {
      onDelete(document.id);
      onClose();
    }
  };

  // Vérifier que previewUrl existe
  if (!document.previewUrl) {
    console.error('[DocumentViewer] Aucun previewUrl pour le document:', document);
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
        <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={onClose} />
        <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in zoom-in-95 duration-500">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-6">
              <FileText className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">Document non disponible</h3>
            <p className="text-slate-600 mb-6">
              Le fichier "{document.name}" n'a pas d'URL valide. Il a peut-être été supprimé ou l'upload a échoué.
            </p>
            <button
              onClick={onClose}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-yes-orange transition-yes"
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl" onClick={onClose} />
      
      <div className="relative bg-white w-full h-full max-w-7xl rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
        {/* Header du Viewer */}
        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-4">
            <div className="bg-orange-50 p-3 rounded-2xl text-yes-orange">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">{document.name}</h3>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                {document.type} • {(document.size / 1024).toFixed(1)} KB
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 mr-4 pr-6 border-r border-slate-100">
              <button className="p-3 text-slate-400 hover:text-yes-orange hover:bg-slate-50 rounded-xl transition-yes">
                <Printer size={20} />
              </button>
              <button className="p-3 text-slate-400 hover:text-yes-orange hover:bg-slate-50 rounded-xl transition-yes">
                <Share2 size={20} />
              </button>
            </div>
            {onDelete && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 border border-red-100 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-red-100 hover:border-red-200 transition-yes"
              >
                <Trash2 size={16} /> Supprimer
              </button>
            )}
            <a 
              href={document.previewUrl} 
              download={document.name}
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-yes-orange transition-yes"
            >
              <Download size={16} /> Télécharger
            </a>
            <button 
              onClick={onClose}
              className="w-12 h-12 flex items-center justify-center bg-slate-100 text-slate-400 hover:text-slate-900 rounded-2xl transition-yes"
            >
              <X size={24} />
            </button>
          </div>
        </header>

        {/* Espace de lecture */}
        <div className="flex-1 bg-slate-50/50 overflow-auto p-4 md:p-8 flex items-center justify-center">
          <div className="w-full h-full max-w-5xl bg-white shadow-sm rounded-2xl overflow-hidden border border-slate-100 relative">
            {isImage && (
              <img 
                src={document.previewUrl} 
                alt={document.name} 
                className="w-full h-full object-contain"
                onError={(e) => {
                  console.error('Erreur chargement image:', document.previewUrl);
                  (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f3f4f6" width="400" height="300"/%3E%3Ctext fill="%239ca3af" font-family="sans-serif" font-size="18" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EImage non disponible%3C/text%3E%3C/svg%3E';
                }}
              />
            )}

            {isPdf && (
              <div className="w-full h-full relative">
                <iframe 
                  src={`${document.previewUrl}#toolbar=0`} 
                  className="w-full h-full border-none"
                  title={document.name}
                  onError={() => {
                    console.error('Erreur chargement PDF:', document.previewUrl);
                  }}
                />
                {/* Fallback si l'iframe ne charge pas */}
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50 pointer-events-none" style={{ display: 'none' }} id="pdf-error-fallback">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center text-red-600 mx-auto mb-4">
                      <FileText className="w-8 h-8" />
                    </div>
                    <h4 className="text-xl font-bold text-slate-900 mb-2">Impossible de charger le PDF</h4>
                    <p className="text-slate-600 mb-4">
                      Le fichier n'est pas accessible. Vérifie que le bucket "documents" existe dans Supabase Storage.
                    </p>
                    <a
                      href={document.previewUrl}
                      download={document.name}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-yes-orange transition-yes"
                    >
                      <Download size={18} /> Télécharger le fichier
                    </a>
                  </div>
                </div>
              </div>
            )}

            {isComplex && (
              <div className="w-full h-full flex flex-col p-12 overflow-y-auto bg-white font-sans text-slate-800">
                <div className="flex flex-col items-center justify-center py-20 text-center mb-10 border-b border-slate-100">
                  <div className="bg-orange-50 p-10 rounded-full mb-8">
                     <FileText size={48} className="text-yes-orange" />
                  </div>
                  <h4 className="text-3xl font-extrabold text-slate-900 mb-2 tracking-tight">Lecture Optimisée Yes.</h4>
                  <p className="text-slate-400 max-w-md italic">Ce document ({document.name}) est affiché en mode lecture assistée pour les formats de présentation.</p>
                </div>

                <div className="max-w-3xl mx-auto w-full">
                  <div className="flex items-center gap-3 mb-8 text-yes-orange">
                     <Key size={20} />
                     <span className="text-[11px] font-bold uppercase tracking-widest">Analyse du document</span>
                  </div>
                  <div className="prose prose-slate max-w-none leading-relaxed text-lg text-slate-600">
                    <p className="mb-6 font-medium text-slate-900">Synthèse automatique du contenu :</p>
                    <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl italic">
                      {document.content || "Le contenu textuel de ce document est en cours de traitement par notre moteur d'intelligence documentaire."}
                    </div>
                  </div>
                  
                  <div className="mt-20 p-10 bg-yes-orange rounded-[2.5rem] text-white flex items-center justify-between">
                    <div>
                      <h5 className="text-xl font-bold mb-1">Prêt pour une action stratégique ?</h5>
                      <p className="text-xs text-orange-100">Utilisez notre IA pour transformer ce document en plan d'action.</p>
                    </div>
                    <button className="px-8 py-4 bg-white text-yes-orange rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-slate-900 hover:text-white transition-yes">
                      Analyser avec l'IA
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer simple */}
        <footer className="h-16 bg-white border-t border-slate-100 flex items-center justify-center px-8 text-[10px] text-slate-400 uppercase tracking-[0.3em] font-bold shrink-0">
          Document sécurisé • Yes Conciergerie Privée
        </footer>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-md" onClick={() => setShowDeleteConfirm(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
            <div className="p-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center text-red-600">
                  <Trash2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Supprimer le document</h3>
                  <p className="text-sm text-slate-400 mt-1 font-medium">Cette action est irréversible</p>
                </div>
              </div>
              
              <p className="text-slate-600 mb-8 leading-relaxed">
                Êtes-vous sûr de vouloir supprimer <strong>"{document.name}"</strong> ? 
                Le fichier sera définitivement supprimé et ne pourra pas être récupéré.
              </p>

              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-6 py-4 text-slate-400 text-sm font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-yes border border-slate-100"
                >
                  Annuler
                </button>
                <button 
                  onClick={handleDelete}
                  className="flex-1 flex items-center justify-center gap-3 px-6 py-4 bg-red-600 text-white text-sm font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-red-100 hover:bg-red-700 transition-yes"
                >
                  <Trash2 size={18} /> Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;
