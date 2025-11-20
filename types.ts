
// Fix: Add AppState enum for managing application state (idle, loading, success, error).
export enum AppState {
  IDLE,
  LOADING,
  SUCCESS,
  ERROR,
}

export type TabType = 'Text' | 'Image' | 'Video' | 'Audio' | 'Code';

export interface TextPromptOptions {
  type: 'Text';
  objetivo: string;
  rol: string;
  contexto: string;
  formato: string;
  tono: string;
  herramienta: string; // New: Search, Maps, Thinking, Standard
}

export interface ImagePromptOptions {
    type: 'Image';
    modo: string; // New: Generar, Editar, Analizar
    descripcion: string;
    estilo: string;
    composicion: string;
    iluminacion: string;
    extras: string;
}

export interface VideoPromptOptions {
    type: 'Video';
    modo: string; // New: Generar (Veo), Analizar
    escena: string;
    accion: string;
    estiloVisual: string;
    camara: string;
    extras: string;
}

export interface AudioPromptOptions {
    type: 'Audio';
    modo: string; // New: Music, TTS, Transcription, Live API
    tipoSonido: string;
    genero: string;
    atmosfera: string;
    instrumentos: string;
    uso: string;
}

export interface CodePromptOptions {
    type: 'Code';
    lenguaje: string;
    tarea: string;
    requisitos: string;
    ejemplo: string;
    nivel: string;
}


export type PromptOptions = 
    | TextPromptOptions 
    | ImagePromptOptions
    | VideoPromptOptions
    | AudioPromptOptions
    | CodePromptOptions;

export interface HistoryItem {
  id: string;
  options: PromptOptions;
  generatedPrompt?: string; // El texto final del prompt
  isEnhanced?: boolean;     // Si ha sido mejorado por IA (Recomendado)
  createdAt?: string;       // Fecha de creación
  tags?: string[];          // Etiquetas autogeneradas
}
