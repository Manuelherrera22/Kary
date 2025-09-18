import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import WelcomeUser from '@/pages/Dashboard/WelcomeUser';
import DashboardCard from '@/pages/Dashboard/components/DashboardCard';
import { Link } from 'react-router-dom';
import { FileText, Bot, AlertTriangle, Shield, BarChart2, Settings } from 'lucide-react';
import ProgramCoordinatorSummary from './ProgramCoordinatorSections/components/ProgramCoordinatorSummary';

const ProgramCoordinatorDashboard = () => {
  const { t } = useLanguage();
  const { userProfile } = useAuth();

  const cards = [
    {
      title: t('programCoordinatorDashboard.programDataPanel.title', { ns: 'programCoordinatorDashboard' }),
      description: t('programCoordinatorDashboard.programDataPanel.desc', { ns: 'programCoordinatorDashboard' }),
      icon: <BarChart2 className="w-8 h-8 text-purple-500" />,
      link: '/dashboard/program-data-panel'
    },
    {
      title: t('programCoordinatorDashboard.programSmartAssignment.title', { ns: 'programCoordinatorDashboard' }),
      description: t('programCoordinatorDashboard.programSmartAssignment.desc', { ns: 'programCoordinatorDashboard' }),
      icon: <Bot className="w-8 h-8 text-blue-500" />,
      link: '/dashboard/program-smart-assignment'
    },
    {
      title: t('programCoordinatorDashboard.escalatedAlerts.title', { ns: 'programCoordinatorDashboard' }),
      description: t('programCoordinatorDashboard.escalatedAlerts.desc', { ns: 'programCoordinatorDashboard' }),
      icon: <AlertTriangle className="w-8 h-8 text-red-500" />,
      link: '/dashboard/program-escalated-alerts'
    },
    {
      title: t('programCoordinatorDashboard.piarLifeProjectsProgress.title', { ns: 'programCoordinatorDashboard' }),
      description: t('programCoordinatorDashboard.piarLifeProjectsProgress.desc', { ns: 'programCoordinatorDashboard' }),
      icon: <FileText className="w-8 h-8 text-green-500" />,
      link: '/dashboard/program-piar-progress'
    },
    {
      title: t('programCoordinatorDashboard.blockComparison.title', { ns: 'programCoordinatorDashboard' }),
      description: t('programCoordinatorDashboard.blockComparison.desc', { ns: 'programCoordinatorDashboard' }),
      icon: <Shield className="w-8 h-8 text-yellow-500" />,
      link: '/dashboard/program-block-comparison'
    },
    {
      title: t('programCoordinatorDashboard.additionalToolsTitle', { ns: 'programCoordinatorDashboard' }),
      description: t('programCoordinatorDashboard.auditAccess.desc', { ns: 'programCoordinatorDashboard' }),
      icon: <Settings className="w-8 h-8 text-gray-500" />,
      link: '/dashboard/admin/notification-audit'
    },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <WelcomeUser
        userName={userProfile?.display_name || 'Coordinador'}
        pageTitle={t('programCoordinatorDashboard.pageTitle', { ns: 'programCoordinatorDashboard' })}
        pageSubtitle={t('programCoordinatorDashboard.pageSubtitle', { ns: 'programCoordinatorDashboard' })}
      />

      <ProgramCoordinatorSummary />
      
      <div className="mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, index) => (
            <Link to={card.link} key={index} className="flex">
              <DashboardCard
                title={card.title}
                description={card.description}
                icon={card.icon}
                footerText={t('programCoordinatorDashboard.accessNowButton', { ns: 'programCoordinatorDashboard' })}
                className="transform hover:scale-105 transition-transform duration-300 w-full"
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgramCoordinatorDashboard;