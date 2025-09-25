import { supabase } from '@/lib/supabaseClient';

class SurveyService {
  constructor() {
    this.tableName = 'survey_responses';
    this.statsTableName = 'survey_statistics';
  }

  /**
   * Envía una respuesta de encuesta a Supabase
   * @param {Object} surveyData - Datos de la encuesta
   * @returns {Promise<Object>} Resultado de la inserción
   */
  async submitSurvey(surveyData) {
    try {
      // Validar datos requeridos
      if (!surveyData.user_role) {
        throw new Error('El rol del usuario es requerido');
      }

      // Preparar datos para inserción
      const surveyPayload = {
        user_role: surveyData.user_role,
        age_range: surveyData.personalInfo?.age || null,
        tech_experience: surveyData.personalInfo?.techExperience || null,
        institution_type: surveyData.personalInfo?.institutionType || null,
        
        // Ratings de evaluación
        usability_rating: surveyData.generalEvaluation?.usability || null,
        functionality_rating: surveyData.generalEvaluation?.functionality || null,
        design_rating: surveyData.generalEvaluation?.design || null,
        performance_rating: surveyData.generalEvaluation?.performance || null,
        support_rating: surveyData.generalEvaluation?.support || null,
        
        // Feedback detallado
        positive_feedback: surveyData.detailedFeedback?.positive || null,
        negative_feedback: surveyData.detailedFeedback?.negative || null,
        suggestions: surveyData.detailedFeedback?.suggestions || null,
        
        // Recomendaciones
        recommendation: surveyData.recommendations?.recommend || null,
        impact_description: surveyData.recommendations?.impact || null,
        additional_comments: surveyData.recommendations?.additional || null,
        
        // Metadatos
        session_id: this.generateSessionId(),
        completion_time: surveyData.completionTime || null,
        is_anonymous: true
      };

      // Insertar en Supabase
      const { data, error } = await supabase
        .from(this.tableName)
        .insert([surveyPayload])
        .select();

      if (error) {
        console.error('Error al enviar encuesta:', error);
        throw new Error(`Error al guardar la encuesta: ${error.message}`);
      }

      return {
        success: true,
        data: data[0],
        message: 'Encuesta enviada exitosamente'
      };

    } catch (error) {
      console.error('Error en SurveyService.submitSurvey:', error);
      return {
        success: false,
        error: error.message,
        message: 'Error al enviar la encuesta'
      };
    }
  }

  /**
   * Obtiene estadísticas de las encuestas
   * @returns {Promise<Object>} Estadísticas de las encuestas
   */
  async getSurveyStatistics() {
    try {
      const { data, error } = await supabase
        .from(this.statsTableName)
        .select('*')
        .order('last_updated', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw new Error(`Error al obtener estadísticas: ${error.message}`);
      }

      return {
        success: true,
        data: data || this.getDefaultStatistics(),
        message: 'Estadísticas obtenidas exitosamente'
      };

    } catch (error) {
      console.error('Error en SurveyService.getSurveyStatistics:', error);
      return {
        success: false,
        error: error.message,
        data: this.getDefaultStatistics(),
        message: 'Error al obtener estadísticas'
      };
    }
  }

  /**
   * Obtiene respuestas de encuestas (solo para administradores)
   * @param {Object} filters - Filtros para la consulta
   * @returns {Promise<Object>} Respuestas de encuestas
   */
  async getSurveyResponses(filters = {}) {
    try {
      let query = supabase
        .from(this.tableName)
        .select('*')
        .order('created_at', { ascending: false });

      // Aplicar filtros
      if (filters.user_role) {
        query = query.eq('user_role', filters.user_role);
      }

      if (filters.date_from) {
        query = query.gte('created_at', filters.date_from);
      }

      if (filters.date_to) {
        query = query.lte('created_at', filters.date_to);
      }

      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;

      if (error) {
        throw new Error(`Error al obtener respuestas: ${error.message}`);
      }

      return {
        success: true,
        data: data || [],
        message: 'Respuestas obtenidas exitosamente'
      };

    } catch (error) {
      console.error('Error en SurveyService.getSurveyResponses:', error);
      return {
        success: false,
        error: error.message,
        data: [],
        message: 'Error al obtener respuestas'
      };
    }
  }

  /**
   * Genera un ID de sesión único
   * @returns {string} ID de sesión
   */
  generateSessionId() {
    return `survey_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Estadísticas por defecto cuando no hay datos
   * @returns {Object} Estadísticas por defecto
   */
  getDefaultStatistics() {
    return {
      student_count: 0,
      teacher_count: 0,
      psychopedagogue_count: 0,
      parent_count: 0,
      director_count: 0,
      avg_usability: 0,
      avg_functionality: 0,
      avg_design: 0,
      avg_performance: 0,
      avg_support: 0,
      definitely_count: 0,
      probably_count: 0,
      neutral_count: 0,
      probably_not_count: 0,
      definitely_not_count: 0,
      total_responses: 0,
      last_updated: new Date().toISOString()
    };
  }

  /**
   * Valida los datos de la encuesta antes de enviar
   * @param {Object} surveyData - Datos de la encuesta
   * @returns {Object} Resultado de la validación
   */
  validateSurveyData(surveyData) {
    const errors = [];

    // Validar rol requerido
    if (!surveyData.user_role) {
      errors.push('El rol del usuario es requerido');
    }

    // Validar ratings (si están presentes, deben estar entre 1-5)
    const ratings = ['usability', 'functionality', 'design', 'performance', 'support'];
    ratings.forEach(rating => {
      const value = surveyData.generalEvaluation?.[rating];
      if (value !== null && value !== undefined && (value < 1 || value > 5)) {
        errors.push(`El rating de ${rating} debe estar entre 1 y 5`);
      }
    });

    // Validar recomendación
    const validRecommendations = ['definitely', 'probably', 'neutral', 'probably-not', 'definitely-not'];
    if (surveyData.recommendations?.recommend && !validRecommendations.includes(surveyData.recommendations.recommend)) {
      errors.push('La recomendación debe ser una opción válida');
    }

    return {
      isValid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Calcula el tiempo de completación de la encuesta
   * @param {number} startTime - Timestamp de inicio
   * @returns {number} Tiempo en segundos
   */
  calculateCompletionTime(startTime) {
    return Math.round((Date.now() - startTime) / 1000);
  }
}

// Crear instancia singleton
const surveyService = new SurveyService();

export default surveyService;
