import React, { useState, useCallback, useEffect } from 'react';
import type { FeatureCollection } from 'geojson';
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

const DEFAULT_COLORS: Record<string, string> = {
  'Drainage Areas': '#67e8f9',
  'Land Cover': '#22c55e',
  'LOD': '#ef4444',
  'Soil Layer from Web Soil Survey': '#8b4513',
  'Drainage Area in LOD': '#67e8f9',
  'Land Cover in LOD': '#22c55e',
  'WSS in LOD': '#8b4513',
  Overlay: '#f97316',
};
const DEFAULT_OPACITY = 0.5;

const getDefaultColor = (name: string) => DEFAULT_COLORS[name] || '#67e8f9';

type UpdateHsgFn = (layerId: string, featureIndex: number, hsg: string) => void;
type UpdateDaNameFn = (layerId: string, featureIndex: number, name: string) => void;
type UpdateLandCoverFn = (layerId: string, featureIndex: number, value: string) => void;

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

  const requiredLayers = [
    'Drainage Areas',
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
  const exportShapefilesPossible = computeSucceeded;
  const exportSWMMPossible = computeSucceeded || pipe3DEnabled;
  const exportShapefilesEnabled = exportShapefilesPossible && projectionConfirmed;
  const exportSWMMEnabled = exportSWMMPossible && projectionConfirmed;
  const exportEnabled =
    exportHydroCADEnabled || exportShapefilesPossible || exportSWMMPossible;

  const addLog = useCallback((message: string, type: 'info' | 'error' = 'info') => {
    setLogs(prev => [...prev, { message, type, source: 'frontend' as const }]);
  }, []);

  useEffect(() => {
    loadLandCoverList().then(list => setLandCoverOptions(list));
  }, []);

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

    const editable = KNOWN_LAYER_NAMES.includes(name);

    if (name === 'Drainage Areas') {
      geojson = {
        ...geojson,
        features: geojson.features.map(f => ({
          ...f,
          properties: { ...(f.properties || {}), DA_NAME: f.properties?.DA_NAME ?? '' }
        }))
      } as FeatureCollection;
    }

    if (name === 'Land Cover') {
      geojson = {
        ...geojson,
        features: geojson.features.map(f => {
          const raw = (f.properties as any)?.LandCover ?? (f.properties as any)?.LAND_COVER ?? '';
          const match =
            landCoverOptions.find(opt => opt.toLowerCase() === String(raw).toLowerCase()) ?? '';
          return {
            ...f,
            properties: { ...(f.properties || {}), LAND_COVER: match },
          };
        }),
      } as FeatureCollection;
    }

    if (name === 'Soil Layer from Web Soil Survey') {
      geojson = {
        ...geojson,
        features: geojson.features.map(f => ({
          ...f,
          properties: { ...(f.properties || {}), HSG: f.properties?.HSG ?? '' }
        }))
      } as FeatureCollection;
    }

    if (name === 'Pipes' && fieldMap) {
      const cbLayer = layers.find(l => l.name === 'Catch Basins / Manholes');
      const cbFeatures =
        cbLayer?.geojson.features.filter(
          f => f.geometry && f.geometry.type === 'Point'
        ) || [];
      const nearestCb = (pt: [number, number]) => {
        let best: any = null;
        let bestDist = Infinity;
        cbFeatures.forEach(cb => {
          const c = (cb.geometry as any).coordinates as [number, number];
          const dx = pt[0] - c[0];
          const dy = pt[1] - c[1];
          const d = dx * dx + dy * dy;
          if (d < bestDist) {
            bestDist = d;
            best = cb;
          }
        });
        return best;
      };
      const getDir = (a: [number, number], b: [number, number]) => {
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        if (Math.abs(dx) > Math.abs(dy)) return dx >= 0 ? 'E' : 'W';
        return dy >= 0 ? 'N' : 'S';
      };
      const invFromCb = (cb: any, dir: 'N' | 'S' | 'E' | 'W') => {
        if (!cb) return null;
        const p = cb.properties || {};
        const keyMap: Record<string, string> = {
          N: 'Invert N [ft]',
          S: 'Invert S [ft]',
          E: 'Invert E [ft]',
          W: 'Invert W [ft]',
        };
        const val = Number(p[keyMap[dir]]);
        if (val && !isNaN(val)) return val;
        const outVal = Number(p['Inv Out [ft]']);
        return outVal && !isNaN(outVal) ? outVal : null;
      };
      const invOutFromCb = (cb: any) => {
        if (!cb) return null;
        const val = Number(cb.properties?.['Inv Out [ft]']);
        return val && !isNaN(val) ? val : null;
      };
      geojson = {
        ...geojson,
        features: geojson.features.map((f, i) => {
          const props = f.properties || {};
          const lblSrc = fieldMap.label && props[fieldMap.label] != null ? props[fieldMap.label] : null;
          const label = lblSrc && String(lblSrc).trim() !== '' ? String(lblSrc) : `Pipe-${i + 1}`;
          const diamSrc = fieldMap.diameter && props[fieldMap.diameter] !== undefined ? Number(props[fieldMap.diameter]) : NaN;
          const roughSrc = fieldMap.roughness && props[fieldMap.roughness] !== undefined ? Number(props[fieldMap.roughness]) : NaN;
          let invIn = fieldMap.inv_in && props[fieldMap.inv_in] !== undefined ? Number(props[fieldMap.inv_in]) : null;
          let invOut = fieldMap.inv_out && props[fieldMap.inv_out] !== undefined ? Number(props[fieldMap.inv_out]) : null;
          let direction: string | null = null;
          if (fieldMap.direction && props[fieldMap.direction] != null) {
            direction = String(props[fieldMap.direction]);
          } else if ((props as any)['Directions']) {
            direction = String((props as any)['Directions']);
          }
          let inletOffset: number | null = null;
          let outletOffset: number | null = null;
          if (!direction && f.geometry && f.geometry.type === 'LineString' && cbFeatures.length) {
            const coords = f.geometry.coordinates as number[][];
            const start = coords[0] as [number, number];
            const end = coords[coords.length - 1] as [number, number];
            const second = coords[1] as [number, number] | undefined;
            const prev = coords[coords.length - 2] as [number, number] | undefined;
            const cbStart = nearestCb(start);
            const cbEnd = nearestCb(end);
            const dirStart = second ? getDir(start, second) : null;
            const dirEnd = prev ? getDir(end, prev) : null;
            if (!invIn && dirStart) {
              invIn = invFromCb(cbStart, dirStart);
            }
            if (!invOut && dirEnd) {
              invOut = invFromCb(cbEnd, dirEnd);
            }
            const nodeStart = invOutFromCb(cbStart);
            const nodeEnd = invOutFromCb(cbEnd);
            let fromCb = cbStart;
            let toCb = cbEnd;
            let invInVal = invIn;
            let invOutVal = invOut;
            let fromNode = nodeStart;
            let toNode = nodeEnd;
            if (nodeStart != null && nodeEnd != null && nodeStart < nodeEnd) {
              fromCb = cbEnd;
              toCb = cbStart;
              invInVal = invOut;
              invOutVal = invIn;
              fromNode = nodeEnd;
              toNode = nodeStart;
            }
            const fromLabel = fromCb?.properties?.['Label'];
            const toLabel = toCb?.properties?.['Label'];
            direction = fromLabel && toLabel ? `${fromLabel} to ${toLabel}` : null;
            inletOffset = invInVal != null && fromNode != null ? invInVal - fromNode : null;
            outletOffset = invOutVal != null && toNode != null ? invOutVal - toNode : null;
            invIn = invInVal;
            invOut = invOutVal;
          }
          const diameter = !isNaN(diamSrc) && diamSrc > 0 ? diamSrc : 15;
          const roughness = !isNaN(roughSrc) && roughSrc > 0 ? roughSrc : 0.012;
          return {
            ...f,
            properties: {
              'Label': label,
              'Directions': direction,
              'Elevation Invert In [ft]': invIn,
              'Elevation Invert Out [ft]': invOut,
              'Inlet Offset [InOffset]': inletOffset,
              'Outlet Offset [OutOffset]': outletOffset,
              'Diameter [in]': diameter,
              'Roughness': roughness,
            },
          };
        }),
      } as FeatureCollection;
    }

    if (name === 'Catch Basins / Manholes' && fieldMap) {
      geojson = {
        ...geojson,
        features: geojson.features.map((f, i) => {
          const props = f.properties || {};
          const lblSrc = fieldMap.label && props[fieldMap.label] != null ? props[fieldMap.label] : null;
          const label = lblSrc && String(lblSrc).trim() !== ''
            ? String(lblSrc)
            : `CB-MH-${Math.floor(Math.random() * 200) + 1}`;
          const getInv = (k: string) => {
            const col = fieldMap[k];
            if (!col) return null;
            const val = Number((props as any)[col]);
            if (!val || val === 0 || isNaN(val)) return null;
            return val;
          };
          const invN = getInv('inv_n');
          const invS = getInv('inv_s');
          const invE = getInv('inv_e');
          const invW = getInv('inv_w');
          let invOut = fieldMap.inv_out && props[fieldMap.inv_out] !== undefined
            ? Number((props as any)[fieldMap.inv_out])
            : null;
          if (invOut === null || isNaN(invOut)) {
            const invs = [invN, invS, invE, invW].filter((v): v is number => v !== null);
            invOut = invs.length ? Math.min(...invs) : null;
          }
          const ground =
            fieldMap.ground && props[fieldMap.ground] !== undefined
              ? Number((props as any)[fieldMap.ground]) || null
              : null;
          return {
            ...f,
            properties: {
              'Label': label,
              'Elevation Ground [ft]': ground,
              'Invert N [ft]': invN,
              'Invert S [ft]': invS,
              'Invert E [ft]': invE,
              'Invert W [ft]': invW,
              'Inv Out [ft]': invOut,
            },
          };
        }),
      } as FeatureCollection;
    }
    setLayers(prevLayers => {
      const existing = prevLayers.find(l => l.name === name);
      if (existing) {
        const updated = prevLayers.map(l =>
          l.name === name ? { ...l, geojson, editable, fieldMap: fieldMap ?? l.fieldMap } : l
        );
        addLog(`Updated layer ${name} with uploaded data`);
        return updated;
      }
      const newLayer: LayerData = {
        id: `${Date.now()}-${name}`,
        name,
        geojson,
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

  const handleUpdateFeatureHsg = useCallback<UpdateHsgFn>((layerId, featureIndex, hsg) => {
    setLayers(prev => prev.map(layer => {
      if (layer.id !== layerId) return layer;
      const features = [...layer.geojson.features];
      const feature = { ...features[featureIndex] };
      feature.properties = { ...(feature.properties || {}), HSG: hsg };
      features[featureIndex] = feature;
      return { ...layer, geojson: { ...layer.geojson, features } };
    }));
    addLog(`Set HSG for feature ${featureIndex} in ${layerId} to ${hsg}`);
  }, [addLog]);

  const handleUpdateFeatureDaName = useCallback<UpdateDaNameFn>((layerId, featureIndex, nameVal) => {
    setLayers(prev => prev.map(layer => {
      if (layer.id !== layerId) return layer;
      const features = [...layer.geojson.features];
      const feature = { ...features[featureIndex] };
      feature.properties = { ...(feature.properties || {}), DA_NAME: nameVal };
      features[featureIndex] = feature;
      return { ...layer, geojson: { ...layer.geojson, features } };
    }));
    addLog(`Set Drainage Area name for feature ${featureIndex} in ${layerId} to ${nameVal}`);
  }, [addLog]);

  const handleUpdateFeatureLandCover = useCallback<UpdateLandCoverFn>((layerId, featureIndex, value) => {
    setLayers(prev => prev.map(layer => {
      if (layer.id !== layerId) return layer;
      const features = [...layer.geojson.features];
      const feature = { ...features[featureIndex] };
      feature.properties = { ...(feature.properties || {}), LAND_COVER: value };
      features[featureIndex] = feature;
      return { ...layer, geojson: { ...layer.geojson, features } };
    }));
    addLog(`Set Land Cover for feature ${featureIndex} in ${layerId} to ${value}`);
  }, [addLog]);

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
    const wss = layers.find(l => l.name === 'Soil Layer from Web Soil Survey');
    const lc = layers.find(l => l.name === 'Land Cover');
    if (!lod) return;

    const tasks: ComputeTask[] = [
      { id: 'check_lod', name: 'Check LOD has one polygon', status: 'pending' },
      { id: 'check_attrs', name: 'Validate required attributes', status: 'pending' },
      { id: 'clip_da', name: 'Create Drainage Area in LOD', status: 'pending' },
      { id: 'clip_wss', name: 'Create WSS in LOD', status: 'pending' },
      { id: 'clip_lc', name: 'Create Land Cover in LOD', status: 'pending' },
      { id: 'overlay', name: 'Overlay processed layers', status: 'pending' }
    ];
    setComputeTasks(tasks);

    setLayers(prev => prev.filter(l => l.category !== 'Process'));

    if (lod.geojson.features.length !== 1) {
      setComputeTasks(prev => prev.map(t => ({ ...t, status: 'error' })));
      addLog('LOD layer must contain exactly one polygon', 'error');
      return;
    }

    setComputeTasks(prev => prev.map(t => t.id === 'check_lod' ? { ...t, status: 'success' } : t));

    const missingAttrs: Record<string, string[]> = {};
    const checkAttr = (layer: typeof da | typeof wss | typeof lc | undefined, layerName: string, attr: string) => {
      if (!layer) return;
      const hasMissing = layer.geojson.features.some(f => !f.properties || !f.properties[attr]);
      if (hasMissing) {
        if (!missingAttrs[layerName]) missingAttrs[layerName] = [];
        missingAttrs[layerName].push(attr);
      }
    };

    checkAttr(da, 'Drainage Areas', 'DA_NAME');
    checkAttr(wss, 'Soil Layer from Web Soil Survey', 'HSG');
    checkAttr(lc, 'Land Cover', 'LAND_COVER');

    if (Object.keys(missingAttrs).length > 0) {
      const msg = Object.entries(missingAttrs)
        .map(([layer, attrs]) => `${layer}: ${attrs.join(', ')}`)
        .join('; ');
      setComputeTasks(prev => prev.map(t => t.id === 'check_attrs' ? { ...t, status: 'error' } : t));
      addLog(`Missing required attributes -> ${msg}`, 'error');
      return;
    }

    setComputeTasks(prev => prev.map(t => t.id === 'check_attrs' ? { ...t, status: 'success' } : t));

    try {
      const { intersect, featureCollection } = await import('@turf/turf');
      const lodGeom = lod.geojson.features[0];


      const resultLayers: LayerData[] = [];

      const processLayer = (source: typeof da | typeof wss | typeof lc | undefined, taskId: string, name: string) => {
        if (!source) return;
        const clipped: any[] = [];
        source.geojson.features.forEach(f => {
          const fc = featureCollection([f as any, lodGeom as any]);
          const inter = intersect(fc as any);
          if (inter) {
            inter.properties = { ...(f.properties || {}) };
            clipped.push(inter);
          }
        });
        if (clipped.length > 0) {
          resultLayers.push({
            id: `${Date.now()}-${name}`,
            name,
            geojson: { type: 'FeatureCollection', features: clipped } as FeatureCollection,
            editable: true,
            visible: true,
            fillColor: getDefaultColor(name),
            fillOpacity: DEFAULT_OPACITY,
            category: 'Process',
          });
          setComputeTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'success' } : t));
          addLog(`${name} created`);
        } else {
          setComputeTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'error' } : t));
          addLog(`No features for ${name}`, 'error');

        }
      };

      processLayer(da, 'clip_da', 'Drainage Area in LOD');
      processLayer(wss, 'clip_wss', 'WSS in LOD');
      processLayer(lc, 'clip_lc', 'Land Cover in LOD');

      const daLayer = resultLayers.find(l => l.name === 'Drainage Area in LOD');
      const wssLayer = resultLayers.find(l => l.name === 'WSS in LOD');
      const lcLayer = resultLayers.find(l => l.name === 'Land Cover in LOD');

      if (daLayer && wssLayer && lcLayer) {
        const overlay: any[] = [];
        daLayer.geojson.features.forEach(daF => {
          wssLayer.geojson.features.forEach(wssF => {
            const fc1 = featureCollection([daF as any, wssF as any]);
            const inter1 = intersect(fc1 as any);
            if (!inter1) return;
            lcLayer.geojson.features.forEach(lcF => {
              const fc2 = featureCollection([inter1 as any, lcF as any]);
              const inter2 = intersect(fc2 as any);
              if (inter2) {
                inter2.properties = {
                  ...(daF.properties || {}),
                  ...(wssF.properties || {}),
                  ...(lcF.properties || {})
                };
                overlay.push(inter2);
              }
            });
          });
        });

        // Load CN values and assign CN attribute
        const cnRecords = await loadCnValues();
        const cnMap = new Map(cnRecords.map(r => [r.LandCover, r]));
        overlay.forEach(f => {
          const lcName = (f.properties as any)?.LAND_COVER;
          const hsg = (f.properties as any)?.HSG;
          const rec = lcName ? cnMap.get(lcName) : undefined;
          const cnValue = rec ? (rec as any)[hsg as keyof CnRecord] : undefined;
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
          setComputeTasks(prev => prev.map(t => t.id === 'overlay' ? { ...t, status: 'success' } : t));
          addLog('Overlay created');
        } else {
          setComputeTasks(prev => prev.map(t => t.id === 'overlay' ? { ...t, status: 'error' } : t));
          addLog('No overlay generated', 'error');
        }
      } else {
        setComputeTasks(prev => prev.map(t => t.id === 'overlay' ? { ...t, status: 'error' } : t));
        addLog('Required processed layers missing for overlay', 'error');
      }

      setLayers(prev => {
        const withoutProcess = prev.filter(l => l.category !== 'Process');
        let finalLayers = [...withoutProcess, ...resultLayers];
        if (finalLayers.some(l => l.name === 'Overlay')) {
          finalLayers = finalLayers.map(l =>
            l.name === 'Overlay' ? { ...l, visible: true } : { ...l, visible: false }
          );
        }
        return finalLayers;
      });
    } catch (err) {
      setComputeTasks(prev => prev.map(t => t.status === 'pending' ? { ...t, status: 'error' } : t));
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

      let content = `[HydroCAD]\nFileUnits=English\nCalcUnits=English\nInputUnits=English-LowFlow\nReportUnits=English-LowFlow\nLargeAreas=False\nSource=HydroCAD\u00ae 10.20-6a  s/n 07447  \u00a9 2024 HydroCAD Software Solutions LLC\nName=${projectName || 'Project'}\nPath=\nView=-5.46349942062574 0 15.4634994206257 10\nGridShow=True\nGridSnap=True\nTimeSpan=0 86400\nTimeInc=36\nMaxGraph=0\nRunoffMethod=SCS TR-20\nReachMethod=Stor-Ind+Trans\nPondMethod=Stor-Ind\nUH=SCS\nMinTc=300\nRainEvent=test\n\n[EVENT]\nRainEvent=test\nStormType=Type II 24-hr\nStormDepth=0.0833333333333333\n`;

      let y = 0;
      Object.entries(nodes).forEach(([da, areas]) => {
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

    const project = proj4('EPSG:4326', projection.proj4);

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

    const getProp = (props: any, candidates: string[]) => {
      if (!props) return undefined;
      const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
      const keys = Object.keys(props);
      for (const cand of candidates) {
        const target = norm(cand);
        for (const key of keys) {
          const nk = norm(key);
          if (nk === target || nk.includes(target) || target.includes(nk)) {
            return (props as any)[key];
          }
        }
      }
      return undefined;
    };

    const getMapped = (
      props: any,
      map: Record<string, string> | undefined,
      key: string,
      candidates: string[]
    ) => {
      if (map && map[key] && props && (props as any)[map[key]] !== undefined) {
        return (props as any)[map[key]];
      }
      return getProp(props, candidates);
    };

    const jLayer = layers.find((l) => l.name === 'Catch Basins / Manholes');
    const pLayer = layers.find((l) => l.name === 'Pipes');

    const nodes: { id: string; coord: [number, number]; invert: number }[] = [];

    if (jLayer) {
      const jMap = jLayer.fieldMap;
      jLayer.geojson.features.forEach((f, i) => {
        if (!f.geometry || f.geometry.type !== 'Point') return;
        const raw = String(getMapped(f.properties, jMap, 'label', ['Label']) ?? '');
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
            'Inv Out [ft]:'
          ]) ?? 0
        );
        const maxDepth = ground - invert;
        const coord = project.forward(
          (f.geometry as any).coordinates as [number, number]
        );
        const isOutfall = raw.toUpperCase().startsWith('OF');
        if (isOutfall) {
          outfallLines.push(`${id}\t${invert}\tFREE`);
        } else {
          junctionLines.push(`${id}\t${invert}\t${maxDepth}\t0\t0\t0`);
        }
        coordLines.push(`${id}\t${coord[0]}\t${coord[1]}`);
        nodes.push({ id, coord, invert });
      });
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

    if (pLayer && nodes.length) {
      const pMap = pLayer.fieldMap;
      pLayer.geojson.features.forEach((f, i) => {
        if (!f.geometry || f.geometry.type !== 'LineString') return;
        const raw = String(getMapped(f.properties, pMap, 'label', ['Label']) ?? '');
        const id = sanitizeId(raw, i);
        const coords = f.geometry.coordinates as number[][];
        const dirStr = String(
          getMapped(f.properties, pMap, 'direction', ['Directions']) ?? ''
        );
        let from: typeof nodes[number] | undefined;
        let to: typeof nodes[number] | undefined;
        if (dirStr.includes(' to ')) {
          const [a, b] = dirStr.split(/\s+to\s+/);
          const fromId = sanitizeId(a, 0);
          const toId = sanitizeId(b, 0);
          from = nodes.find((n) => n.id === fromId);
          to = nodes.find((n) => n.id === toId);
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
          getMapped(f.properties, pMap, 'inv_in', ['Elevation Invert In [ft]']) ?? 0
        );
        const invOut = Number(
          getMapped(f.properties, pMap, 'inv_out', ['Elevation Invert Out [ft]']) ?? 0
        );
        const diamFt = diamIn / 12;
        const inOffset = from ? invIn - from.invert : 0;
        const outOffset = to ? invOut - to.invert : 0;
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
    const processedLayers = layers.filter(
      l =>
        l.category === 'Process' ||
        l.name === 'Pipes' ||
        l.name === 'Catch Basins / Manholes'
    );
    if (processedLayers.length === 0) {
      addLog('No processed layers to export', 'error');
      return;
    }
    const JSZip = (await import('jszip')).default;
    const shpwrite = (await import('@mapbox/shp-write')).default as any;
    const zip = new JSZip();

    for (const layer of processedLayers) {
      const prepared = prepareForShapefile(layer.geojson, layer.name);
      const projected = reprojectFeatureCollection(prepared, projection.proj4);
      addLog(`Exporting "${layer.name}": ${projected.features.length} features`);
      let prj: string | undefined;
      try {
        prj = await fetch(`https://epsg.io/${projection.epsg}.prj`).then(r => r.text());
      } catch {}
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
  }, [addLog, layers, projectName, projectVersion, projection]);

  const handleView3D = useCallback(() => {
    const jLayer = layers.find((l) => l.name === 'Catch Basins / Manholes');
    const pLayer = layers.find((l) => l.name === 'Pipes');
    if (!jLayer || !pLayer) return;
    const projectFn = proj4('EPSG:4326', projection.proj4);
    const nodes = jLayer.geojson.features
      .filter((f) => f.geometry && f.geometry.type === 'Point')
      .map((f) => {
        const [x, y] = projectFn.forward(
          (f.geometry as any).coordinates as [number, number]
        );
        const props = f.properties as any;
        const ground = parseFloat(props?.['Elevation Ground [ft]']);
        const invOut = parseFloat(props?.['Inv Out [ft]']);
        if (!isFinite(ground) || !isFinite(invOut)) return null;
        return { x, y, ground, invOut, diam: 4 };
      })
      .filter((n): n is { x: number; y: number; ground: number; invOut: number; diam: number } => n !== null);
    const pipes = pLayer.geojson.features
      .filter(
        (f) =>
          f.geometry &&
          (f.geometry.type === 'LineString' ||
            f.geometry.type === 'MultiLineString')
      )
      .map((f) => {
        const coords =
          f.geometry.type === 'LineString'
            ? ((f.geometry as any).coordinates as number[][])
            : ((f.geometry as any).coordinates[0] as number[][]);
        const [sx, sy] = projectFn.forward(coords[0] as [number, number]);
        const [ex, ey] = projectFn.forward(
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
          start: { x: sx, y: sy, z: invIn },
          end: { x: ex, y: ey, z: invOut },
          diam,
        };
      })
      .filter((p): p is { start: { x: number; y: number; z: number }; end: { x: number; y: number; z: number }; diam: number } => p !== null);
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
        zs.push(p.start.z, p.end.z);
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
        const distance = camera.position.distanceTo(controls.target);
        const desired = (slider.valueAsNumber / 100) * size;
        const ratio = distance / desired;
        if (ratio > 1) controls.dollyIn(ratio);
        else controls.dollyOut(1 / ratio);
        controls.update();
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
        onExport={() => {
          setProjectionConfirmed(false);
          setExportModalOpen(true);
        }}
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
            if (proj) setProjection(proj);
            setProjectionConfirmed(false);
          }}
          projectionConfirmed={projectionConfirmed}
          onProjectionConfirm={() => setProjectionConfirmed(true)}
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
