import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Loader2, AlertTriangle, FileText, BrainCircuit, Activity, CalendarDays, Clock, UserCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { format, parseISO } from 'date-fns';
import { es, enUS } from 'date-fns/locale'; 
import { Badge } from '@/components/ui/badge';
import MagicBackground from '@/pages/Dashboard/StudentDashboard/components/MagicBackground';

const blockIcons = {
  diagnosis: FileText,
  recommendations: BrainCircuit,
  emotionalSupport: Activity,
  familyTips: UserCheck,
  trackingIndicators: Clock,
  custom: FileText,
  default: FileText,
};

const StudentSupportPlansPage = () => {
  const { t, language } = useLanguage(); 
  const { user, userProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [supportPlans, setSupportPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const dateLocale = language === 'es' ? es : enUS; 

  const fetchStudentSupportPlans = useCallback(async () => {
    if (authLoading || !user || !userProfile || userProfile.role !== 'student') {
      setIsLoading(userProfile?.role === 'student'); 
      if (userProfile && userProfile.role !== 'student') {
        setSupportPlans([]);
        setIsLoading(false);
      }
      return;
    }
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_plans')
        .select(`
          id,
          created_at,
          plan_json,
          support_goal,
          support_strategy,
          start_date,
          end_date,
          status,
          type,
          assigned,
          assigned_at,
          responsible_person_profile:user_profiles!responsible_person(id, full_name)
        `)
        .eq('student_id', user.id)
        .eq('assigned', true) 
        .order('assigned_at', { ascending: false });

      if (error) throw error;
      setSupportPlans(data || []);
    } catch (error) {
      console.error('Error fetching student support plans:', error);
      toast({
        title: t('toast.errorTitle'),
        description: t('studentDashboard.supportPlans.errorFetching'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [user, userProfile, authLoading, t, toast]);

  useEffect(() => {
    fetchStudentSupportPlans();
  }, [fetchStudentSupportPlans]);

  const formatDateSafe = (dateString) => {
    if (!dateString) return t('common.notAvailable'); 
    try {
      const parsedDate = parseISO(dateString);
      if (isNaN(parsedDate.getTime())) { 
          throw new Error("Invalid date");
      }
      return format(parsedDate, 'PPP', { locale: dateLocale });
    } catch (e) {
      console.warn(`Invalid date format for formatDateSafe: ${dateString}. Error: ${e.message}`);
      return t('common.invalidDate');
    }
  };
  
  const getStatusDisplay = (statusValue) => {
    const statusKey = statusValue ? statusValue.toLowerCase().replace(/\s+/g, '') : 'notavailable';
    return t(`supportPlans.statusValues.${statusKey}`, statusValue || t('common.notAvailable'));
  };

  const getStatusBadgeVariant = (statusValue) => {
    const statusKey = statusValue ? statusValue.toLowerCase().replace(/\s+/g, '') : 'notavailable';
    switch (statusKey) {
      case 'active': return 'success';
      case 'completed': return 'info';
      case 'inprogress': return 'warning';
      case 'paused': return 'attention';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  if (authLoading && isLoading) {
    return (
      <MagicBackground>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-sky-400" />
        </div>
      </MagicBackground>
    );
  }

  return (
    <MagicBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6"
      >
        <div className="container mx-auto max-w-4xl">
          <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-6 transition-colors group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            {t('common.backToDashboard')}
          </Link>

          <header className="page-header">
            <h1 className="page-title bg-gradient-to-r from-teal-400 to-emerald-300">
              <ShieldCheck size={36} className="mr-3" />
              {t('studentDashboard.supportPlans.pageTitle')}
            </h1>
            <p className="page-subtitle">{t('studentDashboard.supportPlans.pageSubtitle')}</p>
          </header>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-teal-400" />
              <p className="ml-2">{t('common.loadingData')}</p>
            </div>
          ) : supportPlans.length === 0 ? (
            <div className="bg-slate-800/50 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-slate-700/50 text-center">
              <AlertTriangle size={48} className="text-teal-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-slate-200 mb-2">{t('studentDashboard.supportPlans.noPlansTitle')}</h2>
              <p className="text-slate-400">{t('studentDashboard.supportPlans.noPlansSubtitle')}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {supportPlans.map(plan => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-800/60 backdrop-blur-md p-6 rounded-xl shadow-xl border border-slate-700/60 hover:border-slate-600/80 transition-all"
                >
                  <div className="flex justify-between items-start mb-3">
                      <div>
                          <h3 className="text-xl font-semibold text-teal-300">{plan.support_goal || t('studentDashboard.supportPlans.unnamedPlan')}</h3>
                          <p className="text-xs text-slate-400">
                              {t('supportPlans.statusLabel')}: <Badge variant={getStatusBadgeVariant(plan.status)} className="ml-1 text-xs">{getStatusDisplay(plan.status)}</Badge>
                          </p>
                      </div>
                      <ShieldCheck size={24} className="text-teal-400 flex-shrink-0" />
                  </div>
                  
                  <div className="space-y-2 text-sm text-slate-300 mb-4">
                      <p><strong className="font-medium text-slate-200">{t('supportPlans.strategyLabel')}:</strong> {plan.support_strategy || t('common.notSpecified')}</p>
                      <p><strong className="font-medium text-slate-200">{t('supportPlans.responsiblePersonLabel')}:</strong> {plan.responsible_person_profile?.full_name || t('common.notSpecified')}</p>
                  </div>

                  {plan.plan_json?.steps && Array.isArray(plan.plan_json.steps) && plan.plan_json.steps.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-slate-700/50">
                      <h4 className="text-md font-semibold text-sky-300 mb-3">{t('supportPlans.detailModal.detailedPlanTitle')}</h4>
                      <div className="space-y-3">
                        {plan.plan_json.steps.map((step, index) => {
                          const IconComponent = blockIcons[step.key] || blockIcons.default;
                          return (
                            <div key={step.id || index} className="p-3 bg-slate-700/50 rounded-lg border border-slate-600/70">
                              <h5 className="text-sm font-semibold text-sky-200 mb-1 flex items-center">
                                <IconComponent size={16} className="mr-2 text-sky-300" />
                                {step.title || t('supportPlans.pdf.unnamedStep')}
                              </h5>
                              <p className="text-slate-300 whitespace-pre-wrap text-xs">{typeof step.content === 'string' ? step.content : JSON.stringify(step.content, null, 2)}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                   {(plan.plan_json && typeof plan.plan_json === 'object' && !plan.plan_json.steps && Object.keys(plan.plan_json).length > 0) && (
                      <div className="mt-4 pt-4 border-t border-slate-700/50">
                          <h4 className="text-md font-semibold text-sky-300 mb-3">{t('supportPlans.detailModal.detailedPlanTitle')}</h4>
                          <div className="p-3 bg-slate-700/50 rounded-lg border border-slate-600/70">
                              <pre className="text-slate-300 whitespace-pre-wrap text-xs">{JSON.stringify(plan.plan_json, null, 2)}</pre>
                          </div>
                      </div>
                   )}


                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400 border-t border-slate-700/50 pt-3 mt-4">
                    <div className="flex items-center">
                      <CalendarDays size={14} className="mr-1.5 text-sky-400"/>
                      <span>{t('supportPlans.startDateLabel')}: {formatDateSafe(plan.start_date)}</span>
                    </div>
                    <div className="flex items-center">
                      <CalendarDays size={14} className="mr-1.5 text-sky-400"/>
                      <span>{t('supportPlans.endDateLabel')}: {formatDateSafe(plan.end_date)}</span>
                    </div>
                     <div className="flex items-center col-span-1 sm:col-span-2">
                      <Clock size={14} className="mr-1.5 text-amber-400"/>
                      <span>{t('supportPlans.assignedAtLabel', 'Asignado el')}: {formatDateSafe(plan.assigned_at)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </MagicBackground>
  );
};

export default StudentSupportPlansPage;