import React from 'react';
import { motion } from 'framer-motion';
import { Edit3, Trash2, FileText, AlertTriangle, Loader2, ShieldCheck, ShieldAlert, Clock, UserCheck, CalendarDays, Activity, CheckCircle, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardCard from '@/pages/Dashboard/components/DashboardCard';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, parseISO } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

const cardContainerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
};

const cardItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, type: 'spring', stiffness: 100 } }
};

const SupportPlanList = ({ 
  supportPlans, 
  isLoading, 
  onEditPlan, 
  onDeletePlan,
  onTogglePlanDetail,
  onForceCompletePlan,
  currentUserRole
}) => {
  const { t, language: currentLanguage } = useLanguage();
  const dateLocale = currentLanguage === 'es' ? es : enUS;
  const authorizedRolesForForceComplete = ['psychopedagogue', 'admin', 'program_coordinator'];

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notSpecified');
    try {
      const dateObj = parseISO(dateString);
      return format(dateObj, 'PP', { locale: dateLocale });
    } catch (e) {
      console.warn(`Invalid date format for formatDate: ${dateString}`);
      return t('common.invalidDate');
    }
  };

  const getStatusDisplay = (statusValue) => {
    const statusKey = statusValue ? statusValue.toLowerCase().replace(/\s+/g, '') : 'notAvailable';
    return t(`supportPlans.statusValues.${statusKey}`, statusValue || t('common.notAvailable'));
  };
  
  const getStatusBadgeVariant = (statusValue) => {
    const statusKey = statusValue ? statusValue.toLowerCase().replace(/\s+/g, '') : 'notavailable';
    switch (statusKey) {
      case 'active':
      case 'activo':
      case 'inprogress':
      case 'en_progreso':
      case 'enprogreso':
        return 'success';
      case 'completed':
      case 'completado':
        return 'info';
      case 'draft':
      case 'pendiente':
        return 'warning';
      case 'paused':
      case 'pausado':
        return 'attention';
      case 'cancelled':
      case 'cancelado':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
      </div>
    );
  }

  if (!supportPlans || supportPlans.length === 0) {
    return (
      <motion.div 
        variants={cardItemVariants} 
        initial="hidden" 
        animate="visible" 
        className="text-center py-16 bg-slate-800/50 rounded-xl border border-slate-700 shadow-lg"
      >
        <FileText size={56} className="mx-auto text-sky-400/70 mb-5" />
        <h3 className="text-2xl font-semibold text-slate-200 mb-2">{t('supportPlans.emptyList')}</h3>
        <p className="text-slate-400 max-w-md mx-auto">{t('supportPlans.noPlansForStudent')}</p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={cardContainerVariants} 
      initial="hidden" 
      animate="visible" 
      className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10"
    >
      {supportPlans.map(plan => {
        const canForceComplete = authorizedRolesForForceComplete.includes(currentUserRole) && 
                                 plan.status?.toLowerCase() !== 'completed' && 
                                 plan.status?.toLowerCase() !== 'completado' &&
                                 plan.status?.toLowerCase() !== 'cancelled' &&
                                 plan.status?.toLowerCase() !== 'cancelado';
        return (
          <motion.div variants={cardItemVariants} key={plan.id}>
            <DashboardCard 
              title={plan.student?.full_name || t('common.notSpecified')}
              icon={plan.student?.full_name ? UserCheck : AlertTriangle}
              iconClassName={plan.student?.full_name ? "text-purple-400" : "text-yellow-400"}
              className="flex flex-col h-full bg-gradient-to-br from-slate-800/70 to-slate-900/50 backdrop-blur-md rounded-xl shadow-2xl border border-slate-700 hover:border-purple-500/50 transition-all duration-300"
            >
              <div className="flex-grow space-y-3 text-sm mb-4 p-1">
                <div className="flex items-start">
                  <ShieldCheck size={18} className="mr-2 mt-0.5 text-green-400 flex-shrink-0" />
                  <p><strong className="text-slate-300">{t('supportPlans.goalLabel')}:</strong> <span className="text-slate-400 leading-relaxed">{plan.support_goal || t('common.notSpecified')}</span></p>
                </div>
                <div className="flex items-start">
                   <Activity size={18} className="mr-2 mt-0.5 text-blue-400 flex-shrink-0" />
                   <p><strong className="text-slate-300">{t('supportPlans.strategyLabel')}:</strong> <span className="text-slate-400 leading-relaxed line-clamp-2">{plan.support_strategy || t('common.notSpecified')}</span></p>
                </div>
                 <div className="flex items-center">
                  <Clock size={16} className="mr-2 text-amber-400 flex-shrink-0" />
                  <p><strong className="text-slate-300">{t('supportPlans.statusLabel')}:</strong> 
                    <Badge variant={getStatusBadgeVariant(plan.status)} className="ml-2 text-xs">
                      {getStatusDisplay(plan.status)}
                    </Badge>
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 pt-2 border-t border-slate-700/50 mt-3">
                  <div className="flex items-center">
                    <CalendarDays size={14} className="mr-2 text-sky-400 flex-shrink-0" />
                    <p><strong className="text-slate-300 text-xs">{t('supportPlans.startDateLabel')}:</strong> <span className="text-slate-400 text-xs">{formatDate(plan.start_date)}</span></p>
                  </div>
                  <div className="flex items-center">
                    <CalendarDays size={14} className="mr-2 text-sky-400 flex-shrink-0" />
                    <p><strong className="text-slate-300 text-xs">{t('supportPlans.endDateLabel')}:</strong> <span className="text-slate-400 text-xs">{formatDate(plan.end_date)}</span></p>
                  </div>
                </div>
                <div className="flex items-center pt-1">
                  <UserCheck size={16} className="mr-2 text-pink-400 flex-shrink-0" />
                  <p><strong className="text-slate-300">{t('supportPlans.responsiblePersonLabel')}:</strong> <span className="text-slate-400">{plan.responsible_person_profile?.full_name || t('common.notSpecified')}</span></p>
                </div>
              </div>
              <div className="flex flex-col space-y-2 mt-auto pt-4 border-t border-slate-700/50">
                <div className="flex justify-end space-x-2">
                   <Button variant="ghost" size="sm" onClick={() => onTogglePlanDetail(plan)} className="text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 h-8">
                    <Eye size={15} className="mr-1.5" /> {t('common.viewDetails')}
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => onEditPlan(plan)} className="text-sky-300 border-sky-500 hover:bg-sky-500/20 hover:text-sky-200 transition-colors group h-8">
                    <Edit3 size={15} className="mr-1.5 group-hover:animate-pulse" /> {t('common.editButton')}
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => onDeletePlan(plan)} className="bg-red-600/80 hover:bg-red-500 text-white transition-colors group h-8">
                    <Trash2 size={15} className="mr-1.5 group-hover:animate-shimmer" /> {t('common.deleteButton')}
                  </Button>
                </div>
                {canForceComplete && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onForceCompletePlan(plan)} 
                    className="w-full text-emerald-400 border-emerald-500 hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors group mt-2 h-8"
                  >
                    <CheckCircle size={15} className="mr-1.5 group-hover:scale-110" /> {t('supportPlans.forceCompleteButton')}
                  </Button>
                )}
              </div>
            </DashboardCard>
          </motion.div>
        )
      })}
    </motion.div>
  );
};

export default SupportPlanList;