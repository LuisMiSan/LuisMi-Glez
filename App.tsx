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

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_PROMPTS_KEY, JSON.stringify(savedPrompts));
    } catch (e) {
      console.error("Failed to save prompts to localStorage", e);
    }
  }, [savedPrompts]);

  const resetAppState = () => {
    setGeneratedPrompt(null);
    setAppState(AppState.IDLE);
    setError(null);
    setEnhancedPrompt(null);
    setEnhanceState(AppState.IDLE);
    setEnhanceError(null);
  };

  const handleTabChange = useCallback((tab: TabType) => {
    setActiveTab(tab);
    setOptions(getInitialOptions(tab));
    resetAppState();
  }, []);

  const handleGeneratePrompt = useCallback(async () => {
    resetAppState();
    setAppState(AppState.LOADING);
    
    try {
      const result = await constructPrompt(options, selectedModel);
      setGeneratedPrompt(result);
      setAppState(AppState.SUCCESS);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido.';
      setError(errorMessage);
      setAppState(AppState.ERROR);
    }
  }, [options, selectedModel]);

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


  const addPromptToHistory = (newEntry: HistoryItem) => {
    setSavedPrompts(prev => {
      const isDuplicate = prev.some(item => 
        (item.options.type === 'Text' && newEntry.options.type === 'Text' && item.options.objetivo === newEntry.options.objetivo) ||
        (JSON.stringify(item.options) === JSON.stringify(newEntry.options))
      );
      if (isDuplicate) {
          return prev;
      }
      const updatedHistory = [newEntry, ...prev];
      return updatedHistory.length > 30 ? updatedHistory.slice(0, 30) : updatedHistory;
    });
  };

  const handleSavePrompt = useCallback(() => {
    if (!generatedPrompt) return;
    const newEntry: HistoryItem = { 
      id: new Date().toISOString(), 
      options 
    };
    addPromptToHistory(newEntry);
  }, [generatedPrompt, options]);
  
  const handleSaveEnhancedPrompt = useCallback(() => {
    if (!enhancedPrompt) return;

    // Primero, nos aseguramos de que el prompt original esté guardado.
    // La función addPromptToHistory ya maneja los duplicados.
    const originalEntry: HistoryItem = { 
      id: new Date().toISOString(), 
      options 
    };
    addPromptToHistory(originalEntry);
    
    // Luego, guardamos el prompt mejorado.
    const newEntry: HistoryItem = {
      id: `${new Date().toISOString()}-enhanced`, // Se añade un sufijo para asegurar un ID único
      options: {
        type: 'Text',
        objetivo: enhancedPrompt,
        rol: `Mejorado desde: "${getHistoryItemTitle(options).substring(0, 50)}..."`,
        contexto: '',
        formato: '',
        tono: '',
      }
    };
    addPromptToHistory(newEntry);
  }, [enhancedPrompt, options]);


  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setActiveTab(item.options.type);
    setOptions(item.options);
    resetAppState();
    window.scrollTo(0, 0);
  }, []);

  const handleClearHistory = useCallback(() => {
    setSavedPrompts([]);
  }, []);

  const handleClearForm = useCallback(() => {
    setOptions(getInitialOptions(activeTab));
    resetAppState();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      <Header />
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
            />
             {enhanceState !== AppState.IDLE && (
              <EnhancedPrompt
                prompt={enhancedPrompt}
                state={enhanceState}
                error={enhanceError}
                onSave={handleSaveEnhancedPrompt}
              />
            )}
        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-700/50 max-w-4xl mx-auto w-full">
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
