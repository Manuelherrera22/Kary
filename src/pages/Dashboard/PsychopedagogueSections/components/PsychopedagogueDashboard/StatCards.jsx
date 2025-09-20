import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FolderKanban, AlertTriangle, ShieldCheck, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardTitle, CardDescription } from "@/components/ui/card";
import { useLanguage } from '@/contexts/LanguageContext';

const StatCard = ({ title, value, icon, description, link, loading, color, iconColor }) => {
  const IconComponent = icon;
  const { t } = useLanguage();
  const navigate = useNavigate();

  const handleClick = () => {
    if (link) {
      navigate(link);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{
        scale: 1.03,
        boxShadow: "0px 10px 20px rgba(0,0,0,0.1)",
        borderColor: color
      }}
      className="bg-slate-800/50 p-3 sm:p-4 md:p-6 rounded-xl shadow-lg border border-slate-700 hover:border-opacity-70 transition-all duration-300 flex flex-col justify-between cursor-pointer h-full"
      onClick={handleClick}
    >
      <div>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <CardTitle className="text-base sm:text-lg md:text-xl font-semibold text-slate-200 group-hover:text-white transition-colors">
            {title}
          </CardTitle>
          <div className={`p-1.5 sm:p-2 rounded-full`} style={{ backgroundColor: `${color}20` }}>
            <IconComponent size={18} className="sm:hidden" style={{ color: color }} />
            <IconComponent size={24} className="hidden sm:block" style={{ color: color }} />
          </div>
        </div>
        {loading ? (
          <div className="h-8 sm:h-10 w-16 sm:w-20 bg-slate-700 rounded animate-pulse mb-2"></div>
        ) : (
          <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-1">{value ?? '0'}</p>
        )}
        <CardDescription className="text-slate-400 text-xs sm:text-sm">
          {description}
        </CardDescription>
      </div>
      {link && (
        <Button
          variant="link"
          className="mt-3 sm:mt-4 px-0 self-start transition-colors text-xs sm:text-sm"
          style={{ color: color }}
          onClick={(e) => { e.stopPropagation(); navigate(link); }}
        >
          {t('psychopedagogueDashboard.accessNow')} →
        </Button>
      )}
    </motion.div>
  );
};


const StatCards = ({ data, loading }) => {
  const { t } = useLanguage();

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.1 } },
  };

  const cardData = [
    {
      title: t('psychopedagogueDashboard.activeCasesTitle'),
      value: data?.casos_activos,
      icon: FolderKanban,
      description: t('psychopedagogueDashboard.activeCasesDescription'),
      link: "/dashboard/recent-cases",
      color: "#3b82f6" // blue-500
    },
    {
      title: t('psychopedagogueDashboard.emotionalAlertsTitle'),
      value: data?.alertas_emocionales,
      icon: AlertTriangle,
      description: t('psychopedagogueDashboard.emotionalAlertsDescription'),
      link: "/dashboard/emotional-trends",
      color: "#ef4444" // red-500
    },
    {
      title: t('psychopedagogueDashboard.supportPlansActiveTitle'),
      value: data?.planes_apoyo,
      icon: ShieldCheck,
      description: t('psychopedagogueDashboard.supportPlansActiveDescription'),
      link: "/dashboard/support-plan",
      color: "#22c55e" // green-500
    },
    {
      title: t('psychopedagogueDashboard.pendingTasksTitle'),
      value: data?.pending_tasks ?? 0, // Assuming pending_tasks might not be in the function response yet
      icon: CheckSquare,
      description: t('psychopedagogueDashboard.pendingTasksDescription'),
      link: "/dashboard/assign-task",
      color: "#f59e0b" // amber-500
    }
  ];

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      {cardData.map((card, index) => (
        <StatCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          description={card.description}
          link={card.link}
          loading={loading}
          color={card.color}
        />
      ))}
    </motion.div>
  );
};

export default StatCards;
export default StatCards;