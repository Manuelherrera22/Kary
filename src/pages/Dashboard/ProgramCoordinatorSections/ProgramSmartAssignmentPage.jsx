import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Cpu, AlertTriangle } from 'lucide-react';

const ProgramSmartAssignmentPage = () => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-gradient-to-br from-slate-900 via-teal-900 to-green-900 min-h-screen text-white"
    >
      <header className="mb-8 text-center">
        <Cpu size={48} className="mx-auto mb-4 text-teal-400" />
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 via-emerald-400 to-green-400">
          {t('programCoordinatorDashboard.programSmartAssignment.title', 'Asignación Inteligente por Programa')}
        </h1>
        <p className="text-slate-400 mt-2 max-w-2xl mx-auto">
          {t('programCoordinatorDashboard.programSmartAssignment.desc', 'Aplica sugerencias IA a grupos completos, con recursos y planes de apoyo personalizables.')}
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
          {t('common.featureComingSoonMessage', 'La asignación inteligente para programas estará disponible pronto.')}
        </p>
      </motion.div>
    </motion.div>
  );
};

export default ProgramSmartAssignmentPage;