import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { SmilePlus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrackingForm from './PersonalTrackingPage/components/TrackingForm';
import AnalysisDisplay from './PersonalTrackingPage/components/AnalysisDisplay';
import { useEmotionalTracking } from './PersonalTrackingPage/hooks/useEmotionalTracking';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import MagicBackground from '@/pages/Dashboard/StudentDashboard/components/MagicBackground';

const PersonalTrackingPage = () => {
  const { t } = useLanguage();
  const { userProfile } = useAuth();
  const {
    tags,
    classifications,
    trackingText,
    setTrackingText,
    selectedTags,
    selectedTagObjects,
    toggleTag,
    onGuardarSeguimiento,
    analysisResult,
    isAnalyzing,
    isLoadingClassifications,
    isLoadingTags,
    isSubmitting,
    authLoading,
  } = useEmotionalTracking();

  const canViewAnalysis = userProfile && userProfile.role !== 'student';

  return (
    <MagicBackground>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-4 sm:p-6"
      >
        <div className="container mx-auto max-w-3xl">
          <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-6 transition-colors group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            {t('common.backToDashboard')}
          </Link>

          <header className="page-header">
            <h1 className="page-title bg-gradient-to-r from-pink-400 to-rose-500">
              <SmilePlus size={36} className="mr-3" />
              {t('studentDashboard.personalTrackingPage.title')}
            </h1>
            <p className="page-subtitle mt-2">{t('studentDashboard.personalTrackingPage.subtitle')}</p>
          </header>

          <TrackingForm
            trackingText={trackingText}
            setTrackingText={setTrackingText}
            classifications={classifications}
            tags={tags}
            selectedTags={selectedTags}
            selectedTagObjects={selectedTagObjects}
            toggleTag={toggleTag}
            onGuardarSeguimiento={onGuardarSeguimiento}
            isSubmitting={isSubmitting}
            authLoading={authLoading}
            isAnalyzing={isAnalyzing}
            isLoadingClassifications={isLoadingClassifications}
            isLoadingTags={isLoadingTags}
          />

          {canViewAnalysis && (
            <AnalysisDisplay
              analysisResult={analysisResult}
              isAnalyzing={isAnalyzing}
            />
          )}
        </div>
      </motion.div>
    </MagicBackground>
  );
};

export default PersonalTrackingPage;