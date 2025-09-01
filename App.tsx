import React, { useState, useCallback, useEffect } from 'react';
import type { FeatureCollection } from 'geojson';
import type { LayerData, LogEntry } from './types';
import type { PCSWMMExportInput } from './types/export-pcswmm';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import InfoPanel from './components/InfoPanel';
import MapComponent from './components/MapComponent';
import InstructionsPage from './components/InstructionsPage';
import { KNOWN_LAYER_NAMES } from './utils/constants';
import LayerPreview from './components/LayerPreview';
import ComputeModal, { ComputeTask } from './components/ComputeModal';
import ExportModal from './components/ExportModal';
import { loadLandCoverList, loadCnValues, CnRecord } from './utils/landcover';
import { prepareForShapefile } from './utils/shp';

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
  const [computeTasks, setComputeTasks] = useState<ComputeTask[] | null>(null);
  const [computeSucceeded, setComputeSucceeded] = useState<boolean>(false);
  const [projectName, setProjectName] = useState<string>('');
  const [projectVersion, setProjectVersion] = useState<string>('V1');
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);

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

  const handleLayerAdded = useCallback((geojson: FeatureCollection, name: string) => {
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
    setLayers(prevLayers => {
      const existing = prevLayers.find(l => l.name === name);
      if (existing) {
        const updated = prevLayers.map(l => l.name === name ? { ...l, geojson, editable } : l);
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
      };
      addLog(`Loaded layer ${name}${editable ? '' : ' (view only)'}`);
      return [...prevLayers, newLayer];
    });
  }, [addLog, landCoverOptions]);

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
    handleLayerAdded(data, name);
    setPreviewLayer(null);
  }, [handleLayerAdded]);

  const handleCancelPreview = useCallback(() => {
    setPreviewLayer(null);
    addLog('Preview canceled');
  }, [addLog]);

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

  const handleExportPCSWMM = useCallback(async () => {
    const overlayLayer = layers.find(l => l.name === 'Overlay');
    if (!overlayLayer) {
      addLog('Overlay layer not found', 'error');
      return;
    }
    const { area } = await import('@turf/turf');
    const drainageAreas = overlayLayer.geojson.features.map(f => {
      const da = (f.properties as any)?.DA_NAME || 'DA';
      const a_m2 = area(f as any);
      return {
        id: da,
        area_m2: a_m2,
        pctImperv: 0,
        width_m: Math.sqrt(a_m2),
        slope_decimal: 0.01,
        raingageId: 'RG1',
        outletNodeId: 'OUTLET1'
      };
    });

    const today = new Date().toISOString().slice(0, 10);
    const payload: PCSWMMExportInput = {
      projectName: projectName || 'project',
      flowUnits: 'LPS',
      infiltration: 'HORTON',
      routing: 'DW',
      startDate: today,
      endDate: today,
      drainageAreas
    };

    try {
      const res = await fetch('/api/export/pcswwm.zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const filename = `${(projectName || 'project')}_${projectVersion}_pcswwm.zip`;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      addLog('PCSWMM project exported');
      setExportModalOpen(false);
    } catch {
      addLog('Error exporting PCSWMM', 'error');
    }
  }, [addLog, layers, projectName, projectVersion]);

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
  }, [addLog, layers, projectName, projectVersion]);

  const handleExportShapefiles = useCallback(async () => {
    const processedLayers = layers.filter(l => l.category === 'Process');
    if (processedLayers.length === 0) {
      addLog('No processed layers to export', 'error');
      return;
    }
    const JSZip = (await import('jszip')).default;
    const shpwrite = (await import('@mapbox/shp-write')).default as any;
    const zip = new JSZip();

    for (const layer of processedLayers) {
      const prepared = prepareForShapefile(layer.geojson, layer.name);
      addLog(`Exporting "${layer.name}": ${prepared.features.length} features`);
      const layerZipBuffer = await shpwrite.zip(prepared, { outputType: 'arraybuffer' });
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
  }, [addLog, layers, projectName, projectVersion]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header
        computeEnabled={computeEnabled}
        onCompute={handleCompute}
        exportEnabled={computeSucceeded}
        onExport={() => setExportModalOpen(true)}
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
          onExportPCSWMM={handleExportPCSWMM}
          onExportShapefiles={handleExportShapefiles}
          onClose={() => setExportModalOpen(false)}
          exportEnabled={computeSucceeded}
        />
      )}
    </div>
  );
};

export default App;
