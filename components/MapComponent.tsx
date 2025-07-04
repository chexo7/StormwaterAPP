import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, LayersControl, LayerGroup } from 'react-leaflet';
import { Loader } from '@googlemaps/js-api-loader';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import type { LayerData } from '../types';
import type { GeoJSON as LeafletGeoJSON, Layer } from 'leaflet';

const googleMapsApiKey =
  (process.env.GOOGLE_MAPS_API_KEY as string | undefined) ||
  'AIzaSyBsEK-S5Kbf5aqYol5eGv8uYcPgLOlObr4';

interface MapComponentProps {
  layers: LayerData[];
}

// This component renders a single GeoJSON layer and handles the auto-zooming effect.
// It must be a child of MapContainer to use the `useMap` hook.
const ManagedGeoJsonLayer = ({
  id,
  data,
  isLastAdded,
}: {
  id: string;
  data: LayerData['geojson'];
  isLastAdded: boolean;
}) => {
  const geoJsonRef = useRef<LeafletGeoJSON | null>(null);
  const map = useMap();

  const onEachFeature = (feature: GeoJSON.Feature, layer: Layer) => {
    if (feature.properties) {
      const popupContent = `<div style="max-height: 150px; overflow-y: auto; font-family: sans-serif;">${Object.entries(feature.properties)
        .map(([key, value]) => `<b>${key}:</b> ${value}`)
        .join('<br/>')}</div>`;
      layer.bindPopup(popupContent);
    }
  };

  const geoJsonStyle = {
    color: '#06b6d4',      // cyan-500
    weight: 2,
    opacity: 1,
    fillColor: '#67e8f9',  // cyan-300
    fillOpacity: 0.5,
  };

  // This effect runs only for the last added layer to zoom to its bounds.
  useEffect(() => {
    if (isLastAdded && geoJsonRef.current) {
      const bounds = geoJsonRef.current.getBounds();
      if (bounds.isValid()) {
        map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }
    }
  }, [data, isLastAdded, map]);

  return (
    <GeoJSON
      key={id}
      data={data}
      style={geoJsonStyle}
      onEachFeature={onEachFeature}
      ref={geoJsonRef}
    />
  );
};

// Search box using Google Maps Places Autocomplete and Geocoding API
const SearchBox = ({ apiKey }: { apiKey?: string }) => {
  const [query, setQuery] = useState('');
  const [predictions, setPredictions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [service, setService] = useState<google.maps.places.AutocompleteService | null>(null);
  const map = useMap();

  // load the Google Maps JS API with Places library
  useEffect(() => {
    if (apiKey && !service) {
      const loader = new Loader({ apiKey, libraries: ['places'] });
      loader.load().then(() => {
        setService(new google.maps.places.AutocompleteService());
      });
    }
  }, [apiKey, service]);

  const runGeocode = async (text: string) => {
    if (!apiKey) return;
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(text)}&key=${apiKey}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.results && data.results[0]) {
      const { lat, lng } = data.results[0].geometry.location;
      map.flyTo([lat, lng], 14);
    } else {
      alert('Location not found');
    }
  };

  const handleSearch = async () => {
    const trimmed = query.trim();
    if (!trimmed) return;

    const coordMatch = trimmed.match(/^(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)/);
    if (coordMatch) {
      const lat = parseFloat(coordMatch[1]);
      const lng = parseFloat(coordMatch[2]);
      map.flyTo([lat, lng], 14);
      return;
    }

    await runGeocode(trimmed);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setQuery(text);
    if (service && text) {
      service.getPlacePredictions({ input: text }, preds => setPredictions(preds || []));
    } else {
      setPredictions([]);
    }
  };

  const selectPrediction = (p: google.maps.places.AutocompletePrediction) => {
    setQuery(p.description);
    setPredictions([]);
    if (apiKey) {
      fetch(`https://maps.googleapis.com/maps/api/geocode/json?place_id=${p.place_id}&key=${apiKey}`)
        .then(res => res.json())
        .then(data => {
          if (data.results && data.results[0]) {
            const { lat, lng } = data.results[0].geometry.location;
            map.flyTo([lat, lng], 14);
          }
        });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="absolute top-2 right-2 z-[1000] w-60">
      <div className="flex bg-white rounded shadow p-1">
        <input
          type="text"
          value={query}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search address or lat,lng"
          className="text-sm px-2 py-1 border border-gray-300 rounded-l focus:outline-none flex-1"
        />
        <button
          className="bg-cyan-600 text-white px-3 rounded-r text-sm"
          onClick={handleSearch}
        >
          Go
        </button>
      </div>
      {predictions.length > 0 && (
        <ul className="bg-white border border-gray-300 max-h-40 overflow-auto text-sm">
          {predictions.map(p => (
            <li
              key={p.place_id}
              className="px-2 py-1 cursor-pointer hover:bg-gray-100"
              onClick={() => selectPrediction(p)}
            >
              {p.description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const MapComponent: React.FC<MapComponentProps> = ({ layers }) => {
  return (
    <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={true} className="h-full w-full relative">
      <SearchBox apiKey={googleMapsApiKey} />
      <LayersControl position="topright">
        {/* Base Layers */}
        <LayersControl.BaseLayer checked name="Dark">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Street">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Satellite">
             <TileLayer
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Google Roadmap">
          <ReactLeafletGoogleLayer apiKey={googleMapsApiKey} type="roadmap" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Google Satellite">
          <ReactLeafletGoogleLayer apiKey={googleMapsApiKey} type="satellite" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Google Terrain">
          <ReactLeafletGoogleLayer apiKey={googleMapsApiKey} type="terrain" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Google Hybrid">
          <ReactLeafletGoogleLayer apiKey={googleMapsApiKey} type="hybrid" />
        </LayersControl.BaseLayer>
        <LayersControl.BaseLayer name="Hybrid">
            <LayerGroup>
                <TileLayer
                    url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                    attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                />
                 <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager_only_labels/{z}/{x}/{y}{r}.png"
                    attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                    pane="shadowPane" 
                />
            </LayerGroup>
        </LayersControl.BaseLayer>

        {/* Overlay Layers */}
        {layers.map((layer, index) => (
          <LayersControl.Overlay checked name={layer.name} key={layer.id}>
             <ManagedGeoJsonLayer
                id={layer.id}
                data={layer.geojson}
                isLastAdded={index === layers.length - 1}
             />
          </LayersControl.Overlay>
        ))}
      </LayersControl>
    </MapContainer>
  );
};

export default MapComponent;
