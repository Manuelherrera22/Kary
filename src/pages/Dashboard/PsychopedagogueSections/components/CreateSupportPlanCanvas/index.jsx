import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2, Brain, Save, AlertTriangle, Send, Edit, ChevronLeft, ChevronRight, PlusCircle, Info } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useMockAuth } from '@/contexts/MockAuthContext';
import PlanGeneratorForm from './PlanGeneratorForm';
import PlanEditor from './PlanEditor';
import edgeFunctionService from '@/services/edgeFunctionService';
import { jsPDF } from 'jspdf';
import { useSupportPlans } from '@/pages/Dashboard/PsychopedagogueSections/hooks/useSupportPlans';

const CreateSupportPlanCanvas = ({ isOpen, onOpenChange, preselectedStudentId, initialObservations, onPlanCreated }) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user: authUser } = useMockAuth();
  const { addSupportPlan, updateSupportPlan } = useSupportPlans();

  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedPlanData, setGeneratedPlanData] = useState(null);
  const [studentId, setStudentId] = useState(preselectedStudentId || '');
  const [studentName, setStudentName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlanId, setCurrentPlanId] = useState(null);
  const [formPayloadCache, setFormPayloadCache] = useState(null);
  const [localInitialContext, setLocalInitialContext] = useState(initialObservations || '');


  useEffect(() => {
    if (preselectedStudentId) {
      setStudentId(preselectedStudentId);
      const fetchStudentName = async () => {
        try {
          const { data, error } = await supabase
            .from('user_profiles')
            .select('full_name')
            .eq('id', preselectedStudentId)
            .single();
          if (error) throw error;
          if (data) setStudentName(data.full_name);
        } catch (error) {
          console.error("Error fetching student name:", error);
        }
      };
      fetchStudentName();
    } else {
      setStudentName('');
    }
  }, [preselectedStudentId]);

  useEffect(() => {
    if (isOpen) {
      setLocalInitialContext(initialObservations || '');
      setCurrentStep(1);
      setGeneratedPlanData(null);
      setIsEditing(false);
      setCurrentPlanId(null);
      setFormPayloadCache(null);
    }
  }, [isOpen, initialObservations]);


  const handleStudentSelected = (selectedStudent) => {
    setStudentId(selectedStudent.id);
    setStudentName(selectedStudent.full_name);
  };

  const handleGeneratePlan = async (formData) => {
    console.log("[CreateSupportPlanCanvas] Attempting to generate plan. FormData received:", formData);
    console.log("[CreateSupportPlanCanvas] Current studentId:", studentId);
    console.log("[CreateSupportPlanCanvas] Current studentName:", studentName);
    console.log("[CreateSupportPlanCanvas] Current localInitialContext:", localInitialContext);

    if (!studentId) {
      toast({ title: t('supportPlans.aiCanvas.selectStudentFirst'), variant: 'destructive' });
      return;
    }
    if (!formData.contextForAI?.trim()) {
       toast({ title: t('supportPlans.aiCanvas.errorMissingContext'), description: t('supportPlans.aiCanvas.errorMissingContextDetails'), variant: 'destructive' });
       return;
    }
    if (!formData.keyObservations?.trim()) {
       toast({ title: t('supportPlans.aiCanvas.errorMissingObservations'), description: t('supportPlans.aiCanvas.errorMissingObservationsDetails'), variant: 'destructive' });
       return;
    }

    setIsLoading(true);
    setGeneratedPlanData(null);
    setCurrentStep(2);
    setFormPayloadCache(formData);

    const contextToUse = localInitialContext || formData.contextForAI?.trim();
    console.log("[CreateSupportPlanCanvas] Context to use for AI (contexto):", contextToUse);
    console.log("[CreateSupportPlanCanvas] Manual observations (observacion_manual):", formData.keyObservations?.trim());


    try {
      const payload = {
        student_id: studentId,
        student_name: studentName,
        plan_type: formData.planType,
        focus_area: formData.focusArea?.trim(),
        specific_needs: formData.specificNeeds?.trim(),
        observacion_manual: formData.keyObservations?.trim(), 
        contexto: contextToUse, 
        language: t.language,
        user_id: authUser?.id,
      };
      
      console.log("[CreateSupportPlanCanvas] Payload to be sent to Edge Function:", payload);
      const { data, error } = await edgeFunctionService.karyAISupportPlanGenerator(payload);

      if (error || data?.error || data?.status === 'error' || !data?.plan_json) {
        console.error('Error generating plan with AI:', error, data);
        const errorMessage = data?.error?.message || data?.message || error?.message || t('supportPlans.aiCanvas.errorGeneratingPlan');
        
        let displayableError = errorMessage;
        if (typeof errorMessage === 'object') {
          displayableError = JSON.stringify(errorMessage);
        }

        toast({ title: t('supportPlans.aiCanvas.errorGeneratingPlan'), description: displayableError, variant: 'destructive' });
        
        let errorResponseData = data || {};
        if (error && typeof error === 'object') errorResponseData = {...errorResponseData, ...error};
        if (error && typeof error === 'string') errorResponseData = {...errorResponseData, message: error};


        setGeneratedPlanData({ raw_response: errorResponseData, error_message: displayableError, is_error_format: true });
        setCurrentStep(3); 
        setIsLoading(false);
        return;
      }
      
      let planJsonParsed = data.plan_json;
      if (typeof data.plan_json === 'string') {
        try {
          planJsonParsed = JSON.parse(data.plan_json);
        } catch (parseError) {
          console.error('Error parsing plan_json:', parseError);
          toast({ title: t('supportPlans.aiCanvas.invalidPlanFormat'), description: parseError.message, variant: 'destructive' });
          setGeneratedPlanData({ raw_response: data.plan_json, error_message: t('supportPlans.aiCanvas.invalidPlanFormat'), is_error_format: true });
          setCurrentStep(3);
          setIsLoading(false);
          return;
        }
      }
      
      const planToEdit = {
        student_id: studentId,
        support_goal: planJsonParsed.support_goal || data.support_goal || t('supportPlans.aiCanvas.goalLabel'),
        support_strategy: planJsonParsed.support_strategy || data.support_strategy || t('supportPlans.aiCanvas.strategyDefault'),
        plan_json: planJsonParsed, 
        status: 'draft',
        type: formData.planType || 'aiGenerated',
      };

      setGeneratedPlanData(planToEdit);
      setIsEditing(true);
      setCurrentStep(3);
      toast({ title: t('supportPlans.aiCanvas.planGeneratedSuccess') });
    } catch (e) {
      console.error('Catch error generating plan:', e);
      toast({ title: t('supportPlans.aiCanvas.generationError'), description: e.message, variant: 'destructive' });
      setGeneratedPlanData({ raw_response: e.message, error_message: t('supportPlans.aiCanvas.generationError'), is_error_format: true });
      setCurrentStep(3);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavePlan = async (editedPlanBlocks, assign = false) => {
    setIsLoading(true);
    
    const planDetailsToSave = {
        student_id: studentId,
        support_goal: generatedPlanData?.support_goal || formPayloadCache?.planType || t('supportPlans.aiCanvas.goalLabel'),
        support_strategy: generatedPlanData?.support_strategy || formPayloadCache?.planType || t('supportPlans.aiCanvas.strategyDefault'),
        plan_json: editedPlanBlocks, 
        status: assign ? 'active' : 'draft',
        type: formPayloadCache?.planType || generatedPlanData?.type || 'aiGenerated',
        responsible_person: authUser.id,
        creado_por: authUser.id,
        assigned: assign,
        assigned_at: assign ? new Date().toISOString() : null,
    };

    try {
      let savedPlan;
      if (currentPlanId) {
        savedPlan = await updateSupportPlan(currentPlanId, planDetailsToSave);
      } else {
        savedPlan = await addSupportPlan(planDetailsToSave);
      }

      if (savedPlan && savedPlan.id) {
        setCurrentPlanId(savedPlan.id);
        setGeneratedPlanData(savedPlan); 
        toast({ title: assign ? t('supportPlans.aiCanvas.assignSuccess') : t('supportPlans.aiCanvas.saveSuccess') });
        if (onPlanCreated) onPlanCreated(savedPlan);
        if (assign) onOpenChange(false); 
        return savedPlan; 
      } else {
        toast({ title: assign ? t('supportPlans.aiCanvas.assignError') : t('supportPlans.aiCanvas.saveError'), variant: 'destructive' });
        return null;
      }
    } catch (error) {
      console.error("Error saving/assigning plan:", error);
      toast({ title: assign ? t('supportPlans.aiCanvas.assignError') : t('supportPlans.aiCanvas.saveError'), description: error.message, variant: 'destructive' });
      return null;
    } finally {
      setIsLoading(false);
    }
  };


  const downloadErrorPlanAsPdf = () => {
    if (!generatedPlanData || !generatedPlanData.is_error_format) return;
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.text(t('supportPlans.aiCanvas.fallbackPlanTitle'), 10, 10);
    pdf.setFontSize(12);
    pdf.text(t('supportPlans.aiCanvas.fallbackPlanDescription'), 10, 20);
    pdf.setFontSize(10);
    
    const rawResponseText = typeof generatedPlanData.raw_response === 'object' 
      ? JSON.stringify(generatedPlanData.raw_response, null, 2) 
      : String(generatedPlanData.raw_response);

    const splitText = pdf.splitTextToSize(rawResponseText, 180);
    pdf.text(splitText, 10, 30);
    pdf.save(`error_plan_apoyo_${studentName || 'estudiante'}_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="mb-6 p-4 bg-sky-900/30 border border-sky-700 rounded-lg text-sky-200">
              <div className="flex items-start">
                <Info size={20} className="mr-3 mt-1 flex-shrink-0 text-sky-400" />
                <div>
                  <h4 className="font-semibold text-sky-300">{t('supportPlans.aiCanvas.formInfoTitle')}</h4>
                  <p className="text-sm">{t('supportPlans.aiCanvas.formInfoDescription')}</p>
                   <p className="text-sm mt-2">{t('supportPlans.aiCanvas.formInfoMandatoryFields')}</p>
                </div>
              </div>
            </div>
            <PlanGeneratorForm 
              onSubmit={handleGeneratePlan} 
              isLoading={isLoading} 
              preselectedStudentId={studentId}
              initialObservations={localInitialContext}
              localInitialContext={localInitialContext}
              onStudentSelected={handleStudentSelected}
            />
          </>
        );
      case 2:
        return (
          <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center p-8">
            <Loader2 className="h-16 w-16 text-purple-400 animate-spin mb-6" />
            <h3 className="text-2xl font-semibold text-slate-100 mb-2">{t('supportPlans.aiCanvas.generatingPlan')}</h3>
            <p className="text-slate-400 max-w-sm">{t('supportPlans.aiCanvas.generatingPlanSubtitle', { studentName: studentName || t('common.theStudent') })}</p>
          </div>
        );
      case 3:
        if (generatedPlanData?.is_error_format) {
          return (
            <div className="p-6 text-center">
              <AlertTriangle size={48} className="mx-auto text-red-400 mb-4" />
              <h3 className="text-xl font-semibold text-red-300 mb-2">{t('supportPlans.aiCanvas.fallbackErrorTitle')}</h3>
              <p className="text-slate-400 mb-4">{generatedPlanData.error_message || t('supportPlans.aiCanvas.fallbackErrorMessage')}</p>
              <Button onClick={downloadErrorPlanAsPdf} variant="outline" className="border-red-500 text-red-400 hover:bg-red-500/10">
                {t('supportPlans.aiCanvas.downloadPdfButton')}
              </Button>
              <Button onClick={() => setCurrentStep(1)} className="ml-2">
                <ChevronLeft size={18} className="mr-1" /> {t('common.backButton')}
              </Button>
            </div>
          );
        }
        return (
          <PlanEditor
            initialPlanBlocks={generatedPlanData?.plan_json || []} 
            onSave={handleSavePlan}
            isLoading={isLoading}
            studentName={studentName}
          />
        );
      default:
        return null;
    }
  };
  
  const getDialogTitle = () => {
    if (currentStep === 1) return t('supportPlans.aiCanvas.step1Title');
    if (currentStep === 2) return t('supportPlans.aiCanvas.step2Title');
    if (currentStep === 3) {
      return generatedPlanData?.is_error_format ? t('supportPlans.aiCanvas.fallbackErrorTitle') : t('supportPlans.aiCanvas.step3Title');
    }
    return t('supportPlans.aiCanvas.title');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl md:max-w-3xl lg:max-w-4xl xl:max-w-5xl bg-slate-900/90 backdrop-blur-lg border-slate-700/80 text-white p-0 shadow-2xl rounded-2xl">
        <DialogHeader className="p-6 border-b border-slate-700/60">
          <DialogTitle className="text-3xl font-bold flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            <Brain size={28} /> {getDialogTitle()}
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {currentStep === 1 && t('supportPlans.aiCanvas.description')}
            {currentStep === 3 && !generatedPlanData?.is_error_format && t('supportPlans.aiCanvas.editInstruction')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: currentStep === 1 ? 0 : (currentStep > (currentStep -1) ? 50 : -50) }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: currentStep < (currentStep + 1) ? -50 : 50 }}
              transition={{ duration: 0.3 }}
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {(currentStep === 1 && !isLoading) && (
          <DialogFooter className="p-6 border-t border-slate-700/60">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="border-slate-600 hover:bg-slate-700 transition-colors">
              {t('common.cancelButton')}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateSupportPlanCanvas;