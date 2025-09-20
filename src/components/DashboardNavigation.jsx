import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Bell,
  MessageSquare,
  ShieldCheck,
  Eye,
  Calendar,
  FileText,
  Users2,
  Target,
  ChevronRight
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const DashboardNavigation = ({ 
  userRole, 
  dashboardData, 
  onNavigate, 
  onClose 
}) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    console.log('DashboardNavigation handleNavigation called with path:', path);
    if (onNavigate) {
      console.log('Using onNavigate function');
      onNavigate(path);
    } else {
      console.log('Using navigate function directly');
      navigate(path);
    }
    if (onClose) {
      onClose();
    }
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  // Obtener contadores de datos reales
  const getDataCounts = () => {
    if (!dashboardData) return {};
    
    switch (userRole) {
      case 'student':
        return {
          activities: dashboardData.totalActivities || 0,
          completed: dashboardData.completedActivities || 0,
          supportPlans: dashboardData.activeSupportPlans || 0,
          notifications: dashboardData.unreadNotifications || 0
        };
      case 'teacher':
        return {
          students: dashboardData.totalStudents || 0,
          activities: dashboardData.totalActivities || 0,
          observations: dashboardData.pendingObservations || 0,
          completed: dashboardData.completedActivities || 0
        };
      case 'parent':
        return {
          children: dashboardData.totalChildren || 0,
          communications: dashboardData.unreadCommunications || 0,
          appointments: dashboardData.upcomingAppointments || 0
        };
      case 'psychopedagogue':
        return {
          students: dashboardData.totalStudents || 0,
          cases: dashboardData.activeCases || 0,
          supportPlans: dashboardData.activeSupportPlans || 0,
          evaluations: dashboardData.pendingEvaluations || 0
        };
      case 'directive':
        return {
          users: dashboardData.totalUsers || 0,
          alerts: dashboardData.activeAlerts || 0,
          reports: dashboardData.generatedReports || 0
        };
      default:
        return {};
    }
  };

  const dataCounts = getDataCounts();

  // Navegación específica por rol con contadores reales
  const getNavigationItems = () => {
    switch (userRole) {
      case 'student':
        return [
          { id: 'overview', label: t('common.overview', 'Resumen'), icon: Home, path: '/dashboard' },
          { 
            id: 'activities', 
            label: t('common.activities', 'Mis Actividades'), 
            icon: BookOpen, 
            path: '/dashboard/activities',
            count: dataCounts.activities
          },
          { 
            id: 'progress', 
            label: t('studentDashboard.progress', 'Mi Progreso'), 
            icon: BarChart3, 
            path: '/dashboard/progress',
            count: dataCounts.completed
          },
          { 
            id: 'kary-chat', 
            label: t('studentDashboard.karyChat', 'Chatea con Kary'), 
            icon: MessageSquare, 
            path: '/dashboard/kary-chat'
          },
          { 
            id: 'support-plans', 
            label: t('studentDashboard.supportPlans', 'Planes de Apoyo'), 
            icon: ShieldCheck, 
            path: '/dashboard/support-plans',
            count: dataCounts.supportPlans
          },
          { 
            id: 'notifications', 
            label: t('common.notifications', 'Notificaciones'), 
            icon: Bell, 
            path: '/dashboard/notifications',
            count: dataCounts.notifications
          },
          { id: 'settings', label: t('common.settings', 'Configuración'), icon: Settings, path: '/dashboard/settings' }
        ];
      case 'teacher':
        return [
          { id: 'overview', label: t('common.overview', 'Resumen'), icon: Home, path: '/dashboard' },
          { 
            id: 'students', 
            label: t('common.students', 'Mis Estudiantes'), 
            icon: Users, 
            path: '/dashboard/students',
            count: dataCounts.students
          },
          { 
            id: 'activities', 
            label: t('common.activities', 'Actividades'), 
            icon: BookOpen, 
            path: '/dashboard/activities',
            count: dataCounts.activities
          },
          { 
            id: 'observations', 
            label: t('teacherDashboard.observations', 'Observaciones'), 
            icon: Eye, 
            path: '/dashboard/observations',
            count: dataCounts.observations
          },
          { 
            id: 'analytics', 
            label: t('common.analytics', 'Analíticas'), 
            icon: BarChart3, 
            path: '/dashboard/analytics',
            count: dataCounts.completed
          },
          { id: 'notifications', label: t('common.notifications', 'Notificaciones'), icon: Bell, path: '/dashboard/notifications' },
          { id: 'settings', label: t('common.settings', 'Configuración'), icon: Settings, path: '/dashboard/settings' }
        ];
      case 'parent':
        return [
          { id: 'overview', label: t('common.overview', 'Resumen'), icon: Home, path: '/dashboard' },
          { 
            id: 'children', 
            label: t('parentDashboard.children', 'Mis Hijos'), 
            icon: Users, 
            path: '/dashboard/children',
            count: dataCounts.children
          },
          { 
            id: 'progress', 
            label: t('parentDashboard.progress', 'Progreso Familiar'), 
            icon: BarChart3, 
            path: '/dashboard/family-progress'
          },
          { 
            id: 'communication', 
            label: t('parentDashboard.communication', 'Comunicación'), 
            icon: MessageSquare, 
            path: '/dashboard/communication',
            count: dataCounts.communications
          },
          { 
            id: 'appointments', 
            label: t('parentDashboard.appointments', 'Citas'), 
            icon: Calendar, 
            path: '/dashboard/appointments',
            count: dataCounts.appointments
          },
          { id: 'notifications', label: t('common.notifications', 'Notificaciones'), icon: Bell, path: '/dashboard/notifications' },
          { id: 'settings', label: t('common.settings', 'Configuración'), icon: Settings, path: '/dashboard/settings' }
        ];
      case 'psychopedagogue':
        return [
          { id: 'overview', label: t('common.overview', 'Resumen'), icon: Home, path: '/dashboard' },
          { 
            id: 'students', 
            label: t('common.students', 'Estudiantes'), 
            icon: Users, 
            path: '/dashboard/students',
            count: dataCounts.students
          },
          { 
            id: 'cases', 
            label: t('psychopedagogueDashboard.cases', 'Casos'), 
            icon: BookOpen, 
            path: '/dashboard/cases',
            count: dataCounts.cases
          },
          { 
            id: 'support-plans', 
            label: t('psychopedagogueDashboard.supportPlans', 'Planes de Apoyo'), 
            icon: ShieldCheck, 
            path: '/dashboard/support-plans',
            count: dataCounts.supportPlans
          },
          { 
            id: 'evaluations', 
            label: t('psychopedagogueDashboard.evaluations', 'Evaluaciones'), 
            icon: FileText, 
            path: '/dashboard/evaluations',
            count: dataCounts.evaluations
          },
          { id: 'analytics', label: t('common.analytics', 'Analíticas'), icon: BarChart3, path: '/dashboard/analytics' },
          { id: 'notifications', label: t('common.notifications', 'Notificaciones'), icon: Bell, path: '/dashboard/notifications' },
          { id: 'settings', label: t('common.settings', 'Configuración'), icon: Settings, path: '/dashboard/settings' }
        ];
      case 'directive':
        return [
          { id: 'overview', label: t('common.overview', 'Resumen'), icon: Home, path: '/dashboard' },
          { 
            id: 'institution', 
            label: t('directiveDashboard.institution', 'Institución'), 
            icon: Users, 
            path: '/dashboard/institution'
          },
          { 
            id: 'user-management', 
            label: t('directiveDashboard.userManagement', 'Gestión de Usuarios'), 
            icon: Users2, 
            path: '/dashboard/user-management',
            count: dataCounts.users
          },
          { 
            id: 'reports', 
            label: t('directiveDashboard.reports', 'Reportes'), 
            icon: BarChart3, 
            path: '/dashboard/reports',
            count: dataCounts.reports
          },
          { 
            id: 'alerts', 
            label: t('directiveDashboard.alerts', 'Alertas'), 
            icon: Bell, 
            path: '/dashboard/alerts',
            count: dataCounts.alerts
          },
          { 
            id: 'strategic-summary', 
            label: t('directiveDashboard.strategicSummary', 'Resumen Estratégico'), 
            icon: Target, 
            path: '/dashboard/strategic-summary'
          },
          { id: 'notifications', label: t('common.notifications', 'Notificaciones'), icon: Bell, path: '/dashboard/notifications' },
          { id: 'settings', label: t('common.settings', 'Configuración'), icon: Settings, path: '/dashboard/settings' }
        ];
      default:
        return [
          { id: 'overview', label: t('common.overview', 'Resumen'), icon: Home, path: '/dashboard' },
          { id: 'notifications', label: t('common.notifications', 'Notificaciones'), icon: Bell, path: '/dashboard/notifications' },
          { id: 'settings', label: t('common.settings', 'Configuración'), icon: Settings, path: '/dashboard/settings' }
        ];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <nav className="flex-1 p-4">
      <ul className="space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.path);
          return (
            <li key={item.id}>
              <Button
                variant="ghost"
                className={`w-full justify-start transition-all duration-200 ${
                  isActive 
                    ? 'text-white bg-slate-700 border-l-2 border-blue-400' 
                    : 'text-slate-300 hover:text-white hover:bg-slate-700'
                }`}
                onClick={() => handleNavigation(item.path)}
              >
                <Icon size={18} className="mr-3" />
                <span className="flex-1 text-left">{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-blue-500 text-white text-xs">
                    {item.count}
                  </Badge>
                )}
                {isActive && <ChevronRight size={16} className="ml-2" />}
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default DashboardNavigation;
