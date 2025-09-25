import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { 
  Home, 
  BookOpen, 
  BarChart3, 
  MessageSquare, 
  ShieldCheck, 
  Bell, 
  Settings,
  Calendar,
  FileText,
  TrendingUp,
  HeartHandshake,
  Gem,
  Tally5,
  ChevronLeft,
  ChevronRight,
  User,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import StudentSidebarHeader from './StudentSidebarHeader';
import StudentSidebarStats from './StudentSidebarStats';
import StudentQuickNotifications from './StudentQuickNotifications';

const StudentSidebar = () => {
  const { t } = useLanguage();
  const { userProfile, handleLogout } = useMockAuth();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Organización del menú en secciones lógicas
  const menuSections = [
    {
      title: t('studentSidebar.sections.main', 'Principal'),
      items: [
        {
          id: 'dashboard',
          label: t('studentSidebar.dashboard', 'Dashboard'),
          icon: Home,
          path: '/dashboard',
          description: t('studentSidebar.dashboardDesc', 'Tu espacio principal')
        }
      ]
    },
    {
      title: t('studentSidebar.sections.learning', 'Aprendizaje'),
      items: [
        {
          id: 'my-tasks',
          label: t('studentSidebar.myTasks', 'Mis Tareas'),
          icon: Tally5,
          path: '/dashboard/my-tasks',
          description: t('studentSidebar.myTasksDesc', 'Tareas asignadas'),
          badge: '3' // Ejemplo de badge con número de tareas pendientes
        },
        {
          id: 'assigned-resources',
          label: t('studentSidebar.assignedResources', 'Recursos Asignados'),
          icon: BookOpen,
          path: '/dashboard/assigned-resources',
          description: t('studentSidebar.assignedResourcesDesc', 'Material de estudio')
        },
        {
          id: 'learning-resources',
          label: t('studentSidebar.learningResources', 'Recursos de Aprendizaje'),
          icon: FileText,
          path: '/dashboard/learning-resources',
          description: t('studentSidebar.learningResourcesDesc', 'Biblioteca de recursos')
        }
      ]
    },
    {
      title: t('studentSidebar.sections.progress', 'Progreso'),
      items: [
        {
          id: 'personal-tracking',
          label: t('studentSidebar.personalTracking', 'Mi Seguimiento'),
          icon: Gem,
          path: '/dashboard/personal-tracking',
          description: t('studentSidebar.personalTrackingDesc', 'Registro personal')
        },
        {
          id: 'student-tracking-data',
          label: t('studentSidebar.trackingData', 'Datos de Seguimiento'),
          icon: TrendingUp,
          path: '/dashboard/student-tracking-data',
          description: t('studentSidebar.trackingDataDesc', 'Análisis de progreso')
        },
        {
          id: 'student-reports',
          label: t('studentSidebar.reports', 'Mis Reportes'),
          icon: BarChart3,
          path: '/dashboard/student-reports',
          description: t('studentSidebar.reportsDesc', 'Reportes de rendimiento')
        }
      ]
    },
    {
      title: t('studentSidebar.sections.support', 'Apoyo'),
      items: [
        {
          id: 'support-plans',
          label: t('studentSidebar.supportPlans', 'Planes de Apoyo'),
          icon: ShieldCheck,
          path: '/dashboard/student-support-plans',
          description: t('studentSidebar.supportPlansDesc', 'Planes personalizados')
        },
        {
          id: 'emotional-attendance',
          label: t('studentSidebar.emotionalAttendance', 'Asistencia Emocional'),
          icon: HeartHandshake,
          path: '/dashboard/emotional-attendance',
          description: t('studentSidebar.emotionalAttendanceDesc', 'Bienestar emocional')
        }
      ]
    },
    {
      title: t('studentSidebar.sections.communication', 'Comunicación'),
      items: [
        {
          id: 'kary-chat',
          label: t('studentSidebar.karyChat', 'Chat con Kary'),
          icon: MessageSquare,
          path: '/dashboard/kary-chat',
          description: t('studentSidebar.karyChatDesc', 'Tu asistente IA'),
          badge: 'online' // Indicador de estado
        },
        {
          id: 'notifications',
          label: t('studentSidebar.notifications', 'Notificaciones'),
          icon: Bell,
          path: '/dashboard/notifications',
          description: t('studentSidebar.notificationsDesc', 'Mensajes importantes'),
          badge: '2' // Ejemplo de notificaciones pendientes
        }
      ]
    },
    {
      title: t('studentSidebar.sections.settings', 'Configuración'),
      items: [
        {
          id: 'settings',
          label: t('studentSidebar.settings', 'Configuración'),
          icon: Settings,
          path: '/dashboard/settings',
          description: t('studentSidebar.settingsDesc', 'Preferencias personales')
        }
      ]
    }
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const SidebarContent = () => (
    <div className={`h-full flex flex-col bg-slate-800/95 backdrop-blur-sm border-r border-slate-700/50 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <StudentSidebarHeader 
        isCollapsed={isCollapsed} 
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)} 
      />

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        {menuSections.map((section, sectionIndex) => (
          <div key={section.title} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {section.title}
              </h3>
            )}
            <div className="space-y-1">
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const active = isActive(item.path);
                
                return (
                  <Link
                    key={item.id}
                    to={item.path}
                    className={`flex items-center px-4 py-3 mx-2 rounded-lg transition-all duration-200 group ${
                      active
                        ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/20 text-white border border-purple-500/30'
                        : 'text-slate-300 hover:text-white hover:bg-slate-700/50'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-5 h-5 ${
                      active ? 'text-purple-400' : 'text-slate-400 group-hover:text-slate-300'
                    }`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    {!isCollapsed && (
                      <>
                        <div className="ml-3 flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium truncate">
                              {item.label}
                            </p>
                            {item.badge && (
                              <Badge 
                                variant={item.badge === 'online' ? 'default' : 'secondary'}
                                className={`ml-2 text-xs ${
                                  item.badge === 'online' 
                                    ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                                }`}
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 truncate">
                            {item.description}
                          </p>
                        </div>
                      </>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Notificaciones Rápidas */}
      <StudentQuickNotifications isCollapsed={isCollapsed} />

      {/* Estadísticas */}
      <StudentSidebarStats isCollapsed={isCollapsed} />

      {/* Footer */}
      <div className="p-4 border-t border-slate-700/50">
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={`w-full justify-start text-slate-400 hover:text-white hover:bg-slate-700/50 ${
            isCollapsed ? 'px-2' : 'px-4'
          }`}
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span className="ml-3">Cerrar Sesión</span>}
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsMobileOpen(true)}
          className="bg-slate-800/90 border-slate-600 text-white hover:bg-slate-700"
        >
          <Menu className="w-4 h-4" />
        </Button>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block fixed left-0 top-0 h-full z-40">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-50"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-full w-64 z-50"
            >
              <div className="relative h-full">
                <SidebarContent />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMobileOpen(false)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default StudentSidebar;
