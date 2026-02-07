import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  LayoutDashboard,
  FolderPlus,
  Search,
  ChevronRight,
  Info,
  ArrowLeft,
  Send,
  Library
} from 'lucide-react';
import { Project, ViewState, ProjectInfo } from './types';
import ProjectList from './components/ProjectList';
import ProjectDetail from './components/ProjectDetail';
import CreateProjectModal from './components/CreateProjectModal';
import WebhookModal from './components/WebhookModal';
import ResourcesModal from './components/ResourcesModal';
import AuthGate from './components/AuthGate';
import { supabase } from './services/supabase';

const LOGO_URL = 'https://i.postimg.cc/hPC0kRrK/logo-Yes.png';

const PROJECTS_CACHE_PREFIX = 'projects_cache_v2_';

const EMPTY_INFO: ProjectInfo = {
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

const withTimeout = async <T,>(p: Promise<T>, ms: number, label: string) => {
  return await new Promise<T>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`Timeout ${label}`)), ms);
    p.then((v) => {
      clearTimeout(t);
      resolve(v);
    }).catch((e) => {
      clearTimeout(t);
      reject(e);
    });
  });
};

// ✅ Timeout + annulation réelle des requêtes PostgREST
const withAbort = async <T,>(fn: (signal: AbortSignal) => Promise<T>, ms: number, label: string) => {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  try {
    return await fn(controller.signal);
  } catch (e: any) {
    if (e?.name === 'AbortError') throw new Error(`Timeout ${label}`);
    throw e;
  } finally {
    clearTimeout(t);
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');

  const [projects, setProjects] = useState<Project[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);

  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingProjectInfo, setIsLoadingProjectInfo] = useState(false);

  // Anti double-fetch / spam
  const loadingProjectsRef = useRef(false);
  const lastLoadedUidRef = useRef<string | null>(null);
  const loadingProjectInfoRef = useRef<Set<string>>(new Set());
  const loadedProjectInfoRef = useRef<Set<string>>(new Set());

  // Permet de forcer un remount de ProjectDetail quand info arrive
  const [infoVersion, setInfoVersion] = useState<Record<string, number>>({});
  const bumpInfoVersion = (id: string) =>
    setInfoVersion((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));

  const cacheKey = useCallback((uid: string) => `${PROJECTS_CACHE_PREFIX}${uid}`, []);

  const readCache = useCallback((uid: string): Project[] | null => {
    try {
      const raw = localStorage.getItem(cacheKey(uid));
      if (!raw) return null;
      const parsed = JSON.parse(raw) as Array<{
        id: string;
        firstName: string;
        lastName: string;
        location: string;
        createdAt: string;
        documents?: any[];
        info?: any;
      }>;
      return parsed.map((p) => ({
        ...p,
        documents: p.documents || [], // ✅ Préserver les documents en cache si disponibles
        info: p.info || EMPTY_INFO // ✅ Préserver les info en cache si disponibles
      })) as Project[];
    } catch {
      return null;
    }
  }, [cacheKey]);

  const writeCache = useCallback((uid: string, list: Project[]) => {
    try {
      // ✅ Sauvegarder aussi les documents et info en cache pour un chargement plus rapide
      const cached = list.map((p) => ({
        id: p.id,
        firstName: p.firstName,
        lastName: p.lastName,
        location: p.location,
        createdAt: p.createdAt,
        documents: p.documents || [], // ✅ Cache les documents pour affichage immédiat
        info: p.info || EMPTY_INFO // ✅ Cache les info pour affichage immédiat
      }));
      localStorage.setItem(cacheKey(uid), JSON.stringify(cached));
    } catch {}
  }, [cacheKey]);

  const handleSignOut = async () => {
    console.log('[SIGNOUT] click');
    try {
      await withTimeout(supabase.auth.signOut(), 7000, 'signOut()');
      console.log('[SIGNOUT] ok');
    } catch (e) {
      console.warn('[SIGNOUT] signOut bloqué, fallback clear storage', e);
      try {
        Object.keys(localStorage).forEach((k) => {
          if (k.includes('supabase') || k.includes('sb-') || k.startsWith(PROJECTS_CACHE_PREFIX)) {
            localStorage.removeItem(k);
          }
        });
        Object.keys(sessionStorage).forEach((k) => {
          if (k.includes('supabase') || k.includes('sb-')) sessionStorage.removeItem(k);
        });
      } catch {}
    }
    window.location.href = '/';
  };

  // ✅ Liste rapide (sans select '*')
  const loadProjects = useCallback(async (uid: string) => {
    console.log('[loadProjects] Début pour uid:', uid);
    
    // cache instant - affiche immédiatement les projets en cache
    const cached = readCache(uid);
    if (cached && cached.length > 0) {
      console.log('[loadProjects] Cache trouvé:', cached.length, 'projets');
      setProjects(cached);
    } else {
      console.log('[loadProjects] Pas de cache');
    }

    if (loadingProjectsRef.current) {
      console.log('[loadProjects] Déjà en cours de chargement, skip');
      return;
    }
    loadingProjectsRef.current = true;
    setIsLoadingProjects(true);

    try {
      console.time('[loadProjects]');
      console.log('[loadProjects] Requête Supabase...');

      // ✅ Ne pas charger les documents dans la liste initiale (trop lourd)
      // On les chargera seulement quand on ouvre un projet
      // ✅ Charger TOUS les projets (pas de filtre user_id)
      const queryPromise = supabase
        .from('projects')
        .select('id, first_name, last_name, location, created_at') // ✅ Pas de documents ici pour la performance
        .order('created_at', { ascending: false });

      const res = await withTimeout(
        Promise.resolve(queryPromise) as Promise<{ data: any[] | null; error: any }>,
        20000, // Timeout augmenté à 20s
        'loadProjects()'
      );

      console.timeEnd('[loadProjects]');

      if ((res as any).error) {
        console.error('[loadProjects] error', (res as any).error);
        return;
      }

      const data = (res as any).data as any[] | null;

      const mapped: Project[] = (data ?? []).map((row: any) => ({
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        location: row.location,
        createdAt: row.created_at,
        documents: [], // ✅ Documents chargés séparément via ensureProjectInfo
        info: EMPTY_INFO // placeholder
      }));

      console.log('[loadProjects] Projets chargés depuis Supabase:', mapped.length);
      
      // ✅ Utiliser setProjects avec une fonction pour préserver les documents et info déjà chargés
      setProjects((prevProjects) => {
        return mapped.map((newProject) => {
          const existingProject = prevProjects.find(p => p.id === newProject.id);
          if (existingProject) {
            // Préserver les documents et info déjà chargés
            return {
              ...newProject,
              documents: existingProject.documents.length > 0 ? existingProject.documents : newProject.documents,
              info: existingProject.info !== EMPTY_INFO ? existingProject.info : newProject.info
            };
          }
          return newProject;
        });
      });
      
      // Mettre à jour le cache avec les projets de base (sans documents/info pour la performance)
      writeCache(uid, mapped);
      lastLoadedUidRef.current = uid;
    } catch (e: any) {
      if (e?.message?.includes('Timeout')) {
        console.warn('[loadProjects] timeout', e);
      } else {
        console.error('[loadProjects] exception', e);
      }
    } finally {
      setIsLoadingProjects(false);
      loadingProjectsRef.current = false;
    }
  }, [readCache, writeCache]);

  // ✅ Charge le "info" et "documents" quand on ouvre un projet (et remount ProjectDetail)
  const ensureProjectInfo = useCallback(async (uid: string, projectId: string) => {
    // Éviter les appels multiples pour le même projet
    if (loadingProjectInfoRef.current.has(projectId)) {
      console.log('[ensureProjectInfo] Déjà en cours de chargement pour:', projectId);
      return;
    }

    // Vérifier si les données sont déjà chargées
    const existingProject = projects.find(p => p.id === projectId);
    if (existingProject) {
      // Si on a déjà les documents ET les info, pas besoin de recharger
      const hasDocuments = existingProject.documents && existingProject.documents.length > 0;
      const hasInfo = existingProject.info && existingProject.info !== EMPTY_INFO;
      
      if (hasDocuments && hasInfo && loadedProjectInfoRef.current.has(projectId)) {
        console.log('[ensureProjectInfo] Données déjà chargées, skip requête Supabase');
        return;
      }
      
      // Si on a les documents ET les info depuis le cache, ne pas recharger
      if (hasDocuments && hasInfo) {
        console.log('[ensureProjectInfo] Données complètes en cache, skip requête Supabase');
        // Marquer comme chargé pour éviter les requêtes futures
        loadedProjectInfoRef.current.add(projectId);
        return;
      }
      
      // Si on a les documents mais pas les info, charger seulement les info
      if (hasDocuments && !hasInfo) {
        console.log('[ensureProjectInfo] Documents en cache, chargement info uniquement...');
        // On continue pour charger les info
      }
    }

    loadingProjectInfoRef.current.add(projectId);
    
    // Ne pas bloquer l'UI si on a déjà les documents en cache
    const hasCachedDocuments = existingProject && 
      existingProject.documents && 
      existingProject.documents.length > 0;
    
    if (!hasCachedDocuments) {
      setIsLoadingProjectInfo(true);
    }
    
    try {
      console.log('[ensureProjectInfo] Début pour projet:', projectId);
      console.time(`[ensureProjectInfo] ${projectId}`);
      
      // ✅ Charger les infos de n'importe quel projet (pas de filtre user_id)
      const queryPromise = supabase
        .from('projects')
        .select('info, documents')
        .eq('id', projectId)
        .single();

      const res = await withTimeout(
        Promise.resolve(queryPromise) as Promise<{ data: { info: any; documents: any } | null; error: any }>,
        30000, // Timeout augmenté à 30s
        'loadProjectInfo()'
      );

      console.timeEnd(`[ensureProjectInfo] ${projectId}`);

      if ((res as any).error) {
        console.error('[ensureProjectInfo] error', (res as any).error);
        return;
      }

      const info = (res as any).data?.info ?? EMPTY_INFO;
      
      // Debug: voir ce qui vient de Supabase
      console.log('[ensureProjectInfo] Données brutes de Supabase:', {
        has_documents: !!res.data?.documents,
        documents_type: typeof res.data?.documents,
        documents_is_array: Array.isArray(res.data?.documents),
        documents_value: res.data?.documents
      });
      
      const documents = (res as any).data?.documents && Array.isArray((res as any).data.documents) 
        ? (res as any).data.documents 
        : [];

      console.log('[ensureProjectInfo] Documents après traitement:', documents.length, documents);

      // Vérifier que les documents ont bien leur previewUrl
      const documentsWithUrl = documents.map((doc: any) => {
        if (!doc.previewUrl) {
          console.warn('[ensureProjectInfo] Document sans previewUrl:', doc.name, doc);
        } else {
          console.log('[ensureProjectInfo] Document avec URL:', doc.name);
        }
        return doc;
      });

      console.log('[ensureProjectInfo] Documents chargés:', documentsWithUrl.length);
      if (documentsWithUrl.length > 0) {
        console.log('[ensureProjectInfo] Premier document:', {
          id: documentsWithUrl[0].id,
          name: documentsWithUrl[0].name,
          hasPreviewUrl: !!documentsWithUrl[0].previewUrl,
          previewUrl: documentsWithUrl[0].previewUrl?.substring(0, 80) + '...'
        });
      }

      setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, info, documents: documentsWithUrl } : p)));
      loadedProjectInfoRef.current.add(projectId);
      bumpInfoVersion(projectId); // ✅ force remount ProjectDetail (sinon son state ne se met pas à jour)
    } catch (e) {
      console.error('[ensureProjectInfo] exception', e);
    } finally {
      loadingProjectInfoRef.current.delete(projectId);
      setIsLoadingProjectInfo(false);
    }
  }, [projects]);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      // ✅ getSession = local, rapide
      const { data } = await supabase.auth.getSession();
      const uid = data.session?.user?.id ?? null;

      if (cancelled) return;

      console.log('[init] getSession result:', uid ? 'user found' : 'no user');
      setUserId(uid);

      // ✅ Charge immédiatement si session disponible
      if (uid) {
        console.log('[init] Chargement projets immédiat...');
        await loadProjects(uid);
      }
    };

    init();

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, session) => {
      const uid = session?.user?.id ?? null;
      console.log('[auth] state change', event, !!uid, 'current loaded uid:', lastLoadedUidRef.current);

      if (cancelled) return;

      setUserId(uid);

      if (uid) {
        // ✅ Toujours charger si :
        // - L'UID a changé (nouvel utilisateur)
        // - OU si les projets n'ont jamais été chargés pour cet UID
        // - OU si c'est INITIAL_SESSION (premier chargement)
        const shouldLoad = 
          lastLoadedUidRef.current !== uid ||
          (event === 'INITIAL_SESSION' && lastLoadedUidRef.current === null);

        if (shouldLoad) {
          console.log('[auth] Chargement projets via onAuthStateChange...');
          await loadProjects(uid);
        } else {
          console.log('[auth] Projets déjà chargés pour cet UID, skip');
        }
      } else {
        // Déconnexion : vider les projets
        console.log('[auth] Déconnexion, vidage projets');
        setProjects([]);
        setSelectedProjectId(null);
        setView('dashboard');
        lastLoadedUidRef.current = null;
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, [loadProjects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) =>
      `${p.firstName} ${p.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [projects, searchQuery]);

  const selectedProject = useMemo(
    () => projects.find((p) => p.id === selectedProjectId),
    [projects, selectedProjectId]
  );

  const handleCreateProject = async (firstName: string, lastName: string, location: string) => {
    console.log('[handleCreateProject] ENTER', { firstName, lastName, location, userId });

    if (!userId) {
      alert('Non connecté (userId absent). Déconnecte-toi puis reconnecte-toi.');
      return;
    }
    if (isCreating) return;

    setIsCreating(true);

    try {
      const insertPromise = supabase
        .from('projects')
        .insert({
          user_id: userId,
          first_name: firstName,
          last_name: lastName,
          location,
          info: EMPTY_INFO
        })
        .select('id, first_name, last_name, location, created_at')
        .single();

      const res = await withTimeout(
        Promise.resolve(insertPromise) as Promise<{ data: any; error: any }>,
        20000,
        'INSERT projects'
      );

      if ((res as any).error) {
        console.error('[handleCreateProject] INSERT error', (res as any).error);
        alert('Erreur création projet: ' + (res as any).error.message);
        return;
      }

      const row = (res as any).data;

      const newProject: Project = {
        id: row.id,
        firstName: row.first_name,
        lastName: row.last_name,
        location: row.location,
        createdAt: row.created_at,
        documents: [],
        info: EMPTY_INFO
      };

      setProjects((prev) => {
        const next = [newProject, ...prev];
        writeCache(userId, next);
        return next;
      });

      setIsCreateModalOpen(false);
    } catch (e: any) {
      console.error('[handleCreateProject] INSERT exception', e);

      if (e?.message?.includes('Timeout')) {
        // fallback : si ça a créé côté serveur mais timeout client
        await loadProjects(userId);
        setIsCreateModalOpen(false);
      } else {
        alert('INSERT erreur: ' + (e?.message ?? String(e)));
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    if (!userId) return;

    console.log('[handleUpdateProject] Début pour projet:', updatedProject.id);
    console.log('[handleUpdateProject] Documents à sauvegarder:', updatedProject.documents.length);

    // Préparer les données à mettre à jour
    const updateData: any = {
      first_name: updatedProject.firstName,
      last_name: updatedProject.lastName,
      location: updatedProject.location,
      info: updatedProject.info
    };

    // Ajouter documents - toujours sauvegarder même si vide
    updateData.documents = updatedProject.documents || [];

    console.log('[handleUpdateProject] Données à mettre à jour:', {
      ...updateData,
      documents_count: updateData.documents.length,
      documents_sample: updateData.documents[0] ? {
        id: updateData.documents[0].id,
        name: updateData.documents[0].name,
        previewUrl: updateData.documents[0].previewUrl?.substring(0, 50) + '...'
      } : null
    });

    // ✅ Mettre à jour n'importe quel projet (pas de filtre user_id)
    const { error } = await supabase
      .from('projects')
      .update(updateData)
      .eq('id', updatedProject.id);

    if (error) {
      console.error('[handleUpdateProject] error', error);
      
      // Si l'erreur est liée à la colonne documents manquante, donner des instructions
      if (error.message?.includes("documents") || error.message?.includes("column")) {
        alert(
          'Erreur: La colonne "documents" n\'existe pas encore dans Supabase.\n\n' +
          'Pour corriger cela, va dans ton dashboard Supabase → SQL Editor et exécute:\n\n' +
          'ALTER TABLE projects ADD COLUMN documents JSONB DEFAULT \'[]\'::jsonb;'
        );
      } else {
        alert('Erreur update projet: ' + error.message);
      }
      return;
    }

    console.log('[handleUpdateProject] ✅ Projet mis à jour avec succès');

    setProjects((prev) => {
      const next = prev.map((p) => (p.id === updatedProject.id ? updatedProject : p));
      writeCache(userId, next);
      return next;
    });

    // Réinitialiser le cache de chargement pour forcer le rechargement au prochain accès
    loadedProjectInfoRef.current.delete(updatedProject.id);

    bumpInfoVersion(updatedProject.id);
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!userId) {
      alert('Non connecté.');
      return;
    }

    try {
      // ✅ Supprimer n'importe quel projet (pas de filtre user_id)
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) {
        console.error('[handleDeleteProject] error', error);
        alert('Erreur suppression projet: ' + error.message);
        return;
      }

      // Retirer le projet de la liste locale
      setProjects((prev) => {
        const next = prev.filter((p) => p.id !== projectId);
        writeCache(userId, next);
        return next;
      });
      
      // Retourner au tableau de bord
      setSelectedProjectId(null);
      setView('dashboard');
      
      console.log('[handleDeleteProject] Projet supprimé avec succès');
    } catch (e: any) {
      console.error('[handleDeleteProject] exception', e);
      alert('Erreur lors de la suppression: ' + (e?.message ?? String(e)));
    }
  };

  const openProject = async (id: string) => {
    setSelectedProjectId(id);
    setView('project-detail');

    // charge info en arrière-plan (non bloquant)
    if (userId) {
      // Ne pas attendre, charger en arrière-plan pour que l'UI soit réactive
      ensureProjectInfo(userId, id).catch(e => {
        console.error('[openProject] Erreur chargement info:', e);
      });
    }
  };

  return (
    <AuthGate>
      <div className="flex h-screen bg-app-light overflow-hidden font-sans">
        <aside className="w-72 bg-white flex flex-col hidden md:flex border-r border-slate-100 shadow-sm z-20">
          <div className="p-8">
            <div className="flex flex-col items-center gap-1">
              <div className="w-full flex justify-start mb-2">
                <img src={LOGO_URL} alt="Yes Conciergerie Logo" className="h-16 object-contain" />
              </div>
              <p className="w-full text-[9px] uppercase tracking-[0.4em] text-slate-400 font-bold pl-1">
                Espace Partenaire
              </p>
            </div>
          </div>

          <nav className="flex-1 px-6 space-y-1.5 mt-4">
            <button
              onClick={() => setView('dashboard')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-yes ${
                view === 'dashboard'
                  ? 'bg-orange-50 text-yes-orange font-bold'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`}
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
                <span className="cursor-pointer hover:text-yes-orange transition-yes" onClick={() => setView('dashboard')}>
                  Dossiers
                </span>

                {view === 'project-detail' && selectedProject && (
                  <>
                    <ChevronRight className="w-3 h-3 text-slate-200" />
                    <span className="font-bold text-slate-800 normal-case tracking-normal text-sm">
                      {selectedProject.firstName} {selectedProject.lastName}
                    </span>
                    {isLoadingProjectInfo && (
                      <span className="ml-3 text-xs font-medium text-slate-400 normal-case tracking-normal">
                        Chargement…
                      </span>
                    )}
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

              <button
                type="button"
                onClick={handleSignOut}
                className="relative z-50 pointer-events-auto flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-100 text-slate-600 rounded-2xl text-xs font-bold transition-yes hover:bg-slate-50 hover:text-yes-orange hover:border-yes-orange/30 shadow-sm"
              >
                Se déconnecter
              </button>

              <button className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-yes-orange transition-yes">
                <Info className="w-5 h-5" />
              </button>
            </div>
          </header>

          <div className="flex-1 overflow-y-auto p-10">
            {view === 'dashboard' ? (
              <>
                {/* ✅ Évite l'écran "Bienvenue" pendant le chargement */}
                {isLoadingProjects && projects.length === 0 ? (
                  <div className="text-slate-400 text-sm font-medium">
                    Chargement des dossiers…
                  </div>
                ) : (
                  <ProjectList
                    projects={filteredProjects}
                    onOpenProject={openProject}
                    onCreateClick={() => setIsCreateModalOpen(true)}
                    onWebhookClick={() => setIsWebhookModalOpen(true)}
                  />
                )}
              </>
            ) : (
              selectedProject && (
                <ProjectDetail
                  key={`${selectedProject.id}:${infoVersion[selectedProject.id] ?? 0}`}
                  project={selectedProject}
                  onUpdateProject={handleUpdateProject}
                  onDeleteProject={handleDeleteProject}
                />
              )
            )}
          </div>
        </main>

        {isCreateModalOpen && (
          <CreateProjectModal
            onClose={() => (isCreating ? null : setIsCreateModalOpen(false))}
            onConfirm={async (firstName: string, lastName: string, location: string) => {
              await handleCreateProject(firstName, lastName, location);
            }}
          />
        )}

        {isWebhookModalOpen && <WebhookModal onClose={() => setIsWebhookModalOpen(false)} />}
        {isResourcesModalOpen && <ResourcesModal onClose={() => setIsResourcesModalOpen(false)} />}
      </div>
    </AuthGate>
  );
};

export default App;
