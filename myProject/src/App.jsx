import React, { useState, useEffect } from "react";
import MapView from "./components/ViewMap.jsx";
import SpotForm from "./components/SpotForm.jsx";

const API_BASE_URL = "https://locallens-8r2k.onrender.com";

const App = () => {
  const [selectedCoords, setSelectedCoords] = useState(null);
  const [spots, setSpots] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [limit, setLimit] = useState(4);
  const [highlightedCoords, setHighlightedCoords] = useState(null);

  const handleAddLocation = (coords) => {
    setSelectedCoords(coords);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">

      {/* 🔷 NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              LocalLens
            </h1>
            <p className="text-sm text-slate-500">
              Mark · Share · Explore hidden places
            </p>
          </div>
        </div>
      </header>

      {/* 🔷 MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-10">

        {/* 🗺 MAP SECTION */}
        <section className="bg-white rounded-xl shadow-md p-5">
          <h2 className="text-xl font-semibold mb-4">Explore Map</h2>

          {/* IMPORTANT: relative wrapper */}
          <div className="relative overflow-hidden rounded-lg border">
            <MapView
              onAddLocation={handleAddLocation}
              highlightedCoords={highlightedCoords}
            />
          </div>
        </section>

        {/* 📝 ADD SPOT FORM */}
        {selectedCoords && (
          <SpotForm
            coords={selectedCoords}
            onSubmit={handleFormSubmit}
            onCancel={() => setSelectedCoords(null)}
          />
        )}

        {/* 🧱 SPOTS SECTION */}
        <section className="bg-white rounded-xl shadow-md p-5">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <h2 className="text-xl font-semibold">Recent Spots</h2>

            <div className="flex gap-3 flex-wrap">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border rounded-md text-sm bg-slate-50"
              >
                <option value="">All Categories</option>
                <option value="Nature">Nature</option>
                <option value="Historical">Historical</option>
                <option value="Food">Local Food</option>
                <option value="Spiritual">Spiritual</option>
                <option value="Adventure">Adventure</option>
              </select>

              <select
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value))}
                className="px-3 py-2 border rounded-md text-sm bg-slate-50"
              >
                <option value={4}>4</option>
                <option value={8}>8</option>
                <option value={12}>12</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          {/* 🧱 CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
            {spots.length === 0 ? (
              <p className="text-slate-500 text-sm">No spots added yet.</p>
            ) : (
              spots.map((spot) => (
                <article
                  key={spot._id}
                  onClick={() =>
                    setHighlightedCoords({
                      lat: spot.coordinates.lat,
                      lng: spot.coordinates.lng,
                    })
                  }
                  className="group cursor-pointer bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition"
                >
                  <div className="relative h-40 overflow-hidden">
                    {spot.imageUrls?.[0] && (
                      <img
                        src={spot.imageUrls[0]}
                        alt={spot.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                    <span className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {spot.category}
                    </span>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg">{spot.title}</h3>
                    <p className="text-sm text-slate-600 line-clamp-2">
                      {spot.description}
                    </p>
                    <p className="text-xs text-slate-400">
                      {new Date(spot.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default App;
