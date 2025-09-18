import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare as MessageSquareText } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const InteractionsCard = ({ interactionsLeft }) => {
  const { t } = useLanguage();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-purple-600/60 p-6 rounded-xl mb-8 shadow-lg border border-purple-500/50 hover-lift cursor-default"
    >
      <div className="flex items-center justify-center text-lg sm:text-xl font-semibold mb-2 text-orange-200">
        <MessageSquareText className="mr-3 h-6 w-6" />
        <span>{t('dashboard.interactionsLeftTitle')}</span>
      </div>
      <p className="text-4xl sm:text-5xl font-bold text-orange-300 text-center mb-1">{interactionsLeft}</p>
      <p className="text-xs text-purple-200 text-center">{t('dashboard.interactionsLeftSubtitle')}</p>
    </motion.div>
  );
};

export default InteractionsCard;