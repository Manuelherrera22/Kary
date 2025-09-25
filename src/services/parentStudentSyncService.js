/**
 * Servicio de Sincronización Padre-Estudiante - Kary Educational Platform
 * Conecta los datos del estudiante con el panel de acudiente
 */

import unifiedDataService from './unifiedDataService';
import realTimeNotificationService from './realTimeNotificationService';
import activityService from './activityService';

class ParentStudentSyncService {
  constructor() {
    this.subscribers = new Map();
    this.syncData = {
      student: null,
      activities: [],
      progress: {},
      notifications: [],
      metrics: {},
      alerts: []
    };
  }

  // === MÉTODOS DE SUSCRIPCIÓN ===
  subscribe(parentId, callback) {
    if (!this.subscribers.has(parentId)) {
      this.subscribers.set(parentId, new Set());
    }
    this.subscribers.get(parentId).add(callback);
    
    return () => {
      const callbacks = this.subscribers.get(parentId);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  publish(parentId, data) {
    const callbacks = this.subscribers.get(parentId);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // === MÉTODOS DE SINCRONIZACIÓN ===
  async syncParentWithStudent(parentId, studentId) {
    try {
      // Usar datos mock para María García directamente
      if (studentId === '550e8400-e29b-41d4-a716-446655440002') {
        this.syncData.student = {
          id: '550e8400-e29b-41d4-a716-446655440002',
          name: 'María García',
          grade: '5to Grado',
          school: 'Colegio San José',
          age: 10,
          status: 'Activo',
          role: 'Estudiante',
          parentEmail: 'padre@kary.com',
          emotionalState: {
            currentMood: 'Feliz',
            recentTrends: 'Estable',
            lastUpdate: new Date().toISOString()
          },
          achievements: [
            { title: 'Completó 5 actividades esta semana', date: new Date().toISOString() },
            { title: 'Mejoró en matemáticas', date: new Date(Date.now() - 86400000).toISOString() }
          ]
        };
      } else {
        // Cargar datos del estudiante desde el servicio
        const studentResult = await unifiedDataService.getStudentById(studentId);
        if (studentResult.success) {
          this.syncData.student = studentResult.data;
        }
      }

      // Cargar actividades del estudiante
      if (studentId === '550e8400-e29b-41d4-a716-446655440002') {
        // Actividades mock para María García
        this.syncData.activities = [
          {
            id: 'activity-1',
            title: 'Matemáticas - Fracciones',
            description: 'Resolver problemas con fracciones equivalentes',
            subject: 'Matemáticas',
            grade: '5to Grado',
            status: 'completed',
            progress: 100,
            dueDate: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'activity-2',
            title: 'Ciencias - Sistema Solar',
            description: 'Investigar los planetas del sistema solar',
            subject: 'Ciencias',
            grade: '5to Grado',
            status: 'in_progress',
            progress: 75,
            dueDate: new Date(Date.now() + 86400000).toISOString(),
            updatedAt: new Date().toISOString()
          },
          {
            id: 'activity-3',
            title: 'Lenguaje - Comprensión Lectora',
            description: 'Leer y analizar un cuento corto',
            subject: 'Lenguaje',
            grade: '5to Grado',
            status: 'pending',
            progress: 0,
            dueDate: new Date(Date.now() + 172800000).toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
      } else {
        const activitiesResult = await activityService.getStudentActivities(studentId);
        if (activitiesResult.success) {
          this.syncData.activities = activitiesResult.data;
        }
      }

      // Cargar progreso del estudiante
      const progressResult = await this.calculateStudentProgress(studentId);
      this.syncData.progress = progressResult;

      // Cargar notificaciones relacionadas
      if (studentId === '550e8400-e29b-41d4-a716-446655440002') {
        // Notificaciones mock para María García
        this.syncData.notifications = [
          {
            id: 'notif-1',
            message: 'María completó su actividad de matemáticas',
            type: 'success',
            timestamp: new Date().toISOString(),
            read: false
          },
          {
            id: 'notif-2',
            message: 'Nueva actividad asignada: Comprensión Lectora',
            type: 'info',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: true
          },
          {
            id: 'notif-3',
            message: 'María está progresando bien en ciencias',
            type: 'info',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            read: false
          }
        ];
      } else {
        const notificationsResult = await realTimeNotificationService.getNotifications(parentId, {
          studentId: studentId
        });
        if (notificationsResult.success) {
          this.syncData.notifications = notificationsResult.data;
        }
      }

      // Calcular métricas familiares
      const metricsResult = await this.calculateFamilyMetrics(parentId, studentId);
      this.syncData.metrics = metricsResult;

      // Generar alertas inteligentes
      const alertsResult = await this.generateIntelligentAlerts(studentId);
      this.syncData.alerts = alertsResult;

      // Notificar a los suscriptores
      this.publish(parentId, this.syncData);

      return { success: true, data: this.syncData };
    } catch (error) {
      console.error('Error syncing parent with student:', error);
      return { success: false, error: error.message };
    }
  }

  async calculateStudentProgress(studentId) {
    try {
      // Obtener actividades del estudiante
      const activitiesResult = await activityService.getStudentActivities(studentId);
      const activities = activitiesResult.success ? activitiesResult.data : [];

      // Calcular progreso académico
      const completedActivities = activities.filter(a => a.status === 'completed');
      const academicProgress = activities.length > 0 ? 
        Math.round((completedActivities.length / activities.length) * 100) : 0;

      // Calcular progreso emocional (simulado basado en actividades emocionales)
      const emotionalActivities = activities.filter(a => 
        a.category === 'emotional' || a.subject === 'emotional_support'
      );
      const emotionalProgress = emotionalActivities.length > 0 ? 
        Math.round((emotionalActivities.filter(a => a.status === 'completed').length / emotionalActivities.length) * 100) : 75;

      // Calcular progreso social (simulado)
      const socialProgress = Math.min(academicProgress + 10, 100);

      // Calcular progreso general
      const overallProgress = Math.round((academicProgress + emotionalProgress + socialProgress) / 3);

      return {
        academic: academicProgress,
        emotional: emotionalProgress,
        social: socialProgress,
        behavioral: Math.round(emotionalProgress * 0.9),
        overall: overallProgress,
        completedActivities: completedActivities.length,
        totalActivities: activities.length,
        weeklyStreak: this.calculateWeeklyStreak(activities),
        lastActivityDate: activities.length > 0 ? 
          new Date(Math.max(...activities.map(a => new Date(a.updatedAt)))) : null
      };
    } catch (error) {
      console.error('Error calculating student progress:', error);
      return {
        academic: 0,
        emotional: 0,
        social: 0,
        behavioral: 0,
        overall: 0,
        completedActivities: 0,
        totalActivities: 0,
        weeklyStreak: 0,
        lastActivityDate: null
      };
    }
  }

  calculateWeeklyStreak(activities) {
    if (!activities || activities.length === 0) return 0;
    
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const recentActivities = activities.filter(a => 
      new Date(a.updatedAt) >= oneWeekAgo && a.status === 'completed'
    );
    
    // Agrupar por día y contar días consecutivos
    const dailyActivities = {};
    recentActivities.forEach(activity => {
      const day = new Date(activity.updatedAt).toDateString();
      dailyActivities[day] = (dailyActivities[day] || 0) + 1;
    });
    
    return Object.keys(dailyActivities).length;
  }

  async calculateFamilyMetrics(parentId, studentId) {
    try {
      // Obtener datos del estudiante
      const studentResult = await unifiedDataService.getStudentById(studentId);
      const student = studentResult.success ? studentResult.data : null;

      // Obtener actividades
      const activitiesResult = await activityService.getStudentActivities(studentId);
      const activities = activitiesResult.success ? activitiesResult.data : [];

      // Obtener notificaciones
      const notificationsResult = await realTimeNotificationService.getNotifications(parentId);
      const notifications = notificationsResult.success ? notificationsResult.data : [];

      // Calcular métricas
      const totalChildren = 1; // Por ahora solo un estudiante
      const activeSupportPlans = student?.supportPlans?.filter(p => p.status === 'active').length || 0;
      const completedActivities = activities.filter(a => a.status === 'completed').length;
      const averageProgress = this.syncData.progress.overall || 0;
      const familyEngagement = Math.min(averageProgress + 15, 100);
      const communicationFrequency = this.calculateCommunicationFrequency(notifications);

      return {
        totalChildren,
        activeSupportPlans,
        completedActivities,
        averageProgress,
        familyEngagement,
        communicationFrequency,
        weeklyStreak: this.syncData.progress.weeklyStreak || 0,
        lastSync: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error calculating family metrics:', error);
      return {
        totalChildren: 1,
        activeSupportPlans: 0,
        completedActivities: 0,
        averageProgress: 0,
        familyEngagement: 0,
        communicationFrequency: 'Ninguna',
        weeklyStreak: 0,
        lastSync: new Date().toISOString()
      };
    }
  }

  calculateCommunicationFrequency(notifications) {
    const communicationNotifications = notifications.filter(n => 
      n.type === 'communication_message' || n.type === 'appointment_reminder'
    );
    
    if (communicationNotifications.length === 0) return 'Ninguna';
    if (communicationNotifications.length < 3) return 'Baja';
    if (communicationNotifications.length < 7) return 'Media';
    return 'Alta';
  }

  async generateIntelligentAlerts(studentId) {
    try {
      const alerts = [];
      const progress = this.syncData.progress;

      // Alerta de progreso académico bajo
      if (progress.academic < 60) {
        alerts.push({
          id: `alert-academic-${Date.now()}`,
          type: 'academic_concern',
          priority: 'high',
          title: 'Progreso Académico Bajo',
          description: `El progreso académico está en ${progress.academic}%. Se recomienda revisar las actividades pendientes.`,
          studentId: studentId,
          confidence: 85,
          recommendations: [
            'Revisar las tareas pendientes',
            'Establecer un horario de estudio',
            'Contactar al profesor si es necesario'
          ],
          actions: [
            { id: '1', label: 'Ver Actividades Pendientes', type: 'immediate' },
            { id: '2', label: 'Contactar Profesor', type: 'urgent' }
          ],
          createdAt: new Date().toISOString(),
          read: false
        });
      }

      // Alerta de racha semanal
      if (progress.weeklyStreak >= 5) {
        alerts.push({
          id: `alert-streak-${Date.now()}`,
          type: 'positive_reinforcement',
          priority: 'low',
          title: 'Excelente Racha Semanal',
          description: `¡Excelente! Tu hijo/a ha mantenido una racha de ${progress.weeklyStreak} días consecutivos.`,
          studentId: studentId,
          confidence: 95,
          recommendations: [
            'Reconocer el esfuerzo',
            'Mantener la motivación',
            'Celebrar el logro'
          ],
          actions: [
            { id: '1', label: 'Reconocer Logro', type: 'immediate' }
          ],
          createdAt: new Date().toISOString(),
          read: false
        });
      }

      // Alerta de progreso emocional
      if (progress.emotional < 70) {
        alerts.push({
          id: `alert-emotional-${Date.now()}`,
          type: 'emotional_support',
          priority: 'medium',
          title: 'Oportunidad de Apoyo Emocional',
          description: 'Es un buen momento para brindar apoyo emocional adicional.',
          studentId: studentId,
          confidence: 72,
          recommendations: [
            'Hablar sobre sus sentimientos',
            'Implementar técnicas de relajación',
            'Coordinar con el psicopedagogo'
          ],
          actions: [
            { id: '1', label: 'Iniciar Conversación', type: 'immediate' },
            { id: '2', label: 'Aplicar Técnicas de Relajación', type: 'follow_up' }
          ],
          createdAt: new Date().toISOString(),
          read: false
        });
      }

      return alerts;
    } catch (error) {
      console.error('Error generating intelligent alerts:', error);
      return [];
    }
  }

  // === MÉTODOS DE OBTENCIÓN DE DATOS ===
  getStudentData() {
    return this.syncData.student;
  }

  getActivities() {
    return this.syncData.activities;
  }

  getProgress() {
    return this.syncData.progress;
  }

  getNotifications() {
    return this.syncData.notifications;
  }

  getMetrics() {
    return this.syncData.metrics;
  }

  getAlerts() {
    return this.syncData.alerts;
  }

  getAllData() {
    return this.syncData;
  }

  // === MÉTODOS DE ACTUALIZACIÓN ===
  async refreshData(parentId, studentId) {
    return await this.syncParentWithStudent(parentId, studentId);
  }

  // === MÉTODOS DE ESTADÍSTICAS ===
  getDashboardStats() {
    return {
      student: this.syncData.student ? {
        name: this.syncData.student.name,
        grade: this.syncData.student.grade,
        status: this.syncData.student.status
      } : null,
      progress: this.syncData.progress,
      activities: {
        total: this.syncData.activities.length,
        completed: this.syncData.activities.filter(a => a.status === 'completed').length,
        pending: this.syncData.activities.filter(a => a.status === 'pending').length
      },
      notifications: {
        total: this.syncData.notifications.length,
        unread: this.syncData.notifications.filter(n => !n.read).length
      },
      alerts: {
        total: this.syncData.alerts.length,
        urgent: this.syncData.alerts.filter(a => a.priority === 'urgent').length,
        unread: this.syncData.alerts.filter(a => !a.read).length
      }
    };
  }
}

// Crear instancia singleton
const parentStudentSyncService = new ParentStudentSyncService();

export default parentStudentSyncService;
