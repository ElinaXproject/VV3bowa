# Webowaw - Aplikacja do zbierania i organizowania aplikacji

## 📋 Opis

**Webowaw** to nowoczesna aplikacja webowa w języku polskim, która pozwala na:
- Pobieranie danych z różnych źródeł (strony WWW, Google Play Store)
- Organizowanie aplikacji w lokalnych folderach
- Dodawanie linków polecających i kodów bonusowych
- Eksportowanie kolekcji do różnych formatów (HTML, JSON, Markdown)
- Generowanie gotowych stron internetowych z kolekcją aplikacji

## 🎨 Wygląd i Design

- **Motyw kolorystyczny**: Głęboka czerń (#0a0a0a) + Neonowa czerwień (#ff0040)
- **Czcionki**: Orbitron (nagłówki) + Exo 2 (tekst) - nowoczesne, lekko fantazyjne ale czytelne
- **Kolory tekstu**: Białe litery na ciemnym tle
- **Interfejs**: Przejrzysty, responsywny, z animacjami

## 🚀 Instalacja i Uruchomienie

### Wymagania

- Node.js (wersja 18 lub nowsza)
- npm lub yarn
- System operacyjny: Windows, macOS, Linux

### Instalacja

1. **Sklonuj repozytorium lub rozpakuj archiwum**

```bash
cd webowaw-app
```

2. **Zainstaluj zależności backend**

```bash
cd backend
npm install
cd ..
```

3. **Zainstaluj zależności frontend**

```bash
cd frontend
npm install
cd ..
```

### Uruchomienie

1. **Uruchom serwer backend** (w nowym terminalu)

```bash
cd backend
npm run dev
```

Serwer będzie dostępny pod adresem: `http://localhost:3001`

2. **Uruchom frontend** (w nowym terminalu)

```bash
cd frontend
npm run dev
```

Aplikacja będzie dostępna pod adresem: `http://localhost:3000`

## 📁 Struktura Projektu

```
webowaw-app/
├── backend/           # Serwer backend (Express.js)
│   ├── server.js      # Główny plik serwera
│   └── package.json
│
├── frontend/          # Aplikacja frontend (React)
│   ├── src/
│   │   ├── components/ # Komponenty React
│   │   ├── pages/      # Strony aplikacji
│   │   ├── types/      # Typy TypeScript
│   │   ├── styles/     # Style CSS
│   │   ├── App.tsx     # Główna aplikacja
│   │   └── main.tsx    # Punkt wejścia
│   ├── package.json
│   └── vite.config.ts
│
├── storage/           # Katalog na dane (tworzony automatycznie)
│   └── apps/          # Aplikacje
│
└── README.md          # Ten plik
```

## 🎯 Funkcjonalności

### 1. Dashboard (Strona główna)
- Wyświetlanie wszystkich dodanych aplikacji
- Wyszukiwanie i filtrowanie
- Widok siatki lub listy
- Podgląd podstawowych informacji

### 2. Dodawanie Aplikacji
- **Krok 1**: Wybór źródła (WWW lub Play Store)
- **Krok 2**: Pobieranie danych (automatyczne scrapowanie)
- **Krok 3**: Edycja i uzupełnianie danych
- **Krok 4**: Wybór folderu i zapis

### 3. Szczegóły Aplikacji
- Pełne informacje o aplikacji
- Obrazki i ikony
- Linki polecające i kody bonusowe
- Eksport pojedynczej aplikacji

### 4. Zarządzanie Folderami
- Tworzenie struktur folderów
- Przenoszenie aplikacji między folderami
- Podgląd zawartości folderów

### 5. Eksport Danych
- Eksport do HTML (gotowa strona WWW)
- Eksport do JSON (dane strukturalne)
- Eksport do Markdown (dokumentacja)
- Wybór szablonów i opcji eksportu

### 6. Ustawienia
- Konfiguracja ścieżek zapisu
- Ustawienia scrapowania
- Obsługa linków polecających i kodów bonusowych
- Motyw i język

## 🔧 API Endpoints

| Metoda | Endpoint | Opis |
|--------|----------|------|
| GET | `/api/health` | Sprawdzenie stanu serwera |
| GET | `/api/apps` | Pobierz wszystkie aplikacje |
| GET | `/api/apps/:id` | Pobierz pojedynczą aplikację |
| POST | `/api/scrape` | Pobierz dane ze źródła |
| POST | `/api/apps` | Zapisz nową aplikację |
| PUT | `/api/apps/:id` | Zaktualizuj aplikację |
| DELETE | `/api/apps/:id` | Usuń aplikację |
| GET | `/api/folders` | Pobierz strukturę folderów |
| POST | `/api/export` | Eksportuj dane |

## 📦 Format Danych Aplikacji

```json
{
  "id": "string",
  "sourceType": "website" | "playstore" | "manual",
  "sourceUrl": "string",
  "name": "string",
  "description": "string",
  "icon": "string",
  "images": ["string"],
  "rating": 0-5,
  "reviewsCount": number,
  "category": "string",
  "tags": ["string"],
  "developer": "string",
  "version": "string",
  "lastUpdated": "string",
  "referralLink": "string",
  "bonusCode": "string",
  "customNotes": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "folderPath": "string"
}
```

## 🎨 Motyw Kolorystyczny

### Kolory
- **Tło główne**: `#0a0a0a` (Głęboka czerń)
- **Tło wtórne**: `#121212`
- **Karty**: `#1e1e1e`
- **Neonowa czerwień**: `#ff0040`
- **Neonowa czerwień (jasna)**: `#ff2d6f`
- **Tekst główny**: `#ffffff` (Białe)
- **Tekst wtórny**: `#e0e0e0`
- **Tekst stłumiony**: `#a0a0a0`
- **Ramki**: `#333333`

### Czcionki
- **Nagłówki**: Orbitron (bold)
- **Tekst**: Exo 2 (regular, medium)

## 💡 Porady i Sposoby Użycia

### 1. Pobieranie danych z Play Store
- Wklej pełny URL aplikacji z Google Play
- System automatycznie pobierze: nazwę, opis, ikonę, oceny, recenzje, kategorie, tagi
- Możesz ręcznie edytować pobrane dane

### 2. Dodawanie linków polecających
- W polu "Link polecający" wprowadź swój unikalny link partnerski
- Link zostanie dołączony do eksportowanych danych
- Możesz kopiować linki bezpośrednio z aplikacji

### 3. Kody bonusowe
- Jeśli masz kod rabatowy lub bonusowy, wprowadź go w odpowiednim polu
- Kod zostanie wyświetlony w eksportowanych danych
- Przydatne przy promocjach i programach partnerskich

### 4. Organizacja folderów
- Twórz strukturę folderów według własnych potrzeb
- Możesz grupować aplikacje po kategorii, tematyce, itp.
- Foldery ułatwiają późniejsze wyszukiwanie

### 5. Eksport do HTML
- Wybierz szablon (siatka, lista, karty)
- Zdecyduj, które elementy mają być uwzględnione
- Gotowa strona HTML może być opublikowana na dowolnym hostingu

## 🔒 Bezpieczeństwo

- Wszystkie dane są przechowywane lokalnie na Twoim komputerze
- Aplikacja nie wysyła danych do zewnętrznych serwerów (poza scrapowaniem źródeł)
- Możesz w każdej chwili usunąć dane z katalogu storage/

## 📝 Licencja

MIT License - Wolne użytkowanie, modyfikacja i dystrybucja.

## 🤝 Wsparcie

Jeśli podoba Ci się ta aplikacja:
- Udostępnij ją innym
- Zgłoś błędy i sugestie
- Rozwijaj ją razem z nami!

## 📞 Kontakt

W przypadku pytań i problemów, skontaktuj się poprzez GitHub Issues.

---

**Webowaw** - Twoja kolekcja aplikacji w jednym miejscu! 🚀
