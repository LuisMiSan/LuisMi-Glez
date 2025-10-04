import React, { useState, useEffect } from 'react';
import { AppState } from '../types';
import { Loader } from './Loader';

// Icons
const ClipboardIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a2.25 2.25 0 0 1-2.25 2.25h-1.5a2.25 2.25 0 0 1-2.25-2.25v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

const SaveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const SparkleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

interface PromptOutputProps {
  prompt: string | null;
  state: AppState;
  error: string | null;
  onSave: () => void;
  onEnhance: () => void;
}

export const PromptOutput: React.FC<PromptOutputProps> = ({ prompt, state, error, onSave, onEnhance }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (state !== AppState.SUCCESS) {
      setCopied(false);
      setSaved(false);
    }
  }, [state]);

  const handleCopy = () => {
    if (prompt) {
      navigator.clipboard.writeText(prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSave = () => {
    onSave();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderContent = () => {
    switch (state) {
      case AppState.LOADING:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Loader />
            <p className="mt-4 text-sm">Generando prompt con IA...</p>
          </div>
        );
      case AppState.ERROR:
        return (
          <div className="flex flex-col items-center justify-center h-full text-red-400">
            <p className="font-semibold">Error</p>
            <p className="text-sm text-center mt-2">{error}</p>
          </div>
        );
      case AppState.SUCCESS:
        if (!prompt) return null;
        return (
          <pre className="whitespace-pre-wrap break-words font-sans text-sm text-slate-200">
            <code>{prompt}</code>
          </pre>
        );
      case AppState.IDLE:
      default:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-500">
            <SparkleIcon className="w-12 h-12 mb-4" />
            <p className="font-semibold text-center">Tu prompt aparecerá aquí</p>
            <p className="text-sm text-center mt-1">Completa los campos y haz clic en "Generar Prompt".</p>
          </div>
        );
    }
  };

  return (
    <div className="relative bg-slate-800/50 border border-slate-700 rounded-xl shadow-2xl flex flex-col h-full">
      <div className="p-4 border-b border-slate-700 flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-xl font-semibold text-slate-100">2. Prompt Generado</h2>
        {state === AppState.SUCCESS && prompt && (
          <div className="flex gap-2">
             <button
              onClick={onEnhance}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
              title="Mejorar este prompt con IA"
            >
              <SparkleIcon className="w-4 h-4" />
              <span>Mejorar</span>
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-slate-700 hover:bg-slate-600 text-slate-300 px-3 py-1.5 rounded-md text-sm transition-colors"
              title={copied ? 'Copiado' : 'Copiar'}
            >
              {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-cyan-700 hover:bg-cyan-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
              title="Guardar Prompt"
            >
              <SaveIcon className="w-4 h-4" />
              <span>Guardar</span>
            </button>
          </div>
        )}
      </div>
      <div className="p-6 flex-grow overflow-y-auto min-h-[250px] sm:min-h-[300px]">
        {renderContent()}
      </div>
      <div 
        role="alert"
        aria-live="polite"
        className={`absolute top-16 right-4 flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg transition-all duration-300 ease-in-out transform ${
          saved ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
        }`}
      >
        <CheckIcon className="w-5 h-5" />
        <span className="font-semibold text-sm">Prompt guardado</span>
      </div>
    </div>
  );
};