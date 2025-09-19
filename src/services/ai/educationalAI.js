/**
 * Servicio de IA Educativa Inteligente
 * Proporciona asistencia contextual para cada rol educativo
 */

import { supabase } from '@/lib/supabaseClient';

class EducationalAI {
  constructor() {
    this.apiEndpoint = process.env.REACT_APP_AI_ENDPOINT || 'http://localhost:3001/api/ai';
    this.contextCache = new Map();
    this.diagnosticPatterns = new Map();
  }

  /**
   * Genera un plan de apoyo personalizado basado en diagnósticos
   */
  async generateSupportPlan(studentId, diagnosticData, context = {}) {
    try {
      const studentProfile = await this.getStudentProfile(studentId);
      const diagnosticContext = await this.analyzeDiagnosticPatterns(diagnosticData);
      
      const prompt = this.buildSupportPlanPrompt(studentProfile, diagnosticContext, context);
      const response = await this.callAI(prompt, 'support_plan');
      
      return this.parseSupportPlanResponse(response);
    } catch (error) {
      console.error('Error generating support plan:', error);
      return this.getFallbackSupportPlan(studentId);
    }
  }

  /**
   * Genera alertas predictivas basadas en patrones de comportamiento
   */
  async generatePredictiveAlerts(studentId, behaviorData, academicData) {
    try {
      const patterns = await this.analyzeBehaviorPatterns(behaviorData, academicData);
      const riskAssessment = await this.assessRiskLevel(studentId, patterns);
      
      const prompt = this.buildPredictiveAlertPrompt(studentId, patterns, riskAssessment);
      const response = await this.callAI(prompt, 'predictive_alerts');
      
      return this.parseAlertResponse(response);
    } catch (error) {
      console.error('Error generating predictive alerts:', error);
      return [];
    }
  }

  /**
   * Genera tareas personalizadas según características del estudiante
   */
  async generatePersonalizedTasks(studentId, subject, difficulty, learningStyle) {
    try {
      const studentProfile = await this.getStudentProfile(studentId);
      const academicHistory = await this.getAcademicHistory(studentId);
      
      const prompt = this.buildTaskGenerationPrompt(studentProfile, academicHistory, {
        subject,
        difficulty,
        learningStyle
      });
      
      const response = await this.callAI(prompt, 'task_generation');
      return this.parseTaskResponse(response);
    } catch (error) {
      console.error('Error generating personalized tasks:', error);
      return this.getFallbackTasks(subject, difficulty);
    }
  }

  /**
   * Proporciona asistencia contextual para cada rol
   */
  async getRoleBasedAssistance(role, context, currentData) {
    try {
      const roleContext = this.buildRoleContext(role, context, currentData);
      const prompt = this.buildRoleAssistancePrompt(role, roleContext);
      
      const response = await this.callAI(prompt, 'role_assistance');
      return this.parseRoleResponse(response);
    } catch (error) {
      console.error('Error getting role-based assistance:', error);
      return this.getFallbackRoleAssistance(role);
    }
  }

  /**
   * Analiza diagnósticos y sugiere intervenciones
   */
  async analyzeDiagnosticsAndSuggestInterventions(diagnosticData) {
    try {
      const patterns = await this.identifyDiagnosticPatterns(diagnosticData);
      const interventions = await this.suggestInterventions(patterns);
      
      return {
        patterns,
        interventions,
        confidence: this.calculateConfidence(patterns),
        recommendations: this.prioritizeRecommendations(interventions)
      };
    } catch (error) {
      console.error('Error analyzing diagnostics:', error);
      return { patterns: [], interventions: [], confidence: 0, recommendations: [] };
    }
  }

  /**
   * Genera contenido educativo adaptativo
   */
  async generateAdaptiveContent(studentId, topic, learningObjectives) {
    try {
      const studentProfile = await this.getStudentProfile(studentId);
      const learningStyle = await this.identifyLearningStyle(studentId);
      
      const prompt = this.buildAdaptiveContentPrompt(studentProfile, learningStyle, topic, learningObjectives);
      const response = await this.callAI(prompt, 'adaptive_content');
      
      return this.parseContentResponse(response);
    } catch (error) {
      console.error('Error generating adaptive content:', error);
      return this.getFallbackContent(topic);
    }
  }

  // Métodos auxiliares privados

  async getStudentProfile(studentId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', studentId)
      .single();
    
    if (error) throw error;
    return data;
  }

  async getAcademicHistory(studentId) {
    const { data, error } = await supabase
      .from('academic_records')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async analyzeDiagnosticPatterns(diagnosticData) {
    // Análisis de patrones en diagnósticos
    const patterns = {
      academicStrengths: [],
      academicWeaknesses: [],
      emotionalIndicators: [],
      behavioralPatterns: [],
      learningPreferences: []
    };

    // Implementar lógica de análisis de patrones
    diagnosticData.forEach(diagnostic => {
      if (diagnostic.type === 'academic') {
        patterns.academicStrengths.push(...diagnostic.strengths || []);
        patterns.academicWeaknesses.push(...diagnostic.weaknesses || []);
      }
      if (diagnostic.type === 'emotional') {
        patterns.emotionalIndicators.push(...diagnostic.indicators || []);
      }
      if (diagnostic.type === 'behavioral') {
        patterns.behavioralPatterns.push(...diagnostic.patterns || []);
      }
    });

    return patterns;
  }

  buildSupportPlanPrompt(studentProfile, diagnosticContext, context) {
    return `
    Eres un experto en psicopedagogía y educación especializada. 
    
    PERFIL DEL ESTUDIANTE:
    - Nombre: ${studentProfile.full_name}
    - Grado: ${studentProfile.grade}
    - Edad: ${studentProfile.age || 'No especificada'}
    
    CONTEXTO DIAGNÓSTICO:
    - Fortalezas académicas: ${diagnosticContext.academicStrengths.join(', ')}
    - Debilidades académicas: ${diagnosticContext.academicWeaknesses.join(', ')}
    - Indicadores emocionales: ${diagnosticContext.emotionalIndicators.join(', ')}
    - Patrones conductuales: ${diagnosticContext.behavioralPatterns.join(', ')}
    
    CONTEXTO ADICIONAL:
    ${JSON.stringify(context, null, 2)}
    
    Genera un plan de apoyo integral que incluya:
    1. Objetivos específicos y medibles
    2. Estrategias pedagógicas adaptadas
    3. Intervenciones emocionales
    4. Recursos y materiales necesarios
    5. Cronograma de implementación
    6. Métricas de seguimiento
    7. Roles de los diferentes actores (docente, psicopedagogo, familia)
    
    Responde en formato JSON estructurado.
    `;
  }

  buildPredictiveAlertPrompt(studentId, patterns, riskAssessment) {
    return `
    Eres un sistema de alertas predictivas para educación.
    
    ESTUDIANTE: ${studentId}
    
    PATRONES DETECTADOS:
    ${JSON.stringify(patterns, null, 2)}
    
    EVALUACIÓN DE RIESGO: ${riskAssessment.level} (${riskAssessment.score}/100)
    
    Genera alertas predictivas que incluyan:
    1. Tipo de alerta (académica, emocional, conductual, asistencia)
    2. Nivel de prioridad (baja, media, alta, crítica)
    3. Descripción del riesgo detectado
    4. Factores contribuyentes
    5. Recomendaciones de intervención
    6. Tiempo estimado para intervención
    7. Recursos necesarios
    
    Responde en formato JSON con array de alertas.
    `;
  }

  buildTaskGenerationPrompt(studentProfile, academicHistory, taskContext) {
    return `
    Eres un experto en diseño de tareas educativas personalizadas.
    
    ESTUDIANTE:
    - Nombre: ${studentProfile.full_name}
    - Grado: ${studentProfile.grade}
    - Estilo de aprendizaje: ${taskContext.learningStyle}
    
    HISTORIAL ACADÉMICO:
    ${JSON.stringify(academicHistory.slice(0, 5), null, 2)}
    
    CONTEXTO DE TAREA:
    - Materia: ${taskContext.subject}
    - Dificultad: ${taskContext.difficulty}
    - Objetivos de aprendizaje específicos
    
    Genera tareas personalizadas que incluyan:
    1. Título claro y motivador
    2. Descripción detallada
    3. Instrucciones paso a paso
    4. Criterios de evaluación
    5. Recursos y materiales
    6. Adaptaciones según estilo de aprendizaje
    7. Tiempo estimado de realización
    8. Opciones de extensión para estudiantes avanzados
    
    Responde en formato JSON estructurado.
    `;
  }

  buildRoleAssistancePrompt(role, roleContext) {
    const roleInstructions = {
      directive: "Eres un asistente para directivos educativos. Ayuda con toma de decisiones estratégicas, análisis de datos institucionales y gestión de recursos.",
      teacher: "Eres un asistente pedagógico para docentes. Ayuda con planificación de clases, evaluación de estudiantes y estrategias de enseñanza.",
      psychopedagogue: "Eres un asistente especializado en psicopedagogía. Ayuda con diagnósticos, planes de apoyo y intervenciones educativas.",
      parent: "Eres un asistente para padres de familia. Ayuda a entender el progreso de sus hijos y cómo apoyar su aprendizaje en casa.",
      student: "Eres un tutor personal para estudiantes. Ayuda con organización del estudio, técnicas de aprendizaje y motivación."
    };

    return `
    ${roleInstructions[role] || "Eres un asistente educativo general."}
    
    CONTEXTO ACTUAL:
    ${JSON.stringify(roleContext, null, 2)}
    
    Proporciona asistencia específica que incluya:
    1. Análisis de la situación actual
    2. Recomendaciones específicas para el rol
    3. Acciones inmediatas sugeridas
    4. Recursos y herramientas recomendadas
    5. Estrategias a mediano plazo
    6. Métricas para evaluar el progreso
    
    Responde en formato JSON estructurado.
    `;
  }

  buildAdaptiveContentPrompt(studentProfile, learningStyle, topic, learningObjectives) {
    return `
    Eres un experto en diseño de contenido educativo adaptativo.
    
    ESTUDIANTE:
    - Perfil: ${JSON.stringify(studentProfile, null, 2)}
    - Estilo de aprendizaje: ${learningStyle}
    
    CONTENIDO SOLICITADO:
    - Tema: ${topic}
    - Objetivos de aprendizaje: ${learningObjectives.join(', ')}
    
    Genera contenido adaptativo que incluya:
    1. Introducción motivadora
    2. Explicación principal adaptada al estilo de aprendizaje
    3. Ejemplos prácticos y relevantes
    4. Actividades interactivas
    5. Evaluación formativa
    6. Recursos adicionales
    7. Adaptaciones para diferentes niveles
    8. Conexiones con conocimientos previos
    
    Responde en formato JSON estructurado.
    `;
  }

  async callAI(prompt, type) {
    try {
      const response = await fetch(`${this.apiEndpoint}/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.REACT_APP_AI_API_KEY}`
        },
        body: JSON.stringify({
          prompt,
          type,
          timestamp: new Date().toISOString(),
          context: {
            platform: 'kary',
            version: '1.0.0'
          }
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error calling AI API:', error);
      // Fallback a respuesta mock si la API no está disponible
      return this.getMockResponse(type);
    }
  }

  parseSupportPlanResponse(response) {
    try {
      const plan = typeof response === 'string' ? JSON.parse(response) : response;
      return {
        id: `plan_${Date.now()}`,
        title: plan.title || 'Plan de Apoyo Personalizado',
        objectives: plan.objectives || [],
        strategies: plan.strategies || [],
        timeline: plan.timeline || {},
        resources: plan.resources || [],
        metrics: plan.metrics || [],
        roles: plan.roles || {},
        createdAt: new Date().toISOString(),
        status: 'active'
      };
    } catch (error) {
      console.error('Error parsing support plan response:', error);
      return this.getFallbackSupportPlan();
    }
  }

  parseAlertResponse(response) {
    try {
      const alerts = typeof response === 'string' ? JSON.parse(response) : response;
      return Array.isArray(alerts) ? alerts.map((alert, index) => ({
        id: `alert_${Date.now()}_${index}`,
        type: alert.type || 'general',
        priority: alert.priority || 'medium',
        title: alert.title || 'Alerta Predictiva',
        description: alert.description || '',
        recommendations: alert.recommendations || [],
        estimatedInterventionTime: alert.estimatedInterventionTime || '24-48 horas',
        resources: alert.resources || [],
        createdAt: new Date().toISOString(),
        status: 'pending'
      })) : [];
    } catch (error) {
      console.error('Error parsing alert response:', error);
      return [];
    }
  }

  parseTaskResponse(response) {
    try {
      const tasks = typeof response === 'string' ? JSON.parse(response) : response;
      return Array.isArray(tasks) ? tasks.map((task, index) => ({
        id: `task_${Date.now()}_${index}`,
        title: task.title || 'Tarea Personalizada',
        description: task.description || '',
        instructions: task.instructions || [],
        evaluationCriteria: task.evaluationCriteria || [],
        resources: task.resources || [],
        adaptations: task.adaptations || {},
        estimatedTime: task.estimatedTime || '30 minutos',
        extensions: task.extensions || [],
        createdAt: new Date().toISOString(),
        status: 'pending'
      })) : [];
    } catch (error) {
      console.error('Error parsing task response:', error);
      return this.getFallbackTasks();
    }
  }

  parseRoleResponse(response) {
    try {
      const assistance = typeof response === 'string' ? JSON.parse(response) : response;
      return {
        analysis: assistance.analysis || '',
        recommendations: assistance.recommendations || [],
        immediateActions: assistance.immediateActions || [],
        resources: assistance.resources || [],
        strategies: assistance.strategies || [],
        metrics: assistance.metrics || [],
        confidence: assistance.confidence || 0.8
      };
    } catch (error) {
      console.error('Error parsing role response:', error);
      return this.getFallbackRoleAssistance();
    }
  }

  parseContentResponse(response) {
    try {
      const content = typeof response === 'string' ? JSON.parse(response) : response;
      return {
        introduction: content.introduction || '',
        mainContent: content.mainContent || '',
        examples: content.examples || [],
        activities: content.activities || [],
        evaluation: content.evaluation || {},
        additionalResources: content.additionalResources || [],
        adaptations: content.adaptations || {},
        connections: content.connections || []
      };
    } catch (error) {
      console.error('Error parsing content response:', error);
      return this.getFallbackContent();
    }
  }

  // Métodos de fallback para cuando la IA no está disponible
  getFallbackSupportPlan() {
    return {
      id: `fallback_plan_${Date.now()}`,
      title: 'Plan de Apoyo Básico',
      objectives: ['Mejorar el rendimiento académico', 'Desarrollar habilidades socioemocionales'],
      strategies: ['Refuerzo académico', 'Apoyo emocional'],
      timeline: { duration: '4 semanas', frequency: '2 veces por semana' },
      resources: ['Material didáctico', 'Apoyo psicopedagógico'],
      metrics: ['Progreso académico', 'Bienestar emocional'],
      roles: { teacher: 'Implementación', psychopedagogue: 'Seguimiento' },
      createdAt: new Date().toISOString(),
      status: 'active'
    };
  }

  getFallbackTasks() {
    return [{
      id: `fallback_task_${Date.now()}`,
      title: 'Actividad de Refuerzo',
      description: 'Actividad básica de refuerzo académico',
      instructions: ['Leer las instrucciones', 'Completar la actividad', 'Revisar los resultados'],
      evaluationCriteria: ['Completitud', 'Precisión', 'Esfuerzo'],
      resources: ['Material básico'],
      adaptations: {},
      estimatedTime: '30 minutos',
      extensions: [],
      createdAt: new Date().toISOString(),
      status: 'pending'
    }];
  }

  getFallbackRoleAssistance() {
    return {
      analysis: 'Análisis básico de la situación actual',
      recommendations: ['Revisar datos disponibles', 'Consultar con especialistas'],
      immediateActions: ['Recopilar información adicional'],
      resources: ['Documentación básica'],
      strategies: ['Enfoque sistemático'],
      metrics: ['Seguimiento básico'],
      confidence: 0.5
    };
  }

  getFallbackContent() {
    return {
      introduction: 'Introducción al tema',
      mainContent: 'Contenido principal básico',
      examples: ['Ejemplo básico'],
      activities: ['Actividad básica'],
      evaluation: { type: 'evaluación básica' },
      additionalResources: ['Recursos básicos'],
      adaptations: {},
      connections: []
    };
  }

  getMockResponse(type) {
    const mockResponses = {
      support_plan: {
        title: "Plan de Apoyo Personalizado",
        objectives: ["Objetivo 1", "Objetivo 2"],
        strategies: ["Estrategia 1", "Estrategia 2"],
        timeline: { duration: "4 semanas" },
        resources: ["Recurso 1", "Recurso 2"],
        metrics: ["Métrica 1", "Métrica 2"],
        roles: { teacher: "Implementación", psychopedagogue: "Seguimiento" }
      },
      predictive_alerts: [
        {
          type: "academic",
          priority: "medium",
          title: "Alerta de Rendimiento",
          description: "Posible disminución en el rendimiento académico",
          recommendations: ["Refuerzo académico", "Seguimiento individual"]
        }
      ],
      task_generation: [
        {
          title: "Tarea Personalizada",
          description: "Descripción de la tarea",
          instructions: ["Instrucción 1", "Instrucción 2"],
          evaluationCriteria: ["Criterio 1", "Criterio 2"]
        }
      ]
    };

    return mockResponses[type] || {};
  }
}

export default new EducationalAI();

