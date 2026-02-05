
import React from 'react';
import { X, Download, FileText, Image as ImageIcon, Briefcase, CreditCard, ShieldCheck } from 'lucide-react';

const LOGO_ICON_URL = 'https://i.postimg.cc/hPC0kRrK/logo-Yes.png';

interface ResourceFile {
  id: string;
  name: string;
  type: string;
  description: string;
  icon: React.ReactNode;
  imageUrl?: string;
}

const RESOURCES: ResourceFile[] = [
  {
    id: 'logo-official',
    name: 'Logo Officiel Yes',
    type: 'PNG / Vector',
    description: 'Logo haute résolution pour vos supports de communication.',
    icon: <ImageIcon className="w-6 h-6" />,
    imageUrl: 'https://i.postimg.cc/hPC0kRrK/logo-Yes.png'
  },
  {
    id: 'rib-alpes-jv',
    name: 'RIB Alpes JV',
    type: 'Document Bancaire',
    description: 'Coordonnées bancaires officielles (CIC Val d\'Isère).',
    icon: <CreditCard className="w-6 h-6" />,
    imageUrl: 'https://files.catbox.moe/kivl8u.png'
  },
  {
    id: 'inpi-brand',
    name: 'Marque INPI',
    type: 'Propriété Intellectuelle',
    description: 'Certificat officiel de dépôt de la marque Yes Conciergerie.',
    icon: <ShieldCheck className="w-6 h-6" />,
    imageUrl: 'https://files.catbox.moe/id3nax.png'
  },
  {
    id: 'kbis-official',
    name: 'Extrait KBIS',
    type: 'Registre Commerce',
    description: 'Justificatif d\'immatriculation pour la société Alpes JV.',
    icon: <Briefcase className="w-6 h-6" />,
    imageUrl: 'https://files.catbox.moe/j4xid1.png'
  }
];

interface ResourcesModalProps {
  onClose: () => void;
}

const ResourcesModal: React.FC<ResourcesModalProps> = ({ onClose }) => {
  const handleDownload = (imageUrl: string, name: string) => {
    // In a real app, this would be a proper download link
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${name.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-4xl max-h-[85vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-500">
        <header className="px-12 py-10 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 w-16 h-16 flex items-center justify-center overflow-hidden">
              <img src={LOGO_ICON_URL} alt="Yes" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">Ressources de Marque</h3>
              <p className="text-[10px] uppercase tracking-[0.3em] text-slate-400 mt-1 font-bold">Documents officiels Yes Conciergerie</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-14 h-14 rounded-3xl hover:bg-white border border-transparent hover:border-slate-100 text-slate-300 hover:text-slate-600 transition-yes flex items-center justify-center shadow-sm"
          >
            <X size={28} />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {RESOURCES.map((file) => (
              <div 
                key={file.id} 
                className="group bg-white p-8 rounded-[2.5rem] border border-slate-100 hover:border-yes-orange/30 hover:shadow-xl transition-yes flex flex-col h-full"
              >
                <div className="flex items-start justify-between mb-8">
                  <div className={`p-4 rounded-2xl ${file.id === 'logo-official' ? 'bg-orange-50 text-yes-orange' : 'bg-slate-50 text-slate-400'} group-hover:bg-yes-orange group-hover:text-white transition-yes`}>
                    {file.icon}
                  </div>
                  <div className="text-[10px] font-extrabold text-slate-300 uppercase tracking-widest">{file.type}</div>
                </div>
                
                <h4 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-yes-orange transition-yes">{file.name}</h4>
                <p className="text-sm text-slate-400 font-medium leading-relaxed mb-8 flex-1">
                  {file.description}
                </p>

                <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                  {file.imageUrl && (
                    <div className="w-12 h-12 rounded-xl bg-slate-50 overflow-hidden border border-slate-100 p-1 opacity-60 group-hover:opacity-100 transition-yes">
                       <img src={file.imageUrl} alt="preview" className="w-full h-full object-contain" />
                    </div>
                  )}
                  <button 
                    onClick={() => file.imageUrl && handleDownload(file.imageUrl, file.name)}
                    className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-yes-orange transition-yes shadow-lg shadow-slate-100"
                  >
                    <Download size={16} />
                    Télécharger
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 flex items-center gap-6">
            <div className="w-12 h-12 rounded-full bg-yes-orange/10 flex items-center justify-center text-yes-orange shrink-0">
               <ShieldCheck size={24} />
            </div>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              Ces documents sont confidentiels et destinés à un usage interne ou partenaires certifiés uniquement. <br/>
              <span className="font-bold text-slate-800">Toute diffusion non autorisée est strictement interdite.</span>
            </p>
          </div>
        </div>

        <footer className="px-12 py-6 bg-white border-t border-slate-50 text-center">
           <p className="text-[9px] uppercase tracking-[0.4em] text-slate-300 font-bold">Base documentaire sécurisée • Yes Conciergerie Privée</p>
        </footer>
      </div>
    </div>
  );
};

export default ResourcesModal;
