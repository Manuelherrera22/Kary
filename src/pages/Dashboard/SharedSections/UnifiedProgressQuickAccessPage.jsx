import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChartBig, MessageSquare as MessageSquareText, Smile, BookOpen, FileText, History as HistoryIcon, ArrowRight } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import DashboardCard from '@/pages/Dashboard/components/DashboardCard';
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';

const UnifiedProgressQuickAccessPage = () => {
  const { t, currentLanguage } = useLanguage();
  const { userProfile, primaryChildId, loading: authLoading } = useMockAuth();
  const { toast } = useToast();
  
  const [progressSummary, setProgressSummary] = useState(null);
  const [recentInteractions, setRecentInteractions] = useState([]);
  const [recentReports, setRecentReports] = useState([]);
  const [upcomingAppointments, setUpcomingAppointments] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const dateLocale = currentLanguage === 'es' ? es : undefined;

  useEffect(() => {
    const fetchChildData = async () => {
      if (authLoading) {
        setIsLoadingData(true);
        return;
      }
      
      if (!userProfile || userProfile.role !== 'parent') {
         setIsLoadingData(false);
         if (userProfile && userProfile.role !== 'parent') {
             toast({ title: t('toast.errorTitle'), description: t('toast.unauthorizedAccess'), variant: "destructive" });
         }
        return;
      }
      
      if (!primaryChildId) {
        setIsLoadingData(false);
        if(userProfile.role === 'parent') {
          toast({ title: t('toast.infoTitle'), description: t('dashboard.noChildLinkedForUnifiedView'), variant: "default" });
        }
        return;
      }
      
      setIsLoadingData(true);
      try {
        const { data: progressData, error: progressError } = await supabase
          .from('progreso_estudiante_resumen')
          .select('*')
          .eq('estudiante_id', primaryChildId)
          .order('periodo', { ascending: false })
          .maybeSingle(); 
          
        if (progressError) {
            throw progressError;
        }
        setProgressSummary(progressData);

        const { data: interactionsData, error: interactionsError } = await supabase
          .from('interacciones_hijos')
          .select('*')
          .eq('estudiante_id', primaryChildId)
          .order('fecha', { ascending: false })
          .limit(3);
        if (interactionsError) throw interactionsError;
        setRecentInteractions(interactionsData || []);
        
        const { data: reportsData, error: reportsError } = await supabase
          .from('reportes_estudiante')
          .select('id, titulo, fecha, categoria')
          .eq('estudiante_id', primaryChildId)
          .order('fecha', { ascending: false })
          .limit(2);
        if (reportsError) throw reportsError;
        setRecentReports(reportsData || []);

        const today = new Date().toISOString().split('T')[0];
        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('id, appointment_date, appointment_time_slot, reason, status')
          .eq('parent_user_id', userProfile.id) 
          .gte('appointment_date', today)
          .order('appointment_date', { ascending: true })
          .order('appointment_time_slot', { ascending: true })
          .limit(2);
        if (appointmentsError) throw appointmentsError;
        setUpcomingAppointments(appointmentsData || []);

      } catch (error) {
        console.error('Error fetching unified progress data:', error);
        toast({
          title: t('toast.errorTitle'),
          description: t('dashboard.errorFetchingUnifiedProgress') + (error.message ? `: ${error.message}` : ''),
          variant: "destructive",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    fetchChildData();
  }, [userProfile, primaryChildId, authLoading, t, toast, currentLanguage]);
  
  if (authLoading || isLoadingData) {
    return <LoadingScreen text={t('common.loadingText')} />;
  }

  const renderLink = (to, textKey, color) => (
    <Link to={to} className={`inline-flex items-center text-sm font-medium ${color} group-hover:underline`}>
      {t(textKey)}
      <ArrowRight size={16} className="ml-1.5 transform transition-transform duration-200 group-hover:translate-x-1" />
    </Link>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-gray-800 via-slate-800 to-neutral-900 min-h-screen text-white"
    >
      <div className="container mx-auto max-w-4xl">
        <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {t('common.backToDashboard')}
        </Link>

        <div className="bg-slate-700/30 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-600">
          <div className="flex items-center mb-8">
            <Smile size={36} className="mr-4 text-pink-400" />
            <div>
              <h1 className="text-3xl font-bold">{t('dashboards.parent.unified.pageTitle')}</h1>
              <p className="text-slate-400">{t('dashboards.parent.unified.pageSubtitle')}</p>
            </div>
          </div>

          {!primaryChildId && userProfile?.role === 'parent' && 
            <div className="text-center py-10">
              <p className="text-yellow-400 text-xl">{t('dashboard.noChildLinkedForUnifiedView')}</p>
              <p className="text-sm text-slate-500 mt-1">{t('dashboard.contactInstitution')}</p>
            </div>
          }
          
          {primaryChildId && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DashboardCard 
                title={t('dashboards.parent.unified.progressSummaryCardTitle')} 
                icon={BarChartBig} 
                color="text-sky-400"
                bgColor="bg-sky-500/10"
                hoverBgColor="hover:bg-sky-500/20"
              >
                {progressSummary ? (
                  <div className="space-y-3">
                    <p className="text-sm text-slate-300"><strong className="text-sky-300">{t('common.period')}:</strong> {progressSummary.periodo}</p>
                    <div>
                      <h4 className="text-md font-medium text-slate-200 flex items-center mb-1">
                        <BookOpen size={16} className="mr-2 text-emerald-300" /> {t('common.academicSummary')}
                      </h4>
                      <p className="text-sm text-slate-400 whitespace-pre-wrap">{progressSummary.resumen_academico || t('common.notSpecified')}</p>
                    </div>
                    <div>
                      <h4 className="text-md font-medium text-slate-200 flex items-center mb-1">
                        <Smile size={16} className="mr-2 text-yellow-300" /> {t('common.emotionalSummary')}
                      </h4>
                      <p className="text-sm text-slate-400 whitespace-pre-wrap">{progressSummary.resumen_emocional || t('common.notSpecified')}</p>
                    </div>
                    <div className="mt-auto pt-3 border-t border-slate-700/50">
                      {renderLink("/dashboard/student-progress", "common.viewDetailsButton", "text-pink-400")}
                    </div>
                  </div>
                ) : <p className="text-slate-400">{t('common.noDataAvailable')}</p>}
              </DashboardCard>

              <DashboardCard 
                title={t('dashboards.parent.unified.recentInteractionsCardTitle')} 
                icon={MessageSquareText}
                color="text-purple-400"
                bgColor="bg-purple-500/10"
                hoverBgColor="hover:bg-purple-500/20"
              >
                {recentInteractions.length > 0 ? (
                  <ul className="space-y-2">
                    {recentInteractions.map(interaction => (
                      <li key={interaction.id} className="text-sm p-2 bg-slate-700/50 rounded-md">
                        <p className="text-purple-300 font-medium">{interaction.tipo || t('common.notSpecified')}</p>
                        <p className="text-slate-400 truncate">{interaction.descripcion || t('common.notSpecified')}</p>
                        <p className="text-xs text-slate-500">{interaction.fecha ? format(new Date(interaction.fecha), 'P p', { locale: dateLocale }) : t('common.notSpecified')}</p>
                      </li>
                    ))}
                    <div className="mt-auto pt-3 border-t border-slate-700/50">
                     {renderLink("/dashboard/child-interactions", "common.viewDetailsButton", "text-pink-400")}
                    </div>
                  </ul>
                ) : <p className="text-slate-400">{t('common.noDataAvailable')}</p>}
              </DashboardCard>

              <DashboardCard 
                title={t('dashboards.parent.unified.recentReportsCardTitle')} 
                icon={FileText}
                color="text-emerald-400"
                bgColor="bg-emerald-500/10"
                hoverBgColor="hover:bg-emerald-500/20"
              >
                {recentReports.length > 0 ? (
                  <ul className="space-y-2">
                    {recentReports.map(report => (
                      <li key={report.id} className="text-sm p-2 bg-slate-700/50 rounded-md">
                        <p className="text-emerald-300 font-medium">{report.titulo || t('common.notSpecified')}</p>
                        <p className="text-slate-400">{t('common.category')}: {report.categoria || t('common.notSpecified')}</p>
                        <p className="text-xs text-slate-500">{report.fecha ? format(new Date(report.fecha), 'P', { locale: dateLocale }) : t('common.notSpecified')}</p>
                      </li>
                    ))}
                    <div className="mt-auto pt-3 border-t border-slate-700/50">
                      {renderLink("/dashboard/access-reports", "common.viewDetailsButton", "text-pink-400")}
                    </div>
                  </ul>
                ) : <p className="text-slate-400">{t('common.noDataAvailable')}</p>}
              </DashboardCard>

              <DashboardCard 
                title={t('dashboards.parent.unified.upcomingAppointmentsCardTitle')} 
                icon={HistoryIcon}
                color="text-yellow-400"
                bgColor="bg-yellow-500/10"
                hoverBgColor="hover:bg-yellow-500/20"
              >
                {upcomingAppointments.length > 0 ? (
                  <ul className="space-y-2">
                    {upcomingAppointments.map(appt => (
                      <li key={appt.id} className="text-sm p-2 bg-slate-700/50 rounded-md">
                        <p className="text-yellow-300 font-medium">{appt.reason || t('common.notSpecified')}</p>
                        <p className="text-slate-400">
                          {appt.appointment_date ? format(new Date(appt.appointment_date), 'P', { locale: dateLocale }) : t('common.notSpecified')} - {appt.appointment_time_slot || t('common.notSpecified')}
                        </p>
                        <p className="text-xs text-slate-500 capitalize">{t('appointments.statusLabel')}: {t(`appointments.status.${appt.status || 'unknown'}`)}</p>
                      </li>
                    ))}
                     <div className="mt-auto pt-3 border-t border-slate-700/50">
                      {renderLink("/dashboard/appointment-history", "common.viewDetailsButton", "text-pink-400")}
                    </div>
                  </ul>
                ) : <p className="text-slate-400">{t('common.noDataAvailable')}</p>}
                 <div className="mt-3">
                    {renderLink("/dashboard/schedule-appointment", "dashboards.parent.scheduleAppointmentTitle", "text-sky-400")}
                 </div>
              </DashboardCard>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default UnifiedProgressQuickAccessPage;