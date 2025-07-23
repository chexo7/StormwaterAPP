import React, { useCallback, useState, useEffect } from 'react';
import * as shp from 'shpjs';
import JSZip from 'jszip';
import type { FeatureCollection } from 'geojson';
import { UploadIcon } from './Icons';
import { loadHsgMap } from '../utils/soil';
import { loadCnValues, DEFAULT_CN_VALUES } from '../utils/cn';
import { ARCHIVE_NAME_MAP, KNOWN_LAYER_NAMES } from '../utils/constants';

interface FileUploadProps {
  onLayerAdded: (data: FeatureCollection, fileName: string) => void;
  onLoading: () => void;
  onError: (message: string) => void;
  onLog: (message: string, type?: 'info' | 'error') => void;
  isLoading: boolean;
  onCreateLayer?: (name: string) => void;
  existingLayerNames?: string[];
}

const FileUpload: React.FC<FileUploadProps> = ({ onLayerAdded, onLoading, onError, onLog, isLoading, onCreateLayer, existingLayerNames = [] }) => {
  const [isDragging, setIsDragging] = useState(false);
  const availableNames = KNOWN_LAYER_NAMES.filter(n => !existingLayerNames.includes(n));
  const [newLayerName, setNewLayerName] = useState(availableNames[0] || '');
  const [pendingLayer, setPendingLayer] = useState<{ geojson: FeatureCollection; name: string } | null>(null);
  const [fieldOptions, setFieldOptions] = useState<string[]>([]);
  const [fieldSamples, setFieldSamples] = useState<Record<string, string[]>>({});
  const [selectedField, setSelectedField] = useState<string>('');

  useEffect(() => {
    if (!availableNames.includes(newLayerName)) {
      setNewLayerName(availableNames[0] || '');
    }
  }, [availableNames, newLayerName]);

  const processFile = useCallback(async (file: File) => {
    if (!file) {
      onError("No file selected.");
      onLog("No file selected", 'error');
      return;
    }
    if (!file.name.toLowerCase().endsWith('.zip')) {
      const msg = "Invalid file type. Please upload a .zip file containing your shapefile components (.shp, .dbf, .prj, etc.).";
      onError(msg);
      onLog(msg, 'error');
      return;
    }

    onLoading();
    onLog(`Processing ${file.name}...`);

    try {
      let buffer = await file.arrayBuffer();
      const lowerName = file.name.toLowerCase();
      let displayName = ARCHIVE_NAME_MAP[lowerName] ?? file.name;
      const isWssFile = lowerName.startsWith('wss_aoi_');

      // Special handling for Web Soil Survey files
      if (isWssFile) {
        const targetBasename = 'soilmu_a_aoi';
        const zip = await JSZip.loadAsync(buffer);
        
        const relevantFiles = zip.file(new RegExp(`(^|/)${targetBasename}\\.\\w+$`, 'i'));

        if (relevantFiles.length === 0) {
          onError(`Could not find '${targetBasename}.shp' in the WSS archive.`);
          return;
        }

        const newZip = new JSZip();
        for (const zipObject of relevantFiles) {
          const fileNameOnly = zipObject.name.split('/').pop();
          if(fileNameOnly) {
            newZip.file(fileNameOnly, await zipObject.async('arraybuffer'));
          }
        }
        
        buffer = await newZip.generateAsync({ type: 'arraybuffer' });
        displayName = 'Soil Layer from Web Soil Survey';
      }

      let geojson = await shp.parseZip(buffer) as FeatureCollection;

      // --- DATA ENRICHMENT FOR WSS FILES ---
      if (isWssFile && geojson.features.length > 0) {
        try {
          const hsgMap = await loadHsgMap();
          if (hsgMap) {
            geojson.features.forEach(feature => {
              if (feature.properties && feature.properties.MUSYM) {
                const musym = String(feature.properties.MUSYM);
                const rawHsg = hsgMap[musym] || 'N/A';
                const hsg = typeof rawHsg === 'string' ? rawHsg.split('/')[0] : rawHsg;
                feature.properties.HSG = hsg;
              }
            });
            onLog('Soil data enriched');
          } else {
            const msg = 'Could not load soil HSG data. Skipping enrichment.';
            console.warn(msg);
            onLog(msg, 'error');
          }
        } catch (enrichError) {
          console.error('Failed to enrich soil data:', enrichError);
          onLog('Failed to enrich soil data', 'error');
        }
      }
      // --- END OF ENRICHMENT LOGIC ---

      if (displayName === 'Land Cover') {
        const propsSample = geojson.features[0]?.properties || {};
        const fieldNames = Object.keys(propsSample).filter(f => f !== 'LAND_COVER');
        const samples: Record<string, string[]> = {};
        fieldNames.forEach(name => {
          samples[name] = geojson.features.slice(0, 3).map(f => String(f.properties?.[name] ?? '')).filter(Boolean);
        });
        const cnValues = (await loadCnValues()) ?? DEFAULT_CN_VALUES;
        const descSet = new Set(cnValues.map(v => v.Description.toLowerCase()));
        let autoField = '';
        for (const name of fieldNames) {
          if (geojson.features.some(f => descSet.has(String(f.properties?.[name] ?? '').toLowerCase()))) {
            autoField = name;
            break;
          }
        }
        setPendingLayer({ geojson, name: displayName });
        setFieldOptions(fieldNames);
        setFieldSamples(samples);
        setSelectedField(autoField);
        return;
      }

      onLayerAdded(geojson, displayName);
      onLog(`Loaded ${displayName}`);
    } catch (e) {
      console.error("File parsing error:", e);
      const errMsg = "Failed to parse shapefile. Ensure the .zip contains valid .shp and .dbf files, and for WSS zips, that 'soilmu_a_aoi.shp' is present.";
      onError(errMsg);
      onLog(errMsg, 'error');
    }
  }, [onLayerAdded, onLoading, onError, onLog]);

  const finalizeLandCover = useCallback(async (field: string | null) => {
    if (!pendingLayer) return;
    const cnValues = (await loadCnValues()) ?? DEFAULT_CN_VALUES;
    const descSet = new Set(cnValues.map(v => v.Description.toLowerCase()));
    let { geojson, name } = pendingLayer;
    geojson = {
      ...geojson,
      features: geojson.features.map(f => {
        const props = { ...(f.properties || {}) };
        let val = props.LAND_COVER ?? '';
        if (field && props[field] && typeof props[field] !== 'object') {
          const txt = String(props[field]).toLowerCase();
          if (descSet.has(txt)) {
            val = (cnValues ?? []).find(v => v.Description.toLowerCase() === txt)!.Description;
          }
        }
        return { ...f, properties: { ...props, LAND_COVER: val } };
      })
    } as FeatureCollection;
    setPendingLayer(null);
    setFieldOptions([]);
    setFieldSamples({});
    setSelectedField('');
    onLayerAdded(geojson, name);
    onLog(`Loaded ${name}`);
  }, [pendingLayer, onLayerAdded, onLog]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
    event.target.value = ''; // Reset input to allow re-uploading the same file
  };

  const handleConfirmField = useCallback(() => {
    finalizeLandCover(selectedField || null);
  }, [finalizeLandCover, selectedField]);

  const handleSkipField = useCallback(() => {
    finalizeLandCover(null);
  }, [finalizeLandCover]);

  const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault(); // Necessary to allow drop
    e.stopPropagation();
  };
  
  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  return (
    <div className="bg-gray-700/50 p-6 rounded-lg border border-dashed border-gray-600">
      <h2 className="text-lg font-semibold text-white mb-4">Upload Layer</h2>
      <label
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
          ${isDragging ? 'border-cyan-400 bg-gray-700' : 'border-gray-500 hover:border-gray-400 bg-gray-800'}
        `}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-cyan-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-4 text-sm text-gray-400">Processing file...</p>
            </>
          ) : (
            <>
              <UploadIcon className="w-10 h-10 mb-3 text-gray-400" />
              <p className="mb-2 text-sm text-gray-300"><span className="font-semibold text-cyan-400">Click to upload</span> or drag and drop</p>
              <p className="text-xs text-gray-500">ZIP archive only (.zip)</p>
            </>
          )}
        </div>
        <input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} accept=".zip" disabled={isLoading} />
      </label>
      <p className="mt-4 text-xs text-gray-500">
        Upload one or more shapefiles. WSS Soil Survey zips are handled automatically.
      </p>
      {onCreateLayer && availableNames.length > 0 && (
        <div className="mt-4 flex space-x-2 items-center">
          <select
            value={newLayerName}
            onChange={e => setNewLayerName(e.target.value)}
            className="flex-grow bg-gray-800 border border-gray-600 text-gray-200 rounded px-2 py-1"
          >
            {availableNames.map(name => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => onCreateLayer(newLayerName)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded"
          >
            Create
          </button>
        </div>
      )}
      {pendingLayer && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 border border-gray-600 p-4 rounded-lg space-y-3 w-80">
            <h3 className="text-lg font-semibold text-white">Select land cover field</h3>
            <select
              className="w-full bg-gray-900 border border-gray-600 text-gray-200 rounded px-2 py-1"
              value={selectedField}
              onChange={e => setSelectedField(e.target.value)}
            >
              <option value="">-- none --</option>
              {fieldOptions.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
            {selectedField && fieldSamples[selectedField] && (
              <div className="text-xs text-gray-400 space-y-1">
                {fieldSamples[selectedField].map((v, i) => (
                  <div key={i} className="font-mono">{v}</div>
                ))}
              </div>
            )}
            <div className="flex justify-end space-x-2 pt-2">
              <button className="bg-gray-700 text-gray-200 px-3 py-1 rounded" onClick={handleSkipField}>Skip</button>
              <button className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded" onClick={handleConfirmField}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
