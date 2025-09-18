import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Zap } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const PsychopedagogueQuickAccessPage = () => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-gray-800 via-slate-800 to-neutral-900 min-h-screen text-white"
    >
      <div className="container mx-auto">
        <Link to="/dashboard" className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-6 transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          {t('common.backToDashboard')}
        </Link>

        <div className="bg-slate-700/30 backdrop-blur-md p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-600">
          <div className="flex items-center mb-8">
            <Zap size={36} className="mr-4 text-sky-400" />
            <div>
              <h1 className="text-3xl font-bold">{t('dashboards.common.quickAccessTitle')}</h1>
              <p className="text-slate-400">{t('dashboards.psychopedagogue.quickAccessPageSubtitle')}</p>
            </div>
          </div>
          
          <div className="text-center py-12">
            <p className="text-xl text-slate-300">{t('common.featureComingSoon')}</p>
            <p className="text-slate-400 mt-2">{t('dashboards.psychopedagogue.quickAccessPagePlaceholder')}</p>
          </div>

        </div>
      </div>
    </motion.div>
  );
};

export default PsychopedagogueQuickAccessPage;