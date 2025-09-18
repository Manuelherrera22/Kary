import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import edgeFunctionService from '@/services/edgeFunctionService';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { Loader2, Brain, RefreshCw, Eye, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import InitialDataDisplay from './InitialDataDisplay';
import GeneratedContextDisplay from './GeneratedContextDisplay';
import OtherFactorsInput from './OtherFactorsInput';

const GenerateContextModal = ({ 
  isOpen, 
  onOpenChange, 
  studentId, 
  studentName, 
  onContextGenerated, 
  isLoading: propIsLoading, 
  setIsLoading: propSetIsLoading 
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user: authUser } = useAuth();

  const [internalIsLoading, setInternalIsLoading] = useState(false);
  const setIsLoading = propSetIsLoading || setInternalIsLoading;
  const isLoading = propIsLoading !== undefined ? propIsLoading : internalIsLoading;

  const [generatedContext, setGeneratedContext] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [detectedEmotions, setDetectedEmotions] = useState([]);
  const [criticalEmotions, setCriticalEmotions] = useState([]);
  
  const [emotionalSummary, setEmotionalSummary] = useState([]);
  const [academicSummary, setAcademicSummary] = useState('');
  const [otherFactors, setOtherFactors] = useState('');
  const [error, setError] = useState('');
  const [isFetchingInitialData, setIsFetchingInitialData] = useState(false);
  const [hasPreExistingContext, setHasPreExistingContext] = useState(false);
  const [preExistingContextData, setPreExistingContextData] = useState(null);


  const fetchPreExistingContextFromGenerated = useCallback(async () => {
    if (!studentId) return;
    setIsLoading(true);
    setHasPreExistingContext(false);
    setPreExistingContextData(null);
    try {
      const { data: existingContext, error: contextError } = await supabase
        .from('generated_contexts')
        .select('contexto_generado, nivel_riesgo, plan_sugerido_json, emociones, criticas, created_at')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (contextError) throw contextError;

      if (existingContext) {
        setGeneratedContext(existingContext.contexto_generado || '');
        setGeneratedPlan(existingContext.plan_sugerido_json || null);
        setRiskLevel(existingContext.nivel_riesgo || null);
        setDetectedEmotions(existingContext.emociones || []);
        setCriticalEmotions(existingContext.criticas || []);
        setHasPreExistingContext(true);
        setPreExistingContextData(existingContext);
        toast({ title: t('aiContext.preExistingContextFoundTitle'), description: t('aiContext.preExistingContextFoundDesc') });
      } else {
        setGeneratedContext('');
        setGeneratedPlan(null);
        setRiskLevel(null);
        setDetectedEmotions([]);
        setCriticalEmotions([]);
      }
    } catch (err) {
      console.error('Error fetching pre-existing context from generated_contexts:', err);
      setError(t('aiContext.fetchError', { details: err.message }));
    } finally {
      setIsLoading(false);
    }
  }, [studentId, t, toast, setIsLoading]);
  
  const fetchSummaryData = useCallback(async () => {
    if (!studentId) return;
    setIsFetchingInitialData(true);
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data: logs, error: logsError } = await supabase
        .from('emotional_logs')
        .select('emotion, created_at, source, text')
        .eq('student_id', studentId)
        .gte('created_at', thirtyDaysAgo.toISOString())
        .order('created_at', { ascending: false });
        
      if (logsError) throw logsError;

      const emotionCounts = logs.reduce((acc, log) => {
        const emotionKey = log.emotion || t('common.notSpecified');
        acc[emotionKey] = (acc[emotionKey] || 0) + 1;
        return acc;
      }, {});
      const summary = Object.entries(emotionCounts).map(([emotion, frecuencia]) => ({ emotion, frecuencia }));
      setEmotionalSummary(summary.length > 0 ? summary : [{ emotion: t('aiContext.noEmotionalData'), frecuencia: 0 }]);

      const { data: academic, error: academicError } = await supabase
        .from('academic_performance')
        .select('subject, score, comments')
        .eq('student_id', studentId)
        .order('recorded_at', { ascending: false })
        .limit(5);

      if (academicError) throw academicError;
      const academicText = academic.map(a => `${a.subject}: ${a.score} (${a.comments || t('common.noComments')})`).join('\n');
      setAcademicSummary(academicText || t('aiContext.noAcademicData'));

    } catch (err) {
      console.error('Error fetching summary data for context generation:', err);
      setError(t('aiContext.fetchError', { details: err.message }));
    } finally {
      setIsFetchingInitialData(false);
    }
  }, [studentId, t]);


  useEffect(() => {
    if (isOpen && studentId) {
      setError('');
      setOtherFactors('');
      fetchSummaryData();
      fetchPreExistingContextFromGenerated();
    } else if (!isOpen) {
      setGeneratedContext('');
      setGeneratedPlan(null);
      setRiskLevel(null);
      setDetectedEmotions([]);
      setCriticalEmotions([]);
      setHasPreExistingContext(false);
      setPreExistingContextData(null);
      setEmotionalSummary([]);
      setAcademicSummary('');
    }
  }, [isOpen, studentId, fetchPreExistingContextFromGenerated, fetchSummaryData]);

  const handleForceGenerateContext = async () => {
    if (!studentId || !authUser?.id) {
      toast({ title: t('toast.errorTitle'), description: t('supportPlans.generateContextModal.noStudentOrUser'), variant: 'destructive' });
      return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedContext('');
    setGeneratedPlan(null);
    setRiskLevel(null);
    setDetectedEmotions([]);
    setCriticalEmotions([]);
    setHasPreExistingContext(false);
    setPreExistingContextData(null);

    try {
      const payload = {
        student_id: studentId,
        user_id: authUser.id,
        language: t.language,
        additional_factors: otherFactors,
      };
      
      const { data, error: edgeError } = await edgeFunctionService.generarContextoSugerido(payload);

      if (edgeError || data?.error || data?.status === 'error' || !data?.status) {
        const errorMessage = edgeError?.message || data?.error?.message || data?.message || t('aiContext.error');
        throw new Error(errorMessage);
      }
      
      if (data.status === "contexto_generado" || data.status === "plan_existente_devuelto") {
        setGeneratedContext(data.contexto || '');
        setGeneratedPlan(data.plan || null);
        setRiskLevel(data.nivel_riesgo || null);
        setDetectedEmotions(data.emociones || []);
        setCriticalEmotions(data.criticas || []);
        setHasPreExistingContext(data.status === "plan_existente_devuelto");
        toast({ title: t('toast.successTitle'), description: data.message || t('aiContext.success')});

        if (data.status === "contexto_generado" && data.contexto) {
           const { error: dbError } = await supabase
            .from('generated_contexts')
            .insert({
              student_id: studentId,
              contexto_generado: data.contexto,
              tags_generados: data.emociones || [],
              generado_por_ia: true,
              creado_por_usuario_id: authUser?.id,
              nivel_riesgo: data.nivel_riesgo,
              plan_sugerido_json: data.plan,
              emociones: data.emociones,
              criticas: data.criticas,
              contexto: data.contexto 
            });
          if (dbError) console.error('Error saving generated context to DB:', dbError);
        }

      } else {
         toast({ title: t('toast.infoTitle'), description: data.message || t('aiContext.unknownResponse'), variant: 'default' });
      }

    } catch (err) {
      setError(err.message);
      toast({ title: t('toast.errorTitle'), description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseContext = () => {
    if (onContextGenerated && (generatedContext || preExistingContextData?.contexto_generado)) {
      onContextGenerated(generatedContext || preExistingContextData?.contexto_generado, detectedEmotions || preExistingContextData?.emociones || []);
    }
    onOpenChange(false);
  };
  
  const currentContextToDisplay = hasPreExistingContext ? (preExistingContextData?.contexto_generado || '') : generatedContext;
  const currentPlanToDisplay = hasPreExistingContext ? (preExistingContextData?.plan_sugerido_json || null) : generatedPlan;
  const currentRiskLevelToDisplay = hasPreExistingContext ? (preExistingContextData?.nivel_riesgo || null) : riskLevel;
  const currentDetectedEmotions = hasPreExistingContext ? (preExistingContextData?.emociones || []) : detectedEmotions;
  const currentCriticalEmotions = hasPreExistingContext ? (preExistingContextData?.criticas || []) : criticalEmotions;


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg md:max-w-3xl bg-slate-900/95 backdrop-blur-md border-slate-700 text-slate-100 shadow-2xl rounded-xl">
        <DialogHeader className="pb-4 border-b border-slate-700">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-500">
            <Brain size={26} />
            {t('aiContext.title')}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {t('supportPlans.generateContextModal.description', { studentName: studentName || t('common.theStudent') })}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] custom-scrollbar pr-2">
          <div className="py-6 px-1 space-y-6">
            {isFetchingInitialData && !hasPreExistingContext && (
              <div className="flex items-center justify-center p-4 text-slate-400">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t('supportPlans.generateContextModal.loadingInitialData')}
              </div>
            )}

            {!isFetchingInitialData && !hasPreExistingContext && (
              <div className="space-y-4 p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                <h3 className="text-lg font-semibold text-sky-300">{t('aiContext.baseContextSectionTitle')}</h3>
                <p className="text-sm text-slate-400 mb-3">{t('aiContext.baseContextDescription')}</p>
                <InitialDataDisplay
                  emotionalSummary={emotionalSummary}
                  academicSummary={academicSummary}
                  t={t}
                />
                <div className="mt-4">
                  <h4 className="text-md font-semibold text-sky-300 mb-2">{t('aiContext.professionalObservationsSectionTitle')}</h4>
                  <p className="text-xs text-slate-400 mb-2">{t('aiContext.professionalObservationsDescription')}</p>
                  <OtherFactorsInput
                    otherFactors={otherFactors}
                    setOtherFactors={setOtherFactors}
                    t={t}
                  />
                </div>
              </div>
            )}
            
            {isLoading && (
              <div className="flex items-center justify-center p-8 text-slate-300">
                <Loader2 className="mr-3 h-8 w-8 animate-spin text-cyan-500" />
                <span className="text-lg">{t('supportPlans.generateContextModal.generatingInProgress')}</span>
              </div>
            )}

            {error && !isLoading && (
              <div className="p-3 my-4 bg-red-900/30 border border-red-700 rounded-md text-red-300 text-sm flex items-start">
                <AlertTriangle size={20} className="mr-2 mt-0.5 shrink-0"/>
                <div>
                  <p className="font-semibold">{t('toast.errorTitle')}</p>
                  <p>{error}</p>
                </div>
              </div>
            )}

            {(currentContextToDisplay || currentPlanToDisplay) && !isLoading && (
              <GeneratedContextDisplay
                context={currentContextToDisplay}
                plan={currentPlanToDisplay}
                riskLevel={currentRiskLevelToDisplay}
                detectedEmotions={currentDetectedEmotions}
                criticalEmotions={currentCriticalEmotions}
                isPreExisting={hasPreExistingContext}
                setGeneratedContext={setGeneratedContext} 
                t={t}
              />
            )}
             {!isLoading && !currentContextToDisplay && !currentPlanToDisplay && !isFetchingInitialData && (
              <div className="p-4 my-4 bg-slate-800/50 border border-dashed border-slate-600 rounded-lg text-center">
                <Info size={28} className="mx-auto text-slate-500 mb-2" />
                <p className="text-slate-400 text-sm">
                  {hasPreExistingContext ? t('aiContext.preExistingContextFoundDesc') : t('supportPlans.generateContextModal.noContextYet')}
                </p>
              </div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 border-t border-slate-700 flex flex-col sm:flex-row sm:justify-between items-center gap-3">
          <div className="flex gap-2">
            <Button 
              onClick={handleForceGenerateContext} 
              disabled={isLoading || isFetchingInitialData} 
              variant="outline"
              className="border-purple-500 text-purple-400 hover:bg-purple-500/10 hover:text-purple-300"
            >
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
              {t('aiContext.forceGenerateButton')}
            </Button>
            {hasPreExistingContext && (
              <Button 
                onClick={handleUseContext} 
                className="bg-sky-600 hover:bg-sky-700 text-white"
              >
                <Eye className="mr-2 h-4 w-4" />
                {t('aiContext.viewPreExistingButton')}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={() => onOpenChange(false)} className="text-slate-400 hover:bg-slate-700 hover:text-white">
              {t('common.cancelButton')}
            </Button>
            {(currentContextToDisplay || currentPlanToDisplay) && !isLoading && !hasPreExistingContext && (
              <Button onClick={handleUseContext} className="bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle className="mr-2 h-4 w-4" />
                {t('supportPlans.generateContextModal.useThisContextButton')}
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GenerateContextModal;