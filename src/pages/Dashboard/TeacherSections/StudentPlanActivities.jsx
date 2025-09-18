import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ListChecks, User, AlertTriangle, CalendarDays, Clock, Type, Send, Eye } from 'lucide-react';
import ActivityCard from './components/ActivityCard'; 
import ActivityPreviewModal from './components/ActivityPreviewModal';
import { useStudentActivities } from './hooks/useStudentActivities';
import { format, parseISO } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

const StudentPlanActivities = () => {
  const { t, language } = useLanguage();
  const { user, userProfile } = useAuth();
  const [groupedActivities, setGroupedActivities] = useState({});
  const [students, setStudents] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [currentActivitiesForModal, setCurrentActivitiesForModal] = useState([]);
  const [currentStudentForModal, setCurrentStudentForModal] = useState(null);
  const [isLoadingModalActivities, setIsLoadingModalActivities] = useState(false);

  const { fetchActivitiesByTeacher, saveActivities, sendActivitiesToStudent, updateActivity } = useStudentActivities();
  const dateLocale = language === 'es' ? es : enUS;

  const fetchStudentDetails = useCallback(async (studentIds) => {
    if (studentIds.length === 0) return {};
    const { data, error: studentError } = await supabase
      .from('user_profiles')
      .select('id, full_name')
      .in('id', studentIds);
    if (studentError) throw studentError;
    return data.reduce((acc, student) => {
      acc[student.id] = student;
      return acc;
    }, {});
  }, []);

  const loadActivities = useCallback(async () => {
    if (!user || userProfile?.role !== 'teacher') return;
    setIsLoading(true);
    setError(null);
    try {
      const activities = await fetchActivitiesByTeacher(user.id);
      const studentIds = [...new Set(activities.map(act => act.student_id))];
      const studentDetails = await fetchStudentDetails(studentIds);
      setStudents(studentDetails);

      const grouped = activities.reduce((acc, activity) => {
        const studentId = activity.student_id;
        if (!acc[studentId]) {
          acc[studentId] = [];
        }
        acc[studentId].push(activity);
        return acc;
      }, {});
      setGroupedActivities(grouped);
      if (studentIds.length > 0 && !selectedStudentId) {
        setSelectedStudentId(studentIds[0]);
      }
    } catch (err) {
      console.error("Error loading activities:", err);
      setError(err.message);
      toast({ title: t('toasts.error'), description: t('teacherDashboard.errorLoadingActivities'), variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [user, userProfile?.role, fetchActivitiesByTeacher, fetchStudentDetails, t, selectedStudentId]);

  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  const handleEditActivity = (activity) => {
    // This might open a specific edit modal or reuse ActivityPreviewModal for a single activity
    setCurrentStudentForModal(students[activity.student_id]);
    setCurrentActivitiesForModal([activity]); // For now, reusing the modal meant for multiple
    setIsActivityModalOpen(true);
  };
  
  const handleActivityUpdate = async (updatedActivity) => {
    setIsLoadingModalActivities(true);
    try {
      await updateActivity(updatedActivity.id, updatedActivity);
      toast({ title: t('toasts.success'), description: t('teacherDashboard.activityUpdatedSuccess') });
      setIsActivityModalOpen(false);
      loadActivities(); // Refresh list
    } catch (err) {
       toast({ title: t('toasts.error'), description: err.message || t('teacherDashboard.errorUpdatingActivity'), variant: 'destructive' });
    } finally {
      setIsLoadingModalActivities(false);
    }
  };

  const handleSendSingleActivity = async (activity) => {
    setIsLoadingModalActivities(true);
     try {
      await sendActivitiesToStudent([activity], activity.student_id, user.id, activity.support_plan_id);
      toast({ title: t('toasts.success'), description: t('teacherDashboard.activitySentSuccess') });
      setIsActivityModalOpen(false);
      loadActivities(); // Refresh list
    } catch (err) {
       toast({ title: t('toasts.error'), description: err.message || t('teacherDashboard.errorSendingActivity'), variant: 'destructive' });
    } finally {
      setIsLoadingModalActivities(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(parseISO(dateString), 'PPP', { locale: dateLocale });
    } catch (e) {
      return dateString;
    }
  };
  
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'pending_review': return 'warning';
      case 'saved': return 'info';
      case 'sent_to_student': return 'success';
      case 'completed_by_student': return 'default';
      case 'archived': return 'secondary';
      default: return 'outline';
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-slate-900">
        <Loader2 className="h-16 w-16 animate-spin text-purple-400" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-900 text-white p-4">
        <AlertTriangle size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">{t('common.error')}</h1>
        <p className="text-slate-400 mb-6">{error}</p>
        <Button onClick={loadActivities} variant="outline" className="text-sky-400 border-sky-500 hover:bg-sky-500/20">
          {t('common.retryButton')}
        </Button>
      </div>
    );
  }
  
  const studentTabs = Object.keys(groupedActivities);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 min-h-screen text-white"
    >
      <div className="container mx-auto max-w-6xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400 flex items-center">
            <ListChecks size={32} className="mr-3" />
            {t('teacherDashboard.manageActivitiesTitle')}
          </h1>
          <p className="text-slate-400">{t('teacherDashboard.manageActivitiesSubtitle')}</p>
        </header>

        {studentTabs.length === 0 ? (
          <div className="text-center py-16 bg-slate-800/50 rounded-xl border border-slate-700 shadow-lg">
            <User size={56} className="mx-auto text-sky-400/70 mb-5" />
            <h3 className="text-2xl font-semibold text-slate-200 mb-2">{t('teacherDashboard.noActivitiesFound')}</h3>
            <p className="text-slate-400 max-w-md mx-auto">{t('teacherDashboard.generateActivitiesPrompt')}</p>
          </div>
        ) : (
          <Tabs value={selectedStudentId || studentTabs[0]} onValueChange={setSelectedStudentId} className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:flex md:flex-wrap bg-slate-800/70 p-1.5 rounded-lg border border-slate-700 mb-6">
              {studentTabs.map(studId => (
                <TabsTrigger key={studId} value={studId} className="flex-1 data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-sky-500/50 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all px-3 py-2 text-xs sm:text-sm">
                  <User size={14} className="mr-2 hidden sm:inline" /> {students[studId]?.full_name || t('common.unknownStudent')}
                </TabsTrigger>
              ))}
            </TabsList>

            {studentTabs.map(studId => (
              <TabsContent key={studId} value={studId}>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {groupedActivities[studId]?.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map(activity => (
                    <Card key={activity.id} className="bg-slate-800/60 border-slate-700 hover:border-purple-500/60 transition-all duration-300">
                      <CardHeader className="pb-3">
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg text-slate-100">{activity.title}</CardTitle>
                          <Badge variant={getStatusBadgeVariant(activity.status)} className="text-xs">
                            {t(`teacherDashboard.activityStatus.${activity.status}`, activity.status)}
                          </Badge>
                        </div>
                         <CardDescription className="text-xs text-slate-400 flex items-center pt-1">
                            <Type size={12} className="mr-1.5 text-sky-400"/> {t(`teacherDashboard.activityTypes.${activity.type}`, activity.type)}
                            <span className="mx-2 text-slate-600">|</span>
                            <CalendarDays size={12} className="mr-1.5 text-amber-400"/> {t('teacherDashboard.dueDateLabel')}: {formatDate(activity.due_date)}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-slate-300 mb-3 line-clamp-3">{activity.description}</p>
                        <div className="text-xs text-slate-500 space-x-3">
                           <span>{t('common.createdAt')}: {formatDate(activity.created_at)}</span>
                           {activity.sent_at && <span>{t('teacherDashboard.sentOn')}: {formatDate(activity.sent_at)}</span>}
                           {activity.received_at && <span>{t('teacherDashboard.receivedOn')}: {formatDate(activity.received_at)}</span>}
                        </div>
                        <div className="flex justify-end gap-2 mt-3 pt-3 border-t border-slate-700/50">
                           <Button variant="outline" size="sm" onClick={() => handleEditActivity(activity)} className="text-sky-400 border-sky-500 hover:bg-sky-500/10">
                              <Eye size={16} className="mr-1.5"/> {t('common.viewEditButton')}
                           </Button>
                           {activity.status !== 'sent_to_student' && (
                             <Button 
                               variant="default" 
                               size="sm" 
                               onClick={() => handleSendSingleActivity(activity)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                               <Send size={16} className="mr-1.5"/> {t('teacherDashboard.sendToStudentButton')}
                             </Button>
                           )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </motion.div>
              </TabsContent>
            ))}
          </Tabs>
        )}
         {isActivityModalOpen && currentStudentForModal && (
            <ActivityPreviewModal
            isOpen={isActivityModalOpen}
            onOpenChange={setIsActivityModalOpen}
            studentName={currentStudentForModal.full_name}
            activities={currentActivitiesForModal} // Pass as array
            isLoading={isLoadingModalActivities}
            onSave={handleActivityUpdate} // For editing single activity
            onSend={handleSendSingleActivity} // For sending single activity
            isSingleEditMode={currentActivitiesForModal.length === 1} // Indicate single edit mode
            />
        )}
      </div>
    </motion.div>
  );
};

export default StudentPlanActivities;