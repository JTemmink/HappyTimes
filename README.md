# 🌸 HappyTimes - Thai Massage Finder

A humorous React web app to find Thai massage places near you.

## Features

- 📍 Automatic location detection
- 😄 Funny question flow with "Happy New Years treatment"
- 🔍 Searches for Thai massages within 5 km
- ⭐ Shows reviews and ratings
- 🗺️ Route directions to choose from (walking or driving)
- 🎨 Fully Thai-themed design

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file for OpenAI API (optional but recommended):
```bash
VITE_OPENAI_API_KEY=your_openai_api_key_here
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## APIs

The app uses **mostly free APIs**:

### OpenAI API (Optional)
- Used for generating funny, witty descriptions of massage places
- Requires an API key from [OpenAI](https://platform.openai.com/)
- If not provided, description feature will show an error message
- Add `VITE_OPENAI_API_KEY` to your `.env` file

### Free APIs (No keys required):

### OpenStreetMap Nominatim
- **Completely free**, no API key needed
- Used for searching Thai massage places
- [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/)

### OpenStreetMap Routing
- **Completely free**, no API key needed
- Used for route directions (walking/driving)

## Usage

1. Open the app in your browser
2. Grant location access
3. Answer the funny questions
4. Choose a massage place from the list
5. Select route type (walking/driving)
6. You will be redirected for directions

## Technologie

- React 18
- TypeScript
- Vite
- Tailwind CSS
- OpenStreetMap Nominatim API (gratis)
- OpenStreetMap Routing (gratis)
- Browser Geolocation API

