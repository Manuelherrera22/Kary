import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { AlertTriangle, CheckCircle, Loader2, MessageSquare, X, CalendarDays, Info } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

const PlanDetailModal = ({ isOpen, onOpenChange, plan, studentName, onPlanUpdate }) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const dateLocale = language === 'es' ? es : enUS;

  const [planDetails, setPlanDetails] = useState(null);
  const [stepProgress, setStepProgress] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const parsePlanJson = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.error("Error parsing plan_json:", e);
      toast({ title: t('toast.errorTitle'), description: t('psychopedagoguePlans.errorLoadingPlanDetails'), variant: 'destructive' });
      return null;
    }
  };

  const fetchStepProgress = useCallback(async (planId, stepsCount) => {
    if (!planId || stepsCount === 0) return;
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_plans_detailed')
        .select('*')
        .eq('plan_id', planId);

      if (error) throw error;

      const progressMap = {};
      data.forEach(item => {
        progressMap[item.step_index] = {
          status: item.status,
          observacion: item.observacion || '',
          updated_at: item.updated_at
        };
      });
      
      // Initialize progress for steps not in DB
      for (let i = 0; i < stepsCount; i++) {
        if (!progressMap[i]) {
          progressMap[i] = { status: 'pendiente', observacion: '', updated_at: null };
        }
      }
      setStepProgress(progressMap);

    } catch (error) {
      console.error("Error fetching step progress:", error);
      toast({ title: t('toast.errorTitle'), description: error.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  useEffect(() => {
    if (isOpen && plan && plan.plan_json) {
      const parsed = parsePlanJson(plan.plan_json);
      setPlanDetails(parsed);
      if (parsed && parsed.steps) {
        fetchStepProgress(plan.id, parsed.steps.length);
      } else {
        setStepProgress({});
      }
    } else {
      setPlanDetails(null);
      setStepProgress({});
    }
  }, [isOpen, plan, fetchStepProgress]);

  const handleStepStatusChange = (index, newStatus) => {
    setStepProgress(prev => ({
      ...prev,
      [index]: { ...prev[index], status: newStatus, updated_at: new Date().toISOString() }
    }));
  };

  const handleObservationChange = (index, text) => {
    setStepProgress(prev => ({
      ...prev,
      [index]: { ...prev[index], observacion: text, updated_at: new Date().toISOString() }
    }));
  };

  const handleSaveProgress = async () => {
    if (!planDetails || !planDetails.steps) return;
    setIsSaving(true);
    try {
      const upsertPromises = Object.entries(stepProgress).map(([index, progress]) => {
        return supabase
          .from('support_plans_detailed')
          .upsert({
            plan_id: plan.id,
            step_index: parseInt(index),
            status: progress.status,
            observacion: progress.observacion,
            updated_at: new Date().toISOString() 
          }, { onConflict: 'plan_id, step_index' });
      });

      const results = await Promise.all(upsertPromises);
      results.forEach(result => {
        if (result.error) throw result.error;
      });

      toast({ title: t('psychopedagoguePlans.progressSavedSuccess') });
      if (onPlanUpdate) onPlanUpdate(); // Refresh list if needed
      onOpenChange(false); // Close modal on successful save
    } catch (error) {
      console.error("Error saving progress:", error);
      toast({ title: t('toast.errorTitle'), description: t('psychopedagoguePlans.errorSavingProgress') + `: ${error.message}`, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };
  
  const renderPlanSection = (titleKey, content, isList = false) => {
    if (!content || (isList && content.length === 0)) return null;
    return (
      <div className="mb-4">
        <h4 className="text-md font-semibold text-purple-300 mb-1.5">{t(titleKey)}</h4>
        {isList ? (
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-300">
            {content.map((item, index) => (
              <li key={index}>{typeof item === 'object' ? item.description || JSON.stringify(item) : item}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-slate-300 whitespace-pre-wrap">{content}</p>
        )}
      </div>
    );
  };

  const renderActions = (actions) => {
    if (!actions || actions.length === 0) return null;
    return (
      <div className="mb-4">
        <h4 className="text-md font-semibold text-purple-300 mb-1.5">{t('psychopedagoguePlans.actions')}</h4>
        <ul className="space-y-2 text-sm text-slate-300">
          {actions.map((action, index) => (
            <li key={index} className="p-2 bg-slate-700/50 rounded-md">
              <p><strong className="text-slate-200">{t('psychopedagoguePlans.actor')}:</strong> {action.actor}</p>
              <p><strong className="text-slate-200">{t('psychopedagoguePlans.description')}:</strong> {action.description}</p>
              {action.timeline && <p><strong className="text-slate-200">{t('psychopedagoguePlans.timeline')}:</strong> {action.timeline}</p>}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderStepsWithProgress = (steps) => {
    if (!steps || steps.length === 0) return null;
    return (
      <div className="mb-4">
        <h4 className="text-md font-semibold text-purple-300 mb-2">{t('psychopedagoguePlans.steps')}</h4>
        <div className="space-y-4">
          {steps.map((step, index) => {
            const progress = stepProgress[index] || { status: 'pendiente', observacion: '', updated_at: null };
            return (
              <div key={index} className="p-3 bg-slate-700/50 rounded-lg border border-slate-600">
                <p className="font-medium text-slate-200 mb-1">{step.title || `${t('common.step')} ${index + 1}`}</p>
                <p className="text-xs text-slate-400 mb-2">{step.description}</p>
                
                <div className="flex items-center space-x-3 mb-2">
                  <Label className="text-xs text-slate-300">{t('psychopedagoguePlans.stepStatus')}:</Label>
                  {['pendiente', 'en_progreso', 'completado'].map(statusValue => (
                    <Button
                      key={statusValue}
                      size="xs"
                      variant={progress.status === statusValue ? 'default' : 'outline'}
                      onClick={() => handleStepStatusChange(index, statusValue)}
                      className={`text-xs px-2 py-1 h-auto 
                        ${progress.status === statusValue 
                          ? (statusValue === 'pendiente' ? 'bg-yellow-500 hover:bg-yellow-600' 
                            : statusValue === 'en_progreso' ? 'bg-blue-500 hover:bg-blue-600' 
                            : 'bg-green-500 hover:bg-green-600')
                          : 'border-slate-500 text-slate-300 hover:bg-slate-600'}`}
                    >
                      {t(`psychopedagoguePlans.${statusValue}`)}
                    </Button>
                  ))}
                </div>

                <Textarea
                  value={progress.observacion}
                  onChange={(e) => handleObservationChange(index, e.target.value)}
                  placeholder={t('psychopedagoguePlans.addObservation')}
                  className="text-xs bg-slate-800 border-slate-600 focus:ring-purple-500 min-h-[40px]"
                  rows={1}
                />
                {progress.updated_at && (
                  <p className="text-xs text-slate-500 mt-1">
                    {t('psychopedagoguePlans.lastUpdate')}: {format(parseISO(progress.updated_at), 'PPpp', { locale: dateLocale })}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && isSaving) {
        toast({ title: t('psychopedagoguePlans.confirmCloseTitle'), description: t('psychopedagoguePlans.confirmCloseModal'), variant: 'default' });
        return; 
      }
      onOpenChange(open);
    }}>
      <DialogContent className="max-w-2xl md:max-w-3xl bg-slate-800/95 backdrop-blur-md border-slate-700 text-slate-100 shadow-2xl rounded-xl">
        <DialogHeader className="pb-4 border-b border-slate-700">
          <DialogTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            {t('psychopedagoguePlans.planDetailsTitle')}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {t('psychopedagoguePlans.student')}: {studentName} | {t('psychopedagoguePlans.planGeneratedOn')}: {plan?.created_at ? format(parseISO(plan.created_at), 'PP', { locale: dateLocale }) : t('common.unknownDate')}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] p-1 pr-3 custom-scrollbar">
          <div className="py-4 space-y-3">
            {isLoading && !planDetails && (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
              </div>
            )}
            {!planDetails && !isLoading && (
              <div className="text-center py-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-yellow-400 mb-3" />
                <p className="text-slate-300">{t('psychopedagoguePlans.errorLoadingPlanDetails')}</p>
              </div>
            )}
            {planDetails && (
              <>
                {renderPlanSection('psychopedagoguePlans.preview', planDetails.preview)}
                {renderPlanSection('psychopedagoguePlans.areas', planDetails.areas, true)}
                {renderStepsWithProgress(planDetails.steps)}
                {renderPlanSection('psychopedagoguePlans.recommendations', planDetails.recommendations, true)}
                {renderActions(planDetails.actions)}
              </>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 border-t border-slate-700">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-slate-600 hover:bg-slate-700">
            {t('common.cancelButton')}
          </Button>
          <Button onClick={handleSaveProgress} disabled={isSaving || isLoading} className="bg-green-600 hover:bg-green-700 text-white">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
            {t('psychopedagoguePlans.saveProgress')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDetailModal;