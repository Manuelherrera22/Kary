import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { toast } from '@/components/ui/use-toast';
import { AlertTriangle, Loader2, FileText, ListChecks, Edit, Users } from 'lucide-react';
import TeacherWelcomeHeader from '@/pages/Dashboard/TeacherSections/components/TeacherDashboard/TeacherWelcomeHeader.jsx';
import StatCard from '@/pages/Dashboard/TeacherSections/components/StatCard.jsx';
import AssignedStudentsList from '@/pages/Dashboard/TeacherSections/components/TeacherDashboard/AssignedStudentsList.jsx';
import { supabase } from '@/lib/supabaseClient';

const TeacherDashboard = () => {
  const { t } = useLanguage();
  const { userProfile, loading: authLoading } = useMockAuth();
  
  const [stats, setStats] = useState({
    activePlans: 0,
    pendingActivities: 0,
    registeredObservations: 0,
  });
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (!userProfile?.id) return;
      setIsLoadingStats(true);
      try {
        const { data: plansData, error: plansError } = await supabase
          .from('support_plans')
          .select('id', { count: 'exact' })
          .eq('responsible_teacher_id', userProfile.id)
          .in('status', ['active', 'en_progreso']);
        if (plansError) throw plansError;

        const { data: activitiesData, error: activitiesError } = await supabase
          .from('student_activities')
          .select('id', { count: 'exact' })
          .eq('teacher_id', userProfile.id)
          .in('status', ['pending_approval', 'sent_to_student']);
        if (activitiesError) throw activitiesError;

        const { data: observationsData, error: observationsError } = await supabase
          .from('observations')
          .select('id', { count: 'exact' })
          .eq('created_by', userProfile.id);
        if (observationsError) throw observationsError;

        setStats({
          activePlans: plansData?.length || 0,
          pendingActivities: activitiesData?.length || 0,
          registeredObservations: observationsData?.length || 0,
        });

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        toast({ title: t('toasts.error'), description: "Error al cargar estadísticas del panel.", variant: 'destructive' });
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, [userProfile?.id, t]);

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
        assignedStudentsCount={userProfile.assigned_students?.length || 0}
      />

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

      <AssignedStudentsList teacherId={userProfile.id} />

    </motion.div>
  );
};

export default TeacherDashboard;