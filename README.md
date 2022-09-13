# Nieoficjalny klient Spotify (UI)
Ten projekt jest jedną z dwóch części nieoficjalnego klienta Spotify na system Android. Interfejs został napisany w języku TypeScript z wykorzystaniem frameworka Angular. 

Interfejs komunikuje się z aplikacją natywną przez wykorzystanie zaprojektowanego "mostu":
 - Komunikacja w kierunku UI --> Native odbywa się przez funkcję *JavaScript Interface* znajdującą się w module WebView systemu Android (dostępne funkcje zostały opisane w pliku `src/bridge.d.ts`)
 - Komunikacja Native --> UI odbywa się przez wysyłanie odpowiednich żądań za pomocą `window.postMessage` z poziomu kodu aplikacji natywnej.
 
## Funkcjonalność
Aplikacja implementuje około 90% funkcjonalności oryginalnej aplikacji.
Obsługiwane funkcje to:
 
- Logowanie
- Przeglądanie zawartości (albumy, playlity, utwory, kategorie, itp.)
- Dodawanie i usuwanie utworów z playlist
- Dodawanie i usuwanie playlist
- Obserwowanie playlist
- Wyszukiwanie
- Menu kontekstowe
- Odtwarzacz multimediów
- Przesyłanie muzyki przez Chromecast
- Ustawienia

Funkcje, które nie zostały zaimplementowane:

 - Edycja kolejności utworów w playlistach
 - Pobieranie utworów

## Środowisko deweloperskie
W celu uruchomienia projektu należy wykorzystać polecenie `npm start`. 

Zostanie wtedy uruchomiony lokalny serwer z uruchomioną aplikacją. Komunikacja z aplikacją natywną jest w takim wypadku symulowana, co pozwala na testowanie aplikacji w przeglądarce internetowej.

## Kompilacja
Projekt nie jest kompilowany bezpośrednio przez dewelopera a poprzez serwer CI/CD (Jenkins) w trakcie kompilacji aplikacji natywnej. Proces kompilacji został dokładniej opisany w dokumentacji aplikacji natywnej.

## Zrzuty ekranu

 ### Ekran główny
![Ekran główny](/media/home.png)

### Przeglądanie treści
![Przeglądanie treści](/media/browse.png)

### Biblioteka
![Biblioteka](/media/library.png)

### Wyszukiwarka
![Wyszukiwarka](/media/search.png)

### Widok artysty
![Widok artysty](/media/artist.png)

### Widok albumu
![Widok albumu](/media/album.png)

### Widok playlisty
![Widok playlisty](/media/playlist.png)

### Menu kontekstowe
![Menu kontekstowe](/media/context_menu.png)

### Odtwarzacz multimediów
![Odtwarzacz multimediów](/media/player.png)

### Przesyłanie muzyki przez Chromecast
![Przesyłanie muzyki przez Chromecast](/media/cast.png)

