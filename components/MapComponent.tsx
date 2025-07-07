import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, LayersControl, LayerGroup } from 'react-leaflet';
import AddressSearch from './AddressSearch';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import type { LayerData } from '../types';
import type { GeoJSON as LeafletGeoJSON, Layer } from 'leaflet';
import L from 'leaflet';

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY as string | undefined;

interface MapComponentProps {
  layers: LayerData[];
  onUpdateHsg: (layerId: string, featureIndex: number, newHsg: string) => void;
}

// This component renders a single GeoJSON layer and handles the auto-zooming effect.
// It must be a child of MapContainer to use the `useMap` hook.
const ManagedGeoJsonLayer = ({
  id,
  data,
  isLastAdded,
  onUpdateHsg,
}: {
  id: string;
  data: LayerData['geojson'];
  isLastAdded: boolean;
  onUpdateHsg: (layerId: string, featureIndex: number, newHsg: string) => void;
}) => {
  const geoJsonRef = useRef<LeafletGeoJSON | null>(null);
  const map = useMap();

  const onEachFeature = (feature: GeoJSON.Feature, layer: Layer) => {
    if (!feature.properties) return;
    const idx = (feature.properties as any).__idx ?? 0;
    const container = L.DomUtil.create('div');
    const propsDiv = L.DomUtil.create('div', '', container);
    propsDiv.style.maxHeight = '100px';
    propsDiv.style.overflowY = 'auto';
    propsDiv.style.fontFamily = 'sans-serif';
    Object.entries(feature.properties)
      .filter(([k]) => k !== '__idx')
      .forEach(([k, v]) => {
        const row = L.DomUtil.create('div', '', propsDiv);
        row.innerHTML = `<b>${k}:</b> ${v}`;
      });
    const label = L.DomUtil.create('label', '', container);
    label.innerHTML = '<br/><b>HSG:</b> ';
    const select = L.DomUtil.create('select', '', label) as HTMLSelectElement;
    ['A', 'B', 'C', 'D', 'N/A'].forEach(val => {
      const opt = L.DomUtil.create('option', '', select) as HTMLOptionElement;
      opt.value = val;
      opt.innerHTML = val;
      if (String(feature.properties?.HSG ?? 'N/A') === val) opt.selected = true;
    });
    const button = L.DomUtil.create('button', '', container);
    button.innerHTML = 'Save';
    button.style.display = 'block';
    button.style.marginTop = '4px';
    button.onclick = () => {
      const newHsg = select.value;
      onUpdateHsg(id, idx, newHsg);
      layer.closePopup();
    };
    layer.bindPopup(container);
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

const MapComponent: React.FC<MapComponentProps> = ({ layers, onUpdateHsg }) => {
  return (
    <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={true} className="h-full w-full relative">
      <div className="absolute top-2 left-2 z-[1000] w-64">
        <AddressSearch />
      </div>
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
        {layers.map((layer, index) => {
          const indexedGeojson = {
            ...layer.geojson,
            features: layer.geojson.features.map((f, i) => ({
              ...f,
              properties: { ...(f.properties || {}), __idx: i },
            })),
          };
          return (
            <LayersControl.Overlay checked name={layer.name} key={layer.id}>
              <ManagedGeoJsonLayer
                id={layer.id}
                data={indexedGeojson}
                isLastAdded={index === layers.length - 1}
                onUpdateHsg={onUpdateHsg}
              />
            </LayersControl.Overlay>
          );
        })}
      </LayersControl>
    </MapContainer>
  );
};

export default MapComponent;
