/**
 * Servicio Unificado de Datos - Kary Educational Platform
 * Sincroniza datos entre estudiantes, docentes y psicopedagogos
 */

class UnifiedDataService {
  constructor() {
    this.subscribers = new Map();
    this.data = {
      students: [],
      teachers: [],
      psychopedagogues: [],
      activities: [],
      cases: [],
      supportPlans: [],
      notifications: [],
      assignments: []
    };
    
    this.initializeData();
  }

  // === INICIALIZACIÓN DE DATOS ===
  initializeData() {
    // Estudiantes de ejemplo
    this.data.students = [
      {
        id: 'student-1',
        name: 'Ana García',
        email: 'ana.garcia@estudiante.com',
        grade: '5to Grado',
        school: 'Escuela Primaria Central',
        role: 'student',
        teacherId: 'teacher-1',
        psychopedagogueId: 'psycho-1',
        learningNeeds: ['TDAH', 'Dificultades de lectura'],
        medicalInfo: 'Alergia a los frutos secos',
        emergencyContact: {
          name: 'María García',
          phone: '+1 (555) 123-4567'
        },
        createdAt: new Date().toISOString(),
        status: 'active'
      },
      {
        id: 'student-2',
        name: 'Carlos López',
        email: 'carlos.lopez@estudiante.com',
        grade: '4to Grado',
        school: 'Escuela Primaria Central',
        role: 'student',
        teacherId: 'teacher-1',
        psychopedagogueId: 'psycho-2',
        learningNeeds: ['Dislexia'],
        medicalInfo: 'Ninguna',
        emergencyContact: {
          name: 'Roberto López',
          phone: '+1 (555) 234-5678'
        },
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    ];

    // Profesores de ejemplo
    this.data.teachers = [
      {
        id: 'teacher-1',
        name: 'Prof. María Rodríguez',
        email: 'maria.rodriguez@profesor.com',
        role: 'teacher',
        specialization: 'Educación Primaria',
        experience: '8 años',
        assignedStudents: ['student-1', 'student-2'],
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    ];

    // Psicopedagogos de ejemplo
    this.data.psychopedagogues = [
      {
        id: 'psycho-1',
        name: 'Dr. Luis Martínez',
        email: 'luis.martinez@psicopedagogo.com',
        role: 'psychopedagogue',
        specialization: 'TDAH y Dificultades de Aprendizaje',
        experience: '15 años',
        assignedStudents: ['student-1'],
        createdAt: new Date().toISOString(),
        status: 'active'
      },
      {
        id: 'psycho-2',
        name: 'Dra. María García',
        email: 'maria.garcia@psicopedagogo.com',
        role: 'psychopedagogue',
        specialization: 'Dislexia y Problemas de Lectura',
        experience: '12 años',
        assignedStudents: ['student-2'],
        createdAt: new Date().toISOString(),
        status: 'active'
      }
    ];

    // Actividades de ejemplo
    this.data.activities = [
      {
        id: 'activity-1',
        title: 'Ejercicio de Lectura Comprensiva',
        description: 'Leer el cuento y responder preguntas de comprensión',
        type: 'reading',
        subject: 'Lengua',
        grade: '5to Grado',
        teacherId: 'teacher-1',
        assignedStudents: ['student-1'],
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'assigned',
        createdAt: new Date().toISOString()
      }
    ];

    // Casos de ejemplo
    this.data.cases = [
      {
        id: 'case-1',
        studentId: 'student-1',
        studentName: 'Ana García',
        psychopedagogueId: 'psycho-1',
        psychopedagogueName: 'Dr. Luis Martínez',
        title: 'Seguimiento TDAH',
        category: 'TDAH',
        priority: 'high',
        status: 'active',
        description: 'Seguimiento del caso de TDAH con enfoque en técnicas de concentración',
        objectives: ['Mejorar la concentración', 'Desarrollar técnicas de estudio'],
        createdAt: new Date().toISOString()
      }
    ];

    // Planes de apoyo de ejemplo
    this.data.supportPlans = [
      {
        id: 'plan-1',
        studentId: 'student-1',
        studentName: 'Ana García',
        psychopedagogueId: 'psycho-1',
        teacherId: 'teacher-1',
        type: 'academic',
        objectives: ['Mejorar la comprensión lectora', 'Desarrollar técnicas de estudio'],
        interventions: [
          {
            type: 'reading_support',
            description: 'Sesiones de lectura guiada',
            frequency: '3 veces por semana',
            duration: '30 minutos'
          }
        ],
        duration: '3 meses',
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ];

    // Notificaciones de ejemplo
    this.data.notifications = [
      {
        id: 'notif-1',
        userId: 'teacher-1',
        type: 'activity_assigned',
        title: 'Nueva Actividad Asignada',
        message: 'Se ha asignado una nueva actividad a Ana García',
        data: { activityId: 'activity-1', studentId: 'student-1' },
        read: false,
        createdAt: new Date().toISOString()
      }
    ];

    // Asignaciones de ejemplo
    this.data.assignments = [
      {
        id: 'assign-1',
        studentId: 'student-1',
        teacherId: 'teacher-1',
        psychopedagogueId: 'psycho-1',
        type: 'academic_support',
        status: 'active',
        createdAt: new Date().toISOString()
      }
    ];

    this.saveToStorage();
  }

  // === MÉTODOS DE PERSISTENCIA ===
  saveToStorage() {
    localStorage.setItem('kary_unified_data', JSON.stringify(this.data));
  }

  loadFromStorage() {
    const stored = localStorage.getItem('kary_unified_data');
    if (stored) {
      this.data = JSON.parse(stored);
    }
  }

  // === MÉTODOS DE SUSCRIPCIÓN ===
  subscribe(key, callback) {
    if (!this.subscribers.has(key)) {
      this.subscribers.set(key, new Set());
    }
    this.subscribers.get(key).add(callback);
    
    return () => {
      const callbacks = this.subscribers.get(key);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  publish(key, data) {
    const callbacks = this.subscribers.get(key);
    if (callbacks) {
      callbacks.forEach(callback => callback(data));
    }
  }

  // === MÉTODOS DE ESTUDIANTES ===
  getStudents(filters = {}) {
    let students = [...this.data.students];
    
    if (filters.teacherId) {
      students = students.filter(s => s.teacherId === filters.teacherId);
    }
    
    if (filters.psychopedagogueId) {
      students = students.filter(s => s.psychopedagogueId === filters.psychopedagogueId);
    }
    
    return { success: true, data: students };
  }

  getStudentById(id) {
    const student = this.data.students.find(s => s.id === id);
    return { success: !!student, data: student };
  }

  updateStudent(id, updates) {
    const index = this.data.students.findIndex(s => s.id === id);
    if (index !== -1) {
      this.data.students[index] = { ...this.data.students[index], ...updates };
      this.saveToStorage();
      this.publish('student_updated', this.data.students[index]);
      return { success: true, data: this.data.students[index] };
    }
    return { success: false, error: 'Estudiante no encontrado' };
  }

  // === MÉTODOS DE PROFESORES ===
  getTeachers(filters = {}) {
    let teachers = [...this.data.teachers];
    
    if (filters.studentId) {
      teachers = teachers.filter(t => t.assignedStudents.includes(filters.studentId));
    }
    
    return { success: true, data: teachers };
  }

  getTeacherById(id) {
    const teacher = this.data.teachers.find(t => t.id === id);
    return { success: !!teacher, data: teacher };
  }

  // === MÉTODOS DE PSICOPEDAGOGOS ===
  getPsychopedagogues(filters = {}) {
    let psychopedagogues = [...this.data.psychopedagogues];
    
    if (filters.studentId) {
      psychopedagogues = psychopedagogues.filter(p => p.assignedStudents.includes(filters.studentId));
    }
    
    return { success: true, data: psychopedagogues };
  }

  getPsychopedagogueById(id) {
    const psychopedagogue = this.data.psychopedagogues.find(p => p.id === id);
    return { success: !!psychopedagogue, data: psychopedagogue };
  }

  // === MÉTODOS DE ACTIVIDADES ===
  getActivities(filters = {}) {
    let activities = [...this.data.activities];
    
    if (filters.teacherId) {
      activities = activities.filter(a => a.teacherId === filters.teacherId);
    }
    
    if (filters.studentId) {
      activities = activities.filter(a => a.assignedStudents.includes(filters.studentId));
    }
    
    return { success: true, data: activities };
  }

  createActivity(activityData) {
    const newActivity = {
      id: `activity-${Date.now()}`,
      ...activityData,
      createdAt: new Date().toISOString(),
      status: 'assigned'
    };
    
    this.data.activities.push(newActivity);
    this.saveToStorage();
    
    // Crear notificaciones para estudiantes asignados
    activityData.assignedStudents.forEach(studentId => {
      this.createNotification({
        userId: studentId,
        type: 'activity_assigned',
        title: 'Nueva Actividad Asignada',
        message: `Se ha asignado la actividad: ${activityData.title}`,
        data: { activityId: newActivity.id }
      });
    });
    
    this.publish('activity_created', newActivity);
    return { success: true, data: newActivity };
  }

  updateActivity(id, updates) {
    const index = this.data.activities.findIndex(a => a.id === id);
    if (index !== -1) {
      this.data.activities[index] = { ...this.data.activities[index], ...updates };
      this.saveToStorage();
      this.publish('activity_updated', this.data.activities[index]);
      return { success: true, data: this.data.activities[index] };
    }
    return { success: false, error: 'Actividad no encontrada' };
  }

  // === MÉTODOS DE CASOS ===
  getCases(filters = {}) {
    let cases = [...this.data.cases];
    
    if (filters.psychopedagogueId) {
      cases = cases.filter(c => c.psychopedagogueId === filters.psychopedagogueId);
    }
    
    if (filters.studentId) {
      cases = cases.filter(c => c.studentId === filters.studentId);
    }
    
    return { success: true, data: cases };
  }

  createCase(caseData) {
    const newCase = {
      id: `case-${Date.now()}`,
      ...caseData,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    this.data.cases.push(newCase);
    this.saveToStorage();
    
    // Notificar al psicopedagogo
    this.createNotification({
      userId: caseData.psychopedagogueId,
      type: 'case_assigned',
      title: 'Nuevo Caso Asignado',
      message: `Se ha asignado el caso: ${caseData.title}`,
      data: { caseId: newCase.id }
    });
    
    this.publish('case_created', newCase);
    return { success: true, data: newCase };
  }

  // === MÉTODOS DE PLANES DE APOYO ===
  getSupportPlans(filters = {}) {
    let plans = [...this.data.supportPlans];
    
    if (filters.studentId) {
      plans = plans.filter(p => p.studentId === filters.studentId);
    }
    
    if (filters.psychopedagogueId) {
      plans = plans.filter(p => p.psychopedagogueId === filters.psychopedagogueId);
    }
    
    if (filters.teacherId) {
      plans = plans.filter(p => p.teacherId === filters.teacherId);
    }
    
    return { success: true, data: plans };
  }

  createSupportPlan(planData) {
    const newPlan = {
      id: `plan-${Date.now()}`,
      ...planData,
      createdAt: new Date().toISOString(),
      status: 'active'
    };
    
    this.data.supportPlans.push(newPlan);
    this.saveToStorage();
    
    // Notificar al profesor y estudiante
    this.createNotification({
      userId: planData.teacherId,
      type: 'support_plan_created',
      title: 'Nuevo Plan de Apoyo',
      message: `Se ha creado un plan de apoyo para ${planData.studentName}`,
      data: { planId: newPlan.id }
    });
    
    this.createNotification({
      userId: planData.studentId,
      type: 'support_plan_created',
      title: 'Nuevo Plan de Apoyo',
      message: `Se ha creado un plan de apoyo personalizado para ti`,
      data: { planId: newPlan.id }
    });
    
    this.publish('support_plan_created', newPlan);
    return { success: true, data: newPlan };
  }

  // === MÉTODOS DE NOTIFICACIONES ===
  getNotifications(userId) {
    const notifications = this.data.notifications.filter(n => n.userId === userId);
    return { success: true, data: notifications };
  }

  createNotification(notificationData) {
    const newNotification = {
      id: `notif-${Date.now()}`,
      ...notificationData,
      read: false,
      createdAt: new Date().toISOString()
    };
    
    this.data.notifications.push(newNotification);
    this.saveToStorage();
    this.publish('notification_created', newNotification);
    return { success: true, data: newNotification };
  }

  markNotificationAsRead(notificationId) {
    const notification = this.data.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.saveToStorage();
      this.publish('notification_read', notification);
      return { success: true, data: notification };
    }
    return { success: false, error: 'Notificación no encontrada' };
  }

  // === MÉTODOS DE ASIGNACIONES ===
  getAssignments(filters = {}) {
    let assignments = [...this.data.assignments];
    
    if (filters.studentId) {
      assignments = assignments.filter(a => a.studentId === filters.studentId);
    }
    
    if (filters.teacherId) {
      assignments = assignments.filter(a => a.teacherId === filters.teacherId);
    }
    
    if (filters.psychopedagogueId) {
      assignments = assignments.filter(a => a.psychopedagogueId === filters.psychopedagogueId);
    }
    
    return { success: true, data: assignments };
  }

  createAssignment(assignmentData) {
    const newAssignment = {
      id: `assign-${Date.now()}`,
      ...assignmentData,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    
    this.data.assignments.push(newAssignment);
    this.saveToStorage();
    this.publish('assignment_created', newAssignment);
    return { success: true, data: newAssignment };
  }

  // === MÉTODOS DE SINCRONIZACIÓN ===
  syncUserData(userId, userRole) {
    const userData = {
      profile: null,
      students: [],
      teachers: [],
      psychopedagogues: [],
      activities: [],
      cases: [],
      supportPlans: [],
      notifications: [],
      assignments: []
    };

    // Obtener perfil del usuario
    if (userRole === 'student') {
      userData.profile = this.getStudentById(userId).data;
      userData.teachers = this.getTeachers({ studentId: userId }).data;
      userData.psychopedagogues = this.getPsychopedagogues({ studentId: userId }).data;
    } else if (userRole === 'teacher') {
      userData.profile = this.getTeacherById(userId).data;
      userData.students = this.getStudents({ teacherId: userId }).data;
    } else if (userRole === 'psychopedagogue') {
      userData.profile = this.getPsychopedagogueById(userId).data;
      userData.students = this.getStudents({ psychopedagogueId: userId }).data;
    }

    // Obtener datos relacionados
    userData.activities = this.getActivities({ [userRole === 'student' ? 'studentId' : userRole + 'Id']: userId }).data;
    userData.cases = this.getCases({ [userRole === 'student' ? 'studentId' : userRole + 'Id']: userId }).data;
    userData.supportPlans = this.getSupportPlans({ [userRole === 'student' ? 'studentId' : userRole + 'Id']: userId }).data;
    userData.notifications = this.getNotifications(userId).data;
    userData.assignments = this.getAssignments({ [userRole === 'student' ? 'studentId' : userRole + 'Id']: userId }).data;

    return { success: true, data: userData };
  }

  // === MÉTODOS DE ESTADÍSTICAS ===
  getDashboardStats(userId, userRole) {
    const stats = {
      totalStudents: 0,
      totalActivities: 0,
      totalCases: 0,
      totalSupportPlans: 0,
      unreadNotifications: 0,
      recentActivity: []
    };

    if (userRole === 'teacher') {
      stats.totalStudents = this.getStudents({ teacherId: userId }).data.length;
      stats.totalActivities = this.getActivities({ teacherId: userId }).data.length;
    } else if (userRole === 'psychopedagogue') {
      stats.totalStudents = this.getStudents({ psychopedagogueId: userId }).data.length;
      stats.totalCases = this.getCases({ psychopedagogueId: userId }).data.length;
      stats.totalSupportPlans = this.getSupportPlans({ psychopedagogueId: userId }).data.length;
    } else if (userRole === 'student') {
      stats.totalActivities = this.getActivities({ studentId: userId }).data.length;
      stats.totalSupportPlans = this.getSupportPlans({ studentId: userId }).data.length;
    }

    stats.unreadNotifications = this.getNotifications(userId).data.filter(n => !n.read).length;

    return { success: true, data: stats };
  }
}

// Crear instancia singleton
const unifiedDataService = new UnifiedDataService();

export default unifiedDataService;



