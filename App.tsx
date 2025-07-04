import React, { useState, useCallback } from 'react';
import type { FeatureCollection } from 'geojson';
import type { LayerData } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import InfoPanel from './components/InfoPanel';
import MapComponent from './components/MapComponent';

const App: React.FC = () => {
  const [layers, setLayers] = useState<LayerData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLayerAdded = useCallback((geojson: FeatureCollection, name: string) => {
    setIsLoading(false);
    setError(null);
    if (geojson.features.length === 0) {
      setError(`The file "${name}" appears to be empty or could not be read correctly.`);
    } else {
      const newLayer: LayerData = {
        id: `${Date.now()}-${name}`,
        name: name,
        geojson: geojson,
      };
      setLayers(prevLayers => [...prevLayers, newLayer]);
    }
  }, []);

  const handleLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const handleError = useCallback((message: string) => {
    setIsLoading(false);
    setError(message);
  }, []);

  const handleRemoveLayer = useCallback((id: string) => {
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== id));
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-96 bg-gray-800 p-6 flex flex-col space-y-6 overflow-y-auto shadow-lg border-r border-gray-700">
          <FileUpload 
            onLayerAdded={handleLayerAdded} 
            onLoading={handleLoading}
            onError={handleError}
            isLoading={isLoading}
          />
          <InfoPanel 
            layers={layers}
            error={error}
            onRemoveLayer={handleRemoveLayer}
          />
        </aside>
        <main className="flex-1 bg-gray-900">
          <MapComponent layers={layers} />
        </main>
      </div>
    </div>
  );
};

export default App;