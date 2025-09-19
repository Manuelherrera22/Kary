/**
 * Servicio de Notificaciones en Tiempo Real - Kary Educational Platform
 * Sincroniza notificaciones entre todos los dashboards
 */

class RealTimeNotificationService {
  constructor() {
    this.subscribers = new Map();
    this.notifications = [];
    this.initializeData();
  }

  initializeData() {
    // Cargar notificaciones existentes del localStorage
    const stored = localStorage.getItem('kary_realtime_notifications');
    if (stored) {
      this.notifications = JSON.parse(stored);
    }
  }

  // === MÉTODOS DE SUSCRIPCIÓN ===
  subscribe(userId, callback) {
    if (!this.subscribers.has(userId)) {
      this.subscribers.set(userId, new Set());
    }
    this.subscribers.get(userId).add(callback);
    
    return () => {
      const callbacks = this.subscribers.get(userId);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  publish(userId, notification) {
    const callbacks = this.subscribers.get(userId);
    if (callbacks) {
      callbacks.forEach(callback => callback(notification));
    }
  }

  // === MÉTODOS DE NOTIFICACIONES ===
  createNotification(notificationData) {
    const notification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...notificationData,
      read: false,
      createdAt: new Date().toISOString(),
      priority: notificationData.priority || 'medium'
    };

    this.notifications.push(notification);
    this.saveToStorage();

    // Notificar a todos los usuarios relevantes
    this.notifyRelevantUsers(notification);

    return { success: true, data: notification };
  }

  notifyRelevantUsers(notification) {
    // Notificar al usuario principal
    this.publish(notification.userId, notification);

    // Notificar a usuarios relacionados según el tipo
    switch (notification.type) {
      case 'case_created':
        // Notificar al profesor del estudiante
        if (notification.data?.studentId) {
          this.publish(`teacher-${notification.data.studentId}`, notification);
        }
        break;
      
      case 'activity_assigned':
        // Notificar al psicopedagogo del estudiante
        if (notification.data?.studentId) {
          this.publish(`psycho-${notification.data.studentId}`, notification);
        }
        break;
      
      case 'student_progress_updated':
        // Notificar a profesor y psicopedagogo
        if (notification.data?.studentId) {
          this.publish(`teacher-${notification.data.studentId}`, notification);
          this.publish(`psycho-${notification.data.studentId}`, notification);
        }
        break;
      
      case 'emotional_alert':
        // Notificar a todos los roles relevantes
        if (notification.data?.studentId) {
          this.publish(`teacher-${notification.data.studentId}`, notification);
          this.publish(`psycho-${notification.data.studentId}`, notification);
        }
        break;
    }
  }

  getNotifications(userId, filters = {}) {
    let userNotifications = this.notifications.filter(n => 
      n.userId === userId || 
      n.userId === `teacher-${userId}` || 
      n.userId === `psycho-${userId}` ||
      n.userId === `student-${userId}`
    );

    if (filters.unreadOnly) {
      userNotifications = userNotifications.filter(n => !n.read);
    }

    if (filters.type) {
      userNotifications = userNotifications.filter(n => n.type === filters.type);
    }

    if (filters.priority) {
      userNotifications = userNotifications.filter(n => n.priority === filters.priority);
    }

    // Ordenar por fecha de creación (más recientes primero)
    userNotifications.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return { success: true, data: userNotifications };
  }

  markAsRead(notificationId) {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      notification.readAt = new Date().toISOString();
      this.saveToStorage();
      return { success: true, data: notification };
    }
    return { success: false, error: 'Notificación no encontrada' };
  }

  markAllAsRead(userId) {
    const userNotifications = this.notifications.filter(n => 
      n.userId === userId || 
      n.userId === `teacher-${userId}` || 
      n.userId === `psycho-${userId}` ||
      n.userId === `student-${userId}`
    );

    userNotifications.forEach(notification => {
      notification.read = true;
      notification.readAt = new Date().toISOString();
    });

    this.saveToStorage();
    return { success: true, data: userNotifications };
  }

  // === MÉTODOS DE ALERTAS INTELIGENTES ===
  createIntelligentAlert(alertData) {
    const alert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'intelligent_alert',
      ...alertData,
      read: false,
      createdAt: new Date().toISOString(),
      priority: this.calculateAlertPriority(alertData)
    };

    this.notifications.push(alert);
    this.saveToStorage();

    // Notificar a todos los usuarios relevantes
    this.notifyRelevantUsers(alert);

    return { success: true, data: alert };
  }

  calculateAlertPriority(alertData) {
    // Lógica para calcular prioridad basada en el tipo de alerta
    switch (alertData.alertType) {
      case 'emotional_crisis':
      case 'academic_failure':
        return 'urgent';
      case 'behavioral_change':
      case 'attendance_issue':
        return 'high';
      case 'progress_stagnation':
      case 'social_isolation':
        return 'medium';
      default:
        return 'low';
    }
  }

  // === MÉTODOS DE SINCRONIZACIÓN ===
  syncWithUnifiedDataService(unifiedDataService) {
    // Sincronizar con el servicio unificado de datos
    const syncData = unifiedDataService.getNotifications();
    if (syncData.success) {
      // Merge con notificaciones existentes
      syncData.data.forEach(notification => {
        if (!this.notifications.find(n => n.id === notification.id)) {
          this.notifications.push(notification);
        }
      });
      this.saveToStorage();
    }
  }

  // === MÉTODOS DE PERSISTENCIA ===
  saveToStorage() {
    localStorage.setItem('kary_realtime_notifications', JSON.stringify(this.notifications));
  }

  // === MÉTODOS DE ESTADÍSTICAS ===
  getNotificationStats(userId) {
    const userNotifications = this.notifications.filter(n => 
      n.userId === userId || 
      n.userId === `teacher-${userId}` || 
      n.userId === `psycho-${userId}` ||
      n.userId === `student-${userId}`
    );

    const stats = {
      total: userNotifications.length,
      unread: userNotifications.filter(n => !n.read).length,
      byType: {},
      byPriority: {},
      recent: userNotifications.slice(0, 5)
    };

    // Agrupar por tipo
    userNotifications.forEach(notification => {
      stats.byType[notification.type] = (stats.byType[notification.type] || 0) + 1;
      stats.byPriority[notification.priority] = (stats.byPriority[notification.priority] || 0) + 1;
    });

    return { success: true, data: stats };
  }

  // === MÉTODOS DE LIMPIEZA ===
  cleanupOldNotifications(daysOld = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    this.notifications = this.notifications.filter(notification => 
      new Date(notification.createdAt) > cutoffDate
    );

    this.saveToStorage();
    return { success: true, data: this.notifications };
  }
}

// Crear instancia singleton
const realTimeNotificationService = new RealTimeNotificationService();

export default realTimeNotificationService;

