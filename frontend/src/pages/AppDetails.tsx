import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, Copy, ExternalLink, Share2, Download, Image, Star, Tag, Link2, Calendar, User, FileText } from 'lucide-react'
import { AppData } from '../types'

export default function AppDetails() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [app, setApp] = useState<AppData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'details' | 'images' | 'export'>('details')

  useEffect(() => {
    // Ładowanie danych aplikacji
    fetchAppDetails()
  }, [id])

  const fetchAppDetails = async () => {
    try {
      setLoading(true)
      setError(null)

      // Symulacja ładowania
      // W rzeczywistej aplikacji: const response = await fetch(`/api/apps/${id}`)
      
      const mockApps: AppData[] = [
        {
          id: '1',
          sourceType: 'playstore',
          sourceUrl: 'https://play.google.com/store/apps/details?id=com.example.app1',
          name: 'Aplikacja Testowa 1',
          description: 'Opis testowej aplikacji numer jeden z Play Store. Ta aplikacja służy do testowania funkcjonalności systemu Webowaw. Można w niej znaleźć wiele przydatnych funkcji i opcji.',
          icon: 'https://via.placeholder.com/100x100/ff0040/ffffff?text=A1',
          images: [
            'https://via.placeholder.com/800x400/ff0040/ffffff?text=Image+1',
            'https://via.placeholder.com/800x400/00ff88/ffffff?text=Image+2',
            'https://via.placeholder.com/800x400/0088ff/ffffff?text=Image+3'
          ],
          rating: 4.5,
          reviewsCount: 1250,
          category: 'Narzędzia',
          tags: ['produktywność', 'organizacja', 'testowa'],
          developer: 'Test Developer',
          version: '1.2.3',
          lastUpdated: '2024-01-15',
          referralLink: 'https://example.com/ref=abc123',
          bonusCode: 'BONUS20',
          customNotes: 'Dobra aplikacja do testów. Sprawdza się w różnych scenariuszach.',
          createdAt: '2024-01-20T10:00:00Z',
          updatedAt: '2024-01-20T10:00:00Z',
          folderPath: '/aplikacje/testowe'
        },
        {
          id: '2',
          sourceType: 'website',
          sourceUrl: 'https://example.com/app2',
          name: 'Web App 2',
          description: 'Aplikacja webowa z własnej strony internetowej. To jest bardziej rozbudowany opis.',
          icon: 'https://via.placeholder.com/100x100/00ff88/ffffff?text=W2',
          images: ['https://via.placeholder.com/800x400/00ff88/ffffff?text=Web+App'],
          rating: 3.8,
          reviewsCount: 450,
          category: 'Web',
          tags: ['online', 'darmowa', 'webowa'],
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

      const foundApp = mockApps.find(a => a.id === id)
      if (foundApp) {
        setApp(foundApp)
      } else {
        setError('Aplikacja nie została znaleziona')
      }
    } catch (err) {
      setError('Wystąpił błąd podczas ładowania danych')
      console.error('Error fetching app details:', err)
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0)
    
    return (
      <div className="stars">
        {Array(fullStars).fill(0).map((_, i) => (
          <span key={`full-${i}`} className="star">★</span>
        ))}
        {hasHalfStar && <span className="star">½</span>}
        {Array(emptyStars).fill(0).map((_, i) => (
          <span key={`empty-${i}`} className="star empty">★</span>
        ))}
      </div>
    )
  }

  const getSourceIcon = () => {
    switch (app?.sourceType) {
      case 'playstore':
        return '📱'
      case 'website':
        return '🌐'
      default:
        return '📁'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // Można dodać toast notification
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="loading"></div>
        <p className="mt-4 text-muted">Ładowanie szczegółów...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="alert alert-error mb-4">{error}</div>
        <Link to="/" className="btn btn-primary">
          <ArrowLeft size={20} />
          Powrót do listy
        </Link>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="text-center py-12">
        <p className="text-muted">Aplikacja nie została znaleziona</p>
        <Link to="/" className="btn btn-primary mt-4">
          Powrót do listy
        </Link>
      </div>
    )
  }

  return (
    <div>
      {/* Nagłówek */}
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
            Wróć
          </button>
          <h1 className="h1 text-2xl md:text-3xl flex-1">{app.name}</h1>
        </div>
        
        {/* Informacje główne */}
        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="flex-shrink-0">
            {app.icon && (
              <img
                src={app.icon}
                alt={app.name}
                className="w-24 h-24 md:w-32 md:h-32 rounded-2xl object-cover"
                onError={(e) => {
                  e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23333"/><text x="50" y="55" text-anchor="middle" fill="%23fff" font-size="40">${encodeURIComponent(getSourceIcon())}</text></svg>`
                }}
              />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-wrap gap-2 mb-2">
              <span className="bg-tertiary px-3 py-1 rounded-full text-sm">{app.category}</span>
              <span className="bg-tertiary px-3 py-1 rounded-full text-sm">
                {getSourceIcon()} {app.sourceType}
              </span>
              <span className="bg-tertiary px-3 py-1 rounded-full text-sm">
                Wersja: {app.version}
              </span>
            </div>
            
            <div className="rating mb-2">
              {renderStars(app.rating)}
              <span className="text-muted ml-2">({app.reviewsCount} recenzji)</span>
            </div>
            
            <p className="text-muted text-sm">
              Ostatnia aktualizacja: {app.lastUpdated}
            </p>
          </div>
          
          <div className="flex gap-2">
            <Link to={`/add?edit=${app.id}`} className="btn btn-secondary">
              <Edit size={20} />
              Edytuj
            </Link>
            <button className="btn btn-danger">
              <Trash2 size={20} />
              Usuń
            </button>
          </div>
        </div>
      </div>

      {/* Nawigacja zakładek */}
      <div className="card mb-6">
        <div className="flex border-b border-border mb-4">
          <button
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'details' 
                ? 'text-neon border-b-2 border-neon' 
                : 'text-muted hover:text-primary'
            }`}
            onClick={() => setActiveTab('details')}
          >
            <FileText size={18} className="inline-block mr-2" />
            Szczegóły
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'images' 
                ? 'text-neon border-b-2 border-neon' 
                : 'text-muted hover:text-primary'
            }`}
            onClick={() => setActiveTab('images')}
          >
            <Image size={18} className="inline-block mr-2" />
            Obrazki
          </button>
          <button
            className={`flex-1 py-3 px-4 text-center font-medium transition-colors ${
              activeTab === 'export' 
                ? 'text-neon border-b-2 border-neon' 
                : 'text-muted hover:text-primary'
            }`}
            onClick={() => setActiveTab('export')}
          >
            <Download size={18} className="inline-block mr-2" />
            Eksport
          </button>
        </div>

        {/* Zakładka Szczegóły */}
        {activeTab === 'details' && (
          <div className="space-y-6">
            {/* Opis */}
            <div>
              <h3 className="h3 text-lg mb-3">
                <FileText size={18} className="inline-block mr-2" />
                Opis
              </h3>
              <p className="text-secondary leading-relaxed">
                {app.description || 'Brak opisu'}
              </p>
            </div>

            {/* Informacje dodatkowe */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3 text-muted">Podstawowe informacje</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-muted" />
                    <span><strong>Developer:</strong> {app.developer || 'Nieznany'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted" />
                    <span><strong>Data utworzenia:</strong> {new Date(app.createdAt).toLocaleDateString('pl-PL')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted" />
                    <span><strong>Ostatnia aktualizacja:</strong> {app.lastUpdated}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link2 size={16} className="text-muted" />
                    <span><strong>Źródło:</strong> 
                      <a href={app.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-neon hover:underline">
                        {app.sourceUrl}
                      </a>
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3 text-muted">Dane dodatkowe</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Star size={16} className="text-muted" />
                    <span><strong>Ocena:</strong> {app.rating}/5 ({app.reviewsCount} recenzji)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-muted" />
                    <span><strong>Kategoria:</strong> {app.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Folder size={16} className="text-muted" />
                    <span><strong>Folder:</strong> {app.folderPath}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Tagi */}
            {app.tags && app.tags.length > 0 && (
              <div>
                <h4 className="font-medium mb-3 text-muted">Tagi</h4>
                <div className="flex flex-wrap gap-2">
                  {app.tags.map((tag, index) => (
                    <span key={index} className="tag tag-neon">{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Link polecający i kod bonusowy */}
            <div className="bg-tertiary rounded-lg p-4">
              <h4 className="font-medium mb-3 text-neon">Link polecający i kod bonusowy</h4>
              
              {app.referralLink && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Link2 size={18} className="text-neon" />
                    <strong>Link polecający:</strong>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="form-input flex-1"
                      value={app.referralLink}
                      readOnly
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => copyToClipboard(app.referralLink || '')}
                    >
                      <Copy size={16} />
                    </button>
                    <a
                      href={app.referralLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                    >
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              )}

              {app.bonusCode && (
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Tag size={18} className="text-neon" />
                    <strong>Kod bonusowy:</strong>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="form-input flex-1"
                      value={app.bonusCode}
                      readOnly
                    />
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => copyToClipboard(app.bonusCode || '')}
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              )}

              {app.customNotes && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText size={18} className="text-neon" />
                    <strong>Notatki:</strong>
                  </div>
                  <p className="text-secondary">{app.customNotes}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Zakładka Obrazki */}
        {activeTab === 'images' && (
          <div>
            <h3 className="h3 text-lg mb-4">Obrazki ({app.images?.length || 0})</h3>
            
            {app.images && app.images.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {app.images.map((image, index) => (
                  <div key={index} className="bg-tertiary rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`Obrazek ${index + 1}`}
                      className="w-full h-64 object-cover"
                      onError={(e) => {
                        e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><rect width="400" height="200" fill="%23333"/><text x="200" y="100" text-anchor="middle" fill="%23fff" font-size="20">Obrazek ${index + 1}</text></svg>`
                      }}
                    />
                    <div className="p-3">
                      <div className="flex gap-2">
                        <button
                          className="btn btn-secondary btn-sm flex-1"
                          onClick={() => copyToClipboard(image)}
                        >
                          <Copy size={14} /> Kopiuj URL
                        </button>
                        <a
                          href={image}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-primary btn-sm flex-1"
                        >
                          <ExternalLink size={14} /> Otwórz
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted text-center py-8">
                Brak obrazków dla tej aplikacji
              </p>
            )}
          </div>
        )}

        {/* Zakładka Eksport */}
        {activeTab === 'export' && (
          <div>
            <h3 className="h3 text-lg mb-4">Eksport danych</h3>
            <p className="text-muted mb-6">
              Wyeksportuj dane tej aplikacji do różnych formatów, które można później użyć do generowania strony internetowej.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Eksport do JSON */}
              <div className="bg-tertiary rounded-lg p-4">
                <h4 className="font-medium mb-3">JSON</h4>
                <p className="text-sm text-muted mb-4">
                  Kompletne dane aplikacji w formacie JSON, gotowe do importu lub przetworzenia.
                </p>
                <button className="btn btn-primary w-full">
                  <Download size={18} />
                  Eksportuj do JSON
                </button>
              </div>

              {/* Eksport do HTML */}
              <div className="bg-tertiary rounded-lg p-4">
                <h4 className="font-medium mb-3">HTML</h4>
                <p className="text-sm text-muted mb-4">
                  Gotowy fragment HTML z kartą aplikacji, który można wstawić na swoją stronę.
                </p>
                <button className="btn btn-primary w-full">
                  <Download size={18} />
                  Eksportuj do HTML
                </button>
              </div>

              {/* Eksport do Markdown */}
              <div className="bg-tertiary rounded-lg p-4">
                <h4 className="font-medium mb-3">Markdown</h4>
                <p className="text-sm text-muted mb-4">
                  Opis aplikacji w formacie Markdown, idealny dla dokumentacji.
                </p>
                <button className="btn btn-primary w-full">
                  <Download size={18} />
                  Eksportuj do Markdown
                </button>
              </div>

              {/* Eksport obrazków */}
              <div className="bg-tertiary rounded-lg p-4">
                <h4 className="font-medium mb-3">Obrazki</h4>
                <p className="text-sm text-muted mb-4">
                  Pobierz wszystkie obrazki związane z aplikacją.
                </p>
                <button className="btn btn-primary w-full">
                  <Image size={18} />
                  Pobierz obrazki
                </button>
              </div>
            </div>

            {/* Podgląd danych JSON */}
            <div className="mt-6 bg-tertiary rounded-lg p-4">
              <h4 className="font-medium mb-3">Podgląd danych JSON</h4>
              <div className="bg-secondary rounded p-4 overflow-x-auto">
                <pre className="text-sm text-muted">
                  {JSON.stringify(app, null, 2)}
                </pre>
              </div>
              <button 
                className="btn btn-secondary btn-sm mt-2"
                onClick={() => copyToClipboard(JSON.stringify(app, null, 2))}
              >
                <Copy size={16} />
                Kopiuj JSON
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
