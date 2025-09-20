import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyBfQj3LxYUtLngyn3YPGJXiVs4xa0yb7QU';
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    // Configuración específica para educación
    this.educationalConfig = {
      temperature: 0.7,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: 2048,
    };
  }

  /**
   * Genera contenido educativo usando Gemini AI
   * @param {string} prompt - El prompt educativo
   * @param {Object} context - Contexto educativo adicional
   * @returns {Promise<Object>} Respuesta de Gemini
   */
  async generateEducationalContent(prompt, context = {}) {
    try {
      const enhancedPrompt = this.enhancePromptForEducation(prompt, context);
      
      const result = await this.model.generateContent({
        contents: [{ role: 'user', parts: [{ text: enhancedPrompt }] }],
        generationConfig: this.educationalConfig,
      });

      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        content: text,
        provider: 'gemini',
        model: 'gemini-1.5-flash',
        timestamp: new Date().toISOString(),
        context: context
      };
    } catch (error) {
      console.error('Error en Gemini Service:', error);
      return {
        success: false,
        error: error.message,
        provider: 'gemini',
        fallback: true
      };
    }
  }

  /**
   * Crea planes de apoyo personalizados
   * @param {Object} studentProfile - Perfil del estudiante
   * @param {Object} diagnosticData - Datos de diagnóstico
   * @returns {Promise<Object>} Plan de apoyo generado
   */
  async generateSupportPlan(studentProfile, diagnosticData) {
    const prompt = `
      Como experto en psicopedagogía, crea un plan de apoyo personalizado para el siguiente estudiante:
      
      PERFIL DEL ESTUDIANTE:
      - Nombre: ${studentProfile.name || 'Estudiante'}
      - Edad: ${studentProfile.age || 'No especificada'}
      - Grado: ${studentProfile.grade || 'No especificado'}
      - Áreas de fortaleza: ${studentProfile.strengths?.join(', ') || 'Por identificar'}
      - Áreas de mejora: ${studentProfile.weaknesses?.join(', ') || 'Por identificar'}
      
      DATOS DE DIAGNÓSTICO:
      - Rendimiento académico: ${diagnosticData.academic?.level || 'Promedio'}
      - Estado emocional: ${diagnosticData.emotional?.status || 'Estable'}
      - Habilidades sociales: ${diagnosticData.social?.level || 'Desarrollándose'}
      - Observaciones: ${diagnosticData.observations || 'Sin observaciones específicas'}
      
      Por favor, genera un plan de apoyo que incluya:
      1. Objetivos específicos y medibles
      2. Estrategias de intervención
      3. Actividades recomendadas
      4. Cronograma sugerido
      5. Métricas de seguimiento
      
      Responde en formato JSON estructurado y en español.
    `;

    return await this.generateEducationalContent(prompt, {
      type: 'support_plan',
      studentProfile,
      diagnosticData
    });
  }

  /**
   * Genera alertas predictivas basadas en patrones
   * @param {Array} studentData - Datos históricos del estudiante
   * @param {Object} currentMetrics - Métricas actuales
   * @returns {Promise<Object>} Alertas generadas
   */
  async generatePredictiveAlerts(studentData, currentMetrics) {
    const prompt = `
      Como analista educativo con IA, analiza los siguientes datos para generar alertas predictivas:
      
      DATOS HISTÓRICOS (últimos 3 meses):
      ${JSON.stringify(studentData.slice(-10), null, 2)}
      
      MÉTRICAS ACTUALES:
      ${JSON.stringify(currentMetrics, null, 2)}
      
      Identifica patrones preocupantes y genera alertas para:
      1. Riesgo académico
      2. Problemas emocionales
      3. Dificultades sociales
      4. Necesidades de intervención temprana
      
      Para cada alerta incluye:
      - Tipo de riesgo
      - Nivel de urgencia (Bajo, Medio, Alto)
      - Evidencia que la respalda
      - Recomendaciones de acción
      
      Responde en formato JSON estructurado.
    `;

    return await this.generateEducationalContent(prompt, {
      type: 'predictive_alerts',
      studentData,
      currentMetrics
    });
  }

  /**
   * Sugiere actividades educativas personalizadas
   * @param {Object} studentProfile - Perfil del estudiante
   * @param {string} subject - Materia específica
   * @param {string} difficulty - Nivel de dificultad
   * @returns {Promise<Object>} Actividades sugeridas
   */
  async suggestEducationalActivities(studentProfile, subject, difficulty = 'intermediate') {
    const prompt = `
      Como diseñador instruccional, sugiere actividades educativas personalizadas:
      
      ESTUDIANTE:
      - Perfil de aprendizaje: ${studentProfile.learningStyle || 'Visual'}
      - Intereses: ${studentProfile.interests?.join(', ') || 'Generales'}
      - Fortalezas: ${studentProfile.strengths?.join(', ') || 'Por desarrollar'}
      
      CONTEXTO:
      - Materia: ${subject}
      - Nivel de dificultad: ${difficulty}
      - Objetivos: Mejorar comprensión y retención
      
      Genera 5 actividades que incluyan:
      1. Descripción clara
      2. Objetivos específicos
      3. Materiales necesarios
      4. Tiempo estimado
      5. Criterios de evaluación
      
      Asegúrate de que sean:
      - Atractivas y motivadoras
      - Apropiadas para la edad
      - Alineadas con el perfil del estudiante
      - Progresivas en dificultad
      
      Responde en formato JSON estructurado.
    `;

    return await this.generateEducationalContent(prompt, {
      type: 'educational_activities',
      studentProfile,
      subject,
      difficulty
    });
  }

  /**
   * Analiza el progreso estudiantil y genera insights
   * @param {Array} progressData - Datos de progreso
   * @param {Object} goals - Metas establecidas
   * @returns {Promise<Object>} Análisis de progreso
   */
  async analyzeStudentProgress(progressData, goals) {
    const prompt = `
      Como analista educativo, analiza el progreso del estudiante:
      
      DATOS DE PROGRESO:
      ${JSON.stringify(progressData, null, 2)}
      
      METAS ESTABLECIDAS:
      ${JSON.stringify(goals, null, 2)}
      
      Proporciona un análisis que incluya:
      1. Resumen del progreso general
      2. Áreas de mayor avance
      3. Áreas que requieren atención
      4. Tendencias identificadas
      5. Recomendaciones específicas
      6. Ajustes sugeridos a las metas
      
      Usa un tono constructivo y orientado a soluciones.
      Responde en formato JSON estructurado.
    `;

    return await this.generateEducationalContent(prompt, {
      type: 'progress_analysis',
      progressData,
      goals
    });
  }

  /**
   * Genera reportes educativos personalizados
   * @param {Object} studentData - Datos completos del estudiante
   * @param {string} reportType - Tipo de reporte
   * @returns {Promise<Object>} Reporte generado
   */
  async generateEducationalReport(studentData, reportType = 'comprehensive') {
    const prompt = `
      Como psicopedagogo experto, genera un reporte educativo ${reportType}:
      
      DATOS DEL ESTUDIANTE:
      ${JSON.stringify(studentData, null, 2)}
      
      El reporte debe incluir:
      1. Resumen ejecutivo
      2. Análisis de fortalezas y debilidades
      3. Recomendaciones específicas
      4. Plan de seguimiento
      5. Sugerencias para padres/educadores
      
      Usa un lenguaje profesional pero accesible.
      Responde en formato JSON estructurado.
    `;

    return await this.generateEducationalContent(prompt, {
      type: 'educational_report',
      studentData,
      reportType
    });
  }

  /**
   * Mejora el prompt para contexto educativo
   * @param {string} prompt - Prompt original
   * @param {Object} context - Contexto educativo
   * @returns {string} Prompt mejorado
   */
  enhancePromptForEducation(prompt, context) {
    const educationalContext = `
      CONTEXTO EDUCATIVO KARY:
      - Plataforma: Kary - Sistema de Gestión Educativa Integral
      - Enfoque: Educación personalizada y psicopedagogía
      - Usuarios: Estudiantes, profesores, psicopedagogos, padres, directivos
      - Objetivo: Mejorar el aprendizaje y desarrollo integral de los estudiantes
      
      INSTRUCCIONES:
      - Responde siempre en español
      - Usa un lenguaje apropiado para el contexto educativo
      - Proporciona información práctica y accionable
      - Considera aspectos emocionales, sociales y académicos
      - Mantén un enfoque positivo y constructivo
      
      PROMPT ORIGINAL:
      ${prompt}
    `;

    return educationalContext;
  }

  /**
   * Verifica la conectividad con la API de Gemini
   * @returns {Promise<boolean>} Estado de la conexión
   */
  async testConnection() {
    try {
      const result = await this.generateEducationalContent(
        'Responde con "OK" si puedes procesar este mensaje de prueba.',
        { type: 'connection_test' }
      );
      
      return result.success;
    } catch (error) {
      console.error('Error de conexión con Gemini:', error);
      return false;
    }
  }

  /**
   * Obtiene información sobre el modelo Gemini
   * @returns {Object} Información del modelo
   */
  getModelInfo() {
    return {
      name: 'Gemini 1.5 Flash',
      provider: 'Google',
      capabilities: [
        'Generación de texto educativo',
        'Análisis de datos estudiantiles',
        'Creación de planes de apoyo',
        'Alertas predictivas',
        'Sugerencias de actividades',
        'Reportes educativos'
      ],
      maxTokens: 2048,
      supportedLanguages: ['es', 'en']
    };
  }
}

export default GeminiService;
