import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Folder, Plus, Trash2, Edit, Search, ChevronRight, File, MoreVertical } from 'lucide-react'
import { FolderStructure } from '../types'

export default function Folders() {
  const [folders, setFolders] = useState<FolderStructure[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [newFolderName, setNewFolderName] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [showContextMenu, setShowContextMenu] = useState(false)
  const [contextMenuPos, setContextMenuPos] = useState({ x: 0, y: 0 })
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Ładowanie struktur folderów
    fetchFolders()
  }, [])

  const fetchFolders = async () => {
    try {
      setLoading(true)
      setError(null)

      // Symulacja ładowania folderów
      // W rzeczywistej aplikacji: const response = await fetch('/api/folders')
      
      const mockFolders: FolderStructure[] = [
        {
          name: 'aplikacje',
          path: '/aplikacje',
          apps: [],
          subfolders: [
            {
              name: 'testowe',
              path: '/aplikacje/testowe',
              apps: [
                {
                  id: '1',
                  sourceType: 'playstore',
                  sourceUrl: 'https://play.google.com/store/apps/details?id=com.example.app1',
                  name: 'Aplikacja Testowa 1',
                  description: 'Opis testowej aplikacji',
                  icon: 'https://via.placeholder.com/100x100/ff0040/ffffff?text=A1',
                  images: [],
                  rating: 4.5,
                  reviewsCount: 1250,
                  category: 'Narzędzia',
                  tags: ['test'],
                  developer: 'Test Dev',
                  version: '1.0.0',
                  lastUpdated: '2024-01-15',
                  referralLink: 'https://example.com/ref=abc123',
                  bonusCode: 'BONUS20',
                  customNotes: '',
                  createdAt: '2024-01-20T10:00:00Z',
                  updatedAt: '2024-01-20T10:00:00Z',
                  folderPath: '/aplikacje/testowe'
                }
              ],
              subfolders: []
            },
            {
              name: 'webowe',
              path: '/aplikacje/webowe',
              apps: [
                {
                  id: '2',
                  sourceType: 'website',
                  sourceUrl: 'https://example.com/app2',
                  name: 'Web App 2',
                  description: 'Aplikacja webowa',
                  icon: 'https://via.placeholder.com/100x100/00ff88/ffffff?text=W2',
                  images: [],
                  rating: 3.8,
                  reviewsCount: 450,
                  category: 'Web',
                  tags: ['web'],
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
              ],
              subfolders: []
            }
          ]
        },
        {
          name: 'gry',
          path: '/gry',
          apps: [],
          subfolders: []
        },
        {
          name: 'narzedzia',
          path: '/narzedzia',
          apps: [],
          subfolders: []
        }
      ]

      setFolders(mockFolders)
    } catch (err) {
      setError('Wystąpił błąd podczas ładowania folderów')
      console.error('Error fetching folders:', err)
    } finally {
      setLoading(false)
    }
  }

  const toggleExpand = (path: string) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(path)) {
      newExpanded.delete(path)
    } else {
      newExpanded.add(path)
    }
    setExpandedFolders(newExpanded)
  }

  const handleCreateFolder = () => {
    if (!newFolderName.trim() || !selectedFolder) return

    const newPath = `${selectedFolder}/${newFolderName}`
    
    // Aktualizacja struktury folderów
    const updateFolders = (folders: FolderStructure[]): FolderStructure[] => {
      return folders.map(folder => {
        if (folder.path === selectedFolder) {
          return {
            ...folder,
            subfolders: [
              ...folder.subfolders,
              {
                name: newFolderName,
                path: newPath,
                apps: [],
                subfolders: []
              }
            ]
          }
        }
        if (folder.subfolders.length > 0) {
          return {
            ...folder,
            subfolders: updateFolders(folder.subfolders)
          }
        }
        return folder
      })
    }

    setFolders(updateFolders(folders))
    setNewFolderName('')
    setSelectedFolder(null)
    setExpandedFolders(new Set([...expandedFolders, selectedFolder]))
  }

  const handleDeleteFolder = (path: string) => {
    // TODO: Implement folder deletion with confirmation
    console.log('Delete folder:', path)
  }

  const handleRenameFolder = (path: string) => {
    // TODO: Implement folder renaming
    console.log('Rename folder:', path)
  }

  const handleContextMenu = (e: React.MouseEvent, path: string) => {
    e.preventDefault()
    setSelectedFolder(path)
    setContextMenuPos({ x: e.clientX, y: e.clientY })
    setShowContextMenu(true)
  }

  const closeContextMenu = () => {
    setShowContextMenu(false)
    setSelectedFolder(null)
  }

  const countItems = (folder: FolderStructure): number => {
    let count = folder.apps.length
    folder.subfolders.forEach(sub => {
      count += countItems(sub)
    })
    return count
  }

  const renderFolderTree = (folders: FolderStructure[], depth = 0) => {
    return folders.map(folder => {
      const itemCount = countItems(folder)
      const isExpanded = expandedFolders.has(folder.path)
      const hasSubfolders = folder.subfolders.length > 0

      return (
        <div key={folder.path} className="ml-4">
          <div 
            className="flex items-center gap-2 p-2 rounded hover:bg-hover cursor-pointer transition-colors"
            onClick={() => hasSubfolders && toggleExpand(folder.path)}
            onContextMenu={(e) => handleContextMenu(e, folder.path)}
          >
            <div className="flex items-center gap-2 flex-1">
              {hasSubfolders ? (
                <button className="p-1 hover:bg-tertiary rounded">
                  {isExpanded ? <ChevronRight size={16} className="rotate-90" /> : <ChevronRight size={16} />}
                </button>
              ) : (
                <div className="w-6"></div>
              )}
              <Folder size={18} className="text-neon" />
              <span className="flex-1">{folder.name}</span>
              <span className="text-sm text-muted">
                {folder.apps.length} app{folder.apps.length !== 1 ? 's' : ''}
                {hasSubfolders && ` + ${itemCount - folder.apps.length} w podfolderach`}
              </span>
            </div>
          </div>

          {hasSubfolders && isExpanded && (
            <div className="ml-4 border-l border-border pl-4">
              {renderFolderTree(folder.subfolders, depth + 1)}
            </div>
          )}

          {folder.apps.length > 0 && (
            <div className="ml-8">
              {folder.apps.map(app => (
                <Link
                  key={app.id}
                  to={`/app/${app.id}`}
                  className="flex items-center gap-2 p-2 rounded hover:bg-hover transition-colors"
                >
                  {app.icon ? (
                    <img
                      src={app.icon}
                      alt={app.name}
                      className="w-6 h-6 rounded object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect width="24" height="24" fill="%23333"/><text x="12" y="14" text-anchor="middle" fill="%23fff" font-size="12">📁</text></svg>`
                      }}
                    />
                  ) : (
                    <File size={16} className="text-muted" />
                  )}
                  <span className="flex-1 truncate">{app.name}</span>
                  <span className="text-xs text-muted">{app.category}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      )
    })
  }

  const filteredFolders = folders.filter(folder => 
    folder.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    folder.apps.some(app => app.name.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  return (
    <div>
      {/* Nagłówek */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="h1 text-3xl mb-2">Foldery</h1>
            <p className="text-muted">Zarządzaj strukturą folderów i organizuj swoje aplikacje</p>
          </div>
          
          <div className="flex gap-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                setSelectedFolder('/')
                setNewFolderName('')
              }}
            >
              <Plus size={20} />
              Nowy folder
            </button>
          </div>
        </div>
      </div>

      {/* Kontrolki */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input
            type="text"
            placeholder="Szukaj folderów i aplikacji..."
            className="form-input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Błąd */}
      {error && (
        <div className="alert alert-error mb-6">
          {error}
        </div>
      )}

      {/* Ładowanie */}
      {loading && (
        <div className="text-center py-12">
          <div className="loading"></div>
          <p className="mt-4 text-muted">Ładowanie struktur folderów...</p>
        </div>
      )}

      {/* Drzewo folderów */}
      {!loading && (
        <div className="card">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-4 p-2 rounded bg-secondary">
              <Folder size={20} className="text-neon" />
              <span className="font-medium">/ (root)</span>
              <span className="text-sm text-muted">
                {folders.reduce((acc, f) => acc + countItems(f), 0)} aplikacji
              </span>
            </div>
            
            {filteredFolders.length > 0 ? (
              renderFolderTree(filteredFolders)
            ) : (
              <p className="text-muted text-center py-8">
                Brak folderów spełniających kryteria
              </p>
            )}
          </div>
        </div>
      )}

      {/* Tworzenie nowego folderu */}
      {selectedFolder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="card max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="h3 text-lg">Nowy folder</h3>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setSelectedFolder(null)
                  setNewFolderName('')
                }}
              >
                <X size={16} />
              </button>
            </div>
            
            <div className="mb-4">
              <label className="form-label">Lokalizacja</label>
              <p className="text-secondary">{selectedFolder}</p>
            </div>
            
            <div className="mb-6">
              <label className="form-label">Nazwa folderu</label>
              <input
                type="text"
                className="form-input"
                placeholder="Wprowadź nazwę folderu"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFolder()
                }}
              />
            </div>
            
            <div className="flex gap-4">
              <button
                className="btn btn-secondary flex-1"
                onClick={() => {
                  setSelectedFolder(null)
                  setNewFolderName('')
                }}
              >
                Anuluj
              </button>
              <button
                className="btn btn-primary flex-1"
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
              >
                <Plus size={20} />
                Utwórz folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Menu kontekstowe */}
      {showContextMenu && (
        <div
          className="fixed bg-secondary border border-border rounded-lg shadow-lg z-50"
          style={{ 
            top: `${contextMenuPos.y}px`, 
            left: `${contextMenuPos.x}px`,
            minWidth: '200px'
          }}
          onClick={closeContextMenu}
        >
          <button
            className="w-full p-3 text-left hover:bg-hover flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation()
              setNewFolderName('')
              setShowContextMenu(false)
              // Otwórz modal tworzenia folderu
              setSelectedFolder(selectedFolder)
            }}
          >
            <Plus size={16} />
            Nowy folder
          </button>
          <button
            className="w-full p-3 text-left hover:bg-hover flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation()
              handleRenameFolder(selectedFolder || '')
              closeContextMenu()
            }}
          >
            <Edit size={16} />
            Zmień nazwę
          </button>
          <button
            className="w-full p-3 text-left hover:bg-hover flex items-center gap-2 text-red-500"
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteFolder(selectedFolder || '')
              closeContextMenu()
            }}
          >
            <Trash2 size={16} />
            Usuń folder
          </button>
        </div>
      )}
    </div>
  )
}
