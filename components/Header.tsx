
import React, { useEffect, useRef, useState } from 'react';
import { MapIcon } from './Icons';

interface HeaderProps {
  onCompute?: () => void;
  computeEnabled?: boolean;
  onExport?: () => void;
  exportEnabled?: boolean;
  onManageCurveNumbers?: () => void;
  curveNumbersEnabled?: boolean;
  onView3D?: () => void;
  view3DEnabled?: boolean;
  projectName: string;
  onProjectNameChange: (name: string) => void;
  projectVersion: string;
  onProjectVersionChange: (version: string) => void;
}
const Header: React.FC<HeaderProps> = ({
  onCompute,
  computeEnabled,
  onExport,
  exportEnabled,
  onManageCurveNumbers,
  curveNumbersEnabled,
  onView3D,
  view3DEnabled,
  projectName,
  onProjectNameChange,
  projectVersion,
  onProjectVersionChange,
}) => {
  const [isHydroMenuOpen, setIsHydroMenuOpen] = useState(false);
  const hydroMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (hydroMenuRef.current && !hydroMenuRef.current.contains(event.target as Node)) {
        setIsHydroMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const isComputeEnabled = !!computeEnabled;
  const isExportEnabled = !!exportEnabled;
  const isCurveNumbersEnabled = curveNumbersEnabled !== false;

  const handleMenuAction = (isEnabled: boolean, action?: () => void) => () => {
    if (!isEnabled || !action) {
      return;
    }

    action();
    setIsHydroMenuOpen(false);
  };

  return (
    <header className="relative bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-md p-4 flex items-center space-x-4 z-10">
      <MapIcon className="w-8 h-8 text-cyan-400" />
      <div>
        <h1 className="text-xl font-bold text-white">Shapefile Viewer Pro</h1>
        <p className="text-sm text-gray-400">Upload and visualize your geographic data</p>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 flex space-x-2">
        <div className="relative" ref={hydroMenuRef}>
          <button
            onClick={() => setIsHydroMenuOpen(prev => !prev)}
            className="font-semibold px-4 py-1 rounded bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer flex items-center space-x-2"
          >
            <span>HydroCAD</span>
            <span className="text-xs">▾</span>
          </button>
          {isHydroMenuOpen && (
            <div className="absolute left-0 mt-2 w-48 rounded border border-gray-700 bg-gray-800 shadow-lg z-20">
              <button
                onClick={handleMenuAction(isComputeEnabled, onCompute)}
                disabled={!isComputeEnabled}
                className={
                  'w-full text-left px-4 py-2 text-sm font-semibold rounded-t ' +
                  (isComputeEnabled
                    ? 'text-white hover:bg-cyan-600/80'
                    : 'text-gray-400 bg-gray-700 cursor-not-allowed')
                }
              >
                Download HydroCAD
              </button>
              <button
                onClick={handleMenuAction(isExportEnabled, onExport)}
                disabled={!isExportEnabled}
                className={
                  'w-full text-left px-4 py-2 text-sm font-semibold ' +
                  (isExportEnabled
                    ? 'text-white hover:bg-cyan-600/80'
                    : 'text-gray-400 bg-gray-700 cursor-not-allowed')
                }
              >
                Export 2D SCS
              </button>
              <button
                onClick={handleMenuAction(isCurveNumbersEnabled, onManageCurveNumbers)}
                disabled={!isCurveNumbersEnabled}
                className={
                  'w-full text-left px-4 py-2 text-sm font-semibold rounded-b ' +
                  (isCurveNumbersEnabled
                    ? 'text-white hover:bg-cyan-600/80'
                    : 'text-gray-400 bg-gray-700 cursor-not-allowed')
                }
              >
                Curve Numbers
              </button>
            </div>
          )}
        </div>
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
