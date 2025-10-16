
import React from 'react';
import { MapIcon } from './Icons';

export interface ScsStatusIndicator {
  key: string;
  label: string;
  shortLabel: string;
  ready: boolean;
}

interface HeaderProps {
  onCompute?: () => void;
  computeEnabled?: boolean;
  onExport?: () => void;
  exportEnabled?: boolean;
  onView3D?: () => void;
  view3DEnabled?: boolean;
  projectName: string;
  onProjectNameChange: (name: string) => void;
  projectVersion: string;
  onProjectVersionChange: (version: string) => void;
  scsStatuses?: ScsStatusIndicator[];
}
const Header: React.FC<HeaderProps> = ({
  onCompute,
  computeEnabled,
  onExport,
  exportEnabled,
  onView3D,
  view3DEnabled,
  projectName,
  onProjectNameChange,
  projectVersion,
  onProjectVersionChange,
  scsStatuses = [],
}) => {
  return (
    <header className="relative bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-md p-4 flex items-center space-x-4 z-10">
      <MapIcon className="w-8 h-8 text-cyan-400" />
      <div>
        <h1 className="text-xl font-bold text-white">Shapefile Viewer Pro</h1>
        <p className="text-sm text-gray-400">Upload and visualize your geographic data</p>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center space-y-2">
        <div className="flex space-x-2">
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
            Export
          </button>
          <button
            onClick={onView3D}
            disabled={!view3DEnabled}
            className={
              'font-semibold px-4 py-1 rounded ' +
              (view3DEnabled
                ? 'bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer'
                : 'bg-gray-600 text-gray-300 cursor-not-allowed')
            }
          >
            3D Pipe Network
          </button>
        </div>
        {scsStatuses.length > 0 && (
          <div className="flex space-x-3 bg-gray-900/70 rounded-full px-4 py-1 border border-gray-700/70">
            {scsStatuses.map(status => (
              <div
                key={status.key}
                className="flex items-center space-x-1 text-xs text-gray-200"
                title={`${status.label}: ${status.ready ? 'Listo' : 'Falta completar'}`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full shadow ${
                    status.ready
                      ? 'bg-green-400 shadow-green-500/50'
                      : 'bg-red-500 shadow-red-500/50'
                  }`}
                />
                <span className="font-semibold tracking-wide">
                  {status.shortLabel}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="absolute right-4 flex items-center space-x-2">
        <input
          type="text"
          value={projectName}
          onChange={e => onProjectNameChange(e.target.value)}
          placeholder="Project Name"
          className="px-2 py-1 rounded text-black"
        />
        <select
          value={projectVersion}
          onChange={e => onProjectVersionChange(e.target.value)}
          className="px-2 py-1 rounded text-black"
        >
          {Array.from({ length: 10 }, (_, i) => (
            <option key={i + 1} value={`V${i + 1}`}>{`V${i + 1}`}</option>
          ))}
        </select>
      </div>
    </header>
  );
};

export default Header;
