import React from 'react';

export const Loader: React.FC = () => {
  return (
    <div
      className="animate-spin rounded-full h-5 w-5 border-b-2 border-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
};