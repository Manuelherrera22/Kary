import { useToast } from '@/components/ui/use-toast';

/**
 * Servicio de IA para generación automática de actividades
 * Analiza diagnósticos y genera planes de apoyo personalizados
 */

// Configuración de IA
const AI_CONFIG = {
  // Simular delay de IA (en producción sería una llamada real a IA)
  PROCESSING_DELAY: 2000,
  
  // Niveles de complejidad de actividades
  COMPLEXITY_LEVELS: {
    beginner: { minDuration: 5, maxDuration: 15, strategies: 2 },
    intermediate: { minDuration: 10, maxDuration: 25, strategies: 3 },
    advanced: { minDuration: 20, maxDuration: 40, strategies: 4 }
  },
  
  // Tipos de actividades por necesidad
  ACTIVITY_TYPES: {
    reading_support: {
      primary: 'reading_comprehension',
      secondary: ['visual_learning', 'attention_training'],
      materials: ['textos adaptados', 'imágenes', 'preguntas guiadas'],
      adaptations: ['tiempo extendido', 'apoyo visual', 'instrucciones claras']
    },
    attention_management: {
      primary: 'attention_training',
      secondary: ['focus_exercises', 'mindfulness'],
      materials: ['timer', 'actividades cortas', 'sistema de recompensas'],
      adaptations: ['descansos frecuentes', 'refuerzo positivo', 'nivel ajustable']
    },
    peer_interaction: {
      primary: 'social_skills',
      secondary: ['communication', 'teamwork'],
      materials: ['guías de interacción', 'roles claros', 'facilitador'],
      adaptations: ['trabajo en parejas', 'roles específicos', 'apoyo del profesor']
    },
    emotional_regulation: {
      primary: 'emotional_management',
      secondary: ['self_awareness', 'coping_strategies'],
      materials: ['emocionómetro', 'técnicas de respiración', 'diario emocional'],
      adaptations: ['espacio seguro', 'tiempo de reflexión', 'apoyo emocional']
    },
    math_difficulties: {
      primary: 'mathematical_thinking',
      secondary: ['problem_solving', 'logical_reasoning'],
      materials: ['manipulativos', 'ejemplos visuales', 'problemas paso a paso'],
      adaptations: ['tiempo extendido', 'ejemplos múltiples', 'verificación continua']
    }
  }
};

/**
 * Analiza un diagnóstico de estudiante y genera recomendaciones de IA
 */
const analyzeDiagnosis = async (diagnosticInfo) => {
  console.log('🤖 IA: Analizando diagnóstico del estudiante...', diagnosticInfo);
  
  // Simular procesamiento de IA
  await new Promise(resolve => setTimeout(resolve, AI_CONFIG.PROCESSING_DELAY));
  
  const analysis = {
    learningProfile: generateLearningProfile(diagnosticInfo),
    priorityNeeds: identifyPriorityNeeds(diagnosticInfo),
    recommendedApproaches: generateRecommendedApproaches(diagnosticInfo),
    riskFactors: identifyRiskFactors(diagnosticInfo),
    strengths: identifyStrengths(diagnosticInfo)
  };
  
  console.log('🤖 IA: Análisis completado:', analysis);
  return analysis;
};

/**
 * Genera actividades personalizadas basadas en el análisis de IA
 */
const generatePersonalizedActivities = async (piarData, analysis) => {
  console.log('🤖 IA: Generando actividades personalizadas...', { piarData, analysis });
  
  // Simular procesamiento de IA
  await new Promise(resolve => setTimeout(resolve, AI_CONFIG.PROCESSING_DELAY));
  
  const activities = [];
  
  // Generar actividades basadas en necesidades específicas
  if (piarData.specific_needs) {
    for (const need of piarData.specific_needs) {
      const needActivities = generateActivitiesForNeed(need, piarData.diagnostic_info, analysis);
      activities.push(...needActivities);
    }
  }
  
  // Generar actividades basadas en objetivos
  if (piarData.goals) {
    for (const goal of piarData.goals) {
      const goalActivities = generateActivitiesForGoal(goal, piarData.diagnostic_info, analysis);
      activities.push(...goalActivities);
    }
  }
  
  // Generar actividades de refuerzo basadas en fortalezas
  const strengthActivities = generateStrengthBasedActivities(analysis.strengths, piarData.diagnostic_info);
  activities.push(...strengthActivities);
  
  console.log('🤖 IA: Actividades generadas:', activities.length);
  return activities;
};

/**
 * Genera un plan de apoyo automático completo
 */
const generateAutoSupportPlan = async (studentData, piarData) => {
  console.log('🤖 IA: Generando plan de apoyo automático...', { studentData, piarData });
  
  // Simular procesamiento de IA
  await new Promise(resolve => setTimeout(resolve, AI_CONFIG.PROCESSING_DELAY * 1.5));
  
  // Realizar análisis de IA una sola vez
  const aiAnalysis = await analyzeDiagnosis(piarData.diagnostic_info);
  
  const plan = {
    id: `auto-plan-${Date.now()}`,
    title: `Plan de Apoyo Automático - ${studentData.full_name}`,
    description: `Plan generado automáticamente por IA basado en análisis de diagnóstico`,
    generatedAt: new Date().toISOString(),
    studentId: studentData.id,
    studentName: studentData.full_name,
    
    // Análisis de IA
    aiAnalysis: aiAnalysis,
    
    // Actividades generadas
    activities: await generatePersonalizedActivities(piarData, aiAnalysis),
    
    // Recomendaciones de implementación
    implementation: {
      priority: determineImplementationPriority(piarData),
      timeline: generateTimeline(piarData),
      resources: generateResourceRecommendations(piarData),
      monitoring: generateMonitoringPlan(piarData)
    },
    
    // Métricas de éxito
    successMetrics: generateSuccessMetrics(piarData),
    
    // Próximos pasos
    nextSteps: generateNextSteps(piarData)
  };
  
  console.log('🤖 IA: Plan de apoyo generado:', plan);
  return plan;
};

// Funciones auxiliares para análisis de IA

function generateLearningProfile(diagnosticInfo) {
  const profile = {
    style: diagnosticInfo.learning_style,
    attention: diagnosticInfo.attention_span,
    academicLevel: {
      reading: diagnosticInfo.reading_level,
      math: diagnosticInfo.math_level
    },
    social: diagnosticInfo.social_skills,
    emotional: diagnosticInfo.emotional_regulation,
    communication: diagnosticInfo.communication_style
  };
  
  // Agregar insights de IA
  profile.insights = generateLearningInsights(profile);
  profile.recommendations = generateProfileRecommendations(profile);
  
  return profile;
}

function generateLearningInsights(profile) {
  const insights = [];
  
  if (profile.style === 'visual' && profile.attention === 'short') {
    insights.push('Aprendizaje visual con atención limitada - requiere materiales visuales y actividades cortas');
  }
  
  if (profile.academicLevel.reading === 'basic' && profile.communication === 'verbal_preferred') {
    insights.push('Lectura básica con preferencia verbal - combinar apoyo visual con explicaciones orales');
  }
  
  if (profile.social === 'developing' && profile.emotional === 'needs_support') {
    insights.push('Habilidades sociales en desarrollo con necesidades emocionales - requiere apoyo socioemocional integrado');
  }
  
  return insights;
}

function generateProfileRecommendations(profile) {
  const recommendations = [];
  
  // Recomendaciones basadas en estilo de aprendizaje
  if (profile.style === 'visual') {
    recommendations.push('Usar diagramas, imágenes y mapas conceptuales');
    recommendations.push('Incorporar colores y elementos visuales en las actividades');
  } else if (profile.style === 'kinesthetic') {
    recommendations.push('Incluir actividades manipulativas y movimiento');
    recommendations.push('Usar materiales concretos y experiencias prácticas');
  }
  
  // Recomendaciones basadas en capacidad de atención
  if (profile.attention === 'short') {
    recommendations.push('Dividir actividades en segmentos de 5-10 minutos');
    recommendations.push('Incluir descansos frecuentes y cambios de actividad');
  }
  
  return recommendations;
}

function identifyPriorityNeeds(diagnosticInfo) {
  const needs = [];
  
  if (diagnosticInfo.reading_level === 'basic') {
    needs.push({
      category: 'academic',
      need: 'reading_support',
      priority: 'high',
      description: 'Necesita apoyo intensivo en lectura'
    });
  }
  
  if (diagnosticInfo.attention_span === 'short') {
    needs.push({
      category: 'behavioral',
      need: 'attention_management',
      priority: 'high',
      description: 'Requiere estrategias para mantener la atención'
    });
  }
  
  if (diagnosticInfo.social_skills === 'developing') {
    needs.push({
      category: 'social',
      need: 'peer_interaction',
      priority: 'medium',
      description: 'Necesita apoyo para interacción social'
    });
  }
  
  return needs.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

function generateRecommendedApproaches(diagnosticInfo) {
  const approaches = [];
  
  // Enfoque multisensorial si hay dificultades
  if (diagnosticInfo.reading_level === 'basic' || diagnosticInfo.math_level === 'basic') {
    approaches.push({
      name: 'Enfoque Multisensorial',
      description: 'Integrar visual, auditivo y kinestésico',
      effectiveness: 'high',
      implementation: 'Usar materiales que involucren múltiples sentidos'
    });
  }
  
  // Enfoque de apoyo emocional
  if (diagnosticInfo.emotional_regulation === 'needs_support') {
    approaches.push({
      name: 'Apoyo Socioemocional',
      description: 'Integrar habilidades emocionales en el aprendizaje',
      effectiveness: 'high',
      implementation: 'Incluir actividades de regulación emocional'
    });
  }
  
  return approaches;
}

function identifyRiskFactors(diagnosticInfo) {
  const risks = [];
  
  if (diagnosticInfo.reading_level === 'basic' && diagnosticInfo.attention_span === 'short') {
    risks.push({
      factor: 'Doble dificultad académica',
      level: 'high',
      description: 'Combinación de lectura básica y atención limitada',
      mitigation: 'Apoyo intensivo y actividades adaptadas'
    });
  }
  
  if (diagnosticInfo.social_skills === 'developing' && diagnosticInfo.emotional_regulation === 'needs_support') {
    risks.push({
      factor: 'Aislamiento social',
      level: 'medium',
      description: 'Riesgo de aislamiento por dificultades sociales y emocionales',
      mitigation: 'Intervención socioemocional temprana'
    });
  }
  
  return risks;
}

function identifyStrengths(diagnosticInfo) {
  const strengths = [];
  
  if (diagnosticInfo.communication_style === 'verbal_preferred') {
    strengths.push({
      area: 'Comunicación Verbal',
      description: 'Prefiere comunicación oral',
      utilization: 'Usar explicaciones verbales y discusiones'
    });
  }
  
  if (diagnosticInfo.learning_style === 'visual') {
    strengths.push({
      area: 'Aprendizaje Visual',
      description: 'Aprende mejor con elementos visuales',
      utilization: 'Incorporar gráficos, diagramas y materiales visuales'
    });
  }
  
  return strengths;
}

function generateActivitiesForNeed(need, diagnosticInfo, analysis) {
  const activities = [];
  const activityConfig = AI_CONFIG.ACTIVITY_TYPES[need.need];
  
  if (!activityConfig) return activities;
  
  // Generar actividad principal
  activities.push({
    id: `activity-${need.need}-${Date.now()}`,
    type: activityConfig.primary,
    title: `Actividad de ${need.category}`,
    description: `Actividad personalizada para ${need.description}`,
    duration: getOptimalDuration(diagnosticInfo.attention_span),
    difficulty: determineDifficulty(diagnosticInfo),
    materials: activityConfig.materials,
    adaptations: activityConfig.adaptations,
    based_on_need: need.need,
    priority: need.priority,
    aiGenerated: true,
    aiInsights: generateActivityInsights(need, diagnosticInfo)
  });
  
  // Generar actividad secundaria si es necesario
  if (need.priority === 'high' && activityConfig.secondary) {
    activities.push({
      id: `activity-${need.need}-secondary-${Date.now()}`,
      type: activityConfig.secondary[0],
      title: `Refuerzo de ${need.category}`,
      description: `Actividad complementaria para fortalecer ${need.description}`,
      duration: Math.floor(getOptimalDuration(diagnosticInfo.attention_span) * 0.7),
      difficulty: 'beginner',
      materials: activityConfig.materials.slice(0, 2),
      adaptations: activityConfig.adaptations.slice(0, 2),
      based_on_need: need.need,
      priority: 'medium',
      aiGenerated: true,
      aiInsights: `Refuerzo automático generado para ${need.description}`
    });
  }
  
  return activities;
}

function generateActivitiesForGoal(goal, diagnosticInfo, analysis) {
  const activities = [];
  
  activities.push({
    id: `goal-activity-${goal.id}-${Date.now()}`,
    type: 'goal_oriented',
    title: `Actividad para: ${goal.description}`,
    description: `Actividad específica para alcanzar el objetivo "${goal.description}"`,
    duration: getOptimalDuration(diagnosticInfo.attention_span),
    difficulty: determineDifficulty(diagnosticInfo),
    materials: ['materiales específicos del objetivo', 'herramientas de seguimiento'],
    adaptations: ['adaptaciones según necesidad', 'apoyo personalizado'],
    based_on_goal: goal.id,
    targetDate: goal.target_date,
    currentProgress: goal.progress,
    aiGenerated: true,
    aiInsights: `Actividad generada para alcanzar ${goal.progress}% de progreso hacia el objetivo`
  });
  
  return activities;
}

function generateStrengthBasedActivities(strengths, diagnosticInfo) {
  const activities = [];
  
  for (const strength of strengths) {
    activities.push({
      id: `strength-${strength.area.toLowerCase().replace(' ', '-')}-${Date.now()}`,
      type: 'strength_building',
      title: `Fortalecer: ${strength.area}`,
      description: `Actividad para desarrollar y aprovechar ${strength.description}`,
      duration: getOptimalDuration(diagnosticInfo.attention_span),
      difficulty: 'intermediate',
      materials: ['materiales para fortalecer fortalezas'],
      adaptations: ['adaptaciones para maximizar potencial'],
      based_on_strength: strength.area,
      aiGenerated: true,
      aiInsights: `Actividad diseñada para maximizar ${strength.description}`
    });
  }
  
  return activities;
}

function getOptimalDuration(attentionSpan) {
  const durationMap = {
    short: 10,
    medium: 20,
    long: 30
  };
  return durationMap[attentionSpan] || 15;
}

function determineDifficulty(diagnosticInfo) {
  if (diagnosticInfo.reading_level === 'basic' || diagnosticInfo.math_level === 'basic') {
    return 'beginner';
  } else if (diagnosticInfo.reading_level === 'advanced' || diagnosticInfo.math_level === 'advanced') {
    return 'advanced';
  }
  return 'intermediate';
}

function generateActivityInsights(need, diagnosticInfo) {
  return `Actividad generada automáticamente basada en análisis de ${need.category}. Prioridad: ${need.priority}. Duración optimizada para capacidad de atención ${diagnosticInfo.attention_span}.`;
}

function determineImplementationPriority(piarData) {
  const highPriorityNeeds = piarData.specific_needs?.filter(n => n.priority === 'high') || [];
  return highPriorityNeeds.length > 0 ? 'high' : 'medium';
}

function generateTimeline(piarData) {
  return {
    immediate: 'Próximas 2 semanas',
    shortTerm: '1-2 meses',
    longTerm: '3-6 meses',
    review: 'Revisión mensual recomendada'
  };
}

function generateResourceRecommendations(piarData) {
  return {
    materials: ['Materiales adaptados según necesidades específicas'],
    personnel: ['Apoyo del psicopedagogo', 'Colaboración con profesores'],
    technology: ['Herramientas de seguimiento digital', 'Recursos multimedia'],
    environment: ['Espacios adaptados según necesidades']
  };
}

function generateMonitoringPlan(piarData) {
  return {
    frequency: 'Semanal',
    metrics: ['Progreso en objetivos', 'Participación', 'Satisfacción'],
    tools: ['Registro de observaciones', 'Evaluaciones adaptadas'],
    adjustments: 'Revisión y ajuste según progreso'
  };
}

function generateSuccessMetrics(piarData) {
  return {
    academic: ['Mejora en niveles de lectura/matemáticas', 'Cumplimiento de objetivos'],
    behavioral: ['Mejora en atención', 'Reducción de comportamientos disruptivos'],
    social: ['Mejora en interacción con pares', 'Participación en actividades grupales'],
    emotional: ['Mejor regulación emocional', 'Aumento de autoestima']
  };
}

function generateNextSteps(piarData) {
  return [
    'Implementar actividades prioritarias',
    'Establecer rutina de seguimiento',
    'Coordinar con equipo educativo',
    'Comunicar progreso a familia',
    'Planificar revisión y ajustes'
  ];
}

// Export named exports
export {
  analyzeDiagnosis,
  generatePersonalizedActivities,
  generateAutoSupportPlan
};

// Export default
export default {
  analyzeDiagnosis,
  generatePersonalizedActivities,
  generateAutoSupportPlan
};
