import React from 'react';
import { Alert as ShadcnAlert } from '../ui/alert';

const Alert = ({ type, message, onClose }) => {
  const colors = {
    error: 'border-red-400 text-red-700 bg-red-100',
    success: 'border-green-400 text-green-700 bg-green-100',
    warning: 'border-yellow-400 text-yellow-700 bg-yellow-100',
    info: 'border-blue-400 text-blue-700 bg-blue-100'
  };

  return (
    <ShadcnAlert className={`${colors[type]} border px-4 py-3 rounded relative mb-4`}>
      <span className="block sm:inline">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-0 bottom-0 right-0 px-4 py-3"
        >
          <span className="sr-only">Close</span>
          ×
        </button>
      )}
    </ShadcnAlert>
  );
};

export default Alert;