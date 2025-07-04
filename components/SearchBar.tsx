import React, { useState } from 'react';
import { useMap } from 'react-leaflet';
import { SearchIcon } from './Icons';

const SearchBar: React.FC = () => {
  const map = useMap();
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    const q = query.trim();
    if (!q) return;
    const coordMatch = q.match(/^(-?\d+(?:\.\d+)?)\s*,?\s*(-?\d+(?:\.\d+)?)$/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lon = parseFloat(coordMatch[2]);
      if (Math.abs(lat) <= 90 && Math.abs(lon) <= 180) {
        map.flyTo([lat, lon], 14);
        setError(null);
        return;
      }
      setError('Invalid coordinates');
      return;
    }
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
        { headers: { 'Accept': 'application/json' } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          const { lat, lon } = data[0];
          map.flyTo([parseFloat(lat), parseFloat(lon)], 14);
          setError(null);
        } else {
          setError('Location not found');
        }
      } else {
        setError('Geocoding error');
      }
    } catch (err) {
      console.error('Geocoding failed:', err);
      setError('Geocoding failed');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  return (
    <div className="absolute top-4 left-4 z-10 flex flex-col items-stretch space-y-1">
      <div className="bg-gray-800/70 backdrop-blur-sm rounded-lg flex overflow-hidden shadow-lg">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Address or lat,lng"
          className="bg-gray-700 text-gray-100 placeholder-gray-400 text-sm px-2 py-1 focus:outline-none flex-grow"
        />
        <button
          onClick={handleSearch}
          className="px-3 py-1 bg-gray-700 hover:bg-gray-600 text-gray-100 focus:outline-none"
          aria-label="Search"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      </div>
      {error && <span className="text-xs text-red-400 bg-gray-800/70 px-2 py-0.5 rounded-md">{error}</span>}
    </div>
  );
};

export default SearchBar;
