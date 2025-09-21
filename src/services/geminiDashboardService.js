import { GoogleGenerativeAI } from '@google/generative-ai';

// Configuración de Gemini
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || 'demo-key');
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Verificar configuración de API Key
const isGeminiConfigured = () => {
  return API_KEY && API_KEY !== 'undefined' && API_KEY !== '' && API_KEY !== 'demo-key';
};

// Función para manejar errores de API
const handleGeminiError = (error) => {
  console.error('Error en Gemini AI:', error);
  
  if (error.message?.includes('API key not valid')) {
    return {
      success: false,
      error: 'API key de Gemini no válida. Por favor, configura VITE_GEMINI_API_KEY en tu archivo .env',
      code: 'API_KEY_INVALID',
      mockResponse: getMockResponse('api_key_invalid')
    };
  }
  
  if (error.message?.includes('API key')) {
    return {
      success: false,
      error: 'API key de Gemini no configurada. Por favor, configura VITE_GEMINI_API_KEY en tu archivo .env',
      code: 'API_KEY_MISSING',
      mockResponse: getMockResponse('api_key_missing')
    };
  }
  
  return {
    success: false,
    error: `Error de Gemini AI: ${error.message}`,
    code: 'GEMINI_ERROR',
    mockResponse: getMockResponse('general_error')
  };
};

// Función para obtener respuestas mock cuando no hay API key
const getMockResponse = (type) => {
  const mockResponses = {
    api_key_invalid: {
      message: "⚠️ API key de Gemini no válida. El sistema está funcionando en modo demo.",
      suggestions: [
        "Configura VITE_GEMINI_API_KEY en tu archivo .env",
        "Obtén tu API key desde: https://makersuite.google.com/app/apikey",
        "Reinicia el servidor después de configurar la API key"
      ],
      isDemo: true
    },
    api_key_missing: {
      message: "🔧 API key de Gemini no configurada. El sistema está funcionando en modo demo.",
      suggestions: [
        "Crea un archivo .env en la raíz del proyecto",
        "Agrega: VITE_GEMINI_API_KEY=tu_api_key_aqui",
        "Obtén tu API key desde: https://makersuite.google.com/app/apikey"
      ],
      isDemo: true
    },
    general_error: {
      message: "❌ Error de conexión con Gemini AI. El sistema está funcionando en modo demo.",
      suggestions: [
        "Verifica tu conexión a internet",
        "Revisa la configuración de la API key",
        "Contacta al administrador del sistema"
      ],
      isDemo: true
    }
  };
  
  return mockResponses[type] || mockResponses.general_error;
};

// Configuración de generación
const GENERATION_CONFIG = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 2048,
};

/**
 * Servicio unificado de Gemini para todos los dashboards
 */
class GeminiDashboardService {
  
  /**
   * Genera insights inteligentes para el dashboard del profesor
   */
  async generateTeacherInsights(studentData, classPerformance, recentActivities) {
    try {
      const prompt = `
      Eres un asistente educativo experto que analiza datos de clase para profesores.
      
      DATOS DE LA CLASE:
      - Número de estudiantes: ${studentData.length}
      - Rendimiento general: ${classPerformance.averageScore || 0}%
      - Actividades recientes: ${recentActivities.length}
      - Estudiantes con dificultades: ${studentData.filter(s => s.performance < 70).length}
      
      DATOS DE ESTUDIANTES:
      ${studentData.slice(0, 5).map(student => 
        `- ${student.name}: ${student.performance}% (${student.subjects.join(', ')})`
      ).join('\n')}
      
      Genera insights inteligentes y recomendaciones para el profesor:
      
      Responde SOLO con un JSON válido:
      {
        "performanceAnalysis": "Análisis del rendimiento general de la clase",
        "topPerformers": ["Estudiante 1", "Estudiante 2"],
        "needsAttention": ["Estudiante que necesita ayuda"],
        "recommendations": [
          {
            "type": "teaching_strategy",
            "title": "Estrategia recomendada",
            "description": "Descripción de la estrategia",
            "priority": "high/medium/low"
          }
        ],
        "alerts": [
          {
            "type": "warning/success/info",
            "message": "Mensaje de alerta",
            "action": "Acción recomendada"
          }
        ],
        "nextSteps": ["Paso siguiente 1", "Paso siguiente 2"]
      }
      `;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: GENERATION_CONFIG,
      });

      const response = await result.response;
      const text = response.text();
      
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      const insights = JSON.parse(cleanText);
      
      return {
        success: true,
        data: insights
      };
      
    } catch (error) {
      console.error('Error generando insights del profesor:', error);
      return {
        success: false,
        error: error.message,
        data: this.getMockTeacherInsights()
      };
    }
  }

  /**
   * Genera recomendaciones personalizadas para estudiantes
   */
  async generateStudentRecommendations(studentProfile, recentPerformance, activities) {
    try {
      const prompt = `
      Eres un tutor personal que crea recomendaciones para estudiantes.
      
      PERFIL DEL ESTUDIANTE:
      - Nombre: ${studentProfile.full_name || 'Estudiante'}
      - Grado: ${studentProfile.grade || 'No especificado'}
      - Estilo de aprendizaje: ${studentProfile.learningStyle || 'visual'}
      - Intereses: ${studentProfile.interests?.join(', ') || 'Generales'}
      
      RENDIMIENTO RECIENTE:
      - Puntuación promedio: ${recentPerformance.averageScore || 0}%
      - Actividades completadas: ${activities.completed || 0}
      - Tiempo de estudio: ${recentPerformance.studyTime || 0} horas
      
      Genera recomendaciones personalizadas:
      
      Responde SOLO con un JSON válido:
      {
        "personalizedGoals": [
          {
            "title": "Meta personalizada",
            "description": "Descripción de la meta",
            "targetDate": "2024-01-15",
            "difficulty": "easy/medium/hard"
          }
        ],
        "studyPlan": {
          "dailyTime": 30,
          "subjects": ["Matemáticas", "Lectura"],
          "schedule": "Mañana: Matemáticas, Tarde: Lectura"
        },
        "recommendedActivities": [
          {
            "title": "Actividad recomendada",
            "subject": "mathematics",
            "difficulty": "intermediate",
            "reason": "Para mejorar en álgebra"
          }
        ],
        "motivationalMessage": "Mensaje motivacional personalizado",
        "tips": ["Tip 1", "Tip 2", "Tip 3"]
      }
      `;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: GENERATION_CONFIG,
      });

      const response = await result.response;
      const text = response.text();
      
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      const recommendations = JSON.parse(cleanText);
      
      return {
        success: true,
        data: recommendations
      };
      
    } catch (error) {
      console.error('Error generando recomendaciones del estudiante:', error);
      return {
        success: false,
        error: error.message,
        data: this.getMockStudentRecommendations()
      };
    }
  }

  /**
   * Genera insights para padres sobre el progreso de su hijo
   */
  async generateParentInsights(childProfile, academicProgress, behavioralNotes) {
    try {
      const prompt = `
      Eres un consejero educativo que ayuda a padres a entender el progreso de sus hijos.
      
      PERFIL DEL HIJO:
      - Nombre: ${childProfile.full_name || 'Estudiante'}
      - Grado: ${childProfile.grade || 'No especificado'}
      - Edad: ${childProfile.age || 'No especificado'}
      
      PROGRESO ACADÉMICO:
      - Rendimiento general: ${academicProgress.overallScore || 0}%
      - Materias fuertes: ${academicProgress.strongSubjects?.join(', ') || 'Ninguna'}
      - Áreas de mejora: ${academicProgress.weakSubjects?.join(', ') || 'Ninguna'}
      
      NOTAS COMPORTAMENTALES:
      ${behavioralNotes.slice(0, 3).map(note => `- ${note}`).join('\n')}
      
      Genera insights útiles para los padres:
      
      Responde SOLO con un JSON válido:
      {
        "progressSummary": "Resumen del progreso académico y personal",
        "strengths": ["Fortaleza 1", "Fortaleza 2"],
        "areasForSupport": ["Área que necesita apoyo"],
        "homeRecommendations": [
          {
            "activity": "Actividad para casa",
            "frequency": "Diario/Semanal",
            "benefit": "Beneficio esperado"
          }
        ],
        "communicationTips": [
          "Tip para comunicarse con el niño",
          "Tip para motivar el estudio"
        ],
        "redFlags": ["Señal de alerta si aparece"],
        "encouragement": "Mensaje de aliento para los padres"
      }
      `;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: GENERATION_CONFIG,
      });

      const response = await result.response;
      const text = response.text();
      
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      const insights = JSON.parse(cleanText);
      
      return {
        success: true,
        data: insights
      };
      
    } catch (error) {
      console.error('Error generando insights de padres:', error);
      return {
        success: false,
        error: error.message,
        data: this.getMockParentInsights()
      };
    }
  }

  /**
   * Genera análisis psicopedagógico con Gemini
   */
  async generatePsychopedagogueAnalysis(studentData, diagnosticInfo, interventionHistory) {
    try {
      const prompt = `
      Eres un psicopedagogo experto que analiza casos de estudiantes con necesidades especiales.
      
      DATOS DEL ESTUDIANTE:
      - Nombre: ${studentData.full_name || 'Estudiante'}
      - Diagnóstico: ${diagnosticInfo.primaryDiagnosis || 'No especificado'}
      - Necesidades: ${diagnosticInfo.specialNeeds?.join(', ') || 'Ninguna'}
      - Estilo de aprendizaje: ${diagnosticInfo.learningStyle || 'No especificado'}
      
      HISTORIAL DE INTERVENCIONES:
      ${interventionHistory.slice(0, 3).map(intervention => 
        `- ${intervention.type}: ${intervention.description}`
      ).join('\n')}
      
      Genera análisis psicopedagógico profesional:
      
      Responde SOLO con un JSON válido:
      {
        "diagnosticSummary": "Resumen del diagnóstico actual",
        "strengths": ["Fortaleza identificada"],
        "challenges": ["Desafío identificado"],
        "interventionPlan": {
          "shortTerm": ["Objetivo a corto plazo"],
          "longTerm": ["Objetivo a largo plazo"],
          "strategies": ["Estrategia de intervención"]
        },
        "recommendations": [
          {
            "type": "academic/behavioral/social",
            "title": "Recomendación",
            "description": "Descripción detallada",
            "priority": "high/medium/low"
          }
        ],
        "progressIndicators": ["Indicador de progreso 1", "Indicador 2"],
        "nextEvaluation": "Fecha sugerida para próxima evaluación"
      }
      `;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: GENERATION_CONFIG,
      });

      const response = await result.response;
      const text = response.text();
      
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      const analysis = JSON.parse(cleanText);
      
      return {
        success: true,
        data: analysis
      };
      
    } catch (error) {
      console.error('Error generando análisis psicopedagógico:', error);
      return {
        success: false,
        error: error.message,
        data: this.getMockPsychopedagogueAnalysis()
      };
    }
  }

  /**
   * Genera reportes administrativos con Gemini
   */
  async generateAdminReport(schoolData, performanceMetrics, resourceUsage) {
    try {
      const prompt = `
      Eres un administrador educativo que analiza datos institucionales.
      
      DATOS DE LA INSTITUCIÓN:
      - Total de estudiantes: ${schoolData.totalStudents || 0}
      - Profesores: ${schoolData.totalTeachers || 0}
      - Cursos activos: ${schoolData.activeCourses || 0}
      
      MÉTRICAS DE RENDIMIENTO:
      - Promedio general: ${performanceMetrics.averageScore || 0}%
      - Tasa de aprobación: ${performanceMetrics.passRate || 0}%
      - Asistencia promedio: ${performanceMetrics.attendance || 0}%
      
      USO DE RECURSOS:
      - Actividades completadas: ${resourceUsage.activitiesCompleted || 0}
      - Tiempo de uso: ${resourceUsage.totalUsageTime || 0} horas
      
      Genera reporte administrativo:
      
      Responde SOLO con un JSON válido:
      {
        "executiveSummary": "Resumen ejecutivo del rendimiento institucional",
        "keyMetrics": {
          "academic": "Métrica académica principal",
          "operational": "Métrica operacional principal",
          "engagement": "Métrica de engagement principal"
        },
        "trends": [
          {
            "category": "Tendencia identificada",
            "description": "Descripción de la tendencia",
            "impact": "positive/negative/neutral"
          }
        ],
        "recommendations": [
          {
            "area": "Área de mejora",
            "action": "Acción recomendada",
            "priority": "high/medium/low",
            "timeline": "Timeline sugerido"
          }
        ],
        "alerts": ["Alerta importante 1", "Alerta 2"],
        "nextSteps": ["Próximo paso 1", "Próximo paso 2"]
      }
      `;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: GENERATION_CONFIG,
      });

      const response = await result.response;
      const text = response.text();
      
      const cleanText = text.replace(/```json\n?|\n?```/g, '').trim();
      const report = JSON.parse(cleanText);
      
      return {
        success: true,
        data: report
      };
      
    } catch (error) {
      console.error('Error generando reporte administrativo:', error);
      return {
        success: false,
        error: error.message,
        data: this.getMockAdminReport()
      };
    }
  }

  /**
   * Chat inteligente contextual para cualquier dashboard
   */
  async chatWithContext(message, userRole, context, userProfile) {
    try {
      // Verificar si Gemini está configurado
      if (!isGeminiConfigured()) {
        const mockResponse = getMockResponse('api_key_missing');
        return {
          success: true, // Retornamos success: true para mostrar el mensaje de ayuda
          data: {
            message: mockResponse.message,
            suggestions: mockResponse.suggestions,
            isDemo: true,
            timestamp: new Date().toISOString(),
            context: context
          }
        };
      }

      const prompt = `
      Eres Kary, un asistente educativo inteligente especializado en ${userRole}.
      
      PERFIL DEL USUARIO:
      - Nombre: ${userProfile.full_name || 'Usuario'}
      - Rol: ${userRole}
      - Contexto: ${context.subject || 'General'}
      
      CONTEXTO ACTUAL:
      ${JSON.stringify(context, null, 2)}
      
      MENSAJE DEL USUARIO: ${message}
      
      Responde como Kary, siendo:
      1. Especializado en el rol del usuario (${userRole})
      2. Conocedor del contexto educativo actual
      3. Útil, preciso y motivacional
      4. Adaptado al nivel y necesidades del usuario
      
      Responde de manera natural y conversacional, máximo 2 párrafos.
      `;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          ...GENERATION_CONFIG,
          temperature: 0.8, // Más creativo para chat
        },
      });

      const response = await result.response;
      const text = response.text();
      
      return {
        success: true,
        data: {
          message: text.trim(),
          timestamp: new Date().toISOString(),
          context: context
        }
      };
      
    } catch (error) {
      console.error('Error en chat contextual:', error);
      const errorResponse = handleGeminiError(error);
      return {
        success: true, // Retornamos success: true para mostrar el mensaje de ayuda
        data: {
          message: errorResponse.mockResponse.message,
          suggestions: errorResponse.mockResponse.suggestions,
          isDemo: true,
          timestamp: new Date().toISOString(),
          context: context
        }
      };
    }
  }

  // Métodos de fallback con datos mock
  getMockTeacherInsights() {
    return {
      performanceAnalysis: "La clase muestra un rendimiento promedio sólido con algunas áreas de mejora.",
      topPerformers: ["María González", "Carlos Ruiz"],
      needsAttention: ["Ana López"],
      recommendations: [
        {
          type: "teaching_strategy",
          title: "Aprendizaje Colaborativo",
          description: "Implementar más actividades grupales",
          priority: "medium"
        }
      ],
      alerts: [
        {
          type: "info",
          message: "La asistencia ha mejorado este mes",
          action: "Mantener las estrategias actuales"
        }
      ],
      nextSteps: ["Revisar progreso individual", "Planificar actividades grupales"]
    };
  }

  getMockStudentRecommendations() {
    return {
      personalizedGoals: [
        {
          title: "Mejorar en Matemáticas",
          description: "Alcanzar 80% en álgebra básica",
          targetDate: "2024-02-15",
          difficulty: "medium"
        }
      ],
      studyPlan: {
        dailyTime: 30,
        subjects: ["Matemáticas", "Lectura"],
        schedule: "Mañana: Matemáticas, Tarde: Lectura"
      },
      recommendedActivities: [
        {
          title: "Aventura Matemática",
          subject: "mathematics",
          difficulty: "intermediate",
          reason: "Para mejorar en álgebra"
        }
      ],
      motivationalMessage: "¡Estás progresando muy bien! Sigue con el excelente trabajo.",
      tips: ["Estudia en sesiones cortas", "Haz pausas regulares", "Practica todos los días"]
    };
  }

  getMockParentInsights() {
    return {
      progressSummary: "Su hijo muestra un progreso constante en todas las materias.",
      strengths: ["Creatividad", "Trabajo en equipo"],
      areasForSupport: ["Matemáticas avanzadas"],
      homeRecommendations: [
        {
          activity: "Lectura diaria",
          frequency: "Diario",
          benefit: "Mejora la comprensión lectora"
        }
      ],
      communicationTips: [
        "Pregúntale sobre su día en la escuela",
        "Celebra sus logros académicos"
      ],
      redFlags: ["Falta de interés en actividades que antes disfrutaba"],
      encouragement: "Su apoyo en casa es fundamental para el éxito académico de su hijo."
    };
  }

  getMockPsychopedagogueAnalysis() {
    return {
      diagnosticSummary: "Estudiante con necesidades de apoyo en procesamiento visual.",
      strengths: ["Memoria auditiva", "Creatividad"],
      challenges: ["Atención sostenida", "Organización"],
      interventionPlan: {
        shortTerm: ["Implementar estrategias visuales"],
        longTerm: ["Desarrollar habilidades de organización"],
        strategies: ["Uso de colores", "Rutinas estructuradas"]
      },
      recommendations: [
        {
          type: "academic",
          title: "Apoyo Visual",
          description: "Usar materiales visuales para reforzar conceptos",
          priority: "high"
        }
      ],
      progressIndicators: ["Mejora en tareas de atención", "Menor ansiedad en exámenes"],
      nextEvaluation: "2024-03-15"
    };
  }

  getMockAdminReport() {
    return {
      executiveSummary: "La institución muestra un rendimiento académico sólido con oportunidades de mejora.",
      keyMetrics: {
        academic: "85% de aprobación general",
        operational: "95% de asistencia promedio",
        engagement: "78% de participación en actividades"
      },
      trends: [
        {
          category: "Mejora en Matemáticas",
          description: "Incremento del 15% en rendimiento",
          impact: "positive"
        }
      ],
      recommendations: [
        {
          area: "Tecnología Educativa",
          action: "Implementar más herramientas digitales",
          priority: "high",
          timeline: "3 meses"
        }
      ],
      alerts: ["Necesidad de actualizar equipos de cómputo"],
      nextSteps: ["Revisar presupuesto tecnológico", "Capacitar profesores"]
    };
  }
}

export default new GeminiDashboardService();
