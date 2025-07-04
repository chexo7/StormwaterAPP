
import React from 'react';
import { MapIcon } from './Icons';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800/50 backdrop-blur-sm border-b border-gray-700 shadow-md p-4 flex items-center space-x-4 z-10">
      <MapIcon className="w-8 h-8 text-cyan-400" />
      <div>
        <h1 className="text-xl lg:text-2xl 2xl:text-3xl font-bold text-white">Shapefile Viewer Pro</h1>
        <p className="text-sm lg:text-base 2xl:text-lg text-gray-400">Upload and visualize your geographic data</p>
      </div>
    </header>
  );
};

export default Header;
