
import React, { useState, useCallback, useEffect } from 'react';
import { PromptInputForm } from './components/PromptInputForm';
import { PromptOutput } from './components/PromptOutput';
import { EnhancedPrompt } from './components/EnhancedPrompt';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { HistoryPanel } from './components/HistoryPanel';
import { constructPrompt, enhancePrompt } from './services/geminiService';
import { AppState } from './types';
import type { PromptOptions, HistoryItem, TabType } from './types';
import { getInitialOptions } from './utils/optionsHelper';
import { useSpeechRecognition } from './hooks/useSpeechRecognition';
import { generateShareUrl, parseShareUrl } from './utils/urlHelper';

const SAVED_PROMPTS_KEY = 'perfectPromptSaved_v2'; 

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

// Helper para generar etiquetas automáticas basadas en las opciones
const generateTags = (options: PromptOptions): string[] => {
    const tags: string[] = [options.type];
    if (options.type === 'Text') {
        if (options.tono) tags.push(options.tono);
        if (options.formato) tags.push(options.formato);
    } else if (options.type === 'Image') {
        if (options.estilo) tags.push(options.estilo);
    } else if (options.type === 'Code') {
        if (options.lenguaje) tags.push(options.lenguaje);
    }
    return tags.filter(t => t && t.trim() !== '');
};

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('Text');
  const [generatedPrompt, setGeneratedPrompt] = useState<string | null>(null);
  const [options, setOptions] = useState<PromptOptions>(getInitialOptions('Text'));
  const [savedPrompts, setSavedPrompts] = useState<HistoryItem[]>([]);
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string>('gemini-2.5-flash');

  // State for enhanced prompt
  const [enhancedPrompt, setEnhancedPrompt] = useState<string | null>(null);
  const [enhanceState, setEnhanceState] = useState<AppState>(AppState.IDLE);
  const [enhanceError, setEnhanceError] = useState<string | null>(null);

  // Voice Command Hooks
  const { 
    isListening: isCommandListening, 
    transcript: commandTranscript, 
    startListening: startCommandListening,
    isSupported: isSpeechSupported 
  } = useSpeechRecognition();
  const [lastRecognizedCommand, setLastRecognizedCommand] = useState<string | null>(null);


  useEffect(() => {
    try {
      const storedHistory = localStorage.getItem(SAVED_PROMPTS_KEY);
      if (storedHistory) {
        setSavedPrompts(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Failed to load saved prompts from localStorage", e);
    }
  }, []);

  // Handle Share URL loading on mount
  useEffect(() => {
    const sharedState = parseShareUrl();
    if (sharedState) {
        setActiveTab(sharedState.tab);
        setOptions(sharedState.options);
        setSelectedModel(sharedState.model);
        if (sharedState.generated) {
            setGeneratedPrompt(sharedState.generated);
            setAppState(AppState.SUCCESS);
        }
        if (sharedState.enhanced) {
            setEnhancedPrompt(sharedState.enhanced);
            setEnhanceState(AppState.SUCCESS);
        }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_PROMPTS_KEY, JSON.stringify(savedPrompts));
    } catch (e) {
      console.error("Failed to save prompts to localStorage", e);
    }
  }, [savedPrompts]);

  const resetAppState = useCallback(() => {
    setGeneratedPrompt(null);
    setAppState(AppState.IDLE);
    setError(null);
    setEnhancedPrompt(null);
    setEnhanceState(AppState.IDLE);
    setEnhanceError(null);
  }, []);

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    setOptions(getInitialOptions(tab));
    resetAppState();
  }, [resetAppState]);

  const handleClearForm = useCallback(() => {
    setOptions(getInitialOptions(activeTab));
    resetAppState();
  }, [activeTab, resetAppState]);

  const addPromptToHistory = useCallback((newEntry: HistoryItem) => {
    setSavedPrompts(prev => {
      // Evitar duplicados: Comprobamos si ya existe un prompt con el mismo contenido generado.
      const isDuplicate = prev.some(item => 
        item.generatedPrompt === newEntry.generatedPrompt && 
        item.options.type === newEntry.options.type
      );
      
      if (isDuplicate) {
          return prev;
      }
      const updatedHistory = [newEntry, ...prev];
      return updatedHistory.length > 50 ? updatedHistory.slice(0, 50) : updatedHistory;
    });
  }, []);

  const handleGeneratePrompt = useCallback(async () => {
    resetAppState();
    setAppState(AppState.LOADING);
    
    try {
      const result = await constructPrompt(options, selectedModel);
      setGeneratedPrompt(result);
      setAppState(AppState.SUCCESS);

      // Auto-save to history
      const newEntry: HistoryItem = { 
        id: new Date().toISOString(), 
        options: { ...options },
        generatedPrompt: result,
        isEnhanced: false,
        createdAt: new Date().toLocaleDateString(),
        tags: generateTags(options)
      };
      addPromptToHistory(newEntry);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido.';
      setError(errorMessage);
      setAppState(AppState.ERROR);
    }
  }, [options, selectedModel, resetAppState, addPromptToHistory]);

  const handleEnhancePrompt = useCallback(async () => {
    if (!generatedPrompt) return;

    setEnhanceState(AppState.LOADING);
    setEnhanceError(null);
    setEnhancedPrompt(null);
    
    try {
      const result = await enhancePrompt(generatedPrompt, selectedModel);
      setEnhancedPrompt(result);
      setEnhanceState(AppState.SUCCESS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido.';
      setEnhanceError(errorMessage);
      setEnhanceState(AppState.ERROR);
    }
  }, [generatedPrompt, selectedModel]);

  const handleSavePrompt = useCallback(() => {
    if (!generatedPrompt) return;
    const newEntry: HistoryItem = { 
      id: new Date().toISOString(), 
      options: { ...options },
      generatedPrompt: generatedPrompt,
      isEnhanced: false,
      createdAt: new Date().toLocaleDateString(),
      tags: generateTags(options)
    };
    addPromptToHistory(newEntry);
  }, [generatedPrompt, options, addPromptToHistory]);
  
  const handleSaveEnhancedPrompt = useCallback(() => {
    if (!enhancedPrompt) return;

    const enhancedOptions = { ...options }; 
    if (enhancedOptions.type === 'Text') {
        enhancedOptions.rol = `(Mejorado) ${enhancedOptions.rol}`;
    }

    const newEntry: HistoryItem = {
      id: `${new Date().toISOString()}-enhanced`,
      options: enhancedOptions,
      generatedPrompt: enhancedPrompt,
      isEnhanced: true,
      createdAt: new Date().toLocaleDateString(),
      tags: [...generateTags(options), 'Mejorado']
    };
    addPromptToHistory(newEntry);
  }, [enhancedPrompt, options, addPromptToHistory]);

  const handleGetShareUrl = useCallback(() => {
    const state = {
        tab: activeTab,
        options,
        model: selectedModel,
        generated: generatedPrompt || undefined,
        enhanced: enhancedPrompt || undefined
    };
    return generateShareUrl(state);
  }, [activeTab, options, selectedModel, generatedPrompt, enhancedPrompt]);


  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setActiveTab(item.options.type);
    setOptions(item.options);
    
    if (item.generatedPrompt) {
        setGeneratedPrompt(item.generatedPrompt);
        setAppState(AppState.SUCCESS);
        if (item.isEnhanced) {
            setEnhancedPrompt(item.generatedPrompt);
            setEnhanceState(AppState.SUCCESS);
        } else {
            setEnhancedPrompt(null);
            setEnhanceState(AppState.IDLE);
        }
    } else {
        resetAppState();
    }
    
    window.scrollTo(0, 0);
  }, [resetAppState]);

  const handleClearHistory = useCallback(() => {
    if(window.confirm("¿Estás seguro de que quieres borrar todo el historial?")) {
        setSavedPrompts([]);
    }
  }, []);

  // --- Voice Command Logic ---
  useEffect(() => {
    if (!commandTranscript) return;

    const cmd = commandTranscript.toLowerCase();
    let executed = false;

    // Navigation Commands (Spanish & English support)
    if (cmd.includes('modo texto') || cmd.includes('texto') || cmd.includes('text mode')) {
        handleTabChange('Text');
        setLastRecognizedCommand('Modo Texto');
        executed = true;
    } else if (cmd.includes('modo imagen') || cmd.includes('imagen') || cmd.includes('imágenes') || cmd.includes('image mode')) {
        handleTabChange('Image');
        setLastRecognizedCommand('Modo Imagen');
        executed = true;
    } else if (cmd.includes('modo video') || cmd.includes('vídeo') || cmd.includes('video') || cmd.includes('video mode')) {
        handleTabChange('Video');
        setLastRecognizedCommand('Modo Video');
        executed = true;
    } else if (cmd.includes('modo audio') || cmd.includes('audio') || cmd.includes('sonido') || cmd.includes('audio mode')) {
        handleTabChange('Audio');
        setLastRecognizedCommand('Modo Audio');
        executed = true;
    } else if (cmd.includes('modo código') || cmd.includes('código') || cmd.includes('programación') || cmd.includes('code mode')) {
        handleTabChange('Code');
        setLastRecognizedCommand('Modo Código');
        executed = true;
    } 
    
    // Action Commands (Spanish & English support)
    else if (cmd.includes('generar') || cmd.includes('crear') || cmd.includes('construir') || cmd.includes('generate')) {
        handleGeneratePrompt();
        setLastRecognizedCommand('Generar Prompt');
        executed = true;
    } else if (cmd.includes('limpiar') || cmd.includes('borrar') || cmd.includes('reiniciar') || cmd.includes('clear')) {
        handleClearForm();
        setLastRecognizedCommand('Limpiar Formulario');
        executed = true;
    } else if (cmd.includes('guardar') || cmd.includes('salvar') || cmd.includes('save')) {
        if (enhancedPrompt) {
             handleSaveEnhancedPrompt();
             setLastRecognizedCommand('Guardar Mejorado');
        } else if (generatedPrompt) {
             handleSavePrompt();
             setLastRecognizedCommand('Guardar Prompt');
        }
        executed = true;
    } else if (cmd.includes('mejorar') || cmd.includes('refinar') || cmd.includes('optimizar') || cmd.includes('enhance')) {
        handleEnhancePrompt();
        setLastRecognizedCommand('Mejorar Prompt');
        executed = true;
    }

    if (executed) {
        const timer = setTimeout(() => setLastRecognizedCommand(null), 3000);
        return () => clearTimeout(timer);
    }

  }, [commandTranscript, handleTabChange, handleGeneratePrompt, handleClearForm, handleSavePrompt, handleSaveEnhancedPrompt, handleEnhancePrompt, generatedPrompt, enhancedPrompt]);


  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black">
      <Header 
        isListening={isCommandListening} 
        onVoiceCommandStart={startCommandListening} 
        isSupported={isSpeechSupported}
        lastCommand={lastRecognizedCommand}
      />
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
            <PromptInputForm
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onGenerate={handleGeneratePrompt}
              options={options}
              setOptions={setOptions}
              onClear={handleClearForm}
              selectedModel={selectedModel}
              onModelChange={setSelectedModel}
            />
            <PromptOutput
              prompt={generatedPrompt}
              state={appState}
              error={error}
              onSave={handleSavePrompt}
              onEnhance={handleEnhancePrompt}
              onShare={handleGetShareUrl}
            />
             {enhanceState !== AppState.IDLE && (
              <EnhancedPrompt
                prompt={enhancedPrompt}
                state={enhanceState}
                error={enhanceError}
                onSave={handleSaveEnhancedPrompt}
                onShare={handleGetShareUrl}
              />
            )}
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-800 w-full">
           <HistoryPanel 
              history={savedPrompts}
              onSelect={handleSelectHistory}
              onClear={handleClearHistory}
            />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;
