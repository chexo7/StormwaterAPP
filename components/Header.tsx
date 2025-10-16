
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
  const [isHydroCADMenuOpen, setIsHydroCADMenuOpen] = useState(false);
  const hydroCADMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!hydroCADMenuRef.current) return;
      if (!hydroCADMenuRef.current.contains(event.target as Node)) {
        setIsHydroCADMenuOpen(false);
      }
    };

    if (isHydroCADMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isHydroCADMenuOpen]);

  const hydroCADButtonClasses =
    'font-semibold px-4 py-1 rounded bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer';

  const handleHydroCADMenuAction = (handler?: () => void) => () => {
    if (handler) {
      handler();
    }
    setIsHydroCADMenuOpen(false);
  };

  return (
    <header className="relative bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-md p-4 flex items-center space-x-4 z-10">
      <MapIcon className="w-8 h-8 text-cyan-400" />
      <div>
        <h1 className="text-xl font-bold text-white">Shapefile Viewer Pro</h1>
        <p className="text-sm text-gray-400">Upload and visualize your geographic data</p>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 flex space-x-2">
        <div className="relative" ref={hydroCADMenuRef}>
          <button
            type="button"
            onClick={() => setIsHydroCADMenuOpen(prev => !prev)}
            className={hydroCADButtonClasses}
          >
            HydroCAD
          </button>
          {isHydroCADMenuOpen && (
            <div className="absolute left-0 mt-2 w-48 rounded border border-gray-700 bg-gray-800/95 shadow-lg backdrop-blur-sm p-2 space-y-2">
              <button
                onClick={handleHydroCADMenuAction(onCompute)}
                disabled={!computeEnabled}
                className={
                  'w-full text-left font-semibold px-3 py-2 rounded ' +
                  (computeEnabled
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer'
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed')
                }
              >
                Download HydroCAD
              </button>
              <button
                onClick={handleHydroCADMenuAction(onExport)}
                disabled={!exportEnabled}
                className={
                  'w-full text-left font-semibold px-3 py-2 rounded ' +
                  (exportEnabled
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer'
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed')
                }
              >
                Export 2D SCS
              </button>
              <button
                onClick={handleHydroCADMenuAction(onManageCurveNumbers)}
                disabled={curveNumbersEnabled === false}
                className={
                  'w-full text-left font-semibold px-3 py-2 rounded ' +
                  (curveNumbersEnabled === false
                    ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                    : 'bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer')
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
