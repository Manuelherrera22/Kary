import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Sparkles } from 'lucide-react';

const KarySuggestionCard = ({ suggestion }) => {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.8 }}
      className="p-6 rounded-3xl bg-gradient-to-r from-teal-500/10 to-cyan-500/10 border border-cyan-400/20 flex items-center gap-4 backdrop-blur-sm"
    >
      <Sparkles size={48} className="text-cyan-300 flex-shrink-0" />
      <div>
        <h3 className="font-bold text-lg text-cyan-200">{t('studentDashboard.karySuggestion.title')}</h3>
        <p className="text-slate-300 text-lg">"{suggestion}"</p>
      </div>
    </motion.div>
  );
};

export default KarySuggestionCard;