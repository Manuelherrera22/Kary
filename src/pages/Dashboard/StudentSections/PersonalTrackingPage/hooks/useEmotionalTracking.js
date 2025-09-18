import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import edgeFunctionService from "@/services/edgeFunctionService.js";

export const useEmotionalTracking = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();

  const [tags, setTags] = useState([]);
  const [classifications, setClassifications] = useState([]);
  const [trackingText, setTrackingText] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedTagObjects, setSelectedTagObjects] = useState([]);
  
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [isLoadingClassifications, setIsLoadingClassifications] = useState(true);
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadClassifications = useCallback(async () => {
    setIsLoadingClassifications(true);
    try {
      const { data, error } = await supabase.from('emotional_classifications').select('*').order('name', { ascending: true });
      if (error) throw error;
      setClassifications(data || []);
    } catch (error) {
      console.error('Error loading classifications:', error);
      toast({
        title: t('toast.errorTitle'),
        description: t('studentDashboard.personalTrackingPage.errorLoadingClassifications'),
        variant: 'destructive',
      });
      setClassifications([]);
    } finally {
      setIsLoadingClassifications(false);
    }
  }, [t, toast]);

  const loadTags = useCallback(async () => {
    setIsLoadingTags(true);
    try {
      const { data, error } = await supabase.from('emotional_tags').select('id, label, classification_id').order('label', { ascending: true });
      if (error) throw error;
      setTags(data || []);
    } catch (error) {
      console.error('Error loading tags:', error);
      toast({
        title: t('toast.errorTitle'),
        description: t('studentDashboard.personalTrackingPage.errorLoadingTags'),
        variant: 'destructive',
      });
      setTags([]);
    } finally {
      setIsLoadingTags(false);
    }
  }, [t, toast]);

  useEffect(() => {
    loadClassifications();
    loadTags();
  }, [loadClassifications, loadTags]);

  const toggleTag = (tagObject) => {
    setSelectedTagObjects(prev => {
      const isSelected = prev.find(t => t.id === tagObject.id);
      if (isSelected) {
        return prev.filter(t => t.id !== tagObject.id);
      } else {
        return [...prev, tagObject];
      }
    });
    setSelectedTags(prev => {
        const isSelected = prev.includes(tagObject.id);
        if (isSelected) {
            return prev.filter(id => id !== tagObject.id);
        } else {
            return [...prev, tagObject.id];
        }
    });
  };

  const createPredictiveAlert = async (studentId, analysisData, trackingDetails) => {
    const riskLevel = analysisData.nivel_riesgo?.toLowerCase();
    if (riskLevel !== 'moderado' && riskLevel !== 'alto') {
      return;
    }

    const alertPayload = {
      student_id: studentId,
      categoria: t('karyCore.alerts.categoryEmotionalTracking', 'Seguimiento Emocional'),
      nivel: analysisData.nivel_riesgo,
      estado: 'pendiente',
      origen: 'motional-alert-analyzer-intel',
      descripcion: analysisData.sugerencia || t('karyCore.alerts.defaultAlertDescription', 'Alerta generada por análisis de seguimiento emocional.'),
      detalle_adicional: {
        tracking_text: trackingDetails.text,
        selected_tags: trackingDetails.tags,
        primary_emotion: trackingDetails.primaryEmotion,
        raw_analysis_result: analysisData
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    try {
      const { error } = await supabase.from('alerts_predictive').insert(alertPayload);
      if (error) {
        throw error;
      }
      toast({
        title: t('karyCore.alerts.predictiveAlertCreatedTitle', 'Alerta Predictiva Creada'),
        description: t('karyCore.alerts.predictiveAlertCreatedDesc', 'La alerta ha sido registrada en KARY CORE.'),
        className: "bg-sky-500 text-white dark:bg-sky-600",
      });
    } catch (error) {
      console.error("Error creating predictive alert:", error);
      toast({
        title: t('toast.errorTitle'),
        description: t('karyCore.alerts.errorCreatingPredictiveAlert', 'No se pudo crear la alerta predictiva: {details}', { details: error.message }),
        variant: 'destructive',
      });
    }
  };


  const onGuardarSeguimiento = async () => {
    setAnalysisResult(null);
    if (authLoading) {
      toast({ title: t('toast.warningTitle'), description: t('studentDashboard.personalTrackingPage.errorAuthLoading'), variant: 'default' });
      return;
    }

    const studentIdToUse = user?.id;

    if (!studentIdToUse) {
      toast({ title: t('toast.errorTitle'), description: t('studentDashboard.personalTrackingPage.errorUserNotLoaded'), variant: 'destructive' });
      return;
    }
    
    const textoIngresado = trackingText.trim();
    const primaryEmotion = selectedTagObjects.length > 0 ? selectedTagObjects[0].label.toLowerCase() : (textoIngresado ? "neutral" : "");

    if (!primaryEmotion && !textoIngresado) {
      toast({ title: t('toast.errorTitle'), description: t('studentDashboard.personalTrackingPage.errorNoTextOrTags'), variant: 'destructive' });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const logEmotionPayload = {
        student_id: studentIdToUse,
        emotion: primaryEmotion,
      };
      
      if (textoIngresado) {
        logEmotionPayload.text = textoIngresado;
      }
      if (selectedTagObjects.length > 0) {
        logEmotionPayload.emotion_tags = selectedTagObjects.map(tag => tag.label.toLowerCase());
      }
      
      const { data: logData, error: logError } = await edgeFunctionService.logEmotionFromTracking(logEmotionPayload);

      if (logError) {
        let friendlyMessage = t('studentDashboard.personalTrackingPage.emotion.logged.error');
        if (logError.message) {
           friendlyMessage += `: ${logError.message}`;
        }
        toast({ title: t('toast.errorTitle'), description: friendlyMessage, variant: 'destructive' });
        setIsSubmitting(false);
        return;
      }

      toast({
        title: t('toast.successTitle'),
        description: t('studentDashboard.personalTrackingPage.emotion.logged.success'),
        className: "bg-green-500 text-white dark:bg-green-600",
      });
      
      setTrackingText('');
      setSelectedTags([]);
      setSelectedTagObjects([]);

      setIsAnalyzing(true);
      try {
        const alertAnalyzerPayload = { student_id: studentIdToUse };
        const { data: analysisData, error: analysisError } = await edgeFunctionService.emotionalAlertAnalyzer(alertAnalyzerPayload);
        
        if (analysisError) {
           toast({ title: t('studentDashboard.personalTrackingPage.analysisErrorTitle'), description: analysisError.message || t('studentDashboard.personalTrackingPage.analysisErrorMessage'), variant: 'destructive' });
           setAnalysisResult(null);
        } else if (analysisData) {
          setAnalysisResult(analysisData);
          toast({ title: t('studentDashboard.personalTrackingPage.analysisCompleteTitle'), description: t('studentDashboard.personalTrackingPage.analysisResultsBelow'), variant: "default" });
          
          await createPredictiveAlert(studentIdToUse, analysisData, {
            text: textoIngresado,
            tags: selectedTagObjects.map(tag => tag.label.toLowerCase()),
            primaryEmotion: primaryEmotion
          });
        }
      } catch (analyzerCatchError) {
        toast({ title: t('studentDashboard.personalTrackingPage.analysisCriticalErrorTitle'), description: analyzerCatchError.message, variant: 'destructive' });
        setAnalysisResult(null);
      } finally {
        setIsAnalyzing(false);
      }

    } catch (error) {
      toast({
        title: t('toast.errorTitle'),
        description: error.message || t('studentDashboard.personalTrackingPage.errorSavingLogGeneric'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    tags,
    classifications,
    trackingText,
    setTrackingText,
    selectedTags,
    selectedTagObjects,
    toggleTag,
    onGuardarSeguimiento,
    analysisResult,
    isAnalyzing,
    isLoadingClassifications,
    isLoadingTags,
    isSubmitting,
    authLoading,
  };
};