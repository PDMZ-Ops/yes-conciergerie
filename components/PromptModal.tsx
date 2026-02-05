
import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { X, Copy, Check, Terminal, Key, FileCheck, AlertCircle, Info } from 'lucide-react';

const LOGO_ICON_URL = 'https://i.postimg.cc/hPC0kRrK/logo-Yes.png';

interface PromptModalProps {
  project: Project;
  type: 'EM' | 'DIP';
  onClose: () => void;
}

const PromptModal: React.FC<PromptModalProps> = ({ project, type, onClose }) => {
  const [promptText, setPromptText] = useState('');
  const [copied, setCopied] = useState(false);
  const [showConfirmPopUp, setShowConfirmPopUp] = useState(false);

  useEffect(() => {
    if (type === 'EM') {
      const template = `TU ES : un expert en stratégie, data Airbnb (AirDNA), business plan de conciergerie, et design de présentation premium.

OBJECTIF : Générer un deck “Opportunité de Franchise / Étude de marché LCD” dans le secteur de la conciergerie, ultra-visuel, convaincant, prêt à être envoyé à un prospect.

STYLE : identique aux decks fournis : design moderne, beaucoup d’espace blanc, cartes KPI, icônes minimalistes, accents #df6338, tons premium (blanc, gris clair, noir/anthracite) + couleur d’accent. Utiliser le logo fourni de Yes Conciergerie sur chaque slide (coin haut droit ou haut gauche) de manière discrète.

LANGUE : Francais  

FORMAT DE SORTIE : fichier présentation (PPTX ou Google Slides) + un résumé (1 paragraphe) des insights clés + une liste des hypothèses chiffrées utilisées.

CONTRAINTES : 
- Toutes les métriques doivent provenir de AirBnB, AirDNA ou Booking
- Harmoniser les unités : € / % / nuits / an.
- Mettre en avant les opportunités “Premium” (biens à forte rentabilité), et expliquer l’avantage d’un gestionnaire pro.
- Utiliser les insight “Top Short-term Rentals” de AirDNA
- Si une donnée manque NE PAS inventer : afficher “n/d” et proposer une métrique alternative disponible.
- Proposer des exemples de biens en location réel sur le marché avec photo et indicateurs de rentabilités 

========================
INPUTS VARIABLES (À REMPLIR)
========================
[[Nom_Brand]] = YES Conciergerie
[[Logo_PNG]] = fichier joint
[[Ville_Projet]] = ${project.location || 'n/d'}
[[Region_Projet]] = ${project.location || 'n/d'}
[[Pays]] = France
[[Date_echange]] = ${project.info.exchangeDate || 'n/d'}
[[Prenom_Client]] = ${project.firstName || 'n/d'}
[[Nom_Client]] = ${project.lastName || 'n/d'}
[[Métier_Client]] = ${project.info.profession || 'n/d'}
[[Mini_Bio_Client]] = ${project.info.biography || 'n/d'}
[[Forces_Client]] = ${project.info.strengths || 'n/d'}
[[Objectifs_Client]] = ${project.info.goals || 'n/d'}
[[Transcript_Appel]] = ${project.info.callTranscript || 'n/d'}
[[Budget_disponible_client]] = ${project.info.budget || 'n/d'}
[[Commission_Conciergerie_%]] = ${project.info.conciergeCommission || 'n/d'}
[[Marge_Brute_Cible_%]] = ${project.info.targetGrossMargin || 'n/d'}
[[CA_Cible_Y1]] = ${project.info.targetRevenueY1 || 'n/d'}
[[CA_Cible_Y2]] = ${project.info.targetRevenueY2 || 'n/d'}
[[CA_Cible_Y3]] = ${project.info.targetRevenueY3 || 'n/d'}
[[Contact_Tel]] = 0635490845
[[Contact_Email]] = jvh@yesconciergerie.com

========================
RÈGLES DATA (AIRDNA_JSON)
========================
1) Extraire et/ou calculer :
- Market Score (ou équivalent), et le qualifier (A+, Excellent, etc.)
- Listings actives (total) + évolution YoY si dispo
- Taux d’occupation moyen annuel (%)
- ADR / Prix moyen par nuit (€)
- RevPAR (€)
- Revenu annuel médian / moyen par listing (€)
- Répartition canaux (Airbnb vs autres) (%)
- Typologie biens (studio/T1/T2/T3+ ou chambres) (%)
- Type de logement (entier vs chambre) (%)
- Saisonnalité : courbe mensuelle d’occupation (%) (12 points)
- Durée moyenne de séjour & délai de réservation si dispo
2) Sélectionner 3 “exemples Premium” depuis le JSON (top revenue / top ADR / meilleure perf) :
Pour chacun afficher : nom court (ou “Bien Premium #1”), revenu potentiel annuel, ADR, taux d’occupation, 2–3 attributs différenciants (ex: piscine, vue, design, emplacement).
3) Cohérence : tous les montants en € et arrondis (0 décimales), % arrondis à l’unité.

========================
STRUCTURE DU DECK (15–16 SLIDES)
========================
SLIDE 1 — COUVERTURE (hero)
- Titre : “OPPORTUNITÉ DE FRANCHISE” + [[Ville_Projet]] (grand)
- Sous-titre : promesse (ex: “Votre succès dans un marché en pleine croissance”)
- Badge : [[Region_Projet]] / [[Pays]] + [[Date_Document]]
- Visuel : photo premium de la ville (libre de droits) + logo [[Nom_Brand]]

SLIDE 2 — PROFIL PARTENAIRE (personnalisée)
- “Bienvenue, [[Prenom_Client]]”
- Carte à gauche : prénom + rôle [[Titre_Client]] + mini bio [[Mini_Bio_Client]]
- À droite : 3 blocs “Forces” / “Objectifs” / “Pourquoi ce marché est fait pour vous”
- Ton : valorisant, concret, pas générique.

SLIDE 3 — SCORE & VUE D’ENSEMBLE MARCHÉ
- KPI principal : Market Score + qualificatif
- 3–4 KPI secondaires : demande, croissance, saisonnalité, réglementation (uniquement si présents dans JSON)
- Encadré “Insight” : 2–3 phrases, opportunité clé.

SLIDE 4 — INDICATEURS DE PERFORMANCE (KPIs)
- Cartes : Revenu annuel médian/moyen, Occupation, ADR, RevPAR, Listings actives (+ YoY si dispo)
- Encadré “Opportunité [[Nom_Brand]]” : expliquer comment une gestion pro améliore ADR et occupation.

SLIDE 5 — GÉOGRAPHIE / TERRITOIRE
- Carte stylisée avec cercle de rayon [[Rayon_Intervention_km]] km
- Lister [[Villes_Poles_Attractivite]] + [[Tags_Poles]]
- Chiffre clé : population / bassin si dispo, sinon “Bassin de vie stratégique”.

SLIDE 6 — OFFRE & DEMANDE / CANAUX
- Donut “Airbnb vs autres” + commentaire “dépendance = opportunité multicanal”
- 2 donuts : typologie biens + type de logement (entier vs chambre)
- Bandeau “Opportunité stratégique” : 2–3 lignes (selon [[Angle_Narratif]])

SLIDE 7 — SAISONNALITÉ & COMPORTEMENTS
- Courbe mensuelle d’occupation (12 mois)
- Cartes : durée séjour moyenne + délai réservation (si dispo)
- Encadré “Action [[Nom_Brand]]” : pricing dynamique, comblement des trous, long stay basse saison.

SLIDE 8 — PERFORMANCES PREMIUM (Top rentable)
- 3 cartes “Biens Premium” avec : revenu annuel potentiel, ADR, occupation, 2 attributs.
- Note : “Objectif : cibler des biens [[Fourchette_Revenu_Premium]] €/an” 
  où [[Fourchette_Revenu_Premium]] = calculé depuis JSON (ex: P75–P90) OU fourni manuellement [[Fourchette_Revenu_Premium_Manuelle]].

SLIDE 9 — MODÈLE ÉCONOMIQUE (commission)
- Schéma en 3 étapes :
  1) Revenu propriétaire cible [[Revenu_Proprio_Cible]] €
  2) Commission [[Commission_Conciergerie_%]]% = CA conciergerie
  3) Marge brute cible [[Marge_Brute_Cible_%]]%
- En bas : “Panier moyen / an / bien” + “Effort gestion identique”.

SLIDE 10 — CONCURRENCE IDENTIFIÉE
- Grille logo/noms concurrents depuis [[Concurrents_Locaux_List]] (sinon catégories : indépendants vs plateformes)
- Encardré “Le constat stratégique” : marché fragmenté → place à prendre
- Bloc “Votre avantage” : 3–5 différenciateurs (process, tech, branding, qualité).

SLIDE 11 — PHASE 1 : PRÉVISIONNEL ANNÉE 1
- KPI : CA [[CA_Cible_Y1]] ; Marge brute = [[Marge_Brute_Cible_%]]% → calculer valeur marge €
- Graphique montée en charge mensuelle (barres ou courbe)
- Bloc “Stratégie Année 1” : acquisition portefeuille [[Cible_Portefeuille_Y1]] + qualité + accompagnement.

SLIDE 12 — PHASE 2 : ANNÉE 2
- KPI : CA [[CA_Cible_Y2]] ; marge €
- Graphique trajectoire cumulée ou mensuelle
- Leviers : partenariats, notoriété, structuration équipe, yield.

SLIDE 13 — PHASE 3 : ANNÉE 3
- KPI : CA [[CA_Cible_Y3]] ; marge €
- Graphique domination / régime de croisière
- Objectif : leadership local + éventuellement sous-franchise si pertinent.

SLIDE 14 — “POURQUOI [[Nom_Brand]] ?” (écosystème)
- 4–6 cartes : marque, formation, outils, marketing, réseau, procédures.
- Très visuel, peu de texte.

SLIDE 15 — ROADMAP / PROCHAINES ÉTAPES (90 jours ou 5 étapes)
- Timeline : cadrage → terrain → DIP → signature → formation & lancement
- Inclure un objectif traction (ex: “[[Objectif_Mandats_J90]] mandats à J+90”).

SLIDE 16 — CONCLUSION / CTA
- Récap “Pourquoi ça va marcher” : marché + modèle + profil [[Prenom_Client]]
- CTA : “Prêt à démarrer ?”
- Contact : [[Contact_Tel]] / [[Contact_Email]].

========================
DESIGN & COMPOSITION (OBLIGATOIRE)
========================
- Utiliser une grille claire, cartes arrondies, ombres légères, icônes simples.
- 1 idée forte par slide, pas de paragraphes longs.
- Couleurs : fond blanc, blocs anthracite [[Couleur_Neutre_HEX]] et accent [[Couleur_Principale_HEX]].
- Ajouter des pictos (occupation, € ADR, listings, calendrier, localisation, trophée…).
- Graphiques : lisibles, légendés, axes discrets.
- Images : uniquement libres de droits (ou générées), cohérentes avec la ville/ambiance premium.

========================
SORTIE ATTENDUE
========================
1) Génère la présentation complète (PPTX/Slides) avec ces 15–16 slides.
Chaque slide doit avoir exactement les mêmes dimensions ! 
Tu dois utiliser les ressources fournis en pièce jointes ! 
Aucun texte dne doit être illisible, c’est à dire que le texte doit être contenu dans la slide, il ne doit pas dépasser, et il ne doit pas y avoir d’élément par dessus le texte qui le masque. 

Les instructions données dans la section “SORTIE ATTENDUE” sont absolument obligatoire.`;
      setPromptText(template);
    } else {
      const template = `RÔLE
Tu es une IA experte en création de présentations commerciales + juridiques (DIP – Document d’Information Précontractuelle) pour une franchise de conciergerie premium “YES Conciergerie”.
Ton objectif : transformer une présentation EM (étude de marché locale) en une présentation DIP complète, structurée, cohérente graphiquement et prête à être remise à un candidat franchisé.Sous forme de Powerpoint modifiable

ENTRÉES (fournies en pièces jointes ou en texte)
1) [[EM_SOURCE]] = la présentation EM existante (PDF/PPT) à utiliser comme base de contenu local transmise en pièce jointe
2) [[LOGO_PNG]] = logo du projet / de la franchise (PNG).
3) [[CHARTE_GRAPHIQUE]] = identique aux decks fournis : design moderne, beaucoup d’espace blanc, cartes KPI, icônes minimalistes, accents #df6338, tons premium (blanc, gris clair, noir/anthracite) + couleur d’accent. Utiliser le logo fourni de Yes Conciergerie sur chaque slide (coin haut droit ou haut gauche) de manière discrète.
4) [[ANNEXES_JURIDIQUES]] (optionnel) = {[[KBIS_PDF]], [[RIB_PDF]], [[INPI_MARQUE_PDF]], [[PROJET_CONTRAT_PDF]]}. Si non fourni, ne pas inventer : créer des slides “Annexes à insérer” avec placeholders.

VARIABLES (Remplies avec les données de la fiche client)
- [[DATE_DU_DIP]] : ${new Date().toLocaleDateString('fr-FR')}
- [[VILLE_PROJET]] : ${project.location || 'n/d'}
- [[REGION]] : ${project.location || 'n/d'}
- [[CLIENT_PRENOM]]: ${project.firstName || 'n/d'}
- [[CLIENT_NOM]]: ${project.lastName || 'n/d'}
- [[CLIENT_EMAIL]]: ${project.info.email || 'n/d'}
- [[CLIENT_TEL]]: ${project.info.phone || 'n/d'}
- [[TRANSCRIPT_APPEL]]: ${project.info.callTranscript || 'n/d'}
- [[COMISSION_CONCIERGERIE]]: ${project.info.conciergeCommission || 'n/d'}
- [[CA_CIBLE_Y1]]: ${project.info.targetRevenueY1 || 'n/d'}
- [[CA_CIBLE_Y2]]: ${project.info.targetRevenueY2 || 'n/d'}
- [[CA_CIBLE_Y3]]: ${project.info.targetRevenueY3 || 'n/d'}
- [[MARGE_BRUT_CIBLE]]: ${project.info.targetGrossMargin || 'n/d'}


CONTRAINTES CRITIQUES (INDUSTRIEL)
- Ne JAMAIS inventer des chiffres : tous les KPIs/chiffres doivent venir de [[EM_SOURCE]] ou AirDNA ou AirBnB
  Si une donnée manque : afficher “À confirmer” + placeholder explicite.
- Respecter une mise en page premium, sobre, lisible : 1 idée par slide, peu de texte, beaucoup de visuels (icônes, blocs, graphiques).
- Garder une cohérence totale (couleurs, pictos, titres, footer “YES Conciergerie • X”).
- Produire une présentation 16:9, ~45 à 60 slides (selon densité), avec un SOMMAIRE et une pagination.
- Inclure un bloc “JURIDIQUE / CONTRAT / ENGAGEMENTS CLIENT” (textes standard), et ajouter les annexes fournies sans les altérer.

TRANSFORMATION DEMANDÉE : EM → DIP
1) Extraire de [[EM_SOURCE]] tout le contenu LOCAL :
   - contexte destination (accès, saisonnalité, événements si présents)
   - KPIs marché LCD (market score, revenus, occupation, durée séjour)
   - structure marché / typologie de biens / segments premium
   - concurrence locale + lecture
   - opportunités & positionnement
2) Conserver/adapter les graphiques existants de l’EM (et en recréer si nécessaire à partir de AirBnB/ AirDNA).
3) Ajouter tout le contenu “FRANCHISE / YES” standard pour produire un vrai DIP (pas juste une EM).

STRUCTURE EXACTE ATTENDUE (PLAN DE SLIDES)
A. COUVERTURE & SOMMAIRE
1. Couverture : “YES Conciergerie – DIP – [[VILLE_PROJET]] – [[DATE_DU_DIP]]”
2. Sommaire (10 sections)

B. MARCHÉ CONCIERGERIE (GÉNÉRIQUE – STANDARD)
3. Définition de la conciergerie (LCD)
4. Contexte marché : plateformes + évolutions tourisme + essor conciergerie
5. France destination touristique (chiffres génériques si déjà dans templates ; sinon sans chiffres)
6. Évolution des attentes clients (standards hôteliers, personnalisation, digital, expériences)
7. Secteur attractif & concurrentiel (barrières entrée, pression prix, structuration)
8. Chiffres clés du marché (uniquement si sourcés dans vos templates internes ; sinon “données internes” sans chiffre)
9. Stratégies de différenciation (axes)
10. Segmentation du marché (clients / services)
11. Perspectives d’avenir (IA, durabilité, personnalisation)

C. LA FRANCHISE YES (STANDARD)
12. Définition franchise + 3 piliers (marque / savoir-faire / assistance)
13. Avantages pour le franchisé (6 bénéfices)
14. YES Conciergerie – le concept (entreprise, services complets, optimisation digitale, premium)
15. Profil fondateur (timeline / crédibilité) — utiliser contenu standard si fourni
16. YES “en bref” (chiffres réseau, qualité, différenciation)
17. Concept & services YES (multi-plateforme, pricing, ops, assistance, upsell)

D. MARCHÉ LOCAL [[VILLE_PROJET]] (ISSU EM + AIRDNA)
18. Slide “[[VILLE_PROJET]] – Indicateurs de marché” (Market Score, Rev annuel moyen, TO, durée séjour)
19. “KPIs opérationnels clés” (offre, segment premium, focus)
20. “Typologie des biens” (répartition T1/T2/T3/maisons etc) + ciblage prioritaire
21. “Marché premium / segmentation revenus” (ex: nb logements >25k, >30k, >35k, >65k selon données)
22. “Contexte touristique 2024-2025” (texte local = issu EM ; sinon blocs “destination / saisonnalité / clientèle” sans chiffres)
23. “Concurrence locale” (liste acteurs) + “Analyse concurrentielle – lecture rapide”
24. “Opérateurs & plateformes dominants” (Airbnb/Booking/VRBO : parts si dispo dans JSON ; sinon sans %)
25. “Opportunités prioritaires” (5 axes) — adaptées à la ville
26. “Avantages concurrentiels YES” (EXCLUSIF / PARTENARIAT / EXPERTISE / SUPPORT / QUALITÉ)
27. “Expérience gastronomique Bocuse” (slide storytelling + bénéfices)

E. AIRBNB & OFFRE INTÉGRÉE (STANDARD)
28. “Évolution majeure Airbnb 2024-2025” (ne pas inventer : si pas de source interne, garder le message sans chiffres)
29. “YES – la solution intégrée” (logistique / gastronomique / expériences + bénéfices propriétaires/voyageurs/conciergerie)

F. MODÈLE ÉCONOMIQUE & PROJECTIONS (OBLIGATOIRE)
30. “Modèle économique – Synthèse”
   - Investissement initial [[DROIT_ENTREE]] (si standard : 18 500€ HT, sinon placeholder)
   - Rémunération : [[TAUX_COMMISSION_YES]] du revenu annuel
   - Upsells : [[UPSELL_CIBLE]] (si applicable)
31. “Projections – Année 1”
   - [[CIBLE_LOGEMENTS_A1]] logements ; CA YES estimé ; CA mensuel moyen ; hypothèses (TO, durée séjour)
32. “Projections – Année 2 (Expansion)”
   - [[CIBLE_LOGEMENTS_A2]] ; mention [[ZONE_EXPANSION_A2]] ; croissance vs A1
33. “Projections – Année 3 (Consolidation)”
   - [[CIBLE_LOGEMENTS_A3]] ; objectifs ; consolidation multi-sites
=> Tous les calculs doivent être explicites et traçables : formules affichées en petit (ex: CA = logements × rev_annuel_moyen × commission)

G. PLAN D’ACTION & INVESTISSEMENT (OBLIGATOIRE)
34. “Plan d’action – 12 mois” (3 phases : lancement / accélération / optimisation) + objectifs chiffrés
35. “Ce que vous obtenez avec YES” (exclusivité, formation, plateforme, support, marketing, fichier prospects [[NB_PROSPECTS_IDENTIFIES]], liens SEO, etc.)
36. “Investissement – avant & après démarrage”
   - Tableau : droits d’entrée / options / redevances (si standard, reprendre; sinon placeholders)

H. CONTRAT & CONDITIONS (OBLIGATOIRE)
37. “Prochaines étapes & contact” (parcours client + contacts)
38. “Prochaines étapes pour devenir franchisé” (6 étapes)
39. “Contrat – conditions de résiliation” (texte standard)
40. “Conditions contractuelles – synthèse” (durée 6 ans, renouvellement, exclusivité, cession, formation, assistance)

I. JURIDIQUE – CADRE DIP (OBLIGATOIRE)
41. Slide “JURIDIQUE – Article L.330-3 du Code de commerce” (texte standard)
42. Slide “JURIDIQUE – Article R.330-1 du Code de commerce” (texte standard)

J. ANNEXES & ENGAGEMENTS CLIENT (OBLIGATOIRE)
43. Annexes : KBIS (si fourni) sinon placeholder
44. Annexes : RIB (si fourni) sinon placeholder
45. Annexes : INPI / marque (si fourni) sinon placeholder
46. “Client franchisé & engagements (confidentialité / restitution / signature)”
   - Remplir avec infos [[CLIENT_*]] + [[VILLE_PROJET]] / [[ZONE_COUVERTE]]
47. “Clôture & contact” (récap + next steps + contacts + mention “Document confidentiel - Ne pas diffuser”)

RÈGLES DE RÉDACTION & DESIGN
- Titres courts, orientés bénéfice (“Potentiel premium”, “Opportunité YES”, “Positionnement stratégique”).
- Style “premium” : fonds clairs, blocs arrondis, icônes monochromes, accents couleur [[COULEUR_ACCENT_HEX]].
- Graphiques : 1 graphique / slide max ; légendes simples ; unités visibles ; source indiquée (“Source : AirDNA – retraité, logements entiers uniquement” si applicable).
- Harmoniser les noms : “YES Conciergerie”, “location courte durée (LCD)”, “yield management”.

SORTIE ATTENDUE
Génère la présentation DIP complète. 
Chaque slide doit avoir les mêmes dimensions (hauteur largeur) 
Aucun texte ne doit être illisible (coupé, un élément par dessus, sort du slide)
Ces 2 dernières indications sont obligatoire ! 
Utilise les documents fournis en pièce jointes !
Si des éléments obligatoires manquent (chiffres, annexes), conserve la slide mais mets un placeholder explicite “À FOURNIR” sans inventer.`;
      setPromptText(template);
    }
  }, [project, type]);

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setShowConfirmPopUp(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const Icon = type === 'EM' ? Terminal : FileCheck;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 animate-in fade-in duration-300">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-5xl h-[85vh] rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-12 duration-500">
        <header className="px-10 py-8 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center overflow-hidden`}>
              <img src={LOGO_ICON_URL} alt="Yes" className="w-full h-full object-contain" />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">Prompt {type}</h3>
              <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 mt-1 font-bold">Génération Stratégique Yes Conciergerie</p>
            </div>
          </div>
          <button onClick={onClose} className="w-12 h-12 rounded-2xl hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-yes flex items-center justify-center">
            <X size={24} />
          </button>
        </header>

        <div className="flex-1 p-10 overflow-hidden flex flex-col gap-6">
          <div className="flex items-center gap-2 text-slate-500 text-sm italic">
            <Key size={16} className="text-yes-orange" />
            Ce prompt a été personnalisé avec les données de <span className="font-bold text-slate-800">{project.firstName} {project.lastName}</span>.
          </div>
          
          <textarea
            value={promptText}
            onChange={(e) => setPromptText(e.target.value)}
            className="flex-1 w-full p-8 bg-slate-50 border border-slate-100 rounded-[2rem] outline-none focus:ring-4 focus:ring-orange-50 focus:border-yes-orange transition-yes font-mono text-sm leading-relaxed text-slate-700 resize-none shadow-inner"
            placeholder="Éditez le prompt ici..."
          />
        </div>

        <footer className="px-10 py-8 bg-white border-t border-slate-100 flex items-center justify-between">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Copiez ce prompt pour votre assistant IA préféré.</p>
          <div className="flex items-center gap-4">
            <button 
              onClick={onClose}
              className="px-8 py-4 text-slate-400 text-xs font-bold uppercase tracking-widest rounded-2xl hover:bg-slate-50 transition-yes"
            >
              Fermer
            </button>
            <button 
              onClick={handleCopy}
              className={`flex items-center gap-3 px-10 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-yes shadow-lg ${copied ? 'bg-green-500 text-white shadow-green-100' : (type === 'EM' ? 'bg-yes-orange' : 'bg-slate-900') + ' text-white shadow-orange-100 hover:scale-[1.02]'}`}
            >
              {copied ? <Check size={18} /> : <Copy size={18} />}
              {copied ? 'Copié !' : 'Copier le Prompt'}
            </button>
          </div>
        </footer>

        {/* Confirmation Pop-up Overlay */}
        {showConfirmPopUp && (
          <div className="absolute inset-0 z-[110] flex items-center justify-center p-8 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-300 text-center">
              <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center text-yes-orange mx-auto mb-8 shadow-inner">
                <Check size={40} className="animate-bounce" />
              </div>
              <h4 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-4">Prompt Copié !</h4>
              <p className="text-slate-500 font-medium leading-relaxed mb-8">
                Votre Prompt a bien été copié, pensez maintenant à récupérer les ressources avant de lancer votre génération.
              </p>
              <button 
                onClick={() => setShowConfirmPopUp(false)}
                className="w-full py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-yes-orange transition-yes shadow-xl"
              >
                Compris, merci
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptModal;
