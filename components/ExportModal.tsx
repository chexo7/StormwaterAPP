import React, { useMemo, useState } from 'react';
import { STATE_PLANE_OPTIONS } from '../utils/projections';
import type { ProjectionOption } from '../types';

interface ExportModalProps {
  onExportOverlay: () => void;
  onClose: () => void;
  exportOverlayEnabled?: boolean;
  projection: ProjectionOption;
  onProjectionChange: (epsg: string) => void;
  onProjectionConfirm: () => void;
  projectionConfirmed: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({
  onExportOverlay,
  onClose,
  exportOverlayEnabled,
  projection,
  onProjectionChange,
  onProjectionConfirm,
  projectionConfirmed,
}) => {
  const [filter, setFilter] = useState('');

  const filteredOptions = useMemo(
    () =>
      STATE_PLANE_OPTIONS.filter(
        (opt) =>
          opt.name.toLowerCase().includes(filter.toLowerCase()) ||
          opt.epsg.includes(filter)
      ),
    [filter]
  );

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000]">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 w-[30rem] space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Export 2D SCS</h2>
          <button className="text-gray-400 hover:text-white" onClick={onClose}>✕</button>
        </div>
        <p className="text-sm text-gray-300">
          Selecciona la proyección para el shapefile y confirma antes de exportar la capa Overlay (Auto).
        </p>
        <div>
          <label className="block text-sm text-gray-300 mb-1">State Plane</label>
          <input
            type="text"
            placeholder="Filter by name or EPSG"
            className="w-full mb-2 bg-gray-700 text-white p-2 rounded"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          <select
            size={12}
            className="w-full bg-gray-700 text-white p-2 rounded overflow-y-auto"
            value={projection.epsg}
            onChange={(e) => onProjectionChange(e.target.value)}
          >
            {filteredOptions.map((opt) => (
              <option key={opt.epsg} value={opt.epsg} title={`${opt.epsg} - ${opt.name}`}>
                {`EPSG:${opt.epsg} - ${opt.name}`}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={onProjectionConfirm}
          disabled={projectionConfirmed}
          className={
            'w-full font-semibold px-4 py-2 rounded ' +
            (projectionConfirmed
              ? 'bg-green-700 text-white cursor-default'
              : 'bg-cyan-600 hover:bg-cyan-700 text-white')
          }
        >
          {projectionConfirmed ? 'Projection confirmed' : 'Confirm projection'}
        </button>
        <button
          onClick={onExportOverlay}
          disabled={!exportOverlayEnabled}
          className={
            'w-full font-semibold px-4 py-2 rounded ' +
            (exportOverlayEnabled
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
              : 'bg-gray-600 text-gray-300 cursor-not-allowed')
          }
        >
          Exportar Overlay (Auto)
        </button>
      </div>
    </div>
  );
};

export default ExportModal;
