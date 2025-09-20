/**
 * Servicio de Datos Inteligentes para IA
 * Conecta el asistente de IA con datos reales de la institución
 */

import { supabase } from '@/lib/supabaseClient';
import edgeFunctionService from '@/services/edgeFunctionService';
import unifiedDataService from '@/services/unifiedDataService';

class IntelligentDataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  /**
   * Obtiene datos institucionales reales para el contexto de IA
   */
  async getInstitutionalIntelligence() {
    const cacheKey = 'institutional_intelligence';
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      const [
        studentsData,
        teachersData,
        activitiesData,
        supportPlansData,
        emotionalData,
        academicData
      ] = await Promise.all([
        this.getRealStudentsData(),
        this.getRealTeachersData(),
        this.getRealActivitiesData(),
        this.getRealSupportPlansData(),
        this.getEmotionalIntelligenceData(),
        this.getAcademicIntelligenceData()
      ]);

      const intelligence = {
        demographics: {
          totalStudents: studentsData.length,
          totalTeachers: teachersData.length,
          activeStudents: studentsData.filter(s => s.status === 'active').length,
          gradeDistribution: this.calculateGradeDistribution(studentsData),
          riskDistribution: this.calculateRiskDistribution(studentsData)
        },
        academic: {
          totalActivities: activitiesData.length,
          completedActivities: activitiesData.filter(a => a.status === 'completed').length,
          overdueActivities: activitiesData.filter(a => a.status === 'overdue').length,
          averageCompletionRate: this.calculateAverageCompletionRate(activitiesData),
          subjectPerformance: this.calculateSubjectPerformance(activitiesData),
          trends: await this.getAcademicTrends()
        },
        support: {
          activeSupportPlans: supportPlansData.filter(p => p.status === 'active').length,
          completedSupportPlans: supportPlansData.filter(p => p.status === 'completed').length,
          supportEffectiveness: this.calculateSupportEffectiveness(supportPlansData),
          commonNeeds: this.identifyCommonSupportNeeds(supportPlansData)
        },
        emotional: {
          averageMoodScore: emotionalData.averageMoodScore,
          emotionalTrends: emotionalData.trends,
          riskAlerts: emotionalData.riskAlerts,
          interventionSuccess: emotionalData.interventionSuccess
        },
        insights: {
          topPerformingStudents: this.getTopPerformingStudents(studentsData, activitiesData),
          studentsNeedingAttention: this.getStudentsNeedingAttention(studentsData, activitiesData),
          teacherEffectiveness: this.calculateTeacherEffectiveness(teachersData, activitiesData),
          institutionalChallenges: this.identifyInstitutionalChallenges(studentsData, activitiesData),
          recommendations: await this.generateInstitutionalRecommendations()
        },
        realTime: {
          lastUpdated: new Date().toISOString(),
          activeAlerts: await this.getActiveAlerts(),
          recentActivity: await this.getRecentActivity(),
          systemHealth: await this.getSystemHealth()
        }
      };

      this.setCachedData(cacheKey, intelligence);
      return intelligence;
    } catch (error) {
      console.error('Error getting institutional intelligence:', error);
      return this.getFallbackIntelligence();
    }
  }

  /**
   * Obtiene datos específicos del rol para el contexto de IA
   */
  async getRoleBasedIntelligence(role, userId) {
    const cacheKey = `role_intelligence_${role}_${userId}`;
    const cached = this.getCachedData(cacheKey);
    if (cached) return cached;

    try {
      let intelligence = {};

      switch (role) {
        case 'directive':
          intelligence = await this.getDirectiveIntelligence();
          break;
        case 'teacher':
          intelligence = await this.getTeacherIntelligence(userId);
          break;
        case 'psychopedagogue':
          intelligence = await this.getPsychopedagogueIntelligence(userId);
          break;
        case 'parent':
          intelligence = await this.getParentIntelligence(userId);
          break;
        case 'student':
          intelligence = await this.getStudentIntelligence(userId);
          break;
        default:
          intelligence = await this.getGenericRoleIntelligence(role, userId);
      }

      this.setCachedData(cacheKey, intelligence);
      return intelligence;
    } catch (error) {
      console.error(`Error getting ${role} intelligence:`, error);
      return this.getFallbackRoleIntelligence(role);
    }
  }

  /**
   * Obtiene datos de estudiantes reales
   */
  async getRealStudentsData() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'student');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Error fetching real students data, using unified service:', error);
      return unifiedDataService.getStudents().data;
    }
  }

  /**
   * Obtiene datos de profesores reales
   */
  async getRealTeachersData() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('role', 'teacher');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Error fetching real teachers data, using unified service:', error);
      return unifiedDataService.getTeachers().data;
    }
  }

  /**
   * Obtiene datos de actividades reales
   */
  async getRealActivitiesData() {
    try {
      const { data, error } = await supabase
        .from('student_activities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Error fetching real activities data, using unified service:', error);
      return unifiedDataService.getActivities().data;
    }
  }

  /**
   * Obtiene datos de planes de apoyo reales
   */
  async getRealSupportPlansData() {
    try {
      const { data, error } = await supabase
        .from('support_plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.warn('Error fetching real support plans data, using unified service:', error);
      return unifiedDataService.getSupportPlans().data;
    }
  }

  /**
   * Obtiene datos de inteligencia emocional
   */
  async getEmotionalIntelligenceData() {
    try {
      const { data, error } = await supabase
        .from('tracking_data')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      const emotionalData = data || [];
      const moodScores = emotionalData.map(d => d.mood_score).filter(score => score !== null);
      
      return {
        averageMoodScore: moodScores.length > 0 ? 
          moodScores.reduce((a, b) => a + b, 0) / moodScores.length : 7,
        trends: this.calculateEmotionalTrends(emotionalData),
        riskAlerts: this.identifyEmotionalRiskAlerts(emotionalData),
        interventionSuccess: this.calculateInterventionSuccess(emotionalData)
      };
    } catch (error) {
      console.warn('Error fetching emotional intelligence data:', error);
      return {
        averageMoodScore: 7,
        trends: { direction: 'stable', confidence: 0.5 },
        riskAlerts: [],
        interventionSuccess: 0.75
      };
    }
  }

  /**
   * Obtiene datos de inteligencia académica
   */
  async getAcademicIntelligenceData() {
    try {
      // Usar edge function para obtener datos académicos
      const result = await edgeFunctionService.getDashboardSummary({
        role: 'directive',
        includeMetrics: true
      });

      if (result.error) throw new Error(result.error.message);
      return result.data || {};
    } catch (error) {
      console.warn('Error fetching academic intelligence data:', error);
      return {
        averagePerformance: 7.5,
        improvementRate: 0.1,
        challenges: ['Diversidad de niveles', 'Recursos limitados']
      };
    }
  }

  /**
   * Obtiene inteligencia específica para directivos
   */
  async getDirectiveIntelligence() {
    const institutionalData = await this.getInstitutionalIntelligence();
    
    return {
      ...institutionalData,
      strategic: {
        keyMetrics: await this.getStrategicMetrics(),
        performanceIndicators: await this.getPerformanceIndicators(),
        riskAssessment: await this.getRiskAssessment(),
        improvementAreas: await this.getImprovementAreas(),
        resourceUtilization: await this.getResourceUtilization()
      },
      recommendations: {
        immediate: await this.getImmediateRecommendations(),
        shortTerm: await this.getShortTermRecommendations(),
        longTerm: await this.getLongTermRecommendations()
      }
    };
  }

  /**
   * Obtiene inteligencia específica para profesores
   */
  async getTeacherIntelligence(userId) {
    try {
      const [students, activities, observations] = await Promise.all([
        this.getStudentsByTeacher(userId),
        this.getActivitiesByTeacher(userId),
        this.getTeacherObservations(userId)
      ]);

      return {
        students: students,
        classPerformance: this.calculateClassPerformance(students, activities),
        teachingEffectiveness: this.calculateTeachingEffectiveness(activities, observations),
        studentNeeds: this.identifyStudentNeeds(students, activities),
        recommendations: await this.getTeacherRecommendations(userId, students, activities)
      };
    } catch (error) {
      console.error('Error getting teacher intelligence:', error);
      return this.getFallbackRoleIntelligence('teacher');
    }
  }

  /**
   * Obtiene inteligencia específica para psicopedagogos
   */
  async getPsychopedagogueIntelligence(userId) {
    try {
      const [students, cases, supportPlans] = await Promise.all([
        this.getStudentsByPsychopedagogue(userId),
        this.getCasesByPsychopedagogue(userId),
        this.getSupportPlansByPsychopedagogue(userId)
      ]);

      return {
        students: students,
        activeCases: cases.filter(c => c.status === 'active'),
        supportPlans: supportPlans,
        interventionEffectiveness: this.calculateInterventionEffectiveness(cases, supportPlans),
        riskAssessment: this.assessStudentRisks(students),
        recommendations: await this.getPsychopedagogueRecommendations(userId, students, cases)
      };
    } catch (error) {
      console.error('Error getting psychopedagogue intelligence:', error);
      return this.getFallbackRoleIntelligence('psychopedagogue');
    }
  }

  /**
   * Obtiene inteligencia específica para padres
   */
  async getParentIntelligence(userId) {
    try {
      const children = await this.getChildrenByParent(userId);
      const childrenData = await Promise.all(
        children.map(child => this.getStudentIntelligence(child.id))
      );

      return {
        children: children,
        childrenProgress: childrenData,
        familyEngagement: this.calculateFamilyEngagement(children, childrenData),
        recommendations: await this.getParentRecommendations(userId, children, childrenData)
      };
    } catch (error) {
      console.error('Error getting parent intelligence:', error);
      return this.getFallbackRoleIntelligence('parent');
    }
  }

  /**
   * Obtiene inteligencia específica para estudiantes
   */
  async getStudentIntelligence(userId) {
    try {
      const [profile, activities, supportPlans, emotionalData] = await Promise.all([
        this.getStudentProfile(userId),
        this.getActivitiesByStudent(userId),
        this.getSupportPlansByStudent(userId),
        this.getEmotionalDataByStudent(userId)
      ]);

      return {
        profile: profile,
        academicProgress: this.calculateAcademicProgress(activities),
        emotionalWellbeing: emotionalData,
        supportReceived: supportPlans,
        strengths: this.identifyStudentStrengths(activities),
        areasForImprovement: this.identifyAreasForImprovement(activities),
        recommendations: await this.getStudentRecommendations(userId, profile, activities)
      };
    } catch (error) {
      console.error('Error getting student intelligence:', error);
      return this.getFallbackRoleIntelligence('student');
    }
  }

  // Métodos auxiliares para cálculos y análisis

  calculateGradeDistribution(students) {
    const distribution = {};
    students.forEach(student => {
      const grade = student.grade || 'unknown';
      distribution[grade] = (distribution[grade] || 0) + 1;
    });
    return distribution;
  }

  calculateRiskDistribution(students) {
    const distribution = {
      academic: 0,
      emotional: 0,
      behavioral: 0,
      none: 0
    };

    students.forEach(student => {
      if (student.academic_risk === 'high') distribution.academic++;
      if (student.emotional_risk === 'high') distribution.emotional++;
      if (student.behavioral_risk === 'high') distribution.behavioral++;
      if (!student.academic_risk && !student.emotional_risk && !student.behavioral_risk) {
        distribution.none++;
      }
    });

    return distribution;
  }

  calculateAverageCompletionRate(activities) {
    if (activities.length === 0) return 0;
    const completed = activities.filter(a => a.status === 'completed').length;
    return (completed / activities.length) * 100;
  }

  calculateSubjectPerformance(activities) {
    const subjectStats = {};
    activities.forEach(activity => {
      if (activity.subject) {
        if (!subjectStats[activity.subject]) {
          subjectStats[activity.subject] = { total: 0, completed: 0 };
        }
        subjectStats[activity.subject].total++;
        if (activity.status === 'completed') {
          subjectStats[activity.subject].completed++;
        }
      }
    });

    const performance = {};
    Object.entries(subjectStats).forEach(([subject, stats]) => {
      performance[subject] = (stats.completed / stats.total) * 100;
    });

    return performance;
  }

  calculateSupportEffectiveness(supportPlans) {
    if (supportPlans.length === 0) return 0;
    const completed = supportPlans.filter(p => p.status === 'completed').length;
    return (completed / supportPlans.length) * 100;
  }

  identifyCommonSupportNeeds(supportPlans) {
    const needs = {};
    supportPlans.forEach(plan => {
      if (plan.support_goal) {
        const goal = plan.support_goal.toLowerCase();
        needs[goal] = (needs[goal] || 0) + 1;
      }
    });

    return Object.entries(needs)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([need, count]) => ({ need, count }));
  }

  // Métodos de cache
  getCachedData(key) {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }
    return null;
  }

  setCachedData(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  // Métodos de fallback
  getFallbackIntelligence() {
    return {
      demographics: { totalStudents: 0, totalTeachers: 0 },
      academic: { totalActivities: 0, averageCompletionRate: 0 },
      support: { activeSupportPlans: 0, supportEffectiveness: 0 },
      emotional: { averageMoodScore: 7, trends: { direction: 'stable' } },
      insights: { recommendations: [] },
      realTime: { lastUpdated: new Date().toISOString() }
    };
  }

  getFallbackRoleIntelligence(role) {
    return {
      role,
      data: {},
      recommendations: [],
      lastUpdated: new Date().toISOString()
    };
  }

  // Métodos placeholder para implementaciones futuras
  async getAcademicTrends() { return { direction: 'improving', confidence: 0.8 }; }
  async getActiveAlerts() { return []; }
  async getRecentActivity() { return []; }
  async getSystemHealth() { return { status: 'healthy', uptime: '99.9%' }; }
  async getStrategicMetrics() { return {}; }
  async getPerformanceIndicators() { return {}; }
  async getRiskAssessment() { return {}; }
  async getImprovementAreas() { return []; }
  async getResourceUtilization() { return {}; }
  async getImmediateRecommendations() { return []; }
  async getShortTermRecommendations() { return []; }
  async getLongTermRecommendations() { return []; }
  async getTeacherRecommendations() { return []; }
  async getPsychopedagogueRecommendations() { return []; }
  async getParentRecommendations() { return []; }
  async getStudentRecommendations() { return []; }

  // Métodos auxiliares para consultas específicas
  async getStudentsByTeacher(teacherId) {
    try {
      const { data } = await supabase
        .from('teacher_student_assignments')
        .select('student_id, user_profiles(*)')
        .eq('teacher_id', teacherId);
      return data?.map(item => item.user_profiles) || [];
    } catch (error) {
      console.warn('Error fetching students by teacher:', error);
      return [];
    }
  }

  async getActivitiesByTeacher(teacherId) {
    try {
      const { data } = await supabase
        .from('student_activities')
        .select('*')
        .eq('teacher_id', teacherId);
      return data || [];
    } catch (error) {
      console.warn('Error fetching activities by teacher:', error);
      return [];
    }
  }

  async getTeacherObservations(teacherId) {
    try {
      const { data } = await supabase
        .from('teacher_observations')
        .select('*')
        .eq('teacher_id', teacherId);
      return data || [];
    } catch (error) {
      console.warn('Error fetching teacher observations:', error);
      return [];
    }
  }

  async getStudentsByPsychopedagogue(psychopedagogueId) {
    try {
      const { data } = await supabase
        .from('psychopedagogue_student_mapping')
        .select('student_user_id, user_profiles(*)')
        .eq('psychopedagogue_user_id', psychopedagogueId);
      return data?.map(item => item.user_profiles) || [];
    } catch (error) {
      console.warn('Error fetching students by psychopedagogue:', error);
      return [];
    }
  }

  async getCasesByPsychopedagogue(psychopedagogueId) {
    try {
      const { data } = await supabase
        .from('support_plans')
        .select('*')
        .eq('created_by', psychopedagogueId);
      return data || [];
    } catch (error) {
      console.warn('Error fetching cases by psychopedagogue:', error);
      return [];
    }
  }

  async getSupportPlansByPsychopedagogue(psychopedagogueId) {
    try {
      const { data } = await supabase
        .from('support_plans')
        .select('*')
        .eq('created_by', psychopedagogueId);
      return data || [];
    } catch (error) {
      console.warn('Error fetching support plans by psychopedagogue:', error);
      return [];
    }
  }

  async getChildrenByParent(parentId) {
    try {
      const { data } = await supabase
        .from('parent_student_links')
        .select('student_user_id, user_profiles(*)')
        .eq('parent_user_id', parentId);
      return data?.map(item => item.user_profiles) || [];
    } catch (error) {
      console.warn('Error fetching children by parent:', error);
      return [];
    }
  }

  async getStudentProfile(studentId) {
    try {
      const { data } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', studentId)
        .single();
      return data;
    } catch (error) {
      console.warn('Error fetching student profile:', error);
      return null;
    }
  }

  async getActivitiesByStudent(studentId) {
    try {
      const { data } = await supabase
        .from('student_activities')
        .select('*')
        .eq('student_id', studentId);
      return data || [];
    } catch (error) {
      console.warn('Error fetching activities by student:', error);
      return [];
    }
  }

  async getSupportPlansByStudent(studentId) {
    try {
      const { data } = await supabase
        .from('support_plans')
        .select('*')
        .eq('student_id', studentId);
      return data || [];
    } catch (error) {
      console.warn('Error fetching support plans by student:', error);
      return [];
    }
  }

  async getEmotionalDataByStudent(studentId) {
    try {
      const { data } = await supabase
        .from('tracking_data')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(30);
      return data || [];
    } catch (error) {
      console.warn('Error fetching emotional data by student:', error);
      return [];
    }
  }

  // Métodos de análisis específicos
  calculateClassPerformance(students, activities) {
    // Implementar lógica de rendimiento de clase
    return { average: 7.5, trend: 'improving' };
  }

  calculateTeachingEffectiveness(activities, observations) {
    // Implementar lógica de efectividad docente
    return { score: 8.2, areas: ['engagement', 'clarity'] };
  }

  identifyStudentNeeds(students, activities) {
    // Implementar lógica de identificación de necesidades
    return [];
  }

  calculateInterventionEffectiveness(cases, supportPlans) {
    // Implementar lógica de efectividad de intervenciones
    return 0.75;
  }

  assessStudentRisks(students) {
    // Implementar lógica de evaluación de riesgos
    return { high: 2, medium: 5, low: 8 };
  }

  calculateFamilyEngagement(children, childrenData) {
    // Implementar lógica de engagement familiar
    return { score: 7.8, areas: ['communication', 'support'] };
  }

  calculateAcademicProgress(activities) {
    // Implementar lógica de progreso académico
    return { completion: 0.85, trend: 'improving' };
  }

  identifyStudentStrengths(activities) {
    // Implementar lógica de identificación de fortalezas
    return ['mathematics', 'creativity'];
  }

  identifyAreasForImprovement(activities) {
    // Implementar lógica de identificación de áreas de mejora
    return ['reading_comprehension', 'time_management'];
  }

  calculateEmotionalTrends(emotionalData) {
    // Implementar lógica de tendencias emocionales
    return { direction: 'stable', confidence: 0.7 };
  }

  identifyEmotionalRiskAlerts(emotionalData) {
    // Implementar lógica de alertas de riesgo emocional
    return [];
  }

  calculateInterventionSuccess(emotionalData) {
    // Implementar lógica de éxito de intervenciones
    return 0.8;
  }

  getTopPerformingStudents(students, activities) {
    // Implementar lógica de estudiantes de alto rendimiento
    return students.slice(0, 3);
  }

  getStudentsNeedingAttention(students, activities) {
    // Implementar lógica de estudiantes que necesitan atención
    return students.filter(s => s.academic_risk === 'high').slice(0, 5);
  }

  calculateTeacherEffectiveness(teachers, activities) {
    // Implementar lógica de efectividad docente
    return { average: 8.1, topPerformers: teachers.slice(0, 3) };
  }

  identifyInstitutionalChallenges(students, activities) {
    // Implementar lógica de desafíos institucionales
    return ['Diversidad de niveles', 'Recursos limitados'];
  }

  async generateInstitutionalRecommendations() {
    // Implementar lógica de recomendaciones institucionales
    return [
      'Implementar más recursos tecnológicos',
      'Mejorar la capacitación docente',
      'Fortalecer el apoyo emocional'
    ];
  }
}

export default new IntelligentDataService();
