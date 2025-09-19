// Servicio de Actividades - Manejo real de datos y sincronización
import unifiedDataService from './unifiedDataService.js';

class ActivityService {
  constructor() {
    this.activities = this.loadFromStorage();
    this.listeners = [];
    this.studentListeners = new Map();
  }

  // Cargar actividades desde localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('kary_activities');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading activities from storage:', error);
      return [];
    }
  }

  // Guardar actividades en localStorage
  saveToStorage() {
    try {
      localStorage.setItem('kary_activities', JSON.stringify(this.activities));
    } catch (error) {
      console.error('Error saving activities to storage:', error);
    }
  }

  // Generar ID único
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Crear nueva actividad
  createActivity(activityData) {
    const result = unifiedDataService.createActivity(activityData);
    if (result.success) {
      this.notifyListeners('activity_created', result.data);
    }
    return result;
  }

  // Asignar actividad a estudiantes
  assignActivityToStudents(activityId, studentIds) {
    const activity = (this.activities || []).find(a => a.id === activityId);
    if (!activity) {
      return { success: false, error: 'Activity not found' };
    }

    // Crear copias de la actividad para cada estudiante
    const assignments = studentIds.map(studentId => {
      const assignment = {
        ...activity,
        id: this.generateId(),
        parentActivityId: activityId,
        assignedTo: studentId,
        assignedAt: new Date().toISOString(),
        status: 'assigned'
      };
      
      (this.activities || []).push(assignment);
      return assignment;
    });

    this.saveToStorage();
    this.notifyListeners('activity_assigned', { activity, assignments });
    
    return { success: true, data: assignments };
  }

  // Obtener actividades de un estudiante
  getStudentActivities(studentId) {
    const result = unifiedDataService.getActivities({ studentId });
    return result.success ? result.data : [];
  }

  // Obtener actividades de un profesor
  getTeacherActivities(teacherId) {
    const result = unifiedDataService.getActivities({ teacherId });
    return result.success ? result.data : [];
  }

  // Actualizar progreso de actividad
  updateActivityProgress(activityId, progress, studentId) {
    const activity = (this.activities || []).find(a => 
      a.id === activityId && a.assignedTo === studentId
    );
    
    if (!activity) {
      return { success: false, error: 'Activity not found' };
    }

    activity.progress = Math.min(100, Math.max(0, progress));
    activity.updatedAt = new Date().toISOString();
    
    if (progress >= 100) {
      activity.status = 'completed';
      activity.completedAt = new Date().toISOString();
    } else if (progress > 0) {
      activity.status = 'in_progress';
    }

    this.saveToStorage();
    this.notifyListeners('activity_progress_updated', activity);
    
    return { success: true, data: activity };
  }

  // Enviar actividad (marcar como enviada)
  submitActivity(activityId, submission, studentId) {
    const activity = (this.activities || []).find(a => 
      a.id === activityId && a.assignedTo === studentId
    );
    
    if (!activity) {
      return { success: false, error: 'Activity not found' };
    }

    const submissionData = {
      id: this.generateId(),
      activityId,
      studentId,
      content: submission,
      submittedAt: new Date().toISOString(),
      status: 'submitted'
    };

    activity.submissions.push(submissionData);
    activity.status = 'completed';
    activity.progress = 100;
    activity.completedAt = new Date().toISOString();
    activity.updatedAt = new Date().toISOString();

    this.saveToStorage();
    this.notifyListeners('activity_submitted', { activity, submission: submissionData });
    
    return { success: true, data: { activity, submission: submissionData } };
  }

  // Añadir feedback del profesor
  addFeedback(activityId, feedback, teacherId) {
    const activity = (this.activities || []).find(a => a.id === activityId);
    
    if (!activity) {
      return { success: false, error: 'Activity not found' };
    }

    activity.feedback = {
      id: this.generateId(),
      activityId,
      teacherId,
      content: feedback,
      createdAt: new Date().toISOString()
    };
    activity.updatedAt = new Date().toISOString();

    this.saveToStorage();
    this.notifyListeners('feedback_added', { activity, feedback });
    
    return { success: true, data: { activity, feedback } };
  }

  // Obtener estadísticas de actividades
  getActivityStats(teacherId) {
    const teacherActivities = this.getTeacherActivities(teacherId);
    const allAssignments = (this.activities || []).filter(a => 
      a.createdBy === teacherId && a.assignedTo
    );

    const stats = {
      totalActivities: teacherActivities.length,
      totalAssignments: allAssignments.length,
      completedAssignments: allAssignments.filter(a => a.status === 'completed').length,
      pendingAssignments: allAssignments.filter(a => a.status === 'assigned').length,
      inProgressAssignments: allAssignments.filter(a => a.status === 'in_progress').length,
      overdueAssignments: allAssignments.filter(a => {
        if (a.status === 'completed') return false;
        const dueDate = new Date(a.dueDate);
        return dueDate < new Date();
      }).length
    };

    return { success: true, data: stats };
  }

  // Obtener estadísticas de estudiante
  getStudentStats(studentId) {
    const studentActivities = this.getStudentActivities(studentId);
    
    const stats = {
      totalAssigned: studentActivities.length,
      completed: studentActivities.filter(a => a.status === 'completed').length,
      inProgress: studentActivities.filter(a => a.status === 'in_progress').length,
      pending: studentActivities.filter(a => a.status === 'assigned').length,
      overdue: studentActivities.filter(a => {
        if (a.status === 'completed') return false;
        const dueDate = new Date(a.dueDate);
        return dueDate < new Date();
      }).length,
      averageProgress: studentActivities.length > 0 
        ? studentActivities.reduce((sum, a) => sum + a.progress, 0) / studentActivities.length 
        : 0
    };

    return { success: true, data: stats };
  }

  // Suscribirse a cambios
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Suscribirse a cambios específicos de estudiante
  subscribeToStudent(studentId, listener) {
    if (!this.studentListeners.has(studentId)) {
      this.studentListeners.set(studentId, []);
    }
    this.studentListeners.get(studentId).push(listener);
    
    return () => {
      const listeners = this.studentListeners.get(studentId) || [];
      this.studentListeners.set(studentId, listeners.filter(l => l !== listener));
    };
  }

  // Notificar a los listeners
  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.error('Error in activity listener:', error);
      }
    });

    // Notificar a listeners específicos de estudiante
    if (data.assignedTo) {
      const studentListeners = this.studentListeners.get(data.assignedTo) || [];
      studentListeners.forEach(listener => {
        try {
          listener(event, data);
        } catch (error) {
          console.error('Error in student activity listener:', error);
        }
      });
    }
  }

  // Obtener actividades recientes
  getRecentActivities(limit = 10) {
    const activities = (this.activities || []) || [];
    return activities
      .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      .slice(0, limit);
  }

  // Buscar actividades
  searchActivities(query, filters = {}) {
    let results = (this.activities || []) || [];

    if (query) {
      const searchTerm = query.toLowerCase();
      results = results.filter(a => 
        a.title.toLowerCase().includes(searchTerm) ||
        a.description.toLowerCase().includes(searchTerm) ||
        a.subject.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status) {
      results = results.filter(a => a.status === filters.status);
    }

    if (filters.subject) {
      results = results.filter(a => a.subject === filters.subject);
    }

    if (filters.grade) {
      results = results.filter(a => a.grade === filters.grade);
    }

    if (filters.teacherId) {
      results = results.filter(a => a.createdBy === filters.teacherId);
    }

    if (filters.studentId) {
      results = results.filter(a => a.assignedTo === filters.studentId);
    }

    return { success: true, data: results };
  }

  // Eliminar actividad
  deleteActivity(activityId, teacherId) {
    const activityIndex = (this.activities || []).findIndex(a => 
      a.id === activityId && a.createdBy === teacherId
    );
    
    if (activityIndex === -1) {
      return { success: false, error: 'Activity not found or unauthorized' };
    }

    const activity = (this.activities || [])[activityIndex];
    (this.activities || []).splice(activityIndex, 1);
    this.saveToStorage();
    this.notifyListeners('activity_deleted', activity);
    
    return { success: true, data: activity };
  }

  // Duplicar actividad
  duplicateActivity(activityId, teacherId) {
    const originalActivity = (this.activities || []).find(a => 
      a.id === activityId && a.createdBy === teacherId
    );
    
    if (!originalActivity) {
      return { success: false, error: 'Activity not found or unauthorized' };
    }

    const duplicatedActivity = {
      ...originalActivity,
      id: this.generateId(),
      title: `${originalActivity.title} (Copia)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft',
      progress: 0,
      submissions: [],
      feedback: null,
      assignedTo: null
    };

    (this.activities || []).push(duplicatedActivity);
    this.saveToStorage();
    this.notifyListeners('activity_duplicated', duplicatedActivity);
    
    return { success: true, data: duplicatedActivity };
  }
}

// Instancia singleton
const activityService = new ActivityService();

export default activityService;
