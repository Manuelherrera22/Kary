import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { supabase } from '@/lib/supabaseClient';
import edgeFunctionService from '@/services/edgeFunctionService';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Loader2, Sparkles, AlertTriangle, CheckCircle, Wand2, FileText, ChevronRight, ChevronLeft, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import PlanPreviewModal from '@/pages/Dashboard/PsychopedagogueSections/components/CreateSupportPlanCanvas/PlanPreviewModal';
import EditableBlock from '@/pages/Dashboard/PsychopedagogueSections/components/CreateSupportPlanCanvas/EditableBlock';

const SupportPlanAISection = ({ studentId, studentName }) => {
  const { t } = useLanguage();
  const { userProfile } = useAuth();
  const { toast } = useToast();

  const [step, setStep] = useState(1);
  const [planType, setPlanType] = useState('');
  const [context, setContext] = useState('');
  const [selectedAreas, setSelectedAreas] = useState([]);
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [availableAreas, setAvailableAreas] = useState([]);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const planTypes = [
    { value: 'emotional', labelKey: 'supportPlans.aiCanvas.planTypes.emotional' },
    { value: 'academic', labelKey: 'supportPlans.aiCanvas.planTypes.academic' },
    { value: 'behavioral', labelKey: 'supportPlans.aiCanvas.planTypes.behavioral' },
    { value: 'social', labelKey: 'supportPlans.aiCanvas.planTypes.social' },
  ];

  const fetchAvailableAreas = useCallback(async () => {
    try {
      const { data, error: fetchError } = await supabase.rpc('get_distinct_values_dynamic', {
        p_table_name: 'support_plans',
        p_column_name: 'type'
      });
      if (fetchError) throw fetchError;
      setAvailableAreas(data.map(item => ({ value: item.valor, label: item.valor })));
    } catch (err) {
      console.error('Error fetching available areas:', err);
      toast({
        title: t('toasts.errorTitle'),
        description: t('supportPlans.aiCanvas.errorFetchingAreas'),
        variant: 'destructive',
      });
    }
  }, [t, toast]);

  useEffect(() => {
    fetchAvailableAreas();
  }, [fetchAvailableAreas]);

  const handleGeneratePlan = async () => {
    if (!studentId || !planType || !context.trim()) {
      setError(t('supportPlans.aiCanvas.errorMissingFields'));
      toast({
        title: t('toasts.errorTitle'),
        description: t('supportPlans.aiCanvas.errorMissingFields'),
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedPlan(null);

    try {
      const payload = {
        student_id: studentId,
        plan_type: planType,
        contexto: context,
        areas: selectedAreas,
      };
      const { data, error: planError } = await edgeFunctionService.karyAISupportPlanGenerator(payload);

      if (planError) throw planError;

      if (data && data.parseError && data.rawResponse) {
        // Handle case where AI response is not valid JSON but we have the raw text
        console.warn("AI response was not valid JSON. Raw response:", data.rawResponse);
        setError(t('supportPlans.aiCanvas.errorInvalidAIFormat'));
        toast({
          title: t('toasts.errorTitle'),
          description: t('supportPlans.aiCanvas.errorInvalidAIFormatDetails', { details: data.rawResponse.substring(0, 100) + "..." }),
          variant: 'destructive',
        });
        setGeneratedPlan({ errorContent: data.rawResponse }); // Store raw error for potential display/debugging
      } else if (data && typeof data.plan_sugerido === 'string') {
        // Attempt to parse if plan_sugerido is a stringified JSON
        try {
          const parsedPlan = JSON.parse(data.plan_sugerido);
          setGeneratedPlan(parsedPlan);
          setStep(2);
        } catch (parseErr) {
          console.error("Error parsing plan_sugerido:", parseErr);
          setError(t('supportPlans.aiCanvas.errorParsingPlan'));
          toast({
            title: t('toasts.errorTitle'),
            description: t('supportPlans.aiCanvas.errorParsingPlanDetails'),
            variant: 'destructive',
          });
          setGeneratedPlan({ errorContent: data.plan_sugerido });
        }
      } else if (data && typeof data === 'object' && data.objetivo_general) {
        // If data is already a valid plan object
        setGeneratedPlan(data);
        setStep(2);
      } else {
        // Fallback for unexpected structure
        console.error("Unexpected AI response structure:", data);
        setError(t('supportPlans.aiCanvas.errorUnexpectedAIResponse'));
        toast({
          title: t('toasts.errorTitle'),
          description: t('supportPlans.aiCanvas.errorUnexpectedAIResponse'),
          variant: 'destructive',
        });
      }
    } catch (err) {
      console.error('Error generating support plan:', err);
      setError(err.message || t('supportPlans.aiCanvas.errorGeneratingPlan'));
      toast({
        title: t('toasts.errorTitle'),
        description: err.message || t('supportPlans.aiCanvas.errorGeneratingPlan'),
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSavePlan = async () => {
    if (!generatedPlan || !studentId || !userProfile) {
      toast({ title: t('toasts.errorTitle'), description: t('supportPlans.aiCanvas.errorSavingNoPlan'), variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    try {
      const planToSave = {
        student_id: studentId,
        creado_por: userProfile.id,
        plan_json: generatedPlan,
        type: planType, 
        status: 'propuesto', 
        support_goal: generatedPlan.objetivo_general,
        start_date: new Date().toISOString().split('T')[0], 
      };

      const { error: saveError } = await supabase.from('support_plans').insert(planToSave);
      if (saveError) throw saveError;

      toast({
        title: t('toasts.successTitle'),
        description: t('supportPlans.aiCanvas.successPlanSaved'),
        variant: 'success',
      });
      setGeneratedPlan(null);
      setStep(1);
      setContext('');
      setPlanType('');
      setSelectedAreas([]);
    } catch (err) {
      console.error('Error saving support plan:', err);
      toast({
        title: t('toasts.errorTitle'),
        description: err.message || t('supportPlans.aiCanvas.errorSavingPlan'),
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
      setIsPreviewModalOpen(false);
    }
  };

  const handleEditBlock = (path, newValue) => {
    setGeneratedPlan(currentPlan => {
      const newPlan = JSON.parse(JSON.stringify(currentPlan));
      let currentLevel = newPlan;
      for (let i = 0; i < path.length - 1; i++) {
        currentLevel = currentLevel[path[i]];
      }
      currentLevel[path[path.length - 1]] = newValue;
      return newPlan;
    });
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400">
              {t('supportPlans.aiCanvas.step1Title')}
            </CardTitle>
            <CardDescription>{t('supportPlans.aiCanvas.step1Description', { studentName: studentName || t('common.theStudent') })}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label htmlFor="studentName" className="block text-sm font-medium text-slate-300 mb-1">{t('supportPlans.aiCanvas.studentLabel')}</label>
              <Input id="studentName" type="text" value={studentName || ''} readOnly className="bg-slate-700 border-slate-600 text-slate-200 cursor-not-allowed" />
            </div>
            <div>
              <label htmlFor="planType" className="block text-sm font-medium text-slate-300 mb-1">{t('supportPlans.aiCanvas.planTypeLabel')}</label>
              <Select value={planType} onValueChange={setPlanType}>
                <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-slate-200">
                  <SelectValue placeholder={t('supportPlans.aiCanvas.planTypePlaceholder')} />
                </SelectTrigger>
                <SelectContent className="bg-slate-700 border-slate-600 text-slate-200">
                  {planTypes.map(pt => <SelectItem key={pt.value} value={pt.value}>{t(pt.labelKey)}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="context" className="block text-sm font-medium text-slate-300 mb-1">{t('supportPlans.aiCanvas.contextLabel')}</label>
              <Textarea
                id="context"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder={t('supportPlans.aiCanvas.contextPlaceholder')}
                className="min-h-[120px] bg-slate-700 border-slate-600 text-slate-200"
              />
            </div>
            {error && <p className="text-red-400 text-sm flex items-center"><AlertTriangle size={16} className="mr-1" />{error}</p>}
            <Button onClick={handleGeneratePlan} disabled={isLoading} className="w-full bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 text-white py-3">
              {isLoading ? <Loader2 className="animate-spin mr-2" /> : <Wand2 className="mr-2" />}
              {t('supportPlans.aiCanvas.generatePlanButton')}
            </Button>
          </CardContent>
        </motion.div>
      );
    }

    if (step === 2 && generatedPlan) {
      if (generatedPlan.errorContent) {
        return (
           <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-red-400 flex items-center">
                <AlertTriangle size={28} className="mr-2" />
                {t('supportPlans.aiCanvas.errorPlanTitle')}
              </CardTitle>
              <CardDescription>{t('supportPlans.aiCanvas.errorPlanDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300 mb-2">{t('supportPlans.aiCanvas.errorPlanDetails')}</p>
              <pre className="bg-slate-900 p-4 rounded-md text-slate-400 text-xs overflow-x-auto max-h-60">
                {generatedPlan.errorContent}
              </pre>
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={() => setStep(1)} className="text-sky-400 border-sky-500 hover:bg-sky-500/20">
                  <ChevronLeft className="mr-2" /> {t('common.backButton')}
                </Button>
              </div>
            </CardContent>
          </motion.div>
        );
      }
      return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 flex items-center">
              <CheckCircle size={28} className="mr-2" />
              {t('supportPlans.aiCanvas.step2Title')}
            </CardTitle>
            <CardDescription>{t('supportPlans.aiCanvas.step2Description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <EditableBlock label={t('supportPlans.aiCanvas.objectiveLabel')} value={generatedPlan.objetivo_general} path={['objetivo_general']} onEdit={handleEditBlock} />
            {generatedPlan.objetivos_especificos?.map((oe, index) => (
              <EditableBlock key={index} label={`${t('supportPlans.aiCanvas.specificObjectiveLabel')} ${index + 1}`} value={oe} path={['objetivos_especificos', index]} onEdit={handleEditBlock} />
            ))}
            <EditableBlock label={t('supportPlans.aiCanvas.activitiesLabel')} value={generatedPlan.actividades_propuestas?.join('\n')} path={['actividades_propuestas']} onEdit={(path, val) => handleEditBlock(path, val.split('\n'))} isTextarea />
            <EditableBlock label={t('supportPlans.aiCanvas.resourcesLabel')} value={generatedPlan.recursos_necesarios?.join('\n')} path={['recursos_necesarios']} onEdit={(path, val) => handleEditBlock(path, val.split('\n'))} isTextarea />
            <EditableBlock label={t('supportPlans.aiCanvas.evaluationLabel')} value={generatedPlan.indicadores_evaluacion} path={['indicadores_evaluacion']} onEdit={handleEditBlock} isTextarea />
            
            <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
              <Button variant="outline" onClick={() => setStep(1)} className="text-sky-400 border-sky-500 hover:bg-sky-500/20 w-full sm:w-auto">
                <ChevronLeft className="mr-2" /> {t('common.backButton')}
              </Button>
              <Button onClick={() => setIsPreviewModalOpen(true)} className="w-full sm:w-auto bg-gradient-to-r from-sky-500 to-purple-600 hover:from-sky-600 hover:to-purple-700 text-white">
                <FileText className="mr-2" /> {t('supportPlans.aiCanvas.previewAndSaveButton')}
              </Button>
            </div>
          </CardContent>
        </motion.div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-slate-800/70 backdrop-blur-md border-slate-700/50 shadow-2xl text-white">
      {renderStepContent()}
      {isPreviewModalOpen && generatedPlan && (
        <PlanPreviewModal
          isOpen={isPreviewModalOpen}
          onClose={() => setIsPreviewModalOpen(false)}
          planData={generatedPlan}
          studentName={studentName}
          onSave={handleSavePlan}
          isSaving={isSaving}
        />
      )}
    </Card>
  );
};

export default SupportPlanAISection;