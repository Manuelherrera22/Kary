import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from "@/components/ui/use-toast";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { AlertTriangle, CalendarPlus as CalendarIcon, Eye, ListFilter, Loader2, Search, ShieldAlert, ShieldCheck, ShieldQuestion, FileText } from 'lucide-react';
import { format, parseISO, isValid } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import PlanDetailModal from './components/PlanDetailModal';
import { Badge } from '@/components/ui/badge';

const AutomatedSupportPlansPage = () => {
  const { t, language } = useLanguage();
  const { userProfile } = useMockAuth();
  const { toast } = useToast();

  const [studentPlans, setStudentPlans] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const dateLocale = language === 'es' ? es : enUS;

  const fetchStudentPlans = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_plans')
        .select(`
          id,
          student_id,
          plan_json,
          created_at,
          updated_at
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      // Get the most recent plan per student
      const latestPlansMap = new Map();
      data.forEach(plan => {
        if (!latestPlansMap.has(plan.student_id) || new Date(plan.updated_at) > new Date(latestPlansMap.get(plan.student_id).updated_at)) {
          latestPlansMap.set(plan.student_id, plan);
        }
      });
      
      setStudentPlans(Array.from(latestPlansMap.values()));

    } catch (error) {
      console.error("Error fetching student plans:", error);
      toast({
        title: t('psychopedagoguePlans.errorLoadingStudentPlans'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    if (userProfile) {
      fetchStudentPlans();
    }
  }, [userProfile, fetchStudentPlans]);

  const filteredPlans = useMemo(() => {
    return studentPlans.filter(plan => {
      const planDate = plan.updated_at ? new Date(plan.updated_at) : null;
      const dateMatch = !dateFilter || (planDate && format(planDate, 'yyyy-MM-dd') === format(dateFilter, 'yyyy-MM-dd'));
      
      // For now, we'll only filter by date since we don't have student info
      // TODO: Add student information to support_plans or create a proper join
      return dateMatch;
    });
  }, [studentPlans, dateFilter]);

  const handleViewPlan = (plan) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };
  
  const getRiskLevelInfo = (plan) => {
    // Try to get risk level from plan_json if available
    const planData = plan.plan_json || {};
    const riskLevel = planData.riskLevel || planData.risk_level || 'unknown';
    const riskKey = riskLevel?.toLowerCase() || 'unknown';
    
    switch (riskKey) {
      case 'alto':
      case 'high':
        return { text: t('psychopedagoguePlans.riskLevels.alto'), color: 'bg-red-500 dark:bg-red-600', icon: <ShieldAlert className="h-4 w-4 mr-1.5" /> };
      case 'moderado':
      case 'moderate':
        return { text: t('psychopedagoguePlans.riskLevels.moderado'), color: 'bg-yellow-500 dark:bg-yellow-600', icon: <ShieldCheck className="h-4 w-4 mr-1.5" /> };
      case 'leve':
      case 'mild':
        return { text: t('psychopedagoguePlans.riskLevels.leve'), color: 'bg-green-500 dark:bg-green-600', icon: <ShieldCheck className="h-4 w-4 mr-1.5" /> };
      default:
        return { text: t('psychopedagoguePlans.riskLevels.sin_datos'), color: 'bg-gray-500 dark:bg-gray-600', icon: <ShieldQuestion className="h-4 w-4 mr-1.5" /> };
    }
  };

  const riskOptions = [
    { value: 'alto', label: t('psychopedagoguePlans.riskLevels.alto') },
    { value: 'moderado', label: t('psychopedagoguePlans.riskLevels.moderado') },
    { value: 'leve', label: t('psychopedagoguePlans.riskLevels.leve') },
    { value: 'unknown', label: t('psychopedagoguePlans.riskLevels.sin_datos') },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 min-h-screen text-white"
    >
      <div className="container mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">{t('psychopedagoguePlans.title')}</h1>
          <p className="text-slate-400">{t('psychopedagogueDashboard.emotionalTrendsPageSubtitle')}</p>
        </header>

        <div className="mb-6 p-4 bg-slate-800/60 backdrop-blur-md rounded-lg shadow-lg border border-slate-700">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder={t('psychopedagoguePlans.searchStudentPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-700 border-slate-600 text-white focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            <Select value={riskFilter} onValueChange={setRiskFilter}>
              <SelectTrigger className="bg-slate-700 border-slate-600 text-white focus:ring-purple-500 focus:border-purple-500">
                <SelectValue placeholder={t('psychopedagoguePlans.filterByRisk')} />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-white">
                <SelectItem value="all" className="hover:bg-slate-700">{t('psychopedagoguePlans.allRiskLevels')}</SelectItem>
                {riskOptions.map(option => (
                  <SelectItem key={option.value} value={option.value} className="hover:bg-slate-700">{option.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-slate-700 border-slate-600 hover:bg-slate-600 hover:text-white text-white"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFilter ? format(dateFilter, 'PPP', { locale: dateLocale }) : <span>{t('psychopedagoguePlans.dateFilterPlaceholder')}</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-slate-700" align="start">
                <Calendar
                  mode="single"
                  selected={dateFilter}
                  onSelect={setDateFilter}
                  initialFocus
                  locale={dateLocale}
                  className="text-white [&_button]:text-white [&_button:hover]:bg-slate-700 [&_button[aria-selected]]:bg-purple-500"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
          </div>
        ) : filteredPlans.length === 0 ? (
           <div className="text-center py-10 bg-slate-800/50 rounded-lg shadow-md border border-slate-700">
            <ListFilter size={48} className="mx-auto text-slate-500 mb-4" />
            <p className="text-xl text-slate-300">{t('psychopedagoguePlans.noResultsFound')}</p>
            <p className="text-slate-400">{t('common.tryAdjustingFilters')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan) => {
              const riskInfo = getRiskLevelInfo(plan);
              const planGenerated = !!plan.plan_json;
              const lastAnalysisDate = plan.updated_at && isValid(parseISO(plan.updated_at)) 
                ? format(parseISO(plan.updated_at), 'PPpp', { locale: dateLocale }) 
                : t('psychopedagoguePlans.noData');

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-800/70 backdrop-blur-sm border border-slate-700 rounded-xl shadow-xl p-5 flex flex-col justify-between hover:shadow-purple-500/30 transition-shadow"
                >
                  <div>
                    <h2 className="text-xl font-semibold text-purple-300 truncate mb-1">Estudiante ID: {plan.student_id}</h2>
                    <div className="flex items-center mb-2">
                      <Badge variant="outline" className={`text-xs px-2 py-0.5 border-none text-white ${riskInfo.color}`}>
                        {riskInfo.icon}
                        {riskInfo.text}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-400 mb-1">
                      <span className="font-medium">{t('psychopedagoguePlans.lastAnalysis')}:</span> {lastAnalysisDate}
                    </p>
                    <p className={`text-xs mb-3 ${planGenerated ? 'text-green-400' : 'text-yellow-400'}`}>
                      <span className="font-medium">{t('psychopedagoguePlans.title')}:</span> {planGenerated ? t('psychopedagoguePlans.generated') : t('psychopedagoguePlans.notGenerated')}
                    </p>
                  </div>
                  <Button 
                    onClick={() => handleViewPlan(plan)} 
                    disabled={!planGenerated}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Eye size={18} className="mr-2" />
                    {t('psychopedagoguePlans.viewPlan')}
                  </Button>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {selectedPlan && (
        <PlanDetailModal
          isOpen={isModalOpen}
          onOpenChange={setIsModalOpen}
          plan={selectedPlan}
          studentName={`Estudiante ID: ${selectedPlan.student_id}`}
          onPlanUpdate={fetchStudentPlans}
        />
      )}
    </motion.div>
  );
};

export default AutomatedSupportPlansPage;