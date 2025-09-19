/**
 * Servicio de Vinculación Estudiante-Acudiente - Kary Educational Platform
 * Gestiona la vinculación automática entre estudiantes y acudientes
 */

import unifiedDataService from './unifiedDataService';
import realTimeNotificationService from './realTimeNotificationService';

class StudentParentLinkService {
  constructor() {
    this.linkRequests = new Map();
    this.activeLinks = new Map();
  }

  // === MÉTODOS DE VINCULACIÓN ===
  async createLinkRequest(parentId, studentId, relationship = 'parent') {
    try {
      const linkRequest = {
        id: `link-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        parentId,
        studentId,
        relationship,
        status: 'pending',
        createdAt: new Date().toISOString(),
        requestedBy: 'parent',
        verificationCode: this.generateVerificationCode()
      };

      // Guardar la solicitud
      this.linkRequests.set(linkRequest.id, linkRequest);

      // Notificar al sistema
      await this.notifyLinkRequest(linkRequest);

      return { success: true, data: linkRequest };
    } catch (error) {
      console.error('Error creating link request:', error);
      return { success: false, error: error.message };
    }
  }

  async approveLinkRequest(linkRequestId, approvedBy = 'admin') {
    try {
      const linkRequest = this.linkRequests.get(linkRequestId);
      if (!linkRequest) {
        return { success: false, error: 'Solicitud de vinculación no encontrada' };
      }

      // Crear el vínculo activo
      const activeLink = {
        id: `active-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        parentId: linkRequest.parentId,
        studentId: linkRequest.studentId,
        relationship: linkRequest.relationship,
        status: 'active',
        createdAt: new Date().toISOString(),
        approvedBy,
        linkRequestId
      };

      this.activeLinks.set(activeLink.id, activeLink);
      linkRequest.status = 'approved';
      linkRequest.approvedAt = new Date().toISOString();
      linkRequest.approvedBy = approvedBy;

      // Notificar a las partes involucradas
      await this.notifyLinkApproval(activeLink);

      return { success: true, data: activeLink };
    } catch (error) {
      console.error('Error approving link request:', error);
      return { success: false, error: error.message };
    }
  }

  async rejectLinkRequest(linkRequestId, reason = 'No especificado', rejectedBy = 'admin') {
    try {
      const linkRequest = this.linkRequests.get(linkRequestId);
      if (!linkRequest) {
        return { success: false, error: 'Solicitud de vinculación no encontrada' };
      }

      linkRequest.status = 'rejected';
      linkRequest.rejectedAt = new Date().toISOString();
      linkRequest.rejectedBy = rejectedBy;
      linkRequest.rejectionReason = reason;

      // Notificar el rechazo
      await this.notifyLinkRejection(linkRequest);

      return { success: true, data: linkRequest };
    } catch (error) {
      console.error('Error rejecting link request:', error);
      return { success: false, error: error.message };
    }
  }

  // === MÉTODOS DE CONSULTA ===
  getActiveLinksByParent(parentId) {
    const parentLinks = Array.from(this.activeLinks.values())
      .filter(link => link.parentId === parentId && link.status === 'active');
    
    return parentLinks;
  }

  getActiveLinksByStudent(studentId) {
    const studentLinks = Array.from(this.activeLinks.values())
      .filter(link => link.studentId === studentId && link.status === 'active');
    
    return studentLinks;
  }

  getLinkRequestsByParent(parentId) {
    const parentRequests = Array.from(this.linkRequests.values())
      .filter(request => request.parentId === parentId);
    
    return parentRequests;
  }

  getLinkRequestsByStudent(studentId) {
    const studentRequests = Array.from(this.linkRequests.values())
      .filter(request => request.studentId === studentId);
    
    return studentRequests;
  }

  getAllPendingRequests() {
    return Array.from(this.linkRequests.values())
      .filter(request => request.status === 'pending');
  }

  // === MÉTODOS DE VERIFICACIÓN ===
  async verifyParentStudentRelationship(parentId, studentId) {
    try {
      // Verificar si existe un vínculo activo
      const activeLinks = this.getActiveLinksByParent(parentId);
      const isLinked = activeLinks.some(link => link.studentId === studentId);

      if (isLinked) {
        return { success: true, linked: true, data: activeLinks.find(link => link.studentId === studentId) };
      }

      // Verificar si hay una solicitud pendiente
      const pendingRequests = this.getLinkRequestsByParent(parentId);
      const pendingRequest = pendingRequests.find(request => 
        request.studentId === studentId && request.status === 'pending'
      );

      if (pendingRequest) {
        return { success: true, linked: false, pending: true, data: pendingRequest };
      }

      return { success: true, linked: false, pending: false, data: null };
    } catch (error) {
      console.error('Error verifying relationship:', error);
      return { success: false, error: error.message };
    }
  }

  // === MÉTODOS DE BÚSQUEDA DE ESTUDIANTES ===
  async searchStudentsByCode(verificationCode) {
    try {
      // En un sistema real, esto consultaría la base de datos
      // Por ahora, simulamos la búsqueda
      const mockStudents = [
        {
          id: 'student-1',
          name: 'Ana García',
          grade: '5to Grado',
          school: 'Colegio San José',
          verificationCode: 'ABC123',
          parentEmail: 'ana.garcia@email.com'
        },
        {
          id: 'student-2',
          name: 'Carlos López',
          grade: '3er Grado',
          school: 'Colegio San José',
          verificationCode: 'XYZ789',
          parentEmail: 'carlos.lopez@email.com'
        }
      ];

      const student = mockStudents.find(s => s.verificationCode === verificationCode);
      
      if (student) {
        return { success: true, data: student };
      } else {
        return { success: false, error: 'Código de verificación no válido' };
      }
    } catch (error) {
      console.error('Error searching student by code:', error);
      return { success: false, error: error.message };
    }
  }

  async searchStudentsByName(name, school = null) {
    try {
      // En un sistema real, esto consultaría la base de datos
      const mockStudents = [
        {
          id: 'student-1',
          name: 'Ana García',
          grade: '5to Grado',
          school: 'Colegio San José',
          parentEmail: 'ana.garcia@email.com'
        },
        {
          id: 'student-2',
          name: 'Carlos López',
          grade: '3er Grado',
          school: 'Colegio San José',
          parentEmail: 'carlos.lopez@email.com'
        },
        {
          id: 'student-3',
          name: 'María Rodríguez',
          grade: '4to Grado',
          school: 'Colegio San José',
          parentEmail: 'maria.rodriguez@email.com'
        }
      ];

      let filteredStudents = mockStudents;
      
      if (name) {
        filteredStudents = filteredStudents.filter(s => 
          s.name.toLowerCase().includes(name.toLowerCase())
        );
      }
      
      if (school) {
        filteredStudents = filteredStudents.filter(s => 
          s.school.toLowerCase().includes(school.toLowerCase())
        );
      }

      return { success: true, data: filteredStudents };
    } catch (error) {
      console.error('Error searching students by name:', error);
      return { success: false, error: error.message };
    }
  }

  // === MÉTODOS DE NOTIFICACIÓN ===
  async notifyLinkRequest(linkRequest) {
    try {
      // Notificar al administrador
      realTimeNotificationService.sendRoleNotification(
        'admin',
        `Nueva solicitud de vinculación: ${linkRequest.parentId} → ${linkRequest.studentId}`,
        'info',
        { type: 'link_request', id: linkRequest.id }
      );

      // Notificar al psicopedagogo
      realTimeNotificationService.sendRoleNotification(
        'psychopedagogue',
        `Nueva solicitud de vinculación padre-estudiante pendiente de aprobación`,
        'warning',
        { type: 'link_request', id: linkRequest.id }
      );
    } catch (error) {
      console.error('Error notifying link request:', error);
    }
  }

  async notifyLinkApproval(activeLink) {
    try {
      // Notificar al padre
      realTimeNotificationService.sendRoleNotification(
        'parent',
        `Tu solicitud de vinculación ha sido aprobada. Ahora puedes acceder al progreso de tu hijo/a.`,
        'success',
        { type: 'link_approval', id: activeLink.id }
      );

      // Notificar al psicopedagogo
      realTimeNotificationService.sendRoleNotification(
        'psychopedagogue',
        `Vinculación padre-estudiante aprobada: ${activeLink.parentId} → ${activeLink.studentId}`,
        'info',
        { type: 'link_approval', id: activeLink.id }
      );
    } catch (error) {
      console.error('Error notifying link approval:', error);
    }
  }

  async notifyLinkRejection(linkRequest) {
    try {
      // Notificar al padre
      realTimeNotificationService.sendRoleNotification(
        'parent',
        `Tu solicitud de vinculación ha sido rechazada. Razón: ${linkRequest.rejectionReason}`,
        'error',
        { type: 'link_rejection', id: linkRequest.id }
      );
    } catch (error) {
      console.error('Error notifying link rejection:', error);
    }
  }

  // === MÉTODOS AUXILIARES ===
  generateVerificationCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // === MÉTODOS DE ESTADÍSTICAS ===
  getLinkStatistics() {
    const totalRequests = this.linkRequests.size;
    const pendingRequests = Array.from(this.linkRequests.values())
      .filter(request => request.status === 'pending').length;
    const approvedRequests = Array.from(this.linkRequests.values())
      .filter(request => request.status === 'approved').length;
    const rejectedRequests = Array.from(this.linkRequests.values())
      .filter(request => request.status === 'rejected').length;
    const activeLinks = this.activeLinks.size;

    return {
      totalRequests,
      pendingRequests,
      approvedRequests,
      rejectedRequests,
      activeLinks,
      approvalRate: totalRequests > 0 ? (approvedRequests / totalRequests) * 100 : 0
    };
  }

  // === MÉTODOS DE LIMPIEZA ===
  cleanupExpiredRequests() {
    const now = new Date();
    const expiredTime = 7 * 24 * 60 * 60 * 1000; // 7 días

    for (const [id, request] of this.linkRequests.entries()) {
      const requestTime = new Date(request.createdAt);
      if (now - requestTime > expiredTime && request.status === 'pending') {
        request.status = 'expired';
        request.expiredAt = now.toISOString();
      }
    }
  }
}

// Crear instancia singleton
const studentParentLinkService = new StudentParentLinkService();

export default studentParentLinkService;

