import React from 'react';
import { CheckCircleIcon, XCircleIcon } from './Icons';

export type TaskStatus = 'pending' | 'running' | 'success' | 'error';
export interface ComputeTask {
  id: string;
  name: string;
  status: TaskStatus;
}

interface ComputeModalProps {
  tasks: ComputeTask[];
  onClose: () => void;
}

const statusIcon = (status: TaskStatus) => {
  switch (status) {
    case 'success':
      return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
    case 'error':
      return <XCircleIcon className="w-5 h-5 text-red-400" />;
    case 'running':
      return (
        <svg className="animate-spin h-5 w-5 text-cyan-400" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      );
    default:
      return <span className="w-5 h-5" />;
  }
};

const ComputeModal: React.FC<ComputeModalProps> = ({ tasks, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 w-96 space-y-4">
        <h2 className="text-lg font-semibold text-white">Compute Tasks</h2>
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task.id} className="flex items-center space-x-2 text-gray-200">
              {statusIcon(task.status)}
              <span>{task.name}</span>
            </li>
          ))}
        </ul>
        <div className="text-right">
          <button onClick={onClose} className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComputeModal;
