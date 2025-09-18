import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye, User, BookOpen, CalendarDays, Info, Loader2, UserX, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import edgeFunctionService from '@/services/edgeFunctionService';
import { toast } from '@/components/ui/use-toast';
import DetailedPlanModal from '@/pages/Dashboard/PsychopedagogueSections/SupportPlanPageComponents/DetailedPlanModal';
import ActivityPreviewModal from '@/pages/Dashboard/TeacherSections/components/ActivityPreviewModal';
import { useStudentActivities } from '@/pages/Dashboard/TeacherSections/hooks/useStudentActivities'; 
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { supabase } from '@/lib/supabaseClient';

const AssignedStudentsTable = () => {
  const { t, language } = useLanguage();
  const { userProfile } = useMockAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudentForPlan, setSelectedStudentForPlan] = useState(null);
  const [selectedPlanData, setSelectedPlanData] = useState(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  
  const {
    activitiesToPreview,
    setActivitiesToPreview,
    currentStudentForActivity,
    setCurrentStudentForActivity,
    isLoading: isLoadingActivitiesGeneration,
    isActivityModalOpen,
    setIsActivityModalOpen,
    activityModalMode,
    setActivityModalMode,
    currentPlanIdForActivity,
    setCurrentPlanIdForActivity,
    handleSaveActivityChanges,
    handleSendToStudent,
  } = useStudentActivities(userProfile?.id);

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notAvailableShort');
    try {
      const date = parseISO(dateString);
      return format(date, 'PPP', { locale: language === 'es' ? es : undefined });
    } catch (error) {
      return dateString; 
    }
  };

  useEffect(() => {
    const fetchAssignedStudents = async () => {
      if (!userProfile || userProfile.role !== 'teacher') return;
      setIsLoading(true);
      try {
        const { data, error } = await edgeFunctionService.getAssignedStudentsByTeacher({ teacher_id: userProfile.id });
        if (error) throw error;
        
        // The data structure from the function is an array of students: { student_id, full_name, academic_level, assigned_at, support_plan_id }
        // We rename support_plan_id to planId for consistency.
        const studentsWithDetails = (data || []).map(student => ({
          ...student,
          id: student.student_id, // Ensure 'id' is present for key prop and other logic
          academicLevel: student.academic_level || t('common.notAvailable'),
          assignedAt: student.assigned_at ? formatDate(student.assigned_at) : t('common.notAvailable'),
          planId: student.support_plan_id 
        }));
        setStudents(studentsWithDetails);

      } catch (error) {
        console.error("Error fetching assigned students:", error);
        toast({ title: t('toasts.error'), description: t('teacherDashboard.errorFetchingStudents'), variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignedStudents();
  }, [userProfile, t, language]);

  const viewPlan = async (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student || !student.planId) {
      toast({ title: t('common.info'), description: t('teacherDashboard.noPlanAvailable'), variant: 'default' });
      return;
    }

    setSelectedStudentForPlan(student);
    try {
      const { data: planDetails, error: planError } = await supabase
        .from('support_plans')
        .select('*, student:user_profiles!student_id(full_name)')
        .eq('id', student.planId)
        .single();

      if (planError) throw planError;
      
      setSelectedPlanData({
          id: planDetails.id,
          plan_json: planDetails.plan_json || { preview: t('teacherDashboard.noPlanAvailable') },
          student_id: student.student_id,
          student_name: student.full_name,
          status: planDetails.status,
          start_date: planDetails.start_date,
          end_date: planDetails.end_date,
          emotional_support: planDetails.plan_json?.emotional_support,
          academic_support: planDetails.plan_json?.academic_support,
          recommendations: planDetails.plan_json?.recommendations,
          plan_preview: planDetails.plan_json?.preview,
      });
      setIsPlanModalOpen(true);

    } catch(error) {
      toast({ title: t('toasts.error'), description: t('teacherDashboard.errorFetchingPlans'), variant: 'destructive' });
      // Fallback plan data if fetch fails but planId exists
      setSelectedPlanData({ 
          id: student.planId,
          plan_json: { preview: t('teacherDashboard.noPlanAvailable') },
          student_id: student.student_id,
          student_name: student.full_name
      });
      setIsPlanModalOpen(true);
    }
  };

  const generateActivity = async (studentId) => {
    const student = students.find(s => s.id === studentId);
    if (!student || !userProfile?.id) {
      toast({ title: t('toasts.error'), description: t('common.authenticationError'), variant: 'destructive' });
      return;
    }
    setCurrentStudentForActivity({ id: student.student_id, full_name: student.full_name });
    setCurrentPlanIdForActivity(student.planId); 
    setActivityModalMode('generate'); 
    setIsActivityModalOpen(true); 
    setActivitiesToPreview([]);
    
    try {
      const { data: generatedActivitiesData, error } = await edgeFunctionService.karyAIAutoActivityGenerator({
        student_id: student.student_id,
        support_plan_id: student.planId, 
        teacher_id: userProfile.id
      });

      if (error) throw error;

      const actualGeneratedActivities = generatedActivitiesData?.activities || generatedActivitiesData || [];

      if (actualGeneratedActivities && actualGeneratedActivities.length > 0) {
        setActivitiesToPreview(actualGeneratedActivities.map(act => ({...act, tempId: act.id || `temp-${Math.random()}`})));
      } else {
        setActivitiesToPreview([]);
        toast({ title: t('common.info'), description: t('teacherDashboard.noActivitiesGenerated'), variant: 'default' });
      }
    } catch (error) {
      console.error("Error generating activities with AI:", error);
      toast({ title: t('toasts.error'), description: t('teacherDashboard.errorGeneratingActivities'), variant: 'destructive' });
      setActivitiesToPreview([]); 
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-pink-400" />
        <p className="ml-4 text-lg text-slate-300">{t('teacherDashboard.loadingStudentData')}</p>
      </div>
    );
  }

  if (students.length === 0) {
    return (
      <Card className="bg-slate-800/70 border-slate-700 shadow-xl mt-6">
        <CardHeader>
          <CardTitle className="text-pink-400 flex items-center"><UserX size={24} className="mr-2" />{t('dashboard.teacherDashboard.title')}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-10">
          <Info size={48} className="text-slate-500 mb-4" />
          <p className="text-slate-300">{t('teacherDashboard.noStudents')}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <Card className="bg-slate-800/80 border-slate-700 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            {t('dashboard.teacherDashboard.title')}
          </CardTitle>
          <CardDescription className="text-slate-400">
            {t('dashboards.teacherDashboard.assignedStudentsDesc', 'Gestiona los estudiantes asignados a tu cargo.')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="max-h-[calc(100vh-350px)] p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {students.map((student) => (
                <motion.div
                  key={student.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: students.indexOf(student) * 0.05 }}
                >
                  <Card className="bg-slate-700/50 border-slate-600 hover:shadow-pink-500/20 transition-all duration-300 flex flex-col justify-between h-full">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg text-slate-100 flex items-center mb-2">
                        <User size={20} className="mr-2 text-pink-300"/> {student.full_name}
                      </CardTitle>
                      <div className="text-sm text-slate-300 space-y-1">
                        <p className="flex items-center"><BookOpen size={14} className="mr-2 text-sky-400"/>{t('teacherDashboard.academicLevel')}: {student.academicLevel}</p>
                        <p className="flex items-center"><CalendarDays size={14} className="mr-2 text-green-400"/>{t('teacherDashboard.assignedAt')}: {student.assignedAt}</p>
                      </div>
                    </CardHeader>
                    <CardContent className="flex-grow flex flex-col justify-end pt-2">
                      <div className="flex flex-col sm:flex-row gap-2 justify-end mt-auto">
                        <Button variant="outline" size="sm" onClick={() => viewPlan(student.id)} className="flex-1 sm:flex-initial border-sky-500/70 text-sky-400 hover:bg-sky-500/20 hover:text-sky-300 transition-colors" disabled={!student.planId}>
                          <Eye size={16} className="mr-1.5" /> {t('dashboard.teacherDashboard.viewPlan')}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => generateActivity(student.id)} className="flex-1 sm:flex-initial border-emerald-500/70 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors">
                          <Zap size={16} className="mr-1.5" /> {t('dashboard.teacherDashboard.generateActivity')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {selectedPlanData && isPlanModalOpen && (
        <DetailedPlanModal
          isOpen={isPlanModalOpen}
          onOpenChange={setIsPlanModalOpen}
          plan={selectedPlanData}
          student={selectedStudentForPlan}
          currentUserRole="teacher"
        />
      )}

      <ActivityPreviewModal
        isOpen={isActivityModalOpen}
        onOpenChange={(isOpen) => {
          setIsActivityModalOpen(isOpen);
          if (!isOpen) { 
            setActivitiesToPreview([]);
          }
        }}
        studentName={currentStudentForActivity?.full_name}
        activities={activitiesToPreview}
        isLoading={isLoadingActivitiesGeneration}
        onSave={handleSaveActivityChanges} 
        onSend={handleSendToStudent}
        isSingleEditMode={activityModalMode === 'edit'}
      />
    </motion.div>
  );
};

export default AssignedStudentsTable;