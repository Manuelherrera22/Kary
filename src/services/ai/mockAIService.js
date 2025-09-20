/**
 * Servicio de IA Simulado
 * Proporciona respuestas simuladas cuando no hay proveedores de IA disponibles
 */

class MockAIService {
  constructor() {
    this.responses = {
      supportPlan: {
        title: "Plan de Apoyo Personalizado",
        objectives: [
          "Mejorar el rendimiento académico",
          "Fortalecer las habilidades sociales",
          "Desarrollar estrategias de aprendizaje"
        ],
        strategies: [
          "Tutorías individualizadas",
          "Actividades grupales colaborativas",
          "Seguimiento semanal del progreso"
        ],
        timeline: "3 meses",
        resources: [
          "Material didáctico adaptado",
          "Herramientas de evaluación",
          "Apoyo psicopedagógico"
        ]
      },
      predictiveAlerts: [
        {
          type: "academic_risk",
          message: "Riesgo de bajo rendimiento en Matemáticas",
          confidence: 0.85,
          recommendations: ["Refuerzo en conceptos básicos", "Tutoría adicional"]
        },
        {
          type: "behavioral_concern",
          message: "Posible problema de atención en clase",
          confidence: 0.72,
          recommendations: ["Evaluación psicopedagógica", "Estrategias de concentración"]
        }
      ],
      personalizedTasks: [
        {
          title: "Ejercicios de Matemáticas Básicas",
          description: "Actividades adaptadas al nivel del estudiante",
          difficulty: "medium",
          estimatedTime: "30 minutos",
          subjects: ["Matemáticas"]
        },
        {
          title: "Lectura Comprensiva",
          description: "Textos cortos con preguntas de comprensión",
          difficulty: "easy",
          estimatedTime: "20 minutos",
          subjects: ["Lenguaje"]
        }
      ],
      learningAnalysis: {
        patterns: [
          "Mejor rendimiento en actividades visuales",
          "Dificultad con tareas de memoria a largo plazo",
          "Excelente trabajo en equipo"
        ],
        needs: {
          visual: "Alto",
          auditory: "Medio",
          kinesthetic: "Bajo"
        },
        recommendations: [
          "Usar más material visual",
          "Implementar actividades prácticas",
          "Fomentar el aprendizaje colaborativo"
        ]
      },
      roleAssistance: {
        recommendations: [
          "Implementar sistema de seguimiento individual",
          "Crear protocolo de comunicación con familias",
          "Establecer reuniones de coordinación semanales"
        ],
        immediateActions: [
          "Revisar casos pendientes",
          "Actualizar registros de estudiantes",
          "Programar evaluaciones pendientes"
        ]
      },
      adaptiveContent: {
        activities: [
          {
            title: "Juego de Números",
            type: "interactive",
            level: "beginner",
            duration: "15 minutos"
          },
          {
            title: "Historia Interactiva",
            type: "reading",
            level: "intermediate",
            duration: "25 minutos"
          }
        ],
        additionalResources: [
          "Videos educativos",
          "Ejercicios interactivos",
          "Material de refuerzo"
        ]
      }
    };
  }

  async generateSupportPlan(studentId, diagnosticData, context) {
    // Simular delay de red
    await this.delay(1000);
    
    return {
      ...this.responses.supportPlan,
      studentId,
      generatedAt: new Date().toISOString(),
      context: context?.role || 'general'
    };
  }

  async generatePredictiveAlerts(studentId, behaviorData, academicData) {
    await this.delay(800);
    
    return this.responses.predictiveAlerts.map(alert => ({
      ...alert,
      studentId,
      generatedAt: new Date().toISOString()
    }));
  }

  async generatePersonalizedTasks(studentId, subject, difficulty, learningStyle) {
    await this.delay(600);
    
    return this.responses.personalizedTasks.map(task => ({
      ...task,
      studentId,
      subject,
      difficulty,
      learningStyle,
      generatedAt: new Date().toISOString()
    }));
  }

  async analyzeDiagnosticsAndSuggestInterventions(diagnostics) {
    await this.delay(1200);
    
    return {
      ...this.responses.learningAnalysis,
      diagnostics: diagnostics || [],
      generatedAt: new Date().toISOString()
    };
  }

  async getRoleBasedAssistance(role, context, userContext) {
    await this.delay(900);
    
    return {
      ...this.responses.roleAssistance,
      role,
      context: context || {},
      generatedAt: new Date().toISOString()
    };
  }

  async generateAdaptiveContent(userId, subject, skills) {
    await this.delay(700);
    
    return {
      ...this.responses.adaptiveContent,
      userId,
      subject,
      skills,
      generatedAt: new Date().toISOString()
    };
  }

  async getRoleBasedAssistance(role, message, context) {
    await this.delay(500);
    
    const responses = {
      student: "Como estudiante, te recomiendo revisar tus notas y hacer preguntas específicas a tus profesores.",
      teacher: "Como profesor, considera implementar diferentes estrategias de enseñanza para adaptarte a los estilos de aprendizaje de tus estudiantes.",
      parent: "Como padre/madre, es importante mantener comunicación regular con la escuela y apoyar el aprendizaje en casa.",
      psychopedagogue: "Como psicopedagogo, evalúa las necesidades individuales y desarrolla estrategias de intervención personalizadas.",
      directive: "Como directivo, enfócate en la gestión estratégica y el desarrollo de políticas educativas efectivas.",
      general: "Te ayudo con información general sobre educación y desarrollo académico."
    };
    
    return {
      analysis: responses[role] || responses.general,
      recommendations: [
        "Mantén comunicación regular",
        "Evalúa el progreso continuamente",
        "Adapta las estrategias según sea necesario"
      ],
      immediateActions: [
        "Revisar la situación actual",
        "Identificar áreas de mejora",
        "Planificar próximos pasos"
      ],
      confidence: 0.8,
      role,
      generatedAt: new Date().toISOString()
    };
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

export default new MockAIService();