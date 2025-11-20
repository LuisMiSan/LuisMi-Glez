import React from 'react';

interface HeaderProps {
  isListening?: boolean;
  onVoiceCommandStart?: () => void;
  isSupported?: boolean;
  lastCommand?: string | null;
}

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

const MicrophoneIcon: React.FC<{ className?: string, isListening?: boolean }> = ({ className, isListening }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${className} ${isListening ? 'text-red-500 animate-pulse drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'text-slate-300'}`}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 0 1 6 0v8.25a3 3 0 0 1-3 3Z" />
  </svg>
);

const CommandHelp: React.FC = () => (
  <div className="absolute top-full mt-2 right-0 bg-slate-900 border border-cyan-500/30 rounded-lg shadow-[0_0_20px_rgba(8,145,178,0.3)] p-3 text-xs text-slate-300 w-64 z-50 hidden group-hover:block backdrop-blur-xl">
    <p className="font-semibold mb-2 text-cyan-300">Comandos de Voz:</p>
    <ul className="space-y-1 list-disc pl-4">
      <li>"Generar" / "Crear"</li>
      <li>"Mejorar" / "Refinar"</li>
      <li>"Guardar"</li>
      <li>"Limpiar"</li>
      <li>"Modo Texto/Imagen/Video..."</li>
    </ul>
  </div>
);

export const Header: React.FC<HeaderProps> = ({ isListening, onVoiceCommandStart, isSupported, lastCommand }) => {
  return (
    <header className="py-6 border-b border-cyan-900/30 bg-slate-950/80 backdrop-blur-md relative z-10 shadow-[0_0_20px_rgba(8,145,178,0.1)]">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <SparkleIcon className="w-8 h-8 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
          <div>
            <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">
              Perfect Prompt AI
            </h1>
          </div>
        </div>

        {isSupported && (
          <div className="flex items-center gap-4">
             {lastCommand && (
                <span className="hidden md:block text-sm text-emerald-400 font-medium animate-fade-in-out drop-shadow-[0_0_5px_rgba(52,211,153,0.5)]">
                  Comando: {lastCommand}
                </span>
             )}
            <div className="relative group">
              <button
                onClick={onVoiceCommandStart}
                className={`p-3 rounded-full transition-all duration-300 ${
                  isListening 
                    ? 'bg-red-500/20 ring-2 ring-red-500 scale-110 shadow-[0_0_15px_rgba(239,68,68,0.5)]' 
                    : 'bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-cyan-500/50 hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]'
                }`}
                aria-label="Activar comandos de voz"
                title="Comandos de Voz"
              >
                <MicrophoneIcon className="w-6 h-6" isListening={isListening} />
              </button>
              <CommandHelp />
            </div>
          </div>
        )}
      </div>
      <div className="container mx-auto px-4 text-center mt-2">
         <p className="text-md md:text-lg text-slate-400">
            Construye prompts estructurados y de alta calidad para cualquier IA.
        </p>
      </div>
    </header>
  );
};