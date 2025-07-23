import React from 'react';

const InstructionsPage: React.FC = () => {
  return (
    <div className="h-full w-full flex items-center justify-center bg-gray-900 text-gray-300 p-8">
      <div className="max-w-prose text-center space-y-4">
        <h2 className="text-2xl font-bold text-cyan-400">Welcome</h2>
        <p>Upload a shapefile using the panel on the left to start the map.</p>
        <ol className="list-decimal list-inside text-left space-y-2">
          <li>Verify the LOD layer contains exactly one polygon.</li>
          <li>
            Use that polygon to clip the Drainage Areas layer and save the
            result as <strong>Drainage Area in LOD</strong>, preserving all
            original attributes.
          </li>
        </ol>
      </div>
    </div>
  );
};

export default InstructionsPage;
