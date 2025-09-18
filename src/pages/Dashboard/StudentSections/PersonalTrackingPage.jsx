import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { SmilePlus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrackingForm from './PersonalTrackingPage/components/TrackingForm';
import AnalysisDisplay from './PersonalTrackingPage/components/AnalysisDisplay';
import { useEmotionalTracking } from './PersonalTrackingPage/hooks/useEmotionalTracking';
import { useMockAuth } from '@/contexts/MockAuthContext';
import MagicBackground from '@/pages/Dashboard/StudentDashboard/components/MagicBackground';

const PersonalTrackingPage = () => {
  const { t } = useLanguage();
  const { userProfile } = useMockAuth();
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
        className="min-h-screen p-4 sm:p-6"
      >
        <div className="container mx-auto max-w-4xl">
          {/* Header Section */}
          <div className="mb-8">
            <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-6 transition-all duration-200 group">
              <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
              {t('common.backToDashboard')}
            </Link>

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-pink-500 via-rose-500 to-red-500 p-8 shadow-2xl">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-center space-x-4">
                <div className="p-4 bg-white/20 rounded-2xl backdrop-blur-sm">
                  <SmilePlus size={32} className="text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    {t('studentDashboard.personalTrackingPage.title')}
                  </h1>
                  <p className="text-white/90 text-lg">
                    {t('studentDashboard.personalTrackingPage.subtitle')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
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
        </div>
      </motion.div>
    </MagicBackground>
  );
};

export default PersonalTrackingPage;