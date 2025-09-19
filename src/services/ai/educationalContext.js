/**
 * Servicio de Contexto Educativo
 * Proporciona contexto educativo específico para la IA
 */

import { supabase } from '@/lib/supabaseClient';

class EducationalContext {
  constructor() {
    this.contextCache = new Map();
    this.patternsCache = new Map();
  }

  /**
   * Obtiene el contexto completo de un estudiante
   */
  async getStudentContext(studentId) {
    const cacheKey = `student_${studentId}`;
    if (this.contextCache.has(cacheKey)) {
      return this.contextCache.get(cacheKey);
    }

    try {
      const [
        profile,
        academicRecords,
        evaluations,
        supportPlans,
        behaviorLogs,
        attendanceRecords
      ] = await Promise.all([
        this.getStudentProfile(studentId),
        this.getAcademicRecords(studentId),
        this.getEvaluations(studentId),
        this.getSupportPlans(studentId),
        this.getBehaviorLogs(studentId),
        this.getAttendanceRecords(studentId)
      ]);

      const context = {
        profile,
        academic: {
          records: academicRecords,
          trends: this.analyzeAcademicTrends(academicRecords),
          strengths: this.identifyStrengths(academicRecords),
          weaknesses: this.identifyWeaknesses(academicRecords)
        },
        evaluations: {
          current: evaluations,
          patterns: this.analyzeEvaluationPatterns(evaluations),
          recommendations: this.extractRecommendations(evaluations)
        },
        support: {
          plans: supportPlans,
          active: supportPlans.filter(plan => plan.status === 'active'),
          history: supportPlans.filter(plan => plan.status === 'completed'),
          effectiveness: this.analyzePlanEffectiveness(supportPlans)
        },
        behavior: {
          logs: behaviorLogs,
          patterns: this.analyzeBehaviorPatterns(behaviorLogs),
          triggers: this.identifyBehaviorTriggers(behaviorLogs),
          interventions: this.identifySuccessfulInterventions(behaviorLogs)
        },
        attendance: {
          records: attendanceRecords,
          patterns: this.analyzeAttendancePatterns(attendanceRecords),
          trends: this.calculateAttendanceTrends(attendanceRecords)
        },
        social: await this.getSocialContext(studentId),
        family: await this.getFamilyContext(studentId),
        learning: await this.getLearningContext(studentId)
      };

      this.contextCache.set(cacheKey, context);
      return context;
    } catch (error) {
      console.error('Error getting student context:', error);
      return this.getFallbackStudentContext(studentId);
    }
  }

  /**
   * Obtiene el contexto institucional
   */
  async getInstitutionalContext() {
    const cacheKey = 'institutional';
    if (this.contextCache.has(cacheKey)) {
      return this.contextCache.get(cacheKey);
    }

    try {
      const [
        students,
        teachers,
        supportStaff,
        academicPrograms,
        institutionalData
      ] = await Promise.all([
        this.getAllStudents(),
        this.getAllTeachers(),
        this.getAllSupportStaff(),
        this.getAcademicPrograms(),
        this.getInstitutionalData()
      ]);

      const context = {
        demographics: {
          totalStudents: students.length,
          totalTeachers: teachers.length,
          totalSupportStaff: supportStaff.length,
          gradeDistribution: this.calculateGradeDistribution(students),
          ageDistribution: this.calculateAgeDistribution(students)
        },
        academic: {
          programs: academicPrograms,
          performance: this.calculateInstitutionalPerformance(students),
          trends: this.analyzeInstitutionalTrends(students),
          challenges: this.identifyInstitutionalChallenges(students)
        },
        support: {
          resources: await this.getSupportResources(),
          capacity: this.calculateSupportCapacity(supportStaff),
          utilization: this.calculateSupportUtilization(supportStaff)
        },
        institutional: institutionalData
      };

      this.contextCache.set(cacheKey, context);
      return context;
    } catch (error) {
      console.error('Error getting institutional context:', error);
      return this.getFallbackInstitutionalContext();
    }
  }

  /**
   * Obtiene el contexto del rol específico
   */
  async getRoleContext(role, userId) {
    const cacheKey = `role_${role}_${userId}`;
    if (this.contextCache.has(cacheKey)) {
      return this.contextCache.get(cacheKey);
    }

    try {
      let context = {};

      switch (role) {
        case 'directive':
          context = await this.getDirectiveContext(userId);
          break;
        case 'teacher':
          context = await this.getTeacherContext(userId);
          break;
        case 'psychopedagogue':
          context = await this.getPsychopedagogueContext(userId);
          break;
        case 'parent':
          context = await this.getParentContext(userId);
          break;
        case 'student':
          context = await this.getStudentContext(userId);
          break;
        default:
          context = await this.getGenericRoleContext(role, userId);
      }

      this.contextCache.set(cacheKey, context);
      return context;
    } catch (error) {
      console.error('Error getting role context:', error);
      return this.getFallbackRoleContext(role);
    }
  }

  /**
   * Analiza patrones de aprendizaje
   */
  async analyzeLearningPatterns(studentId) {
    try {
      const context = await this.getStudentContext(studentId);
      const patterns = {
        learningStyle: this.identifyLearningStyle(context),
        preferredSubjects: this.identifyPreferredSubjects(context),
        optimalTimes: this.identifyOptimalLearningTimes(context),
        engagementFactors: this.identifyEngagementFactors(context),
        difficultyAreas: this.identifyDifficultyAreas(context),
        motivationTriggers: this.identifyMotivationTriggers(context)
      };

      this.patternsCache.set(`patterns_${studentId}`, patterns);
      return patterns;
    } catch (error) {
      console.error('Error analyzing learning patterns:', error);
      return this.getFallbackLearningPatterns();
    }
  }

  /**
   * Identifica necesidades específicas
   */
  async identifySpecificNeeds(studentId) {
    try {
      const context = await this.getStudentContext(studentId);
      const patterns = await this.analyzeLearningPatterns(studentId);

      const needs = {
        academic: this.identifyAcademicNeeds(context, patterns),
        emotional: this.identifyEmotionalNeeds(context, patterns),
        social: this.identifySocialNeeds(context, patterns),
        behavioral: this.identifyBehavioralNeeds(context, patterns),
        physical: this.identifyPhysicalNeeds(context, patterns),
        cognitive: this.identifyCognitiveNeeds(context, patterns)
      };

      return {
        needs,
        priority: this.prioritizeNeeds(needs),
        interventions: this.suggestInterventions(needs),
        timeline: this.estimateInterventionTimeline(needs)
      };
    } catch (error) {
      console.error('Error identifying specific needs:', error);
      return this.getFallbackNeeds();
    }
  }

  // Métodos auxiliares privados

  async getStudentProfile(studentId) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', studentId)
      .single();
    
    if (error) throw error;
    return data;
  }

  async getAcademicRecords(studentId) {
    const { data, error } = await supabase
      .from('academic_records')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getEvaluations(studentId) {
    const { data, error } = await supabase
      .from('evaluations')
      .select('*')
      .eq('student_id', studentId)
      .order('evaluation_date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getSupportPlans(studentId) {
    const { data, error } = await supabase
      .from('support_plans')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getBehaviorLogs(studentId) {
    const { data, error } = await supabase
      .from('behavior_logs')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getAttendanceRecords(studentId) {
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async getSocialContext(studentId) {
    // Implementar lógica para contexto social
    return {
      relationships: [],
      socialSkills: [],
      groupDynamics: [],
      peerInteractions: []
    };
  }

  async getFamilyContext(studentId) {
    // Implementar lógica para contexto familiar
    return {
      familyStructure: {},
      supportLevel: 'medium',
      involvement: 'active',
      challenges: [],
      resources: []
    };
  }

  async getLearningContext(studentId) {
    // Implementar lógica para contexto de aprendizaje
    return {
      environment: 'classroom',
      resources: [],
      technology: 'available',
      support: 'available'
    };
  }

  async getAllStudents() {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'student');
    
    if (error) throw error;
    return data || [];
  }

  async getAllTeachers() {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('role', 'teacher');
    
    if (error) throw error;
    return data || [];
  }

  async getAllSupportStaff() {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .in('role', ['psychopedagogue', 'counselor', 'specialist']);
    
    if (error) throw error;
    return data || [];
  }

  async getAcademicPrograms() {
    const { data, error } = await supabase
      .from('academic_programs')
      .select('*');
    
    if (error) throw error;
    return data || [];
  }

  async getInstitutionalData() {
    const { data, error } = await supabase
      .from('institutional_data')
      .select('*')
      .single();
    
    if (error) throw error;
    return data || {};
  }

  async getSupportResources() {
    const { data, error } = await supabase
      .from('support_resources')
      .select('*');
    
    if (error) throw error;
    return data || [];
  }

  // Métodos de análisis

  analyzeAcademicTrends(records) {
    if (!records.length) return { trend: 'stable', direction: 'neutral' };
    
    const recentScores = records.slice(0, 5).map(r => r.score || 0);
    const olderScores = records.slice(5, 10).map(r => r.score || 0);
    
    const recentAvg = recentScores.reduce((a, b) => a + b, 0) / recentScores.length;
    const olderAvg = olderScores.reduce((a, b) => a + b, 0) / olderScores.length;
    
    const change = recentAvg - olderAvg;
    
    return {
      trend: change > 0.5 ? 'improving' : change < -0.5 ? 'declining' : 'stable',
      direction: change > 0 ? 'up' : change < 0 ? 'down' : 'neutral',
      change: Math.abs(change),
      confidence: this.calculateTrendConfidence(records)
    };
  }

  identifyStrengths(records) {
    const subjectScores = {};
    records.forEach(record => {
      if (record.subject) {
        if (!subjectScores[record.subject]) {
          subjectScores[record.subject] = [];
        }
        subjectScores[record.subject].push(record.score || 0);
      }
    });

    const strengths = [];
    Object.entries(subjectScores).forEach(([subject, scores]) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg >= 8.0) { // Asumiendo escala 0-10
        strengths.push({ subject, average: avg, consistency: this.calculateConsistency(scores) });
      }
    });

    return strengths.sort((a, b) => b.average - a.average);
  }

  identifyWeaknesses(records) {
    const subjectScores = {};
    records.forEach(record => {
      if (record.subject) {
        if (!subjectScores[record.subject]) {
          subjectScores[record.subject] = [];
        }
        subjectScores[record.subject].push(record.score || 0);
      }
    });

    const weaknesses = [];
    Object.entries(subjectScores).forEach(([subject, scores]) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
      if (avg < 6.0) { // Asumiendo escala 0-10
        weaknesses.push({ subject, average: avg, consistency: this.calculateConsistency(scores) });
      }
    });

    return weaknesses.sort((a, b) => a.average - b.average);
  }

  analyzeEvaluationPatterns(evaluations) {
    const patterns = {
      frequency: evaluations.length,
      types: {},
      trends: {},
      recommendations: []
    };

    evaluations.forEach(evaluation => {
      if (evaluation.type) {
        patterns.types[evaluation.type] = (patterns.types[evaluation.type] || 0) + 1;
      }
    });

    return patterns;
  }

  extractRecommendations(evaluations) {
    const recommendations = [];
    evaluations.forEach(evaluation => {
      if (evaluation.recommendations) {
        recommendations.push(...evaluation.recommendations);
      }
    });
    return [...new Set(recommendations)]; // Eliminar duplicados
  }

  analyzeBehaviorPatterns(logs) {
    const patterns = {
      frequency: logs.length,
      types: {},
      triggers: {},
      times: {},
      locations: {}
    };

    logs.forEach(log => {
      if (log.behavior_type) {
        patterns.types[log.behavior_type] = (patterns.types[log.behavior_type] || 0) + 1;
      }
      if (log.trigger) {
        patterns.triggers[log.trigger] = (patterns.triggers[log.trigger] || 0) + 1;
      }
    });

    return patterns;
  }

  identifyBehaviorTriggers(logs) {
    const triggers = {};
    logs.forEach(log => {
      if (log.trigger) {
        triggers[log.trigger] = (triggers[log.trigger] || 0) + 1;
      }
    });

    return Object.entries(triggers)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([trigger, count]) => ({ trigger, frequency: count }));
  }

  analyzeAttendancePatterns(records) {
    const patterns = {
      totalDays: records.length,
      presentDays: records.filter(r => r.status === 'present').length,
      absentDays: records.filter(r => r.status === 'absent').length,
      lateDays: records.filter(r => r.status === 'late').length,
      trends: this.calculateAttendanceTrends(records)
    };

    patterns.attendanceRate = patterns.presentDays / patterns.totalDays;
    return patterns;
  }

  calculateAttendanceTrends(records) {
    if (records.length < 10) return { trend: 'insufficient_data' };

    const recentRecords = records.slice(0, 10);
    const olderRecords = records.slice(10, 20);

    const recentRate = recentRecords.filter(r => r.status === 'present').length / recentRecords.length;
    const olderRate = olderRecords.filter(r => r.status === 'present').length / olderRecords.length;

    const change = recentRate - olderRate;

    return {
      trend: change > 0.1 ? 'improving' : change < -0.1 ? 'declining' : 'stable',
      change: Math.abs(change),
      currentRate: recentRate
    };
  }

  calculateGradeDistribution(students) {
    const distribution = {};
    students.forEach(student => {
      const grade = student.grade || 'unknown';
      distribution[grade] = (distribution[grade] || 0) + 1;
    });
    return distribution;
  }

  calculateAgeDistribution(students) {
    const distribution = {};
    students.forEach(student => {
      const age = student.age || 'unknown';
      distribution[age] = (distribution[age] || 0) + 1;
    });
    return distribution;
  }

  calculateInstitutionalPerformance(students) {
    // Implementar lógica de rendimiento institucional
    return {
      averageScore: 7.5,
      passingRate: 0.85,
      excellenceRate: 0.15,
      improvementRate: 0.1
    };
  }

  analyzeInstitutionalTrends(students) {
    // Implementar lógica de tendencias institucionales
    return {
      enrollment: 'stable',
      performance: 'improving',
      engagement: 'high',
      satisfaction: 'good'
    };
  }

  identifyInstitutionalChallenges(students) {
    // Implementar lógica de identificación de desafíos
    return [
      'Diversidad de niveles de aprendizaje',
      'Recursos tecnológicos limitados',
      'Participación familiar variable'
    ];
  }

  calculateSupportCapacity(staff) {
    return {
      totalStaff: staff.length,
      availableSlots: staff.length * 20, // Asumiendo 20 slots por staff
      utilizationRate: 0.75
    };
  }

  calculateSupportUtilization(staff) {
    // Implementar lógica de utilización de apoyo
    return {
      currentUtilization: 0.75,
      peakUtilization: 0.9,
      averageUtilization: 0.7
    };
  }

  // Métodos de contexto por rol

  async getDirectiveContext(userId) {
    const institutionalContext = await this.getInstitutionalContext();
    return {
      ...institutionalContext,
      role: 'directive',
      responsibilities: [
        'Toma de decisiones estratégicas',
        'Gestión de recursos',
        'Supervisión académica',
        'Liderazgo institucional'
      ],
      currentFocus: 'Mejora continua',
      challenges: institutionalContext.academic.challenges
    };
  }

  async getTeacherContext(userId) {
    const students = await this.getStudentsByTeacher(userId);
    return {
      role: 'teacher',
      students: students,
      classSize: students.length,
      subjects: await this.getSubjectsByTeacher(userId),
      responsibilities: [
        'Planificación de clases',
        'Evaluación de estudiantes',
        'Comunicación con familias',
        'Desarrollo profesional'
      ],
      currentFocus: 'Diferenciación instruccional'
    };
  }

  async getPsychopedagogueContext(userId) {
    const students = await this.getStudentsByPsychopedagogue(userId);
    return {
      role: 'psychopedagogue',
      students: students,
      caseload: students.length,
      specializations: await this.getSpecializations(userId),
      responsibilities: [
        'Evaluación psicopedagógica',
        'Planes de apoyo',
        'Intervención especializada',
        'Colaboración multidisciplinaria'
      ],
      currentFocus: 'Intervención temprana'
    };
  }

  async getParentContext(userId) {
    const children = await this.getChildrenByParent(userId);
    return {
      role: 'parent',
      children: children,
      involvement: 'active',
      responsibilities: [
        'Apoyo en casa',
        'Comunicación con escuela',
        'Participación en actividades',
        'Seguimiento del progreso'
      ],
      currentFocus: 'Apoyo al aprendizaje'
    };
  }

  // Métodos de fallback

  getFallbackStudentContext(studentId) {
    return {
      profile: { id: studentId, name: 'Estudiante' },
      academic: { records: [], trends: { trend: 'stable' } },
      evaluations: { current: [], patterns: {} },
      support: { plans: [], active: [] },
      behavior: { logs: [], patterns: {} },
      attendance: { records: [], patterns: {} }
    };
  }

  getFallbackInstitutionalContext() {
    return {
      demographics: { totalStudents: 0, totalTeachers: 0 },
      academic: { performance: { averageScore: 0 } },
      support: { capacity: { totalStaff: 0 } }
    };
  }

  getFallbackRoleContext(role) {
    return {
      role,
      responsibilities: ['Responsabilidades básicas'],
      currentFocus: 'Enfoque general'
    };
  }

  getFallbackLearningPatterns() {
    return {
      learningStyle: 'mixed',
      preferredSubjects: [],
      optimalTimes: ['morning'],
      engagementFactors: [],
      difficultyAreas: [],
      motivationTriggers: []
    };
  }

  getFallbackNeeds() {
    return {
      needs: {
        academic: [],
        emotional: [],
        social: [],
        behavioral: [],
        physical: [],
        cognitive: []
      },
      priority: [],
      interventions: [],
      timeline: '4-6 semanas'
    };
  }

  // Métodos auxiliares adicionales

  calculateTrendConfidence(records) {
    if (records.length < 5) return 0.3;
    if (records.length < 10) return 0.6;
    return 0.9;
  }

  calculateConsistency(scores) {
    if (scores.length < 2) return 1.0;
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, score) => sum + Math.pow(score - avg, 2), 0) / scores.length;
    const standardDeviation = Math.sqrt(variance);
    return Math.max(0, 1 - (standardDeviation / 10)); // Normalizar a escala 0-1
  }

  identifyLearningStyle(context) {
    // Implementar lógica de identificación de estilo de aprendizaje
    return 'mixed';
  }

  identifyPreferredSubjects(context) {
    const strengths = context.academic?.strengths || [];
    return strengths.map(s => s.subject);
  }

  identifyOptimalLearningTimes(context) {
    // Implementar lógica de identificación de horarios óptimos
    return ['morning', 'afternoon'];
  }

  identifyEngagementFactors(context) {
    // Implementar lógica de identificación de factores de engagement
    return ['interactive_activities', 'visual_materials'];
  }

  identifyDifficultyAreas(context) {
    const weaknesses = context.academic?.weaknesses || [];
    return weaknesses.map(w => w.subject);
  }

  identifyMotivationTriggers(context) {
    // Implementar lógica de identificación de motivadores
    return ['positive_feedback', 'achievement_recognition'];
  }

  identifyAcademicNeeds(context, patterns) {
    const weaknesses = context.academic?.weaknesses || [];
    return weaknesses.map(w => ({
      area: w.subject,
      priority: 'high',
      intervention: 'academic_support'
    }));
  }

  identifyEmotionalNeeds(context, patterns) {
    // Implementar lógica de identificación de necesidades emocionales
    return [];
  }

  identifySocialNeeds(context, patterns) {
    // Implementar lógica de identificación de necesidades sociales
    return [];
  }

  identifyBehavioralNeeds(context, patterns) {
    // Implementar lógica de identificación de necesidades conductuales
    return [];
  }

  identifyPhysicalNeeds(context, patterns) {
    // Implementar lógica de identificación de necesidades físicas
    return [];
  }

  identifyCognitiveNeeds(context, patterns) {
    // Implementar lógica de identificación de necesidades cognitivas
    return [];
  }

  prioritizeNeeds(needs) {
    const allNeeds = [
      ...needs.academic,
      ...needs.emotional,
      ...needs.social,
      ...needs.behavioral,
      ...needs.physical,
      ...needs.cognitive
    ];

    return allNeeds.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  suggestInterventions(needs) {
    // Implementar lógica de sugerencia de intervenciones
    return [];
  }

  estimateInterventionTimeline(needs) {
    // Implementar lógica de estimación de timeline
    return '4-6 semanas';
  }
}

export default new EducationalContext();

