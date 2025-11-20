
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
        herramienta: 'Estándar (Flash/Pro)',
      };
    case 'Image':
      return {
        type: 'Image',
        modo: 'Generar Imagen (Imagen 4)',
        descripcion: '',
        estilo: '',
        composicion: '',
        iluminacion: '',
        extras: '',
      };
    case 'Video':
      return {
        type: 'Video',
        modo: 'Generar Video (Veo)',
        escena: '',
        accion: '',
        estiloVisual: '',
        camara: '',
        extras: '',
      };
    case 'Audio':
      return {
        type: 'Audio',
        modo: 'Generar Efecto/Música',
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
