import React from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const GenerateActivitiesButton = ({ studentId, planId, onGenerate, isLoading }) => {
  const { t } = useLanguage();

  return (
    <Button 
      onClick={onGenerate} 
      disabled={isLoading || !planId}
      className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md hover:shadow-lg transition-all transform hover:scale-105"
      size="sm"
    >
      {isLoading ? (
        <Loader2 size={16} className="mr-2 animate-spin" />
      ) : (
        <Sparkles size={16} className="mr-2" />
      )}
      {t('teacherDashboard.generateActivitiesButton')}
    </Button>
  );
};

export default GenerateActivitiesButton;