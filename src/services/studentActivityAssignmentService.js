import { supabase } from '@/lib/supabaseClient';

/**
 * Servicio para manejar la asignación de actividades a estudiantes
 */
export class StudentActivityAssignmentService {
  
  /**
   * Asigna una actividad generada por IA a un estudiante específico
   * @param {Object} activity - Actividad generada
   * @param {Object} plan - Plan de apoyo del estudiante
   * @param {string} teacherId - ID del profesor que asigna
   * @returns {Promise<Object>} - Resultado de la asignación
   */
  static async assignActivityToStudent(activity, plan, teacherId) {
    try {
      console.log('📝 Asignando actividad a estudiante...');
      
      // Preparar datos de la asignación
      const assignmentData = {
        activity_id: activity.id,
        student_id: plan.studentId,
        teacher_id: teacherId,
        plan_id: plan.id,
        title: activity.title,
        description: activity.description,
        objective: activity.objective,
        duration: activity.duration,
        difficulty: activity.difficulty,
        priority: activity.priority,
        category: activity.category,
        subject: activity.subject,
        grade_level: activity.gradeLevel,
        materials: Array.isArray(activity.materials) ? activity.materials : [activity.materials],
        adaptations: activity.adaptations,
        instructions: activity.instructions,
        assessment: activity.assessment,
        learning_style: activity.learningStyle,
        cognitive_domain: activity.cognitiveDomain,
        ai_generated: activity.aiGenerated || false,
        generated_by: activity.generatedBy || 'Gemini AI',
        based_on_plan: activity.basedOnPlan || plan.id,
        based_on_recommendations: activity.basedOnRecommendations || [],
        status: 'assigned',
        assigned_at: new Date().toISOString(),
        due_date: this.calculateDueDate(activity.duration),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      // Insertar en la base de datos
      const { data, error } = await supabase
        .from('student_activities')
        .insert([assignmentData])
        .select()
        .single();

      if (error) {
        console.error('❌ Error asignando actividad:', error);
        throw new Error(`Error asignando actividad: ${error.message}`);
      }

      // Crear notificación para el estudiante
      await this.createStudentNotification(plan.studentId, activity, 'activity_assigned');

      // Crear registro de seguimiento
      await this.createActivityTrackingRecord(data.id, plan.studentId, teacherId);

      console.log('✅ Actividad asignada exitosamente');
      
      return {
        success: true,
        assignment: data,
        message: `Actividad "${activity.title}" asignada exitosamente a ${plan.studentName}`
      };

    } catch (error) {
      console.error('❌ Error en asignación de actividad:', error);
      return {
        success: false,
        error: error.message,
        message: `Error asignando actividad: ${error.message}`
      };
    }
  }

  /**
   * Calcula la fecha de vencimiento basada en la duración de la actividad
   * @param {number} duration - Duración en minutos
   * @returns {string} - Fecha de vencimiento en formato ISO
   */
  static calculateDueDate(duration) {
    const now = new Date();
    // Agregar días basados en la duración de la actividad
    const daysToAdd = Math.max(1, Math.ceil(duration / 60)); // Mínimo 1 día
    now.setDate(now.getDate() + daysToAdd);
    return now.toISOString();
  }

  /**
   * Crea una notificación para el estudiante
   * @param {string} studentId - ID del estudiante
   * @param {Object} activity - Actividad asignada
   * @param {string} type - Tipo de notificación
   */
  static async createStudentNotification(studentId, activity, type) {
    try {
      const notificationData = {
        student_id: studentId,
        type: type,
        title: 'Nueva Actividad Asignada',
        message: `Se te ha asignado una nueva actividad: "${activity.title}"`,
        activity_id: activity.id,
        priority: activity.priority,
        created_at: new Date().toISOString(),
        read: false
      };

      const { error } = await supabase
        .from('student_notifications')
        .insert([notificationData]);

      if (error) {
        console.error('❌ Error creando notificación:', error);
      } else {
        console.log('✅ Notificación creada para estudiante');
      }
    } catch (error) {
      console.error('❌ Error en notificación:', error);
    }
  }

  /**
   * Crea un registro de seguimiento de la actividad
   * @param {string} activityId - ID de la actividad asignada
   * @param {string} studentId - ID del estudiante
   * @param {string} teacherId - ID del profesor
   */
  static async createActivityTrackingRecord(activityId, studentId, teacherId) {
    try {
      const trackingData = {
        activity_id: activityId,
        student_id: studentId,
        teacher_id: teacherId,
        status: 'assigned',
        progress: 0,
        started_at: null,
        completed_at: null,
        notes: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase
        .from('activity_tracking')
        .insert([trackingData]);

      if (error) {
        console.error('❌ Error creando registro de seguimiento:', error);
      } else {
        console.log('✅ Registro de seguimiento creado');
      }
    } catch (error) {
      console.error('❌ Error en registro de seguimiento:', error);
    }
  }

  /**
   * Obtiene las actividades asignadas a un estudiante
   * @param {string} studentId - ID del estudiante
   * @returns {Promise<Object>} - Lista de actividades asignadas
   */
  static async getStudentAssignedActivities(studentId) {
    try {
      const { data, error } = await supabase
        .from('student_activities')
        .select('*')
        .eq('student_id', studentId)
        .order('assigned_at', { ascending: false });

      if (error) {
        throw new Error(`Error obteniendo actividades: ${error.message}`);
      }

      return {
        success: true,
        activities: data || []
      };
    } catch (error) {
      console.error('❌ Error obteniendo actividades del estudiante:', error);
      return {
        success: false,
        error: error.message,
        activities: []
      };
    }
  }

  /**
   * Actualiza el estado de una actividad asignada
   * @param {string} activityId - ID de la actividad
   * @param {string} status - Nuevo estado
   * @param {Object} additionalData - Datos adicionales
   * @returns {Promise<Object>} - Resultado de la actualización
   */
  static async updateActivityStatus(activityId, status, additionalData = {}) {
    try {
      const updateData = {
        status: status,
        updated_at: new Date().toISOString(),
        ...additionalData
      };

      const { data, error } = await supabase
        .from('student_activities')
        .update(updateData)
        .eq('id', activityId)
        .select()
        .single();

      if (error) {
        throw new Error(`Error actualizando actividad: ${error.message}`);
      }

      return {
        success: true,
        activity: data
      };
    } catch (error) {
      console.error('❌ Error actualizando estado de actividad:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Obtiene estadísticas de actividades asignadas por profesor
   * @param {string} teacherId - ID del profesor
   * @returns {Promise<Object>} - Estadísticas de asignaciones
   */
  static async getTeacherAssignmentStats(teacherId) {
    try {
      const { data, error } = await supabase
        .from('student_activities')
        .select('status, created_at')
        .eq('teacher_id', teacherId);

      if (error) {
        throw new Error(`Error obteniendo estadísticas: ${error.message}`);
      }

      const stats = {
        total: data.length,
        assigned: data.filter(a => a.status === 'assigned').length,
        in_progress: data.filter(a => a.status === 'in_progress').length,
        completed: data.filter(a => a.status === 'completed').length,
        overdue: data.filter(a => {
          const dueDate = new Date(a.due_date);
          const now = new Date();
          return dueDate < now && a.status !== 'completed';
        }).length
      };

      return {
        success: true,
        stats: stats
      };
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      return {
        success: false,
        error: error.message,
        stats: {
          total: 0,
          assigned: 0,
          in_progress: 0,
          completed: 0,
          overdue: 0
        }
      };
    }
  }
}

export default StudentActivityAssignmentService;
