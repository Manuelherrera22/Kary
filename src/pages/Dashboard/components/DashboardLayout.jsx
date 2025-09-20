import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  Home, 
  Users, 
  BookOpen, 
  BarChart3, 
  Settings, 
  Bell,
  User,
  LogOut,
  ChevronRight,
  MessageSquare,
  ShieldCheck,
  Eye,
  Calendar,
  FileText,
  Users2,
  Target
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import useHybridAuth from '@/hooks/useHybridAuth';
import DashboardNavigation from '@/components/DashboardNavigation';

const DashboardLayout = ({ children, user, userProfile, onLogout }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Usar autenticación híbrida (Supabase + Mock)
  const { 
    user: hybridUser, 
    userProfile: hybridUserProfile, 
    loading: hybridLoading,
    handleLogout: hybridHandleLogout,
    isSupabaseAvailable,
    isMockAuth
  } = useHybridAuth();

  // Usar datos híbridos si están disponibles, sino usar los props
  const currentUser = hybridUser || user;
  const currentUserProfile = hybridUserProfile || userProfile;
  const currentOnLogout = hybridHandleLogout || onLogout;
  
  // Datos mock para el dashboard (funciona tanto con Supabase como con Mock)
  const mockDashboardData = {
    totalActivities: 12,
    completedActivities: 8,
    activeSupportPlans: 2,
    unreadNotifications: 3,
    totalStudents: 25,
    pendingObservations: 5,
    totalChildren: 2,
    unreadCommunications: 1,
    upcomingAppointments: 1,
    activeCases: 3,
    pendingEvaluations: 2,
    totalUsers: 150,
    activeAlerts: 4,
    generatedReports: 12
  };
  
  const currentDashboardData = mockDashboardData;

  // Obtener el rol del usuario para mostrar navegación específica
  const userRole = currentUserProfile?.role || currentUser?.role || 'student';

  // Navegación específica por rol con funciones reales
  const getNavigationItems = () => {
    const baseItems = [
      { id: 'overview', label: t('common.overview', 'Resumen'), icon: Home, path: '/dashboard' },
      { id: 'notifications', label: t('common.notifications', 'Notificaciones'), icon: Bell, path: '/dashboard/notifications' },
      { id: 'settings', label: t('common.settings', 'Configuración'), icon: Settings, path: '/dashboard/settings' }
    ];

    // Agregar elementos específicos según el rol con funciones reales
    switch (userRole) {
      case 'student':
        return [
          { id: 'overview', label: t('common.overview', 'Resumen'), icon: Home, path: '/dashboard' },
          { id: 'activities', label: t('common.activities', 'Mis Actividades'), icon: BookOpen, path: '/dashboard/activities' },
          { id: 'progress', label: t('studentDashboard.progress', 'Mi Progreso'), icon: BarChart3, path: '/dashboard/progress' },
          { id: 'kary-chat', label: t('studentDashboard.karyChat', 'Chatea con Kary'), icon: MessageSquare, path: '/dashboard/kary-chat' },
          { id: 'support-plans', label: t('studentDashboard.supportPlans', 'Planes de Apoyo'), icon: ShieldCheck, path: '/dashboard/support-plans' },
          { id: 'notifications', label: t('common.notifications', 'Notificaciones'), icon: Bell, path: '/dashboard/notifications' },
          { id: 'settings', label: t('common.settings', 'Configuración'), icon: Settings, path: '/dashboard/settings' }
        ];
      case 'teacher':
        return [
          { id: 'overview', label: t('common.overview', 'Resumen'), icon: Home, path: '/dashboard' },
          { id: 'students', label: t('common.students', 'Mis Estudiantes'), icon: Users, path: '/dashboard/students' },
          { id: 'activities', label: t('common.activities', 'Actividades'), icon: BookOpen, path: '/dashboard/activities' },
          { id: 'observations', label: t('teacherDashboard.observations', 'Observaciones'), icon: Eye, path: '/dashboard/observations' },
          { id: 'analytics', label: t('common.analytics', 'Analíticas'), icon: BarChart3, path: '/dashboard/analytics' },
          { id: 'notifications', label: t('common.notifications', 'Notificaciones'), icon: Bell, path: '/dashboard/notifications' },
          { id: 'settings', label: t('common.settings', 'Configuración'), icon: Settings, path: '/dashboard/settings' }
        ];
      case 'parent':
        return [
          { id: 'overview', label: t('common.overview', 'Resumen'), icon: Home, path: '/dashboard' },
          { id: 'children', label: t('parentDashboard.children', 'Mis Hijos'), icon: Users, path: '/dashboard/children' },
          { id: 'progress', label: t('parentDashboard.progress', 'Progreso Familiar'), icon: BarChart3, path: '/dashboard/family-progress' },
          { id: 'communication', label: t('parentDashboard.communication', 'Comunicación'), icon: MessageSquare, path: '/dashboard/communication' },
          { id: 'appointments', label: t('parentDashboard.appointments', 'Citas'), icon: Calendar, path: '/dashboard/appointments' },
          { id: 'notifications', label: t('common.notifications', 'Notificaciones'), icon: Bell, path: '/dashboard/notifications' },
          { id: 'settings', label: t('common.settings', 'Configuración'), icon: Settings, path: '/dashboard/settings' }
        ];
      case 'psychopedagogue':
        return [
          { id: 'overview', label: t('common.overview', 'Resumen'), icon: Home, path: '/dashboard' },
          { id: 'students', label: t('common.students', 'Estudiantes'), icon: Users, path: '/dashboard/students' },
          { id: 'cases', label: t('psychopedagogueDashboard.cases', 'Casos'), icon: BookOpen, path: '/dashboard/cases' },
          { id: 'support-plans', label: t('psychopedagogueDashboard.supportPlans', 'Planes de Apoyo'), icon: ShieldCheck, path: '/dashboard/support-plans' },
          { id: 'evaluations', label: t('psychopedagogueDashboard.evaluations', 'Evaluaciones'), icon: FileText, path: '/dashboard/evaluations' },
          { id: 'analytics', label: t('common.analytics', 'Analíticas'), icon: BarChart3, path: '/dashboard/analytics' },
          { id: 'notifications', label: t('common.notifications', 'Notificaciones'), icon: Bell, path: '/dashboard/notifications' },
          { id: 'settings', label: t('common.settings', 'Configuración'), icon: Settings, path: '/dashboard/settings' }
        ];
      case 'directive':
        return [
          { id: 'overview', label: t('common.overview', 'Resumen'), icon: Home, path: '/dashboard' },
          { id: 'institution', label: t('directiveDashboard.institution', 'Institución'), icon: Users, path: '/dashboard/institution' },
          { id: 'user-management', label: t('directiveDashboard.userManagement', 'Gestión de Usuarios'), icon: Users2, path: '/dashboard/user-management' },
          { id: 'reports', label: t('directiveDashboard.reports', 'Reportes'), icon: BarChart3, path: '/dashboard/reports' },
          { id: 'alerts', label: t('directiveDashboard.alerts', 'Alertas'), icon: Bell, path: '/dashboard/alerts' },
          { id: 'strategic-summary', label: t('directiveDashboard.strategicSummary', 'Resumen Estratégico'), icon: Target, path: '/dashboard/strategic-summary' },
          { id: 'notifications', label: t('common.notifications', 'Notificaciones'), icon: Bell, path: '/dashboard/notifications' },
          { id: 'settings', label: t('common.settings', 'Configuración'), icon: Settings, path: '/dashboard/settings' }
        ];
      default:
        return baseItems;
    }
  };

  const navigationItems = getNavigationItems();

  const handleLogout = async () => {
    try {
      if (currentOnLogout) {
        await currentOnLogout();
      }
      setIsMobileMenuOpen(false);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      {/* Mobile Header */}
      <header className="lg:hidden bg-slate-800 border-b border-slate-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-slate-800 border-slate-700">
                {/* Hidden title and description for accessibility */}
                <SheetTitle className="sr-only">
                  {t('common.dashboard', 'Panel de Control')} - {t('common.navigation', 'Navegación')}
                </SheetTitle>
                <SheetDescription className="sr-only">
                  {t('common.navigationDescription', 'Menú de navegación principal del dashboard')}
                </SheetDescription>
                
                <div className="flex flex-col h-full">
                  {/* User Info */}
                  <div className="p-4 border-b border-slate-700">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <User size={20} className="text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{currentUserProfile?.full_name || currentUser?.full_name || 'Usuario'}</h3>
                        <p className="text-sm text-slate-400 capitalize">{currentUserProfile?.role || currentUser?.role || 'usuario'}</p>
                        {isSupabaseAvailable && (
                          <p className="text-xs text-green-400 mt-1">🔗 Supabase</p>
                        )}
                        {isMockAuth && (
                          <p className="text-xs text-yellow-400 mt-1">🔧 Mock Auth</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <DashboardNavigation
                    userRole={userRole}
                    dashboardData={currentDashboardData}
                    onNavigate={handleNavigation}
                    onClose={() => setIsMobileMenuOpen(false)}
                  />

                  {/* Logout */}
                  <div className="p-4 border-t border-slate-700">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={handleLogout}
                    >
                      <LogOut size={18} className="mr-3" />
                      {t('common.logout', 'Cerrar Sesión')}
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <h1 className="text-lg font-semibold text-white">
              {t('common.dashboard', 'Panel de Control')}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white">
              <Bell size={18} />
            </Button>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full h-full">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
