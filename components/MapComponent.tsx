import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, LayersControl, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import '@geoman-io/leaflet-geoman-free';
import { area as turfArea, intersect as turfIntersect } from '@turf/turf';
import AddressSearch from './AddressSearch';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import type { LayerData } from '../types';
import type { GeoJSON as LeafletGeoJSON, Layer } from 'leaflet';

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY as string | undefined;

interface MapComponentProps {
  layers: LayerData[];
  onUpdateFeatureHsg: (layerId: string, featureIndex: number, hsg: string) => void;
  onUpdateFeatureDaName: (layerId: string, featureIndex: number, name: string) => void;
  onUpdateFeatureLandCover: (layerId: string, featureIndex: number, value: string) => void;
  landCoverOptions: string[];
  zoomToLayer?: { id: string; ts: number } | null;
  editingTarget?: { layerId: string | null; featureIndex: number | null };
  onSelectFeatureForEditing?: (layerId: string, index: number) => void;
  onUpdateLayerGeojson?: (id: string, geojson: LayerData['geojson']) => void;
  onSaveEdits?: () => void;
  onDiscardEdits?: () => void;
}

// This component renders a single GeoJSON layer and handles the auto-zooming effect.
// It must be a child of MapContainer to use the `useMap` hook.
const ManagedGeoJsonLayer = ({
  id,
  data,
  isLastAdded,
  onUpdateFeatureHsg,
  onUpdateFeatureDaName,
  onUpdateFeatureLandCover,
  landCoverOptions,
  layerName,
  isEditingLayer,
  editingFeatureIndex,
  onSelectFeature,
  onUpdateLayerGeojson,
  layerRef,
}: {
  id: string;
  data: LayerData['geojson'];
  isLastAdded: boolean;
  onUpdateFeatureHsg: (layerId: string, featureIndex: number, hsg: string) => void;
  onUpdateFeatureDaName: (layerId: string, featureIndex: number, name: string) => void;
  onUpdateFeatureLandCover: (layerId: string, featureIndex: number, value: string) => void;
  landCoverOptions: string[];
  layerName: string;
  isEditingLayer: boolean;
  editingFeatureIndex: number | null;
  onSelectFeature?: (index: number) => void;
  onUpdateLayerGeojson?: (id: string, geojson: LayerData['geojson']) => void;
  layerRef?: (ref: LeafletGeoJSON | null) => void;
}) => {
  const geoJsonRef = useRef<LeafletGeoJSON | null>(null);
  const map = useMap();

  // Expose layer ref to parent component so it can fetch latest geometry
  useEffect(() => {
    if (layerRef) layerRef(geoJsonRef.current);
    return () => {
      if (layerRef) layerRef(null);
    };
  }, [layerRef]);

  // Enable or disable vertex editing using Leaflet-Geoman
  useEffect(() => {
    if (!geoJsonRef.current) return;
    geoJsonRef.current.eachLayer((layer: any) => {
      const idx = data.features.indexOf(layer.feature as any);
      if (isEditingLayer && editingFeatureIndex === idx) {
        layer.pm.enable({
          snappable: true,
          allowSelfIntersection: false,
          removeVertexOn: 'click',
        });
      } else {
        layer.pm.disable();
      }
    });
  }, [isEditingLayer, editingFeatureIndex, data]);

  // Refresh geometry when `data` changes so edits or discards show immediately
  useEffect(() => {
    if (!geoJsonRef.current) return;
    geoJsonRef.current.clearLayers();
    geoJsonRef.current.addData(data as any);
  }, [data]);

  // Allow switching the polygon being edited by clicking any feature
  useEffect(() => {
    if (!geoJsonRef.current || !onSelectFeature) return;
    const handlers: [Layer, () => void][] = [];
    if (isEditingLayer) {
      geoJsonRef.current.eachLayer((layer: any) => {
        const idx = data.features.indexOf(layer.feature as any);
        const handler = () => onSelectFeature(idx);
        layer.on('click', handler);
        handlers.push([layer, handler]);
      });
    }
    return () => {
      handlers.forEach(([layer, handler]) => layer.off('click', handler));
    };
  }, [isEditingLayer, onSelectFeature, data]);

  // When geometry is edited via Geoman, propagate changes up
  useEffect(() => {
    if (!geoJsonRef.current || !onUpdateLayerGeojson) return;
    const handler = () => {
      const updated = geoJsonRef.current!.toGeoJSON() as LayerData['geojson'];
      onUpdateLayerGeojson(id, updated);
    };
    geoJsonRef.current.on('pm:update', handler);
    return () => {
      geoJsonRef.current?.off('pm:update', handler);
    };
  }, [id, onUpdateLayerGeojson]);

  const onEachFeature = (feature: GeoJSON.Feature, layer: Layer) => {
    if (feature.properties) {
      const container = L.DomUtil.create('div');
      container.style.maxHeight = '150px';
      container.style.overflowY = 'auto';
      container.style.fontFamily = 'sans-serif';
      if (layerName === 'Land Cover') {
        container.style.minWidth = '320px';
      }

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
          const poly = layer.toGeoJSON() as any;
          const areaSqM = turfArea(poly);
          const areaSqFt = areaSqM * 10.7639;
          const areaAc = areaSqM / 4046.8564224;
          areaRow.innerHTML = `<b>Area:</b> ${areaSqFt.toLocaleString(undefined, { maximumFractionDigits: 2 })} sf (${areaAc.toLocaleString(undefined, { maximumFractionDigits: 4 })} ac)`;
        } catch {
          areaRow.innerHTML = '<b>Area:</b> n/a';
        }
      };
      updateArea();
      layer.on('popupopen', updateArea);
      layer.on('pm:update', updateArea);

      // Special editable field for HSG
      if (layerName === 'Soil Layer from Web Soil Survey' || 'HSG' in feature.properties) {
        feature.properties = { ...(feature.properties || {}), HSG: feature.properties?.HSG ?? '' };
        const hsgRow = L.DomUtil.create('div', '', propsDiv);
        const label = L.DomUtil.create('b', '', hsgRow);
        label.textContent = 'HSG: ';
        const select = L.DomUtil.create('select', '', hsgRow) as HTMLSelectElement;
        select.title = 'Cambiar HSG';
        select.style.marginLeft = '4px';
        select.style.border = '2px solid #f59e0b';
        select.style.backgroundColor = '#fef3c7';
        select.style.fontWeight = 'bold';
        const blank = L.DomUtil.create('option', '', select) as HTMLOptionElement;
        blank.value = '';
        blank.textContent = '-';
        ['A', 'B', 'C', 'D'].forEach(val => {
          const opt = L.DomUtil.create('option', '', select) as HTMLOptionElement;
          opt.value = val;
          opt.textContent = val;
          if (feature.properties!.HSG === val) opt.selected = true;
        });
        if (!feature.properties!.HSG) blank.selected = true;
        select.addEventListener('change', (e) => {
          const newVal = (e.target as HTMLSelectElement).value;
          const idx = data.features.indexOf(feature);
          onUpdateFeatureHsg(id, idx, newVal);
          feature.properties!.HSG = newVal;
        });
      }

      // Editable name for Drainage Areas
      if (layerName === 'Drainage Areas') {
        const nameRow = L.DomUtil.create('div', '', propsDiv);
        const nLabel = L.DomUtil.create('b', '', nameRow);
        nLabel.textContent = 'Name: ';
        const select = L.DomUtil.create('select', '', nameRow) as HTMLSelectElement;
        select.title = 'Seleccionar nombre';
        select.style.marginLeft = '4px';
        select.style.border = '2px solid #3b82f6';
        select.style.backgroundColor = '#dbeafe';
        select.style.fontWeight = 'bold';
        const blank = L.DomUtil.create('option', '', select) as HTMLOptionElement;
        blank.value = '';
        blank.textContent = '--';
        const allNames = Array.from({ length: 26 }, (_, i) => `DA-${String.fromCharCode(65 + i)}`);
        const usedNames = data.features
          .filter(f => f !== feature)
          .map(f => (f.properties?.DA_NAME as string))
          .filter(n => n);
        const availableNames = allNames.filter(n => n === feature.properties!.DA_NAME || !usedNames.includes(n));
        availableNames.forEach(val => {
          const opt = L.DomUtil.create('option', '', select) as HTMLOptionElement;
          opt.value = val;
          opt.textContent = val;
          if (feature.properties!.DA_NAME === val) opt.selected = true;
        });
        if (!feature.properties!.DA_NAME) blank.selected = true;
        select.addEventListener('change', (e) => {
          const newVal = (e.target as HTMLSelectElement).value;
          const idx = data.features.indexOf(feature);
          onUpdateFeatureDaName(id, idx, newVal);
          feature.properties!.DA_NAME = newVal;
        });
      }

      // Editable land cover for Land Cover layers
      if (layerName === 'Land Cover') {
        const lcRow = L.DomUtil.create('div', '', propsDiv);
        const lcLabel = L.DomUtil.create('b', '', lcRow);
        lcLabel.textContent = 'Land Cover: ';
        const select = L.DomUtil.create('select', '', lcRow) as HTMLSelectElement;
        select.title = 'Seleccionar Land Cover';
        select.style.marginLeft = '4px';
        select.style.border = '2px solid #f97316';
        select.style.backgroundColor = '#ffedd5';
        select.style.fontWeight = 'bold';
        select.style.width = '280px';
        const blank = L.DomUtil.create('option', '', select) as HTMLOptionElement;
        blank.value = '';
        blank.textContent = '--';
        landCoverOptions.forEach(val => {
          const opt = L.DomUtil.create('option', '', select) as HTMLOptionElement;
          opt.value = val;
          opt.textContent = val;
          if (feature.properties!.LAND_COVER === val) opt.selected = true;
        });
        if (!feature.properties!.LAND_COVER) blank.selected = true;
        select.addEventListener('change', (e) => {
          const newVal = (e.target as HTMLSelectElement).value;
          const idx = data.features.indexOf(feature);
          onUpdateFeatureLandCover(id, idx, newVal);
          feature.properties!.LAND_COVER = newVal;
        });
      }

      layer.bindPopup(container);

      if (isEditingLayer && editingFeatureIndex === null && onSelectFeature) {
        const handler = () => {
          const idx = data.features.indexOf(feature);
          onSelectFeature(idx);
        };
        layer.once('click', handler);
      }
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

const MapPmOptIn = () => {
  const map = useMap();
  useEffect(() => {
    try {
      (map.pm as any).setOptIn(true);
    } catch {
      /* noop */
    }
  }, [map]);
  return null;
};

const GeomanControls = ({
  active,
  layer,
  onChange,
}: {
  active: boolean;
  layer: L.GeoJSON | null;
  onChange?: (geojson: LayerData['geojson']) => void;
}) => {
  const map = useMap();
  const editBackup = useRef<LayerData['geojson'] | null>(null);
  const dragBackup = useRef<LayerData['geojson'] | null>(null);
  useEffect(() => {
    if (!active || !layer) return;

    map.pm.addControls({
      position: 'topleft',
      drawMarker: false,
      drawPolyline: false,
      drawCircle: false,
      drawRectangle: false,
      drawCircleMarker: false,
      drawText: false,
      drawPolygon: true,
      editMode: true,
      dragMode: true,
      cutPolygon: true,
      removalMode: true,
    });

    // Order the toolbar: create, edit tools, then delete
    const toolOrder = ['drawPolygon', 'editMode', 'dragMode', 'cutPolygon', 'removalMode'];
    try {
      // changeControlOrder is only available in newer versions
      (map.pm as any).Toolbar.changeControlOrder(toolOrder);
    } catch {
      /* noop */
    }

    map.pm.setGlobalOptions({
      layerGroup: layer,
      snappable: true,
      snapDistance: 20,
      snapSegment: true,
      allowSelfIntersection: false,
      removeVertexOn: 'click',
    });
    try {
      (map.pm as any).applyGlobalOptions();
    } catch {
      /* noop */
    }

    // Add Cancel actions for edit and drag modes
    try {
      (map.pm as any).Toolbar.changeActionsOfControl('editMode', [
        {
          text: 'Cancel',
          onClick: () => {
            if (editBackup.current) {
              layer.clearLayers();
              layer.addData(editBackup.current as any);
              onChange && onChange(layer.toGeoJSON() as LayerData['geojson']);
            }
            map.pm.disableGlobalEditMode();
          },
        },
        'finishMode',
      ]);
      (map.pm as any).Toolbar.changeActionsOfControl('dragMode', [
        {
          text: 'Cancel',
          onClick: () => {
            if (dragBackup.current) {
              layer.clearLayers();
              layer.addData(dragBackup.current as any);
              onChange && onChange(layer.toGeoJSON() as LayerData['geojson']);
            }
            map.pm.disableGlobalDragMode();
          },
        },
        'finishMode',
      ]);
    } catch {
      /* noop */
    }

    const handleEditToggle = (e: any) => {
      if (e.enabled) {
        editBackup.current = layer.toGeoJSON() as LayerData['geojson'];
      }
    };
    const handleDragToggle = (e: any) => {
      if (e.enabled) {
        dragBackup.current = layer.toGeoJSON() as LayerData['geojson'];
      }
    };

    map.on('pm:globaleditmodetoggled', handleEditToggle);
    map.on('pm:globaldragmodetoggled', handleDragToggle);

    const checkOverlap = (target: L.Layer) => {
      const newPoly = (target as any).toGeoJSON();
      let hasOverlap = false;
      layer.eachLayer((other: any) => {
        if (other === target) return;
        const overlap = turfIntersect(newPoly as any, other.toGeoJSON());
        if (overlap) hasOverlap = true;
      });
      if (hasOverlap) alert('¡Cuidado! El polígono se solapa.');
    };

    const handleCreate = (e: any) => {
      checkOverlap(e.layer);
      onChange && onChange(layer.toGeoJSON() as LayerData['geojson']);
    };
    const handleRemove = () => {
      onChange && onChange(layer.toGeoJSON() as LayerData['geojson']);
    };
    const handleEdit = (e: any) => {
      checkOverlap(e.layer);
      onChange && onChange(layer.toGeoJSON() as LayerData['geojson']);
    };

    map.on('pm:create', handleCreate);
    map.on('pm:remove', handleRemove);
    map.on('pm:edit', handleEdit);

    return () => {
      map.off('pm:create', handleCreate);
      map.off('pm:remove', handleRemove);
      map.off('pm:edit', handleEdit);
      map.off('pm:globaleditmodetoggled', handleEditToggle);
      map.off('pm:globaldragmodetoggled', handleDragToggle);
      map.pm.disableGlobalEditMode();
      map.pm.disableGlobalDragMode();
      map.pm.removeControls();
    };
  }, [active, layer, map, onChange]);
  return null;
};

const MapComponent: React.FC<MapComponentProps> = ({
  layers,
  onUpdateFeatureHsg,
  onUpdateFeatureDaName,
  onUpdateFeatureLandCover,
  landCoverOptions,
  zoomToLayer,
  editingTarget,
  onSelectFeatureForEditing,
  onUpdateLayerGeojson,
  onSaveEdits,
  onDiscardEdits,
}) => {
  const layerRefs = useRef<Record<string, L.GeoJSON | null>>({});

  const handleSaveClick = () => {
    if (editingTarget?.layerId) {
      const ref = layerRefs.current[editingTarget.layerId];
      if (ref && onUpdateLayerGeojson) {
        const latest = ref.toGeoJSON() as LayerData['geojson'];
        onUpdateLayerGeojson(editingTarget.layerId, latest);
      }
    }
    if (onSaveEdits) onSaveEdits();
  };
  return (
    <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={true} className="h-full w-full relative">
      <MapPmOptIn />
      <ZoomToLayerHandler layers={layers} target={zoomToLayer ?? null} />
      <GeomanControls
        active={!!editingTarget?.layerId}
        layer={editingTarget?.layerId ? layerRefs.current[editingTarget.layerId] : null}
        onChange={(geo) => {
          if (editingTarget?.layerId && onUpdateLayerGeojson) {
            onUpdateLayerGeojson(editingTarget.layerId, geo);
          }
        }}
      />
      <div className="absolute top-2 left-2 z-[1000] w-64">
        <AddressSearch />
      </div>
      {editingTarget?.layerId && editingTarget.featureIndex === null && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-[1000] bg-gray-800/90 text-white px-3 py-1 rounded shadow">
          Haz clic en un polígono para editarlo
        </div>
      )}
      {editingTarget?.layerId && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[1000] space-x-2">
          <button
            onClick={handleSaveClick}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded shadow"
          >
            Guardar
          </button>
          <button
            onClick={onDiscardEdits}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow"
          >
            Descartar
          </button>
        </div>
      )}
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
                onUpdateFeatureDaName={onUpdateFeatureDaName}
                onUpdateFeatureLandCover={onUpdateFeatureLandCover}
                landCoverOptions={landCoverOptions}
                layerName={layer.name}
                isEditingLayer={editingTarget?.layerId === layer.id}
                editingFeatureIndex={editingTarget?.layerId === layer.id ? editingTarget.featureIndex : null}
                onSelectFeature={idx => onSelectFeatureForEditing && onSelectFeatureForEditing(layer.id, idx)}
                onUpdateLayerGeojson={onUpdateLayerGeojson}
                layerRef={ref => { layerRefs.current[layer.id] = ref; }}
             />
          </LayersControl.Overlay>
        ))}
      </LayersControl>
    </MapContainer>
  );
};

export default MapComponent;
