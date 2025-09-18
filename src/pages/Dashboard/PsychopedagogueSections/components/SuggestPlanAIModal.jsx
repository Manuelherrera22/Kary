import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { Lightbulb, Zap, CheckSquare, BookOpen, Loader2, Brain } from 'lucide-react';

const SuggestPlanAIModal = ({ isOpen, onOpenChange }) => {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = React.useState(false);
  const [suggestedPlan, setSuggestedPlan] = React.useState(null);

  const handleGenerateSuggestion = async () => {
    setIsLoading(true);
    setSuggestedPlan(null);
    // Simulate AI call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSuggestedPlan({
      objectives: [
        t('psychopedagogueDashboard.suggestPlanAIModal.sampleObjective1'),
        t('psychopedagogueDashboard.suggestPlanAIModal.sampleObjective2'),
      ],
      activities: [
        { name: t('psychopedagogueDashboard.suggestPlanAIModal.sampleActivity1Name'), type: t('psychopedagogueDashboard.suggestPlanAIModal.sampleActivityTypeIndividual') },
        { name: t('psychopedagogueDashboard.suggestPlanAIModal.sampleActivity2Name'), type: t('psychopedagogueDashboard.suggestPlanAIModal.sampleActivityTypeGroup') },
      ],
      resources: [
        { title: t('psychopedagogueDashboard.suggestPlanAIModal.sampleResource1Title'), type: t('psychopedagogueDashboard.suggestPlanAIModal.sampleResourceTypeWorksheet') },
        { title: t('psychopedagogueDashboard.suggestPlanAIModal.sampleResource2Title'), type: t('psychopedagogueDashboard.suggestPlanAIModal.sampleResourceTypeVideo') },
      ],
      timeline: t('psychopedagogueDashboard.suggestPlanAIModal.sampleTimeline'),
    });
    setIsLoading(false);
  };

  const handleAcceptPlan = () => {
    // Logic to use the plan, e.g., pre-fill another form
    console.log("Plan aceptado:", suggestedPlan);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-slate-800 border-slate-700 text-slate-50">
        <DialogHeader>
          <DialogTitle className="text-lime-400 text-2xl flex items-center">
            <Lightbulb size={28} className="mr-3 text-lime-400" />
            {t('psychopedagogueDashboard.suggestPlanAIModal.title')}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {t('psychopedagogueDashboard.suggestPlanAIModal.description')}
          </DialogDescription>
        </DialogHeader>
        
        {!suggestedPlan && !isLoading && (
          <div className="py-6 text-center">
            <Button onClick={handleGenerateSuggestion} className="bg-lime-500 hover:bg-lime-600 text-slate-900 font-semibold">
              <Zap size={18} className="mr-2" />
              {t('psychopedagogueDashboard.suggestPlanAIModal.generateButton')}
            </Button>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-lime-400 mb-4" />
            <p className="text-slate-300 text-lg">{t('psychopedagogueDashboard.suggestPlanAIModal.loadingTitle')}</p>
            <p className="text-slate-400">{t('psychopedagogueDashboard.suggestPlanAIModal.loadingDescription')}</p>
          </div>
        )}

        {suggestedPlan && !isLoading && (
          <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            <div>
              <h3 className="font-semibold text-lg text-lime-300 flex items-center mb-1">
                <CheckSquare size={20} className="mr-2" />{t('psychopedagogueDashboard.suggestPlanAIModal.objectivesTitle')}
              </h3>
              <ul className="list-disc list-inside pl-2 space-y-1 text-slate-300">
                {suggestedPlan.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-lime-300 flex items-center mb-1">
                <Brain size={20} className="mr-2" />{t('psychopedagogueDashboard.suggestPlanAIModal.activitiesTitle')}
              </h3>
              <ul className="list-disc list-inside pl-2 space-y-1 text-slate-300">
                {suggestedPlan.activities.map((act, i) => <li key={i}>{act.name} ({act.type})</li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-lime-300 flex items-center mb-1">
                <BookOpen size={20} className="mr-2" />{t('psychopedagogueDashboard.suggestPlanAIModal.resourcesTitle')}
              </h3>
              <ul className="list-disc list-inside pl-2 space-y-1 text-slate-300">
                {suggestedPlan.resources.map((res, i) => <li key={i}>{res.title} ({res.type})</li>)}
              </ul>
            </div>
             <div>
              <h3 className="font-semibold text-lg text-lime-300 mb-1">{t('psychopedagogueDashboard.suggestPlanAIModal.timelineTitle')}</h3>
              <p className="text-slate-300">{suggestedPlan.timeline}</p>
            </div>
          </div>
        )}

        <DialogFooter className="sm:justify-between pt-4 border-t border-slate-700">
           <DialogClose asChild>
            <Button type="button" variant="outline" className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-slate-100 w-full sm:w-auto">
              {t('common.cancelButton')}
            </Button>
          </DialogClose>
          {suggestedPlan && !isLoading && (
             <Button onClick={handleAcceptPlan} className="bg-lime-500 hover:bg-lime-600 text-slate-900 font-semibold w-full sm:w-auto">
               <CheckSquare size={18} className="mr-2" />
               {t('psychopedagogueDashboard.suggestPlanAIModal.acceptButton')}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SuggestPlanAIModal;