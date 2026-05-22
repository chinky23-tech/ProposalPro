import React from 'react';

export const LoadingSpinner = ({ className = 'w-8 h-8 text-blue-600' }) => {
  return (
    <div className={`animate-spin rounded-full border-2 border-t-transparent ${className}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
};