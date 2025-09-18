import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, BarChart3, AlertTriangle, MessageSquare, History, Settings2, Zap, Loader2, Eye, RefreshCw } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import edgeFunctionService from '@/services/edgeFunctionService'; 

const IntelligentSummary = () => {
  const { t } = useLanguage();
  return (
    <Card className="bg-slate-800/50 border-slate-700/60">
      <CardHeader>
        <CardTitle className="text-xl text-sky-300">{t('karyCore.summary.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-400">{t('karyCore.summary.dailyDigestPlaceholder')}</p>
        <div className="mt-4 space-y-2">
          <div className="p-3 bg-slate-700/50 rounded-md">
            <p className="font-semibold text-slate-200">{t('karyCore.summary.recentAlerts')}: 3 {t('karyCore.summary.new')}</p>
            <p className="text-xs text-slate-400">{t('karyCore.summary.alertsDetailsPlaceholder')}</p>
          </div>
          <div className="p-3 bg-slate-700/50 rounded-md">
            <p className="font-semibold text-slate-200">{t('karyCore.summary.automatedSuggestions')}: 5 {t('karyCore.summary.pendingReview')}</p>
            <p className="text-xs text-slate-400">{t('karyCore.summary.suggestionsDetailsPlaceholder')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const RealTimeEvaluation = () => {
  const { t } = useLanguage();
  return (
    <Card className="bg-slate-800/50 border-slate-700/60">
      <CardHeader>
        <CardTitle className="text-xl text-teal-300">{t('karyCore.evaluation.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-400">{t('karyCore.evaluation.monitoringPlaceholder')}</p>
        <div className="mt-4 h-40 bg-slate-700/50 rounded-md flex items-center justify-center text-slate-500">
          {t('common.dataVisualizationComingSoon')}
        </div>
        <p className="text-sm text-slate-400 mt-2">{t('karyCore.evaluation.inconsistencyExample')}</p>
      </CardContent>
    </Card>
  );
};

const StrategicAssistant = () => {
  const { t } = useLanguage();
  return (
    <Card className="bg-slate-800/50 border-slate-700/60">
      <CardHeader>
        <CardTitle className="text-xl text-purple-300">{t('karyCore.assistant.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="p-3 bg-slate-700/50 rounded-lg">
            <p className="text-sm text-slate-200">{t('karyCore.assistant.exampleSuggestion1')}</p>
            <Button size="sm" variant="outline" className="mt-2 text-purple-300 border-purple-500 hover:bg-purple-500/20">
              {t('karyCore.assistant.actionButtonSuggestResource')}
            </Button>
          </div>
          <div className="p-3 bg-slate-700/50 rounded-lg">
            <p className="text-sm text-slate-200">{t('karyCore.assistant.exampleSuggestion2')}</p>
             <Button size="sm" variant="outline" className="mt-2 text-purple-300 border-purple-500 hover:bg-purple-500/20">
              {t('karyCore.assistant.actionButtonSendReport')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const PredictiveAlertsDisplay = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [alerts, setAlerts] = useState([]);
  const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);

  const fetchAlerts = useCallback(async () => {
    setIsLoadingAlerts(true);
    try {
      const { data, error } = await supabase
        .from('alerts_predictive')
        .select(`
          *,
          student:user_profiles!student_id(id, full_name, email)
        `)
        .eq('estado', 'pendiente')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      console.log("Fetched predictive alerts:", data);
      setAlerts(data || []);
    } catch (error) {
      console.error("Error fetching predictive alerts:", error);
      toast({ title: t('toast.errorTitle'), description: t('karyCore.alerts.errorFetching', {details: error.message}), variant: 'destructive' });
      setAlerts([]);
    } finally {
      setIsLoadingAlerts(false);
    }
  }, [t, toast]);

  useEffect(() => {
    fetchAlerts();
  }, [fetchAlerts]);

  const handleSuggestPlan = async (alert) => {
    if (!alert.student_id) {
      toast({ title: t('common.error'), description: t('karyCore.alerts.noStudentIdForPlan'), variant: 'destructive' });
      return;
    }
    
    toast({ title: t('karyCore.alerts.generatingPlanSuggestionTitle'), description: t('karyCore.alerts.generatingPlanSuggestionDesc') });

    try {
      const payload = {
        student_id: alert.student_id,
        plan_type: alert.categoria === 'Riesgo Académico' ? 'academic' : 'emotional', 
        contexto: `${t('karyCore.alerts.alertContextPrefix')} ${alert.descripcion}. ${t('karyCore.alerts.alertContextFocus')} ${alert.categoria}, ${t('karyCore.alerts.alertContextLevel')} ${alert.nivel}.`,
        fuente: 'alerta_predictiva',
      };
      
      navigate('/dashboard/support-plan', { 
        state: { 
          studentIdToFocus: alert.student_id, 
          openCanvas: true,
          aiContext: payload 
        } 
      });

    } catch (error) {
      console.error("Error initiating AI plan suggestion:", error);
      toast({ title: t('toast.errorTitle'), description: t('karyCore.alerts.errorSuggestingPlan'), variant: 'destructive' });
    }
  };

  const riskColors = {
    high: "bg-red-500/20 text-red-300 border-red-500/50",
    alto: "bg-red-500/20 text-red-300 border-red-500/50",
    medium: "bg-orange-500/20 text-orange-300 border-orange-500/50",
    medio: "bg-orange-500/20 text-orange-300 border-orange-500/50",
    low: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
    bajo: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50",
    emergente: "bg-yellow-500/20 text-yellow-300 border-yellow-500/50", 
    default: "bg-slate-600/20 text-slate-300 border-slate-500/50"
  };

  const getRiskColorClass = (level) => {
    const lowerLevel = level ? String(level).toLowerCase().replace(/\s+/g, '') : 'default';
    return riskColors[lowerLevel] || riskColors.default;
  };

  if (isLoadingAlerts) {
    return <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-red-400" size={32}/></div>;
  }

  if (alerts.length === 0) {
    return <p className="text-slate-400 text-center py-4">{t('karyCore.alerts.noActiveAlerts')}</p>;
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/60">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-xl text-red-400">{t('karyCore.alerts.title')}</CardTitle>
        <Button variant="ghost" size="icon" onClick={fetchAlerts} disabled={isLoadingAlerts} className="text-red-400 hover:text-red-200 hover:bg-red-500/10">
          {isLoadingAlerts ? <Loader2 className="h-5 w-5 animate-spin" /> : <RefreshCw size={18} />}
        </Button>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-2">
          {alerts.map(alert => (
            <div key={alert.id} className={`p-3 mb-2 rounded-lg border ${getRiskColorClass(alert.nivel)}`}>
              <div className="flex justify-between items-start">
                <div>
                  <span className="font-semibold">{alert.student?.full_name || t('common.unknownStudent')}</span>
                  <p className="text-xs text-slate-400">{alert.categoria} - {alert.origen}</p>
                </div>
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getRiskColorClass(alert.nivel).replace('text-', 'bg-').replace('/20', '/30')}`}>{alert.nivel}</span>
              </div>
              <p className="text-sm mt-1 mb-2">{alert.descripcion}</p>
              <div className="flex gap-2">
                <Button size="xs" variant="outline" className="text-sky-300 border-sky-500 hover:bg-sky-500/20" onClick={() => navigate(`/dashboard/student/${alert.student_id}/profile`)}>
                  <Eye size={14} className="mr-1"/> {t('karyCore.alerts.viewStudent')}
                </Button>
                <Button size="xs" variant="outline" className="text-lime-300 border-lime-500 hover:bg-lime-500/20" onClick={() => handleSuggestPlan(alert)}>
                  <Zap size={14} className="mr-1"/> {t('karyCore.alerts.suggestPlanAI')}
                </Button>
              </div>
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

const HistoricalDecisionsLog = () => {
  const { t } = useLanguage();
  return (
    <Card className="bg-slate-800/50 border-slate-700/60">
      <CardHeader>
        <CardTitle className="text-xl text-indigo-300">{t('karyCore.history.title')}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-slate-400">{t('karyCore.history.logPlaceholder')}</p>
        <div className="mt-4 h-40 bg-slate-700/50 rounded-md flex items-center justify-center text-slate-500">
          {t('common.featureInDevelopment')}
        </div>
      </CardContent>
    </Card>
  );
};


const KaryCorePanel = () => {
  const { t } = useLanguage();
  const { userProfile } = useAuth();
  
  const allTabs = [
    { value: "summary", labelKey: "karyCore.tabs.summary", icon: BarChart3, component: <IntelligentSummary />, roles: ['directive', 'program_coordinator', 'admin'] },
    { value: "evaluation", labelKey: "karyCore.tabs.evaluation", icon: Zap, component: <RealTimeEvaluation />, roles: ['directive', 'program_coordinator', 'admin', 'psychopedagogue'] },
    { value: "assistant", labelKey: "karyCore.tabs.assistant", icon: MessageSquare, component: <StrategicAssistant />, roles: ['directive', 'program_coordinator', 'admin', 'psychopedagogue', 'teacher'] },
    { value: "alerts", labelKey: "karyCore.tabs.alerts", icon: AlertTriangle, component: <PredictiveAlertsDisplay />, roles: ['directive', 'program_coordinator', 'admin', 'psychopedagogue', 'teacher'] },
    { value: "history", labelKey: "karyCore.tabs.history", icon: History, component: <HistoricalDecisionsLog />, roles: ['directive', 'admin'] },
  ];

  const availableTabs = useMemo(() => {
    if (!userProfile || !userProfile.role) return [];
    return allTabs.filter(tab => tab.roles.includes(userProfile.role));
  }, [userProfile, allTabs]);

  const [activeTab, setActiveTab] = useState(availableTabs.length > 0 ? availableTabs[0].value : "");

  useEffect(() => {
    if (availableTabs.length > 0 && !availableTabs.find(tab => tab.value === activeTab)) {
      setActiveTab(availableTabs[0].value);
    } else if (availableTabs.length === 0) {
      setActiveTab("");
    }
  }, [availableTabs, activeTab]);


  if (!userProfile || availableTabs.length === 0) {
    return (
      <div className="p-4 sm:p-6 text-center">
        <Brain size={48} className="mx-auto mb-4 text-purple-400" />
        <h1 className="text-2xl font-bold text-slate-200">{t('karyCore.noAccessTitle')}</h1>
        <p className="text-slate-400">{t('karyCore.noAccessMessage')}</p>
      </div>
    );
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 space-y-6"
    >
      <header className="flex items-center space-x-3 mb-6">
        <Brain size={40} className="text-purple-400 animate-pulse" />
        <div>
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
            {t('karyCore.panelTitle')}
          </h1>
          <p className="text-slate-400">{t('karyCore.panelSubtitle')}</p>
        </div>
      </header>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className={`grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(availableTabs.length, 5)} gap-2 bg-slate-800/50 p-1.5 rounded-lg border border-slate-700/60`}>
          {availableTabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-col sm:flex-row h-auto sm:h-10 data-[state=active]:bg-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg hover:bg-slate-700/70 text-slate-300 px-3 py-2 text-xs sm:text-sm"
            >
              <tab.icon size={16} className="mb-1 sm:mb-0 sm:mr-2" />
              {t(tab.labelKey)}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <AnimatePresence mode="wait">
          {availableTabs.map(tab => (
            activeTab === tab.value && (
              <TabsContent key={tab.value} value={tab.value} asChild>
                <motion.div
                  initial={{ opacity: 0, x: activeTab > (availableTabs.findIndex(t => t.value === tab.value)) ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: activeTab < (availableTabs.findIndex(t => t.value === tab.value)) ? -20 : 20 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6"
                >
                  {tab.component}
                </motion.div>
              </TabsContent>
            )
          ))}
        </AnimatePresence>
      </Tabs>
    </motion.div>
  );
};

export default KaryCorePanel;