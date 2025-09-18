import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Lightbulb, BrainCircuit, PlusCircle, Download } from 'lucide-react';

const HeaderActions = ({ 
  t, 
  selectedStudentId, 
  isLoadingContext, 
  isGeneratePlanDisabled, 
  generatedContextForPlan,
  onOpenGenerateContextModal, 
  onOpenCanvas,
  onOpenManualPlanModal,
  onOpenDownloadModal
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center flex-wrap">
      <Button 
        onClick={onOpenGenerateContextModal} 
        disabled={!selectedStudentId || selectedStudentId === 'all_students' || isLoadingContext} 
        variant="outline"
        className="border-amber-500 text-amber-400 hover:bg-amber-500/10 hover:text-amber-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-amber-500/30 transition-all transform hover:scale-105"
      >
        {isLoadingContext ? <div className="i-lucide-loader-2 w-4 h-4 mr-2 animate-spin" /> : <Lightbulb size={18} className="mr-2" />}
        {t('supportPlans.generateContextAIButton')}
      </Button>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              onClick={() => onOpenCanvas()} 
              disabled={isGeneratePlanDisabled} 
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-purple-500/50 transition-all transform hover:scale-105"
            >
              <BrainCircuit size={18} className="mr-2" />
              {generatedContextForPlan ? t('supportPlans.aiCanvas.generateWithGeneratedContext') : t('supportPlans.aiCanvas.generateWithAI')}
            </Button>
          </TooltipTrigger>
          {isGeneratePlanDisabled && !generatedContextForPlan && (
            <TooltipContent className="bg-slate-900 text-white border-slate-700">
              <p>{t('supportPlans.errorNoContextForAIPlanTooltip')}</p>
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>
      <Button 
        onClick={onOpenManualPlanModal}
        disabled={!selectedStudentId || selectedStudentId === 'all_students'}
        variant="outline"
        className="border-sky-500 text-sky-400 hover:bg-sky-500/10 hover:text-sky-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-sky-500/30 transition-all transform hover:scale-105"
      >
        <PlusCircle size={18} className="mr-2" />
        {t('supportPlans.addPlanButton')}
      </Button>
       <Button 
        onClick={onOpenDownloadModal}
        disabled={!selectedStudentId || selectedStudentId === 'all_students'}
        variant="outline"
        className="border-green-500 text-green-400 hover:bg-green-500/10 hover:text-green-300 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-green-500/30 transition-all transform hover:scale-105"
      >
        <Download size={18} className="mr-2" />
        {t('supportPlans.downloadPlansButton')}
      </Button>
    </div>
  );
};

export default HeaderActions;