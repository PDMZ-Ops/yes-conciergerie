
export interface ProjectDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
  content?: string; // Simulated text content for AI processing
  previewUrl?: string; // URL pour la prévisualisation du document
}

export interface ProjectInfo {
  email: string;
  phone: string;
  profession: string;
  conciergeCommission: string;
  exchangeDate: string;
  strengths: string;
  biography: string;
  goals: string;
  targetRevenueY1: string;
  targetRevenueY2: string;
  targetRevenueY3: string;
  targetGrossMargin: string;
  callTranscript: string; // Nouveau champ pour le transcript de l'appel
  description: string; // Keeping for compatibility
  budget: string; // Keeping for compatibility
  deadline: string; // Keeping for compatibility
  notes: string; // Keeping for compatibility
}

export interface Project {
  id: string;
  firstName: string;
  lastName: string;
  location: string;
  createdAt: string;
  info: ProjectInfo;
  documents: ProjectDocument[];
}

export type ViewState = 'dashboard' | 'project-detail';
