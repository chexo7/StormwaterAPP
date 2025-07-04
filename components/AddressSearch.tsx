import React, { useState } from 'react';
import { useMap } from 'react-leaflet';
import { SearchIcon } from './Icons';

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

const AddressSearch: React.FC = () => {
  const [query, setQuery] = useState('');
  const map = useMap();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    // Check for lat,long pattern
    const coordMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)[ ,]+(-?\d+(?:\.\d+)?)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lon = parseFloat(coordMatch[2]);
      map.flyTo([lat, lon], 14);
      return;
    }

    try {
      const params = new URLSearchParams({
        q: trimmed,
        format: 'json',
        addressdetails: '1',
        limit: '1'
      });
      const res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
        headers: { 'Accept-Language': 'en', 'User-Agent': 'shapefile-viewer-pro' }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.length > 0) {
          const { lat, lon } = data[0];
          map.flyTo([parseFloat(lat), parseFloat(lon)], 14);
        }
      } else {
        console.warn('Geocoding request failed', res.status);
      }
    } catch (err) {
      console.error('Geocoding error', err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2">
      <input
        type="text"
        className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-gray-100 placeholder-gray-500 focus:outline-none focus:border-cyan-400"
        placeholder="Address or lat,lng"
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <button
        type="submit"
        className="p-2 rounded bg-cyan-600 text-white hover:bg-cyan-500 focus:outline-none"
        aria-label="Search"
      >
        <SearchIcon className="w-5 h-5" />
      </button>
    </form>
  );
};

export default AddressSearch;
