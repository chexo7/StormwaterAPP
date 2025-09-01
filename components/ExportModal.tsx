import React from 'react';
import { PROJECTION_OPTIONS, ProjectionOption } from '../utils/projections';

interface ExportModalProps {
  onExportHydroCAD: () => void;
  onExportSWMM: () => void;
  onExportShapefiles: () => void;
  onClose: () => void;
  exportEnabled?: boolean;
  projection: ProjectionOption;
  onProjectionChange: (proj: ProjectionOption) => void;
}

const ExportModal: React.FC<ExportModalProps> = ({
  onExportHydroCAD,
  onExportSWMM,
  onExportShapefiles,
  onClose,
  exportEnabled,
  projection,
  onProjectionChange,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000]">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 w-80 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Export</h2>
          <button className="text-gray-400 hover:text-white" onClick={onClose}>✕</button>
        </div>
        <div>
          <label className="block text-sm text-gray-300 mb-1">Projection (State Plane/EPSG)</label>
          <select
            value={projection.epsg}
            onChange={(e) => {
              const opt = PROJECTION_OPTIONS.find((o) => o.epsg === e.target.value);
              if (opt) onProjectionChange(opt);
            }}
            className="w-full bg-gray-700 border border-gray-600 text-gray-200 rounded px-2 py-1"
          >
            {PROJECTION_OPTIONS.map((opt) => (
              <option key={opt.epsg} value={opt.epsg}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={onExportHydroCAD}
          disabled={!exportEnabled}
          className={
            'w-full font-semibold px-4 py-2 rounded ' +
            (exportEnabled ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-gray-600 text-gray-300 cursor-not-allowed')
          }
        >
          Export to HydroCAD
        </button>
        <button
          onClick={onExportSWMM}
          disabled={!exportEnabled}
          className={
            'w-full font-semibold px-4 py-2 rounded ' +
            (exportEnabled ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-gray-600 text-gray-300 cursor-not-allowed')
          }
        >
          Export to SWMM
        </button>
        <button
          onClick={onExportShapefiles}
          disabled={!exportEnabled}
          className={
            'w-full font-semibold px-4 py-2 rounded ' +
            (exportEnabled ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-gray-600 text-gray-300 cursor-not-allowed')
          }
        >
          Export processed shapefiles
        </button>
      </div>
    </div>
  );
};

export default ExportModal;

