
import React from 'react';
import { MapIcon } from './Icons';

interface HeaderProps {
  onCompute?: () => void;
  computeEnabled?: boolean;
  onExport?: () => void;
  exportEnabled?: boolean;
}
const Header: React.FC<HeaderProps> = ({ onCompute, computeEnabled, onExport, exportEnabled }) => {
  return (
    <header className="relative bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-md p-4 flex items-center space-x-4 z-10">
      <MapIcon className="w-8 h-8 text-cyan-400" />
      <div>
        <h1 className="text-xl font-bold text-white">Shapefile Viewer Pro</h1>
        <p className="text-sm text-gray-400">Upload and visualize your geographic data</p>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 flex space-x-2">
        <button
          onClick={onCompute}
          disabled={!computeEnabled}
          className={
            'font-semibold px-4 py-1 rounded ' +
            (computeEnabled
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer'
              : 'bg-gray-600 text-gray-300 cursor-not-allowed')
          }
        >
          Compute
        </button>
        <button
          onClick={onExport}
          disabled={!exportEnabled}
          className={
            'font-semibold px-4 py-1 rounded ' +
            (exportEnabled
              ? 'bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer'
              : 'bg-gray-600 text-gray-300 cursor-not-allowed')
          }
        >
          Export Results to HydroCAD
        </button>
      </div>
    </header>
  );
};

export default Header;
