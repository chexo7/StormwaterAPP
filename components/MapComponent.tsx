import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, LayersControl, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import type { LayerData } from '../types';
import type { GeoJSON as LeafletGeoJSON, Layer } from 'leaflet';

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY || 'AIzaSyBsEK-S5Kbf5aqYol5eGv8uYcPgLOlObr4';

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

// Search control using Google Places and Geocoding APIs
const SearchBox = ({ apiKey }: { apiKey?: string }) => {
  const map = useMap();

  useEffect(() => {
    const container = L.DomUtil.create('div', 'leaflet-control');
    container.style.background = 'white';
    container.style.padding = '4px';
    container.style.borderRadius = '4px';
    container.style.boxShadow = '0 1px 3px rgba(0,0,0,0.3)';
    container.style.display = 'flex';
    container.style.alignItems = 'center';

    const input = L.DomUtil.create('input', '', container) as HTMLInputElement;
    input.type = 'text';
    input.placeholder = 'Search address or lat,lng';
    Object.assign(input.style, {
      border: '1px solid #ccc',
      padding: '2px 4px',
      fontSize: '12px',
      flex: '1',
    });

    const button = L.DomUtil.create('button', '', container) as HTMLButtonElement;
    button.innerText = 'Go';
    Object.assign(button.style, {
      marginLeft: '4px',
      background: '#0891b2',
      color: '#fff',
      border: 'none',
      padding: '2px 6px',
      fontSize: '12px',
      borderRadius: '2px',
      cursor: 'pointer',
    });

    const control = L.control({ position: 'topright' });
    control.onAdd = () => container;
    control.addTo(map);

    const handleSearch = async () => {
      const query = input.value.trim();
      if (!query) return;

      const coordMatch = query.match(/^(-?\d+(?:\.\d+)?)[,\s]+(-?\d+(?:\.\d+)?)/);
      if (coordMatch) {
        const lat = parseFloat(coordMatch[1]);
        const lng = parseFloat(coordMatch[2]);
        map.flyTo([lat, lng], 14);
        return;
      }

      if (!apiKey) {
        alert('Google Maps API key not configured');
        return;
      }

      try {
        let url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(query)}&inputtype=textquery&fields=geometry&key=${apiKey}`;
        let res = await fetch(url);
        let data = await res.json();
        let loc = data.candidates?.[0]?.geometry?.location;

        if (!loc) {
          url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(query)}&key=${apiKey}`;
          res = await fetch(url);
          data = await res.json();
          loc = data.results?.[0]?.geometry?.location;
        }

        if (loc) {
          map.flyTo([loc.lat, loc.lng], 14);
        } else {
          alert('Location not found');
        }
      } catch (err) {
        console.error('Search error', err);
        alert('Failed to search location');
      }
    };

    const keydown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleSearch();
    };

    input.addEventListener('keydown', keydown);
    button.addEventListener('click', handleSearch);

    return () => {
      input.removeEventListener('keydown', keydown);
      button.removeEventListener('click', handleSearch);
      map.removeControl(control);
    };
  }, [apiKey, map]);

  return null;
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
