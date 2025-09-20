import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { Link } from 'react-router-dom';
import { 
  BarChart2, Users, FileText, Settings, ShieldAlert, Activity, Link2, Users2, Edit3, Eye, 
  Briefcase, Maximize2, Brain, TrendingUp, AlertTriangle, CheckCircle, Clock, 
  Target, Zap, Globe, Calendar, MessageSquare, PieChart, LineChart, 
  ArrowUpRight, ArrowDownRight, Minus, Star, Award, BookOpen, 
  GraduationCap, Heart, Lightbulb, Shield, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import WelcomeUser from './WelcomeUser';
import LoadingScreen from './components/LoadingScreen';
import { toast } from '@/components/ui/use-toast';
import edgeFunctionService from '@/services/edgeFunctionService';
import StrategicSummarySection from './DirectiveSections/components/StrategicSummarySection';
import RealTimeMetrics from './DirectiveSections/components/RealTimeMetrics';
import IntelligentAlerts from './DirectiveSections/components/IntelligentAlerts';
import PredictiveAnalytics from './DirectiveSections/components/PredictiveAnalytics';
import UnifiedCommunication from './DirectiveSections/components/UnifiedCommunication';
import EcosystemIntegration from './DirectiveSections/components/EcosystemIntegration';
import AIAssistant from '@/components/ai/AIAssistant';
import AIFloatingButton from '@/components/ai/AIFloatingButton';
import GeminiStatusCard from '@/components/ai/GeminiStatusCard';
import useAI from '@/hooks/useAI';

const DashboardCard = ({ title, description, icon: Icon, linkTo, bgColor, iconColor, hoverColor, count }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: "0px 10px 20px rgba(0,0,0,0.2)" }}
      className={`rounded-xl shadow-lg p-6 transition-all duration-300 ease-out group ${bgColor} border border-slate-700/60`}
    >
      <Link to={linkTo} className="block">
        <div className="flex items-start justify-between">
          <div className={`p-3 rounded-full ${iconColor.replace('text-', 'bg-')}/20 mb-4`}>
            <Icon size={28} className={iconColor} />
          </div>
          {count !== undefined && (
            <span className={`text-3xl font-bold ${iconColor}`}>{count}</span>
          )}
        </div>
        <h3 className="text-lg font-semibold text-slate-100 mb-1 group-hover:text-sky-300 transition-colors">{title}</h3>
        <p className="text-sm text-slate-400 group-hover:text-slate-300 transition-colors">{description}</p>
      </Link>
    </motion.div>
  );
};

const SectionItem = ({ label, description, icon: Icon, linkTo, bgColor, iconColor }) => {
  return (
    <Link to={linkTo}>
      <motion.div
        whileHover={{ x: 5, backgroundColor: 'rgba(255, 255, 255, 0.05)' }}
        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${bgColor} mb-2 border border-transparent hover:border-slate-600`}
      >
        <div className={`p-2 rounded-md mr-3 ${iconColor.replace('text-', 'bg-')}/10`}>
          <Icon size={20} className={iconColor} />
        </div>
        <div>
          <h4 className="text-sm font-medium text-slate-200">{label}</h4>
          <p className="text-xs text-slate-400">{description}</p>
        </div>
      </motion.div>
    </Link>
  );
};

const DirectiveDashboard = () => {
  const { t } = useLanguage();
  const { userProfile, user } = useMockAuth(); 
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('overview');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  
  // Hook de IA
  const ai = useAI();

  const fetchDirectiveData = useCallback(async () => {
    if (!userProfile || userProfile.role !== 'directive' || !user) {
      setLoadingDashboard(false);
      if (userProfile && userProfile.role !== 'directive') {
        setError(t('common.accessDenied'));
      } else if (!user) {
        setError(t('common.authenticationError'));
      }
      return;
    }

    setLoadingDashboard(true);
    setError(null);
    
    try {
      // Usar datos mock para el dashboard directivo
      const mockDashboardData = {
        totalStudents: 150,
        totalTeachers: 25,
        totalPsychopedagogues: 8,
        activeSupportPlans: 45,
        pendingCases: 12,
        completedActivities: 320,
        academicProgress: {
          excellent: 35,
          good: 45,
          needsImprovement: 15,
          atRisk: 5
        },
        emotionalWellbeing: {
          stable: 60,
          improving: 25,
          declining: 10,
          critical: 5
        },
        recentActivities: [
          {
            id: 1,
            type: 'support_plan',
            description: 'Nuevo plan de apoyo creado para María García',
            timestamp: new Date().toISOString(),
            status: 'completed'
          },
          {
            id: 2,
            type: 'teacher_observation',
            description: 'Observación registrada por docente en 5to Grado',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            status: 'pending'
          },
          {
            id: 3,
            type: 'parent_communication',
            description: 'Comunicación con acudiente de estudiante',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            status: 'completed'
          }
        ],
        alerts: [
          {
            id: 1,
            type: 'academic_risk',
            message: '3 estudiantes requieren atención académica urgente',
            priority: 'high',
            timestamp: new Date().toISOString()
          },
          {
            id: 2,
            type: 'emotional_concern',
            message: 'Patrón emocional preocupante detectado en 2do Grado',
            priority: 'medium',
            timestamp: new Date(Date.now() - 1800000).toISOString()
          }
        ],
        institutionalMetrics: {
          attendanceRate: 94.5,
          parentEngagement: 78.2,
          teacherSatisfaction: 85.7,
          studentProgress: 82.3
        }
      };
      
      setDashboardData(mockDashboardData);
      toast({
        title: t('toasts.successTitle'),
        description: t('directiveDashboard.dataLoadedSuccess'),
        variant: 'success',
      });
    } catch (err) {
      console.error("Error fetching directive dashboard summary in component:", err);
      setError(err.message);
      toast({
        title: t('toasts.errorTitle'),
        description: err.message || t('directiveDashboard.dataLoadedError'),
        variant: 'destructive',
      });
    } finally {
      setLoadingDashboard(false);
    }
  }, [userProfile, user, t]); 

  useEffect(() => {
    if (userProfile && userProfile.role && user) {
      fetchDirectiveData();
    } else if (userProfile && !userProfile.role) {
        setLoadingDashboard(false);
         setError(t('common.roleNotSetError'));
    } else if (!userProfile && user) {
        setLoadingDashboard(true); 
    } else {
        setLoadingDashboard(true);
    }
  }, [userProfile, user, fetchDirectiveData, t]);


  const mainStats = [
    { 
      titleKey: "directiveDashboard.stats.schoolData", 
      descriptionKey: "directiveDashboard.stats.schoolDataDesc", 
      icon: BarChart2, 
      linkTo: "/dashboard/school-data", 
      bgColor: "bg-sky-600/20 hover:bg-sky-600/30", 
      iconColor: "text-sky-300",
      count: dashboardData?.total_students 
    },
    { 
      titleKey: "directiveDashboard.stats.userManagement", 
      descriptionKey: "directiveDashboard.stats.userManagementDesc", 
      icon: Users, 
      linkTo: "/dashboard/user-management", 
      bgColor: "bg-purple-600/20 hover:bg-purple-600/30", 
      iconColor: "text-purple-300",
      count: dashboardData?.active_users 
    },
    { 
      titleKey: "directiveDashboard.stats.reports", 
      descriptionKey: "directiveDashboard.stats.reportsDesc", 
      icon: FileText, 
      linkTo: "/dashboard/reports", 
      bgColor: "bg-teal-600/20 hover:bg-teal-600/30", 
      iconColor: "text-teal-300",
      count: dashboardData?.generated_reports
    },
    { 
      titleKey: "directiveDashboard.stats.alerts", 
      descriptionKey: "directiveDashboard.stats.alertsDesc", 
      icon: ShieldAlert, 
      linkTo: "/dashboard/institutional-alerts", 
      bgColor: "bg-red-600/20 hover:bg-red-600/30", 
      iconColor: "text-red-300",
      count: dashboardData?.active_alerts
    },
  ];

  const accordionSections = [
    {
      titleKey: "directiveDashboard.sections.strategy.title",
      icon: Brain,
      iconColor: "text-pink-400",
      items: [
        { labelKey: "directiveDashboard.sections.strategy.strategicSummary", descriptionKey: "directiveDashboard.sections.strategy.strategicSummaryDesc", icon: Maximize2, linkTo: "/dashboard/strategic-summary", bgColor: "bg-pink-500/10", iconColor: "text-pink-400" },
        { labelKey: "directiveDashboard.sections.strategy.karyCorePanel", descriptionKey: "directiveDashboard.sections.strategy.karyCorePanelDesc", icon: Brain, linkTo: "/dashboard/kary-core", bgColor: "bg-pink-500/10", iconColor: "text-pink-400" },
      ]
    },
    {
      titleKey: "directiveDashboard.sections.management.title",
      icon: Users2,
      iconColor: "text-indigo-400",
      items: [
        { labelKey: "directiveDashboard.sections.management.userManagement", descriptionKey: "directiveDashboard.sections.management.userManagementDesc", icon: Users, linkTo: "/dashboard/user-management", bgColor: "bg-indigo-500/10", iconColor: "text-indigo-400" },
        { labelKey: "directiveDashboard.sections.management.accessManagement", descriptionKey: "directiveDashboard.sections.management.accessManagementDesc", icon: Edit3, linkTo: "/dashboard/access-management", bgColor: "bg-indigo-500/10", iconColor: "text-indigo-400" },
        { labelKey: "directiveDashboard.sections.management.familyLinkValidation", descriptionKey: "directiveDashboard.sections.management.familyLinkValidationDesc", icon: Link2, linkTo: "/dashboard/family-validation", bgColor: "bg-indigo-500/10", iconColor: "text-indigo-400" },
      ]
    },
    {
      titleKey: "directiveDashboard.sections.monitoring.title",
      icon: Activity,
      iconColor: "text-green-400",
      items: [
        { labelKey: "directiveDashboard.sections.monitoring.roleActivity", descriptionKey: "directiveDashboard.sections.monitoring.roleActivityDesc", icon: Activity, linkTo: "/dashboard/role-activity", bgColor: "bg-green-500/10", iconColor: "text-green-400" },
        { labelKey: "directiveDashboard.sections.monitoring.institutionalAlerts", descriptionKey: "directiveDashboard.sections.monitoring.institutionalAlertsDesc", icon: ShieldAlert, linkTo: "/dashboard/institutional-alerts", bgColor: "bg-green-500/10", iconColor: "text-green-400" },
        { labelKey: "directiveDashboard.sections.monitoring.notificationAudit", descriptionKey: "directiveDashboard.sections.monitoring.notificationAuditDesc", icon: Eye, linkTo: "/dashboard/admin/notification-audit", bgColor: "bg-green-500/10", iconColor: "text-green-400" },
      ]
    },
    {
      titleKey: "directiveDashboard.sections.data.title",
      icon: BarChart2,
      iconColor: "text-amber-400",
      items: [
        { labelKey: "directiveDashboard.sections.data.schoolDataPanel", descriptionKey: "directiveDashboard.sections.data.schoolDataPanelDesc", icon: BarChart2, linkTo: "/dashboard/school-data", bgColor: "bg-amber-500/10", iconColor: "text-amber-400" },
        { labelKey: "directiveDashboard.sections.data.reports", descriptionKey: "directiveDashboard.sections.data.reportsDesc", icon: FileText, linkTo: "/dashboard/reports", bgColor: "bg-amber-500/10", iconColor: "text-amber-400" },
      ]
    },
     {
      titleKey: "directiveDashboard.sections.settings.title",
      icon: Settings,
      iconColor: "text-slate-400",
      items: [
        { labelKey: "directiveDashboard.sections.settings.accountSettings", descriptionKey: "directiveDashboard.sections.settings.accountSettingsDesc", icon: Settings, linkTo: "/dashboard/directive-settings", bgColor: "bg-slate-500/10", iconColor: "text-slate-400" },
      ]
    }
  ];

  if (loadingDashboard && !dashboardData && !error) { 
    return <LoadingScreen text={t('common.loadingText')} />;
  }
  
  if (error && !dashboardData) { 
    return (
      <div className="p-4 sm:p-6 text-center flex flex-col items-center justify-center h-full">
        <Brain size={48} className="mx-auto mb-4 text-red-400" />
        <h1 className="text-2xl font-bold text-red-300">{t('common.errorTitle')}</h1>
        <p className="text-slate-400 max-w-md">{error}</p>
        <Button onClick={fetchDirectiveData} className="mt-6 bg-purple-600 hover:bg-purple-700 text-white">
          {t('common.retryButton')}
        </Button>
      </div>
    );
  }
  
  const sections = [
    { id: 'overview', label: 'Resumen General', icon: BarChart2 },
    { id: 'metrics', label: 'Métricas en Tiempo Real', icon: Activity },
    { id: 'alerts', label: 'Alertas Inteligentes', icon: ShieldAlert },
    { id: 'analytics', label: 'Análisis Predictivo', icon: Brain },
    { id: 'communication', label: 'Comunicación', icon: MessageSquare },
    { id: 'ecosystem', label: 'Integración Ecosistema', icon: Users },
    { id: 'strategy', label: 'Estrategia', icon: Target }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900"
    >
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="relative p-6">
          <WelcomeUser />
          
          {/* Navigation Tabs */}
          <div className="mt-8">
            <div className="flex flex-wrap gap-2 mb-6">
              {sections.map((section) => (
                <Button
                  key={section.id}
                  variant={activeSection === section.id ? "default" : "outline"}
                  onClick={() => setActiveSection(section.id)}
                  className={`${
                    activeSection === section.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:bg-slate-700/50'
                  } transition-all duration-300`}
                >
                  <section.icon className="w-4 h-4 mr-2" />
                  {section.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-8">
        <AnimatePresence mode="wait">
          {activeSection === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Main Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {mainStats.map((stat, index) => (
                  <motion.div
                    key={stat.titleKey}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <DashboardCard 
                      title={t(stat.titleKey)}
                      description={t(stat.descriptionKey)}
                      icon={stat.icon}
                      linkTo={stat.linkTo}
                      bgColor={stat.bgColor}
                      iconColor={stat.iconColor}
                      hoverColor={stat.hoverColor}
                      count={stat.count}
                    />
                  </motion.div>
                ))}
              </div>

              {/* Strategic Summary */}
              <div className="mb-8">
                <StrategicSummarySection />
              </div>
              
              {/* Quick Access */}
              <Card className="bg-slate-800/50 border-slate-700/60 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-purple-300 to-pink-300">
                    {t('directiveDashboard.quickAccessTitle')}
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    {t('directiveDashboard.quickAccessDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[450px] pr-3">
                    <Accordion type="multiple" defaultValue={['strategy']} className="w-full space-y-3">
                      {accordionSections.map((section) => (
                        <AccordionItem key={section.titleKey} value={section.titleKey} className="bg-slate-700/30 rounded-lg border-slate-700/50 px-4 data-[state=open]:bg-slate-700/50 transition-colors">
                          <AccordionTrigger className="hover:no-underline py-3 text-base font-medium text-slate-200 hover:text-sky-300 transition-colors">
                            <div className="flex items-center">
                              <section.icon size={20} className={`mr-3 ${section.iconColor}`} />
                              {t(section.titleKey)}
                            </div>
                          </AccordionTrigger>
                          <AccordionContent className="pt-2 pb-3 border-t border-slate-600/50">
                            <div className="space-y-1.5">
                              {section.items.map(item => (
                                 <SectionItem
                                  key={item.labelKey}
                                  label={t(item.labelKey)}
                                  description={t(item.descriptionKey)}
                                  icon={item.icon}
                                  linkTo={item.linkTo}
                                  bgColor={item.bgColor}
                                  iconColor={item.iconColor}
                                />
                              ))}
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </ScrollArea>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeSection === 'metrics' && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              <RealTimeMetrics data={dashboardData} />
              <GeminiStatusCard />
            </motion.div>
          )}

          {activeSection === 'alerts' && (
            <motion.div
              key="alerts"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <IntelligentAlerts alerts={dashboardData?.alerts || []} />
            </motion.div>
          )}

          {activeSection === 'analytics' && (
            <motion.div
              key="analytics"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <PredictiveAnalytics />
            </motion.div>
          )}

          {activeSection === 'communication' && (
            <motion.div
              key="communication"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <UnifiedCommunication />
            </motion.div>
          )}

          {activeSection === 'ecosystem' && (
            <motion.div
              key="ecosystem"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <EcosystemIntegration />
            </motion.div>
          )}

          {activeSection === 'strategy' && (
            <motion.div
              key="strategy"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <StrategicSummarySection />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* AI Assistant */}
      <AIAssistant
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
        initialContext={{
          role: 'directive',
          user: user,
          dashboardData: dashboardData
        }}
        role="directive"
      />
      
      {/* AI Floating Button */}
      <AIFloatingButton />
    </motion.div>
  );
};

export default DirectiveDashboard;