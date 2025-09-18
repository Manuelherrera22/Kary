import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { HeartHandshake, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import MagicBackground from '@/pages/Dashboard/StudentDashboard/components/MagicBackground';
import AttendanceForm from './components/AttendanceForm';
import { useEmotionalAttendance } from './hooks/useEmotionalAttendance';
import { useMockAuth } from '@/contexts/MockAuthContext';
import SuggestedCounselingCard from './components/SuggestedCounselingCard';

const EmotionalAttendancePage = () => {
  const { t } = useLanguage();
  const { user } = useMockAuth();
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
        className="min-h-screen p-4 sm:p-6"
      >
        <div className="container mx-auto max-w-4xl">
          {/* Header Section */}
          <div className="mb-8">
            <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-6 transition-all duration-200 group">
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              {t('common.backToDashboard')}
            </Link>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 p-8 shadow-2xl text-center">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                  <HeartHandshake size={32} className="text-white" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {t('emotionalAttendance.pageTitle')}
                </h1>
                <p className="text-white/90 text-lg">
                  {t('emotionalAttendance.pageSubtitle')}
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
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
        </div>
      </motion.div>
    </MagicBackground>
  );
};

export default EmotionalAttendancePage;