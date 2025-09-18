import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import DashboardCard from '@/pages/Dashboard/components/DashboardCard'; // Ensure this path is correct
import { ChevronRight, AlertTriangle, Smile, ClipboardList, ShieldCheck, MessageSquare, Home, Info, Users2, FileText, UserCircle, CalendarClock, Settings } from 'lucide-react'; // Added missing icons

const ParentDashboardCards = ({ cards, hasLinkedStudents, studentData }) => {
  const { t } = useLanguage();

  const cardContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.07, delayChildren: 0.2 }
    }
  };

  const cardItemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } }
  };

  const renderCardContent = (card) => {
    if (card.id === 'wellbeingAlerts' && studentData.wellbeingAlerts) {
      const { academicRisk, emotionalRisk } = studentData.wellbeingAlerts;
      let riskLevel = 'low';
      let riskColor = 'text-green-400';
      if ((parseFloat(academicRisk) || 0) >= 70 || (parseFloat(emotionalRisk) || 0) >= 70) {
        riskLevel = 'high';
        riskColor = 'text-red-400';
      } else if ((parseFloat(academicRisk) || 0) >= 40 || (parseFloat(emotionalRisk) || 0) >= 40) {
        riskLevel = 'medium';
        riskColor = 'text-yellow-400';
      }
      return (
        <div className="text-sm">
          <p className={`${riskColor} font-semibold flex items-center`}>
            <AlertTriangle size={16} className="mr-2" />
            {t(`parentDashboard.wellbeingAlerts.level.${riskLevel}`)}
          </p>
          <p className="text-slate-400 mt-1">{t('parentDashboard.wellbeingAlerts.academicRisk', { risk: academicRisk || 'N/A' })}</p>
          <p className="text-slate-400">{t('parentDashboard.wellbeingAlerts.emotionalRisk', { risk: emotionalRisk || 'N/A' })}</p>
        </div>
      );
    }
    if (card.id === 'homeSupport' && studentData.homeSupportTips?.length > 0) {
      return (
        <ul className="space-y-1 text-sm list-disc list-inside text-slate-300">
          {studentData.homeSupportTips.slice(0, 2).map(tip => <li key={tip.id}>{tip.tip}</li>)}
        </ul>
      );
    }
    if (card.id === 'studentGeneralProgress' && studentData.progressSummary) {
        return (
            <div className="text-sm text-slate-300">
                <p>{t('parentDashboard.studentGeneralProgress.attendancePlaceholder')}</p>
                <p>{t('parentDashboard.studentGeneralProgress.emotionalEvolutionPlaceholder', { evolution: studentData.progressSummary.emotionalEvolution?.join(', ') || 'N/A' })}</p>
            </div>
        );
    }
    if (card.id === 'currentSupportPlanInfo' && studentData.currentSupportPlan) {
        const { goal, status, professional } = studentData.currentSupportPlan;
        return (
            <div className="text-sm">
                <p className="font-semibold text-slate-200">{goal}</p>
                <p className="text-slate-400">{t('common.status')}: {status}</p>
                <p className="text-slate-400">{t('supportPlans.responsiblePersonLabel')}: {professional}</p>
            </div>
        );
    }
     if (card.id === 'schoolNotes' && studentData.schoolNotes?.length > 0) {
      return (
        <ul className="space-y-1 text-sm list-disc list-inside text-slate-300">
          {studentData.schoolNotes.slice(0, 2).map(note => <li key={note.id}>{note.note}</li>)}
        </ul>
      );
    }
    // For cards that don't have custom content but rely on descriptionKey when a child is linked.
    if (hasLinkedStudents && !card.customContent && card.id !== 'childProfile' && card.id !== 'childInteractions' && card.id !== 'accessReports') {
        return <p className="text-sm text-slate-300">{t(card.descriptionKey)}</p>;
    }
    return null;
  };


  return (
    <motion.div
      variants={cardContainerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6" // Adjusted for 2 columns on larger screens as per image
    >
      {cards.map((card) => {
        const isClickable = !(card.requiresChild && !hasLinkedStudents) && card.link;
        const CardComponent = isClickable ? Link : 'div';
        
        const cardSpecificProps = isClickable ? { to: card.link, className: "block group h-full" } : { className: "h-full" };

        const isDisabled = card.requiresChild && !hasLinkedStudents;

        return (
          <motion.div key={card.id} variants={cardItemVariants}>
            <CardComponent {...cardSpecificProps}>
              <DashboardCard
                title={t(card.titleKey, {myChild: t('common.myChild')})}
                description={!card.customContent && !isDisabled ? t(card.descriptionKey) : null}
                IconComponent={card.icon}
                iconColor={card.color}
                bgColor={isDisabled ? "bg-slate-800/40" : card.bgColor}
                hoverBgColor={isDisabled ? "hover:bg-slate-800/50" : card.hoverBgColor}
                className={`min-h-[180px] ${isDisabled ? "opacity-60 cursor-not-allowed" : ""}`}
              >
                {card.customContent && hasLinkedStudents && renderCardContent(card)}
                
                <div className="mt-auto pt-4">
                    {isDisabled ? (
                         <p className="text-xs text-yellow-400/80">{t('parentDashboard.requiresChildLink')}</p>
                    ): (
                        isClickable ? (
                            <span className={`inline-flex items-center text-sm font-medium ${card.color.replace('text-','text-')} group-hover:underline`}>
                                {t('common.accessNowButton')}
                                <ChevronRight size={16} className="ml-1.5 transform transition-transform duration-200 group-hover:translate-x-1" />
                            </span>
                        ) : card.customContent && hasLinkedStudents ? (
                            <span className={`inline-flex items-center text-sm font-medium ${card.color.replace('text-','text-')} group-hover:underline`}>
                                {t('common.viewDetailsButton')}
                                <ChevronRight size={16} className="ml-1.5 transform transition-transform duration-200 group-hover:translate-x-1" />
                           </span>
                        ) : (
                           <p className="text-sm text-slate-300">{t(card.descriptionKey)}</p>
                        )
                    )}
                </div>
              </DashboardCard>
            </CardComponent>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default ParentDashboardCards;