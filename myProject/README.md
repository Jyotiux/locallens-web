# LocalLens — Frontend

The React + Vite frontend for **LocalLens**, a map-based platform for discovering and sharing hidden places.

For full project documentation (features, backend setup, API reference), see the [root README](../README.md).

## Tech

- React 19 + Vite 6
- Tailwind CSS 3
- React-Leaflet / Leaflet (interactive map)
- Fraunces (display) + Inter (body) fonts

## Structure

```
src/
├── App.jsx              # Main page: header, map pane, discovery list
├── main.jsx            # React entry point
├── index.css           # Tailwind + warm editorial design tokens
└── components/
    ├── ViewMap.jsx     # Leaflet map — click-to-add, highlight/recenter
    ├── SpotForm.jsx    # Add-spot form (title, description, category, images)
    └── Lightbox.jsx    # Full-screen image gallery with keyboard nav
```

## Local development

```bash
npm install
npm run dev       # http://localhost:5173
```

The API base URL lives in `src/App.jsx` (`API_BASE_URL`). Point it at your backend (e.g. `http://localhost:5000/api`) for local development.

## Scripts

| Script            | Description                  |
|-------------------|------------------------------|
| `npm run dev`     | Start the Vite dev server    |
| `npm run build`   | Build for production         |
| `npm run preview` | Preview the production build |
| `npm run lint`    | Run ESLint                   |
