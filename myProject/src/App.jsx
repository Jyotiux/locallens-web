import React, { useState, useEffect } from "react";
import MapView from "./components/ViewMap.jsx";
import SpotForm from "./components/SpotForm.jsx";
import Lightbox from "./components/Lightbox.jsx";
//
const API_BASE_URL = "https://locallens-fn9b.onrender.com/api";

// Filter categories — values match the original <option> values (and the API)
const CATEGORIES = [
  { value: "", label: "All", dot: null },
  { value: "Nature", label: "Nature", dot: "bg-emerald-400" },
  { value: "Historical", label: "Historical", dot: "bg-amber-400" },
  { value: "Food", label: "Local Food", dot: "bg-rose-400" },
  { value: "Spiritual", label: "Spiritual", dot: "bg-violet-400" },
  { value: "Adventure", label: "Adventure", dot: "bg-sky-400" },
];

const App = () => {
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [spots, setSpots] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [limit, setLimit] = useState(4);
  const [highlightedCoords, setHighlightedCoords] = useState(null);
  const [lightbox, setLightbox] = useState(null); // { images, title, startIndex } | null
  const [addPrompt, setAddPrompt] = useState(false); // UI-only: guides user to click the map

  const handleAddLocation = (coords) => {
    setSelectedCoords(coords);
    setAddPrompt(false); // existing map-click flow satisfies the "add a spot" guidance
  };

  // Header actions — reuse existing sections/flow, no new add mechanism
  const scrollToMap = () => {
    document
      .getElementById("explore-map")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleExplore = () => {
    scrollToMap();
  };

  const handleStartAddSpot = () => {
    scrollToMap();
    setAddPrompt(true); // guide the user to click the map (existing add-location flow)
  };

  const handleFormSubmit = async (formData) => {
    try {
      const res = await fetch(`${API_BASE_URL}/spots`, {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        fetchSpots();
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
    setSelectedCoords(null);
  };

  const fetchSpots = async () => {
    try {
      let url = `${API_BASE_URL}/spots?limit=${limit}`;
      if (selectedCategory) url += `&category=${selectedCategory}`;

      const res = await fetch(url);
      const data = await res.json();
      setSpots(data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  useEffect(() => {
    fetchSpots();
  }, [selectedCategory, limit]);

  return (
    <div className="min-h-screen bg-[#f7f3ec] text-stone-900">

      {/* 🔷 NAVBAR */}
      <header className="sticky top-0 z-[1000] bg-[#f7f3ec]/85 backdrop-blur border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand identity */}
          <a href="#explore-map" className="flex items-center gap-2.5 group">
            {/* Logo mark */}
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-violet-700 text-white ring-1 ring-black/5">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z" />
                <circle cx="12" cy="11" r="2.5" />
              </svg>
            </span>
            <span className="leading-tight">
              <span className="font-display block text-2xl sm:text-[1.65rem] font-bold tracking-tight text-stone-900">
                Local<span className="text-violet-700">Lens</span>
              </span>
              <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-[0.22em] text-stone-400">
                Discover · Mark · Share hidden places
              </span>
            </span>
          </a>

          {/* Minimal nav / actions — anchor to the existing map + add flow */}
          <nav className="flex items-center gap-1 sm:gap-2">
            <a
              href="#explore-map"
              onClick={(e) => {
                e.preventDefault();
                handleExplore();
              }}
              className="hidden sm:inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-900/5 transition"
            >
              Explore
            </a>
            <a
              href="#explore-map"
              onClick={(e) => {
                e.preventDefault();
                handleStartAddSpot();
              }}
              className="inline-flex items-center gap-1.5 rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white hover:bg-stone-800 transition"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span className="hidden sm:inline">Add a Spot</span>
              <span className="sm:hidden">Add</span>
            </a>
          </nav>
        </div>
      </header>

      {/* 🔷 MAIN CONTENT — MAP + DISCOVERY LIST */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">

          {/* 🗺 MAP PANE — persistent / sticky on desktop */}
          <section id="explore-map" className="scroll-mt-20 lg:col-span-7 xl:col-span-8 lg:sticky lg:top-24 lg:self-start">
            <div
              className={`bg-[#fdfbf7] rounded-xl overflow-hidden transition border ${
                addPrompt ? "border-violet-500 ring-1 ring-violet-500" : "border-stone-200/80"
              }`}
            >
              <div className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
                <div>
                  <h2 className="font-display text-xl font-semibold tracking-tight text-stone-900">Explore Map</h2>
                  <p
                    className={`text-xs ${
                      addPrompt ? "text-violet-700 font-medium" : "text-stone-500"
                    }`}
                  >
                    Tap anywhere on the map to add a hidden spot
                  </p>
                </div>
                {addPrompt && (
                  <span className="inline-flex items-center gap-1.5 shrink-0 rounded-full bg-violet-50 text-violet-700 ring-1 ring-violet-200 px-3 py-1 text-xs font-medium animate-pulse">
                    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z" />
                      <circle cx="12" cy="11" r="2.5" />
                    </svg>
                    Click a location
                  </span>
                )}
              </div>
              <div className="relative overflow-hidden border-t border-stone-200/70">
                <MapView
                  onAddLocation={handleAddLocation}
                  highlightedCoords={highlightedCoords}
                  className="h-[52vh] min-h-[320px] lg:h-[calc(100vh-11rem)] w-full"
                />
              </div>
            </div>

            {/* 📝 ADD SPOT FORM — shown under the map when a point is chosen */}
            {selectedCoords && (
              <div className="mt-6">
                <SpotForm
                  coords={selectedCoords}
                  onSubmit={handleFormSubmit}
                  onCancel={() => setSelectedCoords(null)}
                />
              </div>
            )}
          </section>

          {/* 🧱 DISCOVERY LIST PANE */}
          <section className="lg:col-span-5 xl:col-span-4">
            {/* 🔎 DISCOVERY FILTER AREA */}
            <div className="mb-6 space-y-4">
              {/* Title + result count */}
              <div className="flex items-end justify-between gap-3">
                <div>
                  <h2 className="font-display text-2xl font-bold tracking-tight text-stone-900">Discover Spots</h2>
                  <p className="text-sm text-stone-500">Handpicked places worth the detour</p>
                </div>
                <span className="shrink-0 text-xs font-medium text-stone-500 bg-[#fdfbf7] border border-stone-200/80 rounded-full px-3 py-1">
                  {spots.length} {spots.length === 1 ? "spot" : "spots"}
                  {selectedCategory ? ` · ${selectedCategory}` : ""}
                </span>
              </div>

              {/* Category filter pills */}
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
                {CATEGORIES.map((cat) => {
                  const active = selectedCategory === cat.value;
                  return (
                    <button
                      key={cat.value || "all"}
                      type="button"
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`inline-flex items-center gap-1.5 shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                        active
                          ? "bg-stone-900 text-white"
                          : "bg-[#fdfbf7] text-stone-600 border border-stone-200/80 hover:border-stone-300 hover:text-stone-900"
                      }`}
                    >
                      {cat.dot && (
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${cat.dot} ${
                            active ? "opacity-100" : "opacity-90"
                          }`}
                        />
                      )}
                      {cat.label}
                    </button>
                  );
                })}
              </div>

              {/* Limit segmented control */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs text-stone-400">Show</span>
                <div className="inline-flex items-center rounded-full bg-stone-900/5 p-1">
                  {[4, 8, 12, 20].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setLimit(n)}
                      className={`min-w-[2.25rem] rounded-full px-3 py-1 text-xs font-medium transition ${
                        limit === n
                          ? "bg-[#fdfbf7] text-stone-900 shadow-sm"
                          : "text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 🧱 CARDS — vertical discovery list beside the map */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
              {spots.length === 0 ? (
                <div className="rounded-xl border border-dashed border-stone-300 bg-[#fdfbf7] p-10 text-center">
                  <p className="text-stone-600 text-sm">No spots added yet.</p>
                  <p className="text-stone-400 text-xs mt-1">
                    Tap the map to mark your first hidden place.
                  </p>
                </div>
              ) : (
                spots.map((spot) => {
                  const isActive =
                    highlightedCoords &&
                    highlightedCoords.lat === spot.coordinates.lat &&
                    highlightedCoords.lng === spot.coordinates.lng;

                  const photoCount = spot.imageUrls?.length || 0;
                  const categoryDot =
                    {
                      Nature: "bg-emerald-500",
                      Historical: "bg-amber-500",
                      Food: "bg-rose-500",
                      Spiritual: "bg-violet-500",
                      Adventure: "bg-sky-500",
                    }[spot.category] || "bg-stone-300";

                  return (
                    <article
                      key={spot._id}
                      onClick={() =>
                        setHighlightedCoords({
                          lat: spot.coordinates.lat,
                          lng: spot.coordinates.lng,
                        })
                      }
                      className={`group cursor-pointer bg-[#fdfbf7] rounded-xl overflow-hidden border transition duration-300 hover:-translate-y-0.5 hover:shadow-md ${
                        isActive
                          ? "border-violet-500 ring-1 ring-violet-500"
                          : "border-stone-200/80 hover:border-stone-300"
                      }`}
                    >
                      {/* 📸 PHOTO-FIRST HERO — title + category live on the image */}
                      <div className="relative h-60 overflow-hidden bg-stone-100">
                        {spot.imageUrls?.[0] ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightbox({
                                images: spot.imageUrls,
                                title: spot.title,
                                startIndex: 0,
                              });
                            }}
                            aria-label={`View photos of ${spot.title}`}
                            className="block h-full w-full cursor-zoom-in focus:outline-none"
                          >
                            <img
                              src={spot.imageUrls[0]}
                              alt={spot.title}
                              loading="lazy"
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          </button>
                        ) : (
                          <div className="h-full w-full flex flex-col items-center justify-center gap-1 bg-stone-100 text-stone-400">
                            <span className="text-2xl">🧭</span>
                            <span className="text-xs">No photo yet</span>
                          </div>
                        )}

                        {/* readability gradient for overlaid text (non-interactive) */}
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                        {/* category pill (top-left) */}
                        <span className="pointer-events-none absolute top-3 left-3 inline-flex items-center gap-1.5 bg-[#fdfbf7]/95 backdrop-blur text-stone-700 text-[11px] font-medium px-2.5 py-1 rounded-full">
                          <span className={`h-1.5 w-1.5 rounded-full ${categoryDot}`} />
                          {spot.category}
                        </span>

                        {/* multi-photo indicator (top-right) — opens the gallery */}
                        {photoCount > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setLightbox({
                                images: spot.imageUrls,
                                title: spot.title,
                                startIndex: 0,
                              });
                            }}
                            aria-label={`View all ${photoCount} photos of ${spot.title}`}
                            className="absolute top-3 right-3 inline-flex items-center gap-1 bg-black/55 backdrop-blur text-white text-[11px] font-medium px-2 py-1 rounded-full hover:bg-black/70 transition"
                          >
                            <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2">
                              <rect x="3" y="3" width="14" height="14" rx="2" />
                              <path d="M7 21h12a2 2 0 0 0 2-2V9" />
                            </svg>
                            {photoCount}
                          </button>
                        )}

                        {/* title overlaid on photo (editorial style) */}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 p-4">
                          <h3 className="font-display text-white font-semibold text-xl leading-snug tracking-tight drop-shadow-sm line-clamp-2">
                            {spot.title}
                          </h3>
                        </div>
                      </div>

                      {/* ✍️ STORY BODY */}
                      <div className="p-4 space-y-3">
                        <p className="text-[15px] text-stone-600 leading-relaxed line-clamp-3">
                          {spot.description}
                        </p>

                        <div className="flex items-center justify-between border-t border-stone-200/70 pt-3">
                          <span className="inline-flex items-center gap-1 text-xs text-stone-500">
                            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2">
                              <path d="M12 21s-6-5.686-6-10a6 6 0 1 1 12 0c0 4.314-6 10-6 10Z" />
                              <circle cx="12" cy="11" r="2" />
                            </svg>
                            {spot.coordinates.lat.toFixed(2)}, {spot.coordinates.lng.toFixed(2)}
                          </span>
                          <span className="text-xs text-stone-400">
                            {new Date(spot.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
            </div>
          </section>
        </div>
      </main>

      {/* 🖼 IMAGE LIGHTBOX / GALLERY */}
      {lightbox && (
        <Lightbox
          images={lightbox.images}
          title={lightbox.title}
          startIndex={lightbox.startIndex}
          onClose={() => setLightbox(null)}
        />
      )}
    </div>
  );
};

export default App;
