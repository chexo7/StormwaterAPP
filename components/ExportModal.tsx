import React from 'react';

interface ExportModalProps {
  onExportHydroCAD: () => void;
  onExportSWMM: () => void;
  onExportGpkg: () => void;
  onClose: () => void;
  exportHydroCADEnabled?: boolean;
  exportSWMMEnabled?: boolean;
  exportGpkgEnabled?: boolean;
}

const ExportModal: React.FC<ExportModalProps> = ({ onExportHydroCAD, onExportSWMM, onExportGpkg, onClose, exportHydroCADEnabled, exportSWMMEnabled, exportGpkgEnabled }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000]">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 w-[30rem] space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold text-white">Export</h2>
          <button className="text-gray-400 hover:text-white" onClick={onClose}>✕</button>
        </div>
        <button
          onClick={onExportHydroCAD}
          disabled={!exportHydroCADEnabled}
          className={
            'w-full font-semibold px-4 py-2 rounded ' +
            (exportHydroCADEnabled
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
              : 'bg-gray-600 text-gray-300 cursor-not-allowed')
          }
        >
          Export to HydroCAD
        </button>
        <button
          onClick={onExportSWMM}
          disabled={!exportSWMMEnabled}
          className={
            'w-full font-semibold px-4 py-2 rounded ' +
            (exportSWMMEnabled
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
              : 'bg-gray-600 text-gray-300 cursor-not-allowed')
          }
        >
          Export to SWMM
        </button>
        <button
          onClick={onExportGpkg}
          disabled={!exportGpkgEnabled}
          className={
            'w-full font-semibold px-4 py-2 rounded ' +
            (exportGpkgEnabled
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white'
              : 'bg-gray-600 text-gray-300 cursor-not-allowed')
          }
        >
          Export GeoPackage
        </button>
      </div>
    </div>
  );
};

export default ExportModal;
