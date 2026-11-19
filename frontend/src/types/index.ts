// ===== TYPY DLA APLIKACJI =====

export interface AppData {
  id: string;
  sourceType: 'website' | 'playstore' | 'manual';
  sourceUrl: string;
  
  // Dane pobrane
  name: string;
  description: string;
  icon: string;
  images: string[];
  rating: number;
  reviewsCount: number;
  category: string;
  tags: string[];
  developer: string;
  version: string;
  lastUpdated: string;
  
  // Dane dodane przez użytkownika
  referralLink: string;
  bonusCode: string;
  customNotes: string;
  
  // Metadane
  createdAt: string;
  updatedAt: string;
  folderPath: string;
}

export interface SourceInput {
  type: 'website' | 'playstore';
  url: string;
}

export interface ScrapedData {
  name?: string;
  description?: string;
  icon?: string;
  images?: string[];
  rating?: number;
  reviewsCount?: number;
  category?: string;
  tags?: string[];
  developer?: string;
  version?: string;
  lastUpdated?: string;
}

export interface UserData {
  referralLink: string;
  bonusCode: string;
  customNotes: string;
}

export interface FolderStructure {
  name: string;
  path: string;
  apps: AppData[];
  subfolders: FolderStructure[];
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ScrapeRequest {
  url: string;
  type: 'website' | 'playstore';
}

export interface SaveRequest {
  appData: AppData;
  folderPath: string;
}

export interface ExportRequest {
  folderPath: string;
  format: 'html' | 'json';
}
