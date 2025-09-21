import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { Shield, Users, Settings, BarChart, LogOut, FileText, SlidersHorizontal, Activity, UserCog, UserCheck as UserSearch, Brain } from 'lucide-react';
import DashboardCard from './components/DashboardCard';
import LoadingScreen from './components/LoadingScreen';
import { toast } from '@/components/ui/use-toast';
import edgeFunctionService from '@/services/edgeFunctionService';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const { user, userProfile, loading: authLoading, signOut } = useMockAuth();
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

  const fetchAdminData = useCallback(async () => {
    if (!userProfile || userProfile.role !== 'admin' || !user) {
      setLoadingDashboard(false);
      if (userProfile && userProfile.role !== 'admin') setError(t('common.accessDenied'));
      else if (!user) setError(t('common.authenticationError'));
      return;
    }
    setLoadingDashboard(true);
    setError(null);
    try {
      // Usar datos mock para el dashboard de administrador
      const mockAdminData = {
        totalUsers: 200,
        activeUsers: 185,
        totalStudents: 150,
        totalTeachers: 25,
        totalPsychopedagogues: 8,
        totalParents: 120,
        systemHealth: {
          uptime: '99.9%',
          performance: 'Excellent',
          security: 'Secure'
        },
        recentActivity: [
          {
            id: 1,
            type: 'user_registration',
            description: 'Nuevo usuario registrado: Ana Rodríguez',
            timestamp: new Date().toISOString(),
            status: 'completed'
          },
          {
            id: 2,
            type: 'role_assignment',
            description: 'Rol asignado a docente en 5to Grado',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            status: 'completed'
          },
          {
            id: 3,
            type: 'system_update',
            description: 'Actualización del sistema completada',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 'completed'
          }
        ],
        alerts: [
          {
            id: 1,
            type: 'security',
            message: 'Intento de acceso no autorizado detectado',
            priority: 'high',
            timestamp: new Date().toISOString()
          },
          {
            id: 2,
            type: 'performance',
            message: 'Uso de CPU elevado en servidor principal',
            priority: 'medium',
            timestamp: new Date(Date.now() - 900000).toISOString()
          }
        ]
      };
      
      setDashboardData(mockAdminData);
      toast({
        title: t('toasts.success'),
        description: t('dashboards.adminDashboard.dataLoadedSuccess'),
        variant: 'success',
      });
    } catch (err) {
      console.error("Error fetching admin dashboard summary:", err);
      setError(err.message);
      toast({
        title: t('toasts.error'),
        description: err.message || t('dashboards.adminDashboard.dataLoadedError'),
        variant: 'destructive',
      });
    } finally {
      setLoadingDashboard(false);
    }
  }, [userProfile, user, t]);

  useEffect(() => {
    if (userProfile && userProfile.role && user) {
      fetchAdminData();
    } else if (userProfile && !userProfile.role) {
      setLoadingDashboard(false);
      setError(t('common.roleNotSetError'));
    } else if (!userProfile && user) {
      setLoadingDashboard(true);
    } else {
      setLoadingDashboard(true);
    }
  }, [userProfile, user, fetchAdminData, t]);

  const adminCards = [
    {
      id: 'userRoleManagement',
      titleKey: 'dashboards.adminDashboard.quickActions.manageUserRoles',
      descriptionKey: 'adminUserRolePage.pageSubtitle', 
      icon: Users,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/20',
      hoverBgColor: 'hover:bg-sky-500/30',
      link: '/dashboard/admin/user-role-management',
      count: dashboardData?.total_users
    },
    {
      id: 'studentProfiles',
      titleKey: 'studentProfilePage.pageTitle',
      descriptionKey: 'dashboards.adminDashboard.studentProfilesDesc',
      icon: UserSearch,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20',
      hoverBgColor: 'hover:bg-indigo-500/30',
      link: '/dashboard/progress-quick-access',
      count: dashboardData?.total_students
    },
    {
      id: 'systemSettings',
      titleKey: 'dashboards.adminDashboard.quickActions.systemSettings',
      descriptionKey: 'adminUserRolePage.systemSettingsDescription',
      icon: SlidersHorizontal,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      hoverBgColor: 'hover:bg-emerald-500/30',
      link: '/dashboard/admin/system-settings'
    },
    {
      id: 'adminAccountSettings',
      titleKey: 'adminUserRolePage.accountSettingsTitle',
      descriptionKey: 'adminUserRolePage.accountSettingsDescription',
      icon: UserCog,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      hoverBgColor: 'hover:bg-orange-500/30',
      link: '/dashboard/admin/account-settings'
    },
    {
      id: 'viewLogs',
      titleKey: 'dashboards.adminDashboard.quickActions.viewLogs',
      descriptionKey: 'adminUserRolePage.viewLogsDescription',
      icon: FileText,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      hoverBgColor: 'hover:bg-purple-500/30',
      link: '/dashboard/admin/notification-audit',
      count: dashboardData?.total_notifications
    },
     {
      id: 'platformAnalytics',
      titleKey: 'adminUserRolePage.platformAnalyticsTitle',
      descriptionKey: 'adminUserRolePage.platformAnalyticsDescription',
      icon: BarChart,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/20',
      hoverBgColor: 'hover:bg-rose-500/30',
      link: '#' 
    },
    {
      id: 'contentManagement',
      titleKey: 'adminUserRolePage.contentManagementTitle',
      descriptionKey: 'adminUserRolePage.contentManagementDescription',
      icon: Settings,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      hoverBgColor: 'hover:bg-yellow-500/30',
      link: '#' 
    },
    {
      id: 'systemStatus',
      titleKey: 'adminUserRolePage.systemStatusTitle',
      descriptionKey: 'adminUserRolePage.systemStatusDescription',
      icon: Activity,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20',
      hoverBgColor: 'hover:bg-indigo-500/30',
      link: '#' 
    }
  ];

  if (authLoading || (loadingDashboard && !dashboardData && !error)) {
    return <LoadingScreen text={t('common.loadingText')} />;
  }

  if (error && !dashboardData) {
    return (
      <div className="p-4 sm:p-6 text-center flex flex-col items-center justify-center h-full">
        <Brain size={48} className="mx-auto mb-4 text-red-400" />
        <h1 className="text-2xl font-bold text-red-300">{t('common.errorTitle')}</h1>
        <p className="text-slate-400 max-w-md">{error}</p>
        <button onClick={fetchAdminData} className="mt-6 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md">
          {t('common.retryButton')}
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 sm:space-y-8 p-3 sm:p-4 md:p-6"
    >
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-purple-300 to-pink-300 leading-tight px-2">
          {t('dashboards.adminDashboard.pageTitle')}
        </h1>
        <p className="text-base sm:text-lg text-slate-300 mt-2 max-w-2xl mx-auto leading-relaxed px-2">
          {t('dashboards.adminDashboard.welcomeMessage', '', { userName: userProfile?.full_name || user?.email })}
        </p>
      </div>

      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          visible: { transition: { staggerChildren: 0.07 } }
        }}
      >
        {adminCards.map((card, index) => (
          <motion.div
            key={card.id}
            variants={{
              hidden: { opacity: 0, scale: 0.9, y: 20 },
              visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" }}
            }}
          >
            <Link to={card.link} className="block group h-full">
              <DashboardCard
                title={t(card.titleKey, { studentName: t('common.students') })}
                description={t(card.descriptionKey)}
                IconComponent={card.icon}
                iconColor={card.color}
                bgColor={card.bgColor}
                hoverBgColor={card.hoverBgColor}
                className="h-full"
              >
                {card.count !== undefined && (
                  <div className="text-4xl font-bold text-slate-100 mt-auto pt-2">
                    {card.count}
                  </div>
                )}
                <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-700/50">
                  <span className="text-sm text-slate-400">{t('common.accessNowButton')}</span>
                  <Shield className={`h-5 w-5 ${card.color} group-hover:translate-x-1 transition-transform`} />
                </div>
              </DashboardCard>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default AdminDashboard;