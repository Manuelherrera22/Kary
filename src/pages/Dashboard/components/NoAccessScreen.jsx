import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const NoAccessScreen = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-500 via-pink-500 to-orange-500 text-white p-6 text-center">
      <ShieldAlert className="h-24 w-24 text-yellow-300 mb-8" />
      <h1 className="text-4xl font-bold mb-4">{t('dashboard.noAccessTitle')}</h1>
      <p className="text-xl mb-8 max-w-md">
        {t('dashboard.noAccessSubtitle')}
      </p>
      <Button
        onClick={() => navigate('/')}
        className="bg-white text-purple-700 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg shadow-lg transition-transform transform hover:scale-105"
      >
        {t('dashboard.goBackButton')}
      </Button>
    </div>
  );
};

export default NoAccessScreen;