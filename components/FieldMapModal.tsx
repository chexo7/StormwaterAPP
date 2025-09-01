import React, { useState, useEffect } from 'react';

interface FieldMapModalProps {
  layerName: string;
  properties: Record<string, any>;
  onConfirm: (mapping: Record<string, string>) => void;
  onCancel: () => void;
}

const FieldMapModal: React.FC<FieldMapModalProps> = ({ layerName, properties, onConfirm, onCancel }) => {
  const fields = Object.keys(properties || {});
  const [mapping, setMapping] = useState<Record<string, string>>({});

  const required = layerName === 'Pipes'
    ? [
        { key: 'label', label: 'Label' },
        { key: 'inv_in', label: 'Elevation Invert In [ft]' },
        { key: 'inv_out', label: 'Elevation Invert Out [ft]' },
        { key: 'diameter', label: 'Diameter [in]' },
        { key: 'roughness', label: 'Roughness' },
      ]
    : [
        { key: 'label', label: 'Label' },
        { key: 'ground', label: 'Elevation Ground [ft]' },
        { key: 'invert', label: 'Elevation Invert[ft]' },
      ];

  useEffect(() => {
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, '');
    const guess: Record<string, string> = {};
    required.forEach(r => {
      const target = norm(r.label);
      const found = fields.find(f => {
        const nf = norm(f);
        return nf === target || nf.includes(target) || target.includes(nf);
      });
      if (found) guess[r.key] = found;
    });
    setMapping(guess);
  }, [fields, layerName]);

  const handleChange = (key: string, value: string) => {
    setMapping(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = () => {
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
