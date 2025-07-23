import React from 'react';
import { CheckCircleIcon, XCircleIcon } from './Icons';

export interface ComputeTask {
  id: string;
  name: string;
  status: 'pending' | 'success' | 'error';
}

interface ComputeModalProps {
  tasks: ComputeTask[];
  onClose: () => void;
}

const ComputeModal: React.FC<ComputeModalProps> = ({ tasks, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[2000]">
      <div className="bg-gray-800 p-6 rounded-lg border border-gray-600 w-80 space-y-4 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-white"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold text-white">Processing</h2>
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task.id} className="flex items-center space-x-2">
              {task.status === 'success' ? (
                <CheckCircleIcon className="w-5 h-5 text-green-400" />
              ) : task.status === 'error' ? (
                <XCircleIcon className="w-5 h-5 text-red-500" />
              ) : (
                <svg className="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              <span className="text-gray-300 flex-1">{task.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ComputeModal;
