import React, { useState } from 'react';

export const ALLOWED_LAYER_NAMES = [
  'Soil Layer from Web Soil Survey',
  'Drainage Areas',
  'Land Cover',
  'LOD'
] as const;

interface CreateLayerProps {
  onCreate: (name: string) => void;
}

const CreateLayer: React.FC<CreateLayerProps> = ({ onCreate }) => {
  const [selected, setSelected] = useState<typeof ALLOWED_LAYER_NAMES[number]>(ALLOWED_LAYER_NAMES[0]);
  return (
    <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
      <h2 className="text-lg font-semibold text-white mb-4">Create Layer</h2>
      <div className="flex space-x-2">
        <select
          value={selected}
          onChange={e => setSelected(e.target.value as typeof ALLOWED_LAYER_NAMES[number])}
          className="flex-1 text-black rounded px-2"
        >
          {ALLOWED_LAYER_NAMES.map(name => (
            <option key={name} value={name}>{name}</option>
          ))}
        </select>
        <button
          onClick={() => onCreate(selected)}
          className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default CreateLayer;
