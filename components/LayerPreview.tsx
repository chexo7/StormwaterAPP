import React, { useState, useEffect } from 'react';
import type { FeatureCollection } from 'geojson';
import { ALL_LAYER_NAMES, KNOWN_LAYER_NAMES, OTHER_CATEGORY } from '../utils/constants';

interface LayerPreviewProps {
  data: FeatureCollection;
  fileName: string;
  detectedName: string;
  onConfirm: (name: string, data: FeatureCollection) => void;
  onCancel: () => void;
}

const LayerPreview: React.FC<LayerPreviewProps> = ({ data, fileName, detectedName, onConfirm, onCancel }) => {
  const [category, setCategory] = useState<string>(OTHER_CATEGORY);

  useEffect(() => {
    if (KNOWN_LAYER_NAMES.includes(detectedName)) {
      setCategory(detectedName);
    } else {
      setCategory(OTHER_CATEGORY);
    }
  }, [detectedName]);

  const handleConfirm = () => {
    const base = fileName.replace(/\.zip$/i, '');
    const finalName = category === OTHER_CATEGORY ? `Other - ${base}` : category;
    onConfirm(finalName, data);
  };

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 space-y-3">
      <h3 className="text-md font-semibold text-cyan-400">Preview {fileName}</h3>
      <p className="text-sm text-gray-300">Detected as: <span className="font-mono">{detectedName}</span></p>
      <div className="flex space-x-2 items-center">
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          className="flex-grow bg-gray-700 border border-gray-600 text-gray-200 rounded px-2 py-1"
        >
          {ALL_LAYER_NAMES.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <button
          type="button"
          onClick={handleConfirm}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded"
        >
          Add
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default LayerPreview;
