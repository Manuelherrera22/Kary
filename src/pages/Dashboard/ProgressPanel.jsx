import React from 'react';
import { BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ProgressPanel = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20">
      <h3 className="text-xl font-semibold text-purple-200 mb-4">{t('dashboard.progressTitle')}</h3>
       <div className="flex items-center justify-center text-purple-300 py-4">
          <BarChart3 size={28} className="mr-3"/>
          <p className="text-sm">{t('dashboard.progressComingSoon')}</p>
      </div>
    </div>
  );
};

export default ProgressPanel;