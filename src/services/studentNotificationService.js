// Servicio para gestionar notificaciones de estudiantes
class StudentNotificationService {
  constructor() {
    this.baseUrl = '/api/student-notifications';
  }

  // Obtener todas las notificaciones de un estudiante
  async getStudentNotifications(studentId) {
    try {
      // Simulación de notificaciones
      const mockNotifications = [
        {
          id: 1,
          student_id: studentId,
          type: 'achievement',
          title: '¡Logro Desbloqueado!',
          message: 'Has completado 5 actividades seguidas. ¡Excelente trabajo!',
          priority: 'high',
          timestamp: new Date().toISOString(),
          read: false,
          icon: '🏆',
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/50',
          action_required: false,
          category: 'achievement'
        },
        {
          id: 2,
          student_id: studentId,
          type: 'academic',
          title: 'Nueva Actividad Asignada',
          message: 'Tu profesor te ha asignado una nueva actividad de matemáticas.',
          priority: 'medium',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: false,
          icon: '📚',
          color: 'text-blue-400',
          bgColor: 'bg-blue-500/20',
          borderColor: 'border-blue-500/50',
          action_required: true,
          category: 'academic',
          activity_id: 'act-001'
        },
        {
          id: 3,
          student_id: studentId,
          type: 'emotional',
          title: 'Recordatorio de Bienestar',
          message: 'Recuerda tomar descansos regulares. Tu bienestar es importante.',
          priority: 'low',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          read: true,
          icon: '💙',
          color: 'text-purple-400',
          bgColor: 'bg-purple-500/20',
          borderColor: 'border-purple-500/50',
          action_required: false,
          category: 'wellness'
        },
        {
          id: 4,
          student_id: studentId,
          type: 'urgent',
          title: 'Actividad Próxima a Vencer',
          message: 'Tienes una actividad de historia que vence mañana.',
          priority: 'urgent',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          read: false,
          icon: '⚠️',
          color: 'text-red-400',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/50',
          action_required: true,
          category: 'deadline',
          activity_id: 'act-002',
          due_date: new Date(Date.now() + 86400000).toISOString()
        },
        {
          id: 5,
          student_id: studentId,
          type: 'feedback',
          title: 'Retroalimentación Recibida',
          message: 'Tu profesor ha enviado comentarios sobre tu última actividad.',
          priority: 'medium',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          read: false,
          icon: '💬',
          color: 'text-green-400',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/50',
          action_required: true,
          category: 'feedback',
          activity_id: 'act-003'
        },
        {
          id: 6,
          student_id: studentId,
          type: 'motivation',
          title: '¡Sigue así!',
          message: 'Tu progreso esta semana ha sido increíble. ¡Mantén el ritmo!',
          priority: 'low',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          read: true,
          icon: '🌟',
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/20',
          borderColor: 'border-orange-500/50',
          action_required: false,
          category: 'motivation'
        }
      ];

      return {
        success: true,
        data: mockNotifications.filter(notification => notification.student_id === studentId)
      };
    } catch (error) {
      console.error('Error fetching student notifications:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Marcar notificación como leída
  async markAsRead(notificationId) {
    try {
      console.log(`Marking notification ${notificationId} as read`);
      
      return {
        success: true,
        data: {
          id: notificationId,
          read: true,
          read_at: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Marcar todas las notificaciones como leídas
  async markAllAsRead(studentId) {
    try {
      console.log(`Marking all notifications as read for student ${studentId}`);
      
      return {
        success: true,
        data: {
          student_id: studentId,
          marked_count: 5,
          marked_at: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Crear nueva notificación
  async createNotification(studentId, notificationData) {
    try {
      const newNotification = {
        id: Date.now(),
        student_id: studentId,
        ...notificationData,
        timestamp: new Date().toISOString(),
        read: false
      };

      console.log('Creating new notification:', newNotification);
      
      return {
        success: true,
        data: newNotification
      };
    } catch (error) {
      console.error('Error creating notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener notificaciones por categoría
  async getNotificationsByCategory(studentId, category) {
    try {
      const result = await this.getStudentNotifications(studentId);
      if (result.success) {
        const filtered = result.data.filter(notification => 
          notification.category === category
        );
        return {
          success: true,
          data: filtered
        };
      }
      return result;
    } catch (error) {
      console.error('Error fetching notifications by category:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener estadísticas de notificaciones
  async getNotificationStats(studentId) {
    try {
      const result = await this.getStudentNotifications(studentId);
      if (result.success) {
        const notifications = result.data;
        const stats = {
          total: notifications.length,
          unread: notifications.filter(n => !n.read).length,
          byPriority: {
            urgent: notifications.filter(n => n.priority === 'urgent').length,
            high: notifications.filter(n => n.priority === 'high').length,
            medium: notifications.filter(n => n.priority === 'medium').length,
            low: notifications.filter(n => n.priority === 'low').length
          },
          byCategory: {
            academic: notifications.filter(n => n.category === 'academic').length,
            achievement: notifications.filter(n => n.category === 'achievement').length,
            wellness: notifications.filter(n => n.category === 'wellness').length,
            deadline: notifications.filter(n => n.category === 'deadline').length,
            feedback: notifications.filter(n => n.category === 'feedback').length,
            motivation: notifications.filter(n => n.category === 'motivation').length
          },
          actionRequired: notifications.filter(n => n.action_required).length
        };

        return {
          success: true,
          data: stats
        };
      }
      return result;
    } catch (error) {
      console.error('Error fetching notification stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Eliminar notificación
  async deleteNotification(notificationId) {
    try {
      console.log(`Deleting notification ${notificationId}`);
      
      return {
        success: true,
        data: {
          id: notificationId,
          deleted_at: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error deleting notification:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new StudentNotificationService();
