import { useState, useEffect } from 'react'
import { Download, Folder, File, Image, Code, Layout, Globe, Settings, ChevronDown, ChevronUp, Search } from 'lucide-react'
import { AppData, FolderStructure } from '../types'

export default function Export() {
  const [folders, setFolders] = useState<FolderStructure[]>([])
  const [selectedFolders, setSelectedFolders] = useState<string[]>([])
  const [exportFormat, setExportFormat] = useState<'html' | 'json' | 'markdown'>('html')
  const [exportType, setExportType] = useState<'full' | 'selected'>('full')
  const [template, setTemplate] = useState<'grid' | 'list' | 'cards'>('grid')
  const [includeImages, setIncludeImages] = useState(true)
  const [includeReferralLinks, setIncludeReferralLinks] = useState(true)
  const [includeBonusCodes, setIncludeBonusCodes] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  useEffect(() => {
    // Ładowanie struktur folderów
    fetchFolders()
  }, [])

  const fetchFolders = async () => {
    try {
      setLoading(true)
      setError(null)

      // Symulacja ładowania folderów
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
                  images: ['https://via.placeholder.com/400x200/ff0040/ffffff?text=Image+1'],
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
                  images: ['https://via.placeholder.com/400x200/00ff88/ffffff?text=Web+App'],
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
        }
      ]

      setFolders(mockFolders)
      // Domyślnie zaznacz wszystkie foldery
      const allPaths = getAllFolderPaths(mockFolders)
      setSelectedFolders(allPaths)
    } catch (err) {
      setError('Wystąpił błąd podczas ładowania folderów')
      console.error('Error fetching folders:', err)
    } finally {
      setLoading(false)
    }
  }

  const getAllFolderPaths = (folders: FolderStructure[]): string[] => {
    let paths: string[] = []
    folders.forEach(folder => {
      paths.push(folder.path)
      paths = [...paths, ...getAllFolderPaths(folder.subfolders)]
    })
    return paths
  }

  const getAllApps = (folders: FolderStructure[]): AppData[] => {
    let apps: AppData[] = []
    folders.forEach(folder => {
      apps = [...apps, ...folder.apps]
      apps = [...apps, ...getAllApps(folder.subfolders)]
    })
    return apps
  }

  const countItems = (folder: FolderStructure): number => {
    let count = folder.apps.length
    folder.subfolders.forEach(sub => {
      count += countItems(sub)
    })
    return count
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

  const toggleFolderSelection = (path: string) => {
    if (selectedFolders.includes(path)) {
      setSelectedFolders(selectedFolders.filter(p => p !== path))
    } else {
      setSelectedFolders([...selectedFolders, path])
    }
  }

  const toggleAllSelection = () => {
    const allPaths = getAllFolderPaths(folders)
    if (selectedFolders.length === allPaths.length) {
      setSelectedFolders([])
    } else {
      setSelectedFolders(allPaths)
    }
  }

  const handleExport = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      // Zebranie danych do eksportu
      let appsToExport: AppData[] = []
      
      if (exportType === 'full') {
        appsToExport = getAllApps(folders)
      } else {
        // Tylko zaznaczone foldery
        selectedFolders.forEach(path => {
          const findFolder = (folders: FolderStructure[]): FolderStructure | null => {
            for (const folder of folders) {
              if (folder.path === path) return folder
              const found = findFolder(folder.subfolders)
              if (found) return found
            }
            return null
          }
          
          const folder = findFolder(folders)
          if (folder) {
            appsToExport = [...appsToExport, ...folder.apps]
          }
        })
      }

      // Filtrowanie danych według ustawień
      const filteredApps = appsToExport.map(app => {
        return {
          id: app.id,
          name: app.name,
          description: app.description,
          icon: app.icon,
          images: includeImages ? app.images : [],
          rating: app.rating,
          reviewsCount: app.reviewsCount,
          category: app.category,
          tags: app.tags,
          developer: app.developer,
          version: app.version,
          lastUpdated: app.lastUpdated,
          sourceUrl: app.sourceUrl,
          sourceType: app.sourceType,
          referralLink: includeReferralLinks ? app.referralLink : '',
          bonusCode: includeBonusCodes ? app.bonusCode : '',
          customNotes: app.customNotes,
          folderPath: app.folderPath
        }
      })

      // Symulacja eksportu
      // W rzeczywistej aplikacji:
      // const response = await axios.post('/api/export', {
      //   apps: filteredApps,
      //   format: exportFormat,
      //   template,
      //   includeImages,
      //   includeReferralLinks,
      //   includeBonusCodes
      // })

      // Generowanie pliku
      let content: string
      let filename: string
      let mimeType: string

      switch (exportFormat) {
        case 'json':
          content = JSON.stringify(filteredApps, null, 2)
          filename = `webowaw_export_${new Date().toISOString().split('T')[0]}.json`
          mimeType = 'application/json'
          break
        case 'markdown':
          content = generateMarkdown(filteredApps)
          filename = `webowaw_export_${new Date().toISOString().split('T')[0]}.md`
          mimeType = 'text/markdown'
          break
        case 'html':
        default:
          content = generateHTML(filteredApps, template)
          filename = `webowaw_export_${new Date().toISOString().split('T')[0]}.html`
          mimeType = 'text/html'
          break
      }

      // Pobieranie pliku
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      setSuccess(`Pomyślnie wyeksportowano ${filteredApps.length} aplikacji`)
    } catch (err) {
      setError('Wystąpił błąd podczas eksportu')
      console.error('Error exporting:', err)
    } finally {
      setLoading(false)
    }
  }

  const generateMarkdown = (apps: Partial<AppData>[]): string => {
    let md = `# Kolekcja Aplikacji - Webowaw\n\n`
    md += `*Wygenerowano: ${new Date().toLocaleString('pl-PL')}*\n\n`
    md += `---\n\n`

    apps.forEach((app, index) => {
      md += `## ${index + 1}. ${app.name}\n\n`
      md += `| | |\n`
      md += `|---|---|\n`
      md += `| **Kategoria** | ${app.category || 'N/A'} |\n`
      md += `| **Ocena** | ${app.rating}/5 (${app.reviewsCount} recenzji) |\n`
      md += `| **Wersja** | ${app.version || 'N/A'} |\n`
      md += `| **Developer** | ${app.developer || 'N/A'} |\n`
      md += `| **Ostatnia aktualizacja** | ${app.lastUpdated || 'N/A'} |\n`
      
      if (app.referralLink) {
        md += `| **Link polecający** | [Link](${app.referralLink}) |\n`
      }
      
      if (app.bonusCode) {
        md += `| **Kod bonusowy** | **${app.bonusCode}** |\n`
      }
      
      md += `|\n\n`
      md += `**Opis:**\n\n${app.description || 'Brak opisu'}\n\n`
      
      if (app.tags && app.tags.length > 0) {
        md += `**Tagi:** ${app.tags.join(', ')}\n\n`
      }
      
      if (app.sourceUrl) {
        md += `[🔗 Źródło](${app.sourceUrl})\n\n`
      }
      
      md += `---\n\n`
    })

    return md
  }

  const generateHTML = (apps: Partial<AppData>[], templateType: string): string => {
    const getStarRating = (rating: number | undefined) => {
      if (!rating) return '⭐'.repeat(5)
      const fullStars = Math.floor(rating)
      const hasHalfStar = rating % 1 >= 0.5
      const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
      return '⭐'.repeat(fullStars) + (hasHalfStar ? '½' : '') + '☆'.repeat(emptyStars)
    }

    const appCards = apps.map(app => {
      const starRating = getStarRating(app.rating)
      
      return `
        <div class="app-card" data-category="${app.category || 'other'}">
          <div class="app-icon">
            ${app.icon ? `<img src="${app.icon}" alt="${app.name}" onerror="this.src='data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><rect width=\"100\" height=\"100\" fill=\"%23333\"/><text x=\"50\" y=\"55\" text-anchor=\"middle\" fill=\"%23fff\" font-size=\"40\">📁</text></svg>'">` : '<div class="placeholder-icon">📁</div>'}
          </div>
          <div class="app-info">
            <h3 class="app-name">${app.name}</h3>
            <p class="app-description">${app.description || 'Brak opisu'}</p>
            <div class="app-meta">
              <span class="app-rating">${starRating} (${app.reviewsCount || 0})</span>
              <span class="app-category">${app.category || 'N/A'}</span>
              <span class="app-version">v${app.version || '1.0'}</span>
            </div>
            ${app.tags && app.tags.length > 0 ? `<div class="app-tags">${app.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
            ${app.referralLink ? `<div class="app-referral"><a href="${app.referralLink}" target="_blank" rel="noopener">Link polecający</a></div>` : ''}
            ${app.bonusCode ? `<div class="app-bonus">Kod bonusowy: <strong>${app.bonusCode}</strong></div>` : ''}
            <a href="${app.sourceUrl}" target="_blank" rel="noopener" class="app-source">Źródło</a>
          </div>
        </div>
      `
    }).join('\n')

    const styles = `
      <style>
        :root {
          --bg-primary: #0a0a0a;
          --bg-secondary: #121212;
          --bg-card: #1e1e1e;
          --neon-red: #ff0040;
          --text-primary: #ffffff;
          --text-secondary: #e0e0e0;
          --text-muted: #a0a0a0;
          --border-color: #333333;
        }
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: var(--bg-primary);
          color: var(--text-primary);
          line-height: 1.6;
          padding: 20px;
        }
        
        .container {
          max-width: 1400px;
          margin: 0 auto;
        }
        
        header {
          text-align: center;
          margin-bottom: 40px;
        }
        
        header h1 {
          font-family: 'Arial', sans-serif;
          font-size: 2.5rem;
          color: var(--neon-red);
          margin-bottom: 10px;
        }
        
        header p {
          color: var(--text-muted);
        }
        
        .grid-template {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        
        .list-template {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .cards-template {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }
        
        .app-card {
          background: var(--bg-card);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: 20px;
          transition: all 0.3s ease;
        }
        
        .app-card:hover {
          border-color: var(--neon-red);
          box-shadow: 0 0 20px rgba(255, 0, 64, 0.3);
        }
        
        .app-icon {
          width: 60px;
          height: 60px;
          margin-bottom: 15px;
        }
        
        .app-icon img {
          width: 100%;
          height: 100%;
          border-radius: 12px;
          object-fit: cover;
        }
        
        .placeholder-icon {
          width: 100%;
          height: 100%;
          background: var(--bg-secondary);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        
        .app-info h3 {
          font-size: 1.25rem;
          margin-bottom: 8px;
          color: var(--text-primary);
        }
        
        .app-description {
          color: var(--text-secondary);
          font-size: 0.9rem;
          margin-bottom: 12px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .app-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 12px;
          font-size: 0.85rem;
        }
        
        .app-meta span {
          background: var(--bg-secondary);
          padding: 4px 8px;
          border-radius: 6px;
          color: var(--text-muted);
        }
        
        .app-rating {
          color: #ffd700;
        }
        
        .app-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 12px;
        }
        
        .tag {
          background: var(--bg-secondary);
          border: 1px solid var(--neon-red);
          color: var(--neon-red);
          padding: 2px 8px;
          border-radius: 12px;
          font-size: 0.75rem;
        }
        
        .app-referral a,
        .app-source {
          color: var(--neon-red);
          text-decoration: none;
          font-size: 0.85rem;
          display: inline-block;
          margin-top: 8px;
        }
        
        .app-referral a:hover,
        .app-source:hover {
          text-decoration: underline;
        }
        
        .app-bonus {
          background: rgba(255, 0, 64, 0.1);
          border: 1px solid var(--neon-red);
          color: var(--neon-red);
          padding: 8px;
          border-radius: 8px;
          margin-top: 8px;
          font-size: 0.85rem;
        }
        
        footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid var(--border-color);
          color: var(--text-muted);
        }
        
        @media (max-width: 768px) {
          .grid-template {
            grid-template-columns: 1fr;
          }
        }
      </style>
    `

    const templateClass = templateType === 'grid' ? 'grid-template' : 
                         templateType === 'list' ? 'list-template' : 'cards-template'

    return `
      <!DOCTYPE html>
      <html lang="pl">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Kolekcja Aplikacji - Webowaw</title>
        ${styles}
      </head>
      <body>
        <div class="container">
          <header>
            <h1>Kolekcja Aplikacji</h1>
            <p>Wyeksportowano z Webowaw - ${new Date().toLocaleString('pl-PL')}</p>
          </header>
          
          <div class="${templateClass}">
            ${appCards}
          </div>
          
          <footer>
            <p>Wygenerowano przez <strong>Webowaw</strong> | ${new Date().toLocaleString('pl-PL')}</p>
          </footer>
        </div>
      </body>
      </html>
    `
  }

  const renderFolderTree = (folders: FolderStructure[], depth = 0) => {
    return folders.map(folder => {
      const isExpanded = expandedFolders.has(folder.path)
      const hasSubfolders = folder.subfolders.length > 0
      const isSelected = selectedFolders.includes(folder.path)
      const itemCount = countItems(folder)

      return (
        <div key={folder.path} className="ml-4">
          <div 
            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-colors ${
              isSelected ? 'bg-neon bg-opacity-10 border border-neon' : 'hover:bg-hover'
            }`}
            onClick={() => toggleFolderSelection(folder.path)}
          >
            {hasSubfolders && (
              <button 
                className="p-1 hover:bg-tertiary rounded"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleExpand(folder.path)
                }}
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            )}
            
            <Folder size={18} className={isSelected ? 'text-neon' : 'text-muted'} />
            <span className={`flex-1 ${isSelected ? 'text-neon' : ''}`}>{folder.name}</span>
            <span className="text-sm text-muted">
              {folder.apps.length} app{folder.apps.length !== 1 ? 's' : ''}
              {hasSubfolders && ` + ${itemCount - folder.apps.length} w podfolderach`}
            </span>
            
            <input
              type="checkbox"
              className="w-4 h-4"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation()
                toggleFolderSelection(folder.path)
              }}
              onClick={(e) => e.stopPropagation()}
            />
          </div>

          {hasSubfolders && isExpanded && (
            <div className="ml-4 border-l border-border pl-4">
              {renderFolderTree(folder.subfolders, depth + 1)}
            </div>
          )}
        </div>
      )
    })
  }

  const filteredFolders = folders.filter(folder => 
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div>
      {/* Nagłówek */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="h1 text-3xl mb-2">Eksport danych</h1>
            <p className="text-muted">Wyeksportuj swoją kolekcję aplikacji do różnych formatów</p>
          </div>
        </div>
      </div>

      {/* Kontrolki */}
      <div className="card mb-6">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} />
          <input
            type="text"
            placeholder="Szukaj folderów..."
            className="form-input pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Błąd / Sukces */}
      {error && (
        <div className="alert alert-error mb-6">
          {error}
        </div>
      )}
      
      {success && (
        <div className="alert alert-success mb-6">
          {success}
        </div>
      )}

      {/* Drzewo folderów */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center p-4 border-b border-border">
            <h3 className="h3 text-lg">Wybierz foldery</h3>
            <button
              className="btn btn-secondary btn-sm"
              onClick={toggleAllSelection}
            >
              {selectedFolders.length === getAllFolderPaths(folders).length ? 'Odznacz wszystkie' : 'Zaznacz wszystkie'}
            </button>
          </div>
          
          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="flex items-center gap-2 p-2 rounded bg-secondary mb-2">
              <Folder size={20} className="text-neon" />
              <span className="font-medium">/ (root)</span>
              <span className="text-sm text-muted">
                {getAllApps(folders).length} aplikacji
              </span>
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={selectedFolders.length === getAllFolderPaths(folders).length}
                onChange={toggleAllSelection}
              />
            </div>
            
            {filteredFolders.length > 0 ? (
              renderFolderTree(filteredFolders)
            ) : (
              <p className="text-muted text-center py-8">
                Brak folderów spełniających kryteria
              </p>
            )}
          </div>
          
          <div className="p-4 border-t border-border">
            <p className="text-sm text-muted">
              Wybrano: <strong>{selectedFolders.length}</strong> folder(y)
            </p>
          </div>
        </div>

        {/* Ustawienia eksportu */}
        <div className="card">
          <div className="p-4 border-b border-border">
            <h3 className="h3 text-lg">Ustawienia eksportu</h3>
          </div>
          
          <div className="p-4 space-y-4">
            {/* Typ eksportu */}
            <div>
              <label className="form-label">Typ eksportu</label>
              <div className="flex gap-2">
                <button
                  className={`flex-1 btn ${exportType === 'full' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setExportType('full')}
                >
                  <Globe size={16} className="mr-1" />
                  Cała kolekcja
                </button>
                <button
                  className={`flex-1 btn ${exportType === 'selected' ? 'btn-primary' : 'btn-secondary'}`}
                  onClick={() => setExportType('selected')}
                >
                  <Folder size={16} className="mr-1" />
                  Wybrane foldery
                </button>
              </div>
            </div>

            {/* Format */}
            <div>
              <label className="form-label">Format pliku</label>
              <select
                className="form-select"
                value={exportFormat}
                onChange={(e) => setExportFormat(e.target.value as 'html' | 'json' | 'markdown')}
              >
                <option value="html">HTML (Strona internetowa)</option>
                <option value="json">JSON (Dane strukturalne)</option>
                <option value="markdown">Markdown (Dokumentacja)</option>
              </select>
            </div>

            {/* Szablon (tylko dla HTML) */}
            {exportFormat === 'html' && (
              <div>
                <label className="form-label">Szablon HTML</label>
                <div className="flex gap-2">
                  <button
                    className={`flex-1 btn ${template === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setTemplate('grid')}
                  >
                    <Layout size={16} className="mr-1" />
                    Siatka
                  </button>
                  <button
                    className={`flex-1 btn ${template === 'list' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setTemplate('list')}
                  >
                    <File size={16} className="mr-1" />
                    Lista
                  </button>
                  <button
                    className={`flex-1 btn ${template === 'cards' ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setTemplate('cards')}
                  >
                    <Code size={16} className="mr-1" />
                    Karty
                  </button>
                </div>
              </div>
            )}

            {/* Opcje dodatkowe */}
            <div className="space-y-3">
              <label className="form-label">Opcje dodatkowe</label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={includeImages}
                  onChange={(e) => setIncludeImages(e.target.checked)}
                />
                <Image size={18} className="text-muted" />
                <span>Dołącz obrazki</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={includeReferralLinks}
                  onChange={(e) => setIncludeReferralLinks(e.target.checked)}
                />
                <Link2 size={18} className="text-muted" />
                <span>Dołącz linki polecające</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={includeBonusCodes}
                  onChange={(e) => setIncludeBonusCodes(e.target.checked)}
                />
                <Tag size={18} className="text-muted" />
                <span>Dołącz kody bonusowe</span>
              </label>
            </div>
          </div>
          
          <div className="p-4 border-t border-border">
            <button
              className="btn btn-primary w-full"
              onClick={handleExport}
              disabled={loading || (exportType === 'selected' && selectedFolders.length === 0)}
            >
              {loading ? (
                <>
                  <div className="loading"></div>
                  Eksportowanie...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Eksportuj
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Podgląd */}
      <div className="card mt-6">
        <div className="p-4 border-b border-border">
          <h3 className="h3 text-lg">Podgląd eksportu</h3>
        </div>
        <div className="p-4">
          <p className="text-muted mb-4">
            Wybrano: <strong>{exportType === 'full' ? getAllApps(folders).length : 
              selectedFolders.reduce((acc, path) => {
                const findFolder = (folders: FolderStructure[]): FolderStructure | null => {
                  for (const folder of folders) {
                    if (folder.path === path) return folder
                    const found = findFolder(folder.subfolders)
                    if (found) return found
                  }
                  return null
                }
                const folder = findFolder(folders)
                return acc + (folder ? folder.apps.length : 0)
              }, 0)}
            </strong> aplikacji
          </p>
          
          <div className="bg-secondary rounded p-4 overflow-x-auto">
            <p className="text-sm text-muted">
              Format: <strong>{exportFormat.toUpperCase()}</strong>
              {exportFormat === 'html' && ` | Szablon: ${template}`}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
