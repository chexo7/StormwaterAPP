
import React from 'react';
import { MapIcon } from './Icons';

interface HeaderProps {
  computeEnabled?: boolean;
  onCompute?: () => void;
}

const Header: React.FC<HeaderProps> = ({ computeEnabled = false, onCompute }) => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-md p-4 flex items-center relative space-x-2 z-10">
      <MapIcon className="w-8 h-8 text-cyan-400" />
      <h1 className="text-xl font-bold text-white">Shapefile Viewer Pro</h1>
      <div className="absolute left-1/2 -translate-x-1/2">
        {computeEnabled ? (
          <button
            type="button"
            onClick={onCompute}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-4 py-1 rounded shadow"
          >
            Compute
          </button>
        ) : (
          <p className="text-sm text-gray-400">Upload and visualize your geographic data</p>
        )}
      </div>
    </header>
  );
};

export default Header;
