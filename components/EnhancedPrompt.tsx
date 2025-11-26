
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

const MagicIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-3.483 0l-1.263 1.263a3 3 0 0 0 3.483 4.924l6.364-6.364a3 3 0 0 0-4.924-3.483l-1.263-1.263a3 3 0 0 0-3.483 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.364 6.364a3 3 0 0 0-4.924 3.483l1.263 1.263a3 3 0 0 0 3.483 0l1.263-1.263a3 3 0 0 0 0-4.924l-1.263-1.263z" />
    </svg>
);

const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M12 9.75v10.5m0 0L7.5 15.75M12 20.25l4.5-4.5M12 3v5.75" />
    </svg>
);

const ShareIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Zm0-12.814a2.25 2.25 0 1 0 3.933-2.185 2.25 2.25 0 0 0-3.933 2.185Z" />
  </svg>
);

interface EnhancedPromptProps {
  prompt: string | null;
  state: AppState;
  error: string | null;
  onSave: () => void;
  onShare: () => string;
}

export const EnhancedPrompt: React.FC<EnhancedPromptProps> = ({ prompt, state, error, onSave, onShare }) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [shared, setShared] = useState(false);

  useEffect(() => {
    if (state !== AppState.SUCCESS) {
      setCopied(false);
      setSaved(false);
      setShared(false);
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

  const handleShare = () => {
      const url = onShare();
      navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
  };

  const handleDownload = () => {
    if (!prompt) return;
    const blob = new Blob([prompt], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'enhanced-prompt.md';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const renderContent = () => {
    switch (state) {
      case AppState.LOADING:
        return (
          <div className="flex flex-col items-center justify-center h-full text-slate-400">
            <Loader />
            <p className="mt-4 text-sm">Mejorando con IA...</p>
          </div>
        );
      case AppState.ERROR:
        return (
          <div className="flex flex-col items-center justify-center h-full text-red-400">
            <p className="font-semibold">Error al mejorar</p>
            <p className="text-sm text-center mt-2">{error}</p>
          </div>
        );
      case AppState.SUCCESS:
        if (!prompt) return null;
        return (
          <pre className="whitespace-pre-wrap break-words font-sans text-sm text-lime-50/90">
            <code>{prompt}</code>
          </pre>
        );
      case AppState.IDLE:
      default:
        return null;
    }
  };

  return (
    <div className="relative bg-slate-900/60 border border-lime-500/30 rounded-xl shadow-[0_0_30px_rgba(132,204,22,0.15)] backdrop-blur-sm flex flex-col h-full">
      <div className="p-4 border-b border-lime-500/20 flex justify-between items-center flex-wrap gap-2">
        <h2 className="text-xl font-semibold text-lime-300 drop-shadow-[0_0_8px_rgba(132,204,22,0.6)] flex items-center gap-2">
            <MagicIcon className="w-5 h-5 text-lime-300"/>
            4. Prompt Mejorado por IA
        </h2>
        {state === AppState.SUCCESS && prompt && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md text-sm transition-colors border border-slate-600"
              title={copied ? 'Copiado' : 'Copiar'}
            >
              {copied ? <CheckIcon className="w-4 h-4 text-green-400" /> : <ClipboardIcon className="w-4 h-4" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
            <button
                onClick={handleDownload}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md text-sm transition-colors border border-slate-600"
                title="Descargar .md"
            >
                <DownloadIcon className="w-4 h-4" />
                <span>Descargar</span>
            </button>
            <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-md text-sm transition-colors border border-slate-600"
                title="Copiar Enlace para Compartir"
            >
                {shared ? <CheckIcon className="w-4 h-4 text-cyan-400" /> : <ShareIcon className="w-4 h-4" />}
                <span>{shared ? 'Enlace Copiado' : 'Compartir'}</span>
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-cyan-700 hover:bg-cyan-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors shadow-[0_0_10px_rgba(6,182,212,0.3)]"
              title="Guardar Prompt Mejorado"
            >
              <SaveIcon className="w-4 h-4" />
              <span>Guardar</span>
            </button>
          </div>
        )}
      </div>
      <div className="p-6 flex-grow overflow-y-auto min-h-[150px] sm:min-h-[200px]">
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
