
import React from 'react';
import { MapIcon } from './Icons';

interface HeaderProps {
  onCompute?: () => void;
  computeEnabled?: boolean;
}
const Header: React.FC<HeaderProps> = ({ onCompute, computeEnabled }) => {
  return (
    <header className="relative bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-md p-4 flex items-center space-x-4 z-10">
      <MapIcon className="w-8 h-8 text-cyan-400" />
      <div>
        <h1 className="text-xl font-bold text-white">Shapefile Viewer Pro</h1>
        <p className="text-sm text-gray-400">Upload and visualize your geographic data</p>
      </div>
      {computeEnabled && (
        <button
          onClick={onCompute}
          className="absolute left-1/2 -translate-x-1/2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold px-4 py-1 rounded"
        >
          Compute
        </button>
      )}
    </header>
  );
};

export default Header;
