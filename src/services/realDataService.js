import { supabase } from '@/lib/supabaseClient';

class RealDataService {
  constructor() {
    this.cache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutos
  }

  // Obtener datos del usuario autenticado
  async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  // Obtener perfil completo del usuario
  async getUserProfile(userId) {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  }

  // Obtener datos del dashboard según el rol
  async getDashboardData(role, userId) {
    const cacheKey = `dashboard_${role}_${userId}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data;
    }

    try {
      let data = {};
      
      switch (role) {
        case 'student':
          data = await this.getStudentDashboardData(userId);
          break;
        case 'teacher':
          data = await this.getTeacherDashboardData(userId);
          break;
        case 'parent':
          data = await this.getParentDashboardData(userId);
          break;
        case 'psychopedagogue':
          data = await this.getPsychopedagogueDashboardData(userId);
          break;
        case 'directive':
          data = await this.getDirectiveDashboardData(userId);
          break;
        default:
          data = await this.getGenericDashboardData(userId);
      }

      this.cache.set(cacheKey, {
        data,
        timestamp: Date.now()
      });

      return data;
    } catch (error) {
      console.error(`Error getting ${role} dashboard data:`, error);
      return null;
    }
  }

  // Datos específicos para estudiante
  async getStudentDashboardData(userId) {
    try {
      const [activities, progress, supportPlans, notifications] = await Promise.all([
        this.getStudentActivities(userId),
        this.getStudentProgress(userId),
        this.getStudentSupportPlans(userId),
        this.getStudentNotifications(userId)
      ]);

      return {
        activities,
        progress,
        supportPlans,
        notifications,
        totalActivities: activities?.length || 0,
        completedActivities: activities?.filter(a => a.status === 'completed').length || 0,
        activeSupportPlans: supportPlans?.filter(p => p.status === 'active').length || 0,
        unreadNotifications: notifications?.filter(n => !n.read).length || 0
      };
    } catch (error) {
      console.error('Error getting student dashboard data:', error);
      return null;
    }
  }

  // Datos específicos para profesor
  async getTeacherDashboardData(userId) {
    try {
      const [students, activities, observations, analytics] = await Promise.all([
        this.getTeacherStudents(userId),
        this.getTeacherActivities(userId),
        this.getTeacherObservations(userId),
        this.getTeacherAnalytics(userId)
      ]);

      return {
        students,
        activities,
        observations,
        analytics,
        totalStudents: students?.length || 0,
        totalActivities: activities?.length || 0,
        pendingObservations: observations?.filter(o => o.status === 'pending').length || 0,
        completedActivities: activities?.filter(a => a.status === 'completed').length || 0
      };
    } catch (error) {
      console.error('Error getting teacher dashboard data:', error);
      return null;
    }
  }

  // Datos específicos para padre
  async getParentDashboardData(userId) {
    try {
      const [children, familyProgress, communications, appointments] = await Promise.all([
        this.getParentChildren(userId),
        this.getFamilyProgress(userId),
        this.getParentCommunications(userId),
        this.getParentAppointments(userId)
      ]);

      return {
        children,
        familyProgress,
        communications,
        appointments,
        totalChildren: children?.length || 0,
        unreadCommunications: communications?.filter(c => !c.read).length || 0,
        upcomingAppointments: appointments?.filter(a => new Date(a.date) > new Date()).length || 0
      };
    } catch (error) {
      console.error('Error getting parent dashboard data:', error);
      return null;
    }
  }

  // Datos específicos para psicopedagogo
  async getPsychopedagogueDashboardData(userId) {
    try {
      const [students, cases, supportPlans, evaluations] = await Promise.all([
        this.getPsychopedagogueStudents(userId),
        this.getPsychopedagogueCases(userId),
        this.getPsychopedagogueSupportPlans(userId),
        this.getPsychopedagogueEvaluations(userId)
      ]);

      return {
        students,
        cases,
        supportPlans,
        evaluations,
        totalStudents: students?.length || 0,
        activeCases: cases?.filter(c => c.status === 'active').length || 0,
        activeSupportPlans: supportPlans?.filter(p => p.status === 'active').length || 0,
        pendingEvaluations: evaluations?.filter(e => e.status === 'pending').length || 0
      };
    } catch (error) {
      console.error('Error getting psychopedagogue dashboard data:', error);
      return null;
    }
  }

  // Datos específicos para directivo
  async getDirectiveDashboardData(userId) {
    try {
      const [institution, userManagement, reports, alerts, strategicSummary] = await Promise.all([
        this.getInstitutionData(),
        this.getUserManagementData(),
        this.getReportsData(),
        this.getAlertsData(),
        this.getStrategicSummaryData()
      ]);

      return {
        institution,
        userManagement,
        reports,
        alerts,
        strategicSummary,
        totalUsers: userManagement?.totalUsers || 0,
        activeAlerts: alerts?.filter(a => a.status === 'active').length || 0,
        generatedReports: reports?.length || 0
      };
    } catch (error) {
      console.error('Error getting directive dashboard data:', error);
      return null;
    }
  }

  // Métodos auxiliares para obtener datos específicos
  async getStudentActivities(userId) {
    try {
      const { data, error } = await supabase
        .from('student_activities')
        .select('*')
        .eq('student_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting student activities:', error);
      return [];
    }
  }

  async getStudentProgress(userId) {
    try {
      const { data, error } = await supabase
        .from('student_progress')
        .select('*')
        .eq('student_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting student progress:', error);
      return [];
    }
  }

  async getStudentSupportPlans(userId) {
    try {
      const { data, error } = await supabase
        .from('support_plans')
        .select('*')
        .eq('student_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting student support plans:', error);
      return [];
    }
  }

  async getStudentNotifications(userId) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting student notifications:', error);
      return [];
    }
  }

  async getTeacherStudents(userId) {
    try {
      const { data, error } = await supabase
        .from('teacher_students')
        .select(`
          *,
          student:user_profiles!student_id(*)
        `)
        .eq('teacher_id', userId);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting teacher students:', error);
      return [];
    }
  }

  async getTeacherActivities(userId) {
    try {
      const { data, error } = await supabase
        .from('teacher_activities')
        .select('*')
        .eq('teacher_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting teacher activities:', error);
      return [];
    }
  }

  async getTeacherObservations(userId) {
    try {
      const { data, error } = await supabase
        .from('teacher_observations')
        .select('*')
        .eq('teacher_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting teacher observations:', error);
      return [];
    }
  }

  async getTeacherAnalytics(userId) {
    try {
      const { data, error } = await supabase
        .from('teacher_analytics')
        .select('*')
        .eq('teacher_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting teacher analytics:', error);
      return [];
    }
  }

  async getParentChildren(userId) {
    try {
      const { data, error } = await supabase
        .from('parent_children')
        .select(`
          *,
          child:user_profiles!child_id(*)
        `)
        .eq('parent_id', userId);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting parent children:', error);
      return [];
    }
  }

  async getFamilyProgress(userId) {
    try {
      const { data, error } = await supabase
        .from('family_progress')
        .select('*')
        .eq('parent_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting family progress:', error);
      return [];
    }
  }

  async getParentCommunications(userId) {
    try {
      const { data, error } = await supabase
        .from('parent_communications')
        .select('*')
        .eq('parent_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting parent communications:', error);
      return [];
    }
  }

  async getParentAppointments(userId) {
    try {
      const { data, error } = await supabase
        .from('parent_appointments')
        .select('*')
        .eq('parent_id', userId)
        .order('date', { ascending: true });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting parent appointments:', error);
      return [];
    }
  }

  async getPsychopedagogueStudents(userId) {
    try {
      const { data, error } = await supabase
        .from('psychopedagogue_students')
        .select(`
          *,
          student:user_profiles!student_id(*)
        `)
        .eq('psychopedagogue_id', userId);
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting psychopedagogue students:', error);
      return [];
    }
  }

  async getPsychopedagogueCases(userId) {
    try {
      const { data, error } = await supabase
        .from('psychopedagogue_cases')
        .select('*')
        .eq('psychopedagogue_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting psychopedagogue cases:', error);
      return [];
    }
  }

  async getPsychopedagogueSupportPlans(userId) {
    try {
      const { data, error } = await supabase
        .from('psychopedagogue_support_plans')
        .select('*')
        .eq('psychopedagogue_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting psychopedagogue support plans:', error);
      return [];
    }
  }

  async getPsychopedagogueEvaluations(userId) {
    try {
      const { data, error } = await supabase
        .from('psychopedagogue_evaluations')
        .select('*')
        .eq('psychopedagogue_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting psychopedagogue evaluations:', error);
      return [];
    }
  }

  async getInstitutionData() {
    try {
      const { data, error } = await supabase
        .from('institution_data')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting institution data:', error);
      return null;
    }
  }

  async getUserManagementData() {
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('id, full_name, role, status, created_at')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return {
        users: data || [],
        totalUsers: data?.length || 0
      };
    } catch (error) {
      console.error('Error getting user management data:', error);
      return { users: [], totalUsers: 0 };
    }
  }

  async getReportsData() {
    try {
      const { data, error } = await supabase
        .from('reports')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting reports data:', error);
      return [];
    }
  }

  async getAlertsData() {
    try {
      const { data, error } = await supabase
        .from('alerts')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting alerts data:', error);
      return [];
    }
  }

  async getStrategicSummaryData() {
    try {
      const { data, error } = await supabase
        .from('strategic_summary')
        .select('*')
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting strategic summary data:', error);
      return null;
    }
  }

  async getGenericDashboardData(userId) {
    try {
      const [notifications, settings] = await Promise.all([
        this.getStudentNotifications(userId),
        this.getUserSettings(userId)
      ]);

      return {
        notifications,
        settings,
        unreadNotifications: notifications?.filter(n => !n.read).length || 0
      };
    } catch (error) {
      console.error('Error getting generic dashboard data:', error);
      return null;
    }
  }

  async getUserSettings(userId) {
    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user settings:', error);
      return null;
    }
  }

  // Limpiar caché
  clearCache() {
    this.cache.clear();
  }

  // Limpiar caché específico
  clearUserCache(userId) {
    for (const [key, value] of this.cache.entries()) {
      if (key.includes(userId)) {
        this.cache.delete(key);
      }
    }
  }
}

export default new RealDataService();
