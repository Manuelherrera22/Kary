/**
 * Servicio de personalización de actividades
 * Adapta el contenido y la experiencia según el perfil del estudiante
 */

// Configuración de personalización por materia
const SUBJECT_PERSONALIZATION = {
  mathematics: {
    themes: {
      beginner: {
        name: 'Aventura Matemática',
        icon: '🔢',
        color: 'from-blue-600 to-purple-600',
        challenges: [
          'Conteo básico',
          'Sumas simples',
          'Reconocimiento de números',
          'Comparación de cantidades'
        ]
      },
      intermediate: {
        name: 'Misión Matemática',
        icon: '🧮',
        color: 'from-purple-600 to-pink-600',
        challenges: [
          'Multiplicación básica',
          'División simple',
          'Problemas de suma y resta',
          'Geometría básica'
        ]
      },
      advanced: {
        name: 'Desafío Matemático',
        icon: '📐',
        color: 'from-pink-600 to-red-600',
        challenges: [
          'Fracciones',
          'Decimales',
          'Álgebra básica',
          'Problemas complejos'
        ]
      }
    },
    adaptations: {
      visual: {
        materials: ['Bloques numéricos', 'Tarjetas de números', 'Calculadora visual'],
        instructions: 'Usa materiales visuales para resolver los problemas',
        hints: 'Cuenta paso a paso usando los materiales'
      },
      auditory: {
        materials: ['Grabadora de voz', 'Aplicación de audio'],
        instructions: 'Escucha las instrucciones y repite en voz alta',
        hints: 'Pronuncia los números mientras resuelves'
      },
      kinesthetic: {
        materials: ['Objetos manipulativos', 'Papel y lápiz', 'Calculadora táctil'],
        instructions: 'Manipula objetos para resolver los problemas',
        hints: 'Usa tus dedos o objetos para contar'
      }
    }
  },
  
  reading: {
    themes: {
      beginner: {
        name: 'Expedición de Lectura',
        icon: '📖',
        color: 'from-green-600 to-teal-600',
        challenges: [
          'Reconocimiento de letras',
          'Lectura de palabras simples',
          'Comprensión básica',
          'Vocabulario familiar'
        ]
      },
      intermediate: {
        name: 'Aventura Literaria',
        icon: '📚',
        color: 'from-teal-600 to-cyan-600',
        challenges: [
          'Lectura fluida',
          'Comprensión de textos',
          'Vocabulario ampliado',
          'Análisis básico'
        ]
      },
      advanced: {
        name: 'Misión de Lectura',
        icon: '📜',
        color: 'from-cyan-600 to-blue-600',
        challenges: [
          'Lectura crítica',
          'Análisis literario',
          'Inferencia',
          'Síntesis de ideas'
        ]
      }
    },
    adaptations: {
      visual: {
        materials: ['Libros con imágenes', 'Tarjetas de palabras', 'Pictogramas'],
        instructions: 'Observa las imágenes mientras lees',
        hints: 'Usa las imágenes para entender el significado'
      },
      auditory: {
        materials: ['Libros de audio', 'Grabadora', 'Aplicación de lectura'],
        instructions: 'Escucha mientras lees',
        hints: 'Pronuncia las palabras en voz alta'
      },
      kinesthetic: {
        materials: ['Marcadores', 'Papel', 'Objetos para representar'],
        instructions: 'Marca las palabras importantes',
        hints: 'Usa gestos para representar las acciones'
      }
    }
  },

  writing: {
    themes: {
      beginner: {
        name: 'Misión de Escritura',
        icon: '✍️',
        color: 'from-yellow-600 to-orange-600',
        challenges: [
          'Formación de letras',
          'Palabras simples',
          'Oraciones básicas',
          'Vocabulario básico'
        ]
      },
      intermediate: {
        name: 'Aventura Creativa',
        icon: '🖋️',
        color: 'from-orange-600 to-red-600',
        challenges: [
          'Párrafos estructurados',
          'Vocabulario ampliado',
          'Coherencia textual',
          'Creatividad'
        ]
      },
      advanced: {
        name: 'Desafío Literario',
        icon: '📝',
        color: 'from-red-600 to-pink-600',
        challenges: [
          'Textos complejos',
          'Estilos literarios',
          'Análisis crítico',
          'Expresión avanzada'
        ]
      }
    },
    adaptations: {
      visual: {
        materials: ['Plantillas visuales', 'Imágenes de referencia', 'Colores'],
        instructions: 'Usa imágenes para inspirar tu escritura',
        hints: 'Dibuja primero lo que quieres escribir'
      },
      auditory: {
        materials: ['Grabadora', 'Música de fondo', 'Aplicación de dictado'],
        instructions: 'Graba tus ideas antes de escribir',
        hints: 'Habla en voz alta mientras escribes'
      },
      kinesthetic: {
        materials: ['Papel grueso', 'Lápices especiales', 'Superficies táctiles'],
        instructions: 'Experimenta con diferentes herramientas',
        hints: 'Usa movimientos grandes para formar letras'
      }
    }
  },

  science: {
    themes: {
      beginner: {
        name: 'Laboratorio de Descubrimiento',
        icon: '🔬',
        color: 'from-purple-600 to-pink-600',
        challenges: [
          'Observación básica',
          'Clasificación simple',
          'Experimentos seguros',
          'Curiosidad científica'
        ]
      },
      intermediate: {
        name: 'Expedición Científica',
        icon: '🧪',
        color: 'from-pink-600 to-red-600',
        challenges: [
          'Hipótesis simples',
          'Experimentos guiados',
          'Análisis de datos',
          'Conclusiones básicas'
        ]
      },
      advanced: {
        name: 'Misión de Investigación',
        icon: '🔭',
        color: 'from-red-600 to-orange-600',
        challenges: [
          'Diseño experimental',
          'Análisis crítico',
          'Síntesis de información',
          'Aplicación del conocimiento'
        ]
      }
    },
    adaptations: {
      visual: {
        materials: ['Microscopio', 'Imágenes científicas', 'Diagramas'],
        instructions: 'Observa detalladamente los fenómenos',
        hints: 'Usa diagramas para entender los procesos'
      },
      auditory: {
        materials: ['Grabadora', 'Aplicaciones de audio', 'Videos explicativos'],
        instructions: 'Escucha las explicaciones científicas',
        hints: 'Explica en voz alta lo que observas'
      },
      kinesthetic: {
        materials: ['Materiales de laboratorio', 'Modelos 3D', 'Experimentos prácticos'],
        instructions: 'Manipula los materiales directamente',
        hints: 'Construye modelos para entender los conceptos'
      }
    }
  }
};

// Configuración de personalización por necesidades especiales
const SPECIAL_NEEDS_ADAPTATIONS = {
  dyslexia: {
    adjustments: {
      font: 'OpenDyslexic',
      fontSize: 'larger',
      lineSpacing: 'increased',
      colors: 'high_contrast',
      audio: 'enabled'
    },
    materials: ['Lectores de pantalla', 'Audio libros', 'Fuentes especiales'],
    instructions: 'Usa herramientas de audio y fuentes especiales',
    hints: 'Escucha las instrucciones mientras lees'
  },
  
  adhd: {
    adjustments: {
      breaks: 'frequent',
      duration: 'shorter',
      rewards: 'immediate',
      structure: 'clear',
      distractions: 'minimized'
    },
    materials: ['Timer visual', 'Organizadores', 'Marcadores de progreso'],
    instructions: 'Toma descansos frecuentes y usa temporizadores',
    hints: 'Divide las tareas en pasos pequeños'
  },
  
  autism: {
    adjustments: {
      routine: 'consistent',
      transitions: 'smooth',
      social: 'minimal',
      sensory: 'controlled',
      instructions: 'clear'
    },
    materials: ['Agendas visuales', 'Objetos de transición', 'Espacios tranquilos'],
    instructions: 'Mantén una rutina consistente y espacios tranquilos',
    hints: 'Usa agendas visuales para seguir el progreso'
  },
  
  motor_difficulties: {
    adjustments: {
      input: 'alternative',
      time: 'extended',
      precision: 'reduced',
      tools: 'adaptive'
    },
    materials: ['Teclados adaptativos', 'Mouse especial', 'Software de voz'],
    instructions: 'Usa herramientas adaptativas y tiempo extendido',
    hints: 'Usa comandos de voz cuando sea posible'
  }
};

// Configuración de personalización por edad/grado
const AGE_PERSONALIZATION = {
  preschool: {
    duration: 10, // minutos
    complexity: 'very_simple',
    interaction: 'high',
    rewards: 'immediate',
    language: 'simple'
  },
  elementary: {
    duration: 15,
    complexity: 'simple',
    interaction: 'medium',
    rewards: 'frequent',
    language: 'age_appropriate'
  },
  middle: {
    duration: 20,
    complexity: 'moderate',
    interaction: 'medium',
    rewards: 'periodic',
    language: 'standard'
  },
  high: {
    duration: 30,
    complexity: 'complex',
    interaction: 'low',
    rewards: 'achievement_based',
    language: 'advanced'
  }
};

/**
 * Genera contenido personalizado para una actividad
 */
export const personalizeActivity = (activity, studentProfile) => {
  const personalization = {
    ...activity,
    personalizedContent: {},
    adaptations: {},
    adjustments: {}
  };

  // Personalización por materia
  const subjectConfig = SUBJECT_PERSONALIZATION[activity.subject];
  if (subjectConfig) {
    const themeConfig = subjectConfig.themes[activity.difficulty];
    if (themeConfig) {
      personalization.personalizedContent.theme = themeConfig;
    }
  }

  // Personalización por estilo de aprendizaje
  if (studentProfile.learningStyle) {
    const adaptation = subjectConfig?.adaptations[studentProfile.learningStyle];
    if (adaptation) {
      personalization.adaptations.learningStyle = adaptation;
    }
  }

  // Personalización por necesidades especiales
  if (studentProfile.specialNeeds && studentProfile.specialNeeds.length > 0) {
    studentProfile.specialNeeds.forEach(need => {
      const adaptation = SPECIAL_NEEDS_ADAPTATIONS[need];
      if (adaptation) {
        personalization.adaptations[need] = adaptation;
        Object.assign(personalization.adjustments, adaptation.adjustments);
      }
    });
  }

  // Personalización por edad/grado
  if (studentProfile.grade) {
    const gradeLevel = determineGradeLevel(studentProfile.grade);
    const ageConfig = AGE_PERSONALIZATION[gradeLevel];
    if (ageConfig) {
      personalization.adaptations.age = ageConfig;
      personalization.duration = ageConfig.duration;
    }
  }

  // Personalización por preferencias
  if (studentProfile.preferences) {
    personalization.adaptations.preferences = studentProfile.preferences;
  }

  return personalization;
};

/**
 * Determina el nivel de grado basado en la edad o grado
 */
const determineGradeLevel = (grade) => {
  if (typeof grade === 'number') {
    if (grade <= 5) return 'elementary';
    if (grade <= 8) return 'middle';
    return 'high';
  }
  
  if (typeof grade === 'string') {
    const gradeNum = parseInt(grade);
    if (gradeNum <= 5) return 'elementary';
    if (gradeNum <= 8) return 'middle';
    return 'high';
  }
  
  return 'elementary'; // Default
};

/**
 * Genera preguntas personalizadas basadas en el perfil del estudiante
 */
export const generatePersonalizedQuestions = (activity, studentProfile) => {
  const questions = [];
  const subjectConfig = SUBJECT_PERSONALIZATION[activity.subject];
  
  if (!subjectConfig) return questions;

  // Usar intereses del estudiante para hacer las preguntas más relevantes
  const interests = studentProfile.interests || [];
  const favoriteTopics = interests.slice(0, 3); // Usar los 3 temas favoritos

  // Generar preguntas contextualizadas
  for (let i = 0; i < activity.objectives.length; i++) {
    const objective = activity.objectives[i];
    const topic = favoriteTopics[i % favoriteTopics.length] || 'general';
    
    questions.push({
      id: i + 1,
      objective: objective,
      topic: topic,
      question: generateContextualQuestion(activity.subject, objective, topic, activity.difficulty),
      personalized: true
    });
  }

  return questions;
};

/**
 * Genera una pregunta contextualizada
 */
const generateContextualQuestion = (subject, objective, topic, difficulty) => {
  const templates = {
    mathematics: {
      beginner: `En el contexto de ${topic}, ${objective.toLowerCase()}`,
      intermediate: `Considerando ${topic}, resuelve: ${objective.toLowerCase()}`,
      advanced: `Analiza el problema relacionado con ${topic}: ${objective.toLowerCase()}`
    },
    reading: {
      beginner: `Lee sobre ${topic} y ${objective.toLowerCase()}`,
      intermediate: `Analiza el texto sobre ${topic} para ${objective.toLowerCase()}`,
      advanced: `Evalúa críticamente el contenido sobre ${topic}: ${objective.toLowerCase()}`
    },
    writing: {
      beginner: `Escribe sobre ${topic} usando ${objective.toLowerCase()}`,
      intermediate: `Crea un texto sobre ${topic} que demuestre ${objective.toLowerCase()}`,
      advanced: `Desarrolla un ensayo sobre ${topic} aplicando ${objective.toLowerCase()}`
    },
    science: {
      beginner: `Observa ${topic} para ${objective.toLowerCase()}`,
      intermediate: `Experimenta con ${topic} y ${objective.toLowerCase()}`,
      advanced: `Investiga ${topic} aplicando ${objective.toLowerCase()}`
    }
  };

  const subjectTemplates = templates[subject] || templates.mathematics;
  return subjectTemplates[difficulty] || subjectTemplates.beginner;
};

/**
 * Aplica ajustes de accesibilidad
 */
export const applyAccessibilityAdjustments = (activity, adjustments) => {
  const adjustedActivity = { ...activity };
  
  if (adjustments.font) {
    adjustedActivity.fontFamily = adjustments.font;
  }
  
  if (adjustments.fontSize) {
    adjustedActivity.fontSize = adjustments.fontSize;
  }
  
  if (adjustments.colors) {
    adjustedActivity.colorScheme = adjustments.colors;
  }
  
  if (adjustments.audio) {
    adjustedActivity.audioEnabled = adjustments.audio === 'enabled';
  }
  
  if (adjustments.time) {
    adjustedActivity.timeExtension = adjustments.time;
  }
  
  return adjustedActivity;
};

/**
 * Genera materiales adaptativos
 */
export const generateAdaptiveMaterials = (activity, adaptations) => {
  const materials = [...(activity.materials || [])];
  
  // Agregar materiales por estilo de aprendizaje
  if (adaptations.learningStyle) {
    materials.push(...adaptations.learningStyle.materials);
  }
  
  // Agregar materiales por necesidades especiales
  Object.values(adaptations).forEach(adaptation => {
    if (adaptation.materials) {
      materials.push(...adaptation.materials);
    }
  });
  
  return [...new Set(materials)]; // Eliminar duplicados
};

export default {
  personalizeActivity,
  generatePersonalizedQuestions,
  applyAccessibilityAdjustments,
  generateAdaptiveMaterials,
  SUBJECT_PERSONALIZATION,
  SPECIAL_NEEDS_ADAPTATIONS,
  AGE_PERSONALIZATION
};
