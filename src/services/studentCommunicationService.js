// Servicio para gestionar comunicación de estudiantes
class StudentCommunicationService {
  constructor() {
    this.baseUrl = '/api/student-communications';
  }

  // Obtener todas las comunicaciones de un estudiante
  async getStudentCommunications(studentId) {
    try {
      // Simulación de comunicaciones
      const mockCommunications = [
        {
          id: 1,
          student_id: studentId,
          type: 'teacher_message',
          sender: 'Prof. María González',
          senderRole: 'teacher',
          senderId: 'teacher-001',
          subject: 'Nueva actividad de matemáticas',
          message: 'Hola! Te he asignado una nueva actividad de matemáticas. Recuerda revisar las instrucciones cuidadosamente y no dudes en preguntarme si tienes dudas.',
          timestamp: new Date().toISOString(),
          read: false,
          priority: 'medium',
          attachments: [],
          category: 'academic',
          thread_id: 'thread-001'
        },
        {
          id: 2,
          student_id: studentId,
          type: 'parent_message',
          sender: 'Mamá',
          senderRole: 'parent',
          senderId: 'parent-001',
          subject: '¡Muy bien!',
          message: 'Estoy muy orgullosa de tu progreso esta semana. Veo que has estado trabajando duro en tus actividades. ¡Sigue así!',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          read: true,
          priority: 'low',
          attachments: [],
          category: 'encouragement',
          thread_id: 'thread-002'
        },
        {
          id: 3,
          student_id: studentId,
          type: 'support_message',
          sender: 'Psicopedagoga Ana',
          senderRole: 'psychopedagogue',
          senderId: 'psycho-001',
          subject: 'Seguimiento semanal',
          message: 'Hola! Quería saber cómo te sientes con las actividades de esta semana. ¿Hay algo en lo que necesites ayuda o algún tema que te gustaría trabajar más?',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          read: false,
          priority: 'high',
          attachments: [],
          category: 'support',
          thread_id: 'thread-003'
        },
        {
          id: 4,
          student_id: studentId,
          type: 'system_notification',
          sender: 'Sistema Kary',
          senderRole: 'system',
          senderId: 'system',
          subject: 'Recordatorio de actividad',
          message: 'Tienes una actividad pendiente que vence mañana. ¡No olvides completarla!',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
          read: false,
          priority: 'urgent',
          attachments: [],
          category: 'reminder',
          thread_id: 'thread-004',
          activity_id: 'act-002'
        },
        {
          id: 5,
          student_id: studentId,
          type: 'teacher_feedback',
          sender: 'Prof. Carlos Ruiz',
          senderRole: 'teacher',
          senderId: 'teacher-002',
          subject: 'Retroalimentación - Actividad de Ciencias',
          message: 'Excelente trabajo en el experimento del volcán. Tus observaciones fueron muy detalladas y tus conclusiones muestran una buena comprensión del tema.',
          timestamp: new Date(Date.now() - 10800000).toISOString(),
          read: false,
          priority: 'medium',
          attachments: [
            { name: 'feedback_ciencias.pdf', type: 'pdf', size: '245KB' }
          ],
          category: 'feedback',
          thread_id: 'thread-005',
          activity_id: 'act-003'
        },
        {
          id: 6,
          student_id: studentId,
          type: 'parent_encouragement',
          sender: 'Papá',
          senderRole: 'parent',
          senderId: 'parent-002',
          subject: '¡Felicitaciones!',
          message: 'Vi que completaste todas tus actividades esta semana. Estoy muy orgulloso de tu dedicación y esfuerzo.',
          timestamp: new Date(Date.now() - 14400000).toISOString(),
          read: true,
          priority: 'low',
          attachments: [],
          category: 'encouragement',
          thread_id: 'thread-006'
        }
      ];

      return {
        success: true,
        data: mockCommunications.filter(comm => comm.student_id === studentId)
      };
    } catch (error) {
      console.error('Error fetching student communications:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Marcar comunicación como leída
  async markAsRead(communicationId) {
    try {
      console.log(`Marking communication ${communicationId} as read`);
      
      return {
        success: true,
        data: {
          id: communicationId,
          read: true,
          read_at: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error marking communication as read:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Enviar respuesta
  async sendReply(communicationId, replyData) {
    try {
      const reply = {
        id: Date.now(),
        parent_id: communicationId,
        student_id: replyData.student_id,
        message: replyData.message,
        timestamp: new Date().toISOString(),
        type: 'student_reply',
        attachments: replyData.attachments || []
      };

      console.log('Sending reply:', reply);
      
      return {
        success: true,
        data: reply
      };
    } catch (error) {
      console.error('Error sending reply:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener hilo de conversación
  async getConversationThread(threadId) {
    try {
      // Simulación de hilo de conversación
      const mockThread = [
        {
          id: 1,
          sender: 'Prof. María González',
          senderRole: 'teacher',
          message: 'Hola! Te he asignado una nueva actividad de matemáticas.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          type: 'teacher_message'
        },
        {
          id: 2,
          sender: 'Estudiante',
          senderRole: 'student',
          message: 'Hola profesora! ¿Podría explicarme mejor el ejercicio 3?',
          timestamp: new Date(Date.now() - 3000000).toISOString(),
          type: 'student_reply'
        },
        {
          id: 3,
          sender: 'Prof. María González',
          senderRole: 'teacher',
          message: '¡Por supuesto! El ejercicio 3 trata sobre fracciones equivalentes...',
          timestamp: new Date(Date.now() - 2400000).toISOString(),
          type: 'teacher_message'
        }
      ];

      return {
        success: true,
        data: mockThread
      };
    } catch (error) {
      console.error('Error fetching conversation thread:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener comunicaciones por tipo
  async getCommunicationsByType(studentId, type) {
    try {
      const result = await this.getStudentCommunications(studentId);
      if (result.success) {
        const filtered = result.data.filter(comm => comm.type === type);
        return {
          success: true,
          data: filtered
        };
      }
      return result;
    } catch (error) {
      console.error('Error fetching communications by type:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Obtener estadísticas de comunicación
  async getCommunicationStats(studentId) {
    try {
      const result = await this.getStudentCommunications(studentId);
      if (result.success) {
        const communications = result.data;
        const stats = {
          total: communications.length,
          unread: communications.filter(c => !c.read).length,
          byType: {
            teacher_message: communications.filter(c => c.type === 'teacher_message').length,
            parent_message: communications.filter(c => c.type === 'parent_message').length,
            support_message: communications.filter(c => c.type === 'support_message').length,
            system_notification: communications.filter(c => c.type === 'system_notification').length,
            teacher_feedback: communications.filter(c => c.type === 'teacher_feedback').length
          },
          byPriority: {
            urgent: communications.filter(c => c.priority === 'urgent').length,
            high: communications.filter(c => c.priority === 'high').length,
            medium: communications.filter(c => c.priority === 'medium').length,
            low: communications.filter(c => c.priority === 'low').length
          },
          withAttachments: communications.filter(c => c.attachments && c.attachments.length > 0).length
        };

        return {
          success: true,
          data: stats
        };
      }
      return result;
    } catch (error) {
      console.error('Error fetching communication stats:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Crear nueva comunicación
  async createCommunication(studentId, communicationData) {
    try {
      const newCommunication = {
        id: Date.now(),
        student_id: studentId,
        ...communicationData,
        timestamp: new Date().toISOString(),
        read: false
      };

      console.log('Creating new communication:', newCommunication);
      
      return {
        success: true,
        data: newCommunication
      };
    } catch (error) {
      console.error('Error creating communication:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Eliminar comunicación
  async deleteCommunication(communicationId) {
    try {
      console.log(`Deleting communication ${communicationId}`);
      
      return {
        success: true,
        data: {
          id: communicationId,
          deleted_at: new Date().toISOString()
        }
      };
    } catch (error) {
      console.error('Error deleting communication:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new StudentCommunicationService();
