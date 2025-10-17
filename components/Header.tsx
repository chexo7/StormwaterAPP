
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
  const [isHydroCADMenuOpen, setHydroCADMenuOpen] = useState(false);
  const hydroCADMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isHydroCADMenuOpen) {
      return;
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        hydroCADMenuRef.current &&
        !hydroCADMenuRef.current.contains(event.target as Node)
      ) {
        setHydroCADMenuOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setHydroCADMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isHydroCADMenuOpen]);

  return (
    <header className="relative bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-md p-4 flex items-center space-x-4 z-[1200]">
      <MapIcon className="w-8 h-8 text-cyan-400" />
      <div>
        <h1 className="text-xl font-bold text-white">Shapefile Viewer Pro</h1>
        <p className="text-sm text-gray-400">Upload and visualize your geographic data</p>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 flex space-x-2 z-[1200]">
        <div className="relative z-[1200]" ref={hydroCADMenuRef}>
          <button
            type="button"
            onClick={() => setHydroCADMenuOpen(prev => !prev)}
            className={
              'font-semibold px-4 py-1 rounded flex items-center space-x-2 ' +
              (isHydroCADMenuOpen
                ? 'bg-cyan-700 text-white'
                : 'bg-cyan-600 hover:bg-cyan-700 text-white')
            }
          >
            <span>HydroCAD</span>
            <svg
              className={`w-4 h-4 transition-transform ${isHydroCADMenuOpen ? 'rotate-180' : ''}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {isHydroCADMenuOpen && (
            <div className="absolute left-0 mt-2 flex flex-col space-y-2 bg-gray-800 border border-gray-700 rounded shadow-lg p-2 min-w-[12rem] z-[1300]">
              <button
                type="button"
                onClick={() => {
                  setHydroCADMenuOpen(false);
                  onCompute?.();
                }}
                disabled={!computeEnabled}
                className={
                  'text-left font-semibold px-4 py-1 rounded ' +
                  (computeEnabled
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer'
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed')
                }
              >
                Download HydroCAD
              </button>
              <button
                type="button"
                onClick={() => {
                  setHydroCADMenuOpen(false);
                  onExport?.();
                }}
                disabled={!exportEnabled}
                className={
                  'text-left font-semibold px-4 py-1 rounded ' +
                  (exportEnabled
                    ? 'bg-cyan-600 hover:bg-cyan-700 text-white cursor-pointer'
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed')
                }
              >
                Export 2D SCS
              </button>
              <button
                type="button"
                onClick={() => {
                  setHydroCADMenuOpen(false);
                  onManageCurveNumbers?.();
                }}
                disabled={curveNumbersEnabled === false}
                className={
                  'text-left font-semibold px-4 py-1 rounded ' +
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
