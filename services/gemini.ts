
import { GoogleGenAI } from "@google/genai";
import { Project } from "../types";

// Always use named parameter for GoogleGenAI initialization
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProjectSummary = async (project: Project) => {
  // Use gemini-3-flash-preview for general text tasks
  const modelName = 'gemini-3-flash-preview';
  
  const documentsList = project.documents.length > 0 
    ? project.documents.map(d => `- ${d.name}: ${d.content}`).join('\n')
    : "Aucun document importé.";

  const prompt = `
    Agis en tant qu'assistant de conciergerie de luxe et expert en stratégie d'entreprise pour Yes Conciergerie.
    Analyse le dossier confidentiel de ${project.firstName} ${project.lastName} (Localisation: ${project.location}).
    
    INFORMATIONS CLIENT:
    - Métier: ${project.info.profession || 'N/A'}
    - Email: ${project.info.email || 'N/A'}
    - Tel: ${project.info.phone || 'N/A'}
    - Biographie: ${project.info.biography || 'Non renseigné'}
    - Points forts: ${project.info.strengths || 'Non renseigné'}
    - Transcript Appel: ${project.info.callTranscript || 'Aucun transcript fourni'}
    
    OBJECTIFS ET FINANCE:
    - Objectifs: ${project.info.goals || 'Non renseigné'}
    - Commission Conciergerie: ${project.info.conciergeCommission || 'N/A'}%
    - CA Cible Y1: ${project.info.targetRevenueY1 || 'N/A'}
    - CA Cible Y2: ${project.info.targetRevenueY2 || 'N/A'}
    - CA Cible Y3: ${project.info.targetRevenueY3 || 'N/A'}
    - Marge brute cible: ${project.info.targetGrossMargin || 'N/A'}
    
    DOCUMENTS ANALYSÉS:
    ${documentsList}
    
    TRAVAIL DEMANDÉ:
    Génère une note de synthèse de prestige incluant:
    1. Analyse du profil client (incluant son métier) et alignement stratégique avec Yes Conciergerie.
    2. Viabilité de la trajectoire financière, en tenant compte de la commission de conciergerie (${project.info.conciergeCommission || '0'}%).
    3. Synthèse des points clés extraits des documents et du transcript d'appel.
    4. Recommandations haute-performance pour atteindre les objectifs.

    Réponds en français, avec un ton extrêmement professionnel, élégant et confidentiel, fidèle à l'image de marque Yes Conciergerie.
  `;

  try {
    // Correct usage of generateContent with model name and contents
    const response = await ai.models.generateContent({
      model: modelName,
      contents: [{ parts: [{ text: prompt }] }],
    });
    // Use .text property directly
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    throw new Error("Impossible de générer l'analyse Prestige.");
  }
};

export const chatWithAssistant = async (project: Project, history: any[], message: string) => {
  const modelName = 'gemini-3-flash-preview';
  const chat = ai.chats.create({
    model: modelName,
    config: {
      systemInstruction: `Tu es l'assistant de prestige de Yes Conciergerie, dédié au dossier de ${project.firstName} ${project.lastName}. Ton ton est poli, raffiné et efficace.`
    }
  });

  try {
    const response = await chat.sendMessage({ message });
    // Use .text property directly
    return response.text;
  } catch (error) {
    console.error("Chat Error:", error);
    throw new Error("Le service est indisponible.");
  }
};
