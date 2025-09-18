import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { BarChartBig, CalendarClock, MessageSquare as MessageSquareText, FileText, Settings, ChevronRight, Smile, History as HistoryIcon, Users2, UserCircle } from 'lucide-react';
import DashboardCard from './components/DashboardCard';
import LoadingScreen from './components/LoadingScreen';

const ParentDashboard = () => {
  const { t } = useLanguage();
  const { user, userProfile, loading: authLoading, primaryChildId, associatedStudentIds } = useMockAuth();

  const parentDashboardCards = [
    {
      id: 'childProfile',
      titleKey: 'studentProfilePage.pageTitle',
      descriptionKey: 'parentDashboard.childProfile.description',
      icon: UserCircle,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20',
      hoverBgColor: 'hover:bg-indigo-500/30',
      link: primaryChildId ? `/dashboard/student/${primaryChildId}/profile` : null,
      requiresChild: true,
    },
    {
      id: 'childInteractions',
      titleKey: 'parentDashboard.childInteractions.title',
      descriptionKey: 'parentDashboard.childInteractions.description',
      icon: MessageSquareText,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/20',
      hoverBgColor: 'hover:bg-sky-500/30',
      link: '/dashboard/child-interactions',
      requiresChild: true,
    },
    {
      id: 'accessReports',
      titleKey: 'parentDashboard.accessReports.title',
      descriptionKey: 'parentDashboard.accessReports.description',
      icon: FileText,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      hoverBgColor: 'hover:bg-emerald-500/30',
      link: '/dashboard/access-reports',
      requiresChild: true,
    },
    {
      id: 'directCommunication',
      titleKey: 'parentDashboard.directCommunication.title',
      descriptionKey: 'parentDashboard.directCommunication.description',
      icon: Users2,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      hoverBgColor: 'hover:bg-purple-500/30',
      link: '/dashboard/direct-communication',
      requiresChild: false, 
    },
    {
      id: 'studentProgress',
      titleKey: 'parentDashboard.studentProgress.title',
      descriptionKey: 'parentDashboard.studentProgress.description',
      icon: BarChartBig,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/20',
      hoverBgColor: 'hover:bg-rose-500/30',
      link: '/dashboard/student-progress',
      requiresChild: true,
    },
    {
      id: 'scheduleAppointment',
      titleKey: 'parentDashboard.scheduleAppointment.title',
      descriptionKey: 'parentDashboard.scheduleAppointment.description',
      icon: CalendarClock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      hoverBgColor: 'hover:bg-yellow-500/30',
      link: '/dashboard/schedule-appointment',
      requiresChild: false,
    },
    {
      id: 'appointmentHistory',
      titleKey: 'parentDashboard.appointmentHistory.title',
      descriptionKey: 'parentDashboard.appointmentHistory.description',
      icon: HistoryIcon,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      hoverBgColor: 'hover:bg-blue-500/30',
      link: '/dashboard/appointment-history',
      requiresChild: false,
    },
     {
      id: 'parentUnified',
      titleKey: 'parentDashboard.unifiedProgress.pageTitle',
      descriptionKey: 'parentDashboard.unifiedProgress.pageSubtitle',
      icon: Smile,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      hoverBgColor: 'hover:bg-pink-500/30',
      link: '/dashboard/progress-quick-access', 
      requiresChild: true, 
    },
    {
      id: 'parentSettings',
      titleKey: 'parentDashboard.accountSettings.title',
      descriptionKey: 'parentDashboard.accountSettings.description',
      icon: Settings,
      color: 'text-slate-400',
      bgColor: 'bg-slate-500/20',
      hoverBgColor: 'hover:bg-slate-500/30',
      link: '/dashboard/parent-settings',
      requiresChild: false,
    },
  ];

  if (authLoading) {
    return <LoadingScreen text={t('common.loadingText')} />;
  }
  
  const hasLinkedStudents = primaryChildId || (associatedStudentIds && associatedStudentIds.length > 0);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 p-4 sm:p-6"
    >
      <div className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-purple-300 to-pink-300">
          {t('parentDashboard.pageTitle')}
        </h1>
        <p className="text-lg text-slate-300 mt-2 max-w-2xl mx-auto">
          {t('parentDashboard.pageSubtitle', { userName: userProfile?.full_name || user?.email })}
        </p>
        {!hasLinkedStudents && !authLoading && (
          <p className="text-yellow-400 mt-2 text-sm bg-yellow-500/10 p-2 rounded-md inline-block">{t('parentDashboard.noChildLinked')}</p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {parentDashboardCards.map((card, index) => {
          const cardContent = (
            <DashboardCard
              title={t(card.titleKey, { studentName: t('common.myChild') })}
              description={t(card.descriptionKey)}
              icon={card.icon}
              color={card.color}
              bgColor={card.requiresChild && !hasLinkedStudents ? "bg-gray-700/30" : card.bgColor}
              hoverBgColor={card.requiresChild && !hasLinkedStudents ? "hover:bg-gray-700/40" : card.hoverBgColor}
              className={card.requiresChild && !hasLinkedStudents ? "opacity-60 cursor-not-allowed" : ""}
            >
              <div className="flex justify-between items-center mt-auto pt-3 border-t border-slate-700/50">
                <span className="text-sm text-slate-400">
                  {card.requiresChild && !hasLinkedStudents ? t('parentDashboard.requiresChildLink') : t('common.accessNowButton')}
                </span>
                {!(card.requiresChild && !hasLinkedStudents) && <ChevronRight className={`h-5 w-5 ${card.color} group-hover:translate-x-1 transition-transform`} />}
              </div>
            </DashboardCard>
          );

          return (
            <motion.div
              key={card.id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.07, ease: "easeOut" }}
            >
              {(card.requiresChild && !hasLinkedStudents) || !card.link ? (
                <div className="h-full">{cardContent}</div>
              ) : (
                <Link to={card.link} className="block group h-full">
                  {cardContent}
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default ParentDashboard;