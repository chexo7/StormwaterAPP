import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import type {
  FeatureCollection,
  Feature,
  LineString,
  Point,
  Polygon,
  MultiPolygon,
} from 'geojson';
import { area as turfArea, intersect as turfIntersect } from '@turf/turf';
import type { LayerData, LogEntry } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import InfoPanel from './components/InfoPanel';
import MapComponent from './components/MapComponent';
import InstructionsPage from './components/InstructionsPage';
import { KNOWN_LAYER_NAMES, MAX_DISCHARGE_POINTS } from './utils/constants';
import LayerPreview from './components/LayerPreview';
import ComputeModal, { ComputeTask } from './components/ComputeModal';
import FieldMapModal from './components/FieldMapModal';
import { loadCnValues, CnRecord } from './utils/landcover';
import { prepareForShapefile } from './utils/shp';
import proj4 from 'proj4';
import { ESRI_PRJ_BY_EPSG } from './utils/prj';
import {
  transformLayerGeojson,
  formatDischargePointName,
  createOverallDrainageArea,
} from './utils/layerTransforms';
import ScsStatusPanel, { ScsLayerStatus } from './components/ScsStatusPanel';
import CnTableModal from './components/CnTableModal';
import {
  applyHsgToFeatures,
  extractFeatureMusyms,
  fetchWssHsgRecords,
  simplifyHsgValue,
} from './utils/wssHsg';

const SUBAREA_LAYER_NAME = 'Drainage Subareas';
const OVERALL_DRAINAGE_LAYER_NAME = 'Overall Drainage Area';
const PROCESSED_SUBAREA_LAYER_NAME = 'Drainage Subareas (Computed)';
const AUTO_OVERLAY_LAYER_NAME = 'Overlay (Auto)';
const DA_NAME_ATTR = 'DA_NAME';
const SUBAREA_NAME_ATTR = 'SUBAREA_NAME';
const SUBAREA_PARENT_ATTR = 'PARENT_DA';
const COMPLEMENT_FLAG_ATTR = 'IS_COMPLEMENT';
const SUBAREA_AREA_ATTR = 'SUBAREA_AC';
const SQM_TO_ACRES = 0.000247105381;
const SQM_TO_SQFT = 10.76391041671;
const MIN_COMPLEMENT_AREA_SF = 100;
const MIN_COMPLEMENT_AREA_SQM = MIN_COMPLEMENT_AREA_SF / SQM_TO_SQFT;
const AREA_TOLERANCE_SQM = 0.01;

const DEFAULT_COLORS: Record<string, string> = {
  'Drainage Areas': '#67e8f9',
  [SUBAREA_LAYER_NAME]: '#3b82f6',
  [OVERALL_DRAINAGE_LAYER_NAME]: '#0ea5e9',
  'Land Cover': '#22c55e',
  'LOD': '#ef4444',
  'Soil Layer from Web Soil Survey': '#8b4513',
  [PROCESSED_SUBAREA_LAYER_NAME]: '#38bdf8',
  Overlay: '#f97316',
  [AUTO_OVERLAY_LAYER_NAME]: '#f97316',
};
const DEFAULT_OPACITY = 0.5;

const DEFAULT_PROJ4 =
  '+proj=merc +lon_0=0 +k=1 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs';
const SHAPEFILE_EPSG = '4326';

const getDefaultColor = (name: string) => DEFAULT_COLORS[name] || '#67e8f9';

const ensureOverallDrainageAreaLayer = (
  layers: LayerData[],
  baseGeojson: FeatureCollection | null
): LayerData[] => {
  const existingIndex = layers.findIndex(
    layer => layer.name === OVERALL_DRAINAGE_LAYER_NAME
  );

  const overallGeojson = baseGeojson
    ? createOverallDrainageArea(baseGeojson)
    : { type: 'FeatureCollection', features: [] };

  if (!overallGeojson.features.length) {
    if (existingIndex === -1) return layers;
    const next = layers.filter(layer => layer.name !== OVERALL_DRAINAGE_LAYER_NAME);
    return next;
  }
  const baseLayers = layers.filter(layer => layer.name !== OVERALL_DRAINAGE_LAYER_NAME);
  const drainageAreasIndex = baseLayers.findIndex(layer => layer.name === 'Drainage Areas');
  const insertionIndex = drainageAreasIndex === -1 ? baseLayers.length : drainageAreasIndex;

  if (existingIndex === -1) {
    const newLayer: LayerData = {
      id: `${Date.now()}-${OVERALL_DRAINAGE_LAYER_NAME}`,
      name: OVERALL_DRAINAGE_LAYER_NAME,
      geojson: overallGeojson,
      editable: false,
      visible: true,
      fillColor: getDefaultColor(OVERALL_DRAINAGE_LAYER_NAME),
      fillOpacity: DEFAULT_OPACITY,
      category: 'Derived',
    };
    const next = [...baseLayers];
    next.splice(insertionIndex, 0, newLayer);
    return next;
  }

  const updatedLayer: LayerData = {
    ...layers[existingIndex],
    geojson: overallGeojson,
  };
  const next = [...baseLayers];
  next.splice(insertionIndex, 0, updatedLayer);
  return next;
};

const isPolygonLike = (
  feature: Feature
): feature is Feature<Polygon | MultiPolygon> => {
  const { geometry } = feature;
  if (!geometry) return false;
  return geometry.type === 'Polygon' || geometry.type === 'MultiPolygon';
};

const computeFeatureAreaSqm = (
  feature: Feature<Polygon | MultiPolygon> | null
): number => {
  if (!feature || !feature.geometry) return 0;
  try {
    return turfArea(feature as any);
  } catch (err) {
    console.warn('Failed to compute feature area', err);
    return 0;
  }
};

const sumPolygonAreasSqm = (collection: FeatureCollection): number =>
  collection.features.reduce((sum, feature) => {
    if (!isPolygonLike(feature)) return sum;
    return sum + computeFeatureAreaSqm(feature);
  }, 0);

const getOverallDrainageFeature = (
  layers: LayerData[]
): Feature<Polygon | MultiPolygon> | null => {
  const overallLayer = layers.find(l => l.name === OVERALL_DRAINAGE_LAYER_NAME);
  if (!overallLayer) return null;
  const polygonFeature = overallLayer.geojson.features.find(isPolygonLike);
  if (!polygonFeature || !polygonFeature.geometry) return null;
  return polygonFeature as Feature<Polygon | MultiPolygon>;
};

const clipCollectionToOverall = (
  collection: FeatureCollection,
  overall: Feature<Polygon | MultiPolygon>
): FeatureCollection => {
  const clippedFeatures: Feature[] = [];
  collection.features.forEach(feature => {
    if (!feature.geometry) return;
    if (!isPolygonLike(feature)) {
      clippedFeatures.push(feature);
      return;
    }
    try {
      const clipped = turfIntersect({
        type: 'FeatureCollection',
        features: [feature as any, overall as any],
      } as any);
      if (!clipped || !clipped.geometry) return;
      if (
        clipped.geometry.type !== 'Polygon' &&
        clipped.geometry.type !== 'MultiPolygon'
      ) {
        return;
      }
      const clippedFeature: Feature<Polygon | MultiPolygon> = {
        type: 'Feature',
        geometry: clipped.geometry as Polygon | MultiPolygon,
        properties: { ...(feature.properties || {}) },
      };
      if (feature.id !== undefined) clippedFeature.id = feature.id;
      const area = computeFeatureAreaSqm(clippedFeature);
      if (area <= AREA_TOLERANCE_SQM) return;
      clippedFeatures.push(clippedFeature);
    } catch (err) {
      console.warn('Failed to clip feature to Overall Drainage Area', err);
    }
  });
  return { ...collection, features: clippedFeatures };
};

type HydroCADAreaGroup = { area: number; cn: number; desc?: string };

type HydroCADSubcatchment = {
  id: string;
  name: string;
  parentDa?: string | null;
  areas: HydroCADAreaGroup[];
};

const resolveSubareaName = (rawName: unknown, fallback: string): string => {
  if (rawName === undefined || rawName === null) return fallback;
  const value = String(rawName).trim();
  return value === '' ? fallback : value;
};

const getSubareaKey = (rawName: unknown, fallback: string): string =>
  resolveSubareaName(rawName, fallback).toLowerCase();

const aggregateOverlayForHydroCAD = (
  features: Feature[],
  subareas: Feature<Polygon | MultiPolygon>[]
): HydroCADSubcatchment[] => {
  type SubareaAggregate = {
    name: string;
    order: number;
    parents: Set<string>;
    groups: Map<string, HydroCADAreaGroup>;
  };

  const aggregates = new Map<string, SubareaAggregate>();

  const ensureAggregate = (
    rawName: unknown,
    fallbackName: string,
    order: number,
    parentRaw: unknown
  ): SubareaAggregate => {
    const name = resolveSubareaName(rawName, fallbackName);
    const key = name.toLowerCase();
    const parentValue = parentRaw ? formatDischargePointName(parentRaw) : '';
    const existing = aggregates.get(key);
    if (existing) {
      if (parentValue) existing.parents.add(parentValue);
      if (order < existing.order) existing.order = order;
      return existing;
    }
    const aggregate: SubareaAggregate = {
      name,
      order,
      parents: parentValue ? new Set([parentValue]) : new Set(),
      groups: new Map(),
    };
    aggregates.set(key, aggregate);
    return aggregate;
  };

  subareas.forEach((subFeature, index) => {
    const props = subFeature.properties || {};
    const rawName = (props as any)[SUBAREA_NAME_ATTR];
    const fallback = `Subarea ${index + 1}`;
    const parentRaw = (props as any)[SUBAREA_PARENT_ATTR] ?? null;
    ensureAggregate(rawName, fallback, index, parentRaw);
  });

  features.forEach((feature, idx) => {
    if (!feature.properties) return;

    const rawName = (feature.properties as any)[SUBAREA_NAME_ATTR];
    const fallback = `Subarea ${subareas.length + idx + 1}`;
    const parentRaw = (feature.properties as any)[SUBAREA_PARENT_ATTR] ?? null;
    const aggregate = ensureAggregate(
      rawName,
      fallback,
      subareas.length + idx,
      parentRaw
    );

    const cnRaw = (feature.properties as any)?.CN;
    const cnValue = Number(cnRaw);
    if (!Number.isFinite(cnValue)) return;

    const areaProp = (feature.properties as any)?.AREA_SF;
    let areaValue = Number(areaProp);
    if (!Number.isFinite(areaValue) || areaValue <= 0) {
      if (isPolygonLike(feature)) {
        const areaSqm = computeFeatureAreaSqm(feature as Feature<Polygon | MultiPolygon>);
        areaValue = Number((areaSqm * SQM_TO_SQFT).toFixed(2));
      } else {
        return;
      }
    }

    const lcRaw = (feature.properties as any)?.LAND_COVER;
    const lcName = lcRaw == null ? null : String(lcRaw);
    const hsgRaw = (feature.properties as any)?.HSG;
    const hsg = hsgRaw == null ? null : String(hsgRaw).toUpperCase();
    const desc = lcName ? `${lcName}${hsg ? `, HSG ${hsg}` : ''}` : undefined;

    const key = `${cnValue}|${desc ?? ''}`;
    const existing = aggregate.groups.get(key);
    if (existing) {
      existing.area += areaValue;
    } else {
      aggregate.groups.set(key, { area: areaValue, cn: cnValue, desc });
    }
  });

  const usedIds = new Set<string>();
  const sanitizeId = (name: string, parent: string | null, index: number) => {
    const source = parent ? `${parent}_${name}` : name;
    const base = source
      .replace(/[^A-Za-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .slice(0, 30);
    let candidate = base || `Subcatch_${index + 1}`;
    if (!usedIds.has(candidate)) {
      usedIds.add(candidate);
      return candidate;
    }
    let suffix = 2;
    while (usedIds.has(`${candidate}_${suffix}`)) {
      suffix += 1;
    }
    const finalId = `${candidate}_${suffix}`;
    usedIds.add(finalId);
    return finalId;
  };

  return Array.from(aggregates.values())
    .sort((a, b) => a.order - b.order)
    .map((aggregate, index) => {
      const parentLabel =
        aggregate.parents.size > 0
          ? Array.from(aggregate.parents)
              .filter(Boolean)
              .sort((a, b) => a.localeCompare(b))
              .join(', ')
          : null;
      return {
        id: sanitizeId(aggregate.name, parentLabel, index),
        name: aggregate.name,
        parentDa: parentLabel,
        areas: Array.from(aggregate.groups.values()).map(item => ({
          area: Number(item.area.toFixed(2)),
          cn: item.cn,
          desc: item.desc,
        })),
      };
    });
};

const buildSubcatchmentNodeBase = (name: string, fallbackIndex: number): string => {
  const trimmed = name.trim();
  if (!trimmed) return `SUBCATCH-${fallbackIndex + 1}`;

  const upper = trimmed.toUpperCase();
  const replaced = upper.replace(/\bDRAINAGE\s+AREA\b/g, 'DA');
  const sanitized = replaced
    .replace(/[^A-Z0-9]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  return sanitized || `SUBCATCH-${fallbackIndex + 1}`;
};

const ensureUniqueNodeNumber = (
  candidate: string,
  used: Set<string>
): string => {
  if (!used.has(candidate)) {
    used.add(candidate);
    return candidate;
  }

  let suffix = 2;
  let next = `${candidate} (${suffix})`;
  while (used.has(next)) {
    suffix += 1;
    next = `${candidate} (${suffix})`;
  }
  used.add(next);
  return next;
};

const normalizeLandCover = (value: unknown): string => {
  if (typeof value === 'string') return value.trim();
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const sanitizeCnNumber = (value: unknown): number => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

const normalizeCnRecords = (records: CnRecord[]): CnRecord[] =>
  records.map(record => ({
    LandCover: normalizeLandCover(record?.LandCover),
    A: sanitizeCnNumber((record as any)?.A),
    B: sanitizeCnNumber((record as any)?.B),
    C: sanitizeCnNumber((record as any)?.C),
    D: sanitizeCnNumber((record as any)?.D),
  }));

const HYDROCAD_EVENTS = [
  { rainEvent: '1 Year', stormDepth: '0.205' },
  { rainEvent: '2 Year', stormDepth: '0.2475' },
  { rainEvent: '5 Year', stormDepth: '0.313333333333333' },
  { rainEvent: '10 Year', stormDepth: '0.371666666666667' },
  { rainEvent: '25 Year', stormDepth: '0.46' },
  { rainEvent: '50 Year', stormDepth: '0.538333333333333' },
  { rainEvent: '100 Year', stormDepth: '0.628333333333333' },
];

const getPrimaryOutflow = (parent: string | null | undefined): string | null => {
  if (!parent) return null;
  const candidates = parent
    .split(',')
    .map(token => token.trim())
    .filter(token => token.length > 0);
  if (candidates.length === 0) return null;
  const dpCandidate = candidates.find(token => /^DP-\d{2}$/i.test(token));
  return (dpCandidate || candidates[0]) ?? null;
};

const buildHydroCADContent = (
  subcatchments: HydroCADSubcatchment[],
  projectName: string
): string => {
  const headerName = projectName || 'Project';
  const headerLines = [
    '[HydroCAD]',
    'FileUnits=English',
    'CalcUnits=English',
    'InputUnits=English',
    'ReportUnits=English',
    'Source=HydroCAD® 10.20-6a  s/n 07447  © 2024 HydroCAD Software Solutions LLC',
    'Source=HydroCAD® 10.20-5b  s/n 07447  © 2023 HydroCAD Software Solutions LLC',
    `Name=${headerName}`,
    'Path=',
    'View=-15.2200262616452 -7.99592189386307 27.6264488498838 15.015871738455',
    'GridShow=True',
    'GridSnap=True',
    'TimeSpan=0 259200',
    'TimeInc=36',
    'SubIntervals=9',
    'RunoffMethod=SCS TR-20',
    'ReachMethod=Dyn-Stor-Ind',
    'PondMethod=Dyn-Stor-Ind',
    'UH=SCS',
    'InitialTW=True',
    'MinTc=300',
    'RainEvent=100 Year',
    'P2=0.2475',
    '',
  ];

  let content = `${headerLines.join('\n')}`;
  HYDROCAD_EVENTS.forEach(event => {
    content += `\n[EVENT]\nRainEvent=${event.rainEvent}\nStormType=Type II 24-hr\nStormDepth=${event.stormDepth}\n`;
  });

  const rowSpacing = 6;
  const subcatX = -10;
  const linkX = 0;
  const dpOrder: string[] = [];
  const dpIndex = new Map<string, number>();
  const resolveRowIndex = (dpName: string): number => {
    if (!dpIndex.has(dpName)) {
      dpIndex.set(dpName, dpOrder.length);
      dpOrder.push(dpName);
    }
    return dpIndex.get(dpName)!;
  };

  const usedNodeNumbers = new Set<string>();

  subcatchments.forEach((subcatchment, index) => {
    let outflow = getPrimaryOutflow(subcatchment.parentDa ?? null);
    if (!outflow) {
      const fallbackIndex = (index % MAX_DISCHARGE_POINTS) + 1;
      outflow = `DP-${String(fallbackIndex).padStart(2, '0')}`;
    }
    const rowIndex = resolveRowIndex(outflow);
    const y = rowIndex * rowSpacing;
    const base = buildSubcatchmentNodeBase(subcatchment.name, index);
    const nodeNumber = ensureUniqueNodeNumber(`${base} TO ${outflow}`, usedNodeNumbers);
    let nodeBlock = `\n[NODE]\nNumber=${nodeNumber}\nType=Subcat\nName=${subcatchment.name}\nXYPos=${subcatX} ${y}\n`;
    nodeBlock += `Outflow=${outflow}\n`;
    nodeBlock += 'LargeAreas=True\n';
    subcatchment.areas.forEach(area => {
      nodeBlock += `[AREA]\nArea=${area.area.toFixed(2)}\nCN=${area.cn}\n`;
      if (area.desc) nodeBlock += `Desc=${area.desc}\n`;
    });
    nodeBlock += `[TC]\nMethod=Direct\nTc=300\n`;
    content += nodeBlock;
  });

  dpOrder.forEach((dpName, index) => {
    const y = index * rowSpacing;
    content += `\n[NODE]\nNumber=${dpName}\nType=Link\nName=${dpName}\nXYPos=${linkX} ${y}\nLargeAreas=True\n`;
  });

  return content.trimEnd();
};

const triggerHydroCADDownload = (
  content: string,
  projectName: string,
  projectVersion: string
) => {
  const blob = new Blob([content], { type: 'text/plain' });
  const filename = `${(projectName || 'project')}_${projectVersion}.hcp`;
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

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
  const [cnValues, setCnValues] = useState<CnRecord[]>([]);
  const [cnValuesLoaded, setCnValuesLoaded] = useState<boolean>(false);
  const [cnTableOpen, setCnTableOpen] = useState<boolean>(false);
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
  const autoOverlaySignatureRef = useRef<string | null>(null);

  const project = useMemo(() => proj4('EPSG:4326', DEFAULT_PROJ4), []);

  const cnValueIndex = useMemo(() => {
    const map = new Map<string, CnRecord>();
    cnValues.forEach(record => {
      const name = normalizeLandCover(record.LandCover);
      if (!name) return;
      map.set(name, record);
      map.set(name.toLowerCase(), record);
    });
    return map;
  }, [cnValues]);

  const drainageAreasLayer = useMemo(
    () => layers.find(l => l.name === 'Drainage Areas') ?? null,
    [layers]
  );

  const subareasLayer = useMemo(
    () => layers.find(l => l.name === SUBAREA_LAYER_NAME) ?? null,
    [layers]
  );

  const landCoverLayer = useMemo(
    () => layers.find(l => l.name === 'Land Cover') ?? null,
    [layers]
  );

  const soilsLayer = useMemo(
    () => layers.find(l => l.name === 'Soil Layer from Web Soil Survey') ?? null,
    [layers]
  );

  const soilsLoaded = Boolean(soilsLayer);

  const landCoverConfigured = useMemo(() => {
    if (!landCoverLayer) return false;
    const { features } = landCoverLayer.geojson;
    if (features.length === 0) return false;
    return features.every(feature => {
      const val = feature.properties ? (feature.properties as any).LAND_COVER : null;
      return val != null && String(val).trim() !== '';
    });
  }, [landCoverLayer]);

  const soilsConfigured = useMemo(() => {
    if (!soilsLayer) return false;
    const { features } = soilsLayer.geojson;
    if (features.length === 0) return false;
    return features.every(feature => {
      const hsg = feature.properties ? (feature.properties as any).HSG : null;
      return hsg != null && String(hsg).trim() !== '';
    });
  }, [soilsLayer]);

  const assignedDrainagePoints = useMemo(() => {
    const assigned = new Set<string>();
    if (!drainageAreasLayer) return assigned;
    drainageAreasLayer.geojson.features.forEach(feature => {
      const props = feature.properties || {};
      const formatted = formatDischargePointName((props as any)[DA_NAME_ATTR]);
      if (formatted) assigned.add(formatted);
    });
    return assigned;
  }, [drainageAreasLayer]);

  const drainageAreasAssigned = useMemo(() => {
    if (!drainageAreasLayer) return false;
    const { features } = drainageAreasLayer.geojson;
    if (features.length === 0) return false;
    return features.every(feature => {
      const props = feature.properties || {};
      const formatted = formatDischargePointName((props as any)[DA_NAME_ATTR]);
      return Boolean(formatted);
    });
  }, [drainageAreasLayer]);

  const subareasConfigured = useMemo(() => {
    if (!subareasLayer) return false;
    const { features } = subareasLayer.geojson;
    if (features.length === 0) return false;
    return features.every(feature => {
      const props = feature.properties || {};
      const rawName = (props as any)[SUBAREA_NAME_ATTR];
      const subName = rawName == null ? '' : String(rawName).trim();
      const parent = formatDischargePointName((props as any)[SUBAREA_PARENT_ATTR]);
      return subName !== '' && parent !== '' && assignedDrainagePoints.has(parent);
    });
  }, [subareasLayer, assignedDrainagePoints]);

  const allowedLayerNames = useMemo(() => {
    const names = new Set<string>(['Drainage Areas', 'LOD', 'Soil Layer from Web Soil Survey']);
    if (drainageAreasAssigned) {
      names.add(SUBAREA_LAYER_NAME);
    }
    if (soilsLoaded) {
      names.add('Land Cover');
    }
    return Array.from(names);
  }, [drainageAreasAssigned, soilsLoaded]);

  const scsLayerStatuses = useMemo<ScsLayerStatus[]>(() => {
    const statuses: ScsLayerStatus[] = [
      {
        key: 'drainage-areas',
        label: 'Drainage Areas',
        ready: Boolean(drainageAreasLayer) && drainageAreasAssigned,
        description: !drainageAreasLayer
          ? 'Carga la capa Drainage Areas.'
          : drainageAreasAssigned
          ? 'Todos los polígonos tienen un Discharge Point (DP-##).'
          : 'Asigna un Discharge Point (DP-##) a cada polígono.',
      },
      {
        key: 'subareas',
        label: 'Drainage Subareas',
        ready: Boolean(subareasLayer) && subareasConfigured,
        description: !subareasLayer
          ? 'Carga la capa Drainage Subareas.'
          : subareasConfigured
          ? 'Cada subárea tiene nombre y DP asociado.'
          : 'Verifica el nombre y el PARENT_DA de cada subárea.',
      },
      {
        key: 'land-cover',
        label: 'Land Cover',
        ready: Boolean(landCoverLayer) && landCoverConfigured,
        description: !landCoverLayer
          ? 'Carga la capa Land Cover.'
          : landCoverConfigured
          ? 'Cobertura asignada a cada polígono.'
          : 'Asigna un valor de Land Cover a cada polígono.',
      },
      {
        key: 'wss',
        label: 'Soil Layer from Web Soil Survey',
        ready: Boolean(soilsLayer) && soilsConfigured,
        description: !soilsLayer
          ? 'Carga la capa WSS.'
          : soilsConfigured
          ? 'Todos los polígonos tienen HSG asignado.'
          : 'Verifica o completa manualmente un HSG (A/B/C/D) en cada polígono.',
      },
    ];

    return statuses;
  }, [
    drainageAreasLayer,
    drainageAreasAssigned,
    subareasLayer,
    subareasConfigured,
    landCoverLayer,
    landCoverConfigured,
    soilsLayer,
    soilsConfigured,
  ]);

  const scsReady = useMemo(
    () => scsLayerStatuses.every(status => status.ready),
    [scsLayerStatuses]
  );

  const computeEnabled = scsReady && cnValueIndex.size > 0;

  const cbLayer = layers.find(l => l.name === 'Catch Basins / Manholes');
  const pipesLayer = layers.find(l => l.name === 'Pipes');
  const pipe3DEnabled =
    !!cbLayer &&
    cbLayer.geojson.features.length > 0 &&
    !!pipesLayer &&
    pipesLayer.geojson.features.length > 0;

  const overlayLayerForExport = useMemo(
    () =>
      layers.find(l => l.name === AUTO_OVERLAY_LAYER_NAME) ??
      layers.find(l => l.name === 'Overlay') ??
      null,
    [layers]
  );

  const exportEnabled = Boolean(
    overlayLayerForExport && overlayLayerForExport.geojson.features.length > 0
  );
  const curveNumbersEnabled = cnValuesLoaded;

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

  const addLog = useCallback((message: string, type: 'info' | 'error' | 'warn' = 'info') => {
    setLogs(prev => [...prev, { message, type, source: 'frontend' as const }]);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const records = await loadCnValues();
        if (cancelled) return;
        setCnValues(normalizeCnRecords(records));
      } catch (err) {
        console.error('Failed to load CN values', err);
        if (!cancelled) {
          addLog('No se pudieron cargar los valores de Curve Number.', 'error');
          setCnValues([]);
        }
      } finally {
        if (!cancelled) {
          setCnValuesLoaded(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [addLog]);

  useEffect(() => {
    const unique = Array.from(
      new Set(
        cnValues
          .map(record => normalizeLandCover(record.LandCover))
          .filter(name => name !== '')
      )
    ).sort((a, b) => a.localeCompare(b));
    setLandCoverOptions(unique);
  }, [cnValues]);

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
    if (!scsReady) {
      if (
        autoOverlaySignatureRef.current !== null ||
        layers.some(l => l.name === AUTO_OVERLAY_LAYER_NAME)
      ) {
        autoOverlaySignatureRef.current = null;
        setLayers(prev => {
          const hasAuto = prev.some(l => l.name === AUTO_OVERLAY_LAYER_NAME);
          if (!hasAuto) return prev;
          return prev.filter(l => l.name !== AUTO_OVERLAY_LAYER_NAME);
        });
      }
      return;
    }

    if (!soilsLayer || !landCoverLayer || !subareasLayer) return;
    const overallFeature = getOverallDrainageFeature(layers);
    if (!overallFeature) return;

    let cancelled = false;

    const buildOverlay = async () => {
      try {
        if (cancelled) return;

        const cnMap = cnValueIndex;
        const intersectFeatures = (a: Feature | any, b: Feature | any) =>
          turfIntersect({
            type: 'FeatureCollection',
            features: [a, b],
          } as any);

        const clippedWss = clipCollectionToOverall(soilsLayer.geojson, overallFeature);
        const clippedLc = clipCollectionToOverall(landCoverLayer.geojson, overallFeature);
        const clippedSub = clipCollectionToOverall(subareasLayer.geojson, overallFeature);

        const overlayFeatures: Feature[] = [];

        clippedWss.features.forEach(wssFeature => {
          if (!wssFeature.geometry || !isPolygonLike(wssFeature as Feature)) return;

          clippedLc.features.forEach(lcFeature => {
            if (!lcFeature.geometry || !isPolygonLike(lcFeature as Feature)) return;

            const inter1 = intersectFeatures(wssFeature as any, lcFeature as any);
            if (!inter1 || !inter1.geometry || !isPolygonLike(inter1 as Feature)) return;

            const baseProps: Record<string, unknown> = {
              ...(wssFeature.properties || {}),
              ...(lcFeature.properties || {}),
            };

            const lcNameRaw = (baseProps as any).LAND_COVER;
            const hsgRaw = (baseProps as any).HSG ?? (wssFeature.properties as any)?.HSG;
            if (lcNameRaw != null) {
              const lcName = String(lcNameRaw);
              const rec = cnMap.get(lcName);
              if (rec && hsgRaw != null) {
                const hsg = String(hsgRaw).trim().toUpperCase();
                if (hsg === 'A' || hsg === 'B' || hsg === 'C' || hsg === 'D') {
                  const cnValue = rec[hsg as keyof CnRecord];
                  if (typeof cnValue === 'number' && Number.isFinite(cnValue)) {
                    (baseProps as any).CN = cnValue;
                  }
                }
              }
            }

            clippedSub.features.forEach(subFeature => {
              if (!subFeature.geometry || !isPolygonLike(subFeature as Feature)) return;
              const inter2 = intersectFeatures(inter1 as any, subFeature as any);
              if (!inter2 || !inter2.geometry || !isPolygonLike(inter2 as Feature)) return;

              const areaSqM = turfArea(inter2 as any);
              if (!Number.isFinite(areaSqM) || areaSqM <= AREA_TOLERANCE_SQM) return;

              inter2.properties = {
                ...baseProps,
                ...(subFeature.properties || {}),
                AREA_SF: Number((areaSqM * SQM_TO_SQFT).toFixed(2)),
                AREA_AC: Number((areaSqM * SQM_TO_ACRES).toFixed(6)),
              };

              overlayFeatures.push(inter2 as Feature);
            });
          });
        });

        if (cancelled) return;

        if (overlayFeatures.length === 0) {
          if (
            autoOverlaySignatureRef.current !== null ||
            layers.some(l => l.name === AUTO_OVERLAY_LAYER_NAME)
          ) {
            autoOverlaySignatureRef.current = null;
            setLayers(prev => prev.filter(l => l.name !== AUTO_OVERLAY_LAYER_NAME));
            addLog('No se generaron intersecciones SCS automáticamente.', 'warn');
          }
          return;
        }

        const signature = JSON.stringify(
          overlayFeatures.map(feature => ({
            geometry: feature.geometry,
            properties: feature.properties,
          }))
        );

        const existingAuto = layers.find(l => l.name === AUTO_OVERLAY_LAYER_NAME);
        if (existingAuto && autoOverlaySignatureRef.current === signature) {
          return;
        }

        autoOverlaySignatureRef.current = signature;
        const overlayGeojson: FeatureCollection = {
          type: 'FeatureCollection',
          features: overlayFeatures,
        };

        setLayers(prev => {
          const withoutAuto = prev.filter(l => l.name !== AUTO_OVERLAY_LAYER_NAME);
          const hidden = withoutAuto.map(layer =>
            layer.visible ? { ...layer, visible: false } : layer
          );
          const overlayLayer: LayerData = {
            id: `${Date.now()}-${AUTO_OVERLAY_LAYER_NAME}`,
            name: AUTO_OVERLAY_LAYER_NAME,
            geojson: overlayGeojson,
            editable: false,
            visible: true,
            fillColor: getDefaultColor(AUTO_OVERLAY_LAYER_NAME),
            fillOpacity: DEFAULT_OPACITY,
            category: 'Process',
          };
          return [...hidden, overlayLayer];
        });

        addLog(
          `Capa ${AUTO_OVERLAY_LAYER_NAME} generada con ${overlayFeatures.length} polígonos.`,
          'info'
        );
      } catch (error) {
        console.error('Failed to generar la intersección automática SCS', error);
      }
    };

    buildOverlay();

    return () => {
      cancelled = true;
    };
  }, [
    scsReady,
    soilsLayer,
    landCoverLayer,
    subareasLayer,
    layers,
    addLog,
    cnValueIndex,
  ]);

  useEffect(() => {
    if (!computeTasks) return;
    if (computeTasks.every(t => t.status === 'success')) {
      setComputeSucceeded(true);
    }
    if (computeTasks.some(t => t.status === 'error')) {
      setComputeSucceeded(false);
    }
  }, [computeTasks]);

  const handleLayerAdded = useCallback(
    async (
      geojson: FeatureCollection,
      name: string,
      fieldMap?: Record<string, string>
    ) => {
      setError(null);
      try {
        if (geojson.features.length === 0) {
          const msg = `The file "${name}" appears to be empty or could not be read correctly.`;
          setError(msg);
          addLog(msg, 'error');
          return;
        }

        if (name === SUBAREA_LAYER_NAME) {
          const daLayer = drainageAreasLayer;
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
          if (!drainageAreasAssigned || !subareasConfigured) {
            const msg =
              'Completa la asignación de Discharge Points en Drainage Areas y vincula todas las Drainage Subareas antes de cargar la capa de suelos (WSS).';
            setError(msg);
            addLog(msg, 'error');
            return;
          }
        }

        if (name === 'Land Cover') {
          if (!soilsLoaded) {
            const msg =
              'Carga primero la capa de suelos (WSS) antes de agregar la capa de Land Cover para mantener la secuencia de trabajo.';
            setError(msg);
            addLog(msg, 'error');
            return;
          }
        }

        const overallDrainageFeature = getOverallDrainageFeature(layers);

        const editable = KNOWN_LAYER_NAMES.includes(name);
        const normalizedGeojson = transformLayerGeojson(name, geojson, {
          landCoverOptions,
          layers,
          fieldMap,
        });

        let processedGeojson = normalizedGeojson;

        if (name === 'Soil Layer from Web Soil Survey' && overallDrainageFeature) {
          const clipped = clipCollectionToOverall(normalizedGeojson, overallDrainageFeature);
          processedGeojson = clipped;
          if (processedGeojson.features.length === 0) {
            const msg =
              'No se encontraron polígonos del WSS dentro del Overall Drainage Area. Verifica los archivos y vuelve a intentarlo.';
            setError(msg);
            addLog(msg, 'error');
            return;
          }
        }

        if (
          name === 'Soil Layer from Web Soil Survey' &&
          processedGeojson.features.length === 0
        ) {
          const msg =
            'La capa del Web Soil Survey no contiene polígonos válidos. Revisa el archivo y vuelve a intentarlo.';
          setError(msg);
          addLog(msg, 'error');
          return;
        }

        if (
          overallDrainageFeature &&
          (name === SUBAREA_LAYER_NAME ||
            name === 'Soil Layer from Web Soil Survey' ||
            name === 'Land Cover')
        ) {
          const layerAreaSqM = sumPolygonAreasSqm(processedGeojson);
          const overallAreaSqM = computeFeatureAreaSqm(overallDrainageFeature);
          if (
            overallAreaSqM > 0 &&
            overallAreaSqM - layerAreaSqM > AREA_TOLERANCE_SQM
          ) {
            const layerAreaAc = Number((layerAreaSqM * SQM_TO_ACRES).toFixed(4));
            const overallAreaAc = Number((overallAreaSqM * SQM_TO_ACRES).toFixed(4));
            addLog(
              `Advertencia: el área total de ${name} (${layerAreaAc} ac) es menor que el Overall Drainage Area (${overallAreaAc} ac). Revisa que los polígonos cubran toda el área de drenaje.`,
              'warn'
            );
          }
        }

        if (name === 'Soil Layer from Web Soil Survey') {
          const featureMusyms = extractFeatureMusyms(processedGeojson);
          const totalFeatures = processedGeojson.features.length;
          const featuresWithoutMusym = totalFeatures - featureMusyms.length;

          if (featuresWithoutMusym > 0) {
            addLog(
              `Se omitieron ${featuresWithoutMusym} polígonos WSS sin MUSYM; revisa sus atributos para completar el HSG.`,
              'warn'
            );
          }

          if (featureMusyms.length === 0) {
            addLog('No se detectaron MUSYM en la capa WSS; los HSG permanecen vacíos.', 'warn');
          } else {
            try {
              const records = await fetchWssHsgRecords(featureMusyms);
              processedGeojson = applyHsgToFeatures(processedGeojson, records);

              const matchedFeatures = processedGeojson.features.reduce((count, feature) => {
                const value = simplifyHsgValue((feature.properties as any)?.HSG);
                return value ? count + 1 : count;
              }, 0);
              const missingCount = totalFeatures - matchedFeatures;

              if (matchedFeatures === 0) {
                addLog(
                  'No se obtuvo HSG desde SDA para los MUSYM consultados; revisa y completa manualmente.',
                  'warn'
                );
              } else if (missingCount > 0) {
                addLog(
                  `Se autocompletó HSG para ${matchedFeatures} de ${totalFeatures} polígonos. Completa manualmente ${missingCount}.`
                );
              } else {
                addLog(
                  `HSG autoasignado para los ${totalFeatures} polígonos WSS. Revisa y ajusta si es necesario.`
                );
              }
            } catch (err) {
              const message = err instanceof Error ? err.message : 'error desconocido';
              addLog(
                `No se pudo obtener el HSG desde SDA (${message}). Los HSG permanecen en blanco.`,
                'warn'
              );
            }
          }
        }

        let action: 'updated' | 'created' = 'created';
        let overallChange: 'none' | 'created' | 'updated' | 'removed' = 'none';

        setLayers(prevLayers => {
          const existing = prevLayers.find(l => l.name === name);
          const hadOverall = prevLayers.some(
            l => l.name === OVERALL_DRAINAGE_LAYER_NAME
          );

          let nextLayers: LayerData[];
          if (existing) {
            action = 'updated';
            nextLayers = prevLayers.map(l =>
              l.name === name
                ? {
                    ...l,
                    geojson: processedGeojson,
                    editable,
                    fieldMap: fieldMap ?? l.fieldMap,
                  }
                : l
            );
          } else {
            const newLayer: LayerData = {
              id: `${Date.now()}-${name}`,
              name,
              geojson: processedGeojson,
              editable,
              visible: true,
              fillColor: getDefaultColor(name),
              fillOpacity: DEFAULT_OPACITY,
              category: 'Original',
              fieldMap,
            };
            nextLayers = [...prevLayers, newLayer];
          }

          if (name === 'Drainage Areas') {
            nextLayers = ensureOverallDrainageAreaLayer(nextLayers, normalizedGeojson);
            const hasOverallAfter = nextLayers.some(
              l => l.name === OVERALL_DRAINAGE_LAYER_NAME
            );
            if (!hadOverall && hasOverallAfter) overallChange = 'created';
            else if (hadOverall && hasOverallAfter) overallChange = 'updated';
            else if (hadOverall && !hasOverallAfter) overallChange = 'removed';
          }

          return nextLayers;
        });

        if (action === 'updated') {
          addLog(`Updated layer ${name} with uploaded data`);
        } else {
          addLog(`Loaded layer ${name}${editable ? '' : ' (view only)'}`);
        }

        if (name === 'Drainage Areas') {
          if (overallChange === 'created') {
            addLog('Se generó automáticamente la capa Overall Drainage Area.');
          } else if (overallChange === 'updated') {
            addLog(
              'Se actualizó la capa Overall Drainage Area para reflejar los cambios.'
            );
          } else if (overallChange === 'removed') {
            addLog(
              'Se eliminó la capa Overall Drainage Area porque no hay geometría disponible.'
            );
          }
        }
        if (name === 'Drainage Areas') {
          addLog(
            'Asigna un Discharge Point (DP-##) a cada área de drenaje usando el desplegable del mapa.'
          );
        }
        if (name === SUBAREA_LAYER_NAME) {
          addLog(
            "Etiqueta cada Drainage Subarea como 'DRAINAGE AREA - #' y vincúlala a su Discharge Point (DP-##) mediante el campo PARENT_DA."
          );
        }
        if (name === 'Soil Layer from Web Soil Survey') {
          addLog(
            'La capa WSS se cargó correctamente. Verifica los HSG autoasignados y completa los que falten (A/B/C/D).'
          );
        }
        if (name === 'Land Cover') {
          addLog(
            'La capa Land Cover está disponible. Verifica que cada polígono tenga un valor LAND_COVER.'
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [
      addLog,
      landCoverOptions,
      layers,
      drainageAreasAssigned,
      subareasConfigured,
      drainageAreasLayer,
      soilsLoaded,
    ]
  );

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
    let overallRemoved = false;
    setLayers(prevLayers => {
      const removingDrainageAreas = prevLayers.some(
        layer => layer.id === id && layer.name === 'Drainage Areas'
      );
      let next = prevLayers.filter(layer => layer.id !== id);
      if (removingDrainageAreas) {
        const hadOverall = next.some(layer => layer.name === OVERALL_DRAINAGE_LAYER_NAME);
        if (hadOverall) {
          overallRemoved = true;
          next = next.filter(layer => layer.name !== OVERALL_DRAINAGE_LAYER_NAME);
        }
      }
      return next;
    });
    addLog(`Removed layer ${id}`);
    if (overallRemoved) {
      addLog('Se eliminó la capa Overall Drainage Area porque la capa Drainage Areas fue removida.');
    }
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
    let overallChange: 'none' | 'created' | 'updated' | 'removed' = 'none';
    setLayers(prev => {
      const target = prev.find(layer => layer.id === id);
      const hadOverall = prev.some(layer => layer.name === OVERALL_DRAINAGE_LAYER_NAME);
      let next = prev.map(layer => (layer.id === id ? { ...layer, geojson } : layer));

      if (target?.name === 'Drainage Areas') {
        next = ensureOverallDrainageAreaLayer(next, geojson);
        const hasOverallAfter = next.some(layer => layer.name === OVERALL_DRAINAGE_LAYER_NAME);
        if (!hadOverall && hasOverallAfter) overallChange = 'created';
        else if (hadOverall && hasOverallAfter) overallChange = 'updated';
        else if (hadOverall && !hasOverallAfter) overallChange = 'removed';
      }

      return next;
    });
    addLog(`Updated geometry for layer ${id}`);
    if (overallChange === 'created') {
      addLog('Se generó automáticamente la capa Overall Drainage Area.');
    } else if (overallChange === 'updated') {
      addLog('Se actualizó la capa Overall Drainage Area para reflejar los cambios.');
    } else if (overallChange === 'removed') {
      addLog('Se eliminó la capa Overall Drainage Area porque no hay geometría disponible.');
    }
  }, [addLog]);

  const handleConfirmPreview = useCallback(
    async (name: string, data: FeatureCollection) => {
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
        await handleLayerAdded(data, name);
      }
      setPreviewLayer(null);
    },
    [handleLayerAdded, layers, addLog]
  );

  const handleCancelPreview = useCallback(() => {
    setPreviewLayer(null);
    addLog('Preview canceled');
  }, [addLog]);

  const handleFieldMapConfirm = useCallback(
    async (map: Record<string, string>) => {
      if (mappingLayer) {
        await handleLayerAdded(mappingLayer.data, mappingLayer.name, map);
        setMappingLayer(null);
      }
    },
    [mappingLayer, handleLayerAdded]
  );

  const handleFieldMapCancel = useCallback(() => {
    setMappingLayer(null);
  }, []);

  const handleOpenCnTable = useCallback(() => {
    setCnTableOpen(true);
  }, []);

  const handleCloseCnTable = useCallback(() => {
    setCnTableOpen(false);
  }, []);

  const handleSaveCnTable = useCallback(
    (records: CnRecord[]) => {
      const sanitized = normalizeCnRecords(records);
      const seen = new Set<string>();
      const duplicates: string[] = [];
      sanitized.forEach(record => {
        const name = normalizeLandCover(record.LandCover);
        if (!name) return;
        const key = name.toLowerCase();
        if (seen.has(key)) {
          duplicates.push(name);
        } else {
          seen.add(key);
        }
      });
      if (duplicates.length > 0) {
        throw new Error(
          `Land Cover duplicados detectados: ${Array.from(new Set(duplicates)).join(', ')}`
        );
      }
      setCnValues(sanitized);
      addLog('Tabla de Curve Numbers actualizada para esta sesión.');
      setCnTableOpen(false);
    },
    [addLog]
  );

  const runCompute = useCallback(async () => {
    setComputeSucceeded(false);
    const da = layers.find(l => l.name === 'Drainage Areas');
    const sub = layers.find(l => l.name === SUBAREA_LAYER_NAME);
    const wss = layers.find(l => l.name === 'Soil Layer from Web Soil Survey');
    const lc = layers.find(l => l.name === 'Land Cover');
    const overallDrainageFeature = getOverallDrainageFeature(layers);

    const tasks: ComputeTask[] = [
      { id: 'check_overall', name: 'Validate Overall Drainage Area', status: 'pending' },
      { id: 'check_attrs', name: 'Validate required attributes', status: 'pending' },
      { id: 'prepare_subareas', name: 'Build drainage subareas with complements', status: 'pending' },
      { id: 'overlay', name: 'Execute SCS overlay analysis', status: 'pending' },
      { id: 'hydrocad', name: 'Generate HydroCAD file (SCS)', status: 'pending' },
    ];
    setComputeTasks(tasks);

    setLayers(prev => prev.filter(l => l.category !== 'Process'));

    if (!overallDrainageFeature || !overallDrainageFeature.geometry) {
      setComputeTasks(prev =>
        prev.map(t =>
          t.id === 'check_overall' || t.status === 'pending'
            ? { ...t, status: 'error' }
            : t
        )
      );
      addLog('Overall Drainage Area layer is missing or invalid. Genera la capa antes de ejecutar Compute.', 'error');
      return;
    }

    const overallAreaSqm = computeFeatureAreaSqm(
      overallDrainageFeature as Feature<Polygon | MultiPolygon>
    );
    if (overallAreaSqm <= AREA_TOLERANCE_SQM) {
      setComputeTasks(prev =>
        prev.map(t =>
          t.id === 'check_overall' || t.status === 'pending'
            ? { ...t, status: 'error' }
            : t
        )
      );
      addLog('Overall Drainage Area no contiene un polígono válido para el análisis SCS.', 'error');
      return;
    }

    setComputeTasks(prev =>
      prev.map(t => (t.id === 'check_overall' ? { ...t, status: 'success' } : t))
    );

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
      let skippedDrainageAreas = 0;

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

        const combinedWithinOverall = intersect(
          combinedGeometry as any,
          overallDrainageFeature as any
        );
        if (!combinedWithinOverall || !combinedWithinOverall.geometry) {
          skippedDrainageAreas++;
          return;
        }

        const geometryForProcessing: Feature<Polygon | MultiPolygon> = {
          type: 'Feature',
          geometry: combinedWithinOverall.geometry as Polygon | MultiPolygon,
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

          const clipped = intersect(subFeature as any, geometryForProcessing as any);
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
          geometry: geometryForProcessing.geometry as Polygon | MultiPolygon,
          properties: baseProps,
        };

        normalizedSubs.forEach(subFeature => {
          if (!remainderGeom) return;
          const diff = turfDifference({
            type: 'FeatureCollection',
            features: [remainderGeom as any, subFeature as any],
          } as FeatureCollection);
          remainderGeom = diff && diff.geometry
            ? (diff as Feature<Polygon | MultiPolygon>)
            : null;
        });

        if (remainderGeom) {
          flattenEach(remainderGeom as any, rem => {
            if (!rem || !rem.geometry) return;
            const remArea = turfArea(rem as any);
            if (remArea <= AREA_TOLERANCE_SQM) return;
            if (remArea <= MIN_COMPLEMENT_AREA_SQM) return;

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
        if (skippedDrainageAreas > 0)
          pieces.push(`${skippedDrainageAreas} DA outside overall`);
        addLog(`Drainage subareas generated -> ${pieces.join(', ')}`);
      } else {
        setComputeTasks(prev =>
          prev.map(t => (t.id === 'prepare_subareas' ? { ...t, status: 'error' } : t))
        );
        addLog('No drainage subareas generated', 'error');
      }

      const overlay: Feature[] = [];
      const clippedWss = clipCollectionToOverall(wss.geojson, overallDrainageFeature);
      const clippedLc = clipCollectionToOverall(lc.geojson, overallDrainageFeature);

      if (clippedWss.features.length === 0 || clippedLc.features.length === 0) {
        setComputeTasks(prev =>
          prev.map(t =>
            t.id === 'overlay' || t.id === 'hydrocad' || t.status === 'pending'
              ? { ...t, status: 'error' }
              : t
          )
        );
        addLog(
          'No se encontraron datos de WSS o Land Cover dentro del Overall Drainage Area.',
          'error'
        );
        return;
      }

      processedSubareas.forEach(subFeature => {
        if (!subFeature.geometry) return;
        clippedWss.features.forEach(wssFeature => {
          if (!wssFeature.geometry) return;
          const inter1 = intersect(subFeature as any, wssFeature as any);
          if (!inter1 || !inter1.geometry) return;

          clippedLc.features.forEach(lcFeature => {
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

      const cnMap = cnValueIndex;
      if (cnMap.size === 0) {
        throw new Error('No hay valores de Curve Number configurados.');
      }
      overlay.forEach(f => {
        const lcNameRaw = (f.properties as any)?.LAND_COVER;
        const lcName = normalizeLandCover(lcNameRaw);
        const hsgRaw = (f.properties as any)?.HSG;
        const hsg = hsgRaw == null ? null : String(hsgRaw).toUpperCase();
        const rec = lcName ? cnMap.get(lcName) ?? cnMap.get(lcName.toLowerCase()) : undefined;
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

        try {
          const subcatchments = aggregateOverlayForHydroCAD(overlay, processedSubareas);
          if (subcatchments.length === 0) {
            throw new Error('No hay combinaciones válidas de CN para generar HydroCAD.');
          }
          const incomplete = subcatchments.filter(sc => sc.areas.length === 0);
          if (incomplete.length > 0) {
            const missingNames = incomplete.map(sc => sc.name).join(', ');
            throw new Error(
              `Las siguientes subáreas no tienen valores de CN válidos: ${missingNames}.`
            );
          }
          const expectedCount = new Set(
            processedSubareas.map((subFeature, index) => {
              const props = subFeature.properties || {};
              const rawName = (props as any)[SUBAREA_NAME_ATTR];
              const fallback = `Subarea ${index + 1}`;
              return getSubareaKey(rawName, fallback);
            })
          ).size;
          if (subcatchments.length < expectedCount) {
            throw new Error('No se generaron todos los subcatchments de HydroCAD para las subáreas.');
          }
          const content = buildHydroCADContent(subcatchments, projectName);
          triggerHydroCADDownload(content, projectName, projectVersion);
          setComputeTasks(prev =>
            prev.map(t => (t.id === 'hydrocad' ? { ...t, status: 'success' } : t))
          );
          addLog(
            'Archivo HydroCAD generado utilizando el método SCS dentro del Overall Drainage Area.'
          );
        } catch (error) {
          const reason = error instanceof Error ? error.message : String(error);
          setComputeTasks(prev =>
            prev.map(t => (t.id === 'hydrocad' ? { ...t, status: 'error' } : t))
          );
          addLog(`No se pudo generar el archivo HydroCAD: ${reason}`, 'error');
        }
      } else {
        setComputeTasks(prev =>
          prev.map(t => (t.id === 'overlay' ? { ...t, status: 'error' } : t))
        );
        setComputeTasks(prev =>
          prev.map(t => (t.id === 'hydrocad' ? { ...t, status: 'error' } : t))
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
  }, [layers, setLayers, addLog, projectName, projectVersion, cnValueIndex]);

  const handleCompute = useCallback(() => {
    runCompute();
  }, [runCompute]);
  const handleExportOverlay = useCallback(async () => {
    const targetLayer =
      layers.find(l => l.name === AUTO_OVERLAY_LAYER_NAME) ??
      layers.find(l => l.name === 'Overlay');
    if (!targetLayer) {
      addLog('No se encontró la capa Overlay (Auto) para exportar.', 'error');
      return;
    }
    if (targetLayer.geojson.features.length === 0) {
      addLog('La capa Overlay (Auto) no tiene elementos para exportar.', 'error');
      return;
    }
    try {
      const prepared = prepareForShapefile(targetLayer.geojson, targetLayer.name);
      if (prepared.features.length === 0) {
        addLog('No hay elementos válidos en la capa Overlay (Auto) para exportar.', 'error');
        return;
      }
      const shpwrite = (await import('@mapbox/shp-write')).default as any;
      const prj = ESRI_PRJ_BY_EPSG[SHAPEFILE_EPSG];
      if (!prj) {
        addLog(`No se encontró la definición PRJ para EPSG:${SHAPEFILE_EPSG}.`, 'error');
        return;
      }
      const zipBlob = (await shpwrite.zip(prepared, {
        outputType: 'blob',
        folder: 'overlay_auto',
        types: { polygon: 'overlay_auto', multipolygon: 'overlay_auto' },
        prj,
      })) as Blob;
      const safeProject =
        (projectName || 'project').trim().replace(/[^a-z0-9_-]+/gi, '_') || 'project';
      const filename = `${safeProject}_${projectVersion}_overlay_auto.zip`;
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
      addLog(`Overlay (Auto) exportado con ${prepared.features.length} polígonos.`, 'info');
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      addLog(`No se pudo exportar Overlay (Auto): ${reason}`, 'error');
    }
  }, [addLog, layers, projectName, projectVersion]);

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
  }, [addLog, layers, project]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header
        computeEnabled={computeEnabled}
        onCompute={handleCompute}
        exportEnabled={exportEnabled}
        onExport={handleExportOverlay}
        onManageCurveNumbers={handleOpenCnTable}
        curveNumbersEnabled={curveNumbersEnabled}
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
            allowedLayerNames={allowedLayerNames}
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
          <ScsStatusPanel statuses={scsLayerStatuses} />
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
      {cnTableOpen && (
        <CnTableModal
          records={cnValues}
          onClose={handleCloseCnTable}
          onSave={handleSaveCnTable}
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
