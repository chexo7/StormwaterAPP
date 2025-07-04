
import React from 'react';
import { MapIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-md p-4 flex items-center space-x-4 z-10">
      <MapIcon className="w-8 h-8 3xl:w-10 3xl:h-10 4k:w-12 4k:h-12 text-cyan-400" />
      <div>
        <h1 className="text-xl 3xl:text-2xl 4k:text-3xl font-bold text-white">Shapefile Viewer Pro</h1>
        <p className="text-sm 3xl:text-base 4k:text-lg text-gray-400">Upload and visualize your geographic data</p>
      </div>
    </header>
  );
};

export default Header;
