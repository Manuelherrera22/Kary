import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const WelcomeHeader = ({ userName }) => {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.1 }}
      className="text-center text-white p-6 sm:p-8 md:p-10 rounded-2xl mb-8 sm:mb-10 bg-gradient-to-br from-slate-800/50 to-purple-900/30 border border-purple-500/20"
    >
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-purple-300 drop-shadow-lg leading-tight px-4 mb-4">
        {t('studentDashboard.welcomeMessage', { userName: userName || 'Estudiante' })}
      </h1>
      <p className="text-purple-200 text-lg sm:text-xl md:text-2xl leading-relaxed px-4 font-medium">
        {t('studentDashboard.welcomeSubtitle')}
      </p>
    </motion.div>
  );
};

export default WelcomeHeader;