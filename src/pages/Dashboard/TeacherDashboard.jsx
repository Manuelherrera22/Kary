import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle, Loader2, FileText, ListChecks, Edit, Users } from 'lucide-react';

// Estilos para ocultar el scrollbar
const scrollbarHideStyles = `
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
`;
import TeacherWelcomeHeader from '@/pages/Dashboard/TeacherSections/components/TeacherDashboard/TeacherWelcomeHeader.jsx';
import StatCard from '@/pages/Dashboard/TeacherSections/components/StatCard.jsx';
import AssignedStudentsList from '@/pages/Dashboard/TeacherSections/components/TeacherDashboard/AssignedStudentsList.jsx';
import StudentOverviewCard from '@/pages/Dashboard/TeacherSections/components/TeacherDashboard/StudentOverviewCard.jsx';
import AIInsightsPanel from '@/pages/Dashboard/TeacherSections/components/TeacherDashboard/AIInsightsPanel.jsx';
import BulkActivityManager from '@/pages/Dashboard/TeacherSections/components/TeacherDashboard/BulkActivityManager.jsx';
import ProgressTrackingMatrix from '@/pages/Dashboard/TeacherSections/components/TeacherDashboard/ProgressTrackingMatrix.jsx';
import AdvancedAnalytics from '@/pages/Dashboard/TeacherSections/components/TeacherDashboard/AdvancedAnalytics.jsx';
import IntelligentAIAssistant from '@/pages/Dashboard/TeacherSections/components/TeacherDashboard/IntelligentAIAssistant.jsx';
import TeacherGamification from '@/pages/Dashboard/TeacherSections/components/TeacherDashboard/TeacherGamification.jsx';
import IntelligentActivityGenerator from '@/pages/Dashboard/TeacherSections/components/TeacherDashboard/IntelligentActivityGenerator.jsx';
import EcosystemDemo from '@/components/EcosystemDemo';
import { supabase } from '@/lib/supabaseClient';
import unifiedDataService from '@/services/unifiedDataService';
import mockTeacherDataService from '@/services/mockTeacherDataService';

const TeacherDashboard = () => {
  const { t } = useLanguage();
  const { userProfile, loading: authLoading } = useMockAuth();
  
  const [stats, setStats] = useState({
    activePlans: 0,
    pendingActivities: 0,
    registeredObservations: 0,
  });
  const [students, setStudents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingStudents, setIsLoadingStudents] = useState(true);
  const [isLoadingActivities, setIsLoadingActivities] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    const fetchStats = async () => {
      if (!userProfile?.id) return;
      setIsLoadingStats(true);
      try {
        const result = await mockTeacherDataService.getTeacherStats(userProfile.id);
        
        if (result.success) {
          setStats(result.data);
        } else {
          throw new Error('Error al obtener estadísticas');
        }
      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast({ title: t('toasts.error'), description: "Error al cargar estadísticas del panel.", variant: 'destructive' });
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, [userProfile?.id, t]);

  // Cargar estudiantes
  useEffect(() => {
    const fetchStudents = async () => {
      if (!userProfile?.id) return;
      setIsLoadingStudents(true);
      try {
        const result = await mockTeacherDataService.getAssignedStudents(userProfile.id);
        if (result.success) {
          setStudents(result.data);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setIsLoadingStudents(false);
      }
    };

    fetchStudents();
  }, [userProfile?.id]);

  // Cargar actividades
  useEffect(() => {
    const fetchActivities = async () => {
      if (!userProfile?.id) return;
      setIsLoadingActivities(true);
      try {
        const result = await mockTeacherDataService.getStudentActivities(userProfile.id);
        if (result.success) {
          setActivities(result.data);
        }
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setIsLoadingActivities(false);
      }
    };

    fetchActivities();
  }, [userProfile?.id]);

  // Handlers para las acciones
  const handleViewStudentDetails = (student) => {
    toast({
      title: t('common.info'),
      description: t('teacherDashboard.viewingStudent', `Viendo detalles de ${student.full_name}`),
      className: "bg-blue-500 text-white dark:bg-blue-600"
    });
  };

  const handleAddActivity = (student) => {
    toast({
      title: t('common.info'),
      description: t('teacherDashboard.addingActivity', `Agregando actividad para ${student.full_name}`),
      className: "bg-green-500 text-white dark:bg-green-600"
    });
  };

  const handleViewProgress = (student) => {
    toast({
      title: t('common.info'),
      description: t('teacherDashboard.viewingProgress', `Viendo progreso de ${student.full_name}`),
      className: "bg-purple-500 text-white dark:bg-purple-600"
    });
  };

  const handleInsightAction = (insight) => {
    toast({
      title: t('common.info'),
      description: t('teacherDashboard.implementingInsight', `Implementando: ${insight.title}`),
      className: "bg-purple-500 text-white dark:bg-purple-600"
    });
  };

  const handleActivitiesCreated = (newActivities) => {
    setActivities(prev => [...prev, ...newActivities]);
    toast({
      title: t('common.success'),
      description: t('teacherDashboard.activitiesCreated', `${newActivities.length} actividades creadas exitosamente`),
      className: "bg-green-500 text-white dark:bg-green-600"
    });
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <Loader2 className="h-16 w-16 animate-spin text-pink-400" />
      </div>
    );
  }

  if (!userProfile) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-slate-900 text-white p-8 text-center">
        <AlertTriangle size={64} className="text-yellow-400 mb-6" />
        <h1 className="text-3xl font-bold mb-4">{t('common.accessDenied')}</h1>
        <p className="text-lg text-slate-300">{t('common.notLoggedIn')}</p>
      </div>
    );
  }

  const statCards = [
    {
      title: t('teacherDashboard.activePlans'),
      value: stats.activePlans,
      Icon: FileText,
      color: 'text-green-400',
      actionText: t('teacherDashboard.viewPlans'),
      onAction: () => toast({ title: "🚧 Característica no implementada", description: "¡Podrás ver los planes activos desde aquí pronto!" }),
    },
    {
      title: t('teacherDashboard.pendingActivities'),
      value: stats.pendingActivities,
      Icon: ListChecks,
      color: 'text-orange-400',
      actionText: t('teacherDashboard.createActivity'),
      onAction: () => toast({ title: "🚧 Característica no implementada", description: "¡Podrás crear actividades desde aquí pronto!" }),
    },
    {
      title: t('teacherDashboard.registeredObservations'),
      value: stats.registeredObservations,
      Icon: Edit,
      color: 'text-blue-400',
      actionText: t('teacherDashboard.addTracking'),
      onAction: () => toast({ title: "🚧 Característica no implementada", description: "¡Podrás añadir seguimientos desde aquí pronto!" }),
    },
  ];

  return (
    <>
      <style>{scrollbarHideStyles}</style>
      <motion.div 
        className="space-y-4 sm:space-y-6 md:space-y-8 lg:space-y-10 p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
      <TeacherWelcomeHeader 
        teacherName={userProfile?.full_name || userProfile?.name || user?.email || 'Profesor'}
        assignedStudentsCount={students.length}
      />

      {/* Navegación de secciones */}
      <div className="flex gap-2 sm:gap-3 justify-start sm:justify-center overflow-x-auto scrollbar-hide pb-3">
        {[
          { id: 'overview', label: 'Resumen', icon: '📊', shortLabel: 'Resumen' },
          { id: 'analytics', label: 'Analytics', icon: '📈', shortLabel: 'Analytics' },
          { id: 'ai', label: 'Asistente IA', icon: '🤖', shortLabel: 'IA' },
          { id: 'activities', label: 'Actividades', icon: '📚', shortLabel: 'Actividades' },
          { id: 'ecosystem', label: 'Ecosistema', icon: '🔄', shortLabel: 'Ecosistema' },
          { id: 'gamification', label: 'Progreso', icon: '🏆', shortLabel: 'Progreso' }
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-3 sm:px-4 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl text-sm sm:text-base font-medium transition-all duration-200 flex-shrink-0 whitespace-nowrap ${
              activeSection === section.id
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <span className="mr-2 sm:mr-3">{section.icon}</span>
            <span className="hidden sm:inline">{section.label}</span>
            <span className="sm:hidden">{section.shortLabel}</span>
          </button>
        ))}
      </div>

      {/* Contenido de secciones */}
      {activeSection === 'overview' && (
        <>
          {/* Estadísticas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
        {statCards.map((card, index) => (
          <StatCard
            key={index}
            title={card.title}
            value={card.value}
            Icon={card.Icon}
            color={card.color}
            actionText={card.actionText}
            onAction={card.onAction}
            isLoading={isLoadingStats}
          />
        ))}
      </div>

      {/* Panel de Insights de IA */}
      <AIInsightsPanel 
        students={students}
        onInsightAction={handleInsightAction}
      />

      {/* Gestión masiva de actividades */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-6 md:gap-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-200">
          {t('teacherDashboard.quickActions', 'Acciones Rápidas')}
        </h2>
        <BulkActivityManager 
          students={students}
          onActivitiesCreated={handleActivitiesCreated}
        />
      </div>

      {/* Tarjetas de resumen de estudiantes */}
      <div className="space-y-6 sm:space-y-8">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-200">
          {t('teacherDashboard.studentOverview', 'Resumen de Estudiantes')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 md:gap-10">
          {students.map((student) => (
            <StudentOverviewCard
              key={student.id}
              student={student}
              onViewDetails={handleViewStudentDetails}
              onAddActivity={handleAddActivity}
              onViewProgress={handleViewProgress}
            />
          ))}
        </div>
      </div>

          {/* Matriz de seguimiento de progreso */}
          <div className="mt-8">
            <ProgressTrackingMatrix 
              students={students}
              activities={activities}
            />
          </div>

          {/* Lista detallada de estudiantes (versión compacta) */}
          <div className="mt-8">
            <AssignedStudentsList teacherId={userProfile.id} />
          </div>
        </>
      )}

      {activeSection === 'analytics' && (
        <div className="mt-8">
          <AdvancedAnalytics />
        </div>
      )}

      {activeSection === 'ai' && (
        <div className="mt-8">
          <IntelligentAIAssistant />
        </div>
      )}

      {activeSection === 'activities' && (
        <div className="mt-8">
          <IntelligentActivityGenerator />
        </div>
      )}

      {activeSection === 'ecosystem' && (
        <div className="mt-8">
          <EcosystemDemo />
        </div>
      )}

      {activeSection === 'gamification' && (
        <div className="mt-8">
          <TeacherGamification />
        </div>
      )}
      </motion.div>
    </>
  );
};

export default TeacherDashboard;
