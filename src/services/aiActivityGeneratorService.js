import { useToast } from '@/components/ui/use-toast';
import geminiDashboardService, { getAISuggestion, generateContent } from './geminiDashboardService';

/**
 * Servicio de IA para generación automática de actividades
 * Analiza diagnósticos y genera planes de apoyo personalizados usando Gemini AI
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
 * Analiza un diagnóstico de estudiante y genera recomendaciones de IA usando Gemini
 */
const analyzeDiagnosis = async (diagnosticInfo) => {
  console.log('🤖 Gemini AI: Analizando diagnóstico del estudiante...', diagnosticInfo);
  
  try {
    // Crear prompt para análisis de diagnóstico
    const prompt = `
Como experto en psicopedagogía y análisis de diagnósticos educativos, analiza el siguiente perfil de estudiante y proporciona un análisis detallado:

INFORMACIÓN DEL ESTUDIANTE:
${JSON.stringify(diagnosticInfo, null, 2)}

Por favor, proporciona un análisis estructurado que incluya:

1. PERFIL DE APRENDIZAJE:
   - Estilo de aprendizaje predominante
   - Capacidades de atención y concentración
   - Nivel académico actual
   - Fortalezas identificadas

2. NECESIDADES PRIORITARIAS:
   - Necesidades académicas urgentes
   - Necesidades conductuales
   - Necesidades socioemocionales
   - Necesidades de comunicación

3. ENFOQUES RECOMENDADOS:
   - Estrategias pedagógicas más efectivas
   - Adaptaciones necesarias
   - Recursos recomendados

4. FACTORES DE RIESGO:
   - Áreas de preocupación
   - Posibles dificultades futuras
   - Estrategias de prevención

5. FORTALEZAS A APROVECHAR:
   - Áreas de competencia
   - Habilidades desarrolladas
   - Potencial a desarrollar

Responde en formato JSON estructurado para facilitar el procesamiento automático.
`;

    // Llamar a Gemini AI
    const result = await geminiDashboardService.generatePsychopedagogueAnalysis(
      { full_name: 'Análisis de Diagnóstico' }, 
      diagnosticInfo, 
      [] // Pasar array vacío en lugar de objeto vacío
    );
    
    if (result.success) {
      console.log('🤖 Gemini AI: Análisis completado exitosamente');
      
      // Parsear la respuesta de Gemini si es JSON
      let aiAnalysis;
      try {
        aiAnalysis = JSON.parse(result.data);
      } catch (parseError) {
        // Si no es JSON válido, crear estructura con la respuesta
        aiAnalysis = {
          learningProfile: generateLearningProfile(diagnosticInfo),
          priorityNeeds: identifyPriorityNeeds(diagnosticInfo),
          recommendedApproaches: generateRecommendedApproaches(diagnosticInfo),
          riskFactors: identifyRiskFactors(diagnosticInfo),
          strengths: identifyStrengths(diagnosticInfo),
          aiInsights: result.data
        };
      }
      
      return aiAnalysis;
    } else {
      console.warn('🤖 Gemini AI: Error en análisis, usando fallback');
      // Fallback a análisis local si Gemini falla
      return {
        learningProfile: generateLearningProfile(diagnosticInfo),
        priorityNeeds: identifyPriorityNeeds(diagnosticInfo),
        recommendedApproaches: generateRecommendedApproaches(diagnosticInfo),
        riskFactors: identifyRiskFactors(diagnosticInfo),
        strengths: identifyStrengths(diagnosticInfo),
        aiInsights: 'Análisis generado localmente (IA no disponible)'
      };
    }
  } catch (error) {
    console.error('🤖 Gemini AI: Error en análisis:', error);
    // Fallback a análisis local
    return {
      learningProfile: generateLearningProfile(diagnosticInfo),
      priorityNeeds: identifyPriorityNeeds(diagnosticInfo),
      recommendedApproaches: generateRecommendedApproaches(diagnosticInfo),
      riskFactors: identifyRiskFactors(diagnosticInfo),
      strengths: identifyStrengths(diagnosticInfo),
      aiInsights: 'Análisis generado localmente (Error de IA)'
    };
  }
};

/**
 * Genera actividades personalizadas basadas en el análisis de IA usando Gemini
 */
const generatePersonalizedActivities = async (piarData, analysis) => {
  console.log('🤖 Gemini AI: Generando actividades personalizadas...', { piarData, analysis });
  
  try {
    // Crear prompt para generación de actividades
    const prompt = `
Eres un especialista en educación especial con más de 20 años de experiencia diseñando intervenciones educativas personalizadas. Tu tarea es crear actividades educativas altamente específicas y detalladas basadas en evidencia científica.

DATOS DEL PIAR:
${JSON.stringify(piarData, null, 2)}

ANÁLISIS DE IA:
${JSON.stringify(analysis, null, 2)}

INSTRUCCIONES CRÍTICAS:
1. Cada actividad debe ser específicamente diseñada para las necesidades únicas del estudiante
2. Debe incluir adaptaciones concretas y materiales específicos
3. Debe tener objetivos medibles y criterios de evaluación claros
4. Debe considerar el nivel de desarrollo y capacidades del estudiante
5. Debe ser implementable en el contexto escolar real
6. Debe estar basada en evidencia científica y mejores prácticas

Genera un conjunto completo de actividades en formato JSON estructurado:

{
  "activities": [
    {
      "id": "ID único de la actividad",
      "title": "Título específico y descriptivo de la actividad",
      "description": "Descripción detallada paso a paso de la actividad",
      "objective": "Objetivo específico y medible de la actividad",
      "duration": "Duración en minutos",
      "difficulty": "beginner/intermediate/advanced",
      "priority": "high/medium/low",
      "category": "academic/behavioral/social/emotional/physical",
      "subject": "Área académica específica",
      "targetNeeds": ["Necesidad específica 1", "Necesidad específica 2"],
      "targetGoals": ["Objetivo del PIAR 1", "Objetivo del PIAR 2"],
      "materials": [
        {
          "name": "Nombre específico del material",
          "description": "Descripción detallada del material",
          "quantity": "Cantidad necesaria",
          "alternative": "Alternativa si no está disponible"
        }
      ],
      "adaptations": [
        {
          "type": "visual/auditory/kinesthetic/time/space",
          "description": "Descripción específica de la adaptación",
          "rationale": "Por qué es necesaria esta adaptación",
          "implementation": "Cómo implementar la adaptación"
        }
      ],
      "instructions": {
        "preparation": "Pasos específicos de preparación",
        "implementation": [
          "Paso 1: Descripción detallada",
          "Paso 2: Descripción detallada",
          "Paso 3: Descripción detallada"
        ],
        "closure": "Cómo finalizar la actividad",
        "cleanup": "Instrucciones de limpieza"
      },
      "assessment": {
        "criteria": ["Criterio específico 1", "Criterio específico 2"],
        "methods": ["Método de evaluación 1", "Método de evaluación 2"],
        "tools": ["Herramienta de evaluación 1", "Herramienta de evaluación 2"],
        "rubric": {
          "excellent": "Descripción de desempeño excelente",
          "good": "Descripción de desempeño bueno",
          "satisfactory": "Descripción de desempeño satisfactorio",
          "needs_improvement": "Descripción de áreas de mejora"
        }
      },
      "differentiation": {
        "for_struggling": "Cómo adaptar para estudiantes con dificultades",
        "for_advanced": "Cómo extender para estudiantes avanzados",
        "for_different_learning_styles": "Adaptaciones por estilo de aprendizaje"
      },
      "integration": {
        "with_curriculum": "Cómo se integra con el currículo regular",
        "cross_subject": "Conexiones con otras materias",
        "real_world": "Aplicaciones en la vida real"
      },
      "monitoring": {
        "progress_indicators": ["Indicador 1", "Indicador 2"],
        "data_collection": "Cómo recopilar datos de progreso",
        "frequency": "Con qué frecuencia evaluar",
        "adjustments": "Cuándo y cómo hacer ajustes"
      },
      "aiInsights": "Análisis específico de cómo esta actividad aborda las necesidades del PIAR",
      "evidence": "Base científica que sustenta esta actividad",
      "variations": [
        {
          "name": "Nombre de la variación",
          "description": "Cómo varía la actividad",
          "when_to_use": "Cuándo usar esta variación"
        }
      ]
    }
  ]
}

IMPORTANTE: Responde SOLO con el JSON válido, sin texto adicional. Genera al menos 5-8 actividades específicas y detalladas.
`;

    // Llamar directamente a Gemini AI con el prompt mejorado
    const result = await generateContent(prompt);
    
    if (result.success) {
      console.log('🤖 Gemini AI: Actividades generadas exitosamente');
      
      // Parsear la respuesta de Gemini si es JSON
      let aiActivities;
      try {
        aiActivities = JSON.parse(result.data);
        
        // Asegurar que sea un array
        if (!Array.isArray(aiActivities)) {
          aiActivities = [aiActivities];
        }
        
        // Agregar metadatos de IA
        aiActivities = aiActivities.map((activity, index) => ({
          ...activity,
          id: `gemini-activity-${Date.now()}-${index}`,
          aiGenerated: true,
          generatedBy: 'Gemini AI',
          timestamp: new Date().toISOString()
        }));
        
        return aiActivities;
      } catch (parseError) {
        console.warn('🤖 Gemini AI: Error parseando actividades, usando fallback');
        // Fallback a generación local
        return generateFallbackActivities(piarData, analysis);
      }
    } else {
      console.warn('🤖 Gemini AI: Error generando actividades, usando fallback');
      return generateFallbackActivities(piarData, analysis);
    }
  } catch (error) {
    console.error('🤖 Gemini AI: Error en generación de actividades:', error);
    return generateFallbackActivities(piarData, analysis);
  }
};

/**
 * Genera actividades de fallback cuando Gemini no está disponible
 */
const generateFallbackActivities = (piarData, analysis) => {
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
  
  console.log('🤖 Fallback: Actividades generadas localmente:', activities.length);
  return activities;
};

/**
 * Genera un plan de apoyo automático completo usando Gemini AI
 */
const generateAutoSupportPlan = async (studentData, piarData) => {
  console.log('🤖 Gemini AI: Generando plan de apoyo automático...', { studentData, piarData });
  
  try {
    // Realizar análisis de IA una sola vez
    const aiAnalysis = await analyzeDiagnosis(piarData.diagnostic_info);
    
    // Crear prompt para plan de apoyo completo
    const prompt = `
Eres un psicopedagogo clínico experto con más de 20 años de experiencia diseñando planes de apoyo educativo integrales. Tu tarea es crear un plan de apoyo altamente específico, detallado y basado en evidencia científica.

DATOS DEL ESTUDIANTE:
${JSON.stringify(studentData, null, 2)}

DATOS DEL PIAR:
${JSON.stringify(piarData, null, 2)}

ANÁLISIS DE IA REALIZADO:
${JSON.stringify(aiAnalysis, null, 2)}

INSTRUCCIONES CRÍTICAS:
1. El plan debe ser altamente específico y personalizado
2. Debe incluir estrategias basadas en evidencia científica
3. Debe tener objetivos SMART (específicos, medibles, alcanzables, relevantes, temporales)
4. Debe considerar el contexto escolar y familiar
5. Debe incluir evaluaciones y seguimiento continuo
6. Debe ser implementable por el equipo educativo

Genera un plan de apoyo integral en formato JSON estructurado:

{
  "summary": "Resumen ejecutivo detallado del plan de apoyo, incluyendo perfil del estudiante, necesidades principales y objetivos prioritarios",
  "implementation": {
    "timeline": {
      "immediate": "Acciones inmediatas específicas (0-2 semanas) con fechas concretas",
      "shortTerm": "Objetivos específicos a corto plazo (1-3 meses) con indicadores medibles",
      "longTerm": "Objetivos específicos a largo plazo (3-12 meses) con metas claras",
      "review": "Fechas específicas de revisión y evaluación con criterios de evaluación"
    },
    "resources": {
      "materials": ["Material específico 1 con descripción detallada", "Material específico 2 con especificaciones"],
      "personnel": ["Profesional 1 con responsabilidades específicas", "Profesional 2 con rol definido"],
      "training": ["Capacitación específica 1 con objetivos claros", "Capacitación específica 2 con duración y contenidos"],
      "technology": ["Tecnología específica 1 con uso definido", "Tecnología específica 2 con capacitación requerida"]
    },
    "monitoring": {
      "frequency": "Frecuencia específica de monitoreo (diario/semanal/mensual)",
      "methods": ["Método específico 1 con protocolo", "Método específico 2 con criterios"],
      "responsibilities": "Responsabilidades específicas de cada profesional con horarios y tareas",
      "documentation": "Protocolo específico de documentación con formatos y frecuencia"
    }
  },
  "recommendations": [
    {
      "category": "academic/behavioral/social/emotional",
      "title": "Recomendación específica con título descriptivo",
      "description": "Descripción detallada de la recomendación con justificación",
      "rationale": "Por qué es importante esta recomendación basada en evidencia",
      "implementation": "Pasos específicos para implementar la recomendación",
      "timeline": "Cronograma específico para implementar la recomendación",
      "expectedOutcome": "Resultado esperado específico y medible",
      "evaluation": "Cómo se evaluará el éxito de esta recomendación"
    }
  ],
  "successMetrics": {
    "academic": ["Métrica académica específica 1 con criterios", "Métrica académica específica 2 con indicadores"],
    "behavioral": ["Métrica conductual específica 1 con observaciones", "Métrica conductual específica 2 con registros"],
    "social": ["Métrica social específica 1 con interacciones", "Métrica social específica 2 con habilidades"],
    "emotional": ["Métrica emocional específica 1 con regulación", "Métrica emocional específica 2 con bienestar"]
  },
  "collaboration": {
    "teamMembers": [
      {
        "role": "Rol específico",
        "name": "Nombre del profesional",
        "responsibilities": ["Responsabilidad específica 1", "Responsabilidad específica 2"],
        "meetingFrequency": "Frecuencia de reuniones",
        "communicationMethod": "Método de comunicación preferido"
      }
    ],
    "familyInvolvement": {
      "communication": "Protocolo específico de comunicación con la familia",
      "training": "Capacitación específica para la familia",
      "support": "Apoyo específico que la familia puede proporcionar",
      "meetings": "Frecuencia y estructura de reuniones familiares"
    }
  },
  "riskManagement": {
    "potentialRisks": [
      {
        "risk": "Riesgo específico identificado",
        "probability": "Probabilidad de ocurrencia",
        "impact": "Impacto potencial",
        "mitigation": "Estrategias específicas de mitigación",
        "monitoring": "Cómo monitorear este riesgo"
      }
    ],
    "contingencyPlans": [
      {
        "scenario": "Escenario específico",
        "response": "Respuesta específica planificada",
        "resources": "Recursos necesarios para la respuesta",
        "timeline": "Tiempo de respuesta esperado"
      }
    ]
  }
}

IMPORTANTE: Responde SOLO con el JSON válido, sin texto adicional. El plan debe ser altamente específico y detallado.
`;

    // Llamar directamente a Gemini AI con el prompt mejorado
    const result = await generateContent(prompt);
    
    let aiPlan;
    if (result.success) {
      try {
        aiPlan = JSON.parse(result.data);
      } catch (parseError) {
        console.warn('🤖 Gemini AI: Error parseando plan, usando estructura base');
        aiPlan = {
          summary: result.data,
          implementation: generateTimeline(piarData),
          recommendations: generateResourceRecommendations(piarData)
        };
      }
    } else {
      console.warn('🤖 Gemini AI: Error generando plan, usando fallback');
      aiPlan = {
        summary: 'Plan generado localmente',
        implementation: generateTimeline(piarData),
        recommendations: generateResourceRecommendations(piarData)
      };
    }
    
    // Generar actividades personalizadas
    const activities = await generatePersonalizedActivities(piarData, aiAnalysis);
    
    const plan = {
      id: `auto-plan-${Date.now()}`,
      title: `Plan de Apoyo Automático - ${studentData.full_name}`,
      description: `Plan generado automáticamente por Gemini AI basado en análisis de diagnóstico`,
      generatedAt: new Date().toISOString(),
      studentId: studentData.id,
      studentName: studentData.full_name,
      generatedBy: 'Gemini AI',
      
      // Análisis de IA
      aiAnalysis: aiAnalysis,
      
      // Plan generado por IA
      aiPlan: aiPlan,
      
      // Actividades generadas
      activities: activities,
      
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
    
    console.log('🤖 Gemini AI: Plan de apoyo generado exitosamente:', plan);
    return plan;
  } catch (error) {
    console.error('🤖 Gemini AI: Error generando plan de apoyo:', error);
    
    // Fallback completo
    const aiAnalysis = await analyzeDiagnosis(piarData.diagnostic_info);
    const activities = await generatePersonalizedActivities(piarData, aiAnalysis);
    
    return {
      id: `auto-plan-${Date.now()}`,
      title: `Plan de Apoyo Automático - ${studentData.full_name}`,
      description: `Plan generado localmente (IA no disponible)`,
      generatedAt: new Date().toISOString(),
      studentId: studentData.id,
      studentName: studentData.full_name,
      generatedBy: 'Sistema Local',
      
      aiAnalysis: aiAnalysis,
      activities: activities,
      implementation: {
        priority: determineImplementationPriority(piarData),
        timeline: generateTimeline(piarData),
        resources: generateResourceRecommendations(piarData),
        monitoring: generateMonitoringPlan(piarData)
      },
      successMetrics: generateSuccessMetrics(piarData),
      nextSteps: generateNextSteps(piarData)
    };
  }
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
