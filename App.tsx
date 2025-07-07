import React, { useState, useCallback, useEffect } from 'react';
import type { FeatureCollection } from 'geojson';
import type { LayerData, LogEntry } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import InfoPanel from './components/InfoPanel';
import MapComponent from './components/MapComponent';
import InstructionsPage from './components/InstructionsPage';

const App: React.FC = () => {
  const [layers, setLayers] = useState<LayerData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const addLog = useCallback((message: string, type: 'info' | 'error' = 'info') => {
    setLogs(prev => [...prev, { message, type, source: 'frontend' }]);
  }, []);

  useEffect(() => {
    const fetchBackendLogs = async () => {
      try {
        const res = await fetch('/api/logs');
        if (res.ok) {
          const data: LogEntry[] = await res.json();
          if (data.length > 0) {
            setLogs(prev => [...prev, ...data.map(l => ({ ...l, source: 'backend' }))]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch backend logs', err);
      }
    };
    fetchBackendLogs();
    const interval = setInterval(fetchBackendLogs, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleLayerAdded = useCallback((geojson: FeatureCollection, name: string) => {
    setIsLoading(false);
    setError(null);
    if (geojson.features.length === 0) {
      const msg = `The file "${name}" appears to be empty or could not be read correctly.`;
      setError(msg);
      addLog(msg, 'error');
    } else {
      const newLayer: LayerData = {
        id: `${Date.now()}-${name}`,
        name: name,
        geojson: geojson,
      };
      setLayers(prevLayers => [...prevLayers, newLayer]);
      addLog(`Loaded layer ${name}`);
    }
  }, [addLog]);

  const handleLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
    addLog('Loading file...');
  }, [addLog]);

  const handleError = useCallback((message: string) => {
    setIsLoading(false);
    setError(message);
    addLog(message, 'error');
  }, [addLog]);

  const handleRemoveLayer = useCallback((id: string) => {
    setLayers(prevLayers => prevLayers.filter(layer => layer.id !== id));
    addLog(`Removed layer ${id}`);
  }, [addLog]);

  const handleUpdateHsg = useCallback((layerId: string, featureIndex: number, newHsg: string) => {
    setLayers(prevLayers => prevLayers.map(layer => {
      if (layer.id !== layerId) return layer;
      const updated = { ...layer.geojson, features: [...layer.geojson.features] };
      const feature = updated.features[featureIndex];
      if (feature && feature.properties) {
        (feature.properties as any).HSG = newHsg;
      }
      return { ...layer, geojson: updated };
    }));
    addLog(`Updated HSG for feature ${featureIndex} in ${layerId} to ${newHsg}`);
  }, [addLog]);

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-gray-100 font-sans">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-72 md:w-96 2xl:w-[32rem] bg-gray-800 p-4 md:p-6 flex flex-col space-y-6 overflow-y-auto shadow-lg border-r border-gray-700">
          <FileUpload
            onLayerAdded={handleLayerAdded}
            onLoading={handleLoading}
            onError={handleError}
            onLog={addLog}
            isLoading={isLoading}
          />
          <InfoPanel
            layers={layers}
            error={error}
            logs={logs}
            onRemoveLayer={handleRemoveLayer}
          />
        </aside>
        <main className="flex-1 bg-gray-900 h-full">
          {layers.length > 0 ? (
            <MapComponent layers={layers} onUpdateHsg={handleUpdateHsg} />
          ) : (
            <InstructionsPage />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
