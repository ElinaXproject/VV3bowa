# 🎉 Webowaw - Kompletny Przewodnik Projektu

## 📖 Spis Treści

1. [O projekcie](#-o-projekcie)
2. [Struktura projektu](#-struktura-projektu)
3. [Technologie](#-technologie)
4. [Funkcjonalności](#-funkcjonalności)
5. [Instalacja i uruchomienie](#-instalacja-i-uruchomienie)
6. [Konfiguracja](#-konfiguracja)
7. [API](#-api)
8. [Przykłady użycia](#-przykłady-użycia)
9. [Rozwiązywanie problemów](#-rozwiązywanie-problemów)
10. [Możliwości rozwoju](#-możliwości-rozwoju)

---

## 📋 O projekcie

**Webowaw** to nowoczesna aplikacja webowa stworzona w języku polskim, która umożliwia zbieranie, organizowanie i eksportowanie aplikacji z różnych źródeł. Głównym celem projektu jest ułatwienie zarządzania kolekcją aplikacji, szczególnie dla osób, które chcą:

- **Pobierać dane** z Google Play Store i stron internetowych
- **Dodawać linki polecające** i kody bonusowe do promocji
- **Organizować aplikacje** w lokalnych folderach
- **Generować gotowe strony internetowe** z kolekcją

### 🎨 Design

- **Motyw kolorystyczny**: Głęboka czerń (#0a0a0a) + Neonowa czerwień (#ff0040)
- **Czcionki**: Orbitron (nagłówki) + Exo 2 (tekst)
- **Styl**: Nowoczesny, lekko fantazyjny, ale czytelny i przejrzysty
- **Kolory tekstu**: Białe litery na ciemnym tle

---

## 🏗️ Struktura Projektu

```
webowaw-app/
├── backend/                          # Serwer backend
│   ├── package.json                  # Zależności backend
│   └── server.js                     # Główny plik serwera Express
│
├── frontend/                         # Aplikacja frontend
│   ├── index.html                    # Główna strona HTML
│   ├── package.json                  # Zależności frontend
│   ├── tsconfig.json                 # Konfiguracja TypeScript
│   ├── tsconfig.node.json            # Konfiguracja TypeScript dla Vite
│   ├── vite.config.ts                # Konfiguracja Vite
│   └── src/                          # Źródła aplikacji
│       ├── main.tsx                  # Punkt wejścia
│       ├── App.tsx                   # Główny komponent
│       ├── vite-env.d.ts             # Deklaracje typów Vite
│       ├── components/               # Komponenty React
│       │   ├── Layout.tsx            # Layout aplikacji
│       │   └── AppCard.tsx           # Karta aplikacji
│       ├── pages/                    # Strony
│       │   ├── Dashboard.tsx         # Strona główna
│       │   ├── AddApp.tsx            # Dodawanie aplikacji
│       │   ├── AppDetails.tsx        # Szczegóły aplikacji
│       │   ├── Folders.tsx           # Zarządzanie folderami
│       │   ├── Export.tsx            # Eksport danych
│       │   └── Settings.tsx          # Ustawienia
│       ├── types/                    # Typy TypeScript
│       │   └── index.ts              # Definicje typów
│       ├── styles/                   # Style
│       │   └── GlobalStyles.css      # Globalne style CSS
│       ├── utils/                    # Funkcje narzędziowe
│       │   └── api.ts                # Funkcje API
│       └── hooks/                    # Custom hooks
│           └── useApps.ts            # Hook do zarządzania aplikacjami
│
├── storage/                          # Katalog na dane (tworzony automatycznie)
│   └── apps/                         # Aplikacje
│
├── package.json                      # Główny package.json
├── .gitignore                        # Ignorowane pliki
├── README.md                         # Główna dokumentacja
├── QUICK_START.md                    # Szybki start
├── SUMMARY.md                        # Podsumowanie projektu
└── PROJECT_OVERVIEW.md               # Ten plik
```

---

## 🛠️ Technologie

### Frontend
- **React 18** - Biblioteka do budowy interfejsów użytkownika
- **TypeScript** - Typowanie statyczne
- **Vite** - Szybki bundler
- **React Router DOM** - Nawigacja
- **Lucide React** - Ikony
- **CSS** - Stylizacja

### Backend
- **Express.js** - Framework serwerowy
- **Node.js** - Środowisko wykonawcze
- **Axios** - Klient HTTP
- **Cheerio** - Parsowanie HTML
- **Puppeteer** - Scrapowanie Play Store
- **fs-extra** - Operacje na systemie plików
- **UUID** - Generowanie unikalnych identyfikatorów

### Inne
- **ESLint** - Linting kodu
- **Prettier** - Formatowanie kodu
- **Nodemon** - Hot reload backend

---

## ✨ Funkcjonalności

### 1. Dashboard (Strona główna)
- ✅ Wyświetlanie wszystkich aplikacji w formie kart
- ✅ Wyszukiwanie po nazwie, opisie, tagach
- ✅ Filtrowanie po kategorii
- ✅ Widok siatki i listy
- ✅ Sortowanie (alfabetyczne, po dacie, po ocenie)
- ✅ Podgląd podstawowych informacji

### 2. Dodawanie Aplikacji
- ✅ **Krok 1**: Wybór źródła (WWW lub Play Store)
- ✅ **Krok 2**: Wprowadzenie URL i automatyczne pobieranie danych
- ✅ **Krok 3**: Edycja pobranych danych
  - Nazwa, opis, kategoria, tagi
  - Ocena, liczba recenzji, wersja
  - Developer, data aktualizacji
- ✅ **Krok 4**: Dodawanie linków polecających i kodów bonusowych
- ✅ **Krok 5**: Wybór folderu i zapis

### 3. Szczegóły Aplikacji
- ✅ Pełne informacje o aplikacji
- ✅ Galeria obrazków z podglądem
- ✅ Linki polecające z opcją kopiowania
- ✅ Kody bonusowe
- ✅ Notatki użytkownika
- ✅ Eksport pojedynczej aplikacji

### 4. Zarządzanie Folderami
- ✅ Tworzenie struktur folderów
- ✅ Przenoszenie aplikacji między folderami
- ✅ Podgląd zawartości folderów (drzewo)
- ✅ Wyszukiwanie w folderach
- ✅ Menu kontekstowe

### 5. Eksport Danych
- ✅ **HTML**: Gotowa strona internetowa z motywem
- ✅ **JSON**: Dane strukturalne
- ✅ **Markdown**: Dokumentacja
- ✅ Wybór folderów do eksportu
- ✅ Wybór szablonu (siatka, lista, karty)
- ✅ Opcje eksportu (obrazy, linki polecające, kody bonusowe)

### 6. Ustawienia
- ✅ Ścieżka katalogu lokalnego
- ✅ Automatyczne zapisywanie
- ✅ Automatyczne pobieranie obrazków
- ✅ Jakość obrazków
- ✅ Obsługa linków polecających
- ✅ Obsługa kodów bonusowych
- ✅ Domyślna kategoria
- ✅ Język (Polski, English)
- ✅ Motyw (Ciemny, Jasny)

---

## 🚀 Instalacja i Uruchomienie

### Wymagania
- Node.js 18 lub nowsza wersja
- npm lub yarn
- System operacyjny: Windows, macOS, Linux

### Instalacja

#### Opcja 1: Zainstaluj wszystko naraz
```bash
npm run install:all
```

#### Opcja 2: Instalacja oddzielna
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### Uruchomienie

#### Opcja 1: Dwa terminale (rekomendowane)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

#### Opcja 2: Jeden terminal
```bash
npm install -g concurrently  # Jeśli nie masz zainstalowanego
npm run dev
```

### Dostęp do aplikacji
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001/api](http://localhost:3001/api)

---

## ⚙️ Konfiguracja

### Środowisko

Aplikacja używa domyślnych ustawień, ale można je dostosować:

**Frontend (Vite):**
```bash
# W pliku .env w katalogu frontend
VITE_API_URL=http://localhost:3001/api
```

**Backend:**
- Port serwera: `3001` (można zmienić w `backend/server.js`)
- Ścieżka przechowywania: `./storage/apps/` (można zmienić w `backend/server.js`)

### Ustawienia Aplikacji

Ustawienia są przechowywane w `localStorage` i obejmują:
- Ścieżka katalogu lokalnego
- Automatyczne zapisywanie
- Obsługa linków polecających i kodów bonusowych
- Motyw i język

---

## 🔌 API

### Endpointy

| Metoda | Endpoint | Opis | Parametry |
|--------|----------|------|-----------|
| GET | `/api/health` | Sprawdzenie stanu serwera | - |
| GET | `/api/apps` | Pobierz wszystkie aplikacje | - |
| GET | `/api/apps/:id` | Pobierz pojedynczą aplikację | `id` |
| POST | `/api/scrape` | Pobierz dane ze źródła | `url`, `type` |
| POST | `/api/apps` | Zapisz nową aplikację | `appData`, `folderPath` |
| PUT | `/api/apps/:id` | Zaktualizuj aplikację | `id`, `appData` |
| DELETE | `/api/apps/:id` | Usuń aplikację | `id` |
| GET | `/api/folders` | Pobierz strukturę folderów | - |
| POST | `/api/export` | Eksportuj dane | `apps`, `format`, `template`, `options` |

### Typy

**ScrapeRequest:**
```typescript
{
  url: string;                    // URL źródła
  type: 'website' | 'playstore'; // Typ źródła
}
```

**SaveRequest:**
```typescript
{
  appData: AppData;              // Dane aplikacji
  folderPath: string;            // Ścieżka folderu
}
```

**ExportRequest:**
```typescript
{
  apps: AppData[];               // Lista aplikacji
  format: 'html' | 'json' | 'markdown'; // Format eksportu
  template?: 'grid' | 'list' | 'cards'; // Szablon HTML
  includeImages?: boolean;       // Dołącz obrazy
  includeReferralLinks?: boolean; // Dołącz linki polecające
  includeBonusCodes?: boolean;   // Dołącz kody bonusowe
}
```

### Przykłady

**Pobierz aplikacje:**
```bash
curl http://localhost:3001/api/apps
```

**Scrapowanie strony:**
```bash
curl -X POST http://localhost:3001/api/scrape \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com", "type": "website"}'
```

**Zapisz aplikację:**
```bash
curl -X POST http://localhost:3001/api/apps \
  -H "Content-Type: application/json" \
  -d '{
    "appData": {
      "name": "Test App",
      "description": "Test description",
      "sourceType": "website",
      "sourceUrl": "https://example.com",
      "referralLink": "https://example.com/ref=abc",
      "bonusCode": "TEST10"
    },
    "folderPath": "/aplikacje/testowe"
  }'
```

---

## 💡 Przykłady Użycia

### Przykład 1: Tworzenie strony z polecanymi aplikacjami

1. **Dodaj aplikacje**:
   - Przejdź do "Dodaj aplikację"
   - Wybierz źródło (np. Play Store)
   - Wklej URL aplikacji
   - Dodaj swój link polecający
   - Zapisz

2. **Powtórz** dla kilku aplikacji

3. **Eksportuj**:
   - Przejdź do "Eksport"
   - Wybierz folder z aplikacjami
   - Wybierz format: HTML
   - Wybierz szablon: Karty
   - Kliknij "Eksportuj"

4. **Opublikuj**:
   - Otrzymasz plik HTML
   - Wgraj go na swój hosting
   - Gotowe! Twoja strona z polecanymi aplikacjami jest dostępna

### Przykład 2: Katalog z kodami bonusowymi

1. **Dodaj aplikacje** z kodami rabatowymi
2. **Utwórz folder** "Promocje"
3. **Eksportuj** do HTML
4. **Udostępnij** klientom

### Przykład 3: Baza wiedzy o narzędziach

1. **Dodaj narzędzia** z rozbudowanymi opisami
2. **Użyj tagów** do kategoryzacji (np. "design", "development", "marketing")
3. **Eksportuj** do Markdown
4. **Zaimportuj** do systemu dokumentacji (np. Notion, Confluence)

---

## 🐛 Rozwiązywanie Problemów

### Backend nie działa

**Problem:** Serwer backend nie uruchamia się

**Rozwiązanie:**
```bash
cd backend
npm install
npm run dev
```

**Jeśli to nie pomaga:**
- Sprawdź, czy port 3001 jest wolny
- Sprawdź, czy Node.js jest zainstalowane
- Sprawdź logi błędu

### Frontend nie łączy się z backend

**Problem:** Aplikacja frontend nie może połączyć się z API

**Rozwiązanie:**
1. Upewnij się, że backend działa
2. Sprawdź, czy backend jest na porcie 3001
3. Sprawdź konfigurację proxy w `vite.config.ts`
4. Spróbuj ręcznie wejść na `http://localhost:3001/api/health`

### Scrapowanie nie działa

**Problem:** Nie można pobrać danych z URL

**Rozwiązanie:**
- Sprawdź, czy URL jest poprawny
- Spróbuj ręcznie wejść na stronę w przeglądarce
- Niektóre strony blokują scrapowanie (np. przez Cloudflare)
- Użyj trybu ręcznego wprowadzania danych

### Brak obrazków

**Problem:** Obrazki nie są wyświetlane

**Rozwiązanie:**
- W ustawieniach włącz "Automatyczne pobieranie obrazków"
- Upewnij się, że masz połączenie internetowe
- Sprawdź, czy URL obrazka jest poprawny

### Aplikacja nie zapisuje danych

**Problem:** Dane nie są zapisywane

**Rozwiązanie:**
- Sprawdź, czy backend działa
- Sprawdź uprawnienia do zapisu w katalogu `storage/`
- Spróbuj ręcznie utworzyć katalog `storage/apps/`

---

## 🌱 Możliwości Rozszerzenia

### Nowe Źródła
- [ ] **App Store** (iOS) - Scrapowanie aplikacji z Apple App Store
- [ ] **Microsoft Store** - Scrapowanie aplikacji Windows
- [ ] **GitHub** - Pobieranie informacji o projektach open source
- [ ] **Steam** - Scrapowanie gier
- [ ] **Amazon** - Pobieranie produktów

### Zaawansowane Scrapowanie
- [ ] Pobieranie filmów (demo, tutoriali)
- [ ] Analiza recenzji i ocen
- [ ] Porównywanie wersji
- [ ] Monitorowanie cen

### Integracje
- [ ] **Google Analytics** - Śledzenie ruchu
- [ ] **Firebase** - Autoryzacja i baza danych
- [ ] **Programy partnerskie** - Integracja z Amazon, Allegro, itp.
- [ ] **Cloud Storage** - Synchronizacja z Google Drive, Dropbox

### Dodatkowe Funkcje
- [ ] **Import z pliku** (CSV, JSON, Excel)
- [ ] **Synchronizacja z chmurą** - Backup i restore
- [ ] **Współpraca zespołowa** - Udostępnianie kolekcji
- [ ] **System powiadomień** - Nowe aktualizacje, promocje
- [ ] **Kalendarz** - Planowanie publikacji

### Ulepszenia UI/UX
- [ ] **Dark/Light mode switch** - Przełączanie motywów
- [ ] **Custom themes** - Własne kolory i style
- [ ] **Drag & drop** - Organizacja przez przeciąganie
- [ ] **Bulk actions** - Masowe operacje na aplikacjach
- [ ] **Keyboard shortcuts** - Skróty klawiszowe
- [ ] **Mobile app** - Aplikacja mobilna

### Funkcje Biznesowe
- [ ] **Statystyki** - Analiza kolekcji
- [ ] **Raporty** - Generowanie raportów
- [ ] **API publiczne** - Udostępnianie danych przez API
- [ ] **Monetyzacja** - System płatności i subskrypcji

---

## 📊 Statystyki Projektu

### Pliki
- **Frontend**: 18 plików
- **Backend**: 2 pliki
- **Dokumentacja**: 4 pliki
- **Razem**: 24 pliki

### Funkcjonalności
- **Strony**: 6 (Dashboard, AddApp, AppDetails, Folders, Export, Settings)
- **Komponenty**: 2 (Layout, AppCard)
- **Hooks**: 1 (useApps)
- **API Endpoints**: 8
- **Typy**: 1 (AppData, FolderStructure, itp.)

### Technologie
- **Frontend**: React, TypeScript, Vite, CSS
- **Backend**: Express, Node.js, Cheerio, Puppeteer
- **Baza danych**: System plików (JSON)

---

## 🎓 Podsumowanie

**Webowaw** to kompletne rozwiązanie dla osób, które chcą:

1. **Zbierać i organizować** aplikacje z różnych źródeł
2. **Dodawać linki polecające i kody bonusowe** do promocji
3. **Generować gotowe strony internetowe** z kolekcją
4. **Mieć pełną kontrolę** nad swoimi danymi (lokalne przechowywanie)

### Zalety
- ✅ **Nowoczesny design** - Atrakcyjny wizualnie, responsywny
- ✅ **Kompleksowa funkcjonalność** - Wszystko, czego potrzeba
- ✅ **Elastyczność** - Praca offline, fallback, konfigurowalne
- ✅ **Łatwość użycia** - Intuicyjny interfejs, krok po kroku
- ✅ **Bezpieczeństwo** - Dane lokalne, brak zewnętrznych połączeń
- ✅ **Rozwijalność** - Łatwe dodawanie nowych funkcji

### Wady
- ❌ **Brak bazy danych** - Dane przechowywane w plikach JSON
- ❌ **Scrapowanie ograniczone** - Nie wszystkie strony można scrapować
- ❌ **Brak autoryzacji** - Aplikacja nie ma systemu logowania
- ❌ **Wymaga Node.js** - Konieczność instalacji środowiska

---

## 🚀 Dalej!

Teraz, gdy masz już pełny obraz projektu, możesz:

1. **Zainstalować i uruchomić** aplikację według instrukcji
2. **Wypróbować** wszystkie funkcjonalności
3. **Dostosować** do swoich potrzeb
4. **Rozwijać** i dodawać nowe funkcje
5. **Udostępnić** innym

**Miłego korzystania z Webowaw!** 🎉

---

**Wersja**: 1.0.0  
**Data**: 2024  
**Licencja**: MIT  
**Autor**: [Twoje Imię]
