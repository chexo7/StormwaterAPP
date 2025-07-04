import React, { useState } from 'react';
import { useMap } from 'react-leaflet';

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY as string | undefined;

const SearchBox: React.FC = () => {
  const map = useMap();
  const [query, setQuery] = useState('');

  const parseLatLng = (text: string): [number, number] | null => {
    const match = text.trim().match(/^(-?\d+(?:\.\d+)?)[ ,]+(-?\d+(?:\.\d+)?)$/);
    if (match) {
      return [parseFloat(match[1]), parseFloat(match[2])];
    }
    return null;
  };

  const handleSearch = async () => {
    if (!query) return;

    const latLng = parseLatLng(query);
    if (latLng) {
      map.flyTo(latLng, 14);
      return;
    }

    if (!googleMapsApiKey) {
      console.warn('Google Maps API key not configured');
      return;
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${googleMapsApiKey}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.status === 'OK' && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        map.flyTo([lat, lng], 14);
      } else {
        console.warn('Location not found');
      }
    } catch (err) {
      console.error('Geocoding error', err);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="leaflet-top leaflet-right leaflet-control p-2 pointer-events-auto">
      <div className="bg-gray-700/80 p-2 rounded shadow flex space-x-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search address or lat,lng"
          className="text-sm px-2 py-1 rounded text-gray-900 flex-1"
        />
        <button
          onClick={handleSearch}
          className="bg-cyan-600 hover:bg-cyan-500 text-white text-sm px-3 py-1 rounded"
        >
          Go
        </button>
      </div>
    </div>
  );
};

export default SearchBox;
