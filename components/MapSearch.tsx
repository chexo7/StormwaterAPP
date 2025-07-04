import React, { useState } from 'react';
import { useMap } from 'react-leaflet';

const MapSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const map = useMap();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    const coordMatch = q.match(/^(-?\d+(?:\.\d+)?)\s*,?\s*(-?\d+(?:\.\d+)?)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      map.flyTo([lat, lng], 12);
      return;
    }

    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          map.flyTo([lat, lon], 12);
        }
      }
    } catch (err) {
      console.error('Geocoding failed', err);
    }
  };

  return (
    <form onSubmit={handleSearch} className="absolute z-[1000] top-4 left-4 bg-gray-800/70 backdrop-blur p-2 rounded shadow flex space-x-2">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search address or lat,lng"
        className="bg-gray-700 text-gray-200 placeholder-gray-400 text-sm rounded px-2 py-1 focus:outline-none"
      />
      <button type="submit" className="px-2 py-1 text-sm bg-cyan-600 hover:bg-cyan-500 rounded text-white">Go</button>
    </form>
  );
};

export default MapSearch;
