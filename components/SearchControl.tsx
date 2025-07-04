import React, { useState } from 'react';
import { useMap } from 'react-leaflet';

const SearchControl: React.FC = () => {
  const map = useMap();
  const [query, setQuery] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // Check for "lat, lon" pattern
    const latLonMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
    if (latLonMatch) {
      const lat = parseFloat(latLonMatch[1]);
      const lon = parseFloat(latLonMatch[2]);
      map.flyTo([lat, lon], 14);
      return;
    }

    try {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(trimmed)}&format=json&limit=1`;
      const res = await fetch(url);
      if (res.ok) {
        const results = await res.json();
        if (results && results.length > 0) {
          const lat = parseFloat(results[0].lat);
          const lon = parseFloat(results[0].lon);
          map.flyTo([lat, lon], 14);
        }
      }
    } catch (err) {
      console.error('Geocoding error', err);
    }
  };

  return (
    <form onSubmit={handleSearch} className="absolute top-2 left-2 z-[1000] bg-gray-800/80 backdrop-blur-sm p-2 rounded shadow flex">
      <input
        type="text"
        placeholder="Buscar dirección o lat,long"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="text-sm px-2 py-1 rounded-l bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
      />
      <button type="submit" className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded-r text-sm">
        Buscar
      </button>
    </form>
  );
};

export default SearchControl;
