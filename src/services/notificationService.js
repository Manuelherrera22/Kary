// Servicio de Notificaciones - Sistema de notificaciones en tiempo real
import unifiedDataService from './unifiedDataService.js';

class NotificationService {
  constructor() {
    this.listeners = [];
    this.studentListeners = new Map();
    this.teacherListeners = new Map();
  }

  // Cargar notificaciones desde localStorage
  loadFromStorage() {
    try {
      const stored = localStorage.getItem('kary_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading notifications from storage:', error);
      return [];
    }
  }

  // Guardar notificaciones en localStorage
  saveToStorage() {
    try {
      localStorage.setItem('kary_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Error saving notifications to storage:', error);
    }
  }

  // Generar ID único
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Crear notificación
  createNotification(notificationData) {
    const notification = {
      id: this.generateId(),
      ...notificationData,
      createdAt: new Date().toISOString(),
      read: false,
      priority: notificationData.priority || 'medium' // low, medium, high, urgent
    };

    this.notifications.push(notification);
    this.saveToStorage();
    this.notifyListeners('notification_created', notification);
    
    return { success: true, data: notification };
  }

  // Crear notificación para estudiante
  createStudentNotification(studentId, notificationData) {
    const notification = {
      id: this.generateId(),
      ...notificationData,
      recipientId: studentId,
      recipientType: 'student',
      createdAt: new Date().toISOString(),
      read: false,
      priority: notificationData.priority || 'medium'
    };

    this.notifications.push(notification);
    this.saveToStorage();
    this.notifyStudentListeners(studentId, 'notification_created', notification);
    
    return { success: true, data: notification };
  }

  // Crear notificación para profesor
  createTeacherNotification(teacherId, notificationData) {
    const notification = {
      id: this.generateId(),
      ...notificationData,
      recipientId: teacherId,
      recipientType: 'teacher',
      createdAt: new Date().toISOString(),
      read: false,
      priority: notificationData.priority || 'medium'
    };

    this.notifications.push(notification);
    this.saveToStorage();
    this.notifyTeacherListeners(teacherId, 'notification_created', notification);
    
    return { success: true, data: notification };
  }

  // Obtener notificaciones de un usuario
  getUserNotifications(userId, userType = 'student') {
    const result = unifiedDataService.getNotifications(userId);
    return result.success ? result.data : [];
  }

  // Obtener notificaciones no leídas
  getUnreadNotifications(userId, userType = 'student') {
    return this.notifications.filter(n => 
      n.recipientId === userId && 
      n.recipientType === userType && 
      !n.read
    ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // Marcar notificación como leída
  markAsRead(notificationId, userId) {
    const notification = this.notifications.find(n => 
      n.id === notificationId && n.recipientId === userId
    );
    
    if (!notification) {
      return { success: false, error: 'Notification not found' };
    }

    notification.read = true;
    notification.readAt = new Date().toISOString();
    this.saveToStorage();
    this.notifyListeners('notification_read', notification);
    
    return { success: true, data: notification };
  }

  // Marcar todas las notificaciones como leídas
  markAllAsRead(userId, userType = 'student') {
    const userNotifications = this.notifications.filter(n => 
      n.recipientId === userId && n.recipientType === userType && !n.read
    );

    userNotifications.forEach(notification => {
      notification.read = true;
      notification.readAt = new Date().toISOString();
    });

    this.saveToStorage();
    this.notifyListeners('notifications_marked_read', { userId, userType, count: userNotifications.length });
    
    return { success: true, data: { count: userNotifications.length } };
  }

  // Eliminar notificación
  deleteNotification(notificationId, userId) {
    const notificationIndex = this.notifications.findIndex(n => 
      n.id === notificationId && n.recipientId === userId
    );
    
    if (notificationIndex === -1) {
      return { success: false, error: 'Notification not found' };
    }

    const notification = this.notifications[notificationIndex];
    this.notifications.splice(notificationIndex, 1);
    this.saveToStorage();
    this.notifyListeners('notification_deleted', notification);
    
    return { success: true, data: notification };
  }

  // Crear notificaciones automáticas para actividades
  createActivityNotifications(activity, assignments) {
    const notifications = [];

    // Notificación para el profesor
    notifications.push(this.createTeacherNotification(activity.createdBy, {
      type: 'activity_created',
      title: 'Actividad Creada',
      message: `Has creado la actividad "${activity.title}" y la has asignado a ${assignments.length} estudiantes`,
      data: { activityId: activity.id, assignmentCount: assignments.length }
    }));

    // Notificaciones para los estudiantes
    assignments.forEach(assignment => {
      notifications.push(this.createStudentNotification(assignment.assignedTo, {
        type: 'activity_assigned',
        title: 'Nueva Actividad Asignada',
        message: `Se te ha asignado una nueva actividad: "${activity.title}"`,
        data: { 
          activityId: assignment.id, 
          dueDate: activity.dueDate,
          subject: activity.subject,
          grade: activity.grade
        },
        priority: 'high'
      }));
    });

    return { success: true, data: notifications };
  }

  // Crear notificación de progreso
  createProgressNotification(activity, studentId, progress) {
    return this.createTeacherNotification(activity.createdBy, {
      type: 'progress_update',
      title: 'Progreso de Actividad',
      message: `El estudiante ha completado el ${progress}% de la actividad "${activity.title}"`,
      data: { 
        activityId: activity.id, 
        studentId, 
        progress,
        activityTitle: activity.title
      },
      priority: progress >= 100 ? 'high' : 'medium'
    });
  }

  // Crear notificación de entrega
  createSubmissionNotification(activity, studentId, submission) {
    return this.createTeacherNotification(activity.createdBy, {
      type: 'activity_submitted',
      title: 'Actividad Entregada',
      message: `Un estudiante ha entregado la actividad "${activity.title}"`,
      data: { 
        activityId: activity.id, 
        studentId, 
        submissionId: submission.id,
        activityTitle: activity.title
      },
      priority: 'high'
    });
  }

  // Crear notificación de feedback
  createFeedbackNotification(activity, studentId, feedback) {
    return this.createStudentNotification(studentId, {
      type: 'feedback_received',
      title: 'Feedback Recibido',
      message: `Has recibido feedback en tu actividad "${activity.title}"`,
      data: { 
        activityId: activity.id, 
        feedbackId: feedback.id,
        activityTitle: activity.title
      },
      priority: 'medium'
    });
  }

  // Crear notificación de recordatorio
  createReminderNotification(activity, studentId, reminderType) {
    const reminderMessages = {
      due_soon: `La actividad "${activity.title}" vence pronto`,
      overdue: `La actividad "${activity.title}" está vencida`,
      due_today: `La actividad "${activity.title}" vence hoy`
    };

    return this.createStudentNotification(studentId, {
      type: 'reminder',
      title: 'Recordatorio de Actividad',
      message: reminderMessages[reminderType] || reminderMessages.due_soon,
      data: { 
        activityId: activity.id, 
        reminderType,
        dueDate: activity.dueDate,
        activityTitle: activity.title
      },
      priority: reminderType === 'overdue' ? 'urgent' : 'medium'
    });
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

  // Suscribirse a cambios específicos de profesor
  subscribeToTeacher(teacherId, listener) {
    if (!this.teacherListeners.has(teacherId)) {
      this.teacherListeners.set(teacherId, []);
    }
    this.teacherListeners.get(teacherId).push(listener);
    
    return () => {
      const listeners = this.teacherListeners.get(teacherId) || [];
      this.teacherListeners.set(teacherId, listeners.filter(l => l !== listener));
    };
  }

  // Notificar a los listeners generales
  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });
  }

  // Notificar a listeners específicos de estudiante
  notifyStudentListeners(studentId, event, data) {
    const listeners = this.studentListeners.get(studentId) || [];
    listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.error('Error in student notification listener:', error);
      }
    });
  }

  // Notificar a listeners específicos de profesor
  notifyTeacherListeners(teacherId, event, data) {
    const listeners = this.teacherListeners.get(teacherId) || [];
    listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.error('Error in teacher notification listener:', error);
      }
    });
  }

  // Obtener estadísticas de notificaciones
  getNotificationStats(userId, userType = 'student') {
    const userNotifications = this.getUserNotifications(userId, userType);
    
    const stats = {
      total: userNotifications.length,
      unread: userNotifications.filter(n => !n.read).length,
      read: userNotifications.filter(n => n.read).length,
      byPriority: {
        low: userNotifications.filter(n => n.priority === 'low').length,
        medium: userNotifications.filter(n => n.priority === 'medium').length,
        high: userNotifications.filter(n => n.priority === 'high').length,
        urgent: userNotifications.filter(n => n.priority === 'urgent').length
      },
      byType: {}
    };

    // Contar por tipo
    userNotifications.forEach(notification => {
      const type = notification.type;
      stats.byType[type] = (stats.byType[type] || 0) + 1;
    });

    return { success: true, data: stats };
  }

  // Limpiar notificaciones antiguas
  cleanOldNotifications(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);
    
    const oldNotifications = this.notifications.filter(n => 
      new Date(n.createdAt) < cutoffDate
    );
    
    this.notifications = this.notifications.filter(n => 
      new Date(n.createdAt) >= cutoffDate
    );
    
    this.saveToStorage();
    this.notifyListeners('notifications_cleaned', { count: oldNotifications.length });
    
    return { success: true, data: { cleaned: oldNotifications.length } };
  }
}

// Instancia singleton
const notificationService = new NotificationService();

export default notificationService;
