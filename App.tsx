import React, { useState, useCallback, useEffect, useMemo } from 'react';
import type { FeatureCollection } from 'geojson';
import type { LayerData, LogEntry } from './types';
import Header from './components/Header';
import FileUpload from './components/FileUpload';
import InfoPanel from './components/InfoPanel';
import MapComponent from './components/MapComponent';
import InstructionsPage from './components/InstructionsPage';

type UpdateHsgFn = (layerId: string, featureIndex: number, hsg: string) => void;

const App: React.FC = () => {
  const [layers, setLayers] = useState<LayerData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [zoomToLayer, setZoomToLayer] = useState<{ id: string; ts: number } | null>(null);
  const [editingTarget, setEditingTarget] = useState<{ layerId: string | null; featureIndex: number | null }>({ layerId: null, featureIndex: null });
  const [editingSession, setEditingSession] = useState<{
    id: string;
    original: FeatureCollection;
    draft: FeatureCollection;
  } | null>(null);

  const mapLayers = useMemo(() => {
    if (!editingSession) return layers;
    return layers.map(l =>
      l.id === editingSession.id ? { ...l, geojson: editingSession.draft } : l
    );
  }, [layers, editingSession]);

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
    if (editingTarget.layerId === id) {
      setEditingTarget({ layerId: null, featureIndex: null });
      setEditingSession(null);
    }
  }, [addLog, editingTarget]);

  const handleZoomToLayer = useCallback((id: string) => {
    setZoomToLayer({ id, ts: Date.now() });
  }, []);

  const handleUpdateFeatureHsg = useCallback<UpdateHsgFn>((layerId, featureIndex, hsg) => {
    setLayers(prev => prev.map(layer => {
      if (layer.id !== layerId) return layer;
      const features = [...layer.geojson.features];
      const feature = { ...features[featureIndex] };
      feature.properties = { ...(feature.properties || {}), HSG: hsg };
      features[featureIndex] = feature;
      return { ...layer, geojson: { ...layer.geojson, features } };
    }));
    addLog(`Set HSG for feature ${featureIndex} in ${layerId} to ${hsg}`);
  }, [addLog]);

  const handleToggleEditLayer = useCallback((id: string) => {
    if (editingSession) return;
    const layer = layers.find(l => l.id === id);
    if (!layer) return;
    const snapshot = JSON.parse(JSON.stringify(layer.geojson)) as FeatureCollection;
    setEditingSession({ id, original: snapshot, draft: snapshot });
    setEditingTarget({ layerId: id, featureIndex: null });
    addLog(`Selecciona un pol\u00edgono de ${id} para editarlo`);
  }, [addLog, layers, editingSession]);

  const handleSelectFeatureForEditing = useCallback((layerId: string, index: number) => {
    setEditingTarget({ layerId, featureIndex: index });
    addLog(`Editando pol\u00edgono ${index} en ${layerId}`);
  }, [addLog]);

  const handleUpdateLayerGeojson = useCallback((id: string, geojson: FeatureCollection) => {
    if (editingSession && editingSession.id === id) {
      setEditingSession(prev => prev ? { ...prev, draft: geojson } : prev);
    } else {
      setLayers(prev => prev.map(layer => layer.id === id ? { ...layer, geojson } : layer));
    }
    addLog(`Updated geometry for layer ${id}`);
  }, [addLog, editingSession]);

  const handleSaveEditLayer = useCallback(() => {
    if (!editingSession) return;
    setLayers(prev =>
      prev.map(l => (l.id === editingSession.id ? { ...l, geojson: editingSession.draft } : l))
    );
    addLog(`Saved edits to layer ${editingSession.id}`);
    setEditingSession(null);
    setEditingTarget({ layerId: null, featureIndex: null });
  }, [editingSession, addLog]);

  const handleDiscardEditLayer = useCallback(() => {
    if (!editingSession) return;
    addLog(`Discarded edits to layer ${editingSession.id}`);
    setEditingSession(null);
    setEditingTarget({ layerId: null, featureIndex: null });
  }, [editingSession, addLog]);

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
            onZoomToLayer={handleZoomToLayer}
            onToggleEditLayer={handleToggleEditLayer}
            onSaveEditLayer={handleSaveEditLayer}
            onDiscardEditLayer={handleDiscardEditLayer}
            editingLayerId={editingTarget.layerId}
          />
        </aside>
        <main className="flex-1 bg-gray-900 h-full">
          {mapLayers.length > 0 ? (
            <MapComponent
              layers={mapLayers}
              onUpdateFeatureHsg={handleUpdateFeatureHsg}
              zoomToLayer={zoomToLayer}
              editingTarget={editingTarget}
              onSelectFeatureForEditing={handleSelectFeatureForEditing}
              onUpdateLayerGeojson={handleUpdateLayerGeojson}
            />
          ) : (
            <InstructionsPage />
          )}
        </main>
      </div>
    </div>
  );
};

export default App;
