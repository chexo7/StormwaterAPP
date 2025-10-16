
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
  const hydroMenuRef = useRef<HTMLDivElement>(null);

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

  const hydroMenuEnabled = Boolean(
    computeEnabled || exportEnabled || curveNumbersEnabled !== false,
  );

  const handleHydroToggle = () => {
    if (hydroMenuEnabled) {
      setIsHydroMenuOpen(open => !open);
    }
  };

  const handleHydroAction = (callback?: () => void) => {
    if (callback) {
      callback();
    }
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
            onClick={handleHydroToggle}
            disabled={!hydroMenuEnabled}
            className={
              'font-semibold px-4 py-1 rounded flex items-center space-x-2 ' +
              (hydroMenuEnabled
                ? 'bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer'
                : 'bg-gray-600 text-gray-300 cursor-not-allowed')
            }
          >
            <span>HydroCAD</span>
            <svg
              className={`w-4 h-4 transition-transform ${isHydroMenuOpen ? 'rotate-180' : ''}`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isHydroMenuOpen && (
            <div className="absolute right-0 mt-2 w-52 bg-gray-800 border border-gray-700 rounded shadow-lg py-2">
              <button
                onClick={() => handleHydroAction(onCompute)}
                disabled={!computeEnabled}
                className={
                  'w-full text-left px-4 py-2 text-sm font-semibold ' +
                  (computeEnabled
                    ? 'text-white hover:bg-gray-700'
                    : 'text-gray-400 cursor-not-allowed')
                }
              >
                Download HydroCAD
              </button>
              <button
                onClick={() => handleHydroAction(onExport)}
                disabled={!exportEnabled}
                className={
                  'w-full text-left px-4 py-2 text-sm font-semibold ' +
                  (exportEnabled
                    ? 'text-white hover:bg-gray-700'
                    : 'text-gray-400 cursor-not-allowed')
                }
              >
                Export 2D SCS
              </button>
              <button
                onClick={() => handleHydroAction(onManageCurveNumbers)}
                disabled={curveNumbersEnabled === false}
                className={
                  'w-full text-left px-4 py-2 text-sm font-semibold ' +
                  (curveNumbersEnabled === false
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-white hover:bg-gray-700')
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
