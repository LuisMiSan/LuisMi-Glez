
import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div
      className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};
