import { useToast } from '@/components/ui/use-toast';

/**
 * Servicio de generación de actividades para estudiantes
 * Basado en planes de apoyo aceptados por el docente
 */

// Configuración de IA para actividades
const ACTIVITY_AI_CONFIG = {
  PROCESSING_DELAY: 1500,
  
  // Tipos de actividades por materia
  SUBJECT_ACTIVITIES: {
    mathematics: {
      beginner: ['Conteo básico', 'Sumas simples', 'Reconocimiento de números'],
      intermediate: ['Problemas de suma y resta', 'Multiplicación básica', 'Fracciones simples'],
      advanced: ['Problemas complejos', 'Geometría básica', 'Álgebra elemental']
    },
    reading: {
      beginner: ['Lectura de palabras simples', 'Reconocimiento de letras', 'Comprensión básica'],
      intermediate: ['Lectura fluida', 'Comprensión de textos', 'Vocabulario'],
      advanced: ['Análisis de textos', 'Inferencias', 'Crítica literaria']
    },
    writing: {
      beginner: ['Trazado de letras', 'Escritura de palabras', 'Oraciones simples'],
      intermediate: ['Párrafos cortos', 'Descripciones', 'Narrativas básicas'],
      advanced: ['Ensayos', 'Creatividad', 'Gramática avanzada']
    },
    science: {
      beginner: ['Observación básica', 'Experimentos simples', 'Clasificación'],
      intermediate: ['Hipótesis', 'Experimentos guiados', 'Análisis de datos'],
      advanced: ['Investigación independiente', 'Método científico', 'Aplicación práctica']
    }
  },

  // Adaptaciones según necesidades específicas
  ADAPTATIONS: {
    visual_learner: ['Materiales visuales', 'Diagramas', 'Colores', 'Imágenes'],
    auditory_learner: ['Explicaciones orales', 'Audio', 'Discusión', 'Repetición'],
    kinesthetic_learner: ['Manipulativos', 'Movimiento', 'Actividades prácticas', 'Experimentos'],
    attention_short: ['Actividades cortas', 'Descansos frecuentes', 'Cambios de actividad'],
    reading_difficulties: ['Texto simplificado', 'Audio', 'Apoyo visual', 'Tiempo extendido'],
    math_difficulties: ['Manipulativos', 'Ejemplos visuales', 'Pasos claros', 'Práctica repetida']
  }
};

/**
 * Genera actividades específicas para un estudiante basadas en su plan de apoyo
 */
export const generateStudentActivities = async (studentData, supportPlan, subject = 'all') => {
  console.log('🎯 IA: Generando actividades específicas para estudiante...', { studentData, supportPlan, subject });
  
  // Simular procesamiento de IA
  await new Promise(resolve => setTimeout(resolve, ACTIVITY_AI_CONFIG.PROCESSING_DELAY));
  
  const activities = [];
  
  // Crear análisis de IA si no existe (para comunicaciones del dashboard)
  const aiAnalysis = supportPlan.aiAnalysis || createMockAIAnalysis(supportPlan);
  const studentNeeds = aiAnalysis.priorityNeeds || [];
  
  // Determinar nivel de dificultad basado en el análisis de IA
  const difficulty = determineDifficultyLevel(aiAnalysis);
  
  // Generar actividades por materia
  if (subject === 'all' || subject === 'mathematics') {
    const mathActivities = generateSubjectActivities('mathematics', difficulty, studentNeeds, studentData, supportPlan);
    activities.push(...mathActivities);
  }
  
  if (subject === 'all' || subject === 'reading') {
    const readingActivities = generateSubjectActivities('reading', difficulty, studentNeeds, studentData, supportPlan);
    activities.push(...readingActivities);
  }
  
  if (subject === 'all' || subject === 'writing') {
    const writingActivities = generateSubjectActivities('writing', difficulty, studentNeeds, studentData, supportPlan);
    activities.push(...writingActivities);
  }
  
  if (subject === 'all' || subject === 'science') {
    const scienceActivities = generateSubjectActivities('science', difficulty, studentNeeds, studentData, supportPlan);
    activities.push(...scienceActivities);
  }
  
  // Aplicar adaptaciones específicas
  const adaptedActivities = activities.map(activity => 
    applyAdaptations(activity, aiAnalysis, studentNeeds)
  );
  
  console.log('✅ IA: Actividades generadas:', adaptedActivities.length);
  return adaptedActivities;
};

/**
 * Genera actividades para una materia específica
 */
function generateSubjectActivities(subject, difficulty, studentNeeds, studentData, supportPlan) {
  const activities = [];
  const subjectConfig = ACTIVITY_AI_CONFIG.SUBJECT_ACTIVITIES[subject];
  
  if (!subjectConfig) return activities;
  
  const difficultyActivities = subjectConfig[difficulty] || subjectConfig.beginner;
  
  // Generar 2-3 actividades por materia
  const numActivities = Math.min(3, difficultyActivities.length);
  
  for (let i = 0; i < numActivities; i++) {
    const activityTemplate = difficultyActivities[i];
    
    const activity = {
      id: `activity-${subject}-${Date.now()}-${i}`,
      title: `${activityTemplate} - ${studentData.full_name}`,
      description: generateActivityDescription(activityTemplate, studentData, subject, difficulty),
      type: 'individual',
      subject: subject,
      difficulty: difficulty,
      duration: calculateDuration(difficulty, studentNeeds),
      materials: generateMaterials(subject, difficulty, studentNeeds),
      instructions: generateInstructions(activityTemplate, subject, difficulty),
      objectives: generateObjectives(activityTemplate, subject, difficulty),
      adaptations: [],
      basedOnPlan: supportPlan.id,
      studentId: studentData.id,
      studentName: studentData.full_name,
      aiGenerated: true,
      createdAt: new Date().toISOString(),
      status: 'ready_for_assignment'
    };
    
    activities.push(activity);
  }
  
  return activities;
}

/**
 * Aplica adaptaciones específicas a una actividad
 */
function applyAdaptations(activity, aiAnalysis, studentNeeds) {
  const adaptations = [];
  
  // Adaptaciones basadas en estilo de aprendizaje
  if (aiAnalysis.learningProfile?.style === 'visual') {
    adaptations.push(...ACTIVITY_AI_CONFIG.ADAPTATIONS.visual_learner);
  } else if (aiAnalysis.learningProfile?.style === 'auditory') {
    adaptations.push(...ACTIVITY_AI_CONFIG.ADAPTATIONS.auditory_learner);
  } else if (aiAnalysis.learningProfile?.style === 'kinesthetic') {
    adaptations.push(...ACTIVITY_AI_CONFIG.ADAPTATIONS.kinesthetic_learner);
  }
  
  // Adaptaciones basadas en necesidades específicas
  studentNeeds.forEach(need => {
    if (need.need === 'attention_management') {
      adaptations.push(...ACTIVITY_AI_CONFIG.ADAPTATIONS.attention_short);
    } else if (need.need === 'reading_support') {
      adaptations.push(...ACTIVITY_AI_CONFIG.ADAPTATIONS.reading_difficulties);
    } else if (need.need === 'math_difficulties') {
      adaptations.push(...ACTIVITY_AI_CONFIG.ADAPTATIONS.math_difficulties);
    }
  });
  
  return {
    ...activity,
    adaptations: [...new Set(adaptations)] // Eliminar duplicados
  };
}

/**
 * Determina el nivel de dificultad basado en el análisis de IA
 */
function determineDifficultyLevel(aiAnalysis) {
  const readingLevel = aiAnalysis.learningProfile?.academicLevel?.reading;
  const mathLevel = aiAnalysis.learningProfile?.academicLevel?.math;
  
  if (readingLevel === 'basic' || mathLevel === 'basic') {
    return 'beginner';
  } else if (readingLevel === 'advanced' || mathLevel === 'advanced') {
    return 'advanced';
  }
  
  return 'intermediate';
}

/**
 * Calcula la duración óptima de la actividad
 */
function calculateDuration(difficulty, studentNeeds) {
  let baseDuration = {
    beginner: 15,
    intermediate: 25,
    advanced: 35
  }[difficulty];
  
  // Ajustar por capacidad de atención
  const hasAttentionIssues = studentNeeds.some(need => need.need === 'attention_management');
  if (hasAttentionIssues) {
    baseDuration = Math.floor(baseDuration * 0.7); // Reducir 30%
  }
  
  return baseDuration;
}

/**
 * Genera materiales necesarios para la actividad
 */
function generateMaterials(subject, difficulty, studentNeeds) {
  const baseMaterials = {
    mathematics: ['Lápiz', 'Papel', 'Calculadora básica'],
    reading: ['Texto', 'Lápiz', 'Cuaderno'],
    writing: ['Lápiz', 'Papel', 'Borrador'],
    science: ['Materiales del experimento', 'Cuaderno', 'Lápiz']
  };
  
  let materials = baseMaterials[subject] || ['Materiales básicos'];
  
  // Agregar materiales específicos según necesidades
  if (studentNeeds.some(need => need.need === 'reading_support')) {
    materials.push('Texto adaptado', 'Diccionario visual');
  }
  
  if (studentNeeds.some(need => need.need === 'math_difficulties')) {
    materials.push('Manipulativos matemáticos', 'Calculadora');
  }
  
  return materials;
}

/**
 * Genera descripción de la actividad
 */
function generateActivityDescription(template, studentData, subject, difficulty) {
  const descriptions = {
    mathematics: {
      beginner: `Actividad de matemáticas básicas adaptada para ${studentData.full_name}. Enfocada en ${template.toLowerCase()} con apoyo visual y manipulativos.`,
      intermediate: `Ejercicio de matemáticas de nivel intermedio para ${studentData.full_name}. Incluye ${template.toLowerCase()} con ejemplos prácticos.`,
      advanced: `Problema matemático avanzado para ${studentData.full_name}. Desarrolla habilidades de ${template.toLowerCase()} con aplicaciones reales.`
    },
    reading: {
      beginner: `Ejercicio de lectura básica para ${studentData.full_name}. Enfocado en ${template.toLowerCase()} con apoyo visual y audio.`,
      intermediate: `Actividad de comprensión lectora para ${studentData.full_name}. Desarrolla ${template.toLowerCase()} con textos adaptados.`,
      advanced: `Análisis de texto avanzado para ${studentData.full_name}. Promueve ${template.toLowerCase()} con textos complejos.`
    },
    writing: {
      beginner: `Ejercicio de escritura básica para ${studentData.full_name}. Practica ${template.toLowerCase()} con guías visuales.`,
      intermediate: `Actividad de escritura creativa para ${studentData.full_name}. Desarrolla ${template.toLowerCase()} con ejemplos.`,
      advanced: `Proyecto de escritura avanzada para ${studentData.full_name}. Aplica ${template.toLowerCase()} en contextos complejos.`
    },
    science: {
      beginner: `Experimento científico básico para ${studentData.full_name}. Explora ${template.toLowerCase()} con materiales simples.`,
      intermediate: `Investigación científica para ${studentData.full_name}. Desarrolla ${template.toLowerCase()} con método guiado.`,
      advanced: `Proyecto científico avanzado para ${studentData.full_name}. Aplica ${template.toLowerCase()} independientemente.`
    }
  };
  
  return descriptions[subject]?.[difficulty] || `Actividad personalizada de ${subject} para ${studentData.full_name}.`;
}

/**
 * Genera instrucciones específicas para la actividad
 */
function generateInstructions(template, subject, difficulty) {
  const instructionSets = {
    mathematics: {
      beginner: [
        'Lee las instrucciones cuidadosamente',
        'Usa los materiales proporcionados',
        'Pide ayuda si tienes dudas',
        'Revisa tu trabajo antes de terminar'
      ],
      intermediate: [
        'Analiza el problema paso a paso',
        'Usa estrategias aprendidas',
        'Verifica tu respuesta',
        'Explica tu proceso de pensamiento'
      ],
      advanced: [
        'Identifica qué información tienes y qué necesitas encontrar',
        'Planifica tu estrategia de solución',
        'Ejecuta tu plan sistemáticamente',
        'Evalúa la razonabilidad de tu respuesta'
      ]
    },
    reading: {
      beginner: [
        'Lee el texto lentamente',
        'Subraya palabras que no entiendas',
        'Responde las preguntas con tus propias palabras',
        'Pide ayuda si algo no está claro'
      ],
      intermediate: [
        'Haz una lectura inicial del texto',
        'Identifica las ideas principales',
        'Responde las preguntas de comprensión',
        'Haz conexiones con conocimientos previos'
      ],
      advanced: [
        'Realiza una lectura crítica del texto',
        'Analiza el propósito del autor',
        'Evalúa la credibilidad de la información',
        'Sintetiza las ideas principales'
      ]
    }
  };
  
  return instructionSets[subject]?.[difficulty] || [
    'Sigue las instrucciones paso a paso',
    'Pide ayuda si tienes dudas',
    'Tómate tu tiempo para completar la actividad',
    'Revisa tu trabajo antes de entregar'
  ];
}

/**
 * Genera objetivos específicos para la actividad
 */
function generateObjectives(template, subject, difficulty) {
  const objectiveSets = {
    mathematics: {
      beginner: ['Desarrollar habilidades básicas de cálculo', 'Mejorar comprensión numérica', 'Practicar operaciones fundamentales'],
      intermediate: ['Resolver problemas matemáticos', 'Aplicar conceptos en situaciones reales', 'Desarrollar pensamiento lógico'],
      advanced: ['Analizar problemas complejos', 'Aplicar múltiples estrategias', 'Desarrollar razonamiento matemático']
    },
    reading: {
      beginner: ['Mejorar fluidez lectora', 'Desarrollar vocabulario básico', 'Comprender textos simples'],
      intermediate: ['Analizar textos complejos', 'Desarrollar pensamiento crítico', 'Expandir vocabulario'],
      advanced: ['Evaluar información crítica', 'Sintetizar ideas complejas', 'Aplicar estrategias de lectura avanzadas']
    }
  };
  
  return objectiveSets[subject]?.[difficulty] || [
    'Desarrollar habilidades específicas',
    'Aplicar conocimientos aprendidos',
    'Mejorar comprensión del tema'
  ];
}

/**
 * Asigna actividades a un estudiante
 */
export const assignActivitiesToStudent = async (activities, studentId, teacherId) => {
  console.log('📤 Asignando actividades al estudiante...', { activities, studentId, teacherId });
  
  try {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simular asignación exitosa
    const assignedActivities = activities.map(activity => ({
      ...activity,
      assignedAt: new Date().toISOString(),
      assignedBy: teacherId,
      status: 'assigned',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 días
    }));
    
    console.log('✅ Actividades asignadas:', assignedActivities);
    
    return {
      success: true,
      assignedActivities,
      message: `${activities.length} actividades asignadas exitosamente a ${activities[0]?.studentName}`
    };
    
  } catch (error) {
    console.error('❌ Error asignando actividades:', error);
    return {
      success: false,
      error: error.message,
      message: 'Error asignando actividades al estudiante'
    };
  }
};

/**
 * Obtiene actividades asignadas a un estudiante
 */
export const getStudentActivities = async (studentId) => {
  console.log('📥 Obteniendo actividades del estudiante...', { studentId });
  
  try {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Datos mock para demostración
    const mockActivities = [
      {
        id: 'activity-1',
        title: 'Sumas Básicas - Ana López Martínez',
        description: 'Actividad de matemáticas básicas con apoyo visual',
        subject: 'mathematics',
        difficulty: 'beginner',
        duration: 15,
        status: 'assigned',
        assignedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        aiGenerated: true
      },
      {
        id: 'activity-2',
        title: 'Lectura de Palabras - Ana López Martínez',
        description: 'Ejercicio de lectura básica con apoyo audio',
        subject: 'reading',
        difficulty: 'beginner',
        duration: 20,
        status: 'completed',
        assignedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        aiGenerated: true
      }
    ];
    
    return {
      success: true,
      activities: mockActivities,
      total: mockActivities.length
    };
    
  } catch (error) {
    console.error('❌ Error obteniendo actividades:', error);
    return {
      success: false,
      error: error.message,
      activities: [],
      total: 0
    };
  }
};

/**
 * Crea un análisis de IA mock basado en la información disponible de la comunicación
 */
function createMockAIAnalysis(communication) {
  console.log('🤖 Creando análisis de IA mock desde comunicación...', communication);
  
  // Determinar prioridad y necesidades basándose en la información disponible
  const priority = communication.priority || 'medium';
  const subject = communication.subject || '';
  const studentName = subject.split(' - ')[1] || 'Estudiante';
  
  // Crear necesidades basadas en la prioridad y contexto
  const priorityNeeds = [];
  
  if (priority === 'high' || priority === 'urgent') {
    priorityNeeds.push({
      category: 'academic',
      need: 'reading_support',
      priority: 'high',
      description: 'Necesita apoyo intensivo en lectura'
    });
    priorityNeeds.push({
      category: 'behavioral',
      need: 'attention_management',
      priority: 'high',
      description: 'Requiere estrategias para mantener la atención'
    });
  } else {
    priorityNeeds.push({
      category: 'academic',
      need: 'general_support',
      priority: 'medium',
      description: 'Apoyo académico general'
    });
  }
  
  // Crear perfil de aprendizaje mock
  const learningProfile = {
    style: 'visual', // Default visual
    attention: priority === 'high' ? 'short' : 'medium',
    academicLevel: {
      reading: priority === 'high' ? 'basic' : 'intermediate',
      math: priority === 'high' ? 'basic' : 'intermediate'
    },
    social: 'developing',
    emotional: 'needs_support',
    communication: 'verbal_preferred',
    insights: [
      `Estudiante con necesidades específicas identificadas por el psicopedagogo`,
      `Requiere actividades adaptadas según su perfil de aprendizaje`
    ],
    recommendations: [
      'Usar materiales visuales y manipulativos',
      'Incluir descansos frecuentes',
      'Proporcionar instrucciones claras y paso a paso'
    ]
  };
  
  // Crear fortalezas mock
  const strengths = [
    {
      area: 'Motivación',
      description: 'Demuestra interés en aprender',
      utilization: 'Aprovechar la motivación con actividades atractivas'
    },
    {
      area: 'Comunicación',
      description: 'Se comunica efectivamente',
      utilization: 'Usar explicaciones verbales y discusión'
    }
  ];
  
  // Crear enfoques recomendados
  const recommendedApproaches = [
    {
      name: 'Enfoque Multisensorial',
      description: 'Integrar visual, auditivo y kinestésico',
      effectiveness: 'high',
      implementation: 'Usar materiales que involucren múltiples sentidos'
    }
  ];
  
  // Crear factores de riesgo
  const riskFactors = [
    {
      factor: 'Necesidades académicas',
      level: priority === 'high' ? 'high' : 'medium',
      description: 'Requiere apoyo específico en áreas académicas',
      mitigation: 'Proporcionar actividades adaptadas y apoyo individualizado'
    }
  ];
  
  const mockAnalysis = {
    learningProfile,
    priorityNeeds,
    recommendedApproaches,
    riskFactors,
    strengths
  };
  
  console.log('✅ Análisis de IA mock creado:', mockAnalysis);
  return mockAnalysis;
}

export default {
  generateStudentActivities,
  assignActivitiesToStudent,
  getStudentActivities
};
