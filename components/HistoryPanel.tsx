
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

const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
    </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm13.36-1.814a.75.75 0 1 0-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 0 0-1.06 1.06l2.25 2.25a.75.75 0 0 0 1.14-.094l3.75-5.25Z" clipRule="evenodd" />
    </svg>
);


// Helper para extraer datos específicos de columnas según el tipo
const getColumnData = (options: PromptOptions) => {
    let objetivo = 'N/A';
    let input = 'N/A';
    let rol = 'N/A';
    let descripcion = 'N/A';

    switch (options.type) {
        case 'Text':
            objetivo = options.objetivo || 'N/A';
            input = options.contexto || 'N/A';
            rol = options.rol || 'N/A';
            descripcion = `${options.formato || ''} ${options.tono || ''}`.trim() || 'Prompt de texto estándar';
            break;
        case 'Image':
            objetivo = 'Generar Imagen';
            input = options.descripcion || 'N/A';
            rol = options.estilo || 'Estilo Libre';
            descripcion = `${options.iluminacion || ''} ${options.composicion || ''}`.trim();
            break;
        case 'Video':
            objetivo = 'Generar Video';
            input = options.escena || 'N/A';
            rol = options.estiloVisual || 'N/A';
            descripcion = `${options.accion || ''} ${options.camara || ''}`.trim();
            break;
        case 'Audio':
            objetivo = 'Generar Audio';
            input = options.tipoSonido || 'N/A';
            rol = options.genero || 'N/A';
            descripcion = `${options.atmosfera || ''} ${options.instrumentos || ''}`.trim();
            break;
        case 'Code':
            objetivo = options.tarea || 'N/A';
            input = options.requisitos || 'N/A';
            rol = options.lenguaje || 'Programador';
            descripcion = options.nivel || 'Código';
            break;
    }
    return { objetivo, input, rol, descripcion };
};

const extractVariables = (text: string | undefined): string => {
    if (!text) return 'N/A';
    const matches = text.match(/\[.*?\]/g);
    return matches ? matches.join(', ') : 'N/A';
};

const getUsageExample = (type: string): string => {
    // Simulamos ejemplos basados en el tipo
    switch (type) {
        case 'Text': return 'Copiar a ChatGPT/Claude';
        case 'Image': return 'Copiar a Midjourney/DALL-E';
        case 'Video': return 'Copiar a Runway/Pika';
        case 'Code': return 'Copiar IDE/Copilot';
        case 'Audio': return 'Copiar a Suno/Udio';
        default: return 'Uso general';
    }
};

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect, onClear }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.5)]">3. Librería de Prompts</h2>
        {history.length > 0 && (
            <button
                onClick={onClear}
                className="flex items-center gap-2 text-sm text-slate-400 hover:text-red-400 transition-colors duration-200 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700"
            >
                <TrashIcon className="w-4 h-4" />
                <span>Limpiar Todo</span>
            </button>
        )}
      </div>

      <div className="w-full overflow-x-auto rounded-xl border border-cyan-500/20 shadow-[0_0_20px_rgba(8,145,178,0.2)] bg-slate-900/80">
        <table className="w-full text-sm text-left text-slate-300">
            <thead className="text-xs uppercase bg-slate-900/90 border-b border-cyan-500/30 text-cyan-300 sticky top-0 shadow-md backdrop-blur-sm">
                <tr>
                    <th scope="col" className="px-4 py-3 font-bold tracking-wider min-w-[100px]">Categoría</th>
                    <th scope="col" className="px-4 py-3 font-bold tracking-wider min-w-[150px]">Nombre Prompt</th>
                    <th scope="col" className="px-4 py-3 font-bold tracking-wider min-w-[200px]">Objetivo/Tarea</th>
                    <th scope="col" className="px-4 py-3 font-bold tracking-wider min-w-[200px]">Input</th>
                    <th scope="col" className="px-4 py-3 font-bold tracking-wider min-w-[150px]">Persona/Rol</th>
                    <th scope="col" className="px-4 py-3 font-bold tracking-wider min-w-[100px]">Recomendado</th>
                    <th scope="col" className="px-4 py-3 font-bold tracking-wider min-w-[200px]">Descripción</th>
                    <th scope="col" className="px-4 py-3 font-bold tracking-wider min-w-[300px]">Prompt</th>
                    <th scope="col" className="px-4 py-3 font-bold tracking-wider min-w-[150px]">Variables</th>
                    <th scope="col" className="px-4 py-3 font-bold tracking-wider min-w-[150px]">Ejemplos de Uso</th>
                    <th scope="col" className="px-4 py-3 font-bold tracking-wider min-w-[150px]">Etiquetas</th>
                    <th scope="col" className="px-4 py-3 font-bold tracking-wider w-[80px]">Acción</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
                {history.length === 0 ? (
                    <tr>
                        <td colSpan={12} className="px-6 py-12 text-center text-slate-500 italic">
                            No hay prompts guardados en la base de datos.
                        </td>
                    </tr>
                ) : (
                    history.map((item) => {
                        const { objetivo, input, rol, descripcion } = getColumnData(item.options);
                        const variables = extractVariables(item.generatedPrompt);
                        const promptPreview = item.generatedPrompt 
                            ? (item.generatedPrompt.substring(0, 80) + (item.generatedPrompt.length > 80 ? '...' : '')) 
                            : 'N/A';
                        
                        // Obtenemos un "Nombre" representativo
                        const promptName = item.options.type === 'Text' ? item.options.objetivo.substring(0, 30) : `${item.options.type} Generation`;

                        return (
                            <tr 
                                key={item.id} 
                                className="hover:bg-cyan-900/20 transition-colors duration-150 group"
                            >
                                <td className="px-4 py-4 font-medium">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold border shadow-sm
                                        ${item.options.type === 'Text' ? 'bg-blue-600/50 text-white border-blue-400' : ''}
                                        ${item.options.type === 'Image' ? 'bg-purple-600/50 text-white border-purple-400' : ''}
                                        ${item.options.type === 'Video' ? 'bg-red-600/50 text-white border-red-400' : ''}
                                        ${item.options.type === 'Audio' ? 'bg-yellow-600/50 text-white border-yellow-400' : ''}
                                        ${item.options.type === 'Code' ? 'bg-green-600/50 text-white border-green-400' : ''}
                                    `}>
                                        {item.options.type}
                                    </span>
                                </td>
                                <td className="px-4 py-4 font-semibold text-white truncate max-w-[150px]" title={promptName}>{promptName}</td>
                                <td className="px-4 py-4 truncate max-w-[200px]" title={objetivo}>{objetivo}</td>
                                <td className="px-4 py-4 truncate max-w-[200px] text-slate-400" title={input}>{input}</td>
                                <td className="px-4 py-4 truncate max-w-[150px]" title={rol}>{rol}</td>
                                <td className="px-4 py-4 text-center">
                                    {item.isEnhanced ? (
                                        <div className="flex justify-center items-center text-lime-400 drop-shadow-[0_0_5px_rgba(132,204,22,0.5)]" title="Mejorado con IA">
                                            <CheckCircleIcon className="w-5 h-5"/> <span className="ml-1 text-xs">Sí</span>
                                        </div>
                                    ) : (
                                        <span className="text-slate-600 text-xs">No</span>
                                    )}
                                </td>
                                <td className="px-4 py-4 truncate max-w-[200px] text-slate-400">{descripcion}</td>
                                <td className="px-4 py-4 max-w-[300px]">
                                    <div className="truncate font-mono text-xs text-cyan-200/80" title={item.generatedPrompt}>
                                        {promptPreview}
                                    </div>
                                </td>
                                <td className="px-4 py-4 text-xs font-mono text-orange-300 truncate max-w-[150px]" title={variables}>{variables}</td>
                                <td className="px-4 py-4 text-slate-400 text-xs">{getUsageExample(item.options.type)}</td>
                                <td className="px-4 py-4">
                                    <div className="flex flex-wrap gap-2 max-w-[200px]">
                                        {item.tags?.map((tag, idx) => (
                                            <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-600 border border-slate-400 text-white text-[11px] font-semibold shadow-sm hover:bg-slate-500 transition-colors">
                                                {tag}
                                            </span>
                                        )) || <span className="text-slate-600">-</span>}
                                    </div>
                                </td>
                                <td className="px-4 py-4">
                                    <button 
                                        onClick={() => onSelect(item)}
                                        className="p-2 rounded-lg bg-cyan-900/30 hover:bg-cyan-600 border border-cyan-700/50 text-cyan-200 transition-colors"
                                        title="Ver y Cargar Prompt"
                                    >
                                        <EyeIcon className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        );
                    })
                )}
            </tbody>
        </table>
      </div>
      <p className="text-xs text-slate-500 text-center mt-2 italic">
        Desliza horizontalmente para ver todas las columnas de la base de datos.
      </p>
    </div>
  );
};
