import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Grid3X3, List, Filter } from 'lucide-react'
import AppCard from '../components/AppCard'
import { AppData } from '../types'

export default function Dashboard() {
  const [apps, setApps] = useState<AppData[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filterCategory, setFilterCategory] = useState('all')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Ładowanie danych z backend
    fetchApps()
  }, [])

  const fetchApps = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Symulacja ładowania danych
      // W rzeczywistej aplikacji: const response = await fetch('/api/apps')
      const mockApps: AppData[] = [
        {
          id: '1',
          sourceType: 'playstore',
          sourceUrl: 'https://play.google.com/store/apps/details?id=com.example.app1',
          name: 'Aplikacja Testowa 1',
          description: 'Opis testowej aplikacji numer jeden z Play Store.',
          icon: 'https://via.placeholder.com/100x100/ff0040/ffffff?text=A1',
          images: ['https://via.placeholder.com/400x200/ff0040/ffffff?text=A1+Image'],
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
          sourceType: 'website',
          sourceUrl: 'https://example.com/app2',
          name: 'Web App 2',
          description: 'Aplikacja webowa z własnej strony internetowej.',
          icon: 'https://via.placeholder.com/100x100/00ff88/ffffff?text=W2',
          images: ['https://via.placeholder.com/400x200/00ff88/ffffff?text=W2+Image'],
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
      ]
      
      setApps(mockApps)
    } catch (err) {
      setError('Wystąpił błąd podczas ładowania aplikacji')
      console.error('Error fetching apps:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesCategory = filterCategory === 'all' || app.category === filterCategory
    
    return matchesSearch && matchesCategory
  })

  const categories = ['all', ...Array.from(new Set(apps.map(app => app.category)))]

  return (
    <div>
      {/* Nagłówek */}
      <div className="mb-8">
        <h1 className="h1 text-3xl mb-2">Panel główny</h1>
        <p className="text-muted">Zarządzaj swoją kolekcją aplikacji</p>
      </div>

      {/* Kontrolki */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="flex-1 flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={20} />
              <input
                type="text"
                placeholder="Szukaj aplikacji..."
                className="form-input pl-10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              className="form-select"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'all' ? 'Wszystkie kategorie' : cat}
                </option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2">
            <button
              className={`btn ${viewMode === 'grid' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('grid')}
              title="Widok siatki"
            >
              <Grid3X3 size={20} />
            </button>
            <button
              className={`btn ${viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setViewMode('list')}
              title="Widok listy"
            >
              <List size={20} />
            </button>
          </div>
          
          <Link to="/add" className="btn btn-primary">
            <Plus size={20} />
            Dodaj aplikację
          </Link>
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
          <p className="mt-4 text-muted">Ładowanie aplikacji...</p>
        </div>
      )}

      {/* Lista aplikacji */}
      {!loading && filteredApps.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted">Brak aplikacji spełniających kryteria</p>
          <Link to="/add" className="btn btn-primary mt-4">
            Dodaj pierwszą aplikację
          </Link>
        </div>
      )}

      {!loading && filteredApps.length > 0 && (
        <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {filteredApps.map(app => (
            <AppCard key={app.id} app={app} viewMode={viewMode} />
          ))}
        </div>
      )}
    </div>
  )
}
