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
      className="text-center text-white p-4 sm:p-6 rounded-2xl mb-6 sm:mb-8"
    >
      <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-purple-300 drop-shadow-lg leading-tight px-2">
        {t('studentDashboard.welcomeMessage', { userName: userName || 'Estudiante' })}
      </h1>
      <p className="text-purple-200 mt-2 text-base sm:text-lg leading-relaxed px-2">
        {t('studentDashboard.welcomeSubtitle')}
      </p>
    </motion.div>
  );
};

export default WelcomeHeader;