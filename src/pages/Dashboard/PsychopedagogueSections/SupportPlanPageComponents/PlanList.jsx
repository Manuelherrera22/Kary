import React from 'react';
import { motion } from 'framer-motion';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2, Eye, FileText, Users, CalendarDays, CheckCircle, XCircle, AlertTriangle, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { format, parseISO, isValid } from 'date-fns';
import { es, enUS } from 'date-fns/locale';

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

const getStatusBadgeVariant = (status) => {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'inprogress':
    case 'en_progreso':
      return 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30';
    case 'completed':
    case 'completado':
      return 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30';
    case 'draft':
    case 'pendiente':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30';
    case 'cancelled':
    case 'paused':
      return 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30';
    default:
      return 'bg-slate-600/30 text-slate-300 border-slate-500/40 hover:bg-slate-600/40';
  }
};

const SupportPlanList = ({ supportPlans, isLoading, onEditPlan, onDeletePlan, onTogglePlanDetail }) => {
  const { t, language } = useLanguage();
  const dateLocale = language === 'es' ? es : enUS;

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notAvailableShort');
    try {
      const date = parseISO(dateString);
      if (!isValid(date)) return t('common.invalidDate');
      return format(date, 'dd MMM yyyy', { locale: dateLocale });
    } catch (error) {
      return dateString; 
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700/70 animate-pulse"
            variants={itemVariants}
          >
            <div className="h-6 bg-slate-700 rounded w-3/4 mb-3"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2 mb-4"></div>
            <div className="flex justify-between items-center mb-4">
              <div className="h-4 bg-slate-700 rounded w-1/3"></div>
              <div className="h-8 bg-slate-700 rounded w-1/4"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-slate-700 rounded w-full"></div>
              <div className="h-4 bg-slate-700 rounded w-5/6"></div>
            </div>
            <div className="mt-5 flex justify-end space-x-2">
              <div className="h-9 w-20 bg-slate-700 rounded"></div>
              <div className="h-9 w-20 bg-slate-700 rounded"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (!supportPlans || supportPlans.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-12 p-10 bg-slate-700/30 border border-slate-600/50 rounded-xl text-center shadow-xl"
      >
        <FileText size={48} className="mx-auto text-sky-500 mb-5" />
        <p className="text-2xl text-slate-100 font-semibold mb-2">{t('supportPlans.emptyList')}</p>
        <p className="text-slate-400">{t('supportPlans.noPlansForStudent')}</p>
      </motion.div>
    );
  }

  return (
    <div className="mt-8 flow-root">
      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
          <Table className="min-w-full divide-y divide-slate-700/60 border-separate border-spacing-0">
            <TableHeader>
              <TableRow>
                <TableHead className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-slate-300 sm:pl-0 sticky left-0 bg-slate-800/80 backdrop-blur-sm z-10">{t('supportPlans.tableHeaderGoal')}</TableHead>
                <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-slate-300">{t('supportPlans.tableHeaderStatus')}</TableHead>
                <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-slate-300 hidden md:table-cell">{t('supportPlans.tableHeaderStartDate')}</TableHead>
                <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-slate-300 hidden lg:table-cell">{t('supportPlans.tableHeaderEndDate')}</TableHead>
                <TableHead className="px-3 py-3.5 text-left text-sm font-semibold text-slate-300 hidden md:table-cell">{t('psychopedagoguePlans.responsible')}</TableHead>
                <TableHead className="relative py-3.5 pl-3 pr-4 sm:pr-0 text-right text-sm font-semibold text-slate-300 sticky right-0 bg-slate-800/80 backdrop-blur-sm z-10">
                  <span className="sr-only">{t('supportPlans.tableHeaderActions')}</span>
                  {t('supportPlans.tableHeaderActions')}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-slate-800">
              {supportPlans.map((plan) => (
                <TableRow key={plan.id} className="hover:bg-slate-700/30 transition-colors group">
                  <TableCell className="py-4 pl-4 pr-3 text-sm sm:pl-0 sticky left-0 bg-slate-800/80 backdrop-blur-sm group-hover:bg-slate-700/40 transition-colors z-10">
                    <div className="font-medium text-slate-100 truncate max-w-xs" title={plan.support_goal || t('supportPlans.unnamedPlan')}>
                      {plan.support_goal || t('supportPlans.unnamedPlan')}
                    </div>
                    <div className="mt-1 text-slate-400 text-xs md:hidden">{formatDate(plan.start_date)}</div>
                  </TableCell>
                  <TableCell className="px-3 py-4 text-sm text-slate-400">
                    <Badge variant="outline" className={getStatusBadgeVariant(plan.status)}>
                      {t(`supportPlans.statusValues.${plan.status?.toLowerCase().replace(/\s+/g, '') || 'notavailable'}`, plan.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden px-3 py-4 text-sm text-slate-400 md:table-cell">{formatDate(plan.start_date)}</TableCell>
                  <TableCell className="hidden px-3 py-4 text-sm text-slate-400 lg:table-cell">{formatDate(plan.end_date)}</TableCell>
                  <TableCell className="hidden px-3 py-4 text-sm text-slate-400 md:table-cell">
                    {plan.responsible_person_profile?.full_name || t('common.notAssigned')}
                  </TableCell>
                  <TableCell className="relative py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0 sticky right-0 bg-slate-800/80 backdrop-blur-sm group-hover:bg-slate-700/40 transition-colors z-10">
                    <div className="flex justify-end items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => onTogglePlanDetail(plan)} className="text-sky-400 hover:text-sky-300 hover:bg-sky-500/10 h-8 w-8">
                        <Eye size={16} />
                        <span className="sr-only">{t('common.viewDetails')}</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onEditPlan(plan)} className="text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 h-8 w-8">
                        <Edit size={16} />
                        <span className="sr-only">{t('common.editButton')}</span>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => onDeletePlan(plan)} className="text-red-500 hover:text-red-400 hover:bg-red-500/10 h-8 w-8">
                        <Trash2 size={16} />
                        <span className="sr-only">{t('common.deleteButton')}</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};


export default SupportPlanList;