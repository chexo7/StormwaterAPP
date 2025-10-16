import React from 'react';

export interface ScsLayerStatus {
  key: string;
  label: string;
  ready: boolean;
  description?: string;
}

interface ScsStatusPanelProps {
  statuses: ScsLayerStatus[];
}

const ScsStatusPanel: React.FC<ScsStatusPanelProps> = ({ statuses }) => {
  const allReady = statuses.every(status => status.ready);

  return (
    <div className="bg-gray-800 p-4 rounded-lg border border-gray-600 space-y-3 shadow-inner">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-cyan-300">
          SCS Readiness
        </h3>
        <span
          className={`text-xs font-semibold ${
            allReady ? 'text-emerald-400' : 'text-red-400'
          }`}
        >
          {allReady ? 'Listo' : 'Pendiente'}
        </span>
      </div>
      <ul className="space-y-3">
        {statuses.map(status => (
          <li key={status.key} className="flex items-start space-x-3">
            <span
              aria-hidden="true"
              className={`mt-1 h-3 w-3 rounded-full ${
                status.ready
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                  : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]'
              }`}
            />
            <div className="flex-1 text-sm text-gray-100">
              <p className="font-semibold text-gray-100">{status.label}</p>
              {status.description && (
                <p className="mt-1 text-xs text-gray-400">{status.description}</p>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScsStatusPanel;
