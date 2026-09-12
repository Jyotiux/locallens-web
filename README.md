# LocalLens

> Mark · Share · Explore hidden places.

LocalLens is a map-based discovery platform for sharing hidden, off-the-beaten-path locations. Drop a pin anywhere on the map, add a title, description, category and photos, and it becomes part of a browsable, photo-first discovery feed. The interface takes visual inspiration from editorial travel/discovery apps like Atlas Obscura, Mapstr and AllTrails.

<p align="center">
  <em>An interactive map + a curated discovery list, side by side.</em>
</p>

---

## Features

- **Interactive map** — click anywhere to mark a new spot (powered by Leaflet + OpenStreetMap tiles).
- **Photo-first discovery cards** — each spot leads with its imagery, with the title overlaid editorial-style.
- **Image gallery / lightbox** — spots with multiple photos open a full-screen gallery with prev/next controls, a photo counter, keyboard navigation (Esc / ← / →) and close.
- **Category filtering** — filter the feed by Nature, Historical, Local Food, Spiritual or Adventure.
- **Result limit control** — show 4, 8, 12 or 20 spots at a time.
- **Map ↔ list linking** — clicking a card highlights and recenters its location on the map.
- **Add-a-spot flow** — a header action guides you to click the map, then a form captures details and images.
- **Responsive layout** — a sticky map beside the list on desktop, single-column on mobile.

---

## Tech stack

| Layer      | Technology |
|------------|------------|
| Frontend   | React 19, Vite 6, Tailwind CSS 3, React-Leaflet / Leaflet |
| Backend    | Node.js, Express 5 |
| Database   | MongoDB (via Mongoose 8) |
| Media      | Cloudinary (image hosting), Multer (uploads) |
| Fonts      | Fraunces (display) + Inter (body) |

---

## Project structure

```
locallens-web/
├── backend/                 # Express + MongoDB API
│   ├── app.js               # App entry, middleware, route mounting
│   ├── config/db.js         # MongoDB connection
│   ├── controllers/         # Request handlers (spotController.js)
│   ├── models/Spot.js       # Mongoose schema for a spot
│   ├── routes/spotRoutes.js # /api routes
│   └── utils/cloudinary.js  # Cloudinary config
│
└── myProject/               # React + Vite frontend
    ├── index.html
    ├── src/
    │   ├── App.jsx           # Main page: header, map pane, discovery list
    │   ├── main.jsx          # React entry
    │   ├── index.css         # Tailwind + design tokens
    │   └── components/
    │       ├── ViewMap.jsx   # Leaflet map (click-to-add, highlight)
    │       ├── SpotForm.jsx  # Add-spot form
    │       └── Lightbox.jsx  # Full-screen image gallery
    ├── tailwind.config.js
    └── vite.config.js
```

---

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ and npm
- A [MongoDB](https://www.mongodb.com/) database (local or MongoDB Atlas)
- A [Cloudinary](https://cloudinary.com/) account (for image uploads)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd locallens-web
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with the following variables:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> Never commit your `.env` file. It is already gitignored.

Run the API:

```bash
npm run dev     # start with nodemon (auto-reload)
# or
npm start       # start with node
```

The server runs on `http://localhost:5000` by default.

### 3. Set up the frontend

```bash
cd ../myProject
npm install
npm run dev
```

Vite serves the app on `http://localhost:5173` by default.

> **Note:** The frontend's API base URL is configured in `myProject/src/App.jsx` (`API_BASE_URL`). Point it at your backend (e.g. `http://localhost:5000/api`) for local development.

---

## API reference

Base path: `/api`

### Create a spot

```
POST /api/spots
Content-Type: multipart/form-data
```

| Field         | Type              | Required | Notes                                  |
|---------------|-------------------|----------|----------------------------------------|
| `title`       | string            | yes      |                                        |
| `category`    | string            | yes      | e.g. Nature, Historical, Food, …       |
| `lat`         | number            | yes      | Latitude                               |
| `lng`         | number            | yes      | Longitude                              |
| `description` | string            | no       |                                        |
| `images`      | file[] (max 5)    | no       | Uploaded to Cloudinary                 |

**Response `201`**

```json
{
  "message": "Spot created Successfully",
  "spot": { "_id": "...", "title": "...", "coordinates": { "lat": 0, "lng": 0 }, "imageUrls": ["..."] }
}
```

### List spots

```
GET /api/spots?limit=4&category=Nature
```

| Query param | Type   | Default | Notes                          |
|-------------|--------|---------|--------------------------------|
| `limit`     | number | 4       | Max number of spots returned   |
| `category`  | string | —       | Optional category filter       |

Returns an array of spots sorted by newest first.

### Data model

```js
Spot {
  title: String,        // required
  description: String,
  category: String,
  coordinates: { lat: Number, lng: Number },
  imageUrls: [String],
  createdAt: Date,      // added by timestamps
  updatedAt: Date
}
```

---

## Available scripts

**Backend** (`backend/`)

| Script          | Description                     |
|-----------------|---------------------------------|
| `npm start`     | Start the server with Node      |
| `npm run dev`   | Start with nodemon (auto-reload)|

**Frontend** (`myProject/`)

| Script            | Description                  |
|-------------------|------------------------------|
| `npm run dev`     | Start the Vite dev server    |
| `npm run build`   | Build for production         |
| `npm run preview` | Preview the production build |
| `npm run lint`    | Run ESLint                   |

---

## License

ISC. See individual `package.json` files for details.
