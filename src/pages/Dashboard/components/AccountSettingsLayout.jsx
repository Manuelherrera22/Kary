import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const AccountSettingsLayout = ({ pageTitle, pageSubtitle, headerIcon: HeaderIcon, backLink, children }) => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 min-h-screen text-white"
    >
      <div className="container mx-auto max-w-4xl">
        {backLink && (
          <Link to={backLink} className="inline-flex items-center text-slate-400 hover:text-slate-200 mb-6 transition-colors group">
            <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            {t('common.backToDashboard')}
          </Link>
        )}

        <div className="bg-slate-800/50 backdrop-blur-lg p-6 sm:p-8 rounded-xl shadow-2xl border border-slate-700/50">
          <div className="flex items-center mb-8">
            {HeaderIcon && <HeaderIcon size={36} className="mr-4 text-sky-400" />}
            <div>
              <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">{pageTitle}</h1>
              {pageSubtitle && <p className="text-slate-400">{pageSubtitle}</p>}
            </div>
          </div>
          {children}
        </div>
      </div>
    </motion.div>
  );
};

export default AccountSettingsLayout;