import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth'; 

const WelcomeUser = () => {
  const { t } = useLanguage();
  const { user, userProfile, loading: authLoading } = useAuth();

  if (authLoading && (!userProfile && !user)) {
    return (
       <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-8 p-6 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white shadow-xl dark:from-gray-800 dark:via-purple-800 dark:to-pink-800 animate-pulse"
      >
        <div className="h-8 bg-purple-400/50 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-purple-300/50 rounded w-full mb-1"></div>
        <div className="h-4 bg-purple-300/50 rounded w-1/2"></div>
      </motion.div>
    );
  }

  const nameToDisplay = userProfile?.full_name || user?.email || t('common.guest');
  const roleToDisplay = userProfile?.role ? t(`roles.${userProfile.role}`) : t('roles.unknown');

  const welcomeTitle = t('dashboard.greeting', 'Hola, {userName}').replace('{userName}', nameToDisplay);
  const welcomeSubtitle = t('dashboard.welcomeMessage', 'Bienvenido/a de nuevo a tu panel de Kary AI, {userIdentifier}.')
                          .replace('{userIdentifier}', nameToDisplay);


  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-8 p-6 rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-white shadow-xl dark:from-gray-800 dark:via-purple-800 dark:to-pink-800"
    >
      <h1 className="text-3xl font-bold mb-1">
        {welcomeTitle}
      </h1>
      <p className="text-purple-100 dark:text-purple-300 text-md">
        {welcomeSubtitle}
      </p>
      <p className="text-sm text-purple-200 dark:text-purple-400 mt-2">
        {t('dashboard.currentRoleLabel', 'Rol actual')}: <span className="font-semibold">{roleToDisplay}</span>
      </p>
    </motion.div>
  );
};

export default WelcomeUser;