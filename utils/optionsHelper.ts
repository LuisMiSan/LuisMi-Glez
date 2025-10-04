import type { PromptOptions, TabType } from '../types';

export const getInitialOptions = (tab: TabType): PromptOptions => {
  switch (tab) {
    case 'Text':
      return {
        type: 'Text',
        objetivo: '',
        rol: '',
        contexto: '',
        formato: '',
        tono: '',
      };
    case 'Image':
      return {
        type: 'Image',
        descripcion: '',
        estilo: '',
        composicion: '',
        iluminacion: '',
        extras: '',
      };
    case 'Video':
      return {
        type: 'Video',
        escena: '',
        accion: '',
        estiloVisual: '',
        camara: '',
        extras: '',
      };
    case 'Audio':
      return {
        type: 'Audio',
        tipoSonido: '',
        genero: '',
        atmosfera: '',
        instrumentos: '',
        uso: '',
      };
    case 'Code':
      return {
        type: 'Code',
        lenguaje: '',
        tarea: '',
        requisitos: '',
        ejemplo: '',
        nivel: '',
      };
    default:
        // This should not be reachable if tab is of TabType
        throw new Error(`Invalid tab type: ${tab}`);
  }
};
