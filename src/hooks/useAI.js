import { useState, useCallback, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import educationalAI from '@/services/ai/educationalAI';
import educationalContext from '@/services/ai/educationalContext';
import aiIntegration from '@/services/ai/aiIntegration';

export const useAI = (options = {}) => {
  const { toast } = useToast();
  const { t } = useLanguage();
  
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [capabilities, setCapabilities] = useState([]);
  const [lastResponse, setLastResponse] = useState(null);

  // Verificar disponibilidad de IA al inicializar
  useEffect(() => {
    checkAIAvailability();
  }, []);

  const checkAIAvailability = async () => {
    try {
      const availability = await aiIntegration.checkProviderAvailability();
      const hasAvailableProvider = Object.values(availability).some(provider => provider.available);
      setIsAvailable(hasAvailableProvider);
      
      if (!hasAvailableProvider) {
        console.warn('⚠️ No AI providers available, using mock responses');
        setIsAvailable(false);
      }
    } catch (error) {
      console.error('Error checking AI availability:', error);
      console.warn('⚠️ AI availability check failed, using mock responses');
      setIsAvailable(false);
    }
  };

  const generateSupportPlan = useCallback(async (studentId, diagnosticData, context = {}) => {
    setIsLoading(true);
    try {
      const plan = await educationalAI.generateSupportPlan(studentId, diagnosticData, context);
      setLastResponse(plan);
      
      toast({
        title: t('ai.successTitle'),
        description: t('ai.supportPlan.generated'),
        variant: 'default'
      });
      
      return plan;
    } catch (error) {
      console.error('Error generating support plan:', error);
      toast({
        title: t('ai.errorTitle'),
        description: t('ai.supportPlan.error'),
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  const generatePredictiveAlerts = useCallback(async (studentId, behaviorData, academicData) => {
    setIsLoading(true);
    try {
      const alerts = await educationalAI.generatePredictiveAlerts(studentId, behaviorData, academicData);
      setLastResponse(alerts);
      
      toast({
        title: t('ai.successTitle'),
        description: t('ai.predictiveAlerts.generated', { count: alerts.length }),
        variant: 'default'
      });
      
      return alerts;
    } catch (error) {
      console.error('Error generating predictive alerts:', error);
      toast({
        title: t('ai.errorTitle'),
        description: t('ai.predictiveAlerts.error'),
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  const generatePersonalizedTasks = useCallback(async (studentId, subject, difficulty, learningStyle) => {
    setIsLoading(true);
    try {
      const tasks = await educationalAI.generatePersonalizedTasks(studentId, subject, difficulty, learningStyle);
      setLastResponse(tasks);
      
      toast({
        title: t('ai.successTitle'),
        description: t('ai.personalizedTasks.generated', { count: tasks.length }),
        variant: 'default'
      });
      
      return tasks;
    } catch (error) {
      console.error('Error generating personalized tasks:', error);
      toast({
        title: t('ai.errorTitle'),
        description: t('ai.personalizedTasks.error'),
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  const getRoleAssistance = useCallback(async (role, context, currentData) => {
    setIsLoading(true);
    try {
      const assistance = await educationalAI.getRoleBasedAssistance(role, context, currentData);
      setLastResponse(assistance);
      
      toast({
        title: t('ai.successTitle'),
        description: t('ai.roleAssistance.generated'),
        variant: 'default'
      });
      
      return assistance;
    } catch (error) {
      console.error('Error getting role assistance:', error);
      toast({
        title: t('ai.errorTitle'),
        description: t('ai.roleAssistance.error'),
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  const analyzeDiagnostics = useCallback(async (diagnosticData) => {
    setIsLoading(true);
    try {
      const analysis = await educationalAI.analyzeDiagnosticsAndSuggestInterventions(diagnosticData);
      setLastResponse(analysis);
      
      toast({
        title: t('ai.successTitle'),
        description: t('ai.learningAnalysis.completed'),
        variant: 'default'
      });
      
      return analysis;
    } catch (error) {
      console.error('Error analyzing diagnostics:', error);
      toast({
        title: t('ai.errorTitle'),
        description: t('ai.learningAnalysis.error'),
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  const generateAdaptiveContent = useCallback(async (studentId, topic, learningObjectives) => {
    setIsLoading(true);
    try {
      const content = await educationalAI.generateAdaptiveContent(studentId, topic, learningObjectives);
      setLastResponse(content);
      
      toast({
        title: t('ai.successTitle'),
        description: t('ai.adaptiveContent.generated'),
        variant: 'default'
      });
      
      return content;
    } catch (error) {
      console.error('Error generating adaptive content:', error);
      toast({
        title: t('ai.errorTitle'),
        description: t('ai.adaptiveContent.error'),
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  const getStudentContext = useCallback(async (studentId) => {
    try {
      const context = await educationalContext.getStudentContext(studentId);
      return context;
    } catch (error) {
      console.error('Error getting student context:', error);
      throw error;
    }
  }, []);

  const getRoleContext = useCallback(async (role, userId) => {
    try {
      const context = await educationalContext.getRoleContext(role, userId);
      return context;
    } catch (error) {
      console.error('Error getting role context:', error);
      throw error;
    }
  }, []);

  const analyzeLearningPatterns = useCallback(async (studentId) => {
    try {
      const patterns = await educationalContext.analyzeLearningPatterns(studentId);
      return patterns;
    } catch (error) {
      console.error('Error analyzing learning patterns:', error);
      throw error;
    }
  }, []);

  const identifySpecificNeeds = useCallback(async (studentId) => {
    try {
      const needs = await educationalContext.identifySpecificNeeds(studentId);
      return needs;
    } catch (error) {
      console.error('Error identifying specific needs:', error);
      throw error;
    }
  }, []);

  // Función genérica para llamadas personalizadas a la IA
  const callAI = useCallback(async (prompt, type = 'general', options = {}) => {
    setIsLoading(true);
    try {
      const response = await aiIntegration.generateResponse(prompt, type, options);
      setLastResponse(response);
      return response;
    } catch (error) {
      console.error('Error calling AI:', error);
      toast({
        title: t('ai.errorTitle'),
        description: t('ai.general.error'),
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast, t]);

  // Función para obtener sugerencias contextuales
  const getContextualSuggestions = useCallback(async (context) => {
    try {
      const suggestions = [];
      
      // Sugerencias basadas en el contexto
      if (context.role === 'teacher') {
        suggestions.push({
          id: 'class_planning',
          title: t('ai.suggestions.teacher.classPlanning'),
          description: t('ai.suggestions.teacher.classPlanningDesc'),
          action: () => getRoleAssistance('teacher', context, {})
        });
        
        if (context.students && context.students.length > 0) {
          suggestions.push({
            id: 'student_analysis',
            title: t('ai.suggestions.teacher.studentAnalysis'),
            description: t('ai.suggestions.teacher.studentAnalysisDesc'),
            action: () => analyzeDiagnostics(context.evaluations || [])
          });
        }
      }
      
      if (context.role === 'psychopedagogue') {
        suggestions.push({
          id: 'support_plan',
          title: t('ai.suggestions.psychopedagogue.supportPlan'),
          description: t('ai.suggestions.psychopedagogue.supportPlanDesc'),
          action: () => generateSupportPlan(context.studentId, context.diagnosticData, context)
        });
        
        suggestions.push({
          id: 'predictive_alerts',
          title: t('ai.suggestions.psychopedagogue.predictiveAlerts'),
          description: t('ai.suggestions.psychopedagogue.predictiveAlertsDesc'),
          action: () => generatePredictiveAlerts(context.studentId, context.behaviorData, context.academicData)
        });
      }
      
      if (context.role === 'directive') {
        suggestions.push({
          id: 'institutional_analysis',
          title: t('ai.suggestions.directive.institutionalAnalysis'),
          description: t('ai.suggestions.directive.institutionalAnalysisDesc'),
          action: () => getRoleAssistance('directive', context, {})
        });
      }
      
      return suggestions;
    } catch (error) {
      console.error('Error getting contextual suggestions:', error);
      return [];
    }
  }, [t, getRoleAssistance, analyzeDiagnostics, generateSupportPlan, generatePredictiveAlerts]);

  // Función para limpiar el estado
  const clearLastResponse = useCallback(() => {
    setLastResponse(null);
  }, []);

  // Función para obtener estadísticas de uso
  const getUsageStats = useCallback(() => {
    return aiIntegration.getUsageStats();
  }, []);

  return {
    // Estado
    isLoading,
    isAvailable,
    capabilities,
    lastResponse,
    
    // Funciones principales
    generateSupportPlan,
    generatePredictiveAlerts,
    generatePersonalizedTasks,
    getRoleAssistance,
    analyzeDiagnostics,
    generateAdaptiveContent,
    
    // Funciones de contexto
    getStudentContext,
    getRoleContext,
    analyzeLearningPatterns,
    identifySpecificNeeds,
    
    // Funciones utilitarias
    callAI,
    getContextualSuggestions,
    clearLastResponse,
    getUsageStats,
    checkAIAvailability
  };
};

export default useAI;



