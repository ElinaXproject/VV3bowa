import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, Search, Plus, X, Loader2, Link2, Tag, Image, Star } from 'lucide-react'
import { AppData, ScrapedData } from '../types'
import axios from 'axios'

export default function AddApp() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [sourceType, setSourceType] = useState<'website' | 'playstore'>('website')
  const [url, setUrl] = useState('')
  const [scrapedData, setScrapedData] = useState<ScrapedData | null>(null)
  const [appData, setAppData] = useState<Partial<AppData>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [folderPath, setFolderPath] = useState('/aplikacje')
  const [availableFolders, setAvailableFolders] = useState<string[]>([])
  const [newFolderName, setNewFolderName] = useState('')
  const [showFolderInput, setShowFolderInput] = useState(false)

  // Ładowanie dostępnych folderów
  useEffect(() => {
    // Symulacja ładowania folderów
    const mockFolders = [
      '/aplikacje',
      '/aplikacje/testowe',
      '/aplikacje/webowe',
      '/aplikacje/mobile',
      '/gry',
      '/narzedzia'
    ]
    setAvailableFolders(mockFolders)
  }, [])

  const handleScrape = async () => {
    if (!url.trim()) {
      setError('Proszę podać URL')
      return
    }

    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      // Symulacja pobierania danych
      // W rzeczywistej aplikacji:
      // const response = await axios.post('/api/scrape', { url, type: sourceType })
      // setScrapedData(response.data.data)

      // Mock data
      const mockData: ScrapedData = {
        name: sourceType === 'playstore' ? 'Aplikacja z Play Store' : 'Strona Webowa',
        description: `Opis aplikacji pobrany z ${sourceType === 'playstore' ? 'Play Store' : 'strony internetowej'}. To jest przykładowy opis.`,
        icon: sourceType === 'playstore' 
          ? 'https://via.placeholder.com/100x100/ff0040/ffffff?text=PS'
          : 'https://via.placeholder.com/100x100/00ff88/ffffff?text=WWW',
        images: [
          'https://via.placeholder.com/400x200/ff0040/ffffff?text=Image+1',
          'https://via.placeholder.com/400x200/00ff88/ffffff?text=Image+2'
        ],
        rating: sourceType === 'playstore' ? 4.2 : 3.8,
        reviewsCount: sourceType === 'playstore' ? 1500 : 800,
        category: sourceType === 'playstore' ? 'Narzędzia' : 'Web',
        tags: ['test', 'przykład', sourceType],
        developer: sourceType === 'playstore' ? 'Google LLC' : 'Web Developer',
        version: '1.0.0',
        lastUpdated: new Date().toISOString().split('T')[0]
      }

      setScrapedData(mockData)
      setAppData({
        ...mockData,
        sourceType,
        sourceUrl: url,
        referralLink: '',
        bonusCode: '',
        customNotes: '',
        folderPath
      })
      
      setStep(2)
    } catch (err) {
      setError('Wystąpił błąd podczas pobierania danych. Spróbuj ponownie.')
      console.error('Error scraping:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)

      // Walidacja
      if (!appData.name?.trim()) {
        setError('Nazwa aplikacji jest wymagana')
        return
      }

      // Symulacja zapisu
      // W rzeczywistej aplikacji:
      // const response = await axios.post('/api/apps', {
      //   appData: {
      //     ...appData,
      //     id: Date.now().toString(),
      //     createdAt: new Date().toISOString(),
      //     updatedAt: new Date().toISOString()
      //   },
      //   folderPath
      // })

      setSuccess('Aplikacja została pomyślnie zapisana!')
      
      // Reset i powrót do dashboard
      setTimeout(() => {
        navigate('/')
      }, 2000)
    } catch (err) {
      setError('Wystąpił błąd podczas zapisu aplikacji.')
      console.error('Error saving:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleFolderChange = (folder: string) => {
    setFolderPath(folder)
    setShowFolderInput(false)
    setNewFolderName('')
  }

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) return
    
    const newPath = `${folderPath}/${newFolderName}`
    setAvailableFolders([...availableFolders, newPath])
    setFolderPath(newPath)
    setShowFolderInput(false)
    setNewFolderName('')
  }

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex gap-4">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex flex-col items-center">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 ${
              step >= s ? 'bg-neon text-white border-neon' : 'bg-secondary border-border text-muted'
            }`}>
              {step > s ? '✓' : s}
            </div>
            <span className={`text-sm mt-2 ${step >= s ? 'text-neon' : 'text-muted'}`}>
              {s === 1 ? 'Źródło' : s === 2 ? 'Dane' : 'Zapis'}
            </span>
          </div>
        ))}
      </div>
    </div>
  )

  const renderStep1 = () => (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <h2 className="h2 text-xl mb-6">Wybierz źródło</h2>
        
        {/* Wybór typu źródła */}
        <div className="mb-6">
          <label className="form-label">Typ źródła</label>
          <div className="flex gap-4">
            <button
              className={`flex-1 btn ${sourceType === 'website' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSourceType('website')}
            >
              <span className="block mb-1">🌐</span>
              Strona WWW
            </button>
            <button
              className={`flex-1 btn ${sourceType === 'playstore' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSourceType('playstore')}
            >
              <span className="block mb-1">📱</span>
              Play Store
            </button>
          </div>
        </div>

        {/* URL */}
        <div className="mb-6">
          <label className="form-label">URL</label>
          <div className="relative">
            <input
              type="url"
              placeholder={sourceType === 'website' 
                ? 'https://przykladowa-strona.pl' 
                : 'https://play.google.com/store/apps/details?id=com.example.app'}
              className="form-input"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
          </div>
          <p className="text-sm text-muted mt-2">
            {sourceType === 'website' 
              ? 'Wprowadź adres strony internetowej' 
              : 'Wprowadź link do aplikacji w Google Play Store'}
          </p>
        </div>

        {/* Przykładowe URL-e */}
        <div className="mb-6">
          <p className="text-sm text-muted mb-2">Przykładowe URL-e:</p>
          <div className="flex flex-wrap gap-2">
            {sourceType === 'website' ? (
              <>
                <button 
                  className="btn btn-secondary btn-sm text-xs"
                  onClick={() => setUrl('https://example.com')}
                >
                  https://example.com
                </button>
                <button 
                  className="btn btn-secondary btn-sm text-xs"
                  onClick={() => setUrl('https://github.com')}
                >
                  https://github.com
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn btn-secondary btn-sm text-xs"
                  onClick={() => setUrl('https://play.google.com/store/apps/details?id=com.whatsapp')}
                >
                  WhatsApp
                </button>
                <button 
                  className="btn btn-secondary btn-sm text-xs"
                  onClick={() => setUrl('https://play.google.com/store/apps/details?id=com.spotify.music')}
                >
                  Spotify
                </button>
              </>
            )}
          </div>
        </div>

        {/* Akcje */}
        <div className="flex gap-4">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/')}
          >
            Anuluj
          </button>
          <button 
            className="btn btn-primary flex-1"
            onClick={handleScrape}
            disabled={loading || !url.trim()}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Pobieranie...
              </>
            ) : (
              <>
                <Search size={20} />
                Pobierz dane
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  const renderStep2 = () => (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="h2 text-xl">Edytuj dane</h2>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setStep(1)}
          >
            <X size={16} /> Wróć
          </button>
        </div>

        {/* Podgląd ikony */}
        {appData.icon && (
          <div className="text-center mb-6">
            <img
              src={appData.icon}
              alt="Ikona aplikacji"
              className="w-24 h-24 rounded-2xl mx-auto"
              onError={(e) => {
                e.currentTarget.src = `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><rect width="100" height="100" fill="%23333"/><text x="50" y="55" text-anchor="middle" fill="%23fff" font-size="40">📁</text></svg>`
              }}
            />
            <button 
              className="btn btn-secondary btn-sm mt-2"
              onClick={() => setAppData({...appData, icon: ''})}
            >
              <X size={14} /> Usuń ikonę
            </button>
          </div>
        )}

        {/* Formularz */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Nazwa */}
          <div>
            <label className="form-label">Nazwa *</label>
            <input
              type="text"
              className="form-input"
              value={appData.name || ''}
              onChange={(e) => setAppData({...appData, name: e.target.value})}
              placeholder="Nazwa aplikacji"
            />
          </div>

          {/* Kategoria */}
          <div>
            <label className="form-label">Kategoria</label>
            <select
              className="form-select"
              value={appData.category || ''}
              onChange={(e) => setAppData({...appData, category: e.target.value})}
            >
              <option value="">Wybierz kategorię</option>
              <option value="Narzędzia">Narzędzia</option>
              <option value="Gry">Gry</option>
              <option value="Społeczność">Społeczność</option>
              <option value="Produktywność">Produktywność</option>
              <option value="Edukacja">Edukacja</option>
              <option value="Zdrowie">Zdrowie</option>
              <option value="Finanse">Finanse</option>
              <option value="Web">Web</option>
              <option value="Inne">Inne</option>
            </select>
          </div>

          {/* Opis */}
          <div className="md:col-span-2">
            <label className="form-label">Opis</label>
            <textarea
              className="form-textarea"
              value={appData.description || ''}
              onChange={(e) => setAppData({...appData, description: e.target.value})}
              placeholder="Opis aplikacji"
            />
          </div>

          {/* Ocena */}
          <div>
            <label className="form-label">Ocena</label>
            <input
              type="number"
              className="form-input"
              value={appData.rating || ''}
              onChange={(e) => setAppData({...appData, rating: parseFloat(e.target.value) || 0})}
              min="0"
              max="5"
              step="0.1"
              placeholder="0.0 - 5.0"
            />
          </div>

          {/* Liczba recenzji */}
          <div>
            <label className="form-label">Liczba recenzji</label>
            <input
              type="number"
              className="form-input"
              value={appData.reviewsCount || ''}
              onChange={(e) => setAppData({...appData, reviewsCount: parseInt(e.target.value) || 0})}
              placeholder="0"
            />
          </div>

          {/* Wersja */}
          <div>
            <label className="form-label">Wersja</label>
            <input
              type="text"
              className="form-input"
              value={appData.version || ''}
              onChange={(e) => setAppData({...appData, version: e.target.value})}
              placeholder="1.0.0"
            />
          </div>

          {/* Data aktualizacji */}
          <div>
            <label className="form-label">Data aktualizacji</label>
            <input
              type="date"
              className="form-input"
              value={appData.lastUpdated || ''}
              onChange={(e) => setAppData({...appData, lastUpdated: e.target.value})}
            />
          </div>

          {/* Developer */}
          <div className="md:col-span-2">
            <label className="form-label">Developer</label>
            <input
              type="text"
              className="form-input"
              value={appData.developer || ''}
              onChange={(e) => setAppData({...appData, developer: e.target.value})}
              placeholder="Nazwa developera"
            />
          </div>

          {/* Tagi */}
          <div className="md:col-span-2">
            <label className="form-label">Tagi</label>
            <div className="flex flex-wrap gap-2 mb-2">
              {appData.tags?.map((tag, index) => (
                <span key={index} className="tag tag-neon">
                  {tag}
                  <button 
                    className="ml-1 text-xs hover:text-neon"
                    onClick={() => setAppData({
                      ...appData, 
                      tags: appData.tags?.filter((_, i) => i !== index)
                    })}
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                className="form-input flex-1"
                placeholder="Dodaj tag"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    setAppData({
                      ...appData,
                      tags: [...(appData.tags || []), e.currentTarget.value.trim()]
                    })
                    e.currentTarget.value = ''
                  }
                }}
              />
              <button
                className="btn btn-secondary"
                onClick={() => {
                  const input = document.querySelector('input[placeholder="Dodaj tag"]') as HTMLInputElement
                  if (input?.value.trim()) {
                    setAppData({
                      ...appData,
                      tags: [...(appData.tags || []), input.value.trim()]
                    })
                    input.value = ''
                  }
                }}
              >
                <Plus size={16} />
              </button>
            </div>
          </div>

          {/* Link polecający */}
          <div className="md:col-span-2">
            <label className="form-label">
              Link polecający (opcjonalny)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                className="form-input flex-1"
                value={appData.referralLink || ''}
                onChange={(e) => setAppData({...appData, referralLink: e.target.value})}
                placeholder="https://partner.example.com/ref=abc123"
              />
              <button
                className="btn btn-secondary"
                onClick={() => {
                  const input = document.querySelector('input[placeholder*="polecający"]') as HTMLInputElement
                  if (input?.value.trim()) {
                    navigator.clipboard.writeText(input.value)
                  }
                }}
              >
                <Link2 size={16} />
              </button>
            </div>
          </div>

          {/* Kod bonusowy */}
          <div className="md:col-span-2">
            <label className="form-label">
              Kod bonusowy / Kod rabatowy (opcjonalny)
            </label>
            <input
              type="text"
              className="form-input"
              value={appData.bonusCode || ''}
              onChange={(e) => setAppData({...appData, bonusCode: e.target.value})}
              placeholder="Wprowadź kod (np. BONUS20, WEBOWAW10)"
            />
          </div>

          {/* Notatki */}
          <div className="md:col-span-2">
            <label className="form-label">Notatki</label>
            <textarea
              className="form-textarea"
              value={appData.customNotes || ''}
              onChange={(e) => setAppData({...appData, customNotes: e.target.value})}
              placeholder="Dodatkowe notatki i uwagi"
            />
          </div>
        </div>

        {/* Akcje */}
        <div className="flex gap-4 mt-8">
          <button 
            className="btn btn-secondary"
            onClick={() => setStep(1)}
          >
            Wróć
          </button>
          <button 
            className="btn btn-primary flex-1"
            onClick={() => setStep(3)}
            disabled={!appData.name?.trim()}
          >
            Dalej
          </button>
        </div>
      </div>
    </div>
  )

  const renderStep3 = () => (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h2 className="h2 text-xl">Wybierz folder i zapisz</h2>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={() => setStep(2)}
          >
            <X size={16} /> Wróć
          </button>
        </div>

        {/* Folder */}
        <div className="mb-6">
          <label className="form-label">Folder docelowy</label>
          <div className="relative">
            <select
              className="form-select"
              value={folderPath}
              onChange={(e) => setFolderPath(e.target.value)}
            >
              {availableFolders.map(folder => (
                <option key={folder} value={folder}>{folder}</option>
              ))}
            </select>
          </div>
          
          <div className="flex gap-2 mt-2">
            <button
              className="btn btn-secondary btn-sm flex-1"
              onClick={() => setShowFolderInput(!showFolderInput)}
            >
              <Plus size={16} />
              Nowy folder
            </button>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => {
                const parts = folderPath.split('/').filter(p => p)
                if (parts.length > 0) {
                  setFolderPath('/' + parts.slice(0, -1).join('/'))
                }
              }}
              disabled={folderPath === '/'}
            >
              <ChevronUp size={16} />
            </button>
          </div>

          {/* Nowy folder */}
          {showFolderInput && (
            <div className="flex gap-2 mt-2">
              <input
                type="text"
                className="form-input flex-1"
                placeholder="Nazwa nowego folderu"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateFolder()
                }}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
              >
                <Plus size={16} />
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setShowFolderInput(false)
                  setNewFolderName('')
                }}
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Podsumowanie */}
        <div className="bg-tertiary rounded-lg p-4 mb-6">
          <h3 className="h3 text-lg mb-4">Podsumowanie</h3>
          <div className="space-y-2">
            <p><strong>Nazwa:</strong> {appData.name}</p>
            <p><strong>Kategoria:</strong> {appData.category || 'Nie określono'}</p>
            <p><strong>Ocena:</strong> {appData.rating ? `${appData.rating}/5` : 'Nie określono'}</p>
            <p><strong>Link polecający:</strong> {appData.referralLink || 'Brak'}</p>
            <p><strong>Kod bonusowy:</strong> {appData.bonusCode || 'Brak'}</p>
            <p><strong>Folder:</strong> {folderPath}</p>
          </div>
        </div>

        {/* Akcje */}
        {error && (
          <div className="alert alert-error mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="alert alert-success mb-4">
            {success}
          </div>
        )}

        <div className="flex gap-4">
          <button 
            className="btn btn-secondary"
            onClick={() => setStep(2)}
          >
            Wróć
          </button>
          <button 
            className="btn btn-primary flex-1"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Zapisyanie...
              </>
            ) : (
              <>
                <Plus size={20} />
                Zapisz aplikację
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {/* Wskaźnik kroku */}
      {renderStepIndicator()}

      {/* Błąd */}
      {error && step !== 3 && (
        <div className="alert alert-error mb-6">
          {error}
        </div>
      )}

      {/* Kroki */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}
    </div>
  )
}
