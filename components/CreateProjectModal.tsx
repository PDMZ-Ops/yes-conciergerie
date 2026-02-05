
import React, { useState } from 'react';
import { X, User, MapPin } from 'lucide-react';

const LOGO_ICON_URL = 'https://i.postimg.cc/hPC0kRrK/logo-Yes.png';

interface CreateProjectModalProps {
  onClose: () => void;
  onConfirm: (firstName: string, lastName: string, location: string) => void;
}

const CreateProjectModal: React.FC<CreateProjectModalProps> = ({ onClose, onConfirm }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !location) return;
    onConfirm(firstName, lastName, location);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-white rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-12 duration-500">
        <div className="px-12 py-10 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center w-14 h-14 overflow-hidden">
                <img src={LOGO_ICON_URL} alt="Yes" className="w-full h-full object-contain" />
             </div>
             <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Ouverture de Dossier</h3>
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 mt-1 font-bold">Yes Conciergerie Privée</p>
             </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl hover:bg-slate-100 text-slate-300 hover:text-slate-600 transition-yes flex items-center justify-center">
            <X className="w-7 h-7" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-12 space-y-10">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Prénom du Client</label>
              <input 
                autoFocus
                required
                type="text" 
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:bg-white focus:border-yes-orange focus:ring-4 focus:ring-orange-50 rounded-2xl outline-none transition-yes text-sm font-bold placeholder:text-slate-200"
                placeholder="ex: Alexandre"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Nom du Client</label>
              <input 
                required
                type="text" 
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 focus:bg-white focus:border-yes-orange focus:ring-4 focus:ring-orange-50 rounded-2xl outline-none transition-yes text-sm font-bold placeholder:text-slate-200"
                placeholder="ex: De Beauvoir"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Localisation du Projet</label>
            <div className="relative">
              <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                required
                type="text" 
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 focus:bg-white focus:border-yes-orange focus:ring-4 focus:ring-orange-50 rounded-2xl outline-none transition-yes text-sm font-bold placeholder:text-slate-200"
                placeholder="ex: Paris, Avenue Montaigne"
              />
            </div>
          </div>

          <div className="pt-8 flex gap-6">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-8 py-5 border border-slate-100 text-slate-400 text-[11px] font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-yes"
            >
              Annuler
            </button>
            <button 
              type="submit"
              className="flex-1 px-8 py-5 bg-yes-orange text-white text-[11px] font-bold uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-100 hover:scale-[1.02] active:scale-95 transition-yes"
            >
              Initialiser le dossier
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
