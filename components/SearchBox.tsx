import React, { useState } from 'react';
import { useMap } from 'react-leaflet';

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY as string | undefined;

const SearchBox: React.FC = () => {
  const map = useMap();
  const [query, setQuery] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;

    const latLonMatch = q.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
    if (latLonMatch) {
      const lat = parseFloat(latLonMatch[1]);
      const lon = parseFloat(latLonMatch[2]);
      map.flyTo([lat, lon], 14);
      return;
    }

    if (!googleMapsApiKey) {
      alert('Google Maps API key not configured');
      return;
    }

    try {
      const res = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(q)}&key=${googleMapsApiKey}`);
      if (!res.ok) throw new Error('Request failed');
      const data = await res.json();
      const first = data.results?.[0];
      if (first) {
        const { lat, lng } = first.geometry.location;
        map.flyTo([lat, lng], 14);
      } else {
        alert('Location not found');
      }
    } catch (err) {
      console.error('Geocoding error', err);
      alert('Failed to search location');
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex bg-white rounded shadow-md overflow-hidden">
      <input
        type="text"
        className="px-2 py-1 text-sm text-gray-800 outline-none flex-grow"
        placeholder="Address or lat,lng"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button type="submit" className="px-3 bg-cyan-600 text-white text-sm">Go</button>
    </form>
  );
};

export default SearchBox;
