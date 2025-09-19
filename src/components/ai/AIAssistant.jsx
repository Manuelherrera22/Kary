import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Brain, Sparkles, MessageSquare, Zap, Target, 
  BookOpen, Users, TrendingUp, AlertTriangle,
  ChevronDown, ChevronUp, Loader2, CheckCircle,
  X, Maximize2, Minimize2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { useToast } from '@/components/ui/use-toast';
import educationalAI from '@/services/ai/educationalAI';
import educationalContext from '@/services/ai/educationalContext';
import aiIntegration from '@/services/ai/aiIntegration';

const AIAssistant = ({ 
  isOpen, 
  onClose, 
  initialContext = null, 
  studentId = null,
  role = null 
}) => {
  const { t } = useLanguage();
  const { user } = useMockAuth();
  const { toast } = useToast();
  
  const [isExpanded, setIsExpanded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [context, setContext] = useState(initialContext);
  const [aiCapabilities, setAiCapabilities] = useState([]);
  const [currentCapability, setCurrentCapability] = useState(null);
  const [aiStatus, setAiStatus] = useState('ready');

  useEffect(() => {
    if (isOpen) {
      initializeAIAssistant();
    }
  }, [isOpen, studentId, role]);

  const initializeAIAssistant = async () => {
    setIsLoading(true);
    try {
      // Obtener contexto educativo
      let educationalContext = null;
      if (studentId) {
        educationalContext = await educationalContext.getStudentContext(studentId);
      } else if (role) {
        educationalContext = await educationalContext.getRoleContext(role, user?.id);
      }

      setContext(educationalContext);

      // Cargar capacidades de IA según el contexto
      const capabilities = await loadAICapabilities(educationalContext);
      setAiCapabilities(capabilities);

      // Mensaje de bienvenida
      const welcomeMessage = generateWelcomeMessage(educationalContext);
      setMessages([welcomeMessage]);

      setAiStatus('ready');
    } catch (error) {
      console.error('Error initializing AI assistant:', error);
      setAiStatus('error');
      toast({
        title: t('ai.errorTitle'),
        description: t('ai.initializationError'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const loadAICapabilities = async (context) => {
    const capabilities = [];

    if (context?.profile) {
      // Contexto de estudiante
      capabilities.push(
        {
          id: 'support_plan',
          title: t('ai.capabilities.supportPlan'),
          description: t('ai.capabilities.supportPlanDesc'),
          icon: Target,
          color: 'bg-blue-500',
          action: () => generateSupportPlan(context)
        },
        {
          id: 'predictive_alerts',
          title: t('ai.capabilities.predictiveAlerts'),
          description: t('ai.capabilities.predictiveAlertsDesc'),
          icon: AlertTriangle,
          color: 'bg-red-500',
          action: () => generatePredictiveAlerts(context)
        },
        {
          id: 'personalized_tasks',
          title: t('ai.capabilities.personalizedTasks'),
          description: t('ai.capabilities.personalizedTasksDesc'),
          icon: BookOpen,
          color: 'bg-green-500',
          action: () => generatePersonalizedTasks(context)
        },
        {
          id: 'learning_analysis',
          title: t('ai.capabilities.learningAnalysis'),
          description: t('ai.capabilities.learningAnalysisDesc'),
          icon: TrendingUp,
          color: 'bg-purple-500',
          action: () => analyzeLearningPatterns(context)
        }
      );
    }

    if (context?.role) {
      // Contexto de rol
      capabilities.push(
        {
          id: 'role_assistance',
          title: t('ai.capabilities.roleAssistance'),
          description: t('ai.capabilities.roleAssistanceDesc'),
          icon: Users,
          color: 'bg-indigo-500',
          action: () => getRoleAssistance(context)
        }
      );
    }

    // Capacidades generales
    capabilities.push(
      {
        id: 'adaptive_content',
        title: t('ai.capabilities.adaptiveContent'),
        description: t('ai.capabilities.adaptiveContentDesc'),
        icon: Sparkles,
        color: 'bg-yellow-500',
        action: () => generateAdaptiveContent(context)
      }
    );

    return capabilities;
  };

  const generateWelcomeMessage = (context) => {
    const roleName = context?.role || 'usuario';
    const studentName = context?.profile?.full_name || '';
    
    return {
      id: 'welcome',
      type: 'ai',
      content: studentName 
        ? t('ai.welcomeStudent', { studentName })
        : t('ai.welcomeRole', { role: t(`roles.${roleName}`) }),
      timestamp: new Date().toISOString(),
      capabilities: aiCapabilities.length
    };
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await educationalAI.getRoleBasedAssistance(
        role || 'general',
        { message: inputMessage, context },
        context
      );

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.analysis || response.content || t('ai.noResponse'),
        recommendations: response.recommendations || [],
        actions: response.immediateActions || [],
        confidence: response.confidence || 0.8,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: t('ai.errorResponse'),
        error: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const executeCapability = async (capability) => {
    setCurrentCapability(capability);
    setIsLoading(true);

    try {
      const result = await capability.action();
      handleCapabilityResult(capability, result);
    } catch (error) {
      console.error(`Error executing capability ${capability.id}:`, error);
      toast({
        title: t('ai.errorTitle'),
        description: t('ai.capabilityError', { capability: capability.title }),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
      setCurrentCapability(null);
    }
  };

  const handleCapabilityResult = (capability, result) => {
    const message = {
      id: Date.now(),
      type: 'ai',
      content: formatCapabilityResult(capability, result),
      result: result,
      capability: capability.id,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, message]);
    
    toast({
      title: t('ai.successTitle'),
      description: t('ai.capabilitySuccess', { capability: capability.title }),
      variant: 'default'
    });
  };

  const formatCapabilityResult = (capability, result) => {
    switch (capability.id) {
      case 'support_plan':
        return t('ai.results.supportPlan', {
          title: result.title,
          objectives: result.objectives?.length || 0,
          strategies: result.strategies?.length || 0
        });
      case 'predictive_alerts':
        return t('ai.results.predictiveAlerts', {
          count: Array.isArray(result) ? result.length : 0
        });
      case 'personalized_tasks':
        return t('ai.results.personalizedTasks', {
          count: Array.isArray(result) ? result.length : 0
        });
      case 'learning_analysis':
        return t('ai.results.learningAnalysis', {
          patterns: result.patterns?.length || 0,
          needs: result.needs ? Object.keys(result.needs).length : 0
        });
      case 'role_assistance':
        return t('ai.results.roleAssistance', {
          recommendations: result.recommendations?.length || 0,
          actions: result.immediateActions?.length || 0
        });
      case 'adaptive_content':
        return t('ai.results.adaptiveContent', {
          activities: result.activities?.length || 0,
          resources: result.additionalResources?.length || 0
        });
      default:
        return t('ai.results.general', { capability: capability.title });
    }
  };

  // Funciones de capacidades específicas
  const generateSupportPlan = async (context) => {
    const diagnosticData = context?.evaluations?.current || [];
    return await educationalAI.generateSupportPlan(
      context.profile.id,
      diagnosticData,
      context
    );
  };

  const generatePredictiveAlerts = async (context) => {
    const behaviorData = context?.behavior?.logs || [];
    const academicData = context?.academic?.records || [];
    return await educationalAI.generatePredictiveAlerts(
      context.profile.id,
      behaviorData,
      academicData
    );
  };

  const generatePersonalizedTasks = async (context) => {
    return await educationalAI.generatePersonalizedTasks(
      context.profile.id,
      'Matemáticas',
      'medium',
      'visual'
    );
  };

  const analyzeLearningPatterns = async (context) => {
    return await educationalAI.analyzeDiagnosticsAndSuggestInterventions(
      context?.evaluations?.current || []
    );
  };

  const getRoleAssistance = async (context) => {
    return await educationalAI.getRoleBasedAssistance(
      context.role,
      context,
      context
    );
  };

  const generateAdaptiveContent = async (context) => {
    return await educationalAI.generateAdaptiveContent(
      context?.profile?.id || user?.id,
      'Matemáticas Básicas',
      ['Comprensión', 'Aplicación', 'Análisis']
    );
  };

  const clearConversation = () => {
    setMessages([generateWelcomeMessage(context)]);
  };

  const exportConversation = () => {
    const conversation = {
      timestamp: new Date().toISOString(),
      context: context?.role || 'general',
      messages: messages
    };
    
    const blob = new Blob([JSON.stringify(conversation, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-conversation-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm`}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`bg-slate-900 border border-slate-700 rounded-xl shadow-2xl ${
            isExpanded ? 'w-[90vw] h-[90vh]' : 'w-[600px] h-[700px]'
          } flex flex-col`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {t('ai.assistantTitle')}
                </h2>
                <p className="text-sm text-slate-400">
                  {aiStatus === 'ready' ? t('ai.status.ready') : 
                   aiStatus === 'error' ? t('ai.status.error') : 
                   t('ai.status.loading')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-white"
              >
                {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar - Capabilities */}
            <div className="w-1/3 border-r border-slate-700 p-4 overflow-y-auto">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">
                {t('ai.capabilities.title')}
              </h3>
              
              <div className="space-y-2">
                {aiCapabilities.map((capability) => (
                  <motion.div
                    key={capability.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`cursor-pointer transition-all duration-200 hover:bg-slate-800/50 ${
                        currentCapability?.id === capability.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      onClick={() => executeCapability(capability)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${capability.color}`}>
                            <capability.icon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-white truncate">
                              {capability.title}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1">
                              {capability.description}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-slate-800 text-slate-100'
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        
                        {message.recommendations && message.recommendations.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs font-medium opacity-80">
                              {t('ai.recommendations')}:
                            </p>
                            {message.recommendations.map((rec, index) => (
                              <div key={index} className="text-xs opacity-80">
                                • {rec}
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {message.confidence && (
                          <div className="mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {t('ai.confidence')}: {Math.round(message.confidence * 100)}%
                            </Badge>
                          </div>
                        )}
                      </div>
                      
                      <p className="text-xs text-slate-500 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </motion.div>
                ))}
                
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="bg-slate-800 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                        <span className="text-sm text-slate-300">
                          {t('ai.thinking')}...
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="border-t border-slate-700 p-4">
                <div className="flex space-x-2">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={t('ai.inputPlaceholder')}
                    className="flex-1 resize-none"
                    rows={2}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />
                  <Button
                    onClick={sendMessage}
                    disabled={!inputMessage.trim() || isLoading}
                    className="bg-blue-500 hover:bg-blue-600"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between mt-2">
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearConversation}
                      className="text-slate-400 hover:text-white"
                    >
                      {t('ai.clear')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={exportConversation}
                      className="text-slate-400 hover:text-white"
                    >
                      {t('ai.export')}
                    </Button>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {t('ai.capabilities.count', { count: aiCapabilities.length })}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AIAssistant;

