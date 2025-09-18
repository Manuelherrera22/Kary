import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { HeartHandshake, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import MagicBackground from '@/pages/Dashboard/StudentDashboard/components/MagicBackground';
import AttendanceForm from './components/AttendanceForm';
import { useEmotionalAttendance } from './hooks/useEmotionalAttendance';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import SuggestedCounselingCard from './components/SuggestedCounselingCard';

const EmotionalAttendancePage = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const {
    selectedEmotion,
    setSelectedEmotion,
    comments,
    setComments,
    isSubmitting,
    showCounseling,
    handleRegister,
  } = useEmotionalAttendance(user?.id);

  return (
    <MagicBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6"
      >
        <div className="container mx-auto max-w-2xl">
          <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-6 transition-colors group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            {t('common.backToDashboard')}
          </Link>

          <header className="page-header text-center mb-8">
            <h1 className="page-title bg-gradient-to-r from-emerald-400 to-cyan-500 flex items-center justify-center">
              <HeartHandshake size={36} className="mr-3" />
              {t('emotionalAttendance.pageTitle')}
            </h1>
            <p className="page-subtitle mt-2">{t('emotionalAttendance.pageSubtitle')}</p>
          </header>

          <AttendanceForm
            selectedEmotion={selectedEmotion}
            setSelectedEmotion={setSelectedEmotion}
            comments={comments}
            setComments={setComments}
            isSubmitting={isSubmitting}
            onRegister={handleRegister}
          />

          {showCounseling && <SuggestedCounselingCard />}

        </div>
      </motion.div>
    </MagicBackground>
  );
};

export default EmotionalAttendancePage;