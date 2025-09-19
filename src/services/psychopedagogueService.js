// Servicio de Psicopedagogía - Gestión de casos y planes de apoyo
class PsychopedagogueService {
  constructor() {
    this.cases = this.loadFromStorage('kary_cases');
    this.supportPlans = this.loadFromStorage('kary_support_plans');
    this.emotionalAlerts = this.loadFromStorage('kary_emotional_alerts');
    this.students = this.loadFromStorage('kary_psychopedagogue_students');
    this.listeners = [];
  }

  // Cargar datos desde localStorage
  loadFromStorage(key) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error(`Error loading ${key} from storage:`, error);
      return [];
    }
  }

  // Guardar datos en localStorage
  saveToStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error saving ${key} to storage:`, error);
    }
  }

  // Generar ID único
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // === GESTIÓN DE CASOS ===
  
  // Crear nuevo caso
  createCase(caseData) {
    const newCase = {
      id: this.generateId(),
      ...caseData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active', // active, closed, pending
      priority: caseData.priority || 'medium', // low, medium, high, urgent
      assignedTo: caseData.assignedTo || null,
      progress: 0,
      notes: [],
      assessments: [],
      interventions: []
    };

    this.cases.push(newCase);
    this.saveToStorage('kary_cases', this.cases);
    this.notifyListeners('case_created', newCase);
    
    return { success: true, data: newCase };
  }

  // Obtener casos
  getCases(filters = {}) {
    let filteredCases = [...this.cases];

    if (filters.status) {
      filteredCases = filteredCases.filter(c => c.status === filters.status);
    }

    if (filters.priority) {
      filteredCases = filteredCases.filter(c => c.priority === filters.priority);
    }

    if (filters.assignedTo) {
      filteredCases = filteredCases.filter(c => c.assignedTo === filters.assignedTo);
    }

    if (filters.studentId) {
      filteredCases = filteredCases.filter(c => c.studentId === filters.studentId);
    }

    return { success: true, data: filteredCases };
  }

  // Actualizar caso
  updateCase(caseId, updates) {
    const caseIndex = this.cases.findIndex(c => c.id === caseId);
    
    if (caseIndex === -1) {
      return { success: false, error: 'Case not found' };
    }

    this.cases[caseIndex] = {
      ...this.cases[caseIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.saveToStorage('kary_cases', this.cases);
    this.notifyListeners('case_updated', this.cases[caseIndex]);
    
    return { success: true, data: this.cases[caseIndex] };
  }

  // === GESTIÓN DE PLANES DE APOYO ===
  
  // Crear plan de apoyo
  createSupportPlan(planData) {
    const newPlan = {
      id: this.generateId(),
      ...planData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active', // active, completed, paused
      progress: 0,
      objectives: planData.objectives || [],
      strategies: planData.strategies || [],
      evaluations: [],
      notes: []
    };

    this.supportPlans.push(newPlan);
    this.saveToStorage('kary_support_plans', this.supportPlans);
    this.notifyListeners('support_plan_created', newPlan);
    
    return { success: true, data: newPlan };
  }

  // Obtener planes de apoyo
  getSupportPlans(filters = {}) {
    let filteredPlans = [...this.supportPlans];

    if (filters.status) {
      filteredPlans = filteredPlans.filter(p => p.status === filters.status);
    }

    if (filters.studentId) {
      filteredPlans = filteredPlans.filter(p => p.studentId === filters.studentId);
    }

    return { success: true, data: filteredPlans };
  }

  // === GESTIÓN DE ALERTAS EMOCIONALES ===
  
  // Crear alerta emocional
  createEmotionalAlert(alertData) {
    const newAlert = {
      id: this.generateId(),
      ...alertData,
      createdAt: new Date().toISOString(),
      status: 'active', // active, resolved, false_positive
      severity: alertData.severity || 'medium', // low, medium, high, critical
      acknowledged: false,
      actions: []
    };

    this.emotionalAlerts.push(newAlert);
    this.saveToStorage('kary_emotional_alerts', this.emotionalAlerts);
    this.notifyListeners('emotional_alert_created', newAlert);
    
    return { success: true, data: newAlert };
  }

  // Obtener alertas emocionales
  getEmotionalAlerts(filters = {}) {
    let filteredAlerts = [...this.emotionalAlerts];

    if (filters.status) {
      filteredAlerts = filteredAlerts.filter(a => a.status === filters.status);
    }

    if (filters.severity) {
      filteredAlerts = filteredAlerts.filter(a => a.severity === filters.severity);
    }

    if (filters.acknowledged !== undefined) {
      filteredAlerts = filteredAlerts.filter(a => a.acknowledged === filters.acknowledged);
    }

    return { success: true, data: filteredAlerts };
  }

  // Marcar alerta como reconocida
  acknowledgeAlert(alertId) {
    const alertIndex = this.emotionalAlerts.findIndex(a => a.id === alertId);
    
    if (alertIndex === -1) {
      return { success: false, error: 'Alert not found' };
    }

    this.emotionalAlerts[alertIndex].acknowledged = true;
    this.emotionalAlerts[alertIndex].acknowledgedAt = new Date().toISOString();
    
    this.saveToStorage('kary_emotional_alerts', this.emotionalAlerts);
    this.notifyListeners('alert_acknowledged', this.emotionalAlerts[alertIndex]);
    
    return { success: true, data: this.emotionalAlerts[alertIndex] };
  }

  // === GESTIÓN DE ESTUDIANTES ===
  
  // Registrar estudiante
  registerStudent(studentData) {
    const newStudent = {
      id: this.generateId(),
      ...studentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active',
      assessments: [],
      cases: [],
      supportPlans: [],
      emotionalData: {
        currentMood: 'neutral',
        stressLevel: 0,
        anxietyLevel: 0,
        socialEngagement: 0,
        academicMotivation: 0
      }
    };

    this.students.push(newStudent);
    this.saveToStorage('kary_psychopedagogue_students', this.students);
    this.notifyListeners('student_registered', newStudent);
    
    return { success: true, data: newStudent };
  }

  // Obtener estudiantes
  getStudents(filters = {}) {
    let filteredStudents = [...this.students];

    if (filters.status) {
      filteredStudents = filteredStudents.filter(s => s.status === filters.status);
    }

    if (filters.grade) {
      filteredStudents = filteredStudents.filter(s => s.grade === filters.grade);
    }

    return { success: true, data: filteredStudents };
  }

  // === EVALUACIONES Y SEGUIMIENTO ===
  
  // Agregar evaluación
  addAssessment(caseId, assessmentData) {
    const caseIndex = this.cases.findIndex(c => c.id === caseId);
    
    if (caseIndex === -1) {
      return { success: false, error: 'Case not found' };
    }

    const assessment = {
      id: this.generateId(),
      ...assessmentData,
      createdAt: new Date().toISOString(),
      caseId
    };

    this.cases[caseIndex].assessments.push(assessment);
    this.cases[caseIndex].updatedAt = new Date().toISOString();
    
    this.saveToStorage('kary_cases', this.cases);
    this.notifyListeners('assessment_added', { case: this.cases[caseIndex], assessment });
    
    return { success: true, data: { case: this.cases[caseIndex], assessment } };
  }

  // Agregar intervención
  addIntervention(caseId, interventionData) {
    const caseIndex = this.cases.findIndex(c => c.id === caseId);
    
    if (caseIndex === -1) {
      return { success: false, error: 'Case not found' };
    }

    const intervention = {
      id: this.generateId(),
      ...interventionData,
      createdAt: new Date().toISOString(),
      caseId,
      status: 'planned' // planned, in_progress, completed, cancelled
    };

    this.cases[caseIndex].interventions.push(intervention);
    this.cases[caseIndex].updatedAt = new Date().toISOString();
    
    this.saveToStorage('kary_cases', this.cases);
    this.notifyListeners('intervention_added', { case: this.cases[caseIndex], intervention });
    
    return { success: true, data: { case: this.cases[caseIndex], intervention } };
  }

  // === ESTADÍSTICAS Y REPORTES ===
  
  // Obtener estadísticas del dashboard
  getDashboardStats() {
    const activeCases = this.cases.filter(c => c.status === 'active').length;
    const emotionalAlerts = this.emotionalAlerts.filter(a => a.status === 'active' && !a.acknowledged).length;
    const activeSupportPlans = this.supportPlans.filter(p => p.status === 'active').length;
    const pendingTasks = this.cases.filter(c => c.status === 'active' && c.progress < 100).length;

    return {
      success: true,
      data: {
        activeCases,
        emotionalAlerts,
        activeSupportPlans,
        pendingTasks,
        totalStudents: this.students.length,
        completedCases: this.cases.filter(c => c.status === 'closed').length,
        highPriorityAlerts: this.emotionalAlerts.filter(a => a.severity === 'high' || a.severity === 'critical').length
      }
    };
  }

  // Obtener tendencias emocionales
  getEmotionalTrends(period = 'week') {
    // Simular datos de tendencias emocionales
    const trends = {
      week: {
        positive: 65,
        neutral: 25,
        negative: 10,
        stressLevel: 3.2,
        anxietyLevel: 2.8,
        socialEngagement: 4.1
      },
      month: {
        positive: 70,
        neutral: 20,
        negative: 10,
        stressLevel: 3.0,
        anxietyLevel: 2.5,
        socialEngagement: 4.3
      }
    };

    return { success: true, data: trends[period] || trends.week };
  }

  // === SUGERENCIAS DE IA ===
  
  // Generar sugerencias de IA
  generateAISuggestions() {
    const suggestions = [];

    // Sugerir revisión de casos con TDAH
    const adhdCases = this.cases.filter(c => 
      c.diagnosis?.includes('TDAH') && 
      c.status === 'active' && 
      c.updatedAt < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    );

    if (adhdCases.length > 0) {
      suggestions.push({
        id: this.generateId(),
        type: 'evaluation',
        priority: 'high',
        title: 'Revisar casos de estudiantes con TDAH',
        description: `${adhdCases.length} estudiantes requieren evaluación de seguimiento`,
        action: 'review_cases',
        data: { caseIds: adhdCases.map(c => c.id) }
      });
    }

    // Sugerir actualización de planes de apoyo
    const outdatedPlans = this.supportPlans.filter(p => 
      p.status === 'active' && 
      p.updatedAt < new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
    );

    if (outdatedPlans.length > 0) {
      suggestions.push({
        id: this.generateId(),
        type: 'plan_update',
        priority: 'medium',
        title: 'Actualizar planes de apoyo',
        description: `${outdatedPlans.length} planes requieren revisión y actualización`,
        action: 'update_plans',
        data: { planIds: outdatedPlans.map(p => p.id) }
      });
    }

    // Sugerir intervención para alertas críticas
    const criticalAlerts = this.emotionalAlerts.filter(a => 
      a.severity === 'critical' && 
      a.status === 'active' && 
      !a.acknowledged
    );

    if (criticalAlerts.length > 0) {
      suggestions.push({
        id: this.generateId(),
        type: 'intervention',
        priority: 'urgent',
        title: 'Intervención inmediata requerida',
        description: `${criticalAlerts.length} alertas críticas requieren atención inmediata`,
        action: 'urgent_intervention',
        data: { alertIds: criticalAlerts.map(a => a.id) }
      });
    }

    return { success: true, data: suggestions };
  }

  // === SUSCRIPCIONES ===
  
  // Suscribirse a cambios
  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  // Notificar a los listeners
  notifyListeners(event, data) {
    this.listeners.forEach(listener => {
      try {
        listener(event, data);
      } catch (error) {
        console.error('Error in psychopedagogue listener:', error);
      }
    });
  }

  // === UTILIDADES ===
  
  // Buscar en todos los datos
  search(query) {
    const results = {
      cases: this.cases.filter(c => 
        c.title?.toLowerCase().includes(query.toLowerCase()) ||
        c.description?.toLowerCase().includes(query.toLowerCase()) ||
        c.studentName?.toLowerCase().includes(query.toLowerCase())
      ),
      students: this.students.filter(s => 
        s.name?.toLowerCase().includes(query.toLowerCase()) ||
        s.grade?.toLowerCase().includes(query.toLowerCase())
      ),
      supportPlans: this.supportPlans.filter(p => 
        p.title?.toLowerCase().includes(query.toLowerCase()) ||
        p.description?.toLowerCase().includes(query.toLowerCase())
      )
    };

    return { success: true, data: results };
  }

  // Exportar datos
  exportData() {
    return {
      cases: this.cases,
      supportPlans: this.supportPlans,
      emotionalAlerts: this.emotionalAlerts,
      students: this.students,
      exportedAt: new Date().toISOString()
    };
  }

  // Importar datos
  importData(data) {
    try {
      if (data.cases) {
        this.cases = data.cases;
        this.saveToStorage('kary_cases', this.cases);
      }
      if (data.supportPlans) {
        this.supportPlans = data.supportPlans;
        this.saveToStorage('kary_support_plans', this.supportPlans);
      }
      if (data.emotionalAlerts) {
        this.emotionalAlerts = data.emotionalAlerts;
        this.saveToStorage('kary_emotional_alerts', this.emotionalAlerts);
      }
      if (data.students) {
        this.students = data.students;
        this.saveToStorage('kary_psychopedagogue_students', this.students);
      }
      
      this.notifyListeners('data_imported', data);
      return { success: true, data: 'Data imported successfully' };
    } catch (error) {
      return { success: false, error: 'Error importing data' };
    }
  }

  // === MÉTODOS ALIAS PARA COMPATIBILIDAD ===
  
  // Alias para getAllCases
  getAllCases(filters = {}) {
    return this.getCases(filters);
  }

  // Alias para getAllEmotionalAlerts
  getAllEmotionalAlerts(filters = {}) {
    return this.getEmotionalAlerts(filters);
  }

  // Alias para getAllStudents
  getAllStudents(filters = {}) {
    return this.getStudents(filters);
  }

  // === MÉTODOS ADICIONALES PARA FUNCIONALIDADES ===

  // Obtener todos los psicopedagogos
  getAllPsychopedagogues() {
    try {
      const psychopedagogues = [
        {
          id: 'psycho-1',
          name: 'Dr. Luis Martínez',
          specialization: 'TDAH y Dificultades de Aprendizaje',
          experience: '15 años',
          currentCases: 8,
          maxCases: 15
        },
        {
          id: 'psycho-2',
          name: 'Dra. María García',
          specialization: 'Dislexia y Problemas de Lectura',
          experience: '12 años',
          currentCases: 6,
          maxCases: 12
        },
        {
          id: 'psycho-3',
          name: 'Dr. Carlos López',
          specialization: 'Problemas Conductuales',
          experience: '10 años',
          currentCases: 4,
          maxCases: 10
        }
      ];

      return {
        success: true,
        data: psychopedagogues
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al obtener psicopedagogos'
      };
    }
  }

  // Asignar caso
  assignCase(assignmentData) {
    try {
      const assignments = JSON.parse(localStorage.getItem('psychopedagogue_assignments') || '[]');
      const newAssignment = {
        id: `assignment-${Date.now()}`,
        ...assignmentData,
        createdAt: new Date().toISOString(),
        status: 'active'
      };
      
      assignments.push(newAssignment);
      localStorage.setItem('psychopedagogue_assignments', JSON.stringify(assignments));
      
      this.publish('case_assigned', newAssignment);
      
      return {
        success: true,
        data: newAssignment
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al asignar caso'
      };
    }
  }

  // Generar asignaciones inteligentes
  generateIntelligentAssignments(params) {
    try {
      const { cases, psychopedagogues, criteria, priority, workload, specialization, maxAssignments } = params;
      
      // Simular algoritmo de IA para asignaciones
      const suggestions = cases
        .filter(case_ => {
          if (priority !== 'all' && case_.priority !== priority) return false;
          if (specialization && !case_.category.includes(specialization)) return false;
          return true;
        })
        .slice(0, maxAssignments)
        .map((case_, index) => {
          const psychopedagogue = psychopedagogues[index % psychopedagogues.length];
          const confidence = Math.random() * 0.4 + 0.6; // 60-100% confianza
          
          return {
            caseId: case_.id,
            caseTitle: case_.title,
            studentName: case_.studentName,
            assignedTo: psychopedagogue.name,
            assignedToId: psychopedagogue.id,
            confidence: confidence,
            reason: this.generateAssignmentReason(case_, psychopedagogue, criteria)
          };
        });

      return {
        success: true,
        data: suggestions
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al generar asignaciones inteligentes'
      };
    }
  }

  // Generar razón de asignación
  generateAssignmentReason(case_, psychopedagogue, criteria) {
    const reasons = [
      `Especialización en ${case_.category}`,
      `Experiencia con casos similares`,
      `Carga de trabajo equilibrada`,
      `Alta compatibilidad de perfil`,
      `Disponibilidad inmediata`
    ];
    
    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  // Aplicar asignaciones inteligentes
  applyIntelligentAssignments(suggestions) {
    try {
      const assignments = JSON.parse(localStorage.getItem('psychopedagogue_assignments') || '[]');
      
      suggestions.forEach(suggestion => {
        const assignment = {
          id: `assignment-${Date.now()}-${Math.random()}`,
          caseId: suggestion.caseId,
          assignedTo: suggestion.assignedToId,
          assignmentType: 'psychopedagogue',
          priority: 'medium',
          confidence: suggestion.confidence,
          reason: suggestion.reason,
          createdAt: new Date().toISOString(),
          status: 'active'
        };
        
        assignments.push(assignment);
        this.publish('case_assigned', assignment);
      });
      
      localStorage.setItem('psychopedagogue_assignments', JSON.stringify(assignments));
      
      return {
        success: true,
        data: assignments
      };
    } catch (error) {
      return {
        success: false,
        error: 'Error al aplicar asignaciones'
      };
    }
  }
}

// Instancia singleton
const psychopedagogueService = new PsychopedagogueService();

export default psychopedagogueService;
