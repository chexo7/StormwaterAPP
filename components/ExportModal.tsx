import React from 'react';

interface ExportModalProps {
  onExportHydroCAD: () => void;
  onExportPCSWMM: () => void;
  onExportShapefiles: () => void;
  onClose: () => void;
  exportEnabled?: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({ onExportHydroCAD, onExportPCSWMM, onExportShapefiles, onClose, exportEnabled }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000]">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 w-80 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Export</h2>
          <button className="text-gray-400 hover:text-white" onClick={onClose}>✕</button>
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
          onClick={onExportPCSWMM}
          disabled={!exportEnabled}
          className={
            'w-full font-semibold px-4 py-2 rounded ' +
            (exportEnabled ? 'bg-cyan-600 hover:bg-cyan-700 text-white' : 'bg-gray-600 text-gray-300 cursor-not-allowed')
          }
        >
          Export to PCSWMM
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
