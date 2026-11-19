import { useState, useEffect } from 'react'
import { Settings, Save, Folder, Image, Link2, Tag, Trash2, Info, HelpCircle, Heart } from 'lucide-react'

export default function Settings() {
  const [storagePath, setStoragePath] = useState('/workspace/webowaw-data')
  const [autoSave, setAutoSave] = useState(true)
  const [autoDownloadImages, setAutoDownloadImages] = useState(true)
  const [imageQuality, setImageQuality] = useState<'original' | 'high' | 'medium' | 'low'>('high')
  const [includeReferralLinks, setIncludeReferralLinks] = useState(true)
  const [includeBonusCodes, setIncludeBonusCodes] = useState(true)
  const [defaultCategory, setDefaultCategory] = useState('Inne')
  const [language, setLanguage] = useState('pl')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [showTutorial, setShowTutorial] = useState(true)
  const [version, setVersion] = useState('1.0.0')

  useEffect(() => {
    // Ładowanie ustawień z localStorage
    const savedSettings = localStorage.getItem('webowaw-settings')
    if (savedSettings) {
      const settings = JSON.parse(savedSettings)
      setStoragePath(settings.storagePath || '/workspace/webowaw-data')
      setAutoSave(settings.autoSave !== false)
      setAutoDownloadImages(settings.autoDownloadImages !== false)
      setImageQuality(settings.imageQuality || 'high')
      setIncludeReferralLinks(settings.includeReferralLinks !== false)
      setIncludeBonusCodes(settings.includeBonusCodes !== false)
      setDefaultCategory(settings.defaultCategory || 'Inne')
      setLanguage(settings.language || 'pl')
      setTheme(settings.theme || 'dark')
      setShowTutorial(settings.showTutorial !== false)
    }
  }, [])

  const saveSettings = () => {
    const settings = {
      storagePath,
      autoSave,
      autoDownloadImages,
      imageQuality,
      includeReferralLinks,
      includeBonusCodes,
      defaultCategory,
      language,
      theme,
      showTutorial
    }
    
    localStorage.setItem('webowaw-settings', JSON.stringify(settings))
    
    // Można dodać toast notification
    alert('Ustawienia zostały zapisane!')
  }

  const resetSettings = () => {
    if (window.confirm('Czy na pewno chcesz zresetować wszystkie ustawienia do wartości domyślnych?')) {
      setStoragePath('/workspace/webowaw-data')
      setAutoSave(true)
      setAutoDownloadImages(true)
      setImageQuality('high')
      setIncludeReferralLinks(true)
      setIncludeBonusCodes(true)
      setDefaultCategory('Inne')
      setLanguage('pl')
      setTheme('dark')
      setShowTutorial(true)
      
      localStorage.removeItem('webowaw-settings')
    }
  }

  const clearCache = () => {
    if (window.confirm('Czy na pewno chcesz wyczyścić pamięć podręczną?')) {
      // W rzeczywistej aplikacji: await axios.post('/api/cache/clear')
      localStorage.removeItem('webowaw-cache')
      alert('Pamięć podręczna została wyczyszczona!')
    }
  }

  return (
    <div>
      {/* Nagłówek */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="h1 text-3xl mb-2">Ustawienia</h1>
            <p className="text-muted">Konfiguracja aplikacji Webowaw</p>
          </div>
        </div>
      </div>

      {/* Karty ustawień */}
      <div className="grid gap-6">
        {/* Ogólne */}
        <div className="card">
          <div className="p-4 border-b border-border">
            <h3 className="h3 text-lg flex items-center gap-2">
              <Settings size={20} />
              Ustawienia ogólne
            </h3>
          </div>
          
          <div className="p-4 grid md:grid-cols-2 gap-6">
            <div>
              <label className="form-label">Język</label>
              <select
                className="form-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="pl">Polski</option>
                <option value="en">English</option>
              </select>
            </div>
            
            <div>
              <label className="form-label">Motyw</label>
              <select
                className="form-select"
                value={theme}
                onChange={(e) => setTheme(e.target.value as 'dark' | 'light')}
              >
                <option value="dark">Ciemny (Głęboka czerń + Neonowa czerwień)</option>
                <option value="light">Jasny</option>
              </select>
            </div>
            
            <div>
              <label className="form-label">Domyślna kategoria</label>
              <select
                className="form-select"
                value={defaultCategory}
                onChange={(e) => setDefaultCategory(e.target.value)}
              >
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
            
            <div>
              <label className="form-label">Wersja aplikacji</label>
              <input
                type="text"
                className="form-input"
                value={version}
                readOnly
              />
            </div>
          </div>
        </div>

        {/* Przechowywanie */}
        <div className="card">
          <div className="p-4 border-b border-border">
            <h3 className="h3 text-lg flex items-center gap-2">
              <Folder size={20} />
              Przechowywanie
            </h3>
          </div>
          
          <div className="p-4 grid md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="form-label">Ścieżka katalogu lokalnego</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  className="form-input flex-1"
                  value={storagePath}
                  onChange={(e) => setStoragePath(e.target.value)}
                  placeholder="/ścieżka/do/katalogu"
                />
                <button className="btn btn-secondary">
                  <Folder size={16} />
                  Przeglądaj
                </button>
              </div>
              <p className="text-sm text-muted mt-2">
                Wszystkie dane aplikacji będą przechowywane w tym katalogu
              </p>
            </div>
            
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={autoSave}
                  onChange={(e) => setAutoSave(e.target.checked)}
                />
                <span>Automatyczne zapisywanie</span>
              </label>
              <p className="text-sm text-muted mt-1">
                Automatycznie zapisz dane po pobraniu
              </p>
            </div>
            
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={autoDownloadImages}
                  onChange={(e) => setAutoDownloadImages(e.target.checked)}
                />
                <span>Automatyczne pobieranie obrazków</span>
              </label>
              <p className="text-sm text-muted mt-1">
                Pobieraj wszystkie obrazki podczas scrapowania
              </p>
            </div>
            
            <div>
              <label className="form-label">Jakość obrazków</label>
              <select
                className="form-select"
                value={imageQuality}
                onChange={(e) => setImageQuality(e.target.value as 'original' | 'high' | 'medium' | 'low')}
              >
                <option value="original">Oryginalna</option>
                <option value="high">Wysoka</option>
                <option value="medium">Średnia</option>
                <option value="low">Niska</option>
              </select>
            </div>
          </div>
        </div>

        {/* Linki polecające i kody bonusowe */}
        <div className="card">
          <div className="p-4 border-b border-border">
            <h3 className="h3 text-lg flex items-center gap-2">
              <Tag size={20} />
              Linki polecające i kody bonusowe
            </h3>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={includeReferralLinks}
                  onChange={(e) => setIncludeReferralLinks(e.target.checked)}
                />
                <Link2 size={20} className="text-neon" />
                <span>Włącz obsługę linków polecających</span>
              </label>
              
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={includeBonusCodes}
                  onChange={(e) => setIncludeBonusCodes(e.target.checked)}
                />
                <Tag size={20} className="text-neon" />
                <span>Włącz obsługę kodów bonusowych</span>
              </label>
            </div>
            
            <div className="bg-tertiary rounded p-4 mt-6">
              <h4 className="font-medium mb-2">Informacja</h4>
              <p className="text-sm text-muted">
                Linki polecające i kody bonusowe będą automatycznie dołączane do eksportowanych danych.
                Możesz je wyłączyć, jeśli nie chcesz ich uwzględniać w eksportach.
              </p>
            </div>
          </div>
        </div>

        {/* Pomoc i wsparcie */}
        <div className="card">
          <div className="p-4 border-b border-border">
            <h3 className="h3 text-lg flex items-center gap-2">
              <HelpCircle size={20} />
              Pomoc i wsparcie
            </h3>
          </div>
          
          <div className="p-4">
            <div className="space-y-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={showTutorial}
                  onChange={(e) => setShowTutorial(e.target.checked)}
                />
                <span>Pokaż samouczek przy starcie</span>
              </label>
              
              <button className="btn btn-secondary w-full">
                <HelpCircle size={18} className="mr-2" />
                Otwórz dokumentację
              </button>
              
              <button className="btn btn-secondary w-full">
                <Info size={18} className="mr-2" />
                Sprawdź aktualizacje
              </button>
              
              <button className="btn btn-secondary w-full">
                <Heart size={18} className="mr-2" />
                Wsparcie projektu
              </button>
            </div>
          </div>
        </div>

        {/* Narzędzia systemowe */}
        <div className="card">
          <div className="p-4 border-b border-border">
            <h3 className="h3 text-lg flex items-center gap-2">
              <Settings size={20} />
              Narzędzia systemowe
            </h3>
          </div>
          
          <div className="p-4 grid md:grid-cols-2 gap-4">
            <button
              className="btn btn-secondary"
              onClick={saveSettings}
            >
              <Save size={18} className="mr-2" />
              Zapisz ustawienia
            </button>
            
            <button
              className="btn btn-secondary"
              onClick={resetSettings}
            >
              <Trash2 size={18} className="mr-2" />
              Resetuj ustawienia
            </button>
            
            <button
              className="btn btn-secondary md:col-span-2"
              onClick={clearCache}
            >
              <Trash2 size={18} className="mr-2" />
              Wyczyść pamięć podręczną
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-8 text-center text-muted">
        <p>Webowaw v{version} | Aplikacja do zbierania i organizowania aplikacji</p>
      </div>
    </div>
  )
}
