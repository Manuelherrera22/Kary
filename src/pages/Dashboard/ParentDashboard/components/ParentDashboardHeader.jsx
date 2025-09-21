import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';

const ParentDashboardHeader = ({ user, userProfile, hasLinkedStudents, authLoading }) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="text-center mb-12"
    >
      <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-purple-300 to-pink-300">
        {t('parentDashboard.pageTitle')}
      </h1>
      <p className="text-lg text-slate-300 mt-2 max-w-2xl mx-auto">
        {t('parentDashboard.pageSubtitle', '', { userName: userProfile?.full_name || user?.email })}
      </p>
      {!hasLinkedStudents && !authLoading && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-yellow-400 mt-2 text-sm bg-yellow-500/10 p-2 rounded-md inline-block"
        >
          {t('parentDashboard.noChildLinked')}
        </motion.p>
      )}
    </motion.div>
  );
};

export default ParentDashboardHeader;