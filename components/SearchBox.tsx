import React, { useState } from 'react';
import { useMap } from 'react-leaflet';

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY as string | undefined;

const SearchBox: React.FC = () => {
  const [query, setQuery] = useState('');
  const map = useMap();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    const latLngMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
    if (latLngMatch) {
      const lat = parseFloat(latLngMatch[1]);
      const lng = parseFloat(latLngMatch[2]);
      map.flyTo([lat, lng], 14);
      return;
    }

    if (!googleMapsApiKey) return;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(trimmed)}&key=${googleMapsApiKey}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        map.flyTo([lat, lng], 14);
      }
    } catch (err) {
      console.error('Geocoding failed', err);
    }
  };

  return (
    <form onSubmit={handleSearch} className="absolute top-2 right-2 z-[1000] bg-gray-800/80 backdrop-blur p-2 rounded flex space-x-2">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search address or lat,lng"
        className="text-sm p-1 rounded bg-gray-700 placeholder-gray-400 text-white focus:outline-none"
      />
      <button type="submit" className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm px-2 py-1 rounded">
        Go
      </button>
    </form>
  );
};

export default SearchBox;
