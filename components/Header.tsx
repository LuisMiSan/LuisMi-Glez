import React from 'react';

const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
  >
    <path
      fillRule="evenodd"
      d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.863 2.863l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.863 2.863l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.863-2.863l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036a.75.75 0 00.46.46l1.036.258a.75.75 0 010 1.456l-1.036.258a.75.75 0 00-.46.46l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a.75.75 0 00-.46-.46l-1.036-.258a.75.75 0 010-1.456l1.036-.258a.75.75 0 00.46-.46l.258-1.036A.75.75 0 0118 1.5zM18 15a.75.75 0 01.728.568l.258 1.036a.75.75 0 00.46.46l1.036.258a.75.75 0 010 1.456l-1.036.258a.75.75 0 00-.46.46l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a.75.75 0 00-.46-.46l-1.036-.258a.75.75 0 010-1.456l1.036-.258a.75.75 0 00.46-.46l.258-1.036A.75.75 0 0118 15z"
      clipRule="evenodd"
    />
  </svg>
);

export const Header: React.FC = () => {
  return (
    <header className="py-6 border-b border-slate-700/50 bg-slate-900/70 backdrop-blur-sm">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <SparkleIcon className="w-8 h-8 text-cyan-400" />
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            Creador de Prompts Perfectos
          </h1>
        </div>
        <p className="mt-2 text-md md:text-lg text-slate-400">
          Construye prompts estructurados y de alta calidad para cualquier IA con facilidad.
        </p>
      </div>
    </header>
  );
};