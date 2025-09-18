import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Zap, ExternalLink, Mic, AlertTriangle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ConvaiConnectCard = ({ userName }) => {
  const { t } = useLanguage();
  const convaiStreamUrl = "https://x.convai.com/?xpid=db921e3a-2846-47e1-b8d6-6c044a39fcbe&type=unlisted";
  const karyAvatarUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/41c6e2cc-d964-4a03-87ae-a9b8c21bef72/91bb095d98f3ac91b4c6852c7181c2cd.png"; 
  const karyAILogoUrl = "https://storage.googleapis.com/hostinger-horizons-assets-prod/41c6e2cc-d964-4a03-87ae-a9b8c21bef72/587cae66eaa37a38ef294e33ac3506ae.png";
  const videoDemoLink = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 p-6 sm:p-8 rounded-xl shadow-xl mt-8 border border-white/30"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start mb-6">
        <div className="relative mb-4 sm:mb-0 sm:mr-6">
          <img
            src={karyAvatarUrl}
            alt={t('dashboard.karyAvatarAlt')}
            className="h-24 w-24 sm:h-28 sm:w-28 rounded-full shadow-lg border-4 border-white/50 object-cover"
          />
          <img
            src={karyAILogoUrl}
            alt={t('dashboard.karyAILogoAlt')}
            className="absolute -bottom-2 -right-2 h-10 w-10 sm:h-12 sm:w-12 rounded-full p-1 bg-white shadow-md object-contain"
          />
        </div>
        <div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white text-shadow-sm mb-2 text-center sm:text-left">
            {t('dashboard.connectKaryTitle')}
          </h3>
          <p className="text-sm sm:text-base text-purple-100 mb-3 text-shadow-xs text-center sm:text-left">
            {t('dashboard.connectKaryDesc1')}
          </p>
          <p className="text-xs sm:text-sm text-purple-200 text-shadow-xs text-center sm:text-left">
            {t('dashboard.connectKaryDesc2')}
          </p>
        </div>
      </div>

      <Button 
        asChild 
        className="w-full bg-white text-purple-700 hover:bg-purple-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg group"
      >
        <a href={convaiStreamUrl} target="_blank" rel="noopener noreferrer">
          <Zap size={20} className="mr-2 text-orange-500 group-hover:animate-pulse" /> 
          {t('dashboard.connectKaryButton')}
          <ExternalLink size={18} className="ml-2 opacity-70 group-hover:opacity-100" />
        </a>
      </Button>
      
      <div className="mt-6 space-y-3 text-xs sm:text-sm text-purple-200">
        <div className="flex items-center bg-black/20 p-2.5 rounded-md">
          <Mic size={16} className="mr-2 text-green-300 flex-shrink-0" />
          <p>{t('dashboard.microphoneTip')}</p>
        </div>
        <div className="flex items-start bg-black/20 p-2.5 rounded-md">
          <AlertTriangle size={20} className="mr-2 text-yellow-300 flex-shrink-0 mt-0.5" />
          <p>{t('dashboard.exclusiveAccessNote')}</p>
        </div>
      </div>

      <p 
        className="mt-5 text-center text-xs text-purple-100 hover:text-white transition-colors"
        dangerouslySetInnerHTML={{ __html: t('dashboard.convaiOfflineAlternative', { videoLink: videoDemoLink }) }}
      />

    </motion.div>
  );
};

export default ConvaiConnectCard;