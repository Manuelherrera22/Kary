import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth.jsx';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import ParentDashboardHeader from './components/ParentDashboardHeader.jsx';
import AssignedChildrenList from '@/pages/Dashboard/ParentSections/components/AssignedChildrenList.jsx'; 
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import DetailedPlanModal from '@/pages/Dashboard/PsychopedagogueSections/SupportPlanPageComponents/DetailedPlanModal';
import { FileText, Eye, Download, MessageSquare, AlertTriangle, CheckCircle2, Edit2, Loader2 } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

const ParentStudentActivities = ({ studentId, studentName, teacherName }) => {
  const { t } = useLanguage();
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!studentId) return;
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('student_activities')
          .select('*, teacher:user_profiles!teacher_id(full_name)')
          .eq('student_id', studentId)
          .eq('status', 'sent_to_student')
          .order('due_date', { ascending: true });

        if (error) throw error;
        setActivities(data || []);
      } catch (error) {
        console.error("Error fetching student activities for parent:", error);
        toast({ title: t('toasts.error'), description: t('parentDashboard.errorFetchingActivities'), variant: 'destructive' });
      } finally {
        setIsLoading(false);
      }
    };
    fetchActivities();
  }, [studentId, t]);

  if (isLoading) {
    return <div className="flex justify-center items-center p-6"><Loader2 className="h-8 w-8 animate-spin text-purple-400" /></div>;
  }

  if (activities.length === 0) {
    return <p className="text-slate-400 text-center py-4">{t('parentDashboard.sections.activities.noActivities')}</p>;
  }

  return (
    <ScrollArea className="h-[300px] pr-2">
      <div className="space-y-3">
        {activities.map(activity => (
          <Card key={activity.id} className="bg-slate-700/40 border-slate-600">
            <CardHeader className="pb-2">
              <CardTitle className="text-md text-slate-100">{activity.title}</CardTitle>
              {activity.teacher?.full_name && (
                <CardDescription className="text-xs text-purple-300">
                  {t('parentDashboard.activitiesByTeacher', { teacherName: activity.teacher.full_name })}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-300 mb-2 line-clamp-2">{activity.description}</p>
              <p className="text-xs text-slate-400">{t('teacherDashboard.common.dueDate')}: {activity.due_date ? new Date(activity.due_date).toLocaleDateString() : t('common.notSpecified')}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
};


const ParentDashboard = () => {
  const { t } = useLanguage();
  const { userProfile, primaryChildId } = useAuth();
  const [childData, setChildData] = useState(null);
  const [supportPlan, setSupportPlan] = useState(null);
  const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
  const [isLoadingChildData, setIsLoadingChildData] = useState(true);

  useEffect(() => {
    const fetchChildAndPlanData = async () => {
      if (!primaryChildId) {
        setIsLoadingChildData(false);
        return;
      }
      setIsLoadingChildData(true);
      try {
        // Fetch child profile
        const { data: studentProfile, error: studentError } = await supabase
          .from('user_profiles')
          .select('id, full_name, academic_level')
          .eq('id', primaryChildId)
          .single();
        if (studentError) throw studentError;
        setChildData(studentProfile);

        // Fetch support plan
        const { data: plan, error: planError } = await supabase
          .from('support_plans')
          .select('*, student:user_profiles!student_id(full_name), responsible_teacher:user_profiles!responsible_teacher_id(full_name)')
          .eq('student_id', primaryChildId)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();
        
        if (planError && planError.code !== 'PGRST116') { // PGRST116 = no rows found
          throw planError;
        }
        setSupportPlan(plan);

      } catch (error) {
        console.error("Error fetching child data or plan for parent:", error);
        toast({ title: t('toasts.error'), description: t('parentDashboard.errorFetchingChildData'), variant: 'destructive' });
      } finally {
        setIsLoadingChildData(false);
      }
    };

    fetchChildAndPlanData();
  }, [primaryChildId, t]);

  const handleViewPlan = () => {
    if (supportPlan) {
      setIsPlanModalOpen(true);
    } else {
      toast({ title: t('common.info'), description: t('parentDashboard.noPlan'), variant: 'default' });
    }
  };

  return (
    <motion.div 
      className="p-4 sm:p-6 lg:p-8 space-y-8 bg-gradient-to-br from-slate-900 via-purple-900 to-pink-900 min-h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ParentDashboardHeader userName={userProfile?.full_name || t('common.user')} />
      
      {isLoadingChildData ? (
        <div className="flex justify-center items-center p-10"><Loader2 className="h-12 w-12 animate-spin text-pink-400" /></div>
      ) : !primaryChildId ? (
         <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
            <CardHeader>
              <CardTitle className="text-yellow-400 flex items-center"><AlertTriangle size={24} className="mr-2" />{t('parentDashboard.noChildLinkedTitle', 'Vincular Estudiante')}</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-300">
              <p>{t('parentDashboard.noChildLinked')}</p>
            </CardContent>
          </Card>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="bg-slate-800/80 border-slate-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-pink-400 flex items-center">
                  <FileText size={22} className="mr-2"/> {t('parentDashboard.sections.supportPlan.title')} for {childData?.full_name}
                </CardTitle>
                <CardDescription className="text-slate-400">{t('parentDashboard.sections.supportPlan.description')}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {supportPlan ? (
                  <>
                    <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-md">
                      <div className="flex items-center">
                        <CheckCircle2 size={20} className="mr-2 text-green-400" />
                        <p className="text-slate-200">{t('parentDashboard.planCompleted')} {supportPlan.status === 'completed' ? '(Completado)' : '(Activo)'}</p>
                      </div>
                      <Button onClick={handleViewPlan} variant="outline" className="border-pink-500/70 text-pink-400 hover:bg-pink-500/10">
                        <Eye size={16} className="mr-1.5" /> {t('parentDashboard.viewPlan')}
                      </Button>
                    </div>
                     {supportPlan.responsible_teacher?.full_name && (
                      <p className="text-sm text-slate-300">{t('parentDashboard.activitiesByTeacher', { teacherName: supportPlan.responsible_teacher.full_name })}</p>
                    )}
                  </>
                ) : (
                  <p className="text-slate-400 text-center py-4">{t('parentDashboard.noPlan')}</p>
                )}
                <Button 
                  onClick={() => toast({ title: t('common.featureUnavailableTitle'), description: t('common.featureUnavailableMessage')})}
                  variant="ghost" className="w-full justify-start text-slate-300 hover:bg-slate-700/50"
                >
                  <Download size={16} className="mr-2" /> {t('parentDashboard.downloadPdf')}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="bg-slate-800/80 border-slate-700 shadow-2xl">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-purple-400 flex items-center">
                  <Edit2 size={22} className="mr-2"/> {t('parentDashboard.sections.activities.title')}
                </CardTitle>
                 <CardDescription className="text-slate-400">{t('parentDashboard.sections.activities.description')}</CardDescription>
              </CardHeader>
              <CardContent>
                <ParentStudentActivities studentId={primaryChildId} studentName={childData?.full_name} />
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}

      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="bg-slate-800/80 border-slate-700 shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-sky-400">{t('parentDashboard.sections.communication.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-slate-300 mb-4">{t('parentDashboard.sections.communication.description')}</p>
            <Button 
              onClick={() => toast({ title: t('common.featureUnavailableTitle'), description: t('common.featureUnavailableMessage')})}
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white"
            >
              <MessageSquare size={18} className="mr-2"/> {t('parentDashboard.sections.communication.sendMessage')}
            </Button>
          </CardContent>
        </Card>
      </motion.div>

       {supportPlan && isPlanModalOpen && (
        <DetailedPlanModal
          isOpen={isPlanModalOpen}
          onOpenChange={setIsPlanModalOpen}
          plan={supportPlan}
          currentUserRole="parent"
        />
      )}
    </motion.div>
  );
};

export default ParentDashboard;