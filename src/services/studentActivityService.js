// Servicio para gestionar actividades de estudiantes
class StudentActivityService {
  constructor() {
    this.baseUrl = '/api/student-activities';
  }

  // Obtener todas las actividades de un estudiante
  async getStudentActivities(studentId) {
    try {
      // Simulación de llamada a API
      const mockActivities = [
        {
          id: 'act-001',
          student_id: studentId,
          teacher_id: 'teacher-001',
          plan_id: 'plan-001',
          title: 'Ejercicios de Matemáticas Básicas',
          description: 'Resuelve los siguientes problemas de suma y resta',
          objective: 'Practicar operaciones básicas de matemáticas',
          duration: 30,
          difficulty: 'Fácil',
          priority: 'Alta',
          category: 'Matemáticas',
          subject: 'Matemáticas',
          grade_level: '3°',
          materials: ['Lápiz', 'Papel', 'Calculadora'],
          adaptations: 'Usar calculadora para verificar respuestas',
          instructions: 'Lee cada problema cuidadosamente y resuelve paso a paso',
          assessment: 'Se evaluará la precisión y el proceso de resolución',
          learning_style: 'Visual',
          cognitive_domain: 'Comprensión',
          ai_generated: true,
          generated_by: 'Gemini AI',
          based_on_plan: 'plan-001',
          based_on_recommendations: ['necesita práctica en matemáticas'],
          status: 'assigned',
          assigned_at: new Date().toISOString(),
          due_date: new Date(Date.now() + 86400000).toISOString(), // +1 día
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'act-002',
          student_id: studentId,
          teacher_id: 'teacher-002',
          plan_id: 'plan-002',
          title: 'Lectura Comprensiva',
          description: 'Lee el cuento y responde las preguntas',
          objective: 'Mejorar la comprensión lectora',
          duration: 45,
          difficulty: 'Medio',
          priority: 'Media',
          category: 'Lenguaje',
          subject: 'Lenguaje',
          grade_level: '3°',
          materials: ['Cuento', 'Hoja de preguntas'],
          adaptations: 'Lectura en voz alta disponible',
          instructions: 'Lee el cuento completo antes de responder',
          assessment: 'Se evaluará la comprensión y análisis',
          learning_style: 'Auditivo',
          cognitive_domain: 'Análisis',
          ai_generated: true,
          generated_by: 'Gemini AI',
          based_on_plan: 'plan-002',
          based_on_recommendations: ['mejorar comprensión lectora'],
          status: 'in_progress',
          assigned_at: new Date(Date.now() - 3600000).toISOString(), // -1 hora
          started_at: new Date(Date.now() - 1800000).toISOString(), // -30 min
          due_date: new Date(Date.now() + 172800000).toISOString(), // +2 días
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: 'act-003',
          student_id: studentId,
          teacher_id: 'teacher-001',
          plan_id: 'plan-003',
          title: 'Experimento de Ciencias',
          description: 'Realiza el experimento del volcán',
          objective: 'Aprender sobre reacciones químicas',
          duration: 60,
          difficulty: 'Difícil',
          priority: 'Baja',
          category: 'Ciencias',
          subject: 'Ciencias',
          grade_level: '3°',
          materials: ['Vinagre', 'Bicarbonato', 'Colorante', 'Botella'],
          adaptations: 'Supervisión adulta requerida',
          instructions: 'Sigue las instrucciones paso a paso',
          assessment: 'Se evaluará la observación y conclusiones',
          learning_style: 'Kinestésico',
          cognitive_domain: 'Aplicación',
          ai_generated: false,
          generated_by: 'Profesor',
          based_on_plan: 'plan-003',
          based_on_recommendations: ['fomentar experimentación'],
          status: 'completed',
          assigned_at: new Date(Date.now() - 259200000).toISOString(), // -3 días
          started_at: new Date(Date.now() - 216000000).toISOString(), // -2.5 días
          completed_at: new Date(Date.now() - 172800000).toISOString(), // -2 días
          due_date: new Date(Date.now() - 86400000).toISOString(), // -1 día
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      return {
        success: true,
        data: mockActivities.filter(activity => activity.student_id === studentId)
      };
    } catch (error) {
      console.error('Error fetching student activities:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Actualizar estado de una actividad
  async updateActivityStatus(activityId, newStatus) {
    try {
      // Simulación de actualización
      console.log(`Updating activity ${activityId} to status: ${newStatus}`);
      
      return {
        success: true,
        data: {
          id: activityId,
          status: newStatus,
          updated_at: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error updating activity status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener detalles de una actividad específica
  async getActivityDetails(activityId) {
    try {
      // Simulación de obtención de detalles
      const mockActivity = {
        id: activityId,
        title: 'Actividad de Ejemplo',
        description: 'Descripción detallada de la actividad',
        objective: 'Objetivo específico de aprendizaje',
        instructions: 'Instrucciones paso a paso',
        materials: ['Material 1', 'Material 2'],
        adaptations: 'Adaptaciones específicas',
        assessment: 'Criterios de evaluación'
      };

      return {
        success: true,
        data: mockActivity
      };
    } catch (error) {
      console.error('Error fetching activity details:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Marcar actividad como completada con evaluación
  async completeActivityWithEvaluation(activityId, evaluation) {
    try {
      console.log(`Completing activity ${activityId} with evaluation:`, evaluation);
      
      return {
        success: true,
        data: {
          id: activityId,
          status: 'completed',
          evaluation: evaluation,
          completed_at: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error completing activity:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new StudentActivityService();
