import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Shield, BarChart2, AlertTriangle, Brain, BookOpen, Activity, Users, Eye, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const ModuleCard = ({ title, icon: Icon, children, description }) => (
  <Card className="bg-slate-800/60 border-slate-700/70 shadow-lg">
    <CardHeader className="pb-3">
      <div className="flex items-center">
        {Icon && <Icon className="mr-3 h-6 w-6 text-sky-400" />}
        <CardTitle className="text-lg text-slate-100">{title}</CardTitle>
      </div>
      {description && <CardDescription className="text-slate-400 pt-1">{description}</CardDescription>}
    </CardHeader>
    <CardContent className="pt-0">
      {children}
    </CardContent>
  </Card>
);

const QuickActionButton = ({ label, icon: Icon, onClick, variant = "ghost", className = "" }) => {
  const {t} = useLanguage();
  return (
    <Button 
      variant={variant} 
      size="sm" 
      onClick={onClick}
      className={`text-xs text-sky-300 hover:text-sky-200 hover:bg-sky-700/50 ${className}`}
    >
      {Icon && <Icon size={14} className="mr-1.5" />}
      {t(label)}
    </Button>
  );
};

const InformationModules = ({ role, selectedItem, isGroup, onQuickAction }) => {
  const { t } = useLanguage();

  if (!selectedItem) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/60">
        <CardContent className="p-10 text-center text-slate-400">
          <Brain size={48} className="mx-auto mb-4 text-purple-400" />
          <p>{t('roleBasedDataPanel.modules.noItemSelected')}</p>
        </CardContent>
      </Card>
    );
  }

  const itemData = selectedItem; // For student or group details

  const commonModules = [
    { key: 'academicProgress', title: t('roleBasedDataPanel.modules.academicProgress.title'), icon: BarChart2, condition: true },
    { key: 'aiRecommendations', title: t('roleBasedDataPanel.modules.aiRecommendations.title'), icon: Brain, condition: role !== 'parent' },
  ];

  const roleSpecificModules = {
    teacher: [
      { key: 'recentObservations', title: t('roleBasedDataPanel.modules.recentObservations.title'), icon: Eye, condition: true },
      { key: 'assignedSupportPlans', title: t('roleBasedDataPanel.modules.assignedSupportPlans.title'), icon: Shield, condition: true },
      { key: 'resourceTracking', title: t('roleBasedDataPanel.modules.resourceTracking.title'), icon: BookOpen, condition: true },
      { key: 'academicEmotionalRisk', title: t('roleBasedDataPanel.modules.academicEmotionalRisk.title'), icon: AlertTriangle, condition: true },
    ],
    psychopedagogue: [
      { key: 'recentObservations', title: t('roleBasedDataPanel.modules.recentObservations.title'), icon: Eye, condition: true },
      { key: 'assignedSupportPlans', title: t('roleBasedDataPanel.modules.assignedSupportPlans.title'), icon: Shield, condition: true },
      { key: 'academicEmotionalRisk', title: t('roleBasedDataPanel.modules.academicEmotionalRisk.title'), icon: AlertTriangle, condition: true },
      { key: 'resourceTracking', title: t('roleBasedDataPanel.modules.resourceTracking.title'), icon: BookOpen, condition: true },
      { key: 'groupEmotionalThermometer', title: t('roleBasedDataPanel.modules.groupEmotionalThermometer.title'), icon: Activity, condition: isGroup },
    ],
    directive: [
      { key: 'recentObservations', title: t('roleBasedDataPanel.modules.recentObservations.title'), icon: Eye, condition: true },
      { key: 'assignedSupportPlans', title: t('roleBasedDataPanel.modules.assignedSupportPlans.title'), icon: Shield, condition: true },
      { key: 'academicEmotionalRisk', title: t('roleBasedDataPanel.modules.academicEmotionalRisk.title'), icon: AlertTriangle, condition: true },
      { key: 'resourceTracking', title: t('roleBasedDataPanel.modules.resourceTracking.title'), icon: BookOpen, condition: true },
      { key: 'groupEmotionalThermometer', title: t('roleBasedDataPanel.modules.groupEmotionalThermometer.title'), icon: Activity, condition: isGroup },
    ],
    program_coordinator: [ // Same as directive for now
      { key: 'recentObservations', title: t('roleBasedDataPanel.modules.recentObservations.title'), icon: Eye, condition: true },
      { key: 'assignedSupportPlans', title: t('roleBasedDataPanel.modules.assignedSupportPlans.title'), icon: Shield, condition: true },
      { key: 'academicEmotionalRisk', title: t('roleBasedDataPanel.modules.academicEmotionalRisk.title'), icon: AlertTriangle, condition: true },
      { key: 'resourceTracking', title: t('roleBasedDataPanel.modules.resourceTracking.title'), icon: BookOpen, condition: true },
      { key: 'groupEmotionalThermometer', title: t('roleBasedDataPanel.modules.groupEmotionalThermometer.title'), icon: Activity, condition: isGroup },
    ],
    parent: [
      { key: 'recentObservations', title: t('roleBasedDataPanel.modules.recentObservations.title'), icon: Eye, condition: true, partial: true },
      { key: 'assignedSupportPlans', title: t('roleBasedDataPanel.modules.assignedSupportPlans.title'), icon: Shield, condition: true, partial: true },
      { key: 'resourceTracking', title: t('roleBasedDataPanel.modules.resourceTracking.title'), icon: BookOpen, condition: true, partial: true },
    ],
    student: [ // Student might have different views of these
      { key: 'mySupportPlans', title: t('roleBasedDataPanel.modules.mySupportPlans.title'), icon: Shield, condition: true },
      { key: 'myResources', title: t('roleBasedDataPanel.modules.myResources.title'), icon: BookOpen, condition: true },
      { key: 'myProgress', title: t('roleBasedDataPanel.modules.myProgress.title'), icon: BarChart2, condition: true },
    ]
  };

  const modulesToRender = [
    ...commonModules,
    ...(roleSpecificModules[role] || [])
  ].filter(module => module.condition);

  const renderModuleContent = (moduleKey) => {
    // Placeholder content - replace with actual data display
    switch (moduleKey) {
      case 'recentObservations':
        return (itemData?.teacher_observations && itemData.teacher_observations.length > 0) ? itemData.teacher_observations.slice(0,3).map(obs => (
          <div key={obs.id} className="py-2 border-b border-slate-700/50 last:border-b-0">
            <p className="text-xs text-slate-400">{format(new Date(obs.observation_date), "PPP", { locale: es })}</p>
            <p className="text-sm text-slate-200 truncate">{obs.situation}</p>
          </div>
        )) : <p className="text-sm text-slate-500">{t('common.noDataAvailable')}</p>;
      case 'assignedSupportPlans':
        return (itemData?.support_plans && itemData.support_plans.length > 0) ? itemData.support_plans.slice(0,2).map(plan => (
            <div key={plan.id} className="py-2 border-b border-slate-700/50 last:border-b-0">
              <p className="text-sm text-slate-200 font-medium">{plan.support_goal}</p>
              <p className="text-xs text-slate-400">{t('common.status')}: <span className={`font-semibold ${plan.status === 'Activo' ? 'text-green-400' : 'text-yellow-400'}`}>{plan.status}</span></p>
              <QuickActionButton label="roleBasedDataPanel.actions.viewPlan" icon={FileText} onClick={() => onQuickAction('viewPlan', plan)} className="mt-1"/>
            </div>
          )) : <p className="text-sm text-slate-500">{t('common.noDataAvailable')}</p>;
      case 'academicEmotionalRisk':
        return (
            <>
                <p className="text-sm text-slate-300">{t('roleBasedDataPanel.modules.academicEmotionalRisk.academic')}: <span className="font-bold text-orange-300">{itemData.academic_risk || 'N/A'}%</span></p>
                <p className="text-sm text-slate-300">{t('roleBasedDataPanel.modules.academicEmotionalRisk.emotional')}: <span className="font-bold text-yellow-300">{itemData.emotional_risk || 'N/A'}%</span></p>
            </>
        );
      default:
        return <p className="text-sm text-slate-500">{t('common.comingSoon')}</p>;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-slate-800/70 border-slate-700 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-purple-300 to-pink-300">
            {isGroup ? t('roleBasedDataPanel.modules.groupTitle', { name: itemData.name }) : t('roleBasedDataPanel.modules.studentTitle', { name: itemData.full_name })}
          </CardTitle>
          {!isGroup && <CardDescription className="text-slate-400">
            {t('roleBasedDataPanel.modules.gradeLabel')}: {itemData.grade || 'N/A'} | {t('common.status')}: <span className={itemData.status === 'active' ? "text-green-400" : "text-yellow-400"}>{itemData.status}</span>
          </CardDescription>}
        </CardHeader>
        <CardContent className="flex space-x-2">
            <QuickActionButton label="roleBasedDataPanel.actions.assignResource" icon={BookOpen} onClick={() => onQuickAction('assignResource', itemData)} />
            <QuickActionButton label="roleBasedDataPanel.actions.requestAIRedaction" icon={Edit3} onClick={() => onQuickAction('requestAIRedaction', itemData)} />
            {(role === 'psychopedagogue' || role === 'directive') && 
                <QuickActionButton label="roleBasedDataPanel.actions.requestReviewCommittee" icon={Users} onClick={() => onQuickAction('requestReviewCommittee', itemData)} />
            }
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {modulesToRender.map(module => (
          <ModuleCard key={module.key} title={module.title} icon={module.icon} description={module.partial ? t('roleBasedDataPanel.modules.partialView') : undefined}>
            {renderModuleContent(module.key)}
          </ModuleCard>
        ))}
      </div>
    </div>
  );
};

export default InformationModules;