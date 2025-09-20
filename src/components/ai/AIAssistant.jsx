import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ai-assistant-solid.css';
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
      let contextData = null;
      if (educationalContext) {
        if (studentId) {
          contextData = await educationalContext.getStudentContext(studentId);
        } else if (role) {
          contextData = await educationalContext.getRoleContext(role, user?.id);
        }
      }

      // Si no se pudo obtener contexto, usar contexto por defecto
      const finalContext = contextData || {
        role: role || 'general',
        profile: user ? { id: user.id, full_name: user.name } : null
      };
      
      setContext(finalContext);

      // Cargar capacidades de IA según el contexto
      const capabilities = await loadAICapabilities(finalContext);
      setAiCapabilities(capabilities);

      // Mensaje de bienvenida
      const welcomeMessage = generateWelcomeMessage(finalContext);
      setMessages([welcomeMessage]);

      setAiStatus('ready');
    } catch (error) {
      console.error('Error initializing AI assistant:', error);
      setAiStatus('error');
      toast({
        title: t('dashboards.ai.errorTitle'),
        description: t('dashboards.ai.initializationError'),
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
          title: t('dashboards.ai.capabilities.supportPlan'),
          description: t('dashboards.ai.capabilities.supportPlanDesc'),
          icon: Target,
          color: 'bg-blue-500',
          action: () => generateSupportPlan(context)
        },
        {
          id: 'predictive_alerts',
          title: t('dashboards.ai.capabilities.predictiveAlerts'),
          description: t('dashboards.ai.capabilities.predictiveAlertsDesc'),
          icon: AlertTriangle,
          color: 'bg-red-500',
          action: () => generatePredictiveAlerts(context)
        },
        {
          id: 'personalized_tasks',
          title: t('dashboards.ai.capabilities.personalizedTasks'),
          description: t('dashboards.ai.capabilities.personalizedTasksDesc'),
          icon: BookOpen,
          color: 'bg-green-500',
          action: () => generatePersonalizedTasks(context)
        },
        {
          id: 'learning_analysis',
          title: t('dashboards.ai.capabilities.learningAnalysis'),
          description: t('dashboards.ai.capabilities.learningAnalysisDesc'),
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
          title: t('dashboards.ai.capabilities.roleAssistance'),
          description: t('dashboards.ai.capabilities.roleAssistanceDesc'),
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
        title: t('dashboards.ai.capabilities.adaptiveContent'),
        description: t('dashboards.ai.capabilities.adaptiveContentDesc'),
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
        ? t('dashboards.ai.welcomeStudent', { studentName })
        : t('dashboards.ai.welcomeRole', { role: t(`roles.${roleName}`) }),
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
        content: response.analysis || response.content || t('dashboards.ai.noResponse'),
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
        content: t('dashboards.ai.errorResponse'),
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
        title: t('dashboards.ai.errorTitle'),
        description: t('dashboards.ai.capabilityError', { capability: capability.title }),
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
      title: t('dashboards.ai.successTitle'),
      description: t('dashboards.ai.capabilitySuccess', { capability: capability.title }),
      variant: 'default'
    });
  };

  const formatCapabilityResult = (capability, result) => {
    switch (capability.id) {
      case 'support_plan':
        return t('dashboards.ai.results.supportPlan', {
          title: result.title,
          objectives: result.objectives?.length || 0,
          strategies: result.strategies?.length || 0
        });
      case 'predictive_alerts':
        return t('dashboards.ai.results.predictiveAlerts', {
          count: Array.isArray(result) ? result.length : 0
        });
      case 'personalized_tasks':
        return t('dashboards.ai.results.personalizedTasks', {
          count: Array.isArray(result) ? result.length : 0
        });
      case 'learning_analysis':
        return t('dashboards.ai.results.learningAnalysis', {
          patterns: result.patterns?.length || 0,
          needs: result.needs ? Object.keys(result.needs).length : 0
        });
      case 'role_assistance':
        return t('dashboards.ai.results.roleAssistance', {
          recommendations: result.recommendations?.length || 0,
          actions: result.immediateActions?.length || 0
        });
      case 'adaptive_content':
        return t('dashboards.ai.results.adaptiveContent', {
          activities: result.activities?.length || 0,
          resources: result.additionalResources?.length || 0
        });
      default:
        return t('dashboards.ai.results.general', { capability: capability.title });
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
        className={`fixed inset-0 z-50 flex items-center justify-center ai-assistant-overlay`}
        style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)', backdropFilter: 'blur(8px)' }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className={`ai-assistant-modal bg-slate-900 border-2 border-slate-500 rounded-xl shadow-2xl ${
            isExpanded ? 'w-[95vw] h-[95vh] sm:w-[90vw] sm:h-[90vh]' : 'w-[95vw] h-[95vh] sm:w-[600px] sm:h-[700px]'
          } flex flex-col`}
          style={{ backgroundColor: '#0f172a', opacity: 1, border: '2px solid #475569' }}
        >
          {/* Header */}
          <div className="ai-assistant-header flex items-center justify-between p-4 border-b-2 border-slate-500 bg-slate-800" style={{ backgroundColor: '#1e293b', opacity: 1 }}>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white">
                  {t('dashboards.ai.assistantTitle')}
                </h2>
                <p className="text-sm text-slate-400">
                  {aiStatus === 'ready' ? t('dashboards.ai.status.ready') : 
                   aiStatus === 'error' ? t('dashboards.ai.status.error') : 
                   t('dashboards.ai.status.loading')}
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
          <div className="flex-1 flex flex-col sm:flex-row overflow-hidden">
            {/* Sidebar - Capabilities */}
            <div className="ai-assistant-sidebar w-full sm:w-1/3 border-r-0 sm:border-r-2 border-slate-500 p-3 sm:p-4 overflow-y-auto bg-slate-800" style={{ backgroundColor: '#1e293b', opacity: 1 }}>
              <h3 className="text-sm font-semibold text-slate-300 mb-3">
                {t('dashboards.ai.capabilities.title')}
              </h3>
              
              <div className="space-y-2">
                {aiCapabilities.map((capability) => (
                  <motion.div
                    key={capability.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`ai-assistant-capability-card cursor-pointer transition-all duration-200 hover:bg-slate-700 bg-slate-800 ${
                        currentCapability?.id === capability.id ? 'ring-2 ring-blue-500' : ''
                      }`}
                      style={{ backgroundColor: '#1e293b', opacity: 1, border: '1px solid #475569' }}
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
            <div className="ai-assistant-main flex-1 flex flex-col bg-slate-900 w-full sm:w-2/3" style={{ backgroundColor: '#0f172a', opacity: 1 }}>
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
                          ? 'ai-assistant-user-message bg-blue-600 text-white' 
                          : 'ai-assistant-message bg-slate-800 text-slate-100'
                      }`} style={{ 
                        backgroundColor: message.type === 'user' ? '#1d4ed8' : '#1e293b', 
                        opacity: 1,
                        border: message.type === 'user' ? '1px solid #3b82f6' : '1px solid #475569'
                      }}>
                        <p className="text-sm">{message.content}</p>
                        
                        {message.recommendations && message.recommendations.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <p className="text-xs font-medium opacity-80">
                              {t('dashboards.ai.recommendations')}:
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
                              {t('dashboards.ai.confidence')}: {Math.round(message.confidence * 100)}%
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
                    <div className="bg-slate-800 p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#1e293b', opacity: 1 }}>
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-400" />
                        <span className="text-sm text-slate-300">
                          {t('dashboards.ai.thinking')}...
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="ai-assistant-input-area border-t-2 border-slate-500 p-4 bg-slate-800" style={{ backgroundColor: '#1e293b', opacity: 1 }}>
                <div className="flex space-x-2">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={t('dashboards.ai.inputPlaceholder')}
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
                      {t('dashboards.ai.clear')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={exportConversation}
                      className="text-slate-400 hover:text-white"
                    >
                      {t('dashboards.ai.export')}
                    </Button>
                  </div>
                  
                  <Badge variant="outline" className="text-xs">
                    {t('dashboards.ai.capabilities.count', { count: aiCapabilities.length })}
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

