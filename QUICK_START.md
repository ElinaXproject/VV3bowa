# 🚀 Szybki Start - Webowaw

## 1️⃣ Instalacja

### Wymagania
- Node.js 18+ 
- npm lub yarn

### Instalacja zależności

```bash
# Zainstaluj zależności dla całego projektu
npm run install:all
```

Lub oddzielnie:

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

## 2️⃣ Uruchomienie

### Opcja 1: Dwa terminale

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

### Opcja 2: Jeden terminal (wymaga concurrently)

```bash
npm run dev
```

## 3️⃣ Korzystanie z aplikacji

1. **Otwórz przeglądarkę**: Przejdź do `http://localhost:3000`

2. **Dodaj pierwszą aplikację**:
   - Kliknij "Dodaj aplikację" w menu
   - Wybierz źródło (WWW lub Play Store)
   - Wklej URL i kliknij "Pobierz dane"
   - Uzupełnij dane (nazwa, opis, itp.)
   - Dodaj **link polecający** i/lub **kod bonusowy** (opcjonalnie)
   - Wybierz folder i zapisz

3. **Przeglądaj kolekcję**:
   - Wszystkie aplikacje pojawią się na stronie głównej
   - Możesz wyszukiwać, filtrować i sortować

4. **Eksportuj dane**:
   - Przejdź do zakładki "Eksport"
   - Wybierz foldery i format (HTML, JSON, Markdown)
   - Pobierz gotowy plik

## 4️⃣ Główne funkcje

### 📥 Pobieranie danych
- **Play Store**: Automatyczne scrapowanie aplikacji z Google Play
- **Strony WWW**: Pobieranie metadanych (tytuł, opis, obrazki, favicon)
- **Ręczne**: Możliwość ręcznego wprowadzania danych

### 📁 Organizacja
- Tworzenie struktur folderów
- Przenoszenie aplikacji między folderami
- Kategoryzacja i tagowanie

### 🔗 Linki polecające i kody bonusowe
- Dodawanie unikalnych linków partnerskich
- Wprowadzanie kodów rabatowych i bonusowych
- Automatyczne dołączanie do eksportowanych danych

### 📤 Eksport
- **HTML**: Gotowa strona internetowa z kolekcją
- **JSON**: Dane strukturalne do dalszego przetwarzania
- **Markdown**: Dokumentacja w formacie Markdown
- Różne szablony (siatka, lista, karty)

## 5️⃣ Ustawienia

Przejdź do zakładki "Ustawienia", aby:
- Zmienić ścieżkę katalogu lokalnego
- Konfigurować automatyczne pobieranie obrazków
- Włączać/wyłączać obsługę linków polecających
- Zmieniać motyw (ciemny/jasny)
- Ustawiać domyślną kategorię

## 6️⃣ Struktura katalogów

```
webowaw-app/
├── storage/           # Tutaj są przechowywane wszystkie dane
│   └── apps/          # Aplikacje pogrupowane w folderach
│       └── aplikacje/
│           ├── testowe/
│           │   ├── [id].json      # Dane aplikacji
│           │   ├── [id]_icon.jpg  # Ikona
│           │   └── images/        # Obrazki
│           └── webowe/
│               └── ...
└── ...
```

## 7️⃣ Rozwiązywanie problemów

### Backend nie działa
```bash
# Zainstaluj brakujące zależności
cd backend
npm install
npm run dev
```

### Frontend nie łączy się z backend
- Upewnij się, że backend działa na porcie 3001
- Sprawdź, czy nie masz innych aplikacji używających portów 3000 i 3001

### Brak obrazków
- W ustawieniach włącz "Automatyczne pobieranie obrazków"
- Upewnij się, że masz połączenie internetowe

### Scrapowanie nie działa
- Spróbuj ręcznie wprowadzić dane
- Sprawdź, czy URL jest poprawny
- Niektóre strony mogą blokować scrapowanie

## 8️⃣ Przykłady użycia

### Przykład 1: Tworzenie strony z polecanymi aplikacjami
1. Dodaj kilka aplikacji z linkami polecającymi
2. Przejdź do "Eksport"
3. Wybierz format HTML i szablon "Karty"
4. Wyeksportuj i opublikuj na swoim hostingu

### Przykład 2: Katalog aplikacji z kodami bonusowymi
1. Dodaj aplikacje z kodami rabatowymi
2. Wybierz folder "Promocje"
3. Eksportuj do HTML
4. Udostępnij klientom

### Przykład 3: Baza wiedzy o aplikacjach
1. Dodaj aplikacje z rozbudowanymi opisami
2. Użyj tagów do kategoryzacji
3. Eksportuj do Markdown
4. Zaimportuj do systemu dokumentacji

## 9️⃣ Porady

✅ **Regularnie zapisuj**: Ustaw automatyczne zapisywanie w ustawieniach

✅ **Organizuj foldery**: Ułatwi to późniejsze wyszukiwanie

✅ **Korzystaj z tagów**: Pomagają w kategoryzacji i filtrowaniu

✅ **Dodawaj notatki**: W polu "Notatki" zapisz ważne informacje

✅ **Testuj eksport**: Przed opublikowaniem sprawdź, jak wygląda eksport

---

**Miłego korzystania z Webowaw!** 🎉
