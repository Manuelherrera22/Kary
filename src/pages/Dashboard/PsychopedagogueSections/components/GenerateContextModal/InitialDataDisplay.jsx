import React from 'react';
import { Label } from '@/components/ui/label';

const InitialDataDisplay = ({ emotionalSummary, academicSummary, t }) => {
  return (
    <>
      <div className="space-y-1">
        <Label htmlFor="emotionalLogsSummary" className="text-slate-300">{t('supportPlans.generateContextModal.emotionalSummaryLabel')}</Label>
        <div className="p-2 text-sm bg-slate-800 border border-slate-700 rounded-md text-slate-400 min-h-[50px]">
          {emotionalSummary.length > 0 && emotionalSummary[0].frecuencia > 0
            ? emotionalSummary.map(log => `${log.emotion} (${log.frecuencia})`).join(', ')
            : t('aiContext.noEmotionalData')}
        </div>
      </div>
      
      <div className="space-y-1">
        <Label htmlFor="academicSummary" className="text-slate-300">{t('supportPlans.generateContextModal.academicSummaryLabel')}</Label>
        <div className="p-2 text-sm bg-slate-800 border border-slate-700 rounded-md text-slate-400 min-h-[50px] whitespace-pre-wrap">
          {academicSummary || t('aiContext.noAcademicData')}
        </div>
      </div>
    </>
  );
};

export default InitialDataDisplay;