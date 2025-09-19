import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle, Loader2, FileText, ListChecks, Edit, Users } from 'lucide-react';
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
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <TeacherWelcomeHeader 
        teacherName={userProfile.full_name}
        assignedStudentsCount={students.length}
      />

      {/* Navegación de secciones */}
      <div className="flex flex-wrap gap-2 justify-center">
        {[
          { id: 'overview', label: 'Resumen', icon: '📊' },
          { id: 'analytics', label: 'Analytics', icon: '📈' },
          { id: 'ai', label: 'Asistente IA', icon: '🤖' },
          { id: 'activities', label: 'Actividades', icon: '📚' },
          { id: 'ecosystem', label: 'Ecosistema', icon: '🔄' },
          { id: 'gamification', label: 'Progreso', icon: '🏆' }
        ].map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeSection === section.id
                ? 'bg-purple-600 text-white shadow-lg'
                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
            }`}
          >
            <span className="mr-2">{section.icon}</span>
            {section.label}
          </button>
        ))}
      </div>

      {/* Contenido de secciones */}
      {activeSection === 'overview' && (
        <>
          {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-200">
          {t('teacherDashboard.quickActions', 'Acciones Rápidas')}
        </h2>
        <BulkActivityManager 
          students={students}
          onActivitiesCreated={handleActivitiesCreated}
        />
      </div>

      {/* Tarjetas de resumen de estudiantes */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-200">
          {t('teacherDashboard.studentOverview', 'Resumen de Estudiantes')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
          <ProgressTrackingMatrix 
            students={students}
            activities={activities}
          />

          {/* Lista detallada de estudiantes (versión compacta) */}
          <AssignedStudentsList teacherId={userProfile.id} />
        </>
      )}

      {activeSection === 'analytics' && (
        <AdvancedAnalytics />
      )}

      {activeSection === 'ai' && (
        <IntelligentAIAssistant />
      )}

      {activeSection === 'activities' && (
        <IntelligentActivityGenerator />
      )}

      {activeSection === 'ecosystem' && (
        <EcosystemDemo />
      )}

      {activeSection === 'gamification' && (
        <TeacherGamification />
      )}
    </motion.div>
  );
};

export default TeacherDashboard;
