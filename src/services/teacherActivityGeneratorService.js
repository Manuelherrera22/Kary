import { generateContent } from './geminiDashboardService';

/**
 * Servicio para generar actividades educativas basadas en planes de apoyo
 * Específico para profesores que reciben planes del psicopedagogo
 */
export class TeacherActivityGeneratorService {
  
  /**
   * Genera actividades personalizadas basadas en un plan de apoyo
   * @param {Object} plan - Plan de apoyo recibido del psicopedagogo
   * @param {string} subject - Materia específica para generar actividades
   * @param {Object} additionalContext - Contexto adicional del profesor
   * @returns {Promise<Object>} - Actividades generadas con IA
   */
  static async generateActivitiesFromPlan(plan, subject = 'Todas las Materias', additionalContext = {}) {
    try {
      console.log('🎓 Generando actividades para profesor basadas en plan de apoyo...');
      
      const prompt = this.buildTeacherPrompt(plan, subject, additionalContext);
      
      const result = await generateContent(prompt);
      
      if (result.success) {
        console.log('✅ Actividades generadas exitosamente para profesor');
        return {
          success: true,
          activities: this.parseGeneratedActivities(result.data),
          planId: plan.id,
          studentName: plan.studentName,
          generatedAt: new Date().toISOString()
        };
      } else {
        console.error('❌ Error generando actividades:', result.error);
        return {
          success: false,
          error: result.error,
          fallbackActivities: this.getFallbackActivities(plan, subject)
        };
      }
    } catch (error) {
      console.error('❌ Error en generación de actividades para profesor:', error);
      return {
        success: false,
        error: error.message,
        fallbackActivities: this.getFallbackActivities(plan, subject)
      };
    }
  }

  /**
   * Construye el prompt específico para profesores
   * @param {Object} plan - Plan de apoyo
   * @param {string} subject - Materia
   * @param {Object} additionalContext - Contexto adicional
   * @returns {string} - Prompt completo
   */
  static buildTeacherPrompt(plan, subject, additionalContext) {
    return `
Eres un asistente de IA especializado en educación que ayuda a profesores a crear actividades personalizadas basadas en planes de apoyo psicopedagógicos.

INFORMACIÓN DEL ESTUDIANTE:
- Nombre: ${plan.studentName}
- Grado: ${plan.grade}
- Plan de Apoyo: ${plan.planTitle}

RECOMENDACIONES DEL PSICOPEDAGOGO:
${plan.recommendations.map(rec => `- ${rec}`).join('\n')}

RESUMEN DEL PLAN:
${plan.summary}

MATERIA SOLICITADA: ${subject}

CONTEXTO ADICIONAL DEL PROFESOR:
${additionalContext.notes || 'Sin notas adicionales'}

INSTRUCCIONES ESPECÍFICAS:
1. Crea actividades que implementen DIRECTAMENTE las recomendaciones del psicopedagogo
2. Adapta las actividades al nivel de grado específico (${plan.grade})
3. Incluye elementos visuales si se recomienda
4. Proporciona adaptaciones específicas para necesidades especiales
5. Asegúrate de que las actividades sean implementables en el aula
6. Incluye métodos de evaluación apropiados

FORMATO DE RESPUESTA REQUERIDO (JSON válido):
{
  "activities": [
    {
      "id": "act-teacher-001",
      "title": "Título específico de la actividad",
      "description": "Descripción detallada de la actividad",
      "objective": "Objetivo específico y medible",
      "duration": 45,
      "difficulty": "Intermedio",
      "priority": "Alta",
      "category": "Categoría educativa",
      "materials": ["Material 1", "Material 2", "Material 3"],
      "adaptations": "Adaptaciones específicas para el estudiante",
      "instructions": "Instrucciones paso a paso para el profesor",
      "assessment": "Método de evaluación",
      "gradeLevel": "${plan.grade}",
      "subject": "${subject}",
      "learningStyle": "Estilo de aprendizaje recomendado",
      "cognitiveDomain": "Dominio cognitivo trabajado",
      "basedOnRecommendations": ["Recomendación 1", "Recomendación 2"],
      "teacherNotes": "Notas específicas para el profesor",
      "implementationTips": "Consejos para implementar la actividad"
    }
  ]
}

IMPORTANTE: 
- Responde SOLO con JSON válido
- Evita comillas dobles dentro de strings
- Incluye al menos 3 actividades diferentes
- Cada actividad debe implementar al menos una recomendación específica
- Las actividades deben ser prácticas y realizables en el aula
`;
  }

  /**
   * Parsea las actividades generadas por la IA
   * @param {string} data - Datos JSON de respuesta
   * @returns {Array} - Array de actividades parseadas
   */
  static parseGeneratedActivities(data) {
    try {
      const parsed = JSON.parse(data);
      return parsed.activities || [];
    } catch (error) {
      console.error('❌ Error parseando actividades generadas:', error);
      return [];
    }
  }

  /**
   * Actividades de fallback específicas para profesores
   * @param {Object} plan - Plan de apoyo
   * @param {string} subject - Materia
   * @returns {Array} - Actividades de fallback
   */
  static getFallbackActivities(plan, subject) {
    const baseActivities = [
      {
        id: `fallback-teacher-${Date.now()}-1`,
        title: `Actividad de ${subject} - Comprensión Visual`,
        description: `Actividad personalizada para ${plan.studentName} basada en las recomendaciones del plan de apoyo, enfocada en ${subject}`,
        objective: `Mejorar habilidades en ${subject} mediante estrategias visuales recomendadas`,
        duration: 45,
        difficulty: 'Intermedio',
        priority: 'Alta',
        category: subject,
        materials: ['Materiales básicos', 'Recursos visuales', 'Fichas de trabajo'],
        adaptations: 'Tiempo extra y apoyo visual según recomendaciones del plan',
        instructions: '1. Presentación visual del contenido. 2. Actividades guiadas. 3. Evaluación formativa.',
        assessment: 'Evaluación continua del progreso según el plan de apoyo',
        gradeLevel: plan.grade,
        subject: subject,
        learningStyle: 'Visual',
        cognitiveDomain: 'Comprensión y Aplicación',
        basedOnRecommendations: plan.recommendations.slice(0, 2),
        teacherNotes: 'Actividad diseñada específicamente para este estudiante basada en su plan de apoyo',
        implementationTips: 'Proporcionar apoyo visual y tiempo adicional según las recomendaciones',
        aiGenerated: true,
        generatedBy: 'Teacher AI Assistant (Fallback)',
        timestamp: new Date().toISOString(),
        basedOnPlan: plan.id
      },
      {
        id: `fallback-teacher-${Date.now()}-2`,
        title: `Actividad de ${subject} - Práctica Guiada`,
        description: `Ejercicios prácticos adaptados para ${plan.studentName} según las necesidades identificadas en su plan de apoyo`,
        objective: `Consolidar conocimientos en ${subject} mediante práctica estructurada`,
        duration: 40,
        difficulty: 'Intermedio',
        priority: 'Media',
        category: subject,
        materials: ['Ejercicios adaptados', 'Material de apoyo', 'Herramientas de evaluación'],
        adaptations: 'Instrucciones claras y apoyo individualizado',
        instructions: '1. Explicación del objetivo. 2. Demostración práctica. 3. Práctica guiada. 4. Evaluación.',
        assessment: 'Observación directa y registro de progreso',
        gradeLevel: plan.grade,
        subject: subject,
        learningStyle: 'Práctico',
        cognitiveDomain: 'Aplicación',
        basedOnRecommendations: plan.recommendations.slice(1, 3),
        teacherNotes: 'Enfocarse en las áreas específicas mencionadas en el plan de apoyo',
        implementationTips: 'Proporcionar retroalimentación constante y ajustar según el progreso',
        aiGenerated: true,
        generatedBy: 'Teacher AI Assistant (Fallback)',
        timestamp: new Date().toISOString(),
        basedOnPlan: plan.id
      }
    ];

    return baseActivities;
  }

  /**
   * Genera actividades específicas para una materia
   * @param {Object} plan - Plan de apoyo
   * @param {string} subject - Materia específica
   * @returns {Promise<Object>} - Actividades específicas de la materia
   */
  static async generateSubjectSpecificActivities(plan, subject) {
    const subjectContexts = {
      'Lengua y Literatura': {
        focus: 'comprensión lectora, vocabulario y expresión escrita',
        materials: ['textos adaptados', 'diccionarios', 'fichas de vocabulario'],
        strategies: ['lectura guiada', 'preguntas de comprensión', 'actividades de vocabulario']
      },
      'Matemáticas': {
        focus: 'razonamiento lógico-matemático y resolución de problemas',
        materials: ['manipulativos matemáticos', 'calculadoras', 'fichas de problemas'],
        strategies: ['problemas visuales', 'práctica guiada', 'ejercicios paso a paso']
      },
      'Ciencias Naturales': {
        focus: 'observación, experimentación y comprensión de conceptos científicos',
        materials: ['materiales de laboratorio', 'imágenes científicas', 'experimentos simples'],
        strategies: ['experimentación práctica', 'observación guiada', 'conexiones con la vida real']
      },
      'Ciencias Sociales': {
        focus: 'comprensión de conceptos sociales y geográficos',
        materials: ['mapas', 'imágenes históricas', 'recursos multimedia'],
        strategies: ['análisis visual', 'conexiones temporales', 'actividades de localización']
      }
    };

    const context = subjectContexts[subject] || subjectContexts['Lengua y Literatura'];
    
    const additionalContext = {
      notes: `Enfoque específico en ${context.focus}. Materiales sugeridos: ${context.materials.join(', ')}. Estrategias: ${context.strategies.join(', ')}.`
    };

    return await this.generateActivitiesFromPlan(plan, subject, additionalContext);
  }

  /**
   * Modifica una actividad existente usando IA
   * @param {Object} activity - Actividad a modificar
   * @param {Object} plan - Plan de apoyo
   * @param {string} modificationRequest - Solicitud de modificación
   * @returns {Promise<Object>} - Actividad modificada
   */
  static async modifyActivityWithAI(activity, plan, modificationRequest) {
    try {
      console.log('🔧 Modificando actividad con IA...');
      
      const prompt = `
Eres un asistente de IA que ayuda a profesores a modificar actividades educativas.

ACTIVIDAD ACTUAL:
${JSON.stringify(activity, null, 2)}

PLAN DE APOYO DEL ESTUDIANTE:
${JSON.stringify(plan, null, 2)}

SOLICITUD DE MODIFICACIÓN:
${modificationRequest}

INSTRUCCIONES:
1. Modifica la actividad según la solicitud
2. Mantén la coherencia con el plan de apoyo
3. Asegúrate de que siga siendo apropiada para el grado ${plan.grade}
4. Incluye las adaptaciones necesarias

Responde SOLO con JSON válido de la actividad modificada.
`;

      const result = await generateContent(prompt);
      
      if (result.success) {
        const modifiedActivity = JSON.parse(result.data);
        return {
          success: true,
          activity: {
            ...modifiedActivity,
            modifiedAt: new Date().toISOString(),
            originalId: activity.id,
            modificationRequest: modificationRequest
          }
        };
      } else {
        return {
          success: false,
          error: result.error,
          originalActivity: activity
        };
      }
    } catch (error) {
      console.error('❌ Error modificando actividad:', error);
      return {
        success: false,
        error: error.message,
        originalActivity: activity
      };
    }
  }
}

export default TeacherActivityGeneratorService;
