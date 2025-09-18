import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { Zap, BookOpen, Users } from 'lucide-react';
import TeacherSupportPlanBlock from './components/TeacherSupportPlanBlock';
import TeacherGeneratedActivitiesBlock from './components/TeacherGeneratedActivitiesBlock';
import ActivityPreviewModal from './components/ActivityPreviewModal';
import { useStudentActivities } from './hooks/useStudentActivities';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const TeacherStudentPlansPage = () => {
  const { t } = useLanguage();
  const { userProfile } = useAuth();
  const [plans, setPlans] = useState([]);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const {
    activitiesToPreview,
    setActivitiesToPreview,
    currentStudentForActivity,
    setCurrentStudentForActivity,
    isLoading: isLoadingActivities,
    isActivityModalOpen,
    setIsActivityModalOpen,
    activityModalMode,
    setActivityModalMode,
    currentPlanIdForActivity,
    setCurrentPlanIdForActivity,
    handleSaveActivityChanges,
    handleSendToStudent,
    generateActivitiesForPlan
  } = useStudentActivities();
  
  const fetchSupportPlans = useCallback(async () => {
    if (!userProfile?.id) return;
    setIsLoadingPlans(true);
    try {
      const { data, error } = await supabase
        .from('support_plans')
        .select('*, student:user_profiles!student_id(full_name)')
        .eq('responsible_teacher_id', userProfile.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const formattedPlans = data.map(plan => ({
          ...plan,
          plan_preview: plan.plan_json?.preview,
          emotional_support: plan.plan_json?.emotional_support,
          academic_support: plan.plan_json?.academic_support,
          recommendations: plan.plan_json?.recommendations
      }));
      setPlans(formattedPlans);

    } catch (error) {
      console.error("Error fetching support plans:", error);
      toast({ title: t('toasts.error'), description: t('teacherDashboard.errorFetchingPlans'), variant: 'destructive' });
    } finally {
      setIsLoadingPlans(false);
    }
  }, [userProfile?.id, t]);

  useEffect(() => {
    fetchSupportPlans();
  }, [fetchSupportPlans]);

  const handleGenerateActivities = async (plan) => {
    const student = { id: plan.student_id, full_name: plan.student.full_name };
    setCurrentStudentForActivity(student);
    setCurrentPlanIdForActivity(plan.id);
    setActivityModalMode('generate');
    setIsActivityModalOpen(true);
    setActivitiesToPreview([]); // Clear previous
    await generateActivitiesForPlan(plan.id, student, userProfile.id);
  };
  
  const handleOpenActivityModal = () => {
    const student = plans.find(p => p.student_id === selectedStudentId)?.student;
    if (student) {
      setCurrentStudentForActivity({id: student.id, full_name: student.full_name});
      setActivityModalMode('edit');
      setIsActivityModalOpen(true);
    } else {
        toast({ title: t('common.error'), description: 'Please select a student first.', variant: 'destructive' });
    }
  };

  const selectedStudentActivities = activitiesToPreview.filter(
    (act) => act.student_id === selectedStudentId
  );
  
  const selectedPlan = plans.find(p => p.student_id === selectedStudentId);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 min-h-screen text-white"
    >
      <div className="container mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400 flex items-center">
            <BookOpen size={32} className="mr-3" />
            {t('teacherDashboard.sidebar.studentList')}
          </h1>
          <p className="text-slate-400">{t('teacherDashboard.plans.pageSubtitle', 'Gestiona los planes de apoyo y actividades de tus estudiantes.')}</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="flex flex-col space-y-8">
             <Card className="bg-slate-800/80 border-slate-700 shadow-2xl h-full flex flex-col">
              <CardHeader className="pb-4">
                <CardTitle className="text-purple-400 flex items-center text-2xl">
                  <Users size={28} className="mr-3" />
                  {t('teacherDashboard.supportPlan.title')}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow p-0">
                <TeacherSupportPlanBlock
                    plans={plans}
                    isLoading={isLoadingPlans}
                    onGenerateActivities={handleGenerateActivities}
                    selectedStudentId={selectedStudentId}
                    onSelectStudent={setSelectedStudentId}
                />
              </CardContent>
            </Card>
          </div>
          
          <div className="flex flex-col">
            <TeacherGeneratedActivitiesBlock
              activities={activitiesToPreview}
              isLoading={isLoadingActivities}
              studentName={plans.find(p => p.student_id === selectedStudentId)?.student?.full_name}
              planName={selectedPlan ? t('teacherDashboard.common.summary') : ''}
              onOpenActivityModal={handleOpenActivityModal}
            />
          </div>
        </div>

        <ActivityPreviewModal
          isOpen={isActivityModalOpen}
          onOpenChange={(isOpen) => {
            setIsActivityModalOpen(isOpen);
            if (!isOpen) {
              setActivitiesToPreview([]);
              setCurrentStudentForActivity(null);
            }
          }}
          studentName={currentStudentForActivity?.full_name}
          activities={activitiesToPreview}
          isLoading={isLoadingActivities}
          onSave={(activities) => handleSaveActivityChanges(activities, currentStudentForActivity.id, currentPlanIdForActivity)}
          onSend={(activities) => handleSendToStudent(activities, currentStudentForActivity.id, currentPlanIdForActivity)}
          isSingleEditMode={activityModalMode === 'edit'}
        />
      </div>
    </motion.div>
  );
};

export default TeacherStudentPlansPage;