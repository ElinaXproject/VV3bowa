// ===== KONFIGURACJA API =====

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// ===== FUNKCJE API =====

export interface ScrapeRequest {
  url: string;
  type: 'website' | 'playstore';
}

export interface SaveRequest {
  appData: any;
  folderPath: string;
}

export interface ExportRequest {
  apps: any[];
  format: 'html' | 'json' | 'markdown';
  template?: string;
  includeImages?: boolean;
  includeReferralLinks?: boolean;
  includeBonusCodes?: boolean;
}

// Sprawdzenie stanu serwera
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return await response.json();
  } catch (error) {
    return { success: false, error: 'Nie można połączyć się z serwerem' };
  }
};

// Pobierz wszystkie aplikacje
export const getApps = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/apps`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching apps:', error);
    return [];
  }
};

// Pobierz pojedynczą aplikację
export const getAppById = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/apps/${id}`);
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error fetching app:', error);
    return null;
  }
};

// Pobierz strukturę folderów
export const getFolders = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/folders`);
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching folders:', error);
    return [];
  }
};

// Scrapowanie danych ze źródła
export const scrapeData = async (request: ScrapeRequest) => {
  try {
    const response = await fetch(`${API_BASE_URL}/scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error scraping:', error);
    return null;
  }
};

// Zapisz aplikację
export const saveApp = async (request: SaveRequest) => {
  try {
    const response = await fetch(`${API_BASE_URL}/apps`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error saving app:', error);
    return null;
  }
};

// Zaktualizuj aplikację
export const updateApp = async (id: string, appData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/apps/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appData }),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error updating app:', error);
    return null;
  }
};

// Usuń aplikację
export const deleteApp = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/apps/${id}`, {
      method: 'DELETE',
    });
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error deleting app:', error);
    return false;
  }
};

// Eksport danych
export const exportData = async (request: ExportRequest) => {
  try {
    const response = await fetch(`${API_BASE_URL}/export`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    const data = await response.json();
    return data.success ? data.data : null;
  } catch (error) {
    console.error('Error exporting:', error);
    return null;
  }
};

// ===== MOCK DATA (dla testów bez backend) =====

// Mock aplikacji
export const mockApps = [
  {
    id: '1',
    sourceType: 'playstore' as const,
    sourceUrl: 'https://play.google.com/store/apps/details?id=com.example.app1',
    name: 'Aplikacja Testowa 1',
    description: 'Opis testowej aplikacji numer jeden z Play Store.',
    icon: 'https://via.placeholder.com/100x100/ff0040/ffffff?text=A1',
    images: ['https://via.placeholder.com/400x200/ff0040/ffffff?text=Image+1'],
    rating: 4.5,
    reviewsCount: 1250,
    category: 'Narzędzia',
    tags: ['produktywność', 'organizacja'],
    developer: 'Test Developer',
    version: '1.2.3',
    lastUpdated: '2024-01-15',
    referralLink: 'https://example.com/ref=abc123',
    bonusCode: 'BONUS20',
    customNotes: 'Dobra aplikacja do testów',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    folderPath: '/aplikacje/testowe'
  },
  {
    id: '2',
    sourceType: 'website' as const,
    sourceUrl: 'https://example.com/app2',
    name: 'Web App 2',
    description: 'Aplikacja webowa z własnej strony internetowej.',
    icon: 'https://via.placeholder.com/100x100/00ff88/ffffff?text=W2',
    images: ['https://via.placeholder.com/400x200/00ff88/ffffff?text=Web+App'],
    rating: 3.8,
    reviewsCount: 450,
    category: 'Web',
    tags: ['online', 'darmowa'],
    developer: 'Web Dev',
    version: '2.0.0',
    lastUpdated: '2024-02-01',
    referralLink: '',
    bonusCode: '',
    customNotes: '',
    createdAt: '2024-02-05T14:30:00Z',
    updatedAt: '2024-02-05T14:30:00Z',
    folderPath: '/aplikacje/webowe'
  }
];

// Mock folderów
export const mockFolders = [
  {
    name: 'aplikacje',
    path: '/aplikacje',
    apps: [],
    subfolders: [
      {
        name: 'testowe',
        path: '/aplikacje/testowe',
        apps: [mockApps[0]],
        subfolders: []
      },
      {
        name: 'webowe',
        path: '/aplikacje/webowe',
        apps: [mockApps[1]],
        subfolders: []
      }
    ]
  },
  {
    name: 'gry',
    path: '/gry',
    apps: [],
    subfolders: []
  }
];
