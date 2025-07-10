import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, LayersControl, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import AddressSearch from './AddressSearch';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import type { LayerData } from '../types';
import type { GeoJSON as LeafletGeoJSON, Layer } from 'leaflet';
import type { Feature } from 'geojson';

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY as string | undefined;

interface MapComponentProps {
  layers: LayerData[];
  onUpdateFeatureHsg: (layerId: string, featureIndex: number, hsg: string) => void;
  zoomToLayer?: { id: string; ts: number } | null;
  isDrawingLod: boolean;
  onLodFeatureAdd: (feature: Feature) => void;
}

// This component renders a single GeoJSON layer and handles the auto-zooming effect.
// It must be a child of MapContainer to use the `useMap` hook.
const ManagedGeoJsonLayer = ({
  id,
  data,
  isLastAdded,
  onUpdateFeatureHsg,
}: {
  id: string;
  data: LayerData['geojson'];
  isLastAdded: boolean;
  onUpdateFeatureHsg: (layerId: string, featureIndex: number, hsg: string) => void;
}) => {
  const geoJsonRef = useRef<LeafletGeoJSON | null>(null);
  const map = useMap();

  const onEachFeature = (feature: Feature, layer: Layer) => {
    if (feature.properties) {
      const container = L.DomUtil.create('div');
      container.style.maxHeight = '150px';
      container.style.overflowY = 'auto';
      container.style.fontFamily = 'sans-serif';

      const propsDiv = L.DomUtil.create('div', '', container);

      // Render all properties except HSG
      Object.entries(feature.properties).forEach(([k, v]) => {
        if (k === 'HSG') return;
        const row = L.DomUtil.create('div', '', propsDiv);
        row.innerHTML = `<b>${k}:</b> ${v}`;
      });

      // Special editable field for HSG
      if ('HSG' in feature.properties) {
        const hsgRow = L.DomUtil.create('div', '', propsDiv);
        const label = L.DomUtil.create('b', '', hsgRow);
        label.textContent = 'HSG: ';
        const select = L.DomUtil.create('select', '', hsgRow) as HTMLSelectElement;
        select.title = 'Cambiar HSG';
        select.style.marginLeft = '4px';
        select.style.border = '2px solid #f59e0b';
        select.style.backgroundColor = '#fef3c7';
        select.style.fontWeight = 'bold';
        ['A', 'B', 'C', 'D'].forEach(val => {
          const opt = L.DomUtil.create('option', '', select) as HTMLOptionElement;
          opt.value = val;
          opt.textContent = val;
          if (feature.properties!.HSG === val) opt.selected = true;
        });
        select.addEventListener('change', (e) => {
          const newVal = (e.target as HTMLSelectElement).value;
          const idx = data.features.indexOf(feature);
          onUpdateFeatureHsg(id, idx, newVal);
          feature.properties!.HSG = newVal;
        });
      }

      layer.bindPopup(container);
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

const ZoomToLayerHandler = ({ layers, target }: { layers: LayerData[]; target: { id: string; ts: number } | null }) => {
  const map = useMap();

  useEffect(() => {
    if (!target) return;
    const layer = layers.find(l => l.id === target.id);
    if (layer) {
      const bounds = L.geoJSON(layer.geojson).getBounds();
      if (bounds.isValid()) {
        map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 16 });
      }
    }
  }, [target, layers, map]);

  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  layers,
  onUpdateFeatureHsg,
  zoomToLayer,
  isDrawingLod,
  onLodFeatureAdd,
}) => {
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!isDrawingLod || !mapRef.current) return;
    const map = mapRef.current;
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    const drawControl = new L.Control.Draw({
      draw: {
        polygon: true,
        polyline: false,
        rectangle: false,
        circle: false,
        marker: false,
        circlemarker: false,
      },
      edit: { featureGroup: drawnItems, edit: false, remove: false },
    });
    map.addControl(drawControl);

    const handleCreate = (e: any) => {
      drawnItems.addLayer(e.layer);
      const feature = e.layer.toGeoJSON() as Feature;
      onLodFeatureAdd(feature);
    };
    map.on(L.Draw.Event.CREATED, handleCreate);

    return () => {
      map.off(L.Draw.Event.CREATED, handleCreate);
      map.removeControl(drawControl);
      map.removeLayer(drawnItems);
    };
  }, [isDrawingLod, onLodFeatureAdd]);

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom={true}
      className="h-full w-full relative"
      whenCreated={(map) => {
        mapRef.current = map;
      }}
    >
      <ZoomToLayerHandler layers={layers} target={zoomToLayer ?? null} />
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
        {layers.map((layer, index) => (
          <LayersControl.Overlay checked name={layer.name} key={layer.id}>
             <ManagedGeoJsonLayer
                id={layer.id}
                data={layer.geojson}
                isLastAdded={index === layers.length - 1}
                onUpdateFeatureHsg={onUpdateFeatureHsg}
             />
          </LayersControl.Overlay>
        ))}
      </LayersControl>
    </MapContainer>
  );
};

export default MapComponent;
