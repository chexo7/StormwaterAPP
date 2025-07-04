import React from 'react';
import { CheckCircleIcon, XCircleIcon } from './Icons';
import type { LogEntry } from '../types';

interface LogPanelProps {
  logs: LogEntry[];
}

const LogPanel: React.FC<LogPanelProps> = ({ logs }) => {
  return (
    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600 overflow-y-auto h-48 space-y-2">
      <h2 className="text-lg font-semibold text-white mb-2">Log</h2>
      {logs.length === 0 ? (
        <p className="text-gray-400 text-sm">No log messages yet.</p>
      ) : (
        <ul className="space-y-1 text-sm">
          {logs.map((log, index) => (
            <li key={index} className="flex items-start">
              {log.type === 'error' ? (
                <XCircleIcon className="w-4 h-4 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
              ) : (
                <CheckCircleIcon className="w-4 h-4 text-cyan-400 mt-0.5 mr-2 flex-shrink-0" />
              )}
              <span className="text-gray-400 mr-2 text-xs font-mono">{log.source === 'backend' ? 'server' : 'client'}</span>
              <span className="text-gray-300 break-words flex-1">{log.message}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LogPanel;
