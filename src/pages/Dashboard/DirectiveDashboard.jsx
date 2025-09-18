import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { Link } from 'react-router-dom';
import { BarChart2, Users, FileText, Settings, ShieldAlert, Activity, Link2, Users2, Edit3, Eye, Briefcase, Maximize2, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ScrollArea } from '@/components/ui/scroll-area';
import WelcomeUser from './WelcomeUser';
import LoadingScreen from './components/LoadingScreen';
import { toast } from '@/components/ui/use-toast';
import edgeFunctionService from '@/services/edgeFunctionService';
import StrategicSummarySection from './DirectiveSections/components/StrategicSummarySection';

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
  const { userProfile, user } = useAuth(); 
  const [loadingDashboard, setLoadingDashboard] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [error, setError] = useState(null);

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
      const payload = { 
        role: userProfile.role,
        user: user.id 
      };
      
      const { data, error: fetchError } = await edgeFunctionService.getDashboardSummary(payload);
      
      if (fetchError) {
        console.error("Detailed error from edgeFunctionService:", fetchError);
        let errorMessage = t('directiveDashboard.dataLoadedError');
        if (fetchError.message) {
          errorMessage = fetchError.message;
          if (fetchError.details && typeof fetchError.details === 'string') {
            errorMessage += ` (Details: ${fetchError.details})`;
          } else if (fetchError.details && typeof fetchError.details === 'object') {
            errorMessage += ` (Details: ${JSON.stringify(fetchError.details)})`;
          }
        }
        throw new Error(errorMessage);
      }
      setDashboardData(data);
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

  const sections = [
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
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 space-y-6"
    >
      <WelcomeUser />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {mainStats.map(stat => (
          <DashboardCard 
            key={stat.titleKey}
            title={t(stat.titleKey)}
            description={t(stat.descriptionKey)}
            icon={stat.icon}
            linkTo={stat.linkTo}
            bgColor={stat.bgColor}
            iconColor={stat.iconColor}
            hoverColor={stat.hoverColor}
            count={stat.count}
          />
        ))}
      </div>

      <div className="mb-8">
        <StrategicSummarySection />
      </div>
      
      <Card className="bg-slate-800/50 border-slate-700/60">
        <CardHeader>
          <CardTitle className="text-xl text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-purple-300 to-pink-300">{t('directiveDashboard.quickAccessTitle')}</CardTitle>
          <CardDescription className="text-slate-400">{t('directiveDashboard.quickAccessDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[450px] pr-3">
            <Accordion type="multiple" defaultValue={[sections[0].titleKey]} className="w-full space-y-3">
              {sections.map((section) => (
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
  );
};

export default DirectiveDashboard;