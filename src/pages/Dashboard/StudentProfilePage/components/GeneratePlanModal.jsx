import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { useMockAuth } from '@/contexts/MockAuthContext';
import edgeFunctionService from '@/services/edgeFunctionService'; // Changed to default import
import { Lightbulb, Loader2 } from 'lucide-react';
import EmotionalTagSelector from '@/components/shared/EmotionalTagSelector';
import GeneratedPlanViewer from './GeneratedPlanViewer';

const GeneratePlanModal = ({ isOpen, onOpenChange, studentId, studentName }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { userProfile } = useMockAuth();

  const [context, setContext] = useState('');
  const [emotionalTagId, setEmotionalTagId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const resetModal = () => {
    setContext('');
    setEmotionalTagId('');
    setIsLoading(false);
    setGeneratedPlan(null);
  };

  const handleOpenChange = (open) => {
    if (!open) {
      resetModal();
    }
    onOpenChange(open);
  };

  const handleGeneratePlan = async () => {
    if (!studentId) {
      toast({
        variant: 'destructive',
        title: t('toast.errorTitle', { ns: 'toasts' }),
        description: t('studentProfilePage.generatePlanModal.studentIdMissing'),
      });
      return;
    }
    if (!context.trim()) {
      toast({
        variant: 'destructive',
        title: t('toast.errorTitle', { ns: 'toasts' }),
        description: t('studentProfilePage.teacherObservations.situationRequired'),
      });
      return;
    }
    setIsLoading(true);
    setGeneratedPlan(null);
    try {
      const { data, error: functionError, status } = await edgeFunctionService.karyAISupportPlanGenerator({
        student_id: studentId,
        context: context,
        emotional_tag_id: emotionalTagId || undefined, 
        generated_by: userProfile?.id 
      });

      if (functionError) {
        let errorMessage = t('toasts.genericError', { ns: 'toasts' });
        if (functionError.message) {
            errorMessage = functionError.message;
        } else if (typeof functionError === 'object' && functionError.error) {
            errorMessage = functionError.error;
        } else if (typeof functionError === 'object') {
            errorMessage = JSON.stringify(functionError);
        } else if (functionError) {
            errorMessage = String(functionError);
        }
        throw new Error(errorMessage);
      }
      
      if (!data || !data.plan_json) {
        throw new Error(t('supportPlans.aiGenerator.errorNoPlanData', {ns: 'supportPlans'}));
      }

      setGeneratedPlan(data.plan_json);

      toast({
        title: t('toast.successTitle', { ns: 'toasts' }),
        description: t('supportPlans.aiGenerator.successMessage', {ns: 'supportPlans'}),
      });

    } catch (err) {
      console.error("Error generating support plan:", err);
      toast({
        variant: 'destructive',
        title: t('toast.errorTitle', { ns: 'toasts' }),
        description: err.message || t('toasts.genericError', { ns: 'toasts' }),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-slate-800 border-slate-700 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl text-purple-300">
            <Lightbulb className="mr-2" />
            {t('supportPlans.aiGenerator.generateModalTitle', { ns: 'supportPlans' })}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {t('supportPlans.aiGenerator.generateModalDescription', { ns: 'supportPlans', studentName: studentName })}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 space-y-4">
            <Loader2 className="h-16 w-16 animate-spin text-purple-400" />
            <h3 className="text-lg font-semibold">{t('supportPlans.aiGenerator.generatingTitle', { ns: 'supportPlans' })}</h3>
            <p className="text-slate-400">{t('supportPlans.aiGenerator.generatingDescription', { ns: 'supportPlans' })}</p>
            <div className="w-full space-y-2 mt-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ) : generatedPlan ? (
          <GeneratedPlanViewer plan={generatedPlan} />
        ) : (
          <div className="space-y-4 py-4">
            <div>
              <Label htmlFor="context-input" className="text-slate-300">
                {t('supportPlans.aiGenerator.contextLabel', { ns: 'supportPlans' })}
              </Label>
              <Textarea
                id="context-input"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder={t('supportPlans.aiGenerator.contextPlaceholder', { ns: 'supportPlans' })}
                className="min-h-[120px] bg-slate-700 border-slate-600 focus:ring-purple-500"
              />
            </div>
            <div>
              <Label className="text-slate-300 mb-1 block">
                {t('supportPlans.aiGenerator.emotionalContextLabel', { ns: 'supportPlans'})}
              </Label>
              <EmotionalTagSelector onSelect={setEmotionalTagId} />
            </div>
          </div>
        )}

        {!generatedPlan && (
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} className="text-slate-300 border-slate-600 hover:bg-slate-700">
              {t('common.cancelButton')}
            </Button>
            <Button type="button" onClick={handleGeneratePlan} disabled={isLoading || !context.trim()} className="bg-purple-600 hover:bg-purple-700">
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t('supportPlans.aiGenerator.generateAction', { ns: 'supportPlans' })}
            </Button>
          </DialogFooter>
        )}
         {generatedPlan && (
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleOpenChange(false)} className="text-slate-300 border-slate-600 hover:bg-slate-700">
              {t('common.close')}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default GeneratePlanModal;