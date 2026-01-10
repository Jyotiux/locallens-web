import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const highlightedIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconSize: [28, 45],
  iconAnchor: [14, 45],
});

const DEFAULT_CENTER = [15.8281, 78.0373]; // Kurnool

const MapView = ({ onAddLocation, highlightedCoords }) => {
  const [markers, setMarkers] = useState([]);

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setMarkers([{ lat, lng }]);
        onAddLocation({ lat, lng });
      },
    });
    return null;
  };

  const HighlightHandler = ({ coords }) => {
    const map = useMap();

    useEffect(() => {
      if (coords?.lat && coords?.lng) {
        map.setView([coords.lat, coords.lng], 13, { animate: true });
      }
    }, [coords, map]);

    return null;
  };

  return (
    <MapContainer center={DEFAULT_CENTER} zoom={13} className="h-[500px] w-full rounded-md">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />

      <MapClickHandler />

      {highlightedCoords && <HighlightHandler coords={highlightedCoords} />}

      {markers.map((pos, i) => (
        <Marker key={i} position={[pos.lat, pos.lng]} icon={markerIcon} />
      ))}

      {highlightedCoords && (
        <Marker
          position={[highlightedCoords.lat, highlightedCoords.lng]}
          icon={highlightedIcon}
        />
      )}
    </MapContainer>
  );
};

export default MapView;
