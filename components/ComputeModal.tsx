import React from 'react';
import { CheckCircleIcon, XCircleIcon, InfoIcon } from './Icons';

export interface ComputeTask {
  name: string;
  status: 'pending' | 'success' | 'error';
}

interface ComputeModalProps {
  tasks: ComputeTask[];
  onClose: () => void;
}

const ComputeModal: React.FC<ComputeModalProps> = ({ tasks, onClose }) => {
  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 space-y-4 w-80">
        <h2 className="text-lg font-semibold text-white">Compute</h2>
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task.name} className="flex items-center space-x-2 text-gray-300">
              {task.status === 'success' && <CheckCircleIcon className="w-5 h-5 text-green-400" />}
              {task.status === 'error' && <XCircleIcon className="w-5 h-5 text-red-400" />}
              {task.status === 'pending' && <InfoIcon className="w-5 h-5 text-gray-400 animate-pulse" />}
              <span>{task.name}</span>
            </li>
          ))}
        </ul>
        <div className="text-right">
          <button
            type="button"
            onClick={onClose}
            className="bg-cyan-600 hover:bg-cyan-700 text-white px-3 py-1 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComputeModal;
