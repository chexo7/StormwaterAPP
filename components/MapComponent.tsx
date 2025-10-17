import React, { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, GeoJSON, useMap, LayersControl, LayerGroup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet-draw';
import '@geoman-io/leaflet-geoman-free';
import { area as turfArea, intersect as turfIntersect } from '@turf/turf';
import AddressSearch from './AddressSearch';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';
import type { LayerData } from '../types';
import { formatDischargePointName } from '../utils/layerTransforms';
import {
  DEFAULT_DRAINAGE_AREA_NAMES,
  MAX_DISCHARGE_POINTS,
} from '../utils/constants';
import type { GeoJSON as LeafletGeoJSON, Layer } from 'leaflet';

const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY as string | undefined;

interface SmartSelectOption {
  value: string;
  label: string;
}

interface SmartSelectStyles {
  borderColor?: string;
  backgroundColor?: string;
  fontWeight?: string;
  marginLeft?: string;
  width?: string;
}

interface SmartSelectConfig {
  parent: HTMLElement;
  label: string;
  title?: string;
  value: string;
  options: SmartSelectOption[];
  placeholder?: string;
  usedValues?: Set<string>;
  onChange: (value: string) => void;
  styles?: SmartSelectStyles;
  keepCurrentValue?: boolean;
}

const appendSmartSelect = ({
  parent,
  label,
  title,
  value,
  options,
  placeholder = '--',
  usedValues,
  onChange,
  styles,
  keepCurrentValue = true,
}: SmartSelectConfig): HTMLSelectElement => {
  const row = L.DomUtil.create('div', '', parent);
  const labelEl = L.DomUtil.create('b', '', row);
  labelEl.textContent = label;
  const select = L.DomUtil.create('select', '', row) as HTMLSelectElement;
  select.title = title ?? label;
  select.style.marginLeft = styles?.marginLeft ?? '4px';
  if (styles?.borderColor) {
    select.style.border = `2px solid ${styles.borderColor}`;
  }
  if (styles?.backgroundColor) {
    select.style.backgroundColor = styles.backgroundColor;
  }
  if (styles?.fontWeight) {
    select.style.fontWeight = styles.fontWeight;
  }
  if (styles?.width) {
    select.style.width = styles.width;
  }

  const blank = L.DomUtil.create('option', '', select) as HTMLOptionElement;
  blank.value = '';
  blank.textContent = placeholder;

  let hasCurrent = false;
  options.forEach(option => {
    const opt = L.DomUtil.create('option', '', select) as HTMLOptionElement;
    opt.value = option.value;
    opt.textContent = option.label;
    if (usedValues && usedValues.has(option.value) && option.value !== value) {
      opt.disabled = true;
    }
    if (option.value === value) {
      opt.selected = true;
      hasCurrent = true;
    }
  });

  if (value && keepCurrentValue && !hasCurrent) {
    const opt = L.DomUtil.create('option', '', select) as HTMLOptionElement;
    opt.value = value;
    opt.textContent = value;
    opt.selected = true;
  }

  if (!value) {
    blank.selected = true;
  }

  select.addEventListener('change', e => {
    const newVal = (e.target as HTMLSelectElement).value;
    onChange(newVal);
  });

  L.DomEvent.disableClickPropagation(select);
  L.DomEvent.disableScrollPropagation(select);

  return select;
};

interface MapComponentProps {
  layers: LayerData[];
  onUpdateFeatureHsg: (layerId: string, featureIndex: number, hsg: string) => void;
  onUpdateFeatureDaName: (layerId: string, featureIndex: number, name: string) => void;
  onUpdateFeatureLandCover: (layerId: string, featureIndex: number, value: string) => void;
  onUpdateFeatureSubareaName?: (layerId: string, featureIndex: number, value: string) => void;
  onUpdateFeatureSubareaParent?: (layerId: string, featureIndex: number, value: string) => void;
  landCoverOptions: string[];
  zoomToLayer?: { id: string; ts: number } | null;
  editingTarget?: { layerId: string | null; featureIndex: number | null };
  onSelectFeatureForEditing?: (layerId: string, index: number) => void;
  onUpdateLayerGeojson?: (id: string, geojson: LayerData['geojson']) => void;
  onSaveEdits?: () => void;
  onDiscardEdits?: () => void;
  onLayerVisibilityChange?: (id: string, visible: boolean) => void;
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
  onUpdateFeatureSubareaName,
  onUpdateFeatureSubareaParent,
  landCoverOptions,
  layerName,
  isEditingLayer,
  editingFeatureIndex,
  onSelectFeature,
  onUpdateLayerGeojson,
  layerRef,
  fillColor,
  fillOpacity,
  subareaNameOptions,
  subareaDpOptions,
}: {
  id: string;
  data: LayerData['geojson'];
  isLastAdded: boolean;
  onUpdateFeatureHsg: (layerId: string, featureIndex: number, hsg: string) => void;
  onUpdateFeatureDaName: (layerId: string, featureIndex: number, name: string) => void;
  onUpdateFeatureLandCover: (layerId: string, featureIndex: number, value: string) => void;
  onUpdateFeatureSubareaName?: (layerId: string, featureIndex: number, value: string) => void;
  onUpdateFeatureSubareaParent?: (layerId: string, featureIndex: number, value: string) => void;
  landCoverOptions: string[];
  layerName: string;
  isEditingLayer: boolean;
  editingFeatureIndex: number | null;
  onSelectFeature?: (index: number) => void;
  onUpdateLayerGeojson?: (id: string, geojson: LayerData['geojson']) => void;
  layerRef?: (ref: LeafletGeoJSON | null) => void;
  fillColor: string;
  fillOpacity: number;
  subareaNameOptions?: string[];
  subareaDpOptions?: { value: string; label: string }[];
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

      // Render all properties except HSG when editable
      Object.entries(feature.properties).forEach(([k, v]) => {
        if (k === 'HSG' && layerName === 'Soil Layer from Web Soil Survey') return;
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
      if (layerName === 'Soil Layer from Web Soil Survey') {
        const currentHsg = feature.properties?.HSG == null ? '' : String(feature.properties?.HSG);
        feature.properties = { ...(feature.properties || {}), HSG: currentHsg };
        appendSmartSelect({
          parent: propsDiv,
          label: 'HSG:',
          title: 'Cambiar HSG',
          value: currentHsg,
          options: ['A', 'B', 'C', 'D'].map(val => ({ value: val, label: val })),
          placeholder: '-',
          styles: { borderColor: '#f59e0b', backgroundColor: '#fef3c7', fontWeight: 'bold' },
          onChange: newVal => {
            const idx = data.features.indexOf(feature);
            onUpdateFeatureHsg(id, idx, newVal);
            feature.properties!.HSG = newVal;
          },
        });
      } else if ('HSG' in feature.properties) {
        const hsgRow = L.DomUtil.create('div', '', propsDiv);
        hsgRow.innerHTML = `<b>HSG:</b> ${feature.properties!.HSG}`;
      }

      // Editable name for Drainage Areas
      if (layerName === 'Drainage Areas') {
        const formatted = formatDischargePointName((feature.properties as any)?.DA_NAME);
        feature.properties = {
          ...(feature.properties || {}),
          DA_NAME: formatted,
        };
        const currentValue = formatted;
        const usedNames = new Set(
          data.features
            .map(f => formatDischargePointName((f.properties as any)?.DA_NAME))
            .filter(n => n && n !== currentValue)
        );
        const dpOptions = Array.from({ length: MAX_DISCHARGE_POINTS }, (_, i) => i + 1).map(num => ({
          value: formatDischargePointName(num),
          label: String(num),
        }));
        appendSmartSelect({
          parent: propsDiv,
          label: 'Discharge Point #:',
          title: 'Seleccionar Discharge Point',
          value: currentValue,
          options: dpOptions,
          placeholder: '--',
          usedValues: usedNames,
          styles: { borderColor: '#3b82f6', backgroundColor: '#dbeafe', fontWeight: 'bold' },
          onChange: newVal => {
            const idx = data.features.indexOf(feature);
            onUpdateFeatureDaName(id, idx, newVal);
            feature.properties!.DA_NAME = newVal;
          },
        });
      }

      if (layerName === 'Drainage Subareas') {
        feature.properties = {
          ...(feature.properties || {}),
          SUBAREA_NAME: feature.properties?.SUBAREA_NAME ?? '',
          PARENT_DA: feature.properties?.PARENT_DA ?? '',
        };

        const maintainPopupState = () => {
          const leafletLayer = layer as L.Layer & {
            openPopup?: () => L.Layer;
            closePopup?: () => L.Layer;
            isPopupOpen?: () => boolean;
          };
          const hasName = Boolean(
            feature.properties!.SUBAREA_NAME &&
              String(feature.properties!.SUBAREA_NAME).trim()
          );
          const hasParent = Boolean(
            feature.properties!.PARENT_DA &&
              String(feature.properties!.PARENT_DA).trim()
          );
          if (hasName && hasParent) {
            if (leafletLayer.closePopup) {
              setTimeout(() => {
                leafletLayer.closePopup?.();
              }, 0);
            }
          } else if (leafletLayer.openPopup) {
            setTimeout(() => {
              leafletLayer.openPopup?.();
            }, 0);
          }
        };

        const currentSubName = feature.properties!.SUBAREA_NAME
          ? String(feature.properties!.SUBAREA_NAME).trim()
          : '';
        feature.properties!.SUBAREA_NAME = currentSubName;
        const usedSubNames = new Set(
          data.features
            .map(f => {
              const raw = (f.properties as any)?.SUBAREA_NAME;
              return raw == null ? '' : String(raw).trim();
            })
            .filter(name => name && name !== currentSubName)
        );
        appendSmartSelect({
          parent: propsDiv,
          label: 'Drainage Area Nombre:',
          title: 'Seleccionar nombre de Drainage Area',
          value: currentSubName,
          options: (subareaNameOptions || []).map(option => ({ value: option, label: option })),
          placeholder: '--',
          usedValues: usedSubNames,
          styles: { borderColor: '#2563eb', backgroundColor: '#dbeafe', fontWeight: 'bold' },
          onChange: newVal => {
            const idx = data.features.indexOf(feature);
            onUpdateFeatureSubareaName?.(id, idx, newVal);
            feature.properties!.SUBAREA_NAME = newVal;
            maintainPopupState();
          },
        });

        const currentParent = formatDischargePointName(feature.properties!.PARENT_DA);
        feature.properties!.PARENT_DA = currentParent;
        appendSmartSelect({
          parent: propsDiv,
          label: 'Discharge Point asociado:',
          title: 'Seleccionar Discharge Point para la Subarea',
          value: currentParent,
          options: (subareaDpOptions || []).map(option => ({ value: option.value, label: option.label })),
          placeholder: '--',
          styles: { borderColor: '#0ea5e9', backgroundColor: '#cffafe', fontWeight: 'bold' },
          onChange: newVal => {
            const idx = data.features.indexOf(feature);
            onUpdateFeatureSubareaParent?.(id, idx, newVal);
            feature.properties!.PARENT_DA = newVal;
            maintainPopupState();
          },
        });
      }

      // Editable land cover for Land Cover layers
      if (layerName === 'Land Cover') {
        const currentLandCover = feature.properties!.LAND_COVER as string;
        appendSmartSelect({
          parent: propsDiv,
          label: 'Land Cover:',
          title: 'Seleccionar Land Cover',
          value: currentLandCover || '',
          options: landCoverOptions.map(val => ({ value: val, label: val })),
          placeholder: '--',
          styles: {
            borderColor: '#f97316',
            backgroundColor: '#ffedd5',
            fontWeight: 'bold',
            marginLeft: '4px',
            width: '280px',
          },
          onChange: newVal => {
            const idx = data.features.indexOf(feature);
            onUpdateFeatureLandCover(id, idx, newVal);
            feature.properties!.LAND_COVER = newVal;
          },
        });
      }

      const popupOptions =
        layerName === 'Drainage Subareas'
          ? ({ closeOnClick: false, autoClose: false } as L.PopupOptions)
          : undefined;
      layer.bindPopup(container, popupOptions);

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
    color: '#000000',
    weight: 2,
    opacity: 1,
    fillColor,
    fillOpacity,
  };

  // This effect runs only for the last added layer to zoom to its bounds.
  useEffect(() => {
    if (isLastAdded && geoJsonRef.current) {
      const bounds = geoJsonRef.current.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds);
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
        map.fitBounds(bounds);
      }
    }
  }, [target, layers, map]);

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
  onUpdateFeatureSubareaName,
  onUpdateFeatureSubareaParent,
  landCoverOptions,
  zoomToLayer,
  editingTarget,
  onSelectFeatureForEditing,
  onUpdateLayerGeojson,
  onSaveEdits,
  onDiscardEdits,
  onLayerVisibilityChange,
}) => {
  const layerRefs = useRef<Record<string, L.GeoJSON | null>>({});
  const mapRef = useRef<L.Map | null>(null);

  const subareaNameOptions = useMemo(
    () => [...DEFAULT_DRAINAGE_AREA_NAMES],
    []
  );

  const subareaDpOptions = useMemo(() => {
    const daLayer = layers.find(l => l.name === 'Drainage Areas');
    if (!daLayer) return [] as { value: string; label: string }[];
    const options: { value: string; label: string; num: number }[] = [];
    daLayer.geojson.features.forEach(feature => {
      const raw = feature.properties ? (feature.properties as any).DA_NAME : null;
      const formatted = formatDischargePointName(raw);
      if (!formatted) return;
      const num = parseInt(formatted.replace(/[^0-9]/g, ''), 10);
      if (!Number.isFinite(num)) return;
      if (options.some(opt => opt.value === formatted)) return;
      options.push({ value: formatted, label: `${num} (${formatted})`, num });
    });
    options.sort((a, b) => a.num - b.num);
    return options.map(({ value, label }) => ({ value, label }));
  }, [layers]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !onLayerVisibilityChange) return;
    const handleAdd = (e: any) => {
      const layer = layers.find(l => l.name === e.name);
      if (layer) onLayerVisibilityChange(layer.id, true);
    };
    const handleRemove = (e: any) => {
      const layer = layers.find(l => l.name === e.name);
      if (layer) onLayerVisibilityChange(layer.id, false);
    };
    map.on('overlayadd', handleAdd);
    map.on('overlayremove', handleRemove);
    return () => {
      map.off('overlayadd', handleAdd);
      map.off('overlayremove', handleRemove);
    };
  }, [layers, onLayerVisibilityChange]);

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
    <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={true} className="h-full w-full relative" whenCreated={m => { mapRef.current = m; }}>
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
        <LayersControl.BaseLayer name="Dark">
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
        <LayersControl.BaseLayer checked name="Google Hybrid">
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
          <LayersControl.Overlay checked={layer.visible} name={layer.name} key={layer.id}>
             <ManagedGeoJsonLayer
                id={layer.id}
                data={layer.geojson}
                fillColor={layer.fillColor}
                fillOpacity={layer.fillOpacity}
                isLastAdded={index === layers.length - 1}
                onUpdateFeatureHsg={onUpdateFeatureHsg}
                onUpdateFeatureDaName={onUpdateFeatureDaName}
                onUpdateFeatureLandCover={onUpdateFeatureLandCover}
                onUpdateFeatureSubareaName={onUpdateFeatureSubareaName}
                onUpdateFeatureSubareaParent={onUpdateFeatureSubareaParent}
                landCoverOptions={landCoverOptions}
                layerName={layer.name}
                isEditingLayer={editingTarget?.layerId === layer.id}
                editingFeatureIndex={editingTarget?.layerId === layer.id ? editingTarget.featureIndex : null}
                onSelectFeature={idx => onSelectFeatureForEditing && onSelectFeatureForEditing(layer.id, idx)}
                onUpdateLayerGeojson={onUpdateLayerGeojson}
                layerRef={ref => { layerRefs.current[layer.id] = ref; }}
                subareaNameOptions={subareaNameOptions}
                subareaDpOptions={subareaDpOptions}
             />
          </LayersControl.Overlay>
        ))}
      </LayersControl>
    </MapContainer>
  );
};

export default MapComponent;
