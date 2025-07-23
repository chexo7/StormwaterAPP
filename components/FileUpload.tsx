import React, { useCallback, useState, useEffect } from 'react';
import * as shp from 'shpjs';
import JSZip from 'jszip';
import type { FeatureCollection } from 'geojson';
import { UploadIcon } from './Icons';
import { loadHsgMap } from '../utils/soil';
import { ARCHIVE_NAME_MAP, KNOWN_LAYER_NAMES, ALL_LAYER_NAMES } from '../utils/constants';

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

      const defaultCategory = ARCHIVE_NAME_MAP[lowerName] ?? (isWssFile ? 'Soil Layer from Web Soil Survey' : 'Other');
      const promptMsg = `Detected ${geojson.features.length} features.\nAssign to category (${ALL_LAYER_NAMES.join(', ')}):`;
      let chosen = window.prompt(promptMsg, defaultCategory) || defaultCategory;
      if (!ALL_LAYER_NAMES.includes(chosen)) chosen = defaultCategory;

      onLayerAdded(geojson, chosen);
      onLog(`Loaded ${displayName} as ${chosen}`);
    } catch (e) {
      console.error("File parsing error:", e);
      const errMsg = "Failed to parse shapefile. Ensure the .zip contains valid .shp and .dbf files, and for WSS zips, that 'soilmu_a_aoi.shp' is present.";
      onError(errMsg);
      onLog(errMsg, 'error');
    }
  }, [onLayerAdded, onLoading, onError, onLog]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
    event.target.value = ''; // Reset input to allow re-uploading the same file
  };

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
    </div>
  );
};

export default FileUpload;
