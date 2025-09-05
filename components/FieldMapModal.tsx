import React, { useState } from 'react';

interface FieldMapModalProps {
  layerName: string;
  properties: Record<string, any>;
  onConfirm: (mapping: Record<string, string>) => void;
  onCancel: () => void;
}

const FieldMapModal: React.FC<FieldMapModalProps> = ({ layerName, properties, onConfirm, onCancel }) => {
  const fields = Object.keys(properties || {});
  const [mapping, setMapping] = useState<Record<string, string>>(() => {
    if (layerName === 'Catch Basins / Manholes') {
      const lowerMap = Object.fromEntries(fields.map(f => [f.toLowerCase(), f]));
      const init: Record<string, string> = {};
      ['inv_n', 'inv_s', 'inv_e', 'inv_w', 'inv_ne', 'inv_se', 'inv_sw', 'inv_nw'].forEach(k => {
        if (lowerMap[k]) init[k] = lowerMap[k];
      });
      return init;
    }
    return {};
  });

  let required: { key: string; label: string }[] = [];
  if (layerName === 'Pipes') {
    required = [
      { key: 'label', label: 'Label' },
      { key: 'inv_in', label: 'Elevation Invert In [ft]' },
      { key: 'inv_out', label: 'Elevation Invert Out [ft]' },
      { key: 'diameter', label: 'Diameter [in]' },
      { key: 'roughness', label: 'Roughness' },
    ];
  } else if (layerName === 'Catch Basins / Manholes') {
    required = [
      { key: 'label', label: 'Label' },
      { key: 'ground', label: 'Elevation Ground [ft]' },
      { key: 'inv_n', label: 'Invert N [ft]' },
      { key: 'inv_ne', label: 'Invert NE [ft]' },
      { key: 'inv_e', label: 'Invert E [ft]' },
      { key: 'inv_se', label: 'Invert SE [ft]' },
      { key: 'inv_s', label: 'Invert S [ft]' },
      { key: 'inv_sw', label: 'Invert SW [ft]' },
      { key: 'inv_w', label: 'Invert W [ft]' },
      { key: 'inv_nw', label: 'Invert NW [ft]' },
    ];
  } else {
    required = [
      { key: 'label', label: 'Label' },
      { key: 'ground', label: 'Elevation Ground [ft]' },
      { key: 'invert', label: 'Elevation Invert[ft]' },
    ];
  }

  const handleChange = (key: string, value: string) => {
    setMapping(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
    const values = Object.values(mapping).filter((v) => v);
    const dup = values.filter((v, i) => values.indexOf(v) !== i);
    if (dup.length) {
      alert('Duplicate field selections detected');
      return;
    }
    onConfirm(mapping);
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2100]">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 w-80 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Map Fields</h2>
          <button className="text-gray-400 hover:text-white" onClick={onCancel}>✕</button>
        </div>
        {required.map(r => (
          <div key={r.key}>
            <label className="block text-sm text-gray-300 mb-1">{r.label}</label>
            <select
              className="w-full bg-gray-700 text-white p-2 rounded"
              value={mapping[r.key] || ''}
              onChange={e => handleChange(r.key, e.target.value)}
            >
              <option value="">-- Select --</option>
              {fields.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
        ))}
        <button
          onClick={handleSubmit}
          className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

export default FieldMapModal;
