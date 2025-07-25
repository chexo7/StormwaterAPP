
import React from 'react';
import { MapIcon } from './Icons';

interface HeaderProps {
  onCompute?: () => void;
  computeEnabled?: boolean;
  onExport?: () => void;
  exportEnabled?: boolean;
  projectName: string;
  onProjectNameChange: (v: string) => void;
  version: string;
  onVersionChange: (v: string) => void;
}
const Header: React.FC<HeaderProps> = ({
  onCompute,
  computeEnabled,
  onExport,
  exportEnabled,
  projectName,
  onProjectNameChange,
  version,
  onVersionChange,
}) => {
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
      </div>
      <div className="ml-auto flex items-center space-x-2">
        <input
          type="text"
          value={projectName}
          onChange={e => onProjectNameChange(e.target.value)}
          placeholder="Project name"
          className="bg-gray-700 text-white px-2 py-1 rounded"
        />
        <select
          value={version}
          onChange={e => onVersionChange(e.target.value)}
          className="bg-gray-700 text-white px-2 py-1 rounded"
        >
          <option value="V1">V1</option>
          <option value="V2">V2</option>
          <option value="V3">V3</option>
        </select>
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
