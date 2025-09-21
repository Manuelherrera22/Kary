import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { BarChartBig, CalendarClock, MessageSquare as MessageSquareText, FileText, Settings, ChevronRight, Smile, History as HistoryIcon, Users2, UserCircle, Bell, BarChart3, BookOpen, AlertTriangle, CheckCircle, UserPlus } from 'lucide-react';
import DashboardCard from './components/DashboardCard';
import LoadingScreen from './components/LoadingScreen';
import { Button } from '@/components/ui/button';
import UnifiedStudentProgressView from './ParentDashboard/components/UnifiedStudentProgressView';
import ParentCommunicationPanel from './ParentDashboard/components/ParentCommunicationPanel';
import ParentNotificationsPanel from './ParentDashboard/components/ParentNotificationsPanel';
import FamilyMetricsDashboard from './ParentDashboard/components/FamilyMetricsDashboard';
import IntelligentParentAlerts from './ParentDashboard/components/IntelligentParentAlerts';
import FamilyCalendar from './ParentDashboard/components/FamilyCalendar';
import ParentResourcesPanel from './ParentDashboard/components/ParentResourcesPanel';
import FamilyGamification from './ParentDashboard/components/FamilyGamification';
import StudentLinkModal from './ParentDashboard/components/StudentLinkModal';
import UniversalGeminiChat from '@/components/UniversalGeminiChat';
import UserHeader from '@/components/UserHeader';
import parentStudentSyncService from '@/services/parentStudentSyncService';

// Estilos personalizados para el scrollbar
const customStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;

const ParentDashboard = () => {
  const { t } = useLanguage();
  const { user, userProfile, loading: authLoading, primaryChildId, associatedStudentIds } = useMockAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [syncData, setSyncData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [showGeminiChat, setShowGeminiChat] = useState(false);
  const [geminiChatMinimized, setGeminiChatMinimized] = useState(false);

  const parentDashboardCards = [
    {
      id: 'childProfile',
      titleKey: 'studentProfilePage.pageTitle',
      descriptionKey: 'parentDashboard.childProfile.description',
      icon: UserCircle,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20',
      hoverBgColor: 'hover:bg-indigo-500/30',
      link: primaryChildId ? `/dashboard/student/${primaryChildId}/profile` : null,
      requiresChild: true,
    },
    {
      id: 'childInteractions',
      titleKey: 'parentDashboard.childInteractions.title',
      descriptionKey: 'parentDashboard.childInteractions.description',
      icon: MessageSquareText,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/20',
      hoverBgColor: 'hover:bg-sky-500/30',
      link: '/dashboard/child-interactions',
      requiresChild: true,
    },
    {
      id: 'accessReports',
      titleKey: 'parentDashboard.accessReports.title',
      descriptionKey: 'parentDashboard.accessReports.description',
      icon: FileText,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      hoverBgColor: 'hover:bg-emerald-500/30',
      link: '/dashboard/access-reports',
      requiresChild: true,
    },
    {
      id: 'directCommunication',
      titleKey: 'parentDashboard.directCommunication.title',
      descriptionKey: 'parentDashboard.directCommunication.description',
      icon: Users2,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      hoverBgColor: 'hover:bg-purple-500/30',
      link: '/dashboard/direct-communication',
      requiresChild: false, 
    },
    {
      id: 'studentProgress',
      titleKey: 'parentDashboard.studentProgress.title',
      descriptionKey: 'parentDashboard.studentProgress.description',
      icon: BarChartBig,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/20',
      hoverBgColor: 'hover:bg-rose-500/30',
      link: '/dashboard/student-progress',
      requiresChild: true,
    },
    {
      id: 'scheduleAppointment',
      titleKey: 'parentDashboard.scheduleAppointment.title',
      descriptionKey: 'parentDashboard.scheduleAppointment.description',
      icon: CalendarClock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      hoverBgColor: 'hover:bg-yellow-500/30',
      link: '/dashboard/schedule-appointment',
      requiresChild: false,
    },
    {
      id: 'appointmentHistory',
      titleKey: 'parentDashboard.appointmentHistory.title',
      descriptionKey: 'parentDashboard.appointmentHistory.description',
      icon: HistoryIcon,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      hoverBgColor: 'hover:bg-blue-500/30',
      link: '/dashboard/appointment-history',
      requiresChild: false,
    },
     {
      id: 'parentUnified',
      titleKey: 'parentDashboard.unifiedProgress.pageTitle',
      descriptionKey: 'parentDashboard.unifiedProgress.pageSubtitle',
      icon: Smile,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      hoverBgColor: 'hover:bg-pink-500/30',
      link: '/dashboard/progress-quick-access', 
      requiresChild: true, 
    },
    {
      id: 'parentSettings',
      titleKey: 'parentDashboard.accountSettings.title',
      descriptionKey: 'parentDashboard.accountSettings.description',
      icon: Settings,
      color: 'text-slate-400',
      bgColor: 'bg-slate-500/20',
      hoverBgColor: 'hover:bg-slate-500/30',
      link: '/dashboard/parent-settings',
      requiresChild: false,
    },
    {
      id: 'notifications',
      titleKey: 'parentDashboard.notifications.title',
      descriptionKey: 'parentDashboard.notifications.description',
      icon: Bell,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      hoverBgColor: 'hover:bg-purple-500/30',
      link: null,
      requiresChild: false,
      isSpecial: true,
      specialType: 'notifications'
    },
    {
      id: 'familyMetrics',
      titleKey: 'parentDashboard.familyMetrics.title',
      descriptionKey: 'parentDashboard.familyMetrics.description',
      icon: BarChart3,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      hoverBgColor: 'hover:bg-green-500/30',
      link: null,
      requiresChild: false,
      isSpecial: true,
      specialType: 'metrics'
    },
    {
      id: 'intelligentAlerts',
      titleKey: 'parentDashboard.intelligentAlerts.title',
      descriptionKey: 'parentDashboard.intelligentAlerts.description',
      icon: Bell,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      hoverBgColor: 'hover:bg-orange-500/30',
      link: null,
      requiresChild: false,
      isSpecial: true,
      specialType: 'alerts'
    },
    {
      id: 'familyCalendar',
      titleKey: 'parentDashboard.familyCalendar.title',
      descriptionKey: 'parentDashboard.familyCalendar.description',
      icon: CalendarClock,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      hoverBgColor: 'hover:bg-blue-500/30',
      link: null,
      requiresChild: false,
      isSpecial: true,
      specialType: 'calendar'
    },
    {
      id: 'parentResources',
      titleKey: 'parentDashboard.parentResources.title',
      descriptionKey: 'parentDashboard.parentResources.description',
      icon: BookOpen,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      hoverBgColor: 'hover:bg-purple-500/30',
      link: null,
      requiresChild: false,
      isSpecial: true,
      specialType: 'resources'
    },
    {
      id: 'familyGamification',
      titleKey: 'parentDashboard.familyGamification.title',
      descriptionKey: 'parentDashboard.familyGamification.description',
      icon: Smile,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      hoverBgColor: 'hover:bg-yellow-500/30',
      link: null,
      requiresChild: false,
      isSpecial: true,
      specialType: 'gamification'
    },
  ];

  if (authLoading) {
    return <LoadingScreen text={t('common.loadingText')} />;
  }
  
  const hasLinkedStudents = primaryChildId || (associatedStudentIds && associatedStudentIds.length > 0);

  // Sincronizar datos cuando hay estudiantes vinculados
  useEffect(() => {
    if (hasLinkedStudents && primaryChildId) {
      syncStudentData();
    }
  }, [hasLinkedStudents, primaryChildId]);

  const syncStudentData = async () => {
    if (!primaryChildId) return;
    
    setLoading(true);
    try {
      const result = await parentStudentSyncService.syncParentWithStudent('parent-1', primaryChildId);
      if (result.success) {
        setSyncData(result.data);
      }
    } catch (error) {
      console.error('Error syncing student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCardData = (card, syncData) => {
    if (!syncData || !hasLinkedStudents) {
      return {
        description: t(card.descriptionKey),
        specialValue: card.specialValue,
        specialColor: card.specialColor,
        progress: null,
        status: 'disabled',
        metrics: null
      };
    }

    const student = syncData.student;
    const progress = syncData.progress;
    const activities = syncData.activities;
    const alerts = syncData.alerts;
    const metrics = syncData.metrics;

    switch (card.id) {
      case 'childProfile':
        return {
          description: `${t(card.descriptionKey)} - ${student?.name || 'N/A'}`,
          specialValue: student?.status || 'N/A',
          specialColor: 'text-green-400',
          progress: null,
          status: 'active',
          metrics: { grade: student?.grade, school: student?.school }
        };

      case 'childInteractions':
        return {
          description: `${t(card.descriptionKey)} - ${activities?.length || 0} actividades recientes`,
          specialValue: `${activities?.filter(a => a.status === 'completed').length || 0}/${activities?.length || 0}`,
          specialColor: 'text-blue-400',
          progress: progress?.overall || 0,
          status: 'active',
          metrics: { completed: activities?.filter(a => a.status === 'completed').length || 0, total: activities?.length || 0 }
        };

      case 'reports':
        return {
          description: `${t(card.descriptionKey)} - Progreso: ${progress?.overall || 0}%`,
          specialValue: `${progress?.academic || 0}% académico`,
          specialColor: 'text-purple-400',
          progress: progress?.academic || 0,
          status: 'active',
          metrics: { academic: progress?.academic, emotional: progress?.emotional }
        };

      case 'directCommunication':
        return {
          description: t(card.descriptionKey),
          specialValue: 'Disponible',
          specialColor: 'text-green-400',
          progress: null,
          status: 'active',
          metrics: null
        };

      case 'studentProgress':
        return {
          description: `${t(card.descriptionKey)} - ${progress?.overall || 0}% general`,
          specialValue: `${progress?.weeklyStreak || 0} días de racha`,
          specialColor: 'text-orange-400',
          progress: progress?.overall || 0,
          status: 'active',
          metrics: { overall: progress?.overall, streak: progress?.weeklyStreak }
        };

      case 'scheduleAppointment':
        return {
          description: t(card.descriptionKey),
          specialValue: 'Disponible',
          specialColor: 'text-green-400',
          progress: null,
          status: 'active',
          metrics: null
        };

      case 'appointmentHistory':
        return {
          description: t(card.descriptionKey),
          specialValue: '0 citas',
          specialColor: 'text-blue-400',
          progress: null,
          status: 'active',
          metrics: null
        };

      case 'unifiedTracking':
        return {
          description: `${t(card.descriptionKey)} - Vista completa del progreso`,
          specialValue: 'Activo',
          specialColor: 'text-purple-400',
          progress: progress?.overall || 0,
          status: 'active',
          metrics: { overall: progress?.overall, activities: activities?.length }
        };

      case 'accountSettings':
        return {
          description: t(card.descriptionKey),
          specialValue: 'Disponible',
          specialColor: 'text-green-400',
          progress: null,
          status: 'active',
          metrics: null
        };

      case 'notifications':
        return {
          description: `${t(card.descriptionKey)} - ${syncData?.notifications?.length || 0} notificaciones`,
          specialValue: `${syncData?.notifications?.filter(n => !n.read).length || 0} sin leer`,
          specialColor: 'text-red-400',
          progress: null,
          status: 'active',
          metrics: { total: syncData?.notifications?.length || 0, unread: syncData?.notifications?.filter(n => !n.read).length || 0 }
        };

      case 'familyMetrics':
        return {
          description: `${t(card.descriptionKey)} - Compromiso: ${metrics?.familyEngagement || 0}%`,
          specialValue: `${metrics?.completedActivities || 0} actividades`,
          specialColor: 'text-cyan-400',
          progress: metrics?.familyEngagement || 0,
          status: 'active',
          metrics: { engagement: metrics?.familyEngagement, activities: metrics?.completedActivities }
        };

      case 'intelligentAlerts':
        return {
          description: `${t(card.descriptionKey)} - ${alerts?.length || 0} alertas activas`,
          specialValue: `${alerts?.filter(a => a.priority === 'urgent').length || 0} urgentes`,
          specialColor: alerts?.filter(a => a.priority === 'urgent').length > 0 ? 'text-red-400' : 'text-yellow-400',
          progress: null,
          status: 'active',
          metrics: { total: alerts?.length || 0, urgent: alerts?.filter(a => a.priority === 'urgent').length || 0 }
        };

      case 'familyCalendar':
        return {
          description: t(card.descriptionKey),
          specialValue: 'Disponible',
          specialColor: 'text-green-400',
          progress: null,
          status: 'active',
          metrics: null
        };

      case 'educationalResources':
        return {
          description: t(card.descriptionKey),
          specialValue: 'Disponible',
          specialColor: 'text-green-400',
          progress: null,
          status: 'active',
          metrics: null
        };

      case 'familyGamification':
        return {
          description: `${t(card.descriptionKey)} - Puntos: ${metrics?.weeklyStreak * 10 || 0}`,
          specialValue: `${metrics?.weeklyStreak || 0} días de racha`,
          specialColor: 'text-pink-400',
          progress: Math.min((metrics?.weeklyStreak || 0) * 10, 100),
          status: 'active',
          metrics: { points: (metrics?.weeklyStreak || 0) * 10, streak: metrics?.weeklyStreak || 0 }
        };

      default:
        return {
          description: t(card.descriptionKey),
          specialValue: card.specialValue,
          specialColor: card.specialColor,
          progress: null,
          status: 'active',
          metrics: null
        };
    }
  };

  const handleSpecialCardClick = (card) => {
    if (card.specialType === 'notifications') {
      setActiveTab('notifications');
    } else if (card.specialType === 'metrics') {
      setActiveTab('metrics');
    } else if (card.specialType === 'communication') {
      setActiveTab('communication');
    } else if (card.specialType === 'alerts') {
      setActiveTab('alerts');
    } else if (card.specialType === 'calendar') {
      setActiveTab('calendar');
    } else if (card.specialType === 'resources') {
      setActiveTab('resources');
    } else if (card.specialType === 'gamification') {
      setActiveTab('gamification');
    } else if (card.specialType === 'progress' && primaryChildId) {
      setSelectedStudent(primaryChildId);
    } else if (card.specialType === 'linkStudent') {
      setIsLinkModalOpen(true);
    }
  };

  const handleLinkSuccess = (linkData) => {
    console.log('Student linked successfully:', linkData);
    // Aquí podrías actualizar el estado del usuario o recargar los datos
    // Por ahora, solo cerramos el modal
    setIsLinkModalOpen(false);
  };

  return (
    <>
      <style>{customStyles}</style>
      {/* Header de Usuario */}
      <UserHeader position="top-right" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6 sm:space-y-8 p-3 sm:p-4 md:p-6"
      >
      {/* Hero Section Rediseñado */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative mb-12"
      >
        {/* Background con gradiente animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-pink-900/20 rounded-3xl blur-3xl"></div>
        
        <div className="relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl rounded-3xl border border-slate-700/50 p-4 sm:p-6 md:p-8 shadow-2xl">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6"
            >
              <div className="p-2 sm:p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg">
                <UserCircle size={24} className="sm:hidden text-white" />
                <UserCircle size={32} className="hidden sm:block text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-blue-300 leading-tight">
                  Panel de Acudiente
                </h1>
                <p className="text-slate-400 text-xs sm:text-sm">Kary Educational Platform</p>
              </div>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-base sm:text-lg md:text-xl text-slate-300 mb-6 sm:mb-8 max-w-2xl mx-auto leading-relaxed"
            >
              Bienvenido/a, <span className="text-purple-300 font-semibold">{userProfile?.full_name || user?.email}</span>
              <br />
              <span className="text-slate-400">Gestiona el progreso y bienestar de tu hijo/a</span>
            </motion.p>

            {/* Botón para Chat con Gemini */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex justify-center mb-6"
            >
              <Button
                onClick={() => setShowGeminiChat(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                💬 Hablar con Kary (Gemini AI)
              </Button>
            </motion.div>

            {/* Estado de Vinculación Mejorado */}
            {!hasLinkedStudents && !authLoading && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-red-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl shadow-lg">
                      <AlertTriangle size={20} className="sm:hidden text-white" />
                      <AlertTriangle size={24} className="hidden sm:block text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg sm:text-xl font-bold text-amber-300 mb-1">Vinculación Requerida</h3>
                      <p className="text-amber-200/80 text-sm sm:text-base">
                        Conecta tu cuenta con el perfil de tu hijo/a para acceder a todas las funcionalidades
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsLinkModalOpen(true)}
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 hover:from-purple-700 hover:via-pink-700 hover:to-purple-700 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-base"
                  >
                    <UserPlus size={16} className="sm:hidden mr-2" />
                    <UserPlus size={20} className="hidden sm:block mr-2" />
                    Vincular Estudiante
                  </Button>
                </div>
              </motion.div>
            )}

            {hasLinkedStudents && syncData && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="max-w-2xl mx-auto"
              >
                <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-500/30 rounded-2xl p-4 sm:p-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-4">
                    <div className="p-2 sm:p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow-lg">
                      <CheckCircle size={20} className="sm:hidden text-white" />
                      <CheckCircle size={24} className="hidden sm:block text-white" />
                    </div>
                    <div className="text-center">
                      <h3 className="text-lg sm:text-xl font-bold text-green-300 mb-1">Estudiante Vinculado</h3>
                      <p className="text-green-200/80 text-sm sm:text-base">
                        {syncData.student?.name} - Progreso General: {syncData.progress?.overall}%
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
                    <div className="bg-slate-700/30 rounded-lg p-2 sm:p-3">
                      <div className="text-lg sm:text-2xl font-bold text-blue-400">{syncData.progress?.academic || 0}%</div>
                      <div className="text-xs text-slate-400">Académico</div>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-2 sm:p-3">
                      <div className="text-lg sm:text-2xl font-bold text-pink-400">{syncData.progress?.emotional || 0}%</div>
                      <div className="text-xs text-slate-400">Emocional</div>
                    </div>
                    <div className="bg-slate-700/30 rounded-lg p-2 sm:p-3">
                      <div className="text-lg sm:text-2xl font-bold text-purple-400">{syncData.progress?.weeklyStreak || 0}</div>
                      <div className="text-xs text-slate-400">Días Racha</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs de navegación mejoradas */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="relative max-w-6xl mx-auto mb-8"
      >
        <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-2 shadow-xl">
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Resumen', shortLabel: 'Resumen', icon: BarChart3, color: 'from-blue-500 to-cyan-500' },
              { id: 'notifications', label: 'Notificaciones', shortLabel: 'Notif', icon: Bell, color: 'from-purple-500 to-pink-500', badge: syncData?.notifications?.filter(n => !n.read).length || 0 },
              { id: 'communication', label: 'Comunicación', shortLabel: 'Comun', icon: MessageSquareText, color: 'from-green-500 to-emerald-500' },
              { id: 'metrics', label: 'Métricas', shortLabel: 'Métricas', icon: BarChartBig, color: 'from-orange-500 to-red-500' },
              { id: 'alerts', label: 'Alertas IA', shortLabel: 'Alertas', icon: BookOpen, color: 'from-yellow-500 to-amber-500' },
              { id: 'calendar', label: 'Calendario', shortLabel: 'Cal', icon: CalendarClock, color: 'from-indigo-500 to-purple-500' },
              { id: 'resources', label: 'Recursos', shortLabel: 'Recursos', icon: FileText, color: 'from-teal-500 to-cyan-500' },
              { id: 'gamification', label: 'Gamificación', shortLabel: 'Gamif', icon: Smile, color: 'from-pink-500 to-rose-500' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`relative flex items-center gap-2 sm:gap-3 px-3 sm:px-4 md:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all duration-300 min-w-fit text-xs sm:text-sm ${
                  activeTab === tab.id
                    ? 'text-white shadow-lg'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
                }`}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className={`absolute inset-0 bg-gradient-to-r ${tab.color} rounded-xl shadow-lg`}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <div className="relative flex items-center gap-2 sm:gap-3">
                  <tab.icon size={16} className="sm:hidden" />
                  <tab.icon size={20} className="hidden sm:block" />
                  <span className="whitespace-nowrap hidden sm:inline">{tab.label}</span>
                  <span className="whitespace-nowrap sm:hidden">{tab.shortLabel}</span>
                  {tab.badge > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-red-500 text-white text-xs rounded-full px-1.5 sm:px-2 py-0.5 sm:py-1 min-w-[16px] sm:min-w-[20px] text-center font-bold shadow-lg"
                    >
                      {tab.badge}
                    </motion.span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Contenido basado en la pestaña activa */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8"
        >
          {parentDashboardCards.map((card, index) => {
            const cardData = getCardData(card, syncData);
            const isEnabled = hasLinkedStudents || !card.requiresChild;
            
            const cardContent = (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                  !isEnabled 
                    ? 'bg-slate-800/30 border-slate-700/30 opacity-60 cursor-not-allowed' 
                    : 'bg-gradient-to-br from-slate-800/80 to-slate-900/80 border-slate-700/50 hover:border-slate-600/50 hover:shadow-2xl hover:shadow-purple-500/10'
                }`}
              >
                {/* Background gradient effect */}
                {isEnabled && (
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
                
                <div className="relative p-6 h-full flex flex-col">
                  {/* Header con icono */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl shadow-lg ${
                      !isEnabled 
                        ? 'bg-slate-700/50' 
                        : 'bg-gradient-to-br from-purple-500/20 to-pink-500/20'
                    }`}>
                      <card.icon size={24} className={!isEnabled ? 'text-slate-500' : 'text-purple-300'} />
                    </div>
                    {isEnabled && (
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    )}
                  </div>

                  {/* Título */}
                  <h3 className={`text-lg font-bold mb-2 ${
                    !isEnabled ? 'text-slate-500' : 'text-slate-200'
                  }`}>
                    {t(card.titleKey, { studentName: t('common.myChild') })}
                  </h3>

                  {/* Descripción */}
                  <p className={`text-sm mb-4 leading-relaxed ${
                    !isEnabled ? 'text-slate-600' : 'text-slate-400'
                  }`}>
                    {cardData.description}
                  </p>

                  {/* Métricas si están disponibles */}
                  {cardData.metrics && isEnabled && (
                    <div className="mb-4 space-y-3">
                      {cardData.progress !== null && (
                        <div className="space-y-2">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>Progreso</span>
                            <span className="font-semibold text-purple-300">{cardData.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-700/50 rounded-full h-2 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${cardData.progress}%` }}
                              transition={{ duration: 1, delay: 0.5 }}
                              className="bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 h-2 rounded-full shadow-lg"
                            />
                          </div>
                        </div>
                      )}
                      
                      {/* Métricas específicas */}
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(cardData.metrics).slice(0, 4).map(([key, value]) => (
                          <div key={key} className="bg-slate-700/30 rounded-lg p-2 text-center">
                            <div className="text-xs text-slate-400 capitalize mb-1">{key}</div>
                            <div className="text-sm font-bold text-slate-200">{value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="mt-auto pt-4 border-t border-slate-700/30">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className={`text-sm ${
                          !isEnabled ? 'text-slate-600' : 'text-slate-400'
                        }`}>
                          {!isEnabled ? t('parentDashboard.requiresChildLink') : t('common.accessNowButton')}
                        </span>
                        {cardData.specialValue && (
                          <span className={`text-xs font-medium mt-1 ${cardData.specialColor}`}>
                            {cardData.specialValue}
                          </span>
                        )}
                      </div>
                      {isEnabled && (
                        <motion.div
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="h-5 w-5 text-purple-400 group-hover:text-purple-300 transition-colors" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
              >
                {card.isSpecial ? (
                  <div 
                    className="h-full cursor-pointer group"
                    onClick={() => handleSpecialCardClick(card)}
                  >
                    {cardContent}
                  </div>
                ) : (card.requiresChild && !hasLinkedStudents) || !card.link ? (
                  <div className="h-full">{cardContent}</div>
                ) : (
                  <Link to={card.link} className="block group h-full">
                    {cardContent}
                  </Link>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {activeTab === 'notifications' && (
        <ParentNotificationsPanel />
      )}

      {activeTab === 'communication' && (
        <ParentCommunicationPanel />
      )}

      {activeTab === 'metrics' && (
        <FamilyMetricsDashboard />
      )}

      {activeTab === 'alerts' && (
        <IntelligentParentAlerts />
      )}

      {activeTab === 'calendar' && (
        <FamilyCalendar />
      )}

      {activeTab === 'resources' && (
        <ParentResourcesPanel />
      )}

      {activeTab === 'gamification' && (
        <FamilyGamification />
      )}

      {/* Modal de vista unificada del estudiante */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 rounded-lg border border-slate-700 w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
            <UnifiedStudentProgressView 
              studentId={selectedStudent} 
              onClose={() => setSelectedStudent(null)} 
            />
          </div>
        </div>
      )}

      {/* Modal de vinculación de estudiante */}
      <StudentLinkModal
        isOpen={isLinkModalOpen}
        onClose={() => setIsLinkModalOpen(false)}
        onLinkSuccess={handleLinkSuccess}
      />

      {/* Chat Universal con Gemini AI */}
      <UniversalGeminiChat
        userRole="parent"
        context={{
          primaryChildId: primaryChildId,
          associatedStudents: associatedStudentIds?.length || 0,
          syncData: syncData,
          activeTab: activeTab
        }}
        isOpen={showGeminiChat}
        onClose={() => setShowGeminiChat(false)}
        onMinimize={setGeminiChatMinimized}
        isMinimized={geminiChatMinimized}
        position="bottom-right"
      />
      </motion.div>
    </>
  );
};

export default ParentDashboard;