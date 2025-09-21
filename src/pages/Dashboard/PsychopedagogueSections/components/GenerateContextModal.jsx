import React, { useState, useEffect, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import edgeFunctionService from '@/services/edgeFunctionService';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { Loader2, Lightbulb, ClipboardCopy, AlertTriangle, Brain, RefreshCw, Eye, ShieldAlert, ShieldCheck, ShieldQuestion, CheckCircle, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const GenerateContextModal = ({ isOpen, onOpenChange, studentId, studentName, onContextGenerated, isLoading: propIsLoading, setIsLoading: propSetIsLoading }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user: authUser } = useMockAuth();

  const [internalIsLoading, setInternalIsLoading] = useState(false);
  const setIsLoading = propSetIsLoading || setInternalIsLoading;
  const isLoading = propIsLoading !== undefined ? propIsLoading : internalIsLoading;

  const [generatedContext, setGeneratedContext] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [riskLevel, setRiskLevel] = useState(null);
  const [emotionalSummary, setEmotionalSummary] = useState([]);
  const [academicSummary, setAcademicSummary] = useState('');
  const [otherFactors, setOtherFactors] = useState('');
  const [error, setError] = useState('');
  const [isFetchingInitialData, setIsFetchingInitialData] = useState(false);
  const [hasPreExistingContext, setHasPreExistingContext] = useState(false);

  const fetchPreExistingContext = useCallback(async () => {
    if (!studentId) return;
    setIsLoading(true);
    setHasPreExistingContext(false);
    try {
      const { data: existingPlan, error: planError } = await supabase
        .from('support_plans')
        .select('plan_json, support_goal, created_at')
        .eq('student_id', studentId)
        .eq('plan_type', 'emocional') 
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (planError) throw planError;

      if (existingPlan && existingPlan.plan_json) {
        setGeneratedContext(existingPlan.plan_json.contexto || existingPlan.support_goal || t('aiContext.preExistingContextDefault'));
        setGeneratedPlan(existingPlan.plan_json);
        setRiskLevel(existingPlan.plan_json.nivel_riesgo || null);
        setHasPreExistingContext(true);
        toast({ title: t('aiContext.preExistingContextFoundTitle'), description: t('aiContext.preExistingContextFoundDesc') });
      } else {
        setGeneratedContext('');
        setGeneratedPlan(null);
        setRiskLevel(null);
      }
    } catch (err) {
      console.error('Error fetching pre-existing context:', err);
      setError(t('aiContext.fetchError', { details: err.message }));
    } finally {
      setIsLoading(false);
    }
  }, [studentId, t, toast]);
  
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
      fetchPreExistingContext();
    } else if (!isOpen) {
      setGeneratedContext('');
      setGeneratedPlan(null);
      setRiskLevel(null);
      setHasPreExistingContext(false);
      setEmotionalSummary([]);
      setAcademicSummary('');
    }
  }, [isOpen, studentId, fetchPreExistingContext, fetchSummaryData]);

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
    setHasPreExistingContext(false);

    try {
      const payload = {
        student_id: studentId,
        user_id: authUser.id,
        language: t.language,
      };
      
      const { data, error: edgeError } = await edgeFunctionService.generarContextoSugerido(payload);

      if (edgeError || data?.error || data?.status === 'error') {
        const errorMessage = edgeError?.message || data?.error?.message || data?.message || t('aiContext.error');
        throw new Error(errorMessage);
      }
      
      if (data.status === "contexto_generado" || data.status === "plan_existente_devuelto") {
        setGeneratedContext(data.contexto || '');
        setGeneratedPlan(data.plan || null);
        setRiskLevel(data.nivel_riesgo || null);
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
              plan_sugerido_json: data.plan 
            });
          if (dbError) console.error('Error saving generated context to DB:', dbError);
        }

      } else {
         toast({ title: t('toast.infoTitle'), description: data.message || t('aiContext.unknownResponse'), variant: 'default' });
      }

    } catch (err) {
      console.error('Error generating context with AI:', err);
      setError(err.message);
      toast({ title: t('toast.errorTitle'), description: err.message, variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseContext = () => {
    if (onContextGenerated && (generatedContext || generatedPlan?.contexto)) {
      onContextGenerated(generatedContext || generatedPlan?.contexto, generatedPlan?.tags || []);
    }
    onOpenChange(false);
  };

  const handleCopyToClipboard = () => {
    const textToCopy = generatedContext || JSON.stringify(generatedPlan, null, 2);
    navigator.clipboard.writeText(textToCopy)
      .then(() => toast({ title: t('common.copiedToClipboard') }))
      .catch(err => toast({ title: t('common.copyError'), description: err.message, variant: 'destructive' }));
  };

  const getRiskLevelBadge = (level) => {
    if (!level) return null;
    let IconComponent = ShieldQuestion;
    let colorClasses = "bg-slate-500 border-slate-700 text-white";

    switch (level.toLowerCase()) {
      case 'alto':
        IconComponent = ShieldAlert;
        colorClasses = "bg-red-500 border-red-700 text-white";
        break;
      case 'moderado':
      case 'medio':
        IconComponent = ShieldAlert;
        colorClasses = "bg-orange-500 border-orange-700 text-white";
        break;
      case 'bajo':
        IconComponent = ShieldCheck;
        colorClasses = "bg-green-500 border-green-700 text-white";
        break;
      default:
        IconComponent = Info;
        colorClasses = "bg-sky-500 border-sky-700 text-white";
    }
    return (
      <Badge className={`mt-1 text-sm px-3 py-1.5 flex items-center w-fit ${colorClasses}`}>
        <IconComponent size={16} className="mr-1.5" />
        {t(`aiContext.riskLevels.${level.toLowerCase()}`, level)}
      </Badge>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-lg md:max-w-3xl border-slate-700 text-slate-100 shadow-2xl rounded-xl"
        forceSolidBackground={true}
      >
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
          <div className="py-6 px-1 space-y-4">
            {isFetchingInitialData && !hasPreExistingContext && (
              <div className="flex items-center justify-center p-4 text-slate-400">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                {t('supportPlans.generateContextModal.loadingInitialData')}
              </div>
            )}

            {!isFetchingInitialData && !hasPreExistingContext && (
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

                <div className="space-y-1">
                  <Label htmlFor="otherFactors" className="text-slate-300">{t('supportPlans.generateContextModal.otherFactorsLabel')}</Label>
                  <Textarea
                    id="otherFactors"
                    value={otherFactors}
                    onChange={(e) => setOtherFactors(e.target.value)}
                    placeholder={t('supportPlans.generateContextModal.otherFactorsPlaceholder')}
                    className="bg-slate-800 border-slate-700 min-h-[100px] focus:ring-cyan-500"
                  />
                </div>
              </>
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

            {(generatedContext || generatedPlan) && !isLoading && (
              <div className="mt-6 p-4 bg-slate-800/70 border border-slate-700 rounded-lg space-y-3 animate-fadeIn">
                <div className="flex justify-between items-center">
                  <h4 className="text-lg font-semibold text-cyan-400">{hasPreExistingContext ? t('aiContext.preExistingContextTitle') : t('supportPlans.generateContextModal.generatedContextTitle')}</h4>
                  <Button variant="ghost" size="sm" onClick={handleCopyToClipboard} className="text-slate-400 hover:text-cyan-400">
                    <ClipboardCopy size={16} className="mr-1.5" /> {t('common.copyButton')}
                  </Button>
                </div>
                {riskLevel && (
                  <div>
                    <Label className="text-slate-300 text-sm mb-1 block">{t('aiContext.riskLevelLabel')}</Label>
                    {getRiskLevelBadge(riskLevel)}
                  </div>
                )}
                <Textarea
                  value={generatedContext || generatedPlan?.contexto || ''}
                  readOnly={hasPreExistingContext}
                  onChange={(e) => !hasPreExistingContext && setGeneratedContext(e.target.value)}
                  className="min-h-[120px] bg-slate-900 border-slate-600 focus:ring-cyan-500 text-slate-200"
                  placeholder={t('supportPlans.generateContextModal.editContextPlaceholder')}
                />
                {generatedPlan?.emociones && generatedPlan.emociones.length > 0 && (
                  <div className="pt-2">
                    <Label className="text-slate-300 text-sm mb-1 block">{t('aiContext.detectedEmotionsLabel')}</Label>
                    <div className="flex flex-wrap gap-2">
                      {generatedPlan.emociones.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="bg-slate-700 text-slate-300">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {generatedPlan?.steps && generatedPlan.steps.length > 0 && (
                  <div className="pt-2">
                    <Label className="text-slate-300 text-sm mb-1 block">{t('aiContext.suggestedPlanStepsLabel')}</Label>
                    <ul className="list-disc list-inside space-y-1 text-sm text-slate-300 bg-slate-900 p-3 rounded-md">
                      {generatedPlan.steps.map((step, index) => (
                        <li key={index}>{step.title || step.description}</li>
                      ))}
                    </ul>
                  </div>
                )}
                 {generatedPlan?.actions && generatedPlan.actions.length > 0 && (
                  <div className="pt-2">
                    <Label className="text-slate-300 text-sm mb-1 block">{t('aiContext.suggestedActionsLabel')}</Label>
                    <ul className="space-y-2 text-sm text-slate-300">
                      {generatedPlan.actions.map((action, index) => (
                        <li key={index} className="p-2 bg-slate-900 rounded-md border border-slate-700">
                          <p><strong className="text-slate-200">{t('psychopedagoguePlans.actor')}:</strong> {action.actor}</p>
                          <p><strong className="text-slate-200">{t('psychopedagoguePlans.description')}:</strong> {action.description}</p>
                          {action.timeline && <p><strong className="text-slate-200">{t('psychopedagoguePlans.timeline')}:</strong> {action.timeline}</p>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
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
            {(generatedContext || generatedPlan) && !isLoading && !hasPreExistingContext && (
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