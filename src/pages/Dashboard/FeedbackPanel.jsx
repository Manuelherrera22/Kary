import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

const FeedbackPanel = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  return (
    <div className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-2xl border border-white/20 text-center">
      <Button variant="link" className="text-purple-200 hover:text-white text-sm" onClick={() => toast({title: t('dashboard.feedbackThanksTitle')})}>
        {t('dashboard.feedbackButton')}
      </Button>
    </div>
  );
};

export default FeedbackPanel;