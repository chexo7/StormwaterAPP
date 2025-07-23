import React from 'react';
import { CheckCircleIcon, XCircleIcon } from './Icons';

export interface TaskItem {
  id: string;
  description: string;
  status: 'pending' | 'success' | 'error';
}

interface TaskModalProps {
  tasks: TaskItem[];
  onClose?: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ tasks, onClose }) => {
  const allDone = tasks.every(t => t.status !== 'pending');
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-gray-800 border border-gray-600 p-6 rounded-lg w-80 space-y-4">
        <h2 className="text-lg font-semibold text-white">Processing</h2>
        <ul className="space-y-2">
          {tasks.map(task => (
            <li key={task.id} className="flex items-center text-gray-300">
              {task.status === 'success' && (
                <CheckCircleIcon className="w-5 h-5 text-green-400 mr-2" />
              )}
              {task.status === 'error' && (
                <XCircleIcon className="w-5 h-5 text-red-400 mr-2" />
              )}
              {task.status === 'pending' && (
                <svg className="animate-spin w-5 h-5 text-gray-400 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              )}
              <span className="flex-1">{task.description}</span>
            </li>
          ))}
        </ul>
        {allDone && (
          <button
            onClick={onClose}
            className="block ml-auto bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-1 rounded"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
