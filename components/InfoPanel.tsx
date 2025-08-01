import React from 'react';
import type { LayerData, LogEntry } from '../types';
import { XCircleIcon, InfoIcon, TrashIcon, EditIcon, LockClosedIcon, EyeIcon, EyeOffIcon } from './Icons';
import LogPanel from './LogPanel';

interface InfoPanelProps {
  layers: LayerData[];
  error: string | null;
  logs: LogEntry[];
  onRemoveLayer: (id: string) => void;
  onZoomToLayer?: (id: string) => void;
  onToggleEditLayer?: (id: string) => void;
  onToggleVisibility?: (id: string) => void;
  onChangeStyle?: (id: string, style: Partial<Pick<LayerData, 'fillColor' | 'fillOpacity'>>) => void;
  editingLayerId?: string | null;
}

const InfoPanel: React.FC<InfoPanelProps> = ({ layers, error, logs, onRemoveLayer, onZoomToLayer, onToggleEditLayer, onToggleVisibility, onChangeStyle, editingLayerId }) => {

  const getFeatureTypeSummary = (geojson: LayerData['geojson']) => {
    if (!geojson) return {};
    const counts: { [key: string]: number } = {};
    geojson.features.forEach(feature => {
      const type = feature.geometry.type;
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  };

  return (
    <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600 flex-grow flex flex-col space-y-4">
      <h2 className="text-lg font-semibold text-white">Layer Information</h2>
      <div className="space-y-4 flex-grow overflow-y-auto pr-2">
        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
            <div className="flex">
              <XCircleIcon className="w-6 h-6 mr-3 text-red-400 flex-shrink-0"/>
              <div>
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
          </div>
        )}
        {!error && layers.length === 0 && (
          <div className="bg-blue-900/50 border border-blue-700 text-blue-300 px-4 py-3 rounded-lg h-full flex items-center justify-center" role="status">
            <div className="flex items-center">
              <InfoIcon className="w-6 h-6 mr-3 text-blue-400"/>
              <p>Ready to visualize. Upload a layer.</p>
            </div>
          </div>
        )}
        {layers.length > 0 && (
           <div className="space-y-3">
            {Object.entries(layers.reduce((acc: Record<string, LayerData[]>, l) => {
                const cat = l.category || 'Original';
                (acc[cat] = acc[cat] || []).push(l);
                return acc;
              }, {})).map(([cat, grp]) => (
                cat === 'Process' ? (
                  <details key={cat} open className="space-y-3">
                    <summary className="cursor-pointer text-cyan-300 font-bold">{cat}</summary>
                    {grp.map(layer => {
                      const featureCount = layer.geojson.features.length;
                      const featureSummary = getFeatureTypeSummary(layer.geojson);
                      return (
                        <div
                          key={layer.id}
                          className="bg-gray-800 p-4 rounded-lg border border-gray-600/50 cursor-pointer hover:border-cyan-400"
                          onClick={() => onZoomToLayer && onZoomToLayer(layer.id)}
                        >
                          <div className="flex justify-between items-start">
                            <h3 className="text-md font-bold text-cyan-400 mb-2 break-all pr-2">{layer.name}</h3>
                            <div className="flex space-x-2">
                              {onToggleEditLayer && (layer.editable ? (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onToggleEditLayer(layer.id); }}
                                  className="text-gray-500 hover:text-green-400 transition-colors flex-shrink-0"
                                  aria-label={`Edit layer ${layer.name}`}
                                >
                                  {editingLayerId === layer.id ? <XCircleIcon className="w-5 h-5" /> : <EditIcon className="w-5 h-5" />}
                                </button>
                              ) : (
                                <LockClosedIcon className="w-5 h-5 text-gray-600" />
                              ))}
                              {onToggleVisibility && (
                                <button
                                  onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id); }}
                                  className="text-gray-500 hover:text-cyan-400 transition-colors flex-shrink-0"
                                  aria-label={`Toggle visibility of layer ${layer.name}`}
                                >
                                  {layer.visible ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
                                </button>
                              )}
                              <button onClick={(e) => { e.stopPropagation(); onRemoveLayer(layer.id); }} className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0" aria-label={`Remove layer ${layer.name}`}>
                                <TrashIcon className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                          <div className="text-gray-300 space-y-2 text-sm">
                             <p><strong>Total Features:</strong> <span className="font-mono bg-gray-900 px-2 py-1 rounded">{featureCount}</span></p>
                              {Object.keys(featureSummary).length > 0 && (
                                  <ul className="list-disc list-inside space-y-1 text-xs text-gray-400 pl-1">
                                    {Object.entries(featureSummary).map(([type, count]) => (
                                      <li key={type}>{type}: <span className="font-mono text-cyan-400">{count}</span></li>
                                    ))}
                                  </ul>
                              )}
                              {onChangeStyle && (
                                <div className="flex items-center space-x-2 pt-1" onClick={e => e.stopPropagation()}>
                                  <input
                                    type="color"
                                    value={layer.fillColor}
                                    onChange={e => onChangeStyle(layer.id, { fillColor: e.target.value })}
                                  />
                                  <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={layer.fillOpacity}
                                    onChange={e => onChangeStyle(layer.id, { fillOpacity: parseFloat(e.target.value) })}
                                  />
                                  <span className="text-xs w-6 text-center">{Math.round(layer.fillOpacity * 100)}%</span>
                                </div>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </details>
                ) : (
                  grp.map(layer => {
                    const featureCount = layer.geojson.features.length;
                    const featureSummary = getFeatureTypeSummary(layer.geojson);
                    return (
                      <div
                        key={layer.id}
                        className="bg-gray-800 p-4 rounded-lg border border-gray-600/50 cursor-pointer hover:border-cyan-400"
                        onClick={() => onZoomToLayer && onZoomToLayer(layer.id)}
                      >
                        <div className="flex justify-between items-start">
                          <h3 className="text-md font-bold text-cyan-400 mb-2 break-all pr-2">{layer.name}</h3>
                          <div className="flex space-x-2">
                            {onToggleEditLayer && (layer.editable ? (
                              <button
                                onClick={(e) => { e.stopPropagation(); onToggleEditLayer(layer.id); }}
                                className="text-gray-500 hover:text-green-400 transition-colors flex-shrink-0"
                                aria-label={`Edit layer ${layer.name}`}
                              >
                                {editingLayerId === layer.id ? <XCircleIcon className="w-5 h-5" /> : <EditIcon className="w-5 h-5" />}
                              </button>
                            ) : (
                              <LockClosedIcon className="w-5 h-5 text-gray-600" />
                            ))}
                            {onToggleVisibility && (
                              <button
                                onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id); }}
                                className="text-gray-500 hover:text-cyan-400 transition-colors flex-shrink-0"
                                aria-label={`Toggle visibility of layer ${layer.name}`}
                              >
                                {layer.visible ? <EyeIcon className="w-5 h-5" /> : <EyeOffIcon className="w-5 h-5" />}
                              </button>
                            )}
                            <button onClick={(e) => { e.stopPropagation(); onRemoveLayer(layer.id); }} className="text-gray-500 hover:text-red-400 transition-colors flex-shrink-0" aria-label={`Remove layer ${layer.name}`}>
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                        <div className="text-gray-300 space-y-2 text-sm">
                           <p><strong>Total Features:</strong> <span className="font-mono bg-gray-900 px-2 py-1 rounded">{featureCount}</span></p>
                            {Object.keys(featureSummary).length > 0 && (
                                <ul className="list-disc list-inside space-y-1 text-xs text-gray-400 pl-1">
                                  {Object.entries(featureSummary).map(([type, count]) => (
                                    <li key={type}>{type}: <span className="font-mono text-cyan-400">{count}</span></li>
                                  ))}
                                </ul>
                            )}
                            {onChangeStyle && (
                              <div className="flex items-center space-x-2 pt-1" onClick={e => e.stopPropagation()}>
                                <input
                                  type="color"
                                  value={layer.fillColor}
                                  onChange={e => onChangeStyle(layer.id, { fillColor: e.target.value })}
                                />
                                <input
                                  type="range"
                                  min="0"
                                  max="1"
                                  step="0.1"
                                  value={layer.fillOpacity}
                                  onChange={e => onChangeStyle(layer.id, { fillOpacity: parseFloat(e.target.value) })}
                                />
                                <span className="text-xs w-6 text-center">{Math.round(layer.fillOpacity * 100)}%</span>
                              </div>
                            )}
                        </div>
                      </div>
                    );
                  })
                )
              ))}
          </div>
        )}
      </div>
      <LogPanel logs={logs} />
    </div>
  );
};

export default InfoPanel;

