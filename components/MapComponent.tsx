import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, LayersControl, LayerGroup, FeatureGroup } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import L from 'leaflet';
import { area as turfArea } from '@turf/turf';
import AddressSearch from './AddressSearch';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import type { LayerData } from '../types';
import type { GeoJSON as LeafletGeoJSON, Layer } from 'leaflet';

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY as string | undefined;

interface MapComponentProps {
  layers: LayerData[];
  onUpdateFeatureHsg: (layerId: string, featureIndex: number, hsg: string) => void;
  zoomToLayer?: { id: string; ts: number } | null;
  onLayerEdited: (id: string, geojson: LayerData['geojson']) => void;
}

// This component renders a single GeoJSON layer and handles the auto-zooming effect.
// It must be a child of MapContainer to use the `useMap` hook.
const ManagedGeoJsonLayer = ({
  id,
  data,
  isLastAdded,
  editable,
  onUpdateFeatureHsg,
  onLayerEdited,
}: {
  id: string;
  data: LayerData['geojson'];
  isLastAdded: boolean;
  editable: boolean | undefined;
  onUpdateFeatureHsg: (layerId: string, featureIndex: number, hsg: string) => void;
  onLayerEdited: (id: string, geojson: LayerData['geojson']) => void;
}) => {
  const geoJsonRef = useRef<LeafletGeoJSON | null>(null);
  const fgRef = useRef<L.FeatureGroup | null>(null);
  const map = useMap();

  const onEachFeature = (feature: GeoJSON.Feature, layer: Layer) => {
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

      // Area display
      const areaRow = L.DomUtil.create('div', '', propsDiv);
      const updateArea = () => {
        try {
          const areaSqM = turfArea(feature as any);
          const areaSqFt = areaSqM * 10.7639;
          const areaAc = areaSqM / 4046.8564224;
          areaRow.innerHTML = `<b>Area:</b> ${areaSqFt.toLocaleString(undefined, { maximumFractionDigits: 2 })} sf (${areaAc.toLocaleString(undefined, { maximumFractionDigits: 4 })} ac)`;
        } catch {
          areaRow.innerHTML = '<b>Area:</b> n/a';
        }
      };
      updateArea();
      layer.on('popupopen', updateArea);

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

  useEffect(() => {
    if (!fgRef.current) return;
    fgRef.current.eachLayer((layer: any) => {
      if (layer.editing) {
        if (editable) {
          layer.editing.enable();
        } else {
          layer.editing.disable();
        }
      }
    });
  }, [editable, data]);

  return (
    <FeatureGroup ref={fgRef as any}>
      {editable && (
        <EditControl
          position="topright"
          onEdited={() => {
            if (fgRef.current) {
              const gj = fgRef.current.toGeoJSON() as LayerData['geojson'];
              onLayerEdited(id, gj);
            }
          }}
          draw={{
            polygon: false,
            polyline: false,
            rectangle: false,
            circle: false,
            circlemarker: false,
            marker: false,
          }}
        />
      )}
      <GeoJSON
        key={id}
        data={data}
        style={geoJsonStyle}
        onEachFeature={onEachFeature}
        ref={geoJsonRef}
      />
    </FeatureGroup>
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

const MapComponent: React.FC<MapComponentProps> = ({ layers, onUpdateFeatureHsg, onLayerEdited, zoomToLayer }) => {
  return (
    <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={true} className="h-full w-full relative">
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
                editable={layer.editable}
                onUpdateFeatureHsg={onUpdateFeatureHsg}
                onLayerEdited={onLayerEdited}
             />
          </LayersControl.Overlay>
        ))}
      </LayersControl>
    </MapContainer>
  );
};

export default MapComponent;
