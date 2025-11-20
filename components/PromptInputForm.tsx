
import React, { useState, useEffect, useRef } from 'react';
import type { PromptOptions, TabType } from '../types';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';


interface PromptInputFormProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onGenerate: () => void;
  options: PromptOptions;
  setOptions: (options: PromptOptions) => void;
  onClear: () => void;
  selectedModel: string;
  onModelChange: (model: string) => void;
}

// --- ICONOS ---
const TextIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.6)]" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 7.5h7.5m-7.5 3H12m-3.75 3h7.5M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0h18" /></svg>;
const TargetIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.6)]" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" /></svg>;
const UserIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.6)]" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" /></svg>;
const InfoIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.6)]" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" /></svg>;
const ImageIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.6)]" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" /></svg>
const VideoIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.6)]" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9A2.25 2.25 0 0 0 2.25 7.5v9A2.25 2.25 0 0 0 4.5 18.75Z" /></svg>
const AudioIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.6)]" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" /></svg>
const CodeIcon: React.FC<{ className?: string }> = ({ className = "w-6 h-6 text-cyan-300 drop-shadow-[0_0_5px_rgba(34,211,238,0.6)]" }) => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 16.5" /></svg>
const MicrophoneIcon: React.FC<{ className?: string, isListening?: boolean }> = ({ className, isListening }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`${className} ${isListening ? 'text-red-500 animate-pulse' : 'text-slate-400 hover:text-white'}`}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 0 0 6-6v-1.5m-6 7.5a6 6 0 0 1-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 0 1-3-3V4.5a3 3 0 0 1 6 0v8.25a3 3 0 0 1-3 3Z" />
    </svg>
);


// --- COMPONENTES REUTILIZABLES ---
const Section: React.FC<{ title: string; description: string; icon: React.ReactNode; children: React.ReactNode; colorClass?: string }> = ({ title, description, icon, children, colorClass = "bg-slate-700 border-slate-500 text-slate-200" }) => (
  <div className="space-y-3 mb-6">
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-1 scale-105">{icon}</div>
      <div>
        <div className={`inline-block px-4 py-1.5 rounded-lg border font-bold text-sm tracking-wide shadow-[0_0_10px_rgba(0,0,0,0.3)] mb-2 ${colorClass}`}>
            {title}
        </div>
        <p className="text-base text-slate-300 font-medium leading-relaxed">{description}</p>
      </div>
    </div>
    {children}
  </div>
);

const VoiceButton: React.FC<{ isListening: boolean; onClick: () => void; isSupported: boolean }> = ({ isListening, onClick, isSupported }) => {
    if (!isSupported) return null;
    return (
        <button
            type="button"
            onClick={onClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors"
            aria-label={isListening ? 'Detener dictado' : 'Iniciar dictado'}
        >
            <MicrophoneIcon className="w-5 h-5" isListening={isListening} />
        </button>
    );
};

const TextAreaField = React.memo<{
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder: string;
  rows?: number;
  isListening?: boolean;
  onVoiceClick?: () => void;
  isSpeechSupported?: boolean;
}>(({ id, value, onChange, placeholder, rows = 3, isListening, onVoiceClick, isSpeechSupported }) => (
    <div className="relative">
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        placeholder={isListening ? 'Escuchando...' : placeholder}
        rows={rows}
        className="w-full bg-slate-950/50 border border-slate-700 rounded-md p-4 pr-10 text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all duration-300"
      />
      {onVoiceClick && <VoiceButton isListening={!!isListening} onClick={onVoiceClick} isSupported={!!isSpeechSupported} />}
    </div>
));

const InputField = React.memo<{
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  isListening?: boolean;
  onVoiceClick?: () => void;
  isSpeechSupported?: boolean;
}>(({ id, label, value, onChange, placeholder, isListening, onVoiceClick, isSpeechSupported }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-bold text-slate-200 mb-2 tracking-wide">
      {label}
    </label>
    <div className="relative">
      <input
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        placeholder={isListening ? 'Escuchando...' : placeholder}
        className="w-full bg-slate-950/50 border border-slate-700 rounded-md shadow-sm py-3 px-4 pr-10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all duration-300"
      />
       {onVoiceClick && <VoiceButton isListening={!!isListening} onClick={onVoiceClick} isSupported={!!isSpeechSupported} />}
    </div>
  </div>
));

const SelectField = React.memo<{
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: readonly string[] | string[];
  placeholder: string;
  labelClassName?: string;
}>(({ id, label, value, onChange, options, placeholder, labelClassName }) => (
  <div className="mb-4">
    <label htmlFor={id} className={labelClassName || "block text-sm font-bold text-slate-200 mb-2 tracking-wide"}>
      {label}
    </label>
    <div className="relative">
      <select
        id={id}
        value={value}
        onChange={onChange}
        className={`w-full bg-slate-950/50 border border-slate-700 rounded-md shadow-sm py-3 px-4 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all duration-300 appearance-none ${!value ? 'text-slate-500' : 'text-white'}`}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-400">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
      </div>
    </div>
  </div>
));

// Custom Reusable Dropdown
interface CustomDropdownProps {
  value: string;
  onChange: (val: string) => void;
  options: readonly string[] | string[];
  label: string;
  labelClassName?: string;
  variant?: 'cyan' | 'indigo';
  placeholder?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ value, onChange, options, label, labelClassName, variant = 'cyan', placeholder = "Selecciona una opción..." }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Theme Configuration
  const theme = {
    cyan: {
        border: isOpen ? 'border-cyan-400 ring-1 ring-cyan-400/50' : 'border-slate-700',
        hoverBorder: 'hover:border-cyan-500/50',
        iconColor: isOpen ? 'text-cyan-400' : 'text-slate-400',
        selectedBg: 'bg-cyan-900/40',
        selectedText: 'text-cyan-300'
    },
    indigo: {
        border: isOpen ? 'border-indigo-500 ring-1 ring-indigo-500/50' : 'border-slate-700',
        hoverBorder: 'hover:border-indigo-500/50',
        iconColor: isOpen ? 'text-indigo-400' : 'text-slate-400',
        selectedBg: 'bg-indigo-900/40',
        selectedText: 'text-indigo-300'
    }
  };

  const currentTheme = theme[variant];

  return (
    <div className="mb-6 relative" ref={containerRef}>
      <label className={labelClassName || "block text-sm font-bold text-slate-200 mb-2 tracking-wide"}>
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between bg-slate-950/50 border ${currentTheme.border} rounded-md shadow-sm py-3 px-4 text-white transition-all duration-300 ${currentTheme.hoverBorder} focus:outline-none`}
      >
        <span className={`truncate ${!value ? 'text-slate-500' : 'text-white'}`}>{value || placeholder}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''} ${currentTheme.iconColor}`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-slate-900 border border-slate-700 rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] max-h-60 overflow-y-auto backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
          {options.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors border-b border-slate-800/50 last:border-0
                ${value === option 
                  ? `${currentTheme.selectedBg} ${currentTheme.selectedText} font-semibold` 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'}
              `}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};


// --- OPCIONES PARA DESPLEGABLES ---

const HERRAMIENTA_TEXT_OPTIONS = [
  'Estándar (Flash/Pro)',
  'Google Search Grounding (Datos Reales)',
  'Google Maps Grounding (Ubicaciones)',
  'Thinking Mode (Razonamiento Complejo)',
  'Chatbot (Conversacional)',
  'Respuesta Rápida (Flash Lite)'
] as const;

const MODO_IMAGE_OPTIONS = [
  'Generar Imagen (Imagen 4)',
  'Editar Imagen (Nano Banana/Flash Image)',
  'Analizar Imagen (Multimodal)',
  'Controlar Aspect Ratio'
] as const;

const MODO_VIDEO_OPTIONS = [
  'Generar Video (Veo 3.1)',
  'Analizar Video (Multimodal)',
  'Extender Video'
] as const;

const MODO_AUDIO_OPTIONS = [
  'Generar Efecto/Música',
  'Texto a Voz (TTS)',
  'Transcripción (Speech to Text)',
  'Live API (Conversación Real-time)'
] as const;

const FORMATO_OPTIONS = [
  'Párrafo', 'Lista con viñetas', 'Lista numerada', 'Tabla', 'JSON', 'XML', 
  'Email', 'Guion de video', 'Artículo de blog', 'Tweet', 'Descripción de producto'
] as const;

const TONO_OPTIONS = [
  'Profesional', 'Amigable', 'Formal', 'Informal', 'Persuasivo', 'Humorístico',
  'Empático', 'Autoritario', 'Inspirador', 'Técnico', 'Crítico', 'Neutro'
] as const;

const ESTILO_ARTISTICO_OPTIONS = [
  'Fotorrealista', 'Cinematográfico', 'Render 3D', 'Anime / Manga', 'Arte Fantástico',
  'Arte Conceptual', 'Pintura al óleo', 'Acuarela', 'Boceto a lápiz', 'Estilo Cómic',
  'Art Déco', 'Cyberpunk', 'Steampunk', 'Vaporwave', 'Minimalista', 'Abstracto',
  'Impresionista', 'Surrealista'
] as const;

const ILUMINACION_OPTIONS = [
  'Luz Cinemática', 'Iluminación Volumétrica', 'Hora Dorada (Atardecer)', 'Hora Azul (Amanecer)',
  'Luz de Estudio', 'Luz Suave', 'Luz Dura / Dramática', 'Contraluz (Backlight)',
  'Iluminación de Neón', 'Luz Tenebrista (Clarooscuro)', 'Luz Natural', 'Iluminación ambiental',
  'Luz de Luna', 'Bajo el agua'
] as const;

const COMPOSICION_OPTIONS = [
  'Regla de los tercios', 'Encuadre simétrico', 'Líneas guía',
  'Primer plano (Close-up)', 'Plano medio (Medium shot)', 'Plano americano', 'Plano general (Wide shot)',
  'Vista cenital (Top-down)', 'Vista de gusano (Worm\'s-eye)', 'Plano holandés (Dutch angle)',
  'Encuadre dentro de un encuadre', 'Espacio negativo'
] as const;

const PARAMETROS_ADICIONALES_OPTIONS = [
    'Relación de aspecto 16:9 (Cinemático)', 'Relación de aspecto 9:16 (Vertical)', 'Relación de aspecto 1:1 (Cuadrado)',
    'Alta resolución (8K)', 'Ultra detallado', 'Fotorrealista',
    'Desenfoque de fondo (Bokeh)', 'Sin texto ni marcas de agua', 'Paleta de colores vibrante',
    'Paleta de colores pastel', 'Blanco y negro', 'Tono sepia'
] as const;

const ACCION_PRINCIPAL_OPTIONS = [
  'Caminando', 'Corriendo', 'Volando', 'Explosión', 'Conversación', 
  'Bailando', 'Conduciendo', 'Luchando', 'Transformación', 'Apareciendo', 
  'Desapareciendo', 'Construyendo'
] as const;

const ESTILO_VISUAL_OPTIONS = [
  'Cinematográfico 8K', 'Estilo Anime (Ghibli)', 'Pixel Art Animado', 'Stop Motion', 
  'Look de Película Vintage', 'Blanco y Negro Noir', 'Documental Realista', 
  'Colores Neón Saturados', 'Ciencia Ficción Distópica', 'Fantasía Épica', 
  'Estilo GoPro', 'Vlog de Viajes'
] as const;

const MOVIMIENTO_CAMARA_OPTIONS = [
  'Plano Estático', 'Travelling (Dolly Shot)', 'Panorámica (Panning)', 'Plano Grúa (Crane Shot)', 
  'Cámara en Mano (Handheld)', 'Plano Secuencia (Long Take)', 'Zoom In Lento', 'Zoom Out Rápido', 
  'Plano Orbital (360°)', 'Plano Subjetivo (POV)', 'Cámara Lenta (Slow Motion)', 'Time-lapse'
] as const;

const GENERO_AUDIO_OPTIONS = [
  'Lofi Hip Hop', 'Rock Épico', 'Orquestal Cinematográfico', 'Ambient Electrónico', 
  'Techno Industrial', 'Jazz Suave', 'Folk Acústico', 'Sonidos de Naturaleza', 
  'Paisaje Sonoro Sci-Fi', 'Música 8-bit (Chiptune)', 'Pop Energético', 'Música Clásica'
] as const;

const ATMOSFERA_AUDIO_OPTIONS = [
  'Relajante / Calmado', 'Tenso / Suspenso', 'Épico / Grandioso', 'Melancólico / Nostálgico', 
  'Alegre / Optimista', 'Misterioso / Inquietante', 'Futurista / Tecnológico', 
  'Mágico / Onírico', 'Oscuro / Siniestro', 'Cómico / Juguetón'
] as const;

const USO_PREVISTO_OPTIONS = [
  'Fondo para vídeo de YouTube', 'Meditación / Relajación', 'Banda sonora de videojuego', 
  'Efecto de sonido (SFX)', 'Intro / Outro de Podcast', 'Tono de llamada', 
  'Música para streaming (Twitch)', 'Presentación corporativa', 'Historia de Instagram/TikTok'
] as const;

const AI_MODELS = [
  'gemini-2.5-flash',
  'gemini-3-pro-preview',
  'imagen-4.0-generate-001',
  'veo-3.1-generate-preview',
  'gpt-4o',
  'claude-3-5-sonnet',
  'midjourney-v6',
  'runway-gen-3'
];


// --- FORMULARIOS POR PESTAÑA ---

const TextFormFields: React.FC<{
    options: PromptOptions,
    handleOptionChange: (field: any, value: string) => void,
    handleVoiceStart: (field: any) => void,
    isListening: boolean,
    voiceTargetField: any,
    isSpeechSupported: boolean,
}> = ({ options, handleOptionChange, handleVoiceStart, isListening, voiceTargetField, isSpeechSupported }) => {
    if (options.type !== 'Text') return null;
    return (
        <>
            <CustomDropdown
                  label="Herramienta / Capacidad Especial"
                  value={options.herramienta}
                  onChange={(val) => handleOptionChange('herramienta', val)}
                  options={HERRAMIENTA_TEXT_OPTIONS}
                  placeholder="Selecciona una capacidad..."
                  variant="indigo"
                  labelClassName="inline-block px-4 py-1.5 rounded-lg border font-bold text-sm tracking-wide shadow-[0_0_10px_rgba(0,0,0,0.3)] mb-2 bg-indigo-900/40 border-indigo-500 text-indigo-300 shadow-indigo-500/20"
            />
            <Section 
              title="Define el Objetivo" 
              description="¿Qué necesitas que haga la IA? Sé específico y claro." 
              icon={<TargetIcon/>}
              colorClass="bg-blue-900/40 border-blue-500 text-blue-300 shadow-blue-500/20"
            >
                <TextAreaField id="objetivo" value={options.objetivo} onChange={(e) => handleOptionChange('objetivo', e.target.value)} placeholder='ej: "Escribe un email de seguimiento para un cliente potencial."' rows={4} isListening={isListening && voiceTargetField === 'objetivo'} onVoiceClick={() => handleVoiceStart('objetivo')} isSpeechSupported={isSpeechSupported} />
            </Section>
            <Section 
              title="Define el Rol de la IA" 
              description="Pídele a la IA que actúe como un experto en un campo determinado." 
              icon={<UserIcon />}
              colorClass="bg-purple-900/40 border-purple-500 text-purple-300 shadow-purple-500/20"
            >
                <TextAreaField id="rol" value={options.rol} onChange={(e) => handleOptionChange('rol', e.target.value)} placeholder='ej: "Actúa como un experto en marketing digital."' rows={3} isListening={isListening && voiceTargetField === 'rol'} onVoiceClick={() => handleVoiceStart('rol')} isSpeechSupported={isSpeechSupported} />
            </Section>
            <Section 
              title="Proporciona Contexto" 
              description="Explica el trasfondo, la audiencia, y por qué lo necesitas." 
              icon={<InfoIcon />}
              colorClass="bg-orange-900/40 border-orange-500 text-orange-300 shadow-orange-500/20"
            >
                <TextAreaField id="contexto" value={options.contexto} onChange={(e) => handleOptionChange('contexto', e.target.value)} placeholder='ej: "El cliente abrió el email inicial pero no respondió."' rows={3} isListening={isListening && voiceTargetField === 'contexto'} onVoiceClick={() => handleVoiceStart('contexto')} isSpeechSupported={isSpeechSupported}/>
            </Section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <SelectField
                  id="formato"
                  label="Formato (Opcional)"
                  value={options.formato}
                  onChange={(e) => handleOptionChange('formato', e.target.value)}
                  options={FORMATO_OPTIONS}
                  placeholder="Selecciona un formato..."
                  labelClassName="inline-block px-4 py-1.5 rounded-lg border font-bold text-sm tracking-wide shadow-[0_0_10px_rgba(0,0,0,0.3)] mb-2 bg-teal-900/40 border-teal-500 text-teal-300 shadow-teal-500/20"
                />
                <SelectField
                  id="tono"
                  label="Tono (Opcional)"
                  value={options.tono}
                  onChange={(e) => handleOptionChange('tono', e.target.value)}
                  options={TONO_OPTIONS}
                  placeholder="Selecciona un tono..."
                  labelClassName="inline-block px-4 py-1.5 rounded-lg border font-bold text-sm tracking-wide shadow-[0_0_10px_rgba(0,0,0,0.3)] mb-2 bg-rose-900/40 border-rose-500 text-rose-300 shadow-rose-500/20"
                />
            </div>
        </>
    );
};

const ImageFormFields: React.FC<{
    options: PromptOptions,
    handleOptionChange: (field: any, value: string) => void,
    handleVoiceStart: (field: any) => void,
    isListening: boolean,
    voiceTargetField: any,
    isSpeechSupported: boolean,
}> = ({ options, handleOptionChange, handleVoiceStart, isListening, voiceTargetField, isSpeechSupported }) => {
    if (options.type !== 'Image') return null;
    return (
         <>
            <SelectField
                id="modo"
                label="Modo de Imagen / Tarea"
                value={options.modo}
                onChange={(e) => handleOptionChange('modo', e.target.value)}
                options={MODO_IMAGE_OPTIONS}
                placeholder="Selecciona una tarea..."
                labelClassName="inline-block px-4 py-1.5 rounded-lg border font-bold text-sm tracking-wide shadow-[0_0_10px_rgba(0,0,0,0.3)] mb-2 bg-fuchsia-900/40 border-fuchsia-500 text-fuchsia-300 shadow-fuchsia-500/20"
            />
            <Section 
              title="Descripción / Instrucción" 
              description="Describe la imagen a generar, o la edición que deseas realizar." 
              icon={<ImageIcon/>}
              colorClass="bg-pink-900/40 border-pink-500 text-pink-300 shadow-pink-500/20"
            >
                <TextAreaField id="descripcion" value={options.descripcion} onChange={(e) => handleOptionChange('descripcion', e.target.value)} placeholder='ej: "Un astronauta montando un caballo en Marte" o "Añade gafas de sol al gato".' rows={4} isListening={isListening && voiceTargetField === 'descripcion'} onVoiceClick={() => handleVoiceStart('descripcion')} isSpeechSupported={isSpeechSupported}/>
            </Section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  id="estilo"
                  label="Estilo Artístico"
                  value={options.estilo}
                  onChange={(e) => handleOptionChange('estilo', e.target.value)}
                  options={ESTILO_ARTISTICO_OPTIONS}
                  placeholder="Selecciona un estilo..."
                />
                <SelectField
                  id="iluminacion"
                  label="Iluminación"
                  value={options.iluminacion}
                  onChange={(e) => handleOptionChange('iluminacion', e.target.value)}
                  options={ILUMINACION_OPTIONS}
                  placeholder="Selecciona una iluminación..."
                />
            </div>
             <SelectField
                id="composicion"
                label="Composición y Encuadre"
                value={options.composicion}
                onChange={(e) => handleOptionChange('composicion', e.target.value)}
                options={COMPOSICION_OPTIONS}
                placeholder="Selecciona una composición..."
             />
             <SelectField
                id="extras"
                label="Parámetros Adicionales"
                value={options.extras}
                onChange={(e) => handleOptionChange('extras', e.target.value)}
                options={PARAMETROS_ADICIONALES_OPTIONS}
                placeholder="Selecciona un parámetro..."
             />
        </>
    )
};

const VideoFormFields: React.FC<{
    options: PromptOptions,
    handleOptionChange: (field: any, value: string) => void,
    handleVoiceStart: (field: any) => void,
    isListening: boolean,
    voiceTargetField: any,
    isSpeechSupported: boolean,
}> = ({ options, handleOptionChange, handleVoiceStart, isListening, voiceTargetField, isSpeechSupported }) => {
    if (options.type !== 'Video') return null;
    return (
        <div className="space-y-4">
            <SelectField
                id="modo"
                label="Modo de Video"
                value={options.modo}
                onChange={(e) => handleOptionChange('modo', e.target.value)}
                options={MODO_VIDEO_OPTIONS}
                placeholder="Selecciona un modo..."
                labelClassName="inline-block px-4 py-1.5 rounded-lg border font-bold text-sm tracking-wide shadow-[0_0_10px_rgba(0,0,0,0.3)] mb-2 bg-red-900/40 border-red-500 text-red-300 shadow-red-500/20"
            />
            <Section 
              title="Escena Principal" 
              description="Describe la escena general, el entorno y el sujeto principal del video." 
              icon={<VideoIcon/>}
              colorClass="bg-red-900/40 border-red-500 text-red-300 shadow-red-500/20"
            >
                <TextAreaField id="escena" value={options.escena} onChange={(e) => handleOptionChange('escena', e.target.value)} placeholder='ej: "Un dron vuela sobre una ciudad futurista por la noche."' rows={4} isListening={isListening && voiceTargetField === 'escena'} onVoiceClick={() => handleVoiceStart('escena')} isSpeechSupported={isSpeechSupported}/>
            </Section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <SelectField id="accion" label="Acción Principal" value={options.accion} onChange={(e) => handleOptionChange('accion', e.target.value)} options={ACCION_PRINCIPAL_OPTIONS} placeholder="Selecciona una acción..." />
                 <SelectField id="estiloVisual" label="Estilo Visual" value={options.estiloVisual} onChange={(e) => handleOptionChange('estiloVisual', e.target.value)} options={ESTILO_VISUAL_OPTIONS} placeholder="Selecciona un estilo..." />
            </div>
            <SelectField id="camara" label="Movimiento de Cámara" value={options.camara} onChange={(e) => handleOptionChange('camara', e.target.value)} options={MOVIMIENTO_CAMARA_OPTIONS} placeholder="Selecciona un movimiento..." />
            <InputField id="extras" label="Detalles Adicionales" value={options.extras} onChange={(e) => handleOptionChange('extras', e.target.value)} placeholder="Ej: duración 15s, bucle perfecto" isListening={isListening && voiceTargetField === 'extras'} onVoiceClick={() => handleVoiceStart('extras')} isSpeechSupported={isSpeechSupported}/>
        </div>
    )
};

const AudioFormFields: React.FC<{
    options: PromptOptions,
    handleOptionChange: (field: any, value: string) => void,
    handleVoiceStart: (field: any) => void,
    isListening: boolean,
    voiceTargetField: any,
    isSpeechSupported: boolean,
}> = ({ options, handleOptionChange, handleVoiceStart, isListening, voiceTargetField, isSpeechSupported }) => {
    if (options.type !== 'Audio') return null;
    return (
        <div className="space-y-4">
             <SelectField
                id="modo"
                label="Modo de Audio"
                value={options.modo}
                onChange={(e) => handleOptionChange('modo', e.target.value)}
                options={MODO_AUDIO_OPTIONS}
                placeholder="Selecciona un modo..."
                labelClassName="inline-block px-4 py-1.5 rounded-lg border font-bold text-sm tracking-wide shadow-[0_0_10px_rgba(0,0,0,0.3)] mb-2 bg-yellow-900/40 border-yellow-500 text-yellow-300 shadow-yellow-500/20"
            />
            <Section 
              title="Tipo de Sonido/Música" 
              description="Describe el sonido principal que quieres generar." 
              icon={<AudioIcon/>}
              colorClass="bg-yellow-900/40 border-yellow-500 text-yellow-300 shadow-yellow-500/20"
            >
                <TextAreaField id="tipoSonido" value={options.tipoSonido} onChange={(e) => handleOptionChange('tipoSonido', e.target.value)} placeholder='ej: "Una pista de música lofi hip hop para estudiar."' rows={3} isListening={isListening && voiceTargetField === 'tipoSonido'} onVoiceClick={() => handleVoiceStart('tipoSonido')} isSpeechSupported={isSpeechSupported} />
            </Section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField id="genero" label="Género/Estilo" value={options.genero} onChange={(e) => handleOptionChange('genero', e.target.value)} options={GENERO_AUDIO_OPTIONS} placeholder="Selecciona un género..." />
                <SelectField id="atmosfera" label="Emoción y Atmósfera" value={options.atmosfera} onChange={(e) => handleOptionChange('atmosfera', e.target.value)} options={ATMOSFERA_AUDIO_OPTIONS} placeholder="Selecciona una atmósfera..." />
            </div>
            <InputField id="instrumentos" label="Instrumentos/Voces/Efectos" value={options.instrumentos} onChange={(e) => handleOptionChange('instrumentos', e.target.value)} placeholder="Ej: piano, sintetizador, voz femenina" isListening={isListening && voiceTargetField === 'instrumentos'} onVoiceClick={() => handleVoiceStart('instrumentos')} isSpeechSupported={isSpeechSupported} />
            <SelectField id="uso" label="Uso Previsto" value={options.uso} onChange={(e) => handleOptionChange('uso', e.target.value)} options={USO_PREVISTO_OPTIONS} placeholder="Selecciona un uso..." />
        </div>
    );
};

const CodeFormFields: React.FC<{
    options: PromptOptions,
    handleOptionChange: (field: any, value: string) => void,
    handleVoiceStart: (field: any) => void,
    isListening: boolean,
    voiceTargetField: any,
    isSpeechSupported: boolean,
}> = ({ options, handleOptionChange, handleVoiceStart, isListening, voiceTargetField, isSpeechSupported }) => {
    if (options.type !== 'Code') return null;
    return (
        <>
            <Section 
              title="Tarea a Realizar" 
              description="Describe la función, clase o script que necesitas." 
              icon={<CodeIcon/>}
              colorClass="bg-emerald-900/40 border-emerald-500 text-emerald-300 shadow-emerald-500/20"
            >
                <TextAreaField id="tarea" value={options.tarea} onChange={(e) => handleOptionChange('tarea', e.target.value)} placeholder='ej: "Crear una función en Python para ordenar una lista de diccionarios."' rows={4} isListening={isListening && voiceTargetField === 'tarea'} onVoiceClick={() => handleVoiceStart('tarea')} isSpeechSupported={isSpeechSupported} />
            </Section>
            <InputField id="lenguaje" label="Lenguaje de Programación" value={options.lenguaje} onChange={(e) => handleOptionChange('lenguaje', e.target.value)} placeholder="Ej: Python, JavaScript, C++" isListening={isListening && voiceTargetField === 'lenguaje'} onVoiceClick={() => handleVoiceStart('lenguaje')} isSpeechSupported={isSpeechSupported} />
            <Section 
              title="Requisitos y Restricciones" 
              description="Especifica las reglas que debe seguir el código (librerías, rendimiento, etc.)." 
              icon={<InfoIcon />}
              colorClass="bg-indigo-900/40 border-indigo-500 text-indigo-300 shadow-indigo-500/20"
            >
                <TextAreaField id="requisitos" value={options.requisitos} onChange={(e) => handleOptionChange('requisitos', e.target.value)} placeholder='ej: "No usar librerías externas. Debe ser eficiente con listas grandes."' rows={3} isListening={isListening && voiceTargetField === 'requisitos'} onVoiceClick={() => handleVoiceStart('requisitos')} isSpeechSupported={isSpeechSupported} />
            </Section>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputField id="ejemplo" label="Ejemplo de Entrada/Salida (Opcional)" value={options.ejemplo} onChange={(e) => handleOptionChange('ejemplo', e.target.value)} placeholder="Entrada: [...] Salida: [...]" isListening={isListening && voiceTargetField === 'ejemplo'} onVoiceClick={() => handleVoiceStart('ejemplo')} isSpeechSupported={isSpeechSupported} />
                <InputField id="nivel" label="Nivel de Código Deseado (Opcional)" value={options.nivel} onChange={(e) => handleOptionChange('nivel', e.target.value)} placeholder="Ej: Principiante, Experto" isListening={isListening && voiceTargetField === 'nivel'} onVoiceClick={() => handleVoiceStart('nivel')} isSpeechSupported={isSpeechSupported} />
            </div>
        </>
    );
};


export const PromptInputForm: React.FC<PromptInputFormProps> = ({ activeTab, onTabChange, onGenerate, options, setOptions, onClear, selectedModel, onModelChange }) => {
  const [voiceTargetField, setVoiceTargetField] = useState<string | null>(null);
  const { isListening, transcript, startListening, isSupported } = useSpeechRecognition();
  
  const handleOptionChange = (field: string, value: string) => {
    setOptions({ ...options, [field]: value });
  };

  const handleVoiceStart = (field: string) => {
    if (isListening) return;
    setVoiceTargetField(field);
    startListening();
  };

  useEffect(() => {
    if (transcript && voiceTargetField) {
        const target = voiceTargetField;
        const currentValue = (options as any)[target] as string | undefined;
        
        const newValue = currentValue ? `${currentValue} ${transcript}` : transcript;
        
        handleOptionChange(target, newValue);
        setVoiceTargetField(null);
    }
  }, [transcript, voiceTargetField, handleOptionChange, options]);


  const tabs: { name: TabType; icon: React.ReactElement }[] = [
    { name: 'Text', icon: <TextIcon /> },
    { name: 'Image', icon: <ImageIcon /> },
    { name: 'Video', icon: <VideoIcon /> },
    { name: 'Audio', icon: <AudioIcon /> },
    { name: 'Code', icon: <CodeIcon /> },
  ];
  
  const formProps = {
    options,
    handleOptionChange,
    handleVoiceStart,
    isListening,
    voiceTargetField,
    isSpeechSupported: isSupported,
  };


  return (
    <div className="bg-slate-900/60 border border-cyan-500/30 rounded-xl p-6 md:p-8 shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <button className="text-sm font-bold text-white px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 border border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] tracking-wide">
            1. Construye tu prompt
        </button>
      </div>
      
      <CustomDropdown
        value={selectedModel}
        onChange={onModelChange}
        options={AI_MODELS}
        label="Elige tu modelo de IA preferido"
        variant="cyan"
      />

      <div className="mb-6">
        <div className="flex border-b border-slate-700 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.name}
              onClick={() => onTabChange(tab.name)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none whitespace-nowrap ${
                activeTab === tab.name
                  ? 'border-b-2 border-cyan-400 text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                  : 'text-slate-400 hover:text-cyan-200'
              }`}
            >
              {React.cloneElement(tab.icon, { className: 'w-5 h-5' })}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {activeTab === 'Text' && <TextFormFields {...formProps} />}
        {activeTab === 'Image' && <ImageFormFields {...formProps} />}
        {activeTab === 'Video' && <VideoFormFields {...formProps} />}
        {activeTab === 'Audio' && <AudioFormFields {...formProps} />}
        {activeTab === 'Code' && <CodeFormFields {...formProps} />}
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={onGenerate}
          className="w-full sm:w-auto flex-grow bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold py-3 px-6 rounded-lg shadow-[0_0_20px_rgba(6,182,212,0.4)] border border-cyan-400/20 transition-transform transform hover:scale-105 duration-300 ease-in-out"
        >
          Generar Prompt
        </button>
        <button
          onClick={onClear}
          className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold py-3 px-6 rounded-lg border border-slate-700 hover:border-pink-500 hover:text-pink-400 hover:shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-colors duration-200"
        >
          Limpiar Formulario
        </button>
      </div>
    </div>
  );
};
