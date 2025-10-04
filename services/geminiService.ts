import { GoogleGenAI } from '@google/genai';
import type { PromptOptions } from '../types';

/**
 * Procesa un error de la API de Gemini y lo convierte en un mensaje descriptivo para el usuario.
 * @param error El error capturado.
 * @param context El contexto de la operación ('generar' o 'mejorar').
 * @returns Un objeto Error con un mensaje amigable para el usuario.
 */
function handleGeminiError(error: unknown, context: 'generar' | 'mejorar'): Error {
    console.error(`Error calling Gemini API to ${context} prompt:`, error);

    let userFriendlyMessage = `No se pudo conectar con el servicio de IA para ${context} el prompt. Inténtalo de nuevo más tarde.`;

    if (error instanceof Error) {
        const message = error.message.toLowerCase();
        
        if (message.includes('api key not valid')) {
            userFriendlyMessage = 'La clave API proporcionada no es válida. Por favor, asegúrate de que esté configurada correctamente.';
        } else if (message.includes('safety')) {
            userFriendlyMessage = 'Tu petición fue bloqueada por las políticas de seguridad del modelo. Por favor, reformula tu prompt.';
        } else if (message.includes('quota')) {
            userFriendlyMessage = 'Se ha excedido la cuota de la API. Revisa tu plan de facturación de Google AI.';
        } else if (message.includes('billing')) {
            userFriendlyMessage = 'Hay un problema con la facturación de tu cuenta de Google AI. Por favor, verifica que esté activa.';
        } else if (message.includes('resource exhausted')) {
             userFriendlyMessage = 'El servicio de IA está sobrecargado. Por favor, espera un momento y vuelve a intentarlo.';
        } else {
            // Para otros errores específicos, mostramos el mensaje original para dar más contexto.
            userFriendlyMessage = `El servicio de IA devolvió un error: ${error.message}`;
        }
    } else {
        // Fallback para objetos que no son de tipo Error.
        userFriendlyMessage = 'Ocurrió un error inesperado al comunicarse con el servicio de IA.';
    }

    return new Error(userFriendlyMessage);
}


function getPromptTitle(options: PromptOptions): string {
    switch (options.type) {
        case 'Text': return options.objetivo;
        case 'Image': return options.descripcion;
        case 'Video': return options.escena;
        case 'Audio': return options.tipoSonido;
        case 'Code': return options.tarea;
    }
}

function buildSection(title: string, content: string | undefined | null): string {
    return content && content.trim() ? `\n## ${title.toUpperCase()}\n${content.trim()}\n` : '';
}

function formatOptionsToString(options: PromptOptions): string {
  const mainGoal = getPromptTitle(options);
  if (!mainGoal || !mainGoal.trim()) {
      throw new Error('El campo principal de la pestaña actual no puede estar vacío.');
  }
  
  let structuredInput = `# TIPO DE PROMPT: ${options.type.toUpperCase()}\n\n# DATOS ESTRUCTURADOS DEL USUARIO:\n`;

  switch (options.type) {
    case 'Text':
      structuredInput += buildSection('Objetivo Principal', options.objetivo);
      structuredInput += buildSection('Rol de la IA', options.rol);
      structuredInput += buildSection('Contexto', options.contexto);
      structuredInput += buildSection('Formato de Salida', options.formato);
      structuredInput += buildSection('Tono', options.tono);
      break;
    case 'Image':
      structuredInput += buildSection('Descripción Principal', options.descripcion);
      structuredInput += buildSection('Estilo Artístico', options.estilo);
      structuredInput += buildSection('Composición y Encuadre', options.composicion);
      structuredInput += buildSection('Iluminación', options.iluminacion);
      structuredInput += buildSection('Parámetros Adicionales', options.extras);
      break;
    case 'Video':
        structuredInput += buildSection('Escena Principal', options.escena);
        structuredInput += buildSection('Acción Principal', options.accion);
        structuredInput += buildSection('Estilo Visual', options.estiloVisual);
        structuredInput += buildSection('Movimiento de Cámara', options.camara);
        structuredInput += buildSection('Detalles Adicionales', options.extras);
        break;
    case 'Audio':
        structuredInput += buildSection('Tipo de Sonido/Música', options.tipoSonido);
        structuredInput += buildSection('Género/Estilo', options.genero);
        structuredInput += buildSection('Emoción y Atmósfera', options.atmosfera);
        structuredInput += buildSection('Instrumentos/Voces/Efectos', options.instrumentos);
        structuredInput += buildSection('Uso Previsto', options.uso);
        break;
    case 'Code':
        structuredInput += buildSection('Lenguaje de Programación', options.lenguaje);
        structuredInput += buildSection('Tarea a Realizar', options.tarea);
        structuredInput += buildSection('Requisitos y Restricciones', options.requisitos);
        structuredInput += buildSection('Ejemplo de Entrada/Salida', options.ejemplo);
        structuredInput += buildSection('Nivel de Código Deseado', options.nivel);
        break;
    default:
      throw new Error('Tipo de prompt no soportado');
  }

  return structuredInput.trim();
}

export async function constructPrompt(options: PromptOptions, model: string): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not configured.");
  }
  if (model !== 'gemini-2.5-flash') {
    throw new Error(`El modelo "${model}" no está implementado todavía. Por favor, selecciona 'gemini-2.5-flash'.`);
  }
  
  const userInput = formatOptionsToString(options);

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `
      Actúa como un ingeniero de prompts de clase mundial, un verdadero maestro en el arte de comunicarte con modelos de IA generativa. Tu misión es transformar los datos estructurados que te proporciona el usuario en una obra maestra de la ingeniería de prompts. El resultado debe ser un prompt completo, significativamente extenso, detallado, matizado y potente.

      **Proceso de Pensamiento (Sigue estos pasos internamente):**
      1.  **Análisis:** Analiza los datos de entrada del usuario para identificar el tipo de IA (Texto, Imagen, Video, Audio, Código), la intención central y los elementos clave.
      2.  **Expansión Creativa y Técnica:** Basándote en la entrada, expande cada sección. No te limites a repetir la información. Añade detalles creativos y técnicos que enriquezcan la petición. Piensa en qué elementos faltan para que el resultado sea 10 veces mejor.
      3.  **Construcción Experta:** Ensambla un nuevo prompt, mucho más rico y estructurado, utilizando la información expandida.

      **Reglas para el Prompt Generado (Tu Salida Final):**
      1.  **Amplifica la Intención Original:** Respeta y profundiza en el objetivo del usuario. No lo cambies, mejóralo.
      2.  **Añade Profundidad y Detalle:**
          *   **Contexto Ampliado:** Proporciona un trasfondo rico y detallado. Si es una historia, crea un mundo. Si es código, define el caso de uso.
          *   **Especificaciones Técnicas:** Incorpora parámetros relevantes para el tipo de IA. Para imágenes/videos, incluye detalles sobre composición, ángulo de cámara, tipo de lente, iluminación (ej: "iluminación volumétrica cinematográfica"), estilo artístico específico (ej: "al estilo de Syd Mead con toques de Art Déco"), y parámetros como --ar 16:9, 8K, fotorrealista. Para código, añade consideraciones sobre eficiencia, escalabilidad y casos límite.
          *   **Estilo y Tono Detallados:** Sé ultra-específico. En lugar de "amigable", usa "amigable, pero con un tono de autoridad y confianza, usando un lenguaje claro y accesible para un principiante".
          *   **Añade Restricciones y "Negative Prompts":** Si es apropiado, especifica qué NO hacer. Ej: "Evita clichés", "No usar colores pastel", --no text, blurry background.
      3.  **Síntesis Cohesiva:** Tu tarea más importante es sintetizar toda la información expandida (rol, contexto, objetivo, formato, tono, etc.) en un único prompt coherente y fluido. El resultado final debe ser un texto listo para usar, no una lista de secciones. Integra todos los elementos de forma natural.
      4.  **Extensión Significativa:** El prompt resultante debe ser un texto completo y bien desarrollado.
      5.  **Salida Directa y Pura:** Tu respuesta debe ser ÚNICA Y EXCLUSIVAMENTE el texto del prompt final sintetizado. NO incluyas los encabezados de las secciones (como ## OBJETIVO, ## CONTEXTO), introducciones, explicaciones, ni notas. Solo el prompt final.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: userInput,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.8,
      },
    });

    return response.text.trim();
  } catch (error) {
    throw handleGeminiError(error, 'generar');
  }
}

export async function enhancePrompt(existingPrompt: string, model: string): Promise<string> {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY is not configured.");
  }
  if (model !== 'gemini-2.5-flash') {
    throw new Error(`El modelo "${model}" no está implementado todavía. Por favor, selecciona 'gemini-2.5-flash'.`);
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const systemInstruction = `
      Eres un refinador de prompts de IA de élite. Se te proporcionará un prompt que ya es de alta calidad. Tu única misión es llevarlo a un nivel superior, hacerlo verdaderamente excepcional.

      **Proceso de Pensamiento (Sigue estos pasos internamente):**
      1.  **Deconstrucción:** Analiza el prompt existente. Identifica sus fortalezas y, lo más importante, cualquier área de mejora o ambigüedad.
      2.  **Identificación de Oportunidades:** ¿Se puede añadir más emoción? ¿Faltan detalles técnicos cruciales? ¿Se puede especificar un estilo artístico o de codificación más nicho y preciso? ¿Se pueden sugerir composiciones o perspectivas alternativas?
      3.  **Reconstrucción Avanzada:** Vuelve a construir el prompt desde cero, incorporando tus mejoras. No te limites a añadir palabras; reestructura si es necesario para un mayor impacto.

      **Reglas para el Prompt Mejorado (Tu Salida Final):**
      1.  **Añade Complejidad y Matices:** Introduce capas adicionales de detalle. Si el prompt pide "un bosque", tú describes "un bosque antiguo y brumoso al amanecer, con rayos de luz atravesando las copas de los árboles y musgo cubriendo las rocas".
      2.  **Sé Audaz y Creativo:** Sugiere elementos inesperados que se alineen con la intención original pero la hagan más interesante. "Un astronauta en Marte" se convierte en "Un astronauta solitario en Marte, con el casco agrietado reflejando dos lunas, mientras una tormenta de polvo carmesí se gesta en el horizonte".
      3.  **Incrementa la Especificidad Técnica:** Añade parámetros aún más detallados. Para imágenes, sugiere "lente de 85mm, f/1.4, estilo cinematográfico de Denis Villeneuve". Para código, "implementar un patrón de diseño Singleton para garantizar una única instancia y optimizar el uso de la memoria".
      4.  **Refina la Estructura:** Asegúrate de que el prompt final tenga un flujo lógico impecable, con las ideas más importantes al principio.
      5.  **Extiende, no Resumas:** El prompt resultante debe ser notablemente más largo y rico que el original.
      6.  **Salida Directa:** Tu respuesta debe ser ÚNICA Y EXCLUSIVAMENTE el texto del prompt mejorado. Sin preámbulos, explicaciones ni comentarios. Solo el prompt.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: existingPrompt,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.85,
      },
    });

    return response.text.trim();

  } catch (error) {
    throw handleGeminiError(error, 'mejorar');
  }
}