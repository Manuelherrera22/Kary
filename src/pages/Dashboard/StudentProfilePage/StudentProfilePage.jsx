import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { ArrowLeft, User, Edit3, Activity, BookOpen, Shield, MessageSquare, Brain, Info, Users, TrendingUp, FileText, Target, Eye, Mic, StickyNote, AlertTriangle, HelpCircle, Settings, Bell, Lightbulb, HeartHandshake } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';

import StudentGeneralInfo from '@/pages/Dashboard/StudentProfilePage/components/StudentGeneralInfo';
import TeacherObservationsSection from '@/pages/Dashboard/StudentProfilePage/components/TeacherObservationsSection';
import StudentMultidisciplinaryTracking from '@/pages/Dashboard/StudentProfilePage/components/StudentMultidisciplinaryTracking';
import StudentPiarSection from '@/pages/Dashboard/StudentProfilePage/components/StudentPiarSection';
import StudentLifeProjectSection from '@/pages/Dashboard/StudentProfilePage/components/StudentLifeProjectSection';
import StudentSpecialDataSection from '@/pages/Dashboard/StudentProfilePage/components/StudentSpecialDataSection';
import StudentFutureAISection from '@/pages/Dashboard/StudentProfilePage/components/StudentFutureAISection';
import StudentNotificationTimeline from '@/pages/Dashboard/StudentProfilePage/components/StudentNotificationTimeline';
import SupportPlanAISection from './components/SupportPlanAISection';
import EmotionalSupportPlanSection from './components/EmotionalSupportPlanSection';

const StudentProfilePage = () => {
  const { studentId } = useParams();
  const { user, userProfile, loading: authLoading } = useMockAuth();
  const { t, language } = useLanguage();
  const navigate = useNavigate();

  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("general");
  
  const currentUserRole = userProfile?.role;

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!studentId) {
        setError(t('studentProfilePage.errorNoStudentId'));
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const { data, error: studentError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('id', studentId)
          .single();

        if (studentError) throw studentError;
        if (!data) throw new Error(t('studentProfilePage.errorStudentNotFound'));
        
        setStudentData(data);
      } catch (err) {
        console.error("Error fetching student data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) {
        fetchStudentData();
    }
  }, [studentId, authLoading, user, t]);

  const canViewPiar = ['teacher', 'psychopedagogue', 'program_coordinator', 'admin', 'directive'].includes(currentUserRole);
  const canEditPiar = ['teacher', 'psychopedagogue', 'program_coordinator', 'admin'].includes(currentUserRole);
  
  const canViewLifeProject = ['teacher', 'psychopedagogue', 'program_coordinator', 'admin', 'directive', 'parent', 'student'].includes(currentUserRole);
  const canEditLifeProject = ['teacher', 'psychopedagogue', 'program_coordinator', 'admin'].includes(currentUserRole);

  const canViewSpecialData = ['teacher', 'psychopedagogue', 'program_coordinator', 'admin', 'directive'].includes(currentUserRole);
  const canEditSpecialData = ['teacher', 'psychopedagogue', 'program_coordinator', 'admin'].includes(currentUserRole);

  const canViewObservations = ['teacher', 'psychopedagogue', 'program_coordinator', 'admin', 'directive'].includes(currentUserRole);
  const canAddObservations = ['teacher', 'psychopedagogue'].includes(currentUserRole);

  const canViewMultidisciplinaryTracking = ['psychopedagogue', 'program_coordinator', 'admin', 'directive', 'parent'].includes(currentUserRole);
  const canViewFutureAI = ['teacher', 'psychopedagogue', 'program_coordinator', 'admin', 'directive'].includes(currentUserRole);
  const canViewNotifications = true;
  const canGenerateAiPlan = ['psychopedagogue', 'directive', 'admin'].includes(currentUserRole); // Psychopedagogue and Directive can generate AI plans
  const canViewStudentEmotionalPlan = ['student', 'parent', 'psychopedagogue', 'directive', 'admin', 'teacher', 'program_coordinator'].includes(currentUserRole); // All roles can view this new section


  if (loading || authLoading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
        <AlertTriangle size={64} className="text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">{t('studentProfilePage.errorLoadingTitle')}</h1>
        <p className="text-slate-400 mb-6">{error}</p>
        <Button onClick={() => navigate('/dashboard')} variant="outline" className="text-sky-400 border-sky-500 hover:bg-sky-500/20">
          <ArrowLeft size={18} className="mr-2" /> {t('common.backToDashboard')}
        </Button>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
        <HelpCircle size={64} className="text-yellow-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">{t('studentProfilePage.noStudentDataTitle')}</h1>
        <p className="text-slate-400 mb-6">{t('studentProfilePage.noStudentDataDescription')}</p>
        <Button onClick={() => navigate('/dashboard')} variant="outline" className="text-sky-400 border-sky-500 hover:bg-sky-500/20">
          <ArrowLeft size={18} className="mr-2" /> {t('common.backToDashboard')}
        </Button>
      </div>
    );
  }

  const profilePageTitle = t('studentProfilePage.pageTitle', { studentName: studentData.full_name || t('common.student') });

  const tabItems = [
    { value: "general", labelKey: "studentProfilePage.tabs.general", icon: User, component: <StudentGeneralInfo studentData={studentData} currentUserRole={currentUserRole} /> },
    ...(canViewStudentEmotionalPlan ? [{ value: "emotionalSupport", labelKey: "studentProfilePage.tabs.emotionalSupport", icon: HeartHandshake, component: <EmotionalSupportPlanSection studentId={studentId} studentName={studentData.full_name} /> }] : []),
    ...(canGenerateAiPlan ? [{ value: "aiSupportPlan", labelKey: "supportPlans.aiGenerator.tabTitle", ns: 'supportPlans', icon: Lightbulb, component: <SupportPlanAISection studentId={studentId} studentName={studentData.full_name} /> }] : []),
    ...(canViewObservations ? [{ value: "observations", labelKey: "studentProfilePage.tabs.observations", icon: Edit3, component: <TeacherObservationsSection studentId={studentId} studentName={studentData.full_name} currentUserRole={currentUserRole} canAddObservations={canAddObservations} /> }] : []),
    ...(canViewMultidisciplinaryTracking ? [{ value: "multidisciplinary", labelKey: "studentProfilePage.tabs.multidisciplinary", icon: Users, component: <StudentMultidisciplinaryTracking studentId={studentId} currentUserRole={currentUserRole} /> }] : []),
    ...(canViewPiar ? [{ value: "piar", labelKey: "studentProfilePage.tabs.piar", icon: FileText, component: <StudentPiarSection studentData={studentData} studentId={studentId} canEditPiar={canEditPiar} currentUserRole={currentUserRole}/> }] : []),
    ...(canViewLifeProject ? [{ value: "lifeProject", labelKey: "studentProfilePage.tabs.lifeProject", icon: Target, component: <StudentLifeProjectSection studentData={studentData} studentId={studentId} canEditLifeProject={canEditLifeProject} currentUserRole={currentUserRole}/> }] : []),
    ...(canViewSpecialData ? [{ value: "specialData", labelKey: "studentProfilePage.tabs.specialData", icon: Mic, component: <StudentSpecialDataSection studentData={studentData} studentId={studentId} canEditSpecialData={canEditSpecialData} currentUserRole={currentUserRole}/> }] : []),
    ...(canViewFutureAI ? [{ value: "futureAI", labelKey: "studentProfilePage.tabs.futureAI", icon: Brain, component: <StudentFutureAISection studentId={studentId} currentUserRole={currentUserRole}/> }] : []),
    ...(canViewNotifications ? [{ value: "notifications", labelKey: "studentProfilePage.tabs.notifications", icon: Bell, component: <StudentNotificationTimeline estudianteId={studentId} /> }] : [])
  ];
  

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen"
    >
      <div className="container mx-auto">
        <Link to="/dashboard/progress-quick-access" className="inline-flex items-center text-slate-300 hover:text-sky-400 mb-8 group transition-colors"> {/* Increased mb from 6 to 8 */}
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
          {t('common.backToList')}
        </Link>

        <header className="mb-12"> {/* Increased mb from 10 to 12 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-6 bg-slate-800/70 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700/60">
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">{profilePageTitle}</h1>
              <p className="text-slate-400">{t('studentProfilePage.pageSubtitle')}</p>
            </div>
            { currentUserRole === 'admin' && studentData &&
                <Link to={`/dashboard/user-management?editUser=${studentData.id}`}>
                    <Button variant="outline" className="text-amber-400 border-amber-500 hover:bg-amber-500/20">
                        <Settings size={18} className="mr-2"/> {t('studentProfilePage.adminEditProfileButton')}
                    </Button>
                </Link>
            }
          </div>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-12"> {/* Increased mt from 8 to 12 */}
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:flex lg:flex-wrap bg-slate-800/70 backdrop-blur-md p-2 rounded-lg shadow-md border border-slate-700/50 mb-10"> {/* Increased mb from 8 to 10 */}
            {tabItems.map(tab => (
              <TooltipProvider key={tab.value} delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <TabsTrigger 
                      value={tab.value} 
                      className="flex-1 data-[state=active]:bg-sky-600 data-[state=active]:text-white data-[state=active]:shadow-sky-500/50 text-slate-300 hover:bg-slate-700/50 hover:text-white transition-all px-3 py-2.5 text-xs sm:text-sm"
                    >
                      <tab.icon size={16} className="mr-0 sm:mr-2" />
                      <span className="hidden sm:inline">{t(tab.labelKey, { ns: tab.ns || 'studentProfilePage' })}</span>
                    </TabsTrigger>
                  </TooltipTrigger>
                  <TooltipContent className="sm:hidden bg-slate-700 text-white border-slate-600">
                    {t(tab.labelKey, { ns: tab.ns || 'studentProfilePage' })}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </TabsList>

          {tabItems.map(tab => (
            <TabsContent key={tab.value} value={tab.value}>
              <motion.div
                key={tab.value} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                {tab.component}
              </motion.div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </motion.div>
  );
};

export default StudentProfilePage;