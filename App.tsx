import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type {
  FeatureCollection,
  Feature,
  LineString,
  Point,
  Polygon,
  MultiPolygon,
} from 'geojson';
import type { LayerData, LogEntry } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import InfoPanel from './components/InfoPanel';
import MapComponent from './components/MapComponent';
import InstructionsPage from './components/InstructionsPage';
import { KNOWN_LAYER_NAMES } from './utils/constants';
import LayerPreview from './components/LayerPreview';
import ComputeModal, { ComputeTask } from './components/ComputeModal';
import ExportModal from './components/ExportModal';
import FieldMapModal from './components/FieldMapModal';
import { loadLandCoverList, loadCnValues, CnRecord } from './utils/landcover';
import { prepareForShapefile } from './utils/shp';
import proj4 from 'proj4';
import { STATE_PLANE_OPTIONS } from './utils/projections';
import type { ProjectionOption } from './types';
import { reprojectFeatureCollection } from './utils/reproject';
import { resolvePrj } from './utils/prj';
import { transformLayerGeojson, formatDischargePointName } from './utils/layerTransforms';

const SUBAREA_LAYER_NAME = 'Drainage Subareas';
const PROCESSED_SUBAREA_LAYER_NAME = 'Drainage Subareas (Computed)';
const DA_NAME_ATTR = 'DA_NAME';
const SUBAREA_NAME_ATTR = 'SUBAREA_NAME';
const SUBAREA_PARENT_ATTR = 'PARENT_DA';
const COMPLEMENT_FLAG_ATTR = 'IS_COMPLEMENT';
const SUBAREA_AREA_ATTR = 'SUBAREA_AC';
const SQM_TO_ACRES = 0.000247105381;
const SQM_TO_SQFT = 10.76391041671;
const AREA_TOLERANCE_SQM = 0.01;

const DEFAULT_COLORS: Record<string, string> = {
  'Drainage Areas': '#67e8f9',
  [SUBAREA_LAYER_NAME]: '#3b82f6',
  'Land Cover': '#22c55e',
  'LOD': '#ef4444',
  'Soil Layer from Web Soil Survey': '#8b4513',
  [PROCESSED_SUBAREA_LAYER_NAME]: '#38bdf8',
  Overlay: '#f97316',
};
const DEFAULT_OPACITY = 0.5;

const getDefaultColor = (name: string) => DEFAULT_COLORS[name] || '#67e8f9';

type UpdateHsgFn = (layerId: string, featureIndex: number, hsg: string) => void;
type UpdateDaNameFn = (layerId: string, featureIndex: number, name: string) => void;
type UpdateLandCoverFn = (layerId: string, featureIndex: number, value: string) => void;
type UpdateSubareaNameFn = (layerId: string, featureIndex: number, value: string) => void;
type UpdateSubareaParentFn = (layerId: string, featureIndex: number, value: string) => void;

const App: React.FC = () => {
  const [layers, setLayers] = useState<LayerData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [zoomToLayer, setZoomToLayer] = useState<{ id: string; ts: number } | null>(null);
  const [editingTarget, setEditingTarget] = useState<{
    layerId: string | null;
    featureIndex: number | null;
  }>({ layerId: null, featureIndex: null });
  const [editingBackup, setEditingBackup] = useState<{ layerId: string; geojson: FeatureCollection } | null>(null);
  const [landCoverOptions, setLandCoverOptions] = useState<string[]>([]);
  const [previewLayer, setPreviewLayer] = useState<{
    data: FeatureCollection;
    fileName: string;
    detectedName: string;
  } | null>(null);
  const [mappingLayer, setMappingLayer] = useState<{
    name: string;
    data: FeatureCollection;
  } | null>(null);
  const [computeTasks, setComputeTasks] = useState<ComputeTask[] | null>(null);
  const [computeSucceeded, setComputeSucceeded] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>('');
  const [projectVersion, setProjectVersion] = useState<string>('V1');
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [projection, setProjection] = useState<ProjectionOption>(STATE_PLANE_OPTIONS[0]);
  const [projectionConfirmed, setProjectionConfirmed] = useState<boolean>(false);

  const project = useMemo(() => proj4('EPSG:4326', projection.proj4), [projection]);

  const requiredLayers = [
    'Drainage Areas',
    SUBAREA_LAYER_NAME,
    'LOD',
    'Land Cover',
    'Soil Layer from Web Soil Survey',
  ];

  const lodLayer = layers.find(l => l.name === 'LOD');
  const lodValid = !!(
    lodLayer &&
    lodLayer.geojson.features.length === 1 &&
    lodLayer.geojson.features[0].geometry &&
    Array.isArray((lodLayer.geojson.features[0].geometry as any).coordinates)
  );

  const computeEnabled =
    requiredLayers.every(name => layers.some(l => l.name === name)) && lodValid;

  const cbLayer = layers.find(l => l.name === 'Catch Basins / Manholes');
  const pipesLayer = layers.find(l => l.name === 'Pipes');
  const pipe3DEnabled =
    !!cbLayer &&
    cbLayer.geojson.features.length > 0 &&
    !!pipesLayer &&
    pipesLayer.geojson.features.length > 0;

  const exportHydroCADEnabled = computeSucceeded;
  const exportShapefilesEnabled =
    (computeSucceeded || pipe3DEnabled) && projectionConfirmed;
  const exportSWMMEnabled = (computeSucceeded || pipe3DEnabled) && projectionConfirmed;
  const exportEnabled = computeSucceeded || pipe3DEnabled;

  const splitPipesAtNodes = (
    pipes: Feature<LineString>[],
    nodes: Feature<Point>[]
  ): Feature<LineString>[] => {
    const nodeSet = new Set(
      nodes
        .filter(n => n.geometry && n.geometry.type === 'Point')
        .map(n => (n.geometry as Point).coordinates.join(','))
    );
    const out: Feature<LineString>[] = [];
    pipes.forEach(p => {
      if (!p.geometry || p.geometry.type !== 'LineString') return;
      const coords = (p.geometry as LineString).coordinates;
      const splitIdxs: number[] = [];
      for (let i = 1; i < coords.length - 1; i++) {
        if (nodeSet.has(coords[i].join(','))) splitIdxs.push(i);
      }
      if (splitIdxs.length === 0) {
        out.push(p);
        return;
      }
      let prev = 0;
      const idxs = [...splitIdxs, coords.length - 1];
      idxs.forEach((idx, seg) => {
        const segCoords = coords.slice(prev, idx + 1);
        out.push({
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: segCoords },
          properties: { ...(p.properties || {}), _segment: seg + 1 },
        });
        prev = idx;
      });
    });
    return out;
  };

  const addLog = useCallback((message: string, type: 'info' | 'error' = 'info') => {
    setLogs(prev => [...prev, { message, type, source: 'frontend' as const }]);
  }, []);

  useEffect(() => {
    loadLandCoverList().then(list => setLandCoverOptions(list));
  }, []);

  useEffect(() => {
    if (!landCoverOptions.length) return;
    setLayers(prevLayers => {
      let layersChanged = false;
      const nextLayers = prevLayers.map(layer => {
        if (layer.name !== 'Land Cover') return layer;
        let layerChanged = false;
        const features = layer.geojson.features.map(f => {
          if (!f.properties) return f;
          const current = (f.properties as any)?.LAND_COVER;
          if (current == null) return f;
          const currentStr = String(current);
          if (currentStr === '') return f;
          const match = landCoverOptions.find(
            opt => opt.toLowerCase() === currentStr.toLowerCase()
          );
          if (!match || match === currentStr) return f;
          layerChanged = true;
          return { ...f, properties: { ...(f.properties || {}), LAND_COVER: match } };
        });
        if (!layerChanged) return layer;
        layersChanged = true;
        return { ...layer, geojson: { ...layer.geojson, features } };
      });
      return layersChanged ? nextLayers : prevLayers;
    });
  }, [landCoverOptions]);

  useEffect(() => {
    if (typeof window === 'undefined' || window.location.hostname !== 'localhost') return;

    const fetchBackendLogs = async () => {
      try {
        const res = await fetch('/api/logs');
        if (res.ok) {
          const data: LogEntry[] = await res.json();
          if (data.length > 0) {
            setLogs(prev => [...prev, ...data.map(l => ({ ...l, source: 'backend' as const }))]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch backend logs', err);
      }
    };
    fetchBackendLogs();
    const interval = setInterval(fetchBackendLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!computeTasks) return;
    if (computeTasks.every(t => t.status === 'success')) {
      setComputeSucceeded(true);
    }
    if (computeTasks.some(t => t.status === 'error')) {
      setComputeSucceeded(false);
    }
  }, [computeTasks]);

  const handleLayerAdded = useCallback((geojson: FeatureCollection, name: string, fieldMap?: Record<string, string>) => {
    setIsLoading(false);
    setError(null);
    if (geojson.features.length === 0) {
      const msg = `The file "${name}" appears to be empty or could not be read correctly.`;
      setError(msg);
      addLog(msg, 'error');
      return;
    }

    if (name === SUBAREA_LAYER_NAME) {
      const daLayer = layers.find(l => l.name === 'Drainage Areas');
      if (!daLayer) {
        const msg =
          'Primero carga las Drainage Areas y asigna un Discharge Point (DP-##) a cada polígono antes de subir las Drainage Subareas.';
        setError(msg);
        addLog(msg, 'error');
        return;
      }
      const missingDaIndexes: number[] = [];
      daLayer.geojson.features.forEach((feature, idx) => {
        const current = feature.properties ? (feature.properties as any)[DA_NAME_ATTR] : null;
        const formatted = formatDischargePointName(current);
        if (!formatted) missingDaIndexes.push(idx + 1);
      });
      if (missingDaIndexes.length > 0) {
        const msg =
          'Asigna un Discharge Point (DP-##) a cada Drainage Area antes de cargar las Drainage Subareas. Revisa los polígonos sin DP y vuelve a intentarlo.';
        setError(msg);
        addLog(msg, 'error');
        return;
      }
    }

    if (name === 'Soil Layer from Web Soil Survey') {
      const daLayer = layers.find(l => l.name === 'Drainage Areas');
      if (!daLayer || daLayer.geojson.features.length === 0) {
        const msg =
          'Carga las Drainage Areas y asigna un Discharge Point (DP-##) a cada polígono antes de ingresar la capa de suelos (WSS).';
        setError(msg);
        addLog(msg, 'error');
        return;
      }

      const missingDa = daLayer.geojson.features
        .map((feature, idx) => ({
          idx: idx + 1,
          value: formatDischargePointName(feature.properties ? (feature.properties as any)[DA_NAME_ATTR] : null),
        }))
        .filter(({ value }) => !value);
      if (missingDa.length > 0) {
        const msg =
          'Cada Drainage Area necesita un Discharge Point (DP-##) antes de habilitar la carga de la capa WSS. Completa los DP faltantes y vuelve a intentarlo.';
        setError(msg);
        addLog(msg, 'error');
        return;
      }

      const subLayer = layers.find(l => l.name === SUBAREA_LAYER_NAME);
      if (!subLayer || subLayer.geojson.features.length === 0) {
        const msg =
          'Carga las Drainage Subareas, asigna su nombre "DRAINAGE AREA - #" y vincúlalas a un Discharge Point antes de cargar la capa WSS.';
        setError(msg);
        addLog(msg, 'error');
        return;
      }

      const incompleteSubareas = subLayer.geojson.features.filter(feature => {
        const props = (feature.properties || {}) as Record<string, unknown>;
        const subName = typeof props[SUBAREA_NAME_ATTR] === 'string' ? String(props[SUBAREA_NAME_ATTR]).trim() : '';
        const parent = formatDischargePointName(props[SUBAREA_PARENT_ATTR]);
        return !subName || !parent;
      });

      if (incompleteSubareas.length > 0) {
        const msg =
          'Antes de cargar la capa WSS, asegúrate de que cada Drainage Subarea tenga un nombre "DRAINAGE AREA - #" y un Discharge Point asociado (DP-##).';
        setError(msg);
        addLog(msg, 'error');
        return;
      }
    }

    const editable = KNOWN_LAYER_NAMES.includes(name);
    const normalizedGeojson = transformLayerGeojson(name, geojson, {
      landCoverOptions,
      layers,
      fieldMap,
    });

    setLayers(prevLayers => {
      const existing = prevLayers.find(l => l.name === name);
      if (existing) {
        const updated = prevLayers.map(l =>
          l.name === name
            ? { ...l, geojson: normalizedGeojson, editable, fieldMap: fieldMap ?? l.fieldMap }
            : l
        );
        addLog(`Updated layer ${name} with uploaded data`);
        return updated;
      }
      const newLayer: LayerData = {
        id: `${Date.now()}-${name}`,
        name,
        geojson: normalizedGeojson,
        editable,
        visible: true,
        fillColor: getDefaultColor(name),
        fillOpacity: DEFAULT_OPACITY,
        category: 'Original',
        fieldMap,
      };
      addLog(`Loaded layer ${name}${editable ? '' : ' (view only)'}`);
      return [...prevLayers, newLayer];
    });
    if (name === 'Drainage Areas') {
      addLog('Asigna un Discharge Point (DP-##) a cada área de drenaje usando el desplegable del mapa.');
    }
    if (name === SUBAREA_LAYER_NAME) {
      addLog(
        "Etiqueta cada Drainage Subarea como 'DRAINAGE AREA - #' y vincúlala a su Discharge Point (DP-##) mediante el campo PARENT_DA."
      );
    }
    if (name === 'Soil Layer from Web Soil Survey') {
      addLog('La capa WSS se recortó a las Drainage Areas. Asigna manualmente los valores HSG (A/B/C/D) en el mapa.');
    }
  }, [addLog, landCoverOptions, layers]);

  const handlePreviewReady = useCallback((geojson: FeatureCollection, fileName: string, detectedName: string) => {
    setIsLoading(false);
    setError(null);
    setPreviewLayer({ data: geojson, fileName, detectedName });
    addLog(`Preview ready for ${fileName}`);
  }, [addLog]);

  const handleLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
    addLog('Loading file...');
  }, [addLog]);

  const handleError = useCallback((message: string) => {
    setIsLoading(false);
    setError(message);
    addLog(message, 'error');
  }, [addLog]);

  const handleCreateLayer = useCallback((name: string) => {
    setLayers(prev => {
      if (prev.some(l => l.name === name)) {
        addLog(`Layer ${name} already exists`, 'error');
        return prev;
      }
      const newLayer: LayerData = {
        id: `${Date.now()}-${name}`,
        name,
        geojson: { type: 'FeatureCollection', features: [] },
        editable: true,
        visible: true,
        fillColor: getDefaultColor(name),
        fillOpacity: DEFAULT_OPACITY,
        category: 'Original',
      };
      addLog(`Created new layer ${name}`);
      return [...prev, newLayer];
    });
  }, [addLog]);

  const handleRemoveLayer = useCallback((id: string) => {
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== id));
    addLog(`Removed layer ${id}`);
    if (editingTarget.layerId === id) setEditingTarget({ layerId: null, featureIndex: null });
  }, [addLog, editingTarget]);

  const handleZoomToLayer = useCallback((id: string) => {
    setZoomToLayer({ id, ts: Date.now() });
  }, []);

  const updateFeatureProperty = useCallback(
    (layerId: string, featureIndex: number, key: string, value: unknown) => {
      setLayers(prev =>
        prev.map(layer => {
          if (layer.id !== layerId) return layer;
          const features = [...layer.geojson.features];
          const feature = { ...features[featureIndex] };
          feature.properties = { ...(feature.properties || {}), [key]: value };
          features[featureIndex] = feature;
          return { ...layer, geojson: { ...layer.geojson, features } };
        })
      );
    },
    []
  );

  const handleUpdateFeatureHsg = useCallback<UpdateHsgFn>((layerId, featureIndex, hsg) => {
    updateFeatureProperty(layerId, featureIndex, 'HSG', hsg);
    addLog(`Set HSG for feature ${featureIndex} in ${layerId} to ${hsg}`);
  }, [addLog, updateFeatureProperty]);

  const handleUpdateFeatureDaName = useCallback<UpdateDaNameFn>((layerId, featureIndex, nameVal) => {
    const formatted = formatDischargePointName(nameVal);
    updateFeatureProperty(layerId, featureIndex, 'DA_NAME', formatted);
    addLog(
      `Set Discharge Point for feature ${featureIndex} in ${layerId} to ${formatted || '--'}`
    );
  }, [addLog, updateFeatureProperty]);

  const handleUpdateFeatureLandCover = useCallback<UpdateLandCoverFn>((layerId, featureIndex, value) => {
    updateFeatureProperty(layerId, featureIndex, 'LAND_COVER', value);
    addLog(`Set Land Cover for feature ${featureIndex} in ${layerId} to ${value}`);
  }, [addLog, updateFeatureProperty]);

  const handleUpdateFeatureSubareaName = useCallback<UpdateSubareaNameFn>((layerId, featureIndex, value) => {
    updateFeatureProperty(layerId, featureIndex, SUBAREA_NAME_ATTR, value);
    addLog(
      `Set Drainage Subarea name for feature ${featureIndex} in ${layerId} to ${value || '--'}`
    );
  }, [addLog, updateFeatureProperty]);

  const handleUpdateFeatureSubareaParent = useCallback<UpdateSubareaParentFn>((layerId, featureIndex, value) => {
    const formatted = formatDischargePointName(value);
    updateFeatureProperty(layerId, featureIndex, SUBAREA_PARENT_ATTR, formatted);
    addLog(
      `Linked Drainage Subarea feature ${featureIndex} in ${layerId} to ${formatted || '--'}`
    );
  }, [addLog, updateFeatureProperty]);

  const handleDiscardEditing = useCallback(() => {
    if (!editingTarget.layerId) return;
    const id = editingTarget.layerId;
    if (editingBackup && editingBackup.layerId === id) {
      setLayers(prev => prev.map(layer => layer.id === id ? { ...layer, geojson: editingBackup.geojson } : layer));
    }
    setEditingBackup(null);
    setEditingTarget({ layerId: null, featureIndex: null });
    addLog(`Descartados los cambios en ${id}`);
  }, [addLog, editingTarget, editingBackup]);

  const handleSaveEditing = useCallback(() => {
    if (!editingTarget.layerId) return;
    const id = editingTarget.layerId;
    setEditingBackup(null);
    setEditingTarget({ layerId: null, featureIndex: null });
    addLog(`Guardados los cambios en ${id}`);
  }, [addLog, editingTarget]);

  const handleToggleEditLayer = useCallback((id: string) => {
    if (editingTarget.layerId === id) {
      handleDiscardEditing();
      return;
    }
    const layer = layers.find(l => l.id === id);
    if (!layer) return;
    if (!layer.editable) {
      addLog(`${layer.name} is view-only and cannot be edited`, 'error');
      return;
    }
    setEditingBackup({ layerId: id, geojson: JSON.parse(JSON.stringify(layer.geojson)) });
    const copy = JSON.parse(JSON.stringify(layer.geojson)) as FeatureCollection;
    setLayers(prev => prev.map(l => l.id === id ? { ...l, geojson: copy } : l));
    setEditingTarget({ layerId: id, featureIndex: null });
    addLog(`Selecciona un pol\u00edgono de ${id} para editarlo`);
  }, [addLog, editingTarget.layerId, layers, handleDiscardEditing]);

  const handleSelectFeatureForEditing = useCallback((layerId: string, index: number) => {
    setEditingTarget({ layerId, featureIndex: index });
    addLog(`Editando pol\u00edgono ${index} en ${layerId}`);
  }, [addLog]);

  const handleToggleLayerVisibility = useCallback((id: string) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, visible: !l.visible } : l));
  }, []);

  const handleChangeLayerStyle = useCallback((id: string, style: Partial<Pick<LayerData, 'fillColor' | 'fillOpacity'>>) => {
    setLayers(prev => prev.map(l => l.id === id ? { ...l, ...style } : l));
  }, []);

  const handleUpdateLayerGeojson = useCallback((id: string, geojson: FeatureCollection) => {
    setLayers(prev => prev.map(layer => layer.id === id ? { ...layer, geojson } : layer));
    addLog(`Updated geometry for layer ${id}`);
  }, [addLog]);

  const handleConfirmPreview = useCallback((name: string, data: FeatureCollection) => {
    if (name === 'Pipes') {
      if (!layers.some(l => l.name === 'Catch Basins / Manholes')) {
        const msg = 'Catch Basins / Manholes layer must be loaded before Pipes';
        setError(msg);
        addLog(msg, 'error');
        setPreviewLayer(null);
        return;
      }
      setMappingLayer({ name, data });
    } else if (name === 'Catch Basins / Manholes') {
      setMappingLayer({ name, data });
    } else {
      handleLayerAdded(data, name);
    }
    setPreviewLayer(null);
  }, [handleLayerAdded, layers, addLog]);

  const handleCancelPreview = useCallback(() => {
    setPreviewLayer(null);
    addLog('Preview canceled');
  }, [addLog]);

  const handleFieldMapConfirm = useCallback((map: Record<string, string>) => {
    if (mappingLayer) {
      handleLayerAdded(mappingLayer.data, mappingLayer.name, map);
      setMappingLayer(null);
    }
  }, [mappingLayer, handleLayerAdded]);

  const handleFieldMapCancel = useCallback(() => {
    setMappingLayer(null);
  }, []);

  const runCompute = useCallback(async () => {
    setComputeSucceeded(false);
    const lod = layers.find(l => l.name === 'LOD');
    const da = layers.find(l => l.name === 'Drainage Areas');
    const sub = layers.find(l => l.name === SUBAREA_LAYER_NAME);
    const wss = layers.find(l => l.name === 'Soil Layer from Web Soil Survey');
    const lc = layers.find(l => l.name === 'Land Cover');
    if (!lod) return;

    const tasks: ComputeTask[] = [
      { id: 'check_lod', name: 'Check LOD has one polygon', status: 'pending' },
      { id: 'check_attrs', name: 'Validate required attributes', status: 'pending' },
      { id: 'prepare_subareas', name: 'Build drainage subareas with complements', status: 'pending' },
      { id: 'overlay', name: 'Overlay processed layers', status: 'pending' },
    ];
    setComputeTasks(tasks);

    setLayers(prev => prev.filter(l => l.category !== 'Process'));

    if (lod.geojson.features.length !== 1) {
      setComputeTasks(prev => prev.map(t => ({ ...t, status: 'error' })));
      addLog('LOD layer must contain exactly one polygon', 'error');
      return;
    }

    setComputeTasks(prev => prev.map(t => (t.id === 'check_lod' ? { ...t, status: 'success' } : t)));

    const missingAttrs: Record<string, string[]> = {};
    const registerMissing = (layerName: string, attr: string) => {
      if (!missingAttrs[layerName]) missingAttrs[layerName] = [];
      missingAttrs[layerName].push(attr);
    };
    const checkAttrs = (
      layer: LayerData | undefined,
      layerName: string,
      attrs: string[]
    ) => {
      if (!layer) return;
      layer.geojson.features.forEach(f => {
        const props = f.properties || {};
        attrs.forEach(attr => {
          const val = (props as any)[attr];
          if (val === undefined || val === null || String(val).trim() === '') {
            registerMissing(layerName, attr);
          }
        });
      });
    };

    checkAttrs(da, 'Drainage Areas', [DA_NAME_ATTR]);
    checkAttrs(sub, SUBAREA_LAYER_NAME, [SUBAREA_NAME_ATTR, SUBAREA_PARENT_ATTR]);
    checkAttrs(wss, 'Soil Layer from Web Soil Survey', ['HSG']);
    checkAttrs(lc, 'Land Cover', ['LAND_COVER']);

    const canonicalDaNames = new Map<string, string>();
    if (da) {
      da.geojson.features.forEach(f => {
        const raw = f.properties ? (f.properties as any)[DA_NAME_ATTR] : null;
        const formatted = formatDischargePointName(raw);
        if (!formatted) return;
        const key = formatted.toLowerCase();
        if (!canonicalDaNames.has(key)) canonicalDaNames.set(key, formatted);
      });
    }

    const subareasByParent = new Map<string, Feature[]>();
    const orphanParents = new Set<string>();
    if (sub) {
      sub.geojson.features.forEach(f => {
        const props = f.properties || {};
        const parentRaw = (props as any)[SUBAREA_PARENT_ATTR];
        const parentName = formatDischargePointName(parentRaw);
        if (!parentName) {
          orphanParents.add('(sin valor)');
          return;
        }
        const canonical = canonicalDaNames.get(parentName.toLowerCase());
        if (!canonical) {
          orphanParents.add(parentName);
          return;
        }
        if (!subareasByParent.has(canonical)) subareasByParent.set(canonical, []);
        subareasByParent.get(canonical)!.push(f);
      });
    }

    if (Object.keys(missingAttrs).length > 0 || orphanParents.size > 0) {
      const parts: string[] = [];
      if (Object.keys(missingAttrs).length > 0) {
        const msg = Object.entries(missingAttrs)
          .map(([layerName, attrs]) => `${layerName}: ${attrs.join(', ')}`)
          .join('; ');
        parts.push(`Missing required attributes -> ${msg}`);
      }
      if (orphanParents.size > 0) {
        const unknownParentsList = Array.from(orphanParents).join(', ');
        parts.push(
          `Drainage subareas reference unknown parents -> ${unknownParentsList}. Asocia cada subárea al Discharge Point correcto (DP-##).`
        );
      }
      setComputeTasks(prev =>
        prev.map(t => (t.id === 'check_attrs' ? { ...t, status: 'error' } : t))
      );
      addLog(parts.join(' | '), 'error');
      return;
    }

    setComputeTasks(prev => prev.map(t => (t.id === 'check_attrs' ? { ...t, status: 'success' } : t)));

    if (!da || !sub || !wss || !lc) {
      setComputeTasks(prev => prev.map(t => ({ ...t, status: 'error' })));
      addLog('Required layers are missing for computation', 'error');
      return;
    }

    try {
      const {
        intersect: turfIntersect,
        difference: turfDifference,
        flattenEach,
        area: turfArea,
      } = await import('@turf/turf');

      const intersect = (a: Feature | any, b: Feature | any) =>
        turfIntersect({ type: 'FeatureCollection', features: [a, b] } as any);

      const resultLayers: LayerData[] = [];
      const processedSubareas: Feature<Polygon | MultiPolygon>[] = [];
      let complementCount = 0;
      let skippedSubareas = 0;

      const groupedDas = new Map<
        string,
        { features: Feature<Polygon | MultiPolygon>[]; baseProps: Record<string, unknown> }
      >();

      da.geojson.features.forEach(daFeature => {
        if (!daFeature.geometry) return;
        if (
          daFeature.geometry.type !== 'Polygon' &&
          daFeature.geometry.type !== 'MultiPolygon'
        ) {
          return;
        }

        const rawName = daFeature.properties
          ? (daFeature.properties as any)[DA_NAME_ATTR]
          : null;
        const candidateName = formatDischargePointName(rawName);
        const daName = candidateName
          ? canonicalDaNames.get(candidateName.toLowerCase()) || candidateName
          : '';
        if (!daName) return;

        if (!groupedDas.has(daName)) {
          groupedDas.set(daName, {
            features: [],
            baseProps: { ...(daFeature.properties || {}), [DA_NAME_ATTR]: daName },
          });
        } else {
          const entry = groupedDas.get(daName)!;
          entry.baseProps = { ...entry.baseProps, ...(daFeature.properties || {}), [DA_NAME_ATTR]: daName };
        }
        groupedDas.get(daName)!.features.push(daFeature as Feature<Polygon | MultiPolygon>);
      });

      groupedDas.forEach(({ features, baseProps }, daName) => {
        const polygonCoords: number[][][][] = [];
        features.forEach(feat => {
          flattenEach(feat as any, poly => {
            if (!poly || !poly.geometry) return;
            const coords = (poly.geometry as Polygon).coordinates as number[][][];
            polygonCoords.push(coords);
          });
        });

        if (polygonCoords.length === 0) return;

        const combinedGeometry: Feature<Polygon | MultiPolygon> =
          polygonCoords.length === 1
            ? {
                type: 'Feature',
                geometry: { type: 'Polygon', coordinates: polygonCoords[0] } as Polygon,
                properties: baseProps,
              }
            : {
                type: 'Feature',
                geometry: { type: 'MultiPolygon', coordinates: polygonCoords } as MultiPolygon,
                properties: baseProps,
              };

        const relatedSubareas = subareasByParent.get(daName) || [];
        const normalizedSubs: Feature<Polygon | MultiPolygon>[] = [];

        relatedSubareas.forEach((subFeature, subIndex) => {
          if (!subFeature.geometry) {
            skippedSubareas++;
            return;
          }
          if (
            subFeature.geometry.type !== 'Polygon' &&
            subFeature.geometry.type !== 'MultiPolygon'
          ) {
            skippedSubareas++;
            return;
          }

          const clipped = intersect(subFeature as any, combinedGeometry as any);
          if (!clipped || !clipped.geometry) {
            skippedSubareas++;
            return;
          }

          const clippedArea = turfArea(clipped as any);
          if (clippedArea <= AREA_TOLERANCE_SQM) {
            skippedSubareas++;
            return;
          }

          const rawSubName = subFeature.properties
            ? (subFeature.properties as any)[SUBAREA_NAME_ATTR]
            : null;
          const subNameCandidate = rawSubName === undefined || rawSubName === null
            ? ''
            : String(rawSubName).trim();
          const subName = subNameCandidate || `${daName} - Subarea ${subIndex + 1}`;

          const normalizedProps = {
            ...(subFeature.properties || {}),
            ...baseProps,
            [DA_NAME_ATTR]: daName,
            [SUBAREA_PARENT_ATTR]: daName,
            [SUBAREA_NAME_ATTR]: subName,
            [COMPLEMENT_FLAG_ATTR]: false,
            [SUBAREA_AREA_ATTR]: Number((clippedArea * SQM_TO_ACRES).toFixed(6)),
          };

          const normalizedFeature: Feature<Polygon | MultiPolygon> = {
            type: 'Feature',
            geometry: clipped.geometry as Polygon | MultiPolygon,
            properties: normalizedProps,
          };

          normalizedSubs.push(normalizedFeature);
          processedSubareas.push(normalizedFeature);
        });

        let remainderGeom: Feature<Polygon | MultiPolygon> | null = {
          type: 'Feature',
          geometry: combinedGeometry.geometry as Polygon | MultiPolygon,
          properties: baseProps,
        };

        normalizedSubs.forEach(subFeature => {
          if (!remainderGeom) return;
          const diff = turfDifference(remainderGeom as any, subFeature as any);
          remainderGeom = diff && diff.geometry
            ? (diff as Feature<Polygon | MultiPolygon>)
            : null;
        });

        if (remainderGeom) {
          flattenEach(remainderGeom as any, rem => {
            if (!rem || !rem.geometry) return;
            const remArea = turfArea(rem as any);
            if (remArea <= AREA_TOLERANCE_SQM) return;

            const complementProps = {
              ...baseProps,
              [DA_NAME_ATTR]: daName,
              [SUBAREA_PARENT_ATTR]: daName,
              [SUBAREA_NAME_ATTR]: `${daName} - Complement`,
              [COMPLEMENT_FLAG_ATTR]: true,
              [SUBAREA_AREA_ATTR]: Number((remArea * SQM_TO_ACRES).toFixed(6)),
            };

            const complementFeature: Feature<Polygon | MultiPolygon> = {
              type: 'Feature',
              geometry: rem.geometry as Polygon | MultiPolygon,
              properties: complementProps,
            };

            complementCount++;
            processedSubareas.push(complementFeature);
          });
        }
      });

      if (processedSubareas.length > 0) {
        resultLayers.push({
          id: `${Date.now()}-${PROCESSED_SUBAREA_LAYER_NAME}`,
          name: PROCESSED_SUBAREA_LAYER_NAME,
          geojson: { type: 'FeatureCollection', features: processedSubareas } as FeatureCollection,
          editable: true,
          visible: true,
          fillColor: getDefaultColor(PROCESSED_SUBAREA_LAYER_NAME),
          fillOpacity: DEFAULT_OPACITY,
          category: 'Process',
        });
        setComputeTasks(prev =>
          prev.map(t => (t.id === 'prepare_subareas' ? { ...t, status: 'success' } : t))
        );
        const pieces = [`${processedSubareas.length} processed subareas`];
        if (complementCount > 0) pieces.push(`${complementCount} complement`);
        if (skippedSubareas > 0) pieces.push(`${skippedSubareas} skipped/trimmed`);
        addLog(`Drainage subareas generated -> ${pieces.join(', ')}`);
      } else {
        setComputeTasks(prev =>
          prev.map(t => (t.id === 'prepare_subareas' ? { ...t, status: 'error' } : t))
        );
        addLog('No drainage subareas generated', 'error');
      }

      const overlay: Feature[] = [];
      processedSubareas.forEach(subFeature => {
        if (!subFeature.geometry) return;
        wss.geojson.features.forEach(wssFeature => {
          if (!wssFeature.geometry) return;
          const inter1 = intersect(subFeature as any, wssFeature as any);
          if (!inter1 || !inter1.geometry) return;

          lc.geojson.features.forEach(lcFeature => {
            if (!lcFeature.geometry) return;
            const inter2 = intersect(inter1 as any, lcFeature as any);
            if (!inter2 || !inter2.geometry) return;

            const areaSqM = turfArea(inter2 as any);
            if (areaSqM <= AREA_TOLERANCE_SQM) return;

            inter2.properties = {
              ...(subFeature.properties || {}),
              ...(wssFeature.properties || {}),
              ...(lcFeature.properties || {}),
              AREA_SF: Number((areaSqM * SQM_TO_SQFT).toFixed(2)),
              AREA_AC: Number((areaSqM * SQM_TO_ACRES).toFixed(6)),
            };

            overlay.push(inter2 as Feature);
          });
        });
      });

      const cnRecords = await loadCnValues();
      const cnMap = new Map(cnRecords.map(r => [r.LandCover, r]));
      overlay.forEach(f => {
        const lcNameRaw = (f.properties as any)?.LAND_COVER;
        const lcName = lcNameRaw == null ? null : String(lcNameRaw);
        const hsgRaw = (f.properties as any)?.HSG;
        const hsg = hsgRaw == null ? null : String(hsgRaw).toUpperCase();
        const rec = lcName ? cnMap.get(lcName) : undefined;
        const cnValue = rec && hsg ? (rec as any)[hsg as keyof CnRecord] : undefined;
        if (cnValue !== undefined) {
          f.properties = { ...(f.properties || {}), CN: cnValue };
        }
      });

      if (overlay.length > 0) {
        resultLayers.push({
          id: `${Date.now()}-Overlay`,
          name: 'Overlay',
          geojson: { type: 'FeatureCollection', features: overlay } as FeatureCollection,
          editable: true,
          visible: true,
          fillColor: getDefaultColor('Overlay'),
          fillOpacity: DEFAULT_OPACITY,
          category: 'Process',
        });
        setComputeTasks(prev =>
          prev.map(t => (t.id === 'overlay' ? { ...t, status: 'success' } : t))
        );
        addLog(`Overlay created with ${overlay.length} features`);
      } else {
        setComputeTasks(prev =>
          prev.map(t => (t.id === 'overlay' ? { ...t, status: 'error' } : t))
        );
        addLog('No overlay generated', 'error');
      }

      setLayers(prev => {
        const withoutProcess = prev.filter(l => l.category !== 'Process');
        let finalLayers = [...withoutProcess, ...resultLayers];
        if (finalLayers.some(l => l.name === 'Overlay')) {
          finalLayers = finalLayers.map(l => {
            if (l.name === 'Overlay') return { ...l, visible: true };
            if (l.name === PROCESSED_SUBAREA_LAYER_NAME) return { ...l, visible: true };
            return l.category === 'Process' ? { ...l, visible: false } : l;
          });
        }
        return finalLayers;
      });
    } catch (err) {
      console.error(err);
      setComputeTasks(prev =>
        prev.map(t => (t.status === 'pending' ? { ...t, status: 'error' } : t))
      );
      addLog('Processing failed', 'error');
    }
  }, [layers, setLayers, addLog]);

  const handleCompute = useCallback(() => {
    runCompute();
  }, [runCompute]);

  const handleExportHydroCAD = useCallback(() => {
    const overlayLayer = layers.find(l => l.name === 'Overlay');
    if (!overlayLayer) {
      addLog('Overlay layer not found', 'error');
      return;
    }
    import('@turf/turf').then(({ area }) => {
      const nodes: Record<string, { area: number; cn: number; desc?: string }[]> = {};
      overlayLayer.geojson.features.forEach(f => {
        const da = (f.properties as any)?.DA_NAME || 'DA';
        const cn = (f.properties as any)?.CN;
        const lc = (f.properties as any)?.LAND_COVER;
        const hsg = (f.properties as any)?.HSG;
        if (cn === undefined) return;
        const a = area(f as any) * 10.7639; // square feet
        if (!nodes[da]) nodes[da] = [];
        const desc = lc ? `${lc}${hsg ? ", HSG " + hsg : ''}` : undefined;
        nodes[da].push({ area: a, cn, desc });
      });

      const groupedNodes: Record<string, { area: number; cn: number; desc?: string }[]> = {};
      Object.entries(nodes).forEach(([da, entries]) => {
        const grouped = new Map<string, { area: number; cn: number; desc?: string }>();
        entries.forEach(({ area: arArea, cn, desc }) => {
          const key = `${cn}|${desc ?? ''}`;
          const existing = grouped.get(key);
          if (existing) {
            existing.area += arArea;
          } else {
            grouped.set(key, { area: arArea, cn, desc });
          }
        });
        groupedNodes[da] = Array.from(grouped.values());
      });

      let content = `[HydroCAD]\nFileUnits=English\nCalcUnits=English\nInputUnits=English-LowFlow\nReportUnits=English-LowFlow\nLargeAreas=False\nSource=HydroCAD\u00ae 10.20-6a  s/n 07447  \u00a9 2024 HydroCAD Software Solutions LLC\nName=${projectName || 'Project'}\nPath=\nView=-5.46349942062574 0 15.4634994206257 10\nGridShow=True\nGridSnap=True\nTimeSpan=0 86400\nTimeInc=36\nMaxGraph=0\nRunoffMethod=SCS TR-20\nReachMethod=Stor-Ind+Trans\nPondMethod=Stor-Ind\nUH=SCS\nMinTc=300\nRainEvent=test\n\n[EVENT]\nRainEvent=test\nStormType=Type II 24-hr\nStormDepth=0.0833333333333333\n`;

      let y = 0;
      Object.entries(groupedNodes).forEach(([da, areas]) => {
        content += `\n[NODE]\nNumber=${da}\nType=Subcat\nName=${da}\nXYPos=0 ${y}\n`;
        areas.forEach(ar => {
          content += `[AREA]\nArea=${ar.area}\nCN=${ar.cn}\n`;
          if (ar.desc) content += `Desc=${ar.desc}\n`;
        });
        content += `[TC]\nMethod=Direct\nTc=300\n`;
        y += 5;
      });

      const blob = new Blob([content], { type: 'text/plain' });
      const filename = `${(projectName || 'project')}_${projectVersion}.hcp`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      addLog('HydroCAD file exported');
      setExportModalOpen(false);
    });
  }, [addLog, layers, projectName, projectVersion, projection]);

  const handleExportSWMM = useCallback(async () => {
    const daLayer = layers.find(l => l.name === 'Drainage Areas');

    const template = (
      await import('./export_templates/swmm/SWMM_TEMPLATE.inp?raw')
    ).default as string;
    const {
      area: turfArea,
      rewind,
      cleanCoords,
      centroid,
      bbox,
      kinks,
    } = await import('@turf/turf');

    const sanitizeId = (s: string, i: number) =>
      (s || `S${i + 1}`)
        .trim()
        .replace(/[^\w\-]/g, '_')
        .replace(/_+/g, '_')
        .slice(0, 31);

    const isFinitePair = (p: number[]) =>
      Number.isFinite(p[0]) && Number.isFinite(p[1]);

    const reorderByAngle = (ring: number[][]) => {
      const c = centroid({
        type: 'Feature',
        geometry: { type: 'Polygon', coordinates: [ring] },
        properties: {},
      } as any).geometry.coordinates as number[];
      return ring
        .map(([x, y]) => ({ x, y, ang: Math.atan2(y - c[1], x - c[0]) }))
        .sort((a, b) => a.ang - b.ang)
        .map((p) => [p.x, p.y]);
    };

    const uniq = (ring: number[][]) => {
      const seen = new Set<string>();
      const out: number[][] = [];
      for (const p of ring) {
        const k = `${p[0].toFixed(6)}|${p[1].toFixed(6)}`;
        if (!seen.has(k)) {
          seen.add(k);
          out.push(p);
        }
      }
      return out;
    };

    const subcatchLines: string[] = [];
    const subareaLines: string[] = [];
    const infilLines: string[] = [];
    const polygonLines: string[] = [];
    const junctionLines: string[] = [];
    const outfallLines: string[] = [];
    const conduitLines: string[] = [];
    const xsectionLines: string[] = [];
    const coordLines: string[] = [];
    if (daLayer) {
      const grouped = new Map<
        string,
        { area: number; polygons: number[][][] }
      >();

      daLayer.geojson.features.forEach((f, i) => {
        const raw = String((f.properties as any)?.DA_NAME ?? '');
        const id = sanitizeId(raw, i);
        const geom = f.geometry;
        const rings: number[][][] =
          geom.type === 'Polygon'
            ? [geom.coordinates[0] as number[][]]
            : (geom as any).coordinates.map((p: any) => p[0] as number[][]);
        let outerArea = 0;
        for (const ring of rings) {
          outerArea += Math.abs(
            turfArea({
              type: 'Feature',
              geometry: { type: 'Polygon', coordinates: [ring] },
              properties: {},
            } as any)
          );
        }
        const a = outerArea * 0.000247105; // acres
        const entry = grouped.get(id) || { area: 0, polygons: [] };
        entry.area += a;
        entry.polygons.push(...rings);
        grouped.set(id, entry);
      });

      const closeRing = (ring: number[][]) => {
        if (ring.length < 3) return ring;
        const [fx, fy] = ring[0];
        const [lx, ly] = ring[ring.length - 1];
        const isClosed = fx === lx && fy === ly;
        return isClosed ? ring : [...ring, ring[0]];
      };

      Array.from(grouped.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([id, { area: a, polygons }]) => {
          polygons.sort(
            (aRing, bRing) =>
              Math.abs(
                turfArea({
                  type: 'Feature',
                  geometry: { type: 'Polygon', coordinates: [bRing] },
                  properties: {},
                } as any)
              ) -
              Math.abs(
                turfArea({
                  type: 'Feature',
                  geometry: { type: 'Polygon', coordinates: [aRing] },
                  properties: {},
                } as any)
              )
          );
          let hasRing = false;
          polygons.forEach((ring) => {
            const gj = {
              type: 'Feature',
              geometry: { type: 'Polygon', coordinates: [ring] },
              properties: {},
            } as any;
            const cleanedGj = cleanCoords(gj);
            const rewound = rewind(cleanedGj, { reverse: false });
            const ringCoords = rewound.geometry.coordinates[0] as number[][];
            const cleaned = ringCoords.filter(
              (p, i, arr) =>
                i === 0 || p[0] !== arr[i - 1][0] || p[1] !== arr[i - 1][1]
            );
            const dedup = uniq(cleaned);
            if (dedup.length < 3) {
              addLog(`[POLYGONS] anillo degenerado en ${id}`, 'warn');
              return;
            }
            let ringToWrite = dedup;
            try {
              if (
                kinks({
                  type: 'Feature',
                  geometry: { type: 'Polygon', coordinates: [dedup] },
                  properties: {},
                } as any).features.length
              ) {
                ringToWrite = reorderByAngle(dedup);
              }
            } catch {}
            const closed = closeRing(ringToWrite);
            const safeClosed = closed.filter(isFinitePair);
            const projectedRing = safeClosed.map((p) =>
              project.forward(p as [number, number])
            );
            if (projectedRing.length < 4) {
              addLog(
                `[POLYGONS] Se descartó un anillo degenerado de ${id}`,
                'warn'
              );
              return;
            }
            projectedRing.forEach(([x, y]) => {
              polygonLines.push(`${id}\t${x}\t${y}`);
            });
            hasRing = true;
          });
          if (hasRing) {
            const width = a * 100; // simple width approximation
            subcatchLines.push(
              `${id}\t*\t*\t${a.toFixed(4)}\t25\t${width.toFixed(2)}\t0.5\t0`
            );
            subareaLines.push(`${id}\t0.01\t0.1\t0.05\t0.05\t25\tOUTLET`);
            infilLines.push(`${id}\t3\t0.5\t4\t7\t0`);
          }
        });
    }

    const bad = polygonLines.find(
      (l) => l.trim().split(/\s+/).length !== 3
    );
    if (bad) throw new Error(`[POLYGONS] mal formado: "${bad}"`);
    const bad2 = polygonLines.find(
      (l) =>
        !/^\S+\s+-?\d+(\.\d+)?(e[+-]?\d+)?\s+-?\d+(\.\d+)?(e[+-]?\d+)?$/i.test(
          l.trim()
        )
    );
    if (bad2) throw new Error(`[POLYGONS] token numérico inválido: "${bad2}"`);

    const validIds = new Set(subcatchLines.map((l) => l.split(/\s+/)[0]));
    const filteredPolygonLines = polygonLines.filter((l) =>
      validIds.has(l.split(/\s+/)[0])
    );

    const getPropStrict = (props: any, candidates: string[]) => {
      if (!props) return undefined;
      const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
      const map = new Map(
        Object.keys(props).map((k) => [norm(k), k])
      );
      for (const cand of candidates) {
        const hit = map.get(norm(cand));
        if (hit !== undefined) return (props as any)[hit];
      }
      return undefined;
    };

    const getMapped = (
      props: any,
      map: Record<string, string> | undefined,
      key: string,
      candidates: string[]
    ) => {
      if (map && map[key] && props?.[map[key]] !== undefined) {
        return (props as any)[map[key]];
      }
      return getPropStrict(props, candidates);
    };

    const jLayer = layers.find((l) => l.name === 'Catch Basins / Manholes');
    const pLayer = layers.find((l) => l.name === 'Pipes');

    type NodeRec = {
      origId: string;
      id: string;
      coord: [number, number];
      invert: number;
      ground: number;
      isOutfall: boolean;
    };

    const rawNodes: NodeRec[] = [];
    let nodes: NodeRec[] = [];

    if (jLayer) {
      const jMap = jLayer.fieldMap;
      jLayer.geojson.features.forEach((f, i) => {
        if (!f.geometry || f.geometry.type !== 'Point') return;
        const raw = String(
          getMapped(f.properties, jMap, 'label', ['Label']) ?? ''
        );
        const id = sanitizeId(raw, i);
        const ground = Number(
          getMapped(f.properties, jMap, 'ground', [
            'Elevation Ground [ft]',
            'Elevation Ground [ft]:'
          ]) ?? 0
        );
        const invert = Number(
          getMapped(f.properties, jMap, 'inv_out', [
            'Inv Out [ft]',
            'Inv Out [ft]:',
            'Elevation Invert[ft]'
          ]) ?? 0
        );
        const coord = project.forward(
          (f.geometry as any).coordinates as [number, number]
        );
        const isOutfall = raw.toUpperCase().startsWith('OF');
        rawNodes.push({
          origId: id,
          id,
          coord,
          invert,
          ground,
          isOutfall,
        });
      });

      const feetTol = 0.3;
      const byId = new Map<string, NodeRec[]>();
      for (const n of rawNodes) {
        const arr = byId.get(n.origId);
        if (arr) arr.push(n);
        else byId.set(n.origId, [n]);
      }
      const finalNodes: NodeRec[] = [];
      for (const [, group] of byId) {
        const chosen: NodeRec[] = [];
        for (const n of group) {
          const same = chosen.find(
            (m) =>
              Math.hypot(m.coord[0] - n.coord[0], m.coord[1] - n.coord[1]) <=
              feetTol
          );
          if (same) {
            if (n.invert > 0 && (same.invert === 0 || n.invert < same.invert)) {
              same.invert = n.invert;
            }
            if (n.ground > same.ground) same.ground = n.ground;
            continue;
          }
          let uniqueId = n.id;
          let k = 1;
          while (
            finalNodes.some((x) => x.id === uniqueId) ||
            chosen.some((x) => x.id === uniqueId)
          ) {
            uniqueId = `${n.id}_${++k}`;
          }
          chosen.push({ ...n, id: uniqueId });
        }
        finalNodes.push(...chosen);
      }

      const assertUnique = (name: string, ids: string[]) => {
        const seen = new Set<string>();
        const dups = new Set<string>();
        for (const id of ids) {
          if (seen.has(id)) dups.add(id);
          else seen.add(id);
        }
        if (dups.size) {
          throw new Error(`[${name}] IDs duplicados: ${[...dups].join(', ')}`);
        }
      };

      for (const n of finalNodes) {
        const maxDepth = Math.max(0, n.ground - n.invert);
        if (n.isOutfall) {
          outfallLines.push(`${n.id}\t${n.invert}\tFREE`);
        } else {
          junctionLines.push(
            `${n.id}\t${n.invert}\t${maxDepth}\t0\t0\t0`
          );
        }
        coordLines.push(`${n.id}\t${n.coord[0]}\t${n.coord[1]}`);
      }

      assertUnique('JUNCTIONS/OUTFALLS', finalNodes.map((n) => n.id));
      nodes = finalNodes;
    }

    const findNearestNode = (pt: [number, number]) => {
      let best = nodes[0];
      let bestDist = Infinity;
      for (const n of nodes) {
        const dx = pt[0] - n.coord[0];
        const dy = pt[1] - n.coord[1];
        const d = Math.hypot(dx, dy);
        if (d < bestDist) {
          bestDist = d;
          best = n;
        }
      }
      return best;
    };

    const lineLength = (coords: number[][]) => {
      let len = 0;
      for (let i = 1; i < coords.length; i++) {
        const [x1, y1] = project.forward(coords[i - 1] as [number, number]);
        const [x2, y2] = project.forward(coords[i] as [number, number]);
        len += Math.hypot(x2 - x1, y2 - y1);
      }
      return len;
    };

    if (pLayer && nodes.length && jLayer) {
      const pMap = pLayer.fieldMap;
      const nodeFeatures = jLayer.geojson.features.filter(
        f => f.geometry && f.geometry.type === 'Point'
      ) as Feature<Point>[];
      const rawPipeFeatures = pLayer.geojson.features.filter(
        f => f.geometry && f.geometry.type === 'LineString'
      ) as Feature<LineString>[];
      const pipeFeatures = splitPipesAtNodes(rawPipeFeatures, nodeFeatures);
      pipeFeatures.forEach((f, i) => {
        const seg = (f.properties as any)?._segment;
        let raw = String(
          getMapped(f.properties, pMap, 'label', ['Label']) ?? ''
        );
        if (seg) raw = `${raw}-${seg}`;
        const id = sanitizeId(raw, i);
        const coords = (f.geometry as LineString).coordinates;
        let dirStr = String(
          getMapped(f.properties, pMap, 'direction', ['Directions']) ?? ''
        );
        if (seg) dirStr = '';
        let from: typeof nodes[number] | undefined;
        let to: typeof nodes[number] | undefined;
        if (dirStr.includes(' to ')) {
          const [a, b] = dirStr.split(/\s+to\s+/);
          const fromId = sanitizeId(a, 0);
          const toId = sanitizeId(b, 0);
          from = nodes.find(n => n.id === fromId);
          to = nodes.find(n => n.id === toId);
        }
        if (!from || !to) {
          const start = project.forward(coords[0] as [number, number]);
          const end = project.forward(coords[coords.length - 1] as [number, number]);
          from = findNearestNode(start);
          to = findNearestNode(end);
        }
        const len = lineLength(coords);
        const rough = Number(
          getMapped(f.properties, pMap, 'roughness', ['Rougness', 'Roughness']) ?? 0
        );
        const diamIn = Number(
          getMapped(f.properties, pMap, 'diameter', ['Diameter [in]']) ?? 0
        );
        const invIn = Number(
          getMapped(f.properties, pMap, 'inv_in', ['Elevation Invert In [ft]'])
        );
        const invOut = Number(
          getMapped(f.properties, pMap, 'inv_out', ['Elevation Invert Out [ft]'])
        );
        const diamFt = diamIn / 12;
        const inOffset =
          from && Number.isFinite(invIn) ? invIn - from.invert : 0;
        const outOffset =
          to && Number.isFinite(invOut) ? invOut - to.invert : 0;
        conduitLines.push(
          `${id}\t${from?.id ?? ''}\t${to?.id ?? ''}\t${len.toFixed(3)}\t${rough}\t${inOffset.toFixed(3)}\t${outOffset.toFixed(3)}\t0\t0`
        );
        xsectionLines.push(`${id}\tCIRCULAR\t${diamFt}\t0\t0\t0\t1`);
      });
    }

    const replaceSection = (content: string, section: string, lines: string) => {
      const regex = new RegExp(String.raw`\[${section}\][\s\S]*?(?=\r?\n\[|$)`);
      return content.replace(regex, `[${section}]\n${lines}\n`);
    };

    const subcatchHeader =
      ';;Name\tRain Gage\tOutlet\tArea\t%Imperv\tWidth\t%Slope\tCurbLen\tSnowPack\n';
    const subareaHeader =
      ';;Subcatchment\tN-Imperv\tN-Perv\tS-Imperv\tS-Perv\tPctZero\tRouteTo\tPctRouted\n';
    const infilHeader =
      ';;Subcatchment\tParam1\tParam2\tParam3\tParam4\tParam5\n';
    const polygonHeader =
      ';;Subcatchment\tX-Coord\tY-Coord\n';
    const junctionHeader =
      ';;Name\tElevation  MaxDepth   InitDepth  SurDepth   Aponded\n';
    const outfallHeader =
      ';;Name\tElevation  Type       Stage Data       Gated    Route To\n';
    const conduitHeader =
      ';;Name\tFrom Node        To Node          Length     Roughness  InOffset   OutOffset  InitFlow   MaxFlow\n';
    const xsectionHeader =
      ';;Link           Shape        Geom1            Geom2      Geom3      Geom4      Barrels    Culvert\n';
    const coordHeader =
      ';;Node           X-Coord            Y-Coord\n';

    let content = template;
    content = replaceSection(
      content,
      'SUBCATCHMENTS',
      subcatchHeader + subcatchLines.join('\n')
    );
    content = replaceSection(
      content,
      'SUBAREAS',
      subareaHeader + subareaLines.join('\n')
    );
    content = replaceSection(
      content,
      'INFILTRATION',
      infilHeader + infilLines.join('\n')
    );
    content = replaceSection(
      content,
      'POLYGONS',
      polygonHeader + filteredPolygonLines.join('\n')
    );
    content = replaceSection(
      content,
      'JUNCTIONS',
      junctionHeader + junctionLines.join('\n')
    );
    content = replaceSection(
      content,
      'OUTFALLS',
      outfallHeader + outfallLines.join('\n')
    );
    content = replaceSection(
      content,
      'CONDUITS',
      conduitHeader + conduitLines.join('\n')
    );
    content = replaceSection(
      content,
      'XSECTIONS',
      xsectionHeader + xsectionLines.join('\n')
    );
    content = replaceSection(
      content,
      'COORDINATES',
      coordHeader + coordLines.join('\n')
    );

    if (filteredPolygonLines.length) {
      const allRings = filteredPolygonLines
        .map((l) => l.split(/\s+/))
        .map(([_, x, y]) => [Number(x), Number(y)]);
      const [minX, minY, maxX, maxY] = bbox({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            geometry: { type: 'MultiPoint', coordinates: allRings },
            properties: {},
          },
        ],
      } as any);
      const dx = (maxX - minX) * 0.01;
      const dy = (maxY - minY) * 0.01;
      const mapBlock = `[MAP]\nDIMENSIONS       ${minX - dx} ${minY - dy}  ${
        maxX + dx
      } ${maxY + dy}\nUNITS            ${
        projection.units === 'feet' ? 'Feet' : 'Meters'
      }\n`;
      content = content.replace(
        /\[MAP\][\s\S]*?(?=\r?\n\[|$)/,
        mapBlock
      );
    }

    const blob = new Blob([content], { type: 'text/plain' });
    const filename = `${(projectName || 'project')}_${projectVersion}.inp`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    addLog('SWMM file exported');
    setExportModalOpen(false);
    }, [addLog, layers, projectName, projectVersion, projection]);

  const handleExportShapefiles = useCallback(async () => {
    try {
      const processedLayers = layers.filter(
        l =>
          l.category === 'Process' ||
          l.name === 'Catch Basins / Manholes'
      );

      const forward = (coord: [number, number]): [number, number] => {
        const [x, y] = project.forward(coord);
        if (!Number.isFinite(x) || !Number.isFinite(y)) {
          throw new Error(
            `Failed to project coordinate ${JSON.stringify(coord)} with EPSG:${projection.epsg}`
          );
        }
        return [x, y] as [number, number];
      };

      const jLayer = layers.find((l) => l.name === 'Catch Basins / Manholes');
      const pLayer = layers.find((l) => l.name === 'Pipes');

      if (jLayer && pLayer) {

      const getPropStrict = (props: any, candidates: string[]) => {
        if (!props) return undefined;
        const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
        const map = new Map(Object.keys(props).map((k) => [norm(k), k]));
        for (const cand of candidates) {
          const hit = map.get(norm(cand));
          if (hit !== undefined) return (props as any)[hit];
        }
        return undefined;
      };

      const getMapped = (
        props: any,
        map: Record<string, string> | undefined,
        key: string,
        candidates: string[]
      ) => {
        if (map && map[key] && props?.[map[key]] !== undefined) {
          return (props as any)[map[key]];
        }
        return getPropStrict(props, candidates);
      };

      const sanitizeId = (s: string, i: number) =>
        (s || `S${i + 1}`)
          .trim()
          .replace(/[^\w\-]/g, '_')
          .replace(/_+/g, '_')
          .slice(0, 31);

      type NodeRec = { id: string; coord: [number, number]; invert: number };
      const jMap = jLayer.fieldMap;
      const nodeFeatures = jLayer.geojson.features.filter(
        (f) => f.geometry && f.geometry.type === 'Point'
      ) as Feature<Point>[];
      const nodes: NodeRec[] = [];
      const goodNodeFeatures: Feature<Point>[] = [];
      nodeFeatures.forEach((f, i) => {
        const props = f.properties;
        const id = sanitizeId(
          String(getMapped(props, jMap, 'label', ['Label']) ?? ''),
          i
        );
        const invert = Number(
          getMapped(props, jMap, 'inv_out', [
            'Inv Out [ft]',
            'Inv Out [ft]:',
            'Elevation Invert[ft]'
          ])
        );
        const ground = Number(
          getMapped(props, jMap, 'ground', ['Elevation Ground [ft]'])
        );
        if (!Number.isFinite(invert) || !Number.isFinite(ground)) return;
        const coord = forward((f.geometry as any).coordinates as [number, number]);
        nodes.push({ id, coord, invert });
        goodNodeFeatures.push(f);
      });

      const cbIdx = processedLayers.findIndex(
        (l) => l.name === 'Catch Basins / Manholes'
      );
      if (cbIdx >= 0) {
        processedLayers[cbIdx] = {
          ...processedLayers[cbIdx],
          geojson: {
            type: 'FeatureCollection',
            features: goodNodeFeatures,
          },
        };
      }

      const findNearestNode = (pt: [number, number]) => {
        let best: NodeRec | undefined;
        let bestDist = Infinity;
        for (const n of nodes) {
          const dx = pt[0] - n.coord[0];
          const dy = pt[1] - n.coord[1];
          const d = Math.hypot(dx, dy);
          if (d < bestDist) {
            bestDist = d;
            best = n;
          }
        }
        return best;
      };

      const lineLength = (coords: number[][]) => {
        let len = 0;
        for (let i = 1; i < coords.length; i++) {
          const [x1, y1] = forward(coords[i - 1] as [number, number]);
          const [x2, y2] = forward(coords[i] as [number, number]);
          len += Math.hypot(x2 - x1, y2 - y1);
        }
        return len;
      };

      const rawPipeFeatures: Feature<LineString>[] = [];
      pLayer.geojson.features.forEach((f) => {
        if (!f.geometry) return;
        if (f.geometry.type === 'LineString') {
          rawPipeFeatures.push(f as Feature<LineString>);
        } else if (f.geometry.type === 'MultiLineString') {
          (f.geometry.coordinates as number[][][]).forEach((coords) => {
            rawPipeFeatures.push({
              type: 'Feature',
              geometry: { type: 'LineString', coordinates: coords },
              properties: f.properties || {},
            });
          });
        }
      });
      const pipeFeatures = splitPipesAtNodes(rawPipeFeatures, nodeFeatures);
      const pMap = pLayer.fieldMap;
      const pipeOut: Feature<LineString>[] = [];
      const toNumericOrNull = (value: unknown): number | null => {
        if (value == null || value === '') return null;
        const num = Number(value);
        return Number.isFinite(num) ? num : null;
      };

      const formatOrEmpty = (value: number | null, digits: number) =>
        value == null ? '' : Number(value.toFixed(digits));

      pipeFeatures.forEach((f, i) => {
        const seg = (f.properties as any)?._segment;
        let raw = String(
          getMapped(f.properties, pMap, 'label', ['Label']) ?? ''
        );
        if (seg) raw = `${raw}-${seg}`;
        const id = sanitizeId(raw, i);
        const coords = (f.geometry as LineString).coordinates;
        const diamIn = toNumericOrNull(
          getMapped(f.properties, pMap, 'diameter', ['Diameter [in]'])
        );
        const invIn = toNumericOrNull(
          getMapped(f.properties, pMap, 'inv_in', ['Elevation Invert In [ft]'])
        );
        const invOut = toNumericOrNull(
          getMapped(f.properties, pMap, 'inv_out', ['Elevation Invert Out [ft]'])
        );

        let dirStr = String(
          getMapped(f.properties, pMap, 'direction', ['Directions']) ?? ''
        );
        if (seg) dirStr = '';
        let from: NodeRec | undefined;
        let to: NodeRec | undefined;
        if (dirStr.includes(' to ')) {
          const [a, b] = dirStr.split(/\s+to\s+/);
          const fromId = sanitizeId(a, 0);
          const toId = sanitizeId(b, 0);
          from = nodes.find((n) => n.id === fromId);
          to = nodes.find((n) => n.id === toId);
        }
        if (!from || !to) {
          const start = forward(coords[0] as [number, number]);
          const end = forward(coords[coords.length - 1] as [number, number]);
          from = findNearestNode(start);
          to = findNearestNode(end);
        }
        if (!from || !to) return;

        const len = lineLength(coords);
        const rough = Number(
          getMapped(f.properties, pMap, 'roughness', ['Rougness', 'Roughness']) ??
            0
        );
        const slope =
          invIn != null && invOut != null && len > 0 ? (invIn - invOut) / len : null;
        const inOffset = invIn != null ? invIn - from.invert : null;
        const outOffset = invOut != null ? invOut - to.invert : null;
        pipeOut.push({
          type: 'Feature',
          geometry: f.geometry,
          properties: {
            ID: id,
            FROM_ID: from.id,
            TO_ID: to.id,
            LEN_FT: Number(len.toFixed(3)),
            DIAM_IN: formatOrEmpty(diamIn, 3),
            INV_IN: formatOrEmpty(invIn, 3),
            INV_OUT: formatOrEmpty(invOut, 3),
            ROUGH: rough,
            SLOPE: formatOrEmpty(slope, 6),
            IN_OFF: formatOrEmpty(inOffset, 3),
            OUT_OFF: formatOrEmpty(outOffset, 3),
          },
        });
      });
      if (pipeOut.length > 0) {
        processedLayers.push({
          id: `${Date.now()}-PipeNetwork`,
          name: 'Pipe Network',
          geojson: {
            type: 'FeatureCollection',
            features: pipeOut,
          } as FeatureCollection,
          editable: false,
          visible: false,
          fillColor: getDefaultColor('Overlay'),
          fillOpacity: DEFAULT_OPACITY,
          category: 'Process',
        });
      }
    }

      if (processedLayers.length === 0) {
        addLog('No processed layers to export', 'error');
        return;
      }
      const JSZip = (await import('jszip')).default;
      const shpwrite = (await import('@mapbox/shp-write')).default as any;
      const zip = new JSZip();

      let prj: string;
      try {
        prj = await resolvePrj(projection.epsg);
      } catch (e) {
        addLog(`Export canceled: missing PRJ for EPSG:${projection.epsg}`, 'error');
        return;
      }

      for (const layer of processedLayers) {
        const prepared = prepareForShapefile(layer.geojson, layer.name);
        let projected: FeatureCollection;
        try {
          projected = reprojectFeatureCollection(prepared, projection.proj4);
        } catch (error) {
          const reason = error instanceof Error ? error.message : String(error);
          throw new Error(`Failed to reproject layer "${layer.name}": ${reason}`);
        }
        addLog(`Exporting "${layer.name}": ${projected.features.length} features`);
        const layerZipBuffer = await shpwrite.zip(projected, { outputType: 'arraybuffer', prj });
        const layerZip = await JSZip.loadAsync(layerZipBuffer);
        const folderName = layer.name.replace(/[^a-z0-9_\-]/gi, '_');
        const folder = zip.folder(folderName);
        if (!folder) continue;
        await Promise.all(
          Object.keys(layerZip.files).map(async filename => {
            const content = await layerZip.files[filename].async('arraybuffer');
            folder.file(filename, content);
          })
        );
        const dbf = Object.keys(layerZip.files).find(f => f.toLowerCase().endsWith('.dbf'));
        if (dbf) {
          const base = dbf.replace(/\.dbf$/i, '');
          folder.file(`${base}.cpg`, 'UTF-8');
        }
      }

      const blob = await zip.generateAsync({ type: 'blob' });
      const filename = `${(projectName || 'project')}_${projectVersion}_shapefiles.zip`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      addLog('Processed shapefiles exported');
      setExportModalOpen(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      addLog(`Export canceled: ${message}`, 'error');
    }
  }, [addLog, layers, projectName, projectVersion, projection]);

  const handleView3D = useCallback(() => {
    const jLayer = layers.find((l) => l.name === 'Catch Basins / Manholes');
    const pLayer = layers.find((l) => l.name === 'Pipes');
    if (!jLayer || !pLayer) return;
    const nodeFeatures = jLayer.geojson.features.filter(
      (f) => f.geometry && f.geometry.type === 'Point'
    ) as Feature<Point>[];
    const nodes = nodeFeatures
      .map((f) => {
        const [x, y] = project.forward(
          (f.geometry as any).coordinates as [number, number]
        );
        const props = f.properties as any;
        const ground = parseFloat(props?.['Elevation Ground [ft]']);
        const invOut = parseFloat(
          props?.['Inv Out [ft]'] ?? props?.['Elevation Invert[ft]']
        );
        if (!isFinite(ground) || !isFinite(invOut)) return null;
        return { x, y, ground, invOut, diam: 4 };
      })
      .filter(
        (n): n is { x: number; y: number; ground: number; invOut: number; diam: number } =>
          n !== null
      );
    const rawPipeFeatures: Feature<LineString>[] = [];
    pLayer.geojson.features.forEach((f) => {
      if (!f.geometry) return;
      if (f.geometry.type === 'LineString') {
        rawPipeFeatures.push(f as Feature<LineString>);
      } else if (f.geometry.type === 'MultiLineString') {
        (f.geometry.coordinates as number[][][]).forEach((coords) => {
          rawPipeFeatures.push({
            type: 'Feature',
            geometry: { type: 'LineString', coordinates: coords },
            properties: f.properties || {},
          });
        });
      }
    });
    const pipeFeatures = splitPipesAtNodes(rawPipeFeatures, nodeFeatures);
    const pipes = pipeFeatures
      .map((f) => {
        const coords = (f.geometry as LineString).coordinates;
        const [sx, sy] = project.forward(coords[0] as [number, number]);
        const [ex, ey] = project.forward(
          coords[coords.length - 1] as [number, number]
        );
        const invIn = parseFloat(
          (f.properties as any)?.['Elevation Invert In [ft]']
        );
        const invOut = parseFloat(
          (f.properties as any)?.['Elevation Invert Out [ft]']
        );
        const diam =
          parseFloat((f.properties as any)?.['Diameter [in]']) / 12;
        if (![invIn, invOut, diam].every(isFinite)) return null;
        return {
          start: { x: sx, y: sy, z: invIn + diam / 2 },
          end: { x: ex, y: ey, z: invOut + diam / 2 },
          diam,
        };
      })
      .filter(
        (p): p is { start: { x: number; y: number; z: number }; end: { x: number; y: number; z: number }; diam: number } =>
          p !== null
      );
    if (nodes.length === 0 && pipes.length === 0) {
      addLog('No pipe network data to display', 'error');
      return;
    }
    const data = { nodes, pipes };
    const win = window.open('', '_blank') || window;
    const doc = win.document;

    doc.open();
    doc.write(`<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>3D Pipe Network</title>
  <style>
    html,body{height:100%;margin:0;overflow:hidden}
    canvas{display:block;width:100%;height:100%}
    #nav{position:absolute;top:10px;right:10px;display:flex;flex-direction:column;align-items:center;gap:8px;font-family:sans-serif}
    #compassWrap{position:relative}
    #compass{background:rgba(255,255,255,0.8);border-radius:50%}
    #north{position:absolute;top:4px;left:50%;transform:translateX(-50%);font:bold 14px sans-serif;pointer-events:none}
    #pegman{width:24px;height:24px;background:orange;border-radius:4px}
    #zoom{background:rgba(255,255,255,0.8);padding:4px;border-radius:8px;display:flex;flex-direction:column;align-items:center}
    #zoom input{writing-mode:bt-lr;-webkit-appearance:slider-vertical;height:100px;margin:4px 0}
  </style>
</head>
<body>
  <canvas id="c"></canvas>
  <div id="nav">
    <div id="compassWrap">
      <canvas id="compass" width="80" height="80"></canvas>
      <div id="north">N</div>
    </div>
    <div id="pegman"></div>
    <div id="zoom">
      <button id="zoomIn">+</button>
      <input id="zoomSlider" type="range" min="10" max="200" value="100" />
      <button id="zoomOut">-</button>
    </div>
  </div>
</body>
</html>`);
    doc.close();

    function loadScript(src: string) {
      return new Promise<void>((resolve, reject) => {
        const s = doc.createElement('script');
        s.src = src;
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load ' + src));
        doc.body.appendChild(s);
      });
    }

    (async () => {
      await loadScript('https://unpkg.com/three@0.134.0/build/three.min.js');
      await loadScript('https://unpkg.com/three@0.134.0/examples/js/controls/OrbitControls.js');

      const THREE = (win as any).THREE;
      const canvas = doc.getElementById('c') as HTMLCanvasElement;
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
      renderer.setSize(win.innerWidth, win.innerHeight);
      renderer.setClearColor(0x000000);

      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x000000);

      const camera = new THREE.PerspectiveCamera(
        60,
        win.innerWidth / win.innerHeight,
        0.1,
        100000
      );
      camera.up.set(0, 0, 1);

      const controls = new THREE.OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.screenSpacePanning = false;
      controls.minPolarAngle = 0;
      controls.maxPolarAngle = Math.PI;
      controls.mouseButtons.LEFT = THREE.MOUSE.PAN;
      controls.mouseButtons.RIGHT = THREE.MOUSE.ROTATE;
      controls.mouseButtons.MIDDLE = THREE.MOUSE.DOLLY;
      controls.touches.ONE = THREE.TOUCH.PAN;
      controls.touches.TWO = THREE.TOUCH.DOLLY_ROTATE;
      canvas.addEventListener('contextmenu', (e) => e.preventDefault());

      const compassCanvas = doc.getElementById('compass') as HTMLCanvasElement;
      const compassRenderer = new THREE.WebGLRenderer({ canvas: compassCanvas, alpha: true });
      compassRenderer.setSize(80, 80);
      compassRenderer.setClearColor(0x000000, 0);
      const compassScene = new THREE.Scene();
      const compassCamera = new THREE.PerspectiveCamera(50, 1, 0.1, 10);
      compassCamera.position.set(0, 0, 2);
      const compassObj = new THREE.Group();
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.9, 1, 32),
        new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide })
      );
      ring.rotation.x = Math.PI / 2;
      const arrowMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.4, 32), arrowMat);
      cone.position.y = 0.8;
      const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.8, 32), arrowMat);
      cyl.position.y = 0.4;
      compassObj.add(ring, cone, cyl);
      compassScene.add(compassObj);

      const xs: number[] = [], ys: number[] = [], zs: number[] = [];
      data.nodes.forEach((n) => {
        xs.push(n.x);
        ys.push(n.y);
        zs.push(n.ground, n.invOut);
      });
      data.pipes.forEach((p) => {
        xs.push(p.start.x, p.end.x);
        ys.push(p.start.y, p.end.y);
        zs.push(
          p.start.z - p.diam / 2,
          p.start.z + p.diam / 2,
          p.end.z - p.diam / 2,
          p.end.z + p.diam / 2
        );
      });
      let minX = Math.min(...xs),
        maxX = Math.max(...xs);
      let minY = Math.min(...ys),
        maxY = Math.max(...ys);
      let minZ = Math.min(...zs),
        maxZ = Math.max(...zs);
      if (!isFinite(minX)) {
        minX = maxX = minY = maxY = minZ = maxZ = 0;
      }
      const cx = (maxX + minX) / 2,
        cy = (maxY + minY) / 2,
        cz = (maxZ + minZ) / 2;
      const size = Math.max(maxX - minX, maxY - minY, maxZ - minZ) || 1;
      data.nodes.forEach((n) => {
        n.x -= cx;
        n.y -= cy;
        n.ground -= cz;
        n.invOut -= cz;
      });
      data.pipes.forEach((p) => {
        p.start.x -= cx;
        p.start.y -= cy;
        p.start.z -= cz;
        p.end.x -= cx;
        p.end.y -= cy;
        p.end.z -= cz;
      });

      function reset() {
        camera.position.set(0, -size, size);
        controls.target.set(0, 0, 0);
        controls.update();
      }
      reset();

      compassCanvas.addEventListener('click', reset);

      const slider = doc.getElementById('zoomSlider') as HTMLInputElement;

      function updateSlider() {
        const distance = camera.position.distanceTo(controls.target);
        slider.value = String((distance / size) * 100);
      }

      doc.getElementById('zoomIn')?.addEventListener('click', () => {
        controls.dollyIn(1.2);
        controls.update();
        updateSlider();
      });
      doc.getElementById('zoomOut')?.addEventListener('click', () => {
        controls.dollyOut(1.2);
        controls.update();
        updateSlider();
      });
      slider?.addEventListener('input', () => {
        const sliderValue = slider.valueAsNumber;
        if (!Number.isFinite(sliderValue)) return;

        const desired = (sliderValue / 100) * size;
        if (!Number.isFinite(desired) || desired <= 0) return;

        const distance = camera.position.distanceTo(controls.target);
        if (!Number.isFinite(distance)) return;

        const moveToDesired = () => {
          const offset = camera.position.clone().sub(controls.target);
          if (offset.lengthSq() === 0) {
            offset.set(0, -1, 1);
          }
          offset.normalize().multiplyScalar(desired);
          camera.position.copy(controls.target).add(offset);
        };

        if (distance <= 1e-6) {
          moveToDesired();
        } else {
          const ratio = distance / desired;
          if (!Number.isFinite(ratio) || ratio <= 0) {
            moveToDesired();
          } else if (ratio > 1) {
            controls.dollyIn(ratio);
          } else {
            controls.dollyOut(1 / ratio);
          }
        }

        controls.update();
        updateSlider();
      });
      controls.addEventListener('change', updateSlider);
      updateSlider();

      const amb = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(amb);
      const dir = new THREE.DirectionalLight(0xffffff, 0.8);
      dir.position.set(100, 100, 100);
      scene.add(dir);

      data.nodes.forEach((n) => {
        const s = new THREE.Vector3(n.x, n.y, n.invOut);
        const e = new THREE.Vector3(n.x, n.y, n.ground);
        const dv = new THREE.Vector3().subVectors(e, s);
        const g = new THREE.CylinderGeometry(
          n.diam / 2,
          n.diam / 2,
          dv.length(),
          16
        );
        const m = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(g, m);
        const axis = new THREE.Vector3(0, 1, 0);
        mesh.quaternion.setFromUnitVectors(axis, dv.clone().normalize());
        mesh.position.copy(s.clone().add(dv.multiplyScalar(0.5)));
        scene.add(mesh);
      });

      data.pipes.forEach((p) => {
        const s = new THREE.Vector3(p.start.x, p.start.y, p.start.z);
        const e = new THREE.Vector3(p.end.x, p.end.y, p.end.z);
        const dv = new THREE.Vector3().subVectors(e, s);
        const g = new THREE.CylinderGeometry(
          p.diam / 2,
          p.diam / 2,
          dv.length(),
          8
        );
        const m = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(g, m);
        const axis = new THREE.Vector3(0, 1, 0);
        mesh.quaternion.setFromUnitVectors(axis, dv.clone().normalize());
        mesh.position.copy(s.clone().add(dv.multiplyScalar(0.5)));
        scene.add(mesh);
      });

      function animate() {
        controls.update();
        renderer.render(scene, camera);
        compassObj.quaternion.copy(camera.quaternion).invert();
        compassRenderer.render(compassScene, compassCamera);
        win.requestAnimationFrame(animate);
      }
      animate();

      win.addEventListener('resize', () => {
        camera.aspect = win.innerWidth / win.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(win.innerWidth, win.innerHeight);
      });
    })().catch((err) => console.error(err));

    addLog('3D Pipe Network viewer opened');
  }, [addLog, layers, projection]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header
        computeEnabled={computeEnabled}
        onCompute={handleCompute}
        exportEnabled={exportEnabled}
        onExport={() => setExportModalOpen(true)}
        onView3D={handleView3D}
        view3DEnabled={pipe3DEnabled}
        projectName={projectName}
        onProjectNameChange={setProjectName}
        projectVersion={projectVersion}
        onProjectVersionChange={setProjectVersion}
      />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 md:w-96 2xl:w-[32rem] bg-gray-800 p-4 md:p-6 flex flex-col space-y-6 overflow-y-auto shadow-lg border-r border-gray-700">
          <FileUpload
            onLayerAdded={handleLayerAdded}
            onLoading={handleLoading}
            onError={handleError}
            onLog={addLog}
            isLoading={isLoading}
            onCreateLayer={handleCreateLayer}
            existingLayerNames={layers.map(l => l.name)}
            onPreviewReady={handlePreviewReady}
          />
          {previewLayer && (
            <LayerPreview
              data={previewLayer.data}
              fileName={previewLayer.fileName}
              detectedName={previewLayer.detectedName}
              onConfirm={handleConfirmPreview}
              onCancel={handleCancelPreview}
            />
          )}
          <InfoPanel
            layers={layers}
            error={error}
            logs={logs}
            onRemoveLayer={handleRemoveLayer}
            onZoomToLayer={handleZoomToLayer}
            onToggleEditLayer={handleToggleEditLayer}
            onToggleVisibility={handleToggleLayerVisibility}
            onChangeStyle={handleChangeLayerStyle}
            editingLayerId={editingTarget.layerId}
          />
        </aside>
        <main className="flex-1 bg-gray-900 h-full">
          {layers.length > 0 ? (
            <MapComponent
              layers={layers}
              onUpdateFeatureHsg={handleUpdateFeatureHsg}
              onUpdateFeatureDaName={handleUpdateFeatureDaName}
              onUpdateFeatureLandCover={handleUpdateFeatureLandCover}
              onUpdateFeatureSubareaName={handleUpdateFeatureSubareaName}
              onUpdateFeatureSubareaParent={handleUpdateFeatureSubareaParent}
              landCoverOptions={landCoverOptions}
              zoomToLayer={zoomToLayer}
              editingTarget={editingTarget}
              onSelectFeatureForEditing={handleSelectFeatureForEditing}
              onUpdateLayerGeojson={handleUpdateLayerGeojson}
              onSaveEdits={handleSaveEditing}
              onDiscardEdits={handleDiscardEditing}
              onLayerVisibilityChange={handleToggleLayerVisibility}
            />
          ) : (
            <InstructionsPage />
          )}
        </main>
      </div>
      {computeTasks && (
        <ComputeModal tasks={computeTasks} onClose={() => setComputeTasks(null)} />
      )}
      {exportModalOpen && (
        <ExportModal
          onExportHydroCAD={handleExportHydroCAD}
          onExportSWMM={handleExportSWMM}
          onExportShapefiles={handleExportShapefiles}
          onClose={() => setExportModalOpen(false)}
          exportHydroCADEnabled={exportHydroCADEnabled}
          exportSWMMEnabled={exportSWMMEnabled}
          exportShapefilesEnabled={exportShapefilesEnabled}
          projection={projection}
          onProjectionChange={(epsg) => {
            const proj = STATE_PLANE_OPTIONS.find(p => p.epsg === epsg);
            if (proj) {
              setProjection(proj);
              setProjectionConfirmed(false);
            }
          }}
          onProjectionConfirm={() => setProjectionConfirmed(true)}
          projectionConfirmed={projectionConfirmed}
        />
      )}
      {mappingLayer && (
        <FieldMapModal
          layerName={mappingLayer.name}
          properties={mappingLayer.data.features[0]?.properties || {}}
          onConfirm={handleFieldMapConfirm}
          onCancel={handleFieldMapCancel}
        />
      )}
    </div>
  );
};

export default App;
