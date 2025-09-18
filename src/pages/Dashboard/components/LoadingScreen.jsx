import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const LoadingScreen = ({ text }) => {
  const { t } = useLanguage();
  const defaultText = t('common.loadingText', 'Cargando, un momento por favor...');
  const subtitleText = t('dashboard.loadingTextSubtitle', 'Estamos preparando todo para ti.');


  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-gray-900 flex flex-col items-center justify-center z-50 text-white p-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        className="mb-6"
      >
        <Loader2 size={64} className="text-sky-400" />
      </motion.div>
      <motion.h2 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-2xl font-semibold mb-2 text-center"
      >
        {text || defaultText}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-slate-400 text-center"
      >
        {subtitleText}
      </motion.p>
    </div>
  );
};

export default LoadingScreen;