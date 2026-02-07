
import React, { useState } from 'react';
import { X, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

interface WebhookModalProps {
  onClose: () => void;
}

const WebhookModal: React.FC<WebhookModalProps> = ({ onClose }) => {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setStatus('sending');

    const urls = [
      'https://dmzops.app.n8n.cloud/webhook-test/a2289ca5-c79d-4621-8ac5-34e3ee9c602d',
      'https://dmzops.app.n8n.cloud/webhook/a2289ca5-c79d-4621-8ac5-34e3ee9c602d'
    ];

    try {
      // Créer un timeout de 6 secondes
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), 6000);
      });

      // Envoyer les requêtes webhook
      // Note: fetch() résout même avec des codes d'erreur HTTP (404, 500, etc.)
      // Il ne rejette que pour les erreurs réseau (pas de connexion, timeout réseau, etc.)
      const requests = urls.map(url => 
        fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, timestamp: new Date().toISOString() })
        })
      );

      // Attendre soit la première réponse HTTP (même avec code d'erreur), soit le timeout de 6 secondes
      await Promise.race([
        Promise.any(requests), // Prend la première réponse HTTP (même si c'est un 404/500, c'est une réponse)
        timeoutPromise
      ]);

      // Si on arrive ici, une réponse a été reçue dans les 6 secondes
      setStatus('success');
    } catch (error: any) {
      console.error('Webhook Error:', error);
      // Si c'est un timeout (pas de réponse dans les 6 secondes), afficher l'erreur
      // Promise.any() rejette seulement si TOUTES les requêtes échouent (erreurs réseau)
      // Donc si on arrive ici, soit c'est un timeout, soit toutes les requêtes ont échoué
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-white rounded-[3rem] w-full max-w-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-12 duration-500">
        <div className="px-12 py-10 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
             <div className="bg-slate-900 p-3 rounded-2xl text-white">
                <Send size={24} />
             </div>
             <div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Flux n8n</h3>
                <p className="text-[10px] uppercase tracking-[0.25em] text-slate-400 mt-1 font-bold">Envoi de données structurées</p>
             </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl hover:bg-slate-100 text-slate-300 hover:text-slate-600 transition-yes flex items-center justify-center">
            <X className="w-7 h-7" />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-12 space-y-8">
          <div className="space-y-3">
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contenu à envoyer</label>
            <textarea 
              autoFocus
              required
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full px-6 py-5 bg-slate-50 border border-slate-100 focus:bg-white focus:border-yes-orange focus:ring-4 focus:ring-orange-50 rounded-[2rem] outline-none transition-yes text-sm font-medium placeholder:text-slate-200 min-h-[250px] resize-none leading-relaxed"
              placeholder="Collez ici le texte, transcript ou note à envoyer vers vos automations..."
            />
          </div>

          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {status === 'success' && (
                <div className="flex items-center gap-2 text-green-500 text-xs font-bold animate-in fade-in slide-in-from-left-4">
                  <CheckCircle2 size={18} /> Actualiser votre page dans une dizaine de secondes
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-500 text-xs font-bold animate-in fade-in slide-in-from-left-4">
                  <AlertCircle size={18} /> Erreur lors de l'expédition
                </div>
              )}
            </div>
            
            <div className="flex gap-4">
              <button 
                type="button" 
                onClick={onClose}
                className="px-8 py-4 border border-slate-100 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-yes"
              >
                Fermer
              </button>
              <button 
                type="submit"
                disabled={status === 'sending' || !text.trim()}
                className="flex items-center gap-3 px-10 py-4 bg-slate-900 text-white text-[10px] font-bold uppercase tracking-widest rounded-2xl shadow-xl hover:bg-yes-orange disabled:opacity-50 disabled:hover:bg-slate-900 transition-yes"
              >
                {status === 'sending' ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                Propulser vers n8n
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default WebhookModal;
