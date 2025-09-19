/**
 * Configuración de IA para la plataforma Kary
 */

export const AI_CONFIG = {
  // Configuración de proveedores
  providers: {
    openai: {
      name: 'OpenAI',
      enabled: true,
      priority: 1,
      models: {
        gpt4: 'gpt-4',
        gpt35: 'gpt-3.5-turbo',
        embedding: 'text-embedding-ada-002'
      },
      limits: {
        maxTokens: 4000,
        temperature: 0.7,
        topP: 1
      }
    },
    anthropic: {
      name: 'Anthropic Claude',
      enabled: true,
      priority: 2,
      models: {
        claude: 'claude-3-sonnet-20240229',
        claudeHaiku: 'claude-3-haiku-20240307'
      },
      limits: {
        maxTokens: 4000,
        temperature: 0.7,
        topP: 1
      }
    },
    local: {
      name: 'IA Local',
      enabled: true,
      priority: 3,
      models: {
        llama: 'llama2',
        mistral: 'mistral',
        codellama: 'codellama'
      },
      limits: {
        maxTokens: 2000,
        temperature: 0.7,
        topP: 1
      }
    }
  },

  // Configuración de capacidades
  capabilities: {
    supportPlan: {
      enabled: true,
      maxObjectives: 5,
      maxStrategies: 8,
      timelineWeeks: 12
    },
    predictiveAlerts: {
      enabled: true,
      maxAlerts: 10,
      alertTypes: ['academic', 'emotional', 'behavioral', 'attendance'],
      priorityLevels: ['low', 'medium', 'high', 'critical']
    },
    personalizedTasks: {
      enabled: true,
      maxTasks: 5,
      subjects: ['matemáticas', 'español', 'ciencias', 'historia', 'inglés'],
      difficulties: ['easy', 'medium', 'hard'],
      learningStyles: ['visual', 'auditory', 'kinesthetic', 'mixed']
    },
    learningAnalysis: {
      enabled: true,
      maxPatterns: 10,
      analysisDepth: 'comprehensive'
    },
    roleAssistance: {
      enabled: true,
      maxRecommendations: 8,
      maxActions: 5
    },
    adaptiveContent: {
      enabled: true,
      maxActivities: 6,
      maxResources: 8,
      contentTypes: ['text', 'video', 'interactive', 'assessment']
    }
  },

  // Configuración de contexto
  context: {
    maxHistoryItems: 50,
    cacheTimeout: 300000, // 5 minutos
    studentContextDepth: 'comprehensive',
    institutionalContextDepth: 'overview'
  },

  // Configuración de respuesta
  response: {
    maxResponseTime: 30000, // 30 segundos
    fallbackEnabled: true,
    mockResponseEnabled: true,
    retryAttempts: 3,
    retryDelay: 1000
  },

  // Configuración de seguridad
  security: {
    sanitizeInput: true,
    validateOutput: true,
    logInteractions: true,
    encryptSensitiveData: true
  },

  // Configuración de monitoreo
  monitoring: {
    trackUsage: true,
    trackPerformance: true,
    trackErrors: true,
    analyticsEnabled: true
  },

  // Configuración de personalización
  personalization: {
    adaptToUser: true,
    learnFromInteractions: true,
    customizeResponses: true,
    rememberPreferences: true
  }
};

// Configuración específica por rol
export const ROLE_AI_CONFIG = {
  directive: {
    primaryCapabilities: ['roleAssistance', 'predictiveAlerts', 'learningAnalysis'],
    contextFocus: ['institutional', 'strategic', 'administrative'],
    responseStyle: 'executive',
    maxDetailLevel: 'high'
  },
  teacher: {
    primaryCapabilities: ['personalizedTasks', 'adaptiveContent', 'roleAssistance'],
    contextFocus: ['classroom', 'students', 'curriculum'],
    responseStyle: 'practical',
    maxDetailLevel: 'medium'
  },
  psychopedagogue: {
    primaryCapabilities: ['supportPlan', 'predictiveAlerts', 'learningAnalysis'],
    contextFocus: ['individual', 'diagnostic', 'therapeutic'],
    responseStyle: 'clinical',
    maxDetailLevel: 'high'
  },
  parent: {
    primaryCapabilities: ['roleAssistance', 'learningAnalysis'],
    contextFocus: ['family', 'child', 'home'],
    responseStyle: 'supportive',
    maxDetailLevel: 'medium'
  },
  student: {
    primaryCapabilities: ['adaptiveContent', 'personalizedTasks'],
    contextFocus: ['learning', 'individual', 'academic'],
    responseStyle: 'encouraging',
    maxDetailLevel: 'low'
  }
};

// Configuración de prompts del sistema
export const SYSTEM_PROMPTS = {
  base: "Eres un asistente de IA especializado en educación. Proporcionas respuestas útiles, precisas y contextualmente apropiadas para el entorno educativo.",
  
  directive: `
    Eres un asistente especializado para directivos educativos.
    - Ayudas con toma de decisiones estratégicas
    - Analizas datos institucionales
    - Sugieres mejoras organizacionales
    - Proporcionas insights para liderazgo educativo
    - Mantienes un enfoque en resultados y eficiencia
  `,
  
  teacher: `
    Eres un asistente pedagógico especializado para docentes.
    - Ayudas con planificación de clases
    - Sugieres estrategias de enseñanza
    - Proporcionas ideas para actividades
    - Ayudas con evaluación de estudiantes
    - Mantienes un enfoque práctico y aplicable
  `,
  
  psychopedagogue: `
    Eres un asistente especializado en psicopedagogía.
    - Ayudas con diagnósticos educativos
    - Sugieres planes de apoyo
    - Proporcionas estrategias de intervención
    - Ayudas con análisis de comportamiento
    - Mantienes un enfoque clínico y profesional
  `,
  
  parent: `
    Eres un asistente especializado para padres de familia.
    - Ayudas a entender el progreso de los hijos
    - Sugieres formas de apoyo en casa
    - Explicas conceptos educativos
    - Proporcionas recursos para padres
    - Mantienes un enfoque comprensivo y alentador
  `,
  
  student: `
    Eres un tutor personal especializado para estudiantes.
    - Ayudas con organización del estudio
    - Enseñas técnicas de aprendizaje
    - Proporcionas motivación y apoyo
    - Explicas conceptos difíciles
    - Mantienes un enfoque positivo y motivador
  `
};

export default AI_CONFIG;

