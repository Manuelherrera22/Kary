import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, ShieldCheck, Loader2, AlertTriangle, FileText, BrainCircuit, Activity, CalendarDays, Clock, UserCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import mockStudentDataService from '@/services/mockStudentDataService';
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
  const { user, userProfile, loading: authLoading } = useMockAuth();
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
      const { data, error } = await mockStudentDataService.getStudentSupportPlans(user.id);

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
            <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
              {supportPlans.map((plan, index) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group relative bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-slate-700/50 hover:border-teal-500/50 transition-all duration-300 hover:shadow-teal-500/10 hover:shadow-2xl"
                >
                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <Badge 
                      variant={getStatusBadgeVariant(plan.status)} 
                      className={`text-xs font-medium px-3 py-1 ${
                        plan.status === 'active' 
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                          : plan.status === 'completed'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                          : 'bg-slate-500/20 text-slate-300 border-slate-500/30'
                      }`}
                    >
                      {getStatusDisplay(plan.status)}
                    </Badge>
                  </div>

                  {/* Header */}
                  <div className="mb-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-gradient-to-br from-teal-500/20 to-emerald-500/20 rounded-xl border border-teal-500/30">
                        <ShieldCheck size={24} className="text-teal-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-100 mb-2 leading-tight">
                          {plan.support_goal || t('studentDashboard.supportPlans.unnamedPlan')}
                        </h3>
                        <p className="text-sm text-slate-400">
                          {t('studentDashboard.supportPlans.details.responsiblePerson')}: {plan.responsible_person_profile?.full_name || t('common.notSpecified')}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Strategy */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-slate-200 mb-2 flex items-center">
                      <BrainCircuit size={16} className="mr-2 text-teal-400" />
                      {t('studentDashboard.supportPlans.details.interventionStrategy')}
                    </h4>
                    <p className="text-slate-300 text-sm leading-relaxed">
                      {plan.support_strategy || t('common.notSpecified')}
                    </p>
                  </div>

                  {/* Plan Details */}
                  {plan.plan_json && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-slate-200 mb-3 flex items-center">
                        <FileText size={16} className="mr-2 text-sky-400" />
                        {t('studentDashboard.supportPlans.details.objectives')}
                      </h4>
                      <div className="space-y-3">
                        {plan.plan_json.objectives && Array.isArray(plan.plan_json.objectives) && (
                          <div className="space-y-2">
                            {plan.plan_json.objectives.map((objective, idx) => (
                              <div key={idx} className="flex items-start gap-2">
                                <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                                <span className="text-slate-300 text-sm">{objective}</span>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {plan.plan_json.activities && Array.isArray(plan.plan_json.activities) && (
                          <div className="mt-4">
                            <h5 className="text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wide">
                              {t('studentDashboard.supportPlans.details.activities')}
                            </h5>
                            <div className="space-y-2">
                              {plan.plan_json.activities.map((activity, idx) => (
                                <div key={idx} className="flex items-start gap-2">
                                  <div className="w-2 h-2 bg-sky-400 rounded-full mt-2 flex-shrink-0"></div>
                                  <span className="text-slate-300 text-sm">{activity}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {plan.plan_json.timeline && (
                          <div className="mt-4 p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                            <div className="flex items-center gap-2">
                              <Clock size={14} className="text-amber-400" />
                              <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
                                {t('studentDashboard.supportPlans.details.timeline')}:
                              </span>
                              <span className="text-amber-300 text-sm font-medium">
                                {plan.plan_json.timeline}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Footer with Dates */}
                  <div className="pt-4 border-t border-slate-700/50">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="flex items-center gap-2 text-slate-400">
                        <CalendarDays size={14} className="text-sky-400" />
                        <div>
                          <div className="text-slate-500">{t('studentDashboard.supportPlans.details.startDate')}</div>
                          <div className="text-slate-300 font-medium">{formatDateSafe(plan.start_date)}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-slate-400">
                        <CalendarDays size={14} className="text-sky-400" />
                        <div>
                          <div className="text-slate-500">{t('studentDashboard.supportPlans.details.endDate')}</div>
                          <div className="text-slate-300 font-medium">{formatDateSafe(plan.end_date)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-700/30">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <Clock size={12} className="text-amber-400" />
                        <span>{t('studentDashboard.supportPlans.details.assignedOn')}: {formatDateSafe(plan.assigned_at)}</span>
                      </div>
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