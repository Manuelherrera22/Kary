/**
 * Configuración de IA para Kary Educational Platform
 */

export const AI_CONFIG = {
  // Proveedores de IA disponibles
  providers: {
    gemini: {
      name: 'Google Gemini',
      apiKey: import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBfQj3LxYUtLngyn3YPGJXiVs4xa0yb7QU',
      models: {
        geminiFlash: 'gemini-1.5-flash',
        geminiPro: 'gemini-1.5-pro'
      },
      priority: 1,
      enabled: true
    },
    openai: {
      name: 'OpenAI',
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      models: {
        gpt4: 'gpt-4',
        gpt35: 'gpt-3.5-turbo'
      },
      priority: 2,
      enabled: !!import.meta.env.VITE_OPENAI_API_KEY
    },
    anthropic: {
      name: 'Anthropic Claude',
      apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY,
      models: {
        claude: 'claude-3-sonnet-20240229',
        claudeHaiku: 'claude-3-haiku-20240307'
      },
      priority: 3,
      enabled: !!import.meta.env.VITE_ANTHROPIC_API_KEY
    },
    local: {
      name: 'Local AI',
      endpoint: import.meta.env.VITE_LOCAL_AI_ENDPOINT || 'http://localhost:11434/api',
      models: {
        llama: 'llama2',
        mistral: 'mistral'
      },
      priority: 4,
      enabled: true
    }
  },

  // Configuración por defecto
  defaultProvider: import.meta.env.VITE_DEFAULT_AI_PROVIDER || 'gemini',
  
  // Configuración de respuestas
  responseConfig: {
    temperature: 0.7,
    maxTokens: 2048,
    topP: 0.95,
    topK: 40
  },

  // Configuración específica para educación
  educationalConfig: {
    contextPrompt: `
      Eres un asistente de IA especializado en educación y psicopedagogía para la plataforma Kary.
      Tu objetivo es ayudar a estudiantes, profesores, psicopedagogos, padres y directivos a mejorar
      el proceso educativo mediante análisis inteligente y recomendaciones personalizadas.
      
      Principios fundamentales:
      - Enfoque en el desarrollo integral del estudiante
      - Consideración de aspectos académicos, emocionales y sociales
      - Personalización basada en datos y contexto
      - Promoción del aprendizaje activo y significativo
      - Colaboración entre todos los actores educativos
    `,
    supportedLanguages: ['es', 'en'],
    responseFormat: 'structured_json'
  },

  // Capacidades específicas por rol
  roleCapabilities: {
    student: [
      'generar_actividades_personalizadas',
      'explicar_conceptos_dificiles',
      'sugerir_estrategias_estudio',
      'motivar_progreso'
    ],
    teacher: [
      'crear_planes_clase',
      'analizar_rendimiento_estudiantes',
      'sugerir_intervenciones',
      'generar_evaluaciones'
    ],
    psychopedagogue: [
      'crear_planes_apoyo',
      'analizar_diagnosticos',
      'generar_alertas_predictivas',
      'recomendar_estrategias_intervencion'
    ],
    parent: [
      'interpretar_progreso_hijo',
      'sugerir_actividades_hogar',
      'entender_recomendaciones_educativas',
      'apoyar_aprendizaje_familiar'
    ],
    directive: [
      'analizar_metricas_institucionales',
      'generar_reportes_estadisticos',
      'sugerir_mejoras_institucionales',
      'evaluar_rendimiento_general'
    ]
  },

  // Configuración de fallback
  fallbackChain: ['gemini', 'openai', 'anthropic', 'local'],
  
  // Límites y rate limiting
  limits: {
    maxRequestsPerMinute: 60,
    maxTokensPerRequest: 4096,
    maxContextLength: 8192
  },

  // Configuración de cache
  cache: {
    enabled: true,
    ttl: 300000, // 5 minutos
    maxSize: 100
  }
};

export default AI_CONFIG;