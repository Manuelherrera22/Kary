// Servicio mock para datos del profesor
// Este archivo maneja las asignaciones de estudiantes y planes de apoyo

export const mockTeacherDataService = {
  // Obtener estudiantes asignados al profesor
  getAssignedStudents: async (teacherId) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Datos mock de estudiantes asignados
    const assignedStudents = [
      {
        id: 'mock-student-1',
        full_name: 'María García Estudiante',
        email: 'estudiante@kary.com',
        grade: '5to Primaria',
        status: 'active',
        assigned_at: '2024-01-15T10:00:00Z',
        last_activity: '2024-01-20T14:30:00Z',
        last_observation: '2024-01-19T09:15:00Z',
        general_status: 'needs_follow_up',
        emotional_alert: true,
        academic_level: 'Primaria',
        teacher_id: teacherId,
        progress: 75,
        completed_activities: 8,
        pending_tasks: 3,
        total_activities: 11,
        average_score: 82,
        last_activity_date: '2024-01-20T14:30:00Z'
      },
      {
        id: 'mock-student-2',
        full_name: 'Carlos Rodríguez Estudiante',
        email: 'carlos@kary.com',
        grade: '4to Primaria',
        status: 'active',
        assigned_at: '2024-01-10T08:00:00Z',
        last_activity: '2024-01-21T10:15:00Z',
        last_observation: '2024-01-20T16:45:00Z',
        general_status: 'good',
        emotional_alert: false,
        academic_level: 'Primaria',
        teacher_id: teacherId,
        progress: 90,
        completed_activities: 12,
        pending_tasks: 1,
        total_activities: 13,
        average_score: 88,
        last_activity_date: '2024-01-21T10:15:00Z'
      },
      {
        id: 'mock-student-3',
        full_name: 'Ana López Estudiante',
        email: 'ana@kary.com',
        grade: '6to Primaria',
        status: 'active',
        assigned_at: '2024-01-12T14:20:00Z',
        last_activity: '2024-01-19T11:30:00Z',
        last_observation: '2024-01-18T13:20:00Z',
        general_status: 'excellent',
        emotional_alert: false,
        academic_level: 'Primaria',
        teacher_id: teacherId,
        progress: 95,
        completed_activities: 15,
        pending_tasks: 0,
        total_activities: 15,
        average_score: 92,
        last_activity_date: '2024-01-19T11:30:00Z'
      }
    ];
    
    return {
      success: true,
      data: assignedStudents
    };
  },

  // Obtener planes de apoyo del profesor
  getSupportPlans: async (teacherId) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 400));
    
    // Datos mock de planes de apoyo
    const supportPlans = [
      {
        id: 'mock-plan-1',
        student_id: 'mock-student-1',
        student_name: 'María García Estudiante',
        responsible_teacher_id: teacherId,
        title: 'Plan de Apoyo - Lectura Comprensiva',
        description: 'Plan enfocado en mejorar las habilidades de lectura comprensiva de María',
        status: 'active',
        intervention_strategy: 'Estrategia de lectura guiada con apoyo visual',
        responsible_person: 'Carlos López Profesor',
        start_date: '2024-01-15T00:00:00Z',
        end_date: '2024-03-15T00:00:00Z',
        created_at: '2024-01-15T10:00:00Z',
        objectives: [
          'Mejorar la comprensión lectora en textos narrativos',
          'Desarrollar habilidades de inferencia',
          'Fortalecer el vocabulario básico'
        ],
        activities: [
          {
            id: 'activity-1',
            title: 'Lectura diaria de cuentos cortos',
            description: 'Leer un cuento corto cada día y responder preguntas de comprensión',
            due_date: '2024-02-15T00:00:00Z',
            status: 'pending'
          },
          {
            id: 'activity-2',
            title: 'Ejercicios de vocabulario',
            description: 'Completar ejercicios de vocabulario con imágenes',
            due_date: '2024-02-20T00:00:00Z',
            status: 'pending'
          }
        ]
      }
    ];
    
    return {
      success: true,
      data: supportPlans
    };
  },

  // Obtener actividades de estudiantes
  getStudentActivities: async (teacherId, studentId = null) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 350));
    
    // Datos mock de actividades
    const activities = [
      {
        id: 'activity-1',
        student_id: 'mock-student-1',
        teacher_id: teacherId,
        support_plan_id: 'mock-plan-1',
        title: 'Lectura de "El Patito Feo"',
        description: 'Leer el cuento y responder las preguntas de comprensión',
        due_date: '2024-02-15T00:00:00Z',
        status: 'sent_to_student',
        created_at: '2024-01-20T10:00:00Z',
        student_name: 'María García Estudiante'
      },
      {
        id: 'activity-2',
        student_id: 'mock-student-1',
        teacher_id: teacherId,
        support_plan_id: 'mock-plan-1',
        title: 'Ejercicio de Vocabulario - Animales',
        description: 'Completar el ejercicio de vocabulario con nombres de animales',
        due_date: '2024-02-20T00:00:00Z',
        status: 'draft',
        created_at: '2024-01-21T14:30:00Z',
        student_name: 'María García Estudiante'
      }
    ];
    
    // Filtrar por estudiante si se especifica
    const filteredActivities = studentId 
      ? activities.filter(activity => activity.student_id === studentId)
      : activities;
    
    return {
      success: true,
      data: filteredActivities
    };
  },

  // Generar actividades para un plan
  generateActivitiesForPlan: async (planId, studentId, teacherId) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Actividades mock generadas
    const generatedActivities = [
      {
        id: `temp-${Date.now()}-1`,
        student_id: studentId,
        teacher_id: teacherId,
        support_plan_id: planId,
        title: 'Actividad de Lectura Comprensiva',
        description: 'Leer el texto asignado y responder las preguntas de comprensión',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'draft',
        created_at: new Date().toISOString()
      },
      {
        id: `temp-${Date.now()}-2`,
        student_id: studentId,
        teacher_id: teacherId,
        support_plan_id: planId,
        title: 'Ejercicio de Matemáticas Básicas',
        description: 'Resolver los problemas de suma y resta propuestos',
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'draft',
        created_at: new Date().toISOString()
      },
      {
        id: `temp-${Date.now()}-3`,
        student_id: studentId,
        teacher_id: teacherId,
        support_plan_id: planId,
        title: 'Actividad de Escritura Creativa',
        description: 'Escribir un cuento corto usando las palabras del vocabulario',
        due_date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'draft',
        created_at: new Date().toISOString()
      }
    ];
    
    return {
      success: true,
      data: generatedActivities
    };
  },

  // Guardar actividades
  saveActivities: async (activities, studentId, teacherId, planId) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Simular guardado exitoso
    const savedActivities = activities.map(activity => ({
      ...activity,
      id: activity.id?.startsWith('temp-') ? `saved-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` : activity.id,
      student_id: studentId,
      teacher_id: teacherId,
      support_plan_id: planId,
      created_at: new Date().toISOString()
    }));
    
    return {
      success: true,
      data: savedActivities
    };
  },

  // Enviar actividades al estudiante
  sendActivitiesToStudent: async (activities, studentId, teacherId, planId) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Simular envío exitoso
    const sentActivities = activities.map(activity => ({
      ...activity,
      status: 'sent_to_student',
      sent_at: new Date().toISOString()
    }));
    
    return {
      success: true,
      data: sentActivities
    };
  },

  // Obtener estadísticas del profesor
  getTeacherStats: async (teacherId) => {
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 200));
    
    const stats = {
      activePlans: 1,
      pendingActivities: 2,
      registeredObservations: 5,
      assignedStudents: 1
    };
    
    return {
      success: true,
      data: stats
    };
  }
};

export default mockTeacherDataService;
