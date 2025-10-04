import React from 'react';
import type { HistoryItem, PromptOptions } from '../types';

interface HistoryPanelProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
}

const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 4.811 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

// Helper to get a representative title from any prompt type
const getHistoryItemTitle = (options: PromptOptions): string => {
    switch (options.type) {
        case 'Text': return options.objetivo;
        case 'Image': return options.descripcion;
        case 'Video': return options.escena;
        case 'Audio': return options.tipoSonido;
        case 'Code': return options.tarea;
        default: return 'Prompt sin título';
    }
}

// Helper to get a representative subtitle/details from any prompt type
const getHistoryItemSubtitle = (options: PromptOptions): React.ReactNode => {
     switch (options.type) {
        case 'Text':
            return (
                <>
                    <span className="font-semibold text-cyan-500">{options.type}</span> | Rol: {options.rol || 'N/A'}
                </>
            );
        case 'Image':
             return (
                <>
                    <span className="font-semibold text-cyan-500">{options.type}</span> | Estilo: {options.estilo || 'N/A'}
                </>
            );
        case 'Video':
             return (
                <>
                    <span className="font-semibold text-cyan-500">{options.type}</span> | Estilo: {options.estiloVisual || 'N/A'}
                </>
            );
        case 'Audio':
            return (
                <>
                    <span className="font-semibold text-cyan-500">{options.type}</span> | Género: {options.genero || 'N/A'}
                </>
            );
        case 'Code':
            return (
                <>
                    <span className="font-semibold text-cyan-500">{options.type}</span> | Lenguaje: {options.lenguaje || 'N/A'}
                </>
            );
        default: return null;
    }
}


export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear }) => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-slate-100">3. Tus Prompts Guardados</h2>
        {history.length > 0 && (
            <button
            onClick={onClear}
            className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors duration-200"
            aria-label="Limpiar todo el historial"
            >
            <TrashIcon className="w-4 h-4" />
            <span>Limpiar Todo</span>
            </button>
        )}
      </div>
      <div className="max-h-60 overflow-y-auto bg-slate-900/70 border border-slate-700 rounded-xl p-2 space-y-1 shadow-inner min-h-[100px] flex flex-col">
        {history.length === 0 ? (
            <div className="flex-grow flex items-center justify-center text-sm text-slate-500">
                Aún no has guardado ningún prompt.
            </div>
        ) : (
            history.map((item) => {
                const title = getHistoryItemTitle(item.options);
                const subtitle = getHistoryItemSubtitle(item.options);

                return (
                    <div
                        key={item.id}
                        onClick={() => onSelect(item)}
                        className="p-3 hover:bg-slate-800 rounded-md cursor-pointer transition-colors duration-200"
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onSelect(item)}
                    >
                        <p className="font-medium text-slate-200 truncate" title={title}>
                            {title || 'Prompt sin título'}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 truncate">
                            {subtitle}
                        </p>
                    </div>
                )
            })
        )}
      </div>
    </div>
  );
};