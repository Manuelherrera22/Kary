import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { AlertTriangle, User, ChevronRight, Brain } from 'lucide-react';

const PriorityRadar = ({ priorityData, onSelect, onQuickAction }) => {
  const { t } = useLanguage();

  const getRiskColor = (academicRisk, emotionalRisk) => {
    const totalRisk = (parseFloat(academicRisk) || 0) + (parseFloat(emotionalRisk) || 0);
    if (totalRisk >= 100) return 'border-red-500/70 bg-red-900/30 text-red-300'; // Critical
    if (totalRisk >= 50) return 'border-yellow-500/70 bg-yellow-900/30 text-yellow-300'; // Intervention soon
    return 'border-green-500/70 bg-green-900/30 text-green-300'; // Normal
  };
  
  const getRiskLevelText = (academicRisk, emotionalRisk) => {
    const totalRisk = (parseFloat(academicRisk) || 0) + (parseFloat(emotionalRisk) || 0);
    if (totalRisk >= 100) return t('roleBasedDataPanel.priorityRadar.riskCritical');
    if (totalRisk >= 50) return t('roleBasedDataPanel.priorityRadar.riskHigh');
    return t('roleBasedDataPanel.priorityRadar.riskNormal');
  };


  return (
    <Card className="bg-slate-800/50 border-slate-700/60">
      <CardHeader>
        <CardTitle className="text-xl text-sky-300 flex items-center">
          <AlertTriangle className="mr-2 text-orange-400" />
          {t('roleBasedDataPanel.priorityRadar.title')}
        </CardTitle>
        <CardDescription className="text-slate-400">
          {t('roleBasedDataPanel.priorityRadar.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {priorityData.length === 0 && (
          <p className="text-slate-500 text-center py-4">{t('roleBasedDataPanel.priorityRadar.noPriorityData')}</p>
        )}
        <ul className="space-y-3">
          {priorityData.map((item) => (
            <li 
              key={item.id} 
              className={`p-3 rounded-lg flex items-center justify-between transition-all hover:shadow-lg ${getRiskColor(item.academic_risk, item.emotional_risk)}`}
            >
              <div className="flex items-center overflow-hidden">
                <User className="mr-3 h-5 w-5 flex-shrink-0" />
                <TooltipProvider delayDuration={100}>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <span 
                                className="font-medium truncate cursor-pointer hover:underline"
                                onClick={() => onSelect(item)}
                            >
                                {item.full_name || t('common.unknownStudent')}
                            </span>
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 text-white border-slate-700 shadow-xl">
                            <p>{t('roleBasedDataPanel.priorityRadar.tooltipStudentName', { name: item.full_name })}</p>
                            <p>{t('roleBasedDataPanel.priorityRadar.tooltipAcademicRisk', { risk: item.academic_risk || 'N/A' })}</p>
                            <p>{t('roleBasedDataPanel.priorityRadar.tooltipEmotionalRisk', { risk: item.emotional_risk || 'N/A' })}</p>
                            {item.diagnostic_summary?.condition && <p>{t('roleBasedDataPanel.priorityRadar.tooltipDiagnosis', { diagnosis: item.diagnostic_summary.condition })}</p>}
                            <p className="mt-1 text-xs text-purple-300">{t('roleBasedDataPanel.priorityRadar.tooltipAIRecommends')}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-black/30">
                  {getRiskLevelText(item.academic_risk, item.emotional_risk)}
                </span>
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-slate-300 hover:text-sky-300 hover:bg-sky-500/20"
                    onClick={() => onSelect(item)}
                >
                    <ChevronRight size={16} />
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default PriorityRadar;