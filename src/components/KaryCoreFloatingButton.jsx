import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';

const KaryCoreFloatingButton = () => {
  const { t } = useLanguage();

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            initial={{ scale: 0, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 1 }}
            className="fixed bottom-6 right-6 z-50"
          >
            <Link to="/dashboard/kary-core">
              <Button
                size="icon"
                className="rounded-full w-14 h-14 bg-gradient-to-br from-purple-600 to-pink-500 text-white shadow-2xl hover:from-purple-500 hover:to-pink-400 focus:ring-4 focus:ring-pink-500/50"
                aria-label={t('karyCore.floatingButton.ariaLabel')}
              >
                <Brain size={28} />
              </Button>
            </Link>
          </motion.div>
        </TooltipTrigger>
        <TooltipContent side="left" className="bg-slate-800 text-white border-slate-700 shadow-xl">
          <p>{t('karyCore.floatingButton.tooltip')}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default KaryCoreFloatingButton;