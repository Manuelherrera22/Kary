import React from 'react';
import { motion } from 'framer-motion';
import { BookCheck } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import LoadingScreen from "@/pages/Dashboard/components/LoadingScreen";
import TabsRecursosEstudiante from '@/pages/Dashboard/StudentSections/components/TabsRecursosEstudiante';
import MagicBackground from '@/pages/Dashboard/StudentDashboard/components/MagicBackground';

export default function AssignedResourcesPage() {
  const { t } = useLanguage();
  const { userProfile, loading: authLoading } = useAuth();

  if (authLoading || !userProfile) {
    return <LoadingScreen />;
  }
  
  const pageTitle = t('studentDashboard.assignedResourcesPage.pageTitle');

  return (
    <MagicBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-full mx-auto py-8 px-4 sm:px-6 lg:px-8"
      >
        <header className="page-header">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.1 }}
            className="inline-block p-4 bg-slate-700/50 rounded-full shadow-xl border border-slate-600/50 mb-5"
          >
            <BookCheck size={48} className="text-amber-400" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2, ease: "easeOut" }}
            className="page-title bg-gradient-to-r from-amber-400 via-yellow-300 to-orange-400"
          >
            {pageTitle}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3, ease: "easeOut" }}
            className="page-subtitle max-w-2xl mx-auto"
          >
            {t('studentDashboard.assignedResourcesPage.subtitle')}
          </motion.p>
        </header>

        <TabsRecursosEstudiante user={userProfile} />
        
      </motion.div>
    </MagicBackground>
  );
}