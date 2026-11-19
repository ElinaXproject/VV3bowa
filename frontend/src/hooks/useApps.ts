import { useState, useEffect, useCallback } from 'react'
import { AppData, FolderStructure } from '../types'
import { getApps, getFolders, saveApp, deleteApp, updateApp, mockApps, mockFolders } from '../utils/api'

export interface UseAppsReturn {
  apps: AppData[]
  folders: FolderStructure[]
  loading: boolean
  error: string | null
  refresh: () => Promise<void>
  addApp: (appData: Partial<AppData>, folderPath: string) => Promise<AppData | null>
  updateApp: (id: string, appData: Partial<AppData>) => Promise<AppData | null>
  removeApp: (id: string) => Promise<boolean>
}

export function useApps(): UseAppsReturn {
  const [apps, setApps] = useState<AppData[]>([])
  const [folders, setFolders] = useState<FolderStructure[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Ładowanie danych
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Próba połączenia z backend
      try {
        const [appsData, foldersData] = await Promise.all([
          getApps(),
          getFolders()
        ])
        
        setApps(appsData || [])
        setFolders(foldersData || [])
      } catch (backendError) {
        console.log('Backend not available, using mock data')
        // Użyj mock data jeśli backend nie działa
        setApps(mockApps)
        setFolders(mockFolders)
      }
    } catch (err) {
      setError('Wystąpił błąd podczas ładowania danych')
      console.error('Error loading data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Odśwież dane
  const refresh = useCallback(async () => {
    await loadData()
  }, [loadData])

  // Inicjalne ładowanie
  useEffect(() => {
    loadData()
  }, [loadData])

  // Dodaj aplikację
  const addApp = useCallback(async (appData: Partial<AppData>, folderPath: string) => {
    try {
      setLoading(true)
      setError(null)

      const newApp = {
        ...appData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        folderPath
      }

      // Próba zapisu do backend
      try {
        const savedApp = await saveApp({
          appData: newApp,
          folderPath
        })
        
        if (savedApp) {
          setApps(prev => [...prev, savedApp])
          return savedApp
        }
      } catch (backendError) {
        console.log('Backend save failed, using local storage')
        // Zapis do localStorage jako fallback
        const currentApps = JSON.parse(localStorage.getItem('webowaw-apps') || '[]')
        currentApps.push(newApp)
        localStorage.setItem('webowaw-apps', JSON.stringify(currentApps))
        
        setApps(prev => [...prev, newApp as AppData])
        return newApp as AppData
      }

      return null
    } catch (err) {
      setError('Wystąpił błąd podczas zapisu aplikacji')
      console.error('Error adding app:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Zaktualizuj aplikację
  const updateApp = useCallback(async (id: string, appData: Partial<AppData>) => {
    try {
      setLoading(true)
      setError(null)

      const updatedData = {
        ...appData,
        updatedAt: new Date().toISOString()
      }

      // Próba aktualizacji w backend
      try {
        const updatedApp = await updateApp(id, updatedData)
        
        if (updatedApp) {
          setApps(prev => prev.map(app => app.id === id ? updatedApp : app))
          return updatedApp
        }
      } catch (backendError) {
        console.log('Backend update failed, using local storage')
        // Aktualizacja w localStorage
        const currentApps = JSON.parse(localStorage.getItem('webowaw-apps') || '[]')
        const index = currentApps.findIndex((app: any) => app.id === id)
        if (index !== -1) {
          currentApps[index] = { ...currentApps[index], ...updatedData }
          localStorage.setItem('webowaw-apps', JSON.stringify(currentApps))
          
          setApps(prev => prev.map(app => app.id === id ? { ...app, ...updatedData } as AppData : app))
          return { ...currentApps[index], ...updatedData }
        }
      }

      return null
    } catch (err) {
      setError('Wystąpił błąd podczas aktualizacji aplikacji')
      console.error('Error updating app:', err)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  // Usuń aplikację
  const removeApp = useCallback(async (id: string) => {
    try {
      setLoading(true)
      setError(null)

      // Próba usunięcia z backend
      try {
        const success = await deleteApp(id)
        
        if (success) {
          setApps(prev => prev.filter(app => app.id !== id))
          return true
        }
      } catch (backendError) {
        console.log('Backend delete failed, using local storage')
        // Usunięcie z localStorage
        const currentApps = JSON.parse(localStorage.getItem('webowaw-apps') || '[]')
        const filteredApps = currentApps.filter((app: any) => app.id !== id)
        localStorage.setItem('webowaw-apps', JSON.stringify(filteredApps))
        
        setApps(prev => prev.filter(app => app.id !== id))
        return true
      }

      return false
    } catch (err) {
      setError('Wystąpił błąd podczas usuwania aplikacji')
      console.error('Error removing app:', err)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    apps,
    folders,
    loading,
    error,
    refresh,
    addApp,
    updateApp,
    removeApp
  }
}
