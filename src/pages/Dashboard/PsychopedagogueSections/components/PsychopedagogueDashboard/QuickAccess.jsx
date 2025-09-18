import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Brain, TrendingUp, MessageSquare, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const QuickAccess = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const quickAccessCards = [
    { title: t('psychopedagogueDashboard.karyCorePanel.title'), description: t('psychopedagogueDashboard.karyCorePanel.description'), icon: Brain, link: "/dashboard/kary-core", key: "karyCore" },
    { title: t('psychopedagogueDashboard.predictiveRisk.title'), description: t('psychopedagogueDashboard.predictiveRisk.description'), icon: TrendingUp, link: "/dashboard/predictive-risk", key: "predictiveRisk" },
    { title: t('psychopedagogueDashboard.communication.title'), description: t('psychopedagogueDashboard.communication.description'), icon: MessageSquare, link: "/dashboard/direct-communication", key: "communication" },
    { title: t('psychopedagogueDashboard.settings.title'), description: t('psychopedagogueDashboard.settings.description'), icon: Settings, link: "/dashboard/psychopedagogue-settings", key: "settings" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="p-6 bg-slate-800 rounded-xl shadow-xl border border-slate-700"
    >
      <h2 className="text-2xl font-semibold text-sky-400 mb-6">{t('psychopedagogueDashboard.quickAccessTitle')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickAccessCards.map((card) => (
          <motion.div
            key={card.key}
            variants={itemVariants}
            whileHover={{ scale: 1.05, y: -5, boxShadow: "0px 8px 15px rgba(0,0,0,0.2)" }}
            className="bg-slate-800/50 hover:bg-slate-700/70 p-6 rounded-lg shadow-lg border border-slate-700 hover:border-purple-500/50 transition-all duration-300 cursor-pointer flex flex-col items-start"
            onClick={() => card.link && navigate(card.link)}
          >
            <div className="p-3 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-lg mb-4 inline-block shadow-md">
              <card.icon size={24} className="text-white" />
            </div>
            <h3 className="text-lg font-semibold text-slate-100 mb-1">{card.title}</h3>
            <p className="text-sm text-slate-400 mb-3 flex-grow">{card.description}</p>
            <Button
              variant="link"
              className="text-purple-400 hover:text-purple-300 px-0 self-start"
              onClick={(e) => { e.stopPropagation(); if (card.link) navigate(card.link); }}
            >
              {t('common.accessButton')} →
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default QuickAccess;