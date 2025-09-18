import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Sparkles, Star, Cloud, Droplet, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

const EmotionalAuraCard = ({ emotionalState }) => {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const stateConfig = useMemo(() => ({
    happy: { icon: Star, color: 'text-yellow-300', auraColor: 'shadow-yellow-300/50', bgColor: 'bg-yellow-900/20' },
    neutral: { icon: Cloud, color: 'text-purple-300', auraColor: 'shadow-purple-300/40', bgColor: 'bg-purple-900/20' },
    sad: { icon: Droplet, color: 'text-sky-300', auraColor: 'shadow-sky-300/50', bgColor: 'bg-sky-900/20' },
    loading: { icon: Sparkles, color: 'text-slate-400', auraColor: 'shadow-slate-400/30', bgColor: 'bg-slate-800/20' },
  }), []);

  const currentStatus = emotionalState?.status || 'loading';
  const { icon: Icon, color, auraColor, bgColor } = stateConfig[currentStatus];
  
  const messageKey = `studentDashboard.emotionalState.${currentStatus}.message`;
  const message = emotionalState?.message || t(messageKey);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className={cn(
        'p-6 rounded-3xl shadow-2xl border border-white/10 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden',
        bgColor
      )}
    >
      <motion.div 
        className={cn('absolute -inset-16 rounded-full opacity-20 blur-3xl', auraColor)}
        animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div 
        className="relative z-10"
        animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Icon size={56} className={color} />
      </motion.div>
      <div className="flex-grow text-center md:text-left z-10">
        <p className="text-xl text-slate-200">{message}</p>
      </div>
      <Button 
        onClick={() => navigate('/dashboard/kary-chat')}
        className="bg-purple-600/80 hover:bg-purple-600 text-white rounded-full px-8 py-4 text-base shadow-lg transition-all hover:scale-105 hover:shadow-purple-500/40 z-10 border border-purple-400/50"
      >
        <MessageSquare size={22} className="mr-2" />
        {t('studentDashboard.emotionalState.talkToKary')}
      </Button>
    </motion.div>
  );
};

export default EmotionalAuraCard;