import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { AlertOctagon, AlertTriangle } from 'lucide-react';

const ProgramEscalatedAlertsPage = () => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gradient-to-br from-slate-900 via-red-900 to-orange-900 min-h-screen text-white"
    >
      <header className="mb-8 text-center">
        <AlertOctagon size={48} className="mx-auto mb-4 text-red-400" />
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400">
          {t('programCoordinatorDashboard.escalatedAlerts.title', 'Alertas Escaladas del Programa')}
        </h1>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
          {t('programCoordinatorDashboard.escalatedAlerts.desc', 'Visualiza y gestiona alertas generadas por docentes y psicopedagogos de tu programa.')}
        </p>
      </header>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="bg-slate-800/70 border border-slate-700 p-8 rounded-xl shadow-2xl text-center"
      >
        <AlertTriangle size={40} className="mx-auto mb-4 text-yellow-400" />
        <h2 className="text-2xl font-semibold text-yellow-300 mb-2">
          {t('common.featureComingSoonTitle', '¡Próximamente!')}
        </h2>
        <p className="text-slate-300">
          {t('common.featureComingSoonMessage', 'El panel de alertas escaladas está en desarrollo y estará disponible pronto.')}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ProgramEscalatedAlertsPage;