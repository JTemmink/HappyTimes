# 🌸 HappyTimes - Thai Massage Finder

Een humoristische React web app om Thai massage plekken in je buurt te vinden.

## Features

- 📍 Automatische locatie detectie
- 😄 Grappige vragen flow met "Happy New Years treatment"
- 🔍 Zoekt Thai massages binnen 5 km
- ⭐ Toont reviews en sterren
- 🗺️ Routebeschrijving naar keuze (wandelen of auto)
- 🎨 Volledig Thai-themed design

## Setup

1. Installeer dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```npm 

3. Build voor productie:
```bash
npm run build
```

## APIs

De app gebruikt **volledig gratis APIs** zonder API keys:

### OpenStreetMap Nominatim
- **Volledig gratis**, geen API key nodig
- Gebruikt voor het zoeken naar Thai massage plekken
- [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)

### OpenStreetMap Routing
- **Volledig gratis**, geen API key nodig
- Gebruikt voor routebeschrijvingen (wandelen/auto)

## Gebruik

1. Open de app in je browser
2. Geef locatie toegang
3. Beantwoord de grappige vragen
4. Kies een massage plek uit de lijst
5. Selecteer route type (wandelen/auto)
6. Je wordt doorgestuurd naar OpenStreetMap voor de routebeschrijving

## Technologie

- React 18
- TypeScript
- Vite
- Tailwind CSS
- OpenStreetMap Nominatim API (gratis)
- OpenStreetMap Routing (gratis)
- Browser Geolocation API

