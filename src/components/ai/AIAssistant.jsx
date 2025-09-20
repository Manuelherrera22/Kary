import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ai-assistant-solid.css';
import { 
  Brain, Sparkles, MessageSquare, Zap, Target, 
  BookOpen, Users, TrendingUp, AlertTriangle,
  ChevronDown, ChevronUp, Loader2, CheckCircle,
  X, Maximize2, Minimize2, Home, BarChart2, 
  FileText, HelpCircle
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
import intelligentDataService from '@/services/ai/intelligentDataService';
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
    const roleName = context?.role || 'general';

    // Capacidades específicas por rol
    switch (roleName) {
      case 'student':
        capabilities.push(
          {
            id: 'personalized_learning',
            title: 'Plan de Aprendizaje Personalizado',
            description: 'Crea un plan de estudio adaptado a tu nivel y objetivos',
            icon: Target,
            color: 'bg-blue-500',
            action: () => generatePersonalizedLearningPlan(context)
          },
          {
            id: 'progress_analysis',
            title: 'Análisis de Progreso',
            description: 'Revisa tu rendimiento y áreas de mejora',
            icon: TrendingUp,
            color: 'bg-green-500',
            action: () => analyzeStudentProgress(context)
          },
          {
            id: 'study_tips',
            title: 'Consejos de Estudio',
            description: 'Recibe técnicas de estudio personalizadas',
            icon: BookOpen,
            color: 'bg-purple-500',
            action: () => generateStudyTips(context)
          },
          {
            id: 'motivation',
            title: 'Motivación y Apoyo',
            description: 'Recibe apoyo emocional y motivacional',
            icon: Sparkles,
            color: 'bg-pink-500',
            action: () => generateMotivation(context)
          }
        );
        break;

      case 'teacher':
        capabilities.push(
          {
            id: 'lesson_planner',
            title: 'Planificador de Clases',
            description: 'Crea planes de clase personalizados y efectivos',
            icon: Target,
            color: 'bg-blue-500',
            action: () => generateLessonPlan(context)
          },
          {
            id: 'student_analysis',
            title: 'Análisis de Estudiantes',
            description: 'Analiza el progreso y necesidades de tus estudiantes',
            icon: Users,
            color: 'bg-green-500',
            action: () => analyzeStudents(context)
          },
          {
            id: 'activity_generator',
            title: 'Generador de Actividades',
            description: 'Crea actividades educativas adaptadas al nivel',
            icon: BookOpen,
            color: 'bg-purple-500',
            action: () => generateActivities(context)
          },
          {
            id: 'assessment_tools',
            title: 'Herramientas de Evaluación',
            description: 'Genera evaluaciones y rúbricas personalizadas',
            icon: CheckCircle,
            color: 'bg-orange-500',
            action: () => generateAssessments(context)
          }
        );
        break;

      case 'parent':
        capabilities.push(
          {
            id: 'child_progress',
            title: 'Progreso de mi Hijo/a',
            description: 'Revisa el progreso académico detallado',
            icon: TrendingUp,
            color: 'bg-blue-500',
            action: () => viewChildProgress(context)
          },
          {
            id: 'home_support',
            title: 'Apoyo en Casa',
            description: 'Recibe recomendaciones para apoyar en casa',
            icon: Home,
            color: 'bg-green-500',
            action: () => generateHomeSupport(context)
          },
          {
            id: 'communication',
            title: 'Comunicación Escolar',
            description: 'Herramientas para comunicarte con la escuela',
            icon: MessageSquare,
            color: 'bg-purple-500',
            action: () => generateCommunication(context)
          },
          {
            id: 'resources',
            title: 'Recursos Familiares',
            description: 'Accede a recursos educativos para la familia',
            icon: BookOpen,
            color: 'bg-pink-500',
            action: () => generateFamilyResources(context)
          }
        );
        break;

      case 'psychopedagogue':
        capabilities.push(
          {
            id: 'case_analysis',
            title: 'Análisis de Casos',
            description: 'Analiza casos de estudiantes con necesidades especiales',
            icon: Users,
            color: 'bg-blue-500',
            action: () => analyzeCases(context)
          },
          {
            id: 'support_plans',
            title: 'Planes de Apoyo',
            description: 'Crea planes de apoyo psicopedagógico personalizados',
            icon: Target,
            color: 'bg-green-500',
            action: () => generateSupportPlans(context)
          },
          {
            id: 'intervention_strategies',
            title: 'Estrategias de Intervención',
            description: 'Desarrolla estrategias de intervención efectivas',
            icon: Zap,
            color: 'bg-purple-500',
            action: () => generateInterventions(context)
          },
          {
            id: 'reports',
            title: 'Reportes Especializados',
            description: 'Genera reportes psicopedagógicos detallados',
            icon: FileText,
            color: 'bg-orange-500',
            action: () => generateReports(context)
          }
        );
        break;

      case 'directive':
        capabilities.push(
          {
            id: 'institutional_metrics',
            title: 'Métricas Institucionales',
            description: 'Revisa métricas y KPIs de la institución',
            icon: BarChart2,
            color: 'bg-blue-500',
            action: () => viewInstitutionalMetrics(context)
          },
          {
            id: 'strategic_reports',
            title: 'Reportes Estratégicos',
            description: 'Genera reportes para toma de decisiones',
            icon: FileText,
            color: 'bg-green-500',
            action: () => generateStrategicReports(context)
          },
          {
            id: 'performance_analysis',
            title: 'Análisis de Rendimiento',
            description: 'Analiza el rendimiento general de la institución',
            icon: TrendingUp,
            color: 'bg-purple-500',
            action: () => analyzeInstitutionalPerformance(context)
          },
          {
            id: 'improvement_plans',
            title: 'Planes de Mejora',
            description: 'Desarrolla planes de mejora institucional',
            icon: Target,
            color: 'bg-orange-500',
            action: () => generateImprovementPlans(context)
          }
        );
        break;

      default:
        capabilities.push(
          {
            id: 'general_help',
            title: 'Ayuda General',
            description: 'Obtén ayuda personalizada para tu rol',
            icon: HelpCircle,
            color: 'bg-blue-500',
            action: () => getGeneralHelp(context)
          },
          {
            id: 'feature_exploration',
            title: 'Explorar Funciones',
            description: 'Descubre las funciones disponibles para ti',
            icon: Sparkles,
            color: 'bg-green-500',
            action: () => exploreFeatures(context)
          }
        );
    }

    return capabilities;
  };

  const generateWelcomeMessage = (context) => {
    const roleName = context?.role || 'usuario';
    const studentName = context?.profile?.full_name || '';
    const userName = user?.name || studentName || 'Usuario';
    
    // Mensaje personalizado según el rol
    let welcomeContent = '';
    let suggestions = [];
    
    if (studentName) {
      // Mensaje para estudiante
      welcomeContent = `¡Hola ${studentName}! 👋 Soy tu asistente de IA personalizado. Estoy aquí para ayudarte con tu aprendizaje y desarrollo académico.`;
      suggestions = [
        "Generar un plan de apoyo personalizado",
        "Analizar tu progreso de aprendizaje",
        "Crear actividades adaptadas a tu nivel",
        "Recibir alertas predictivas sobre tu rendimiento"
      ];
    } else {
      // Mensaje según el rol
      const roleTranslations = {
        'teacher': 'Profesor/a',
        'parent': 'Padre/Madre',
        'psychopedagogue': 'Psicopedagogo/a',
        'directive': 'Directivo/a',
        'admin': 'Administrador/a'
      };
      
      const roleDisplayName = roleTranslations[roleName] || 'Usuario';
      welcomeContent = `¡Hola ${userName}! 👋 Soy tu asistente de IA especializado para ${roleDisplayName}. Estoy aquí para optimizar tu experiencia en la plataforma Kary.`;
      
      switch (roleName) {
        case 'teacher':
          suggestions = [
            "Generar actividades personalizadas para mis estudiantes",
            "Analizar el progreso de la clase",
            "Crear planes de apoyo individualizados",
            "Recibir insights sobre el rendimiento académico"
          ];
          break;
        case 'parent':
          suggestions = [
            "Ver el progreso detallado de mi hijo/a",
            "Recibir recomendaciones de apoyo en casa",
            "Comunicarme con los profesores",
            "Acceder a recursos educativos familiares"
          ];
          break;
        case 'psychopedagogue':
          suggestions = [
            "Crear planes de apoyo psicopedagógico",
            "Analizar casos de estudiantes",
            "Generar reportes especializados",
            "Recibir alertas de riesgo académico"
          ];
          break;
        case 'directive':
          suggestions = [
            "Ver métricas institucionales en tiempo real",
            "Generar reportes estratégicos",
            "Analizar el rendimiento general",
            "Recibir insights para la toma de decisiones"
          ];
          break;
        case 'admin':
          suggestions = [
            "Gestionar usuarios y permisos",
            "Configurar la plataforma",
            "Monitorear el sistema",
            "Generar reportes administrativos"
          ];
          break;
        default:
          suggestions = [
            "Explorar las funcionalidades disponibles",
            "Recibir ayuda personalizada",
            "Acceder a recursos educativos",
            "Optimizar mi experiencia de usuario"
          ];
      }
    }
    
    return {
      id: 'welcome',
      type: 'ai',
      content: welcomeContent,
      timestamp: new Date().toISOString(),
      suggestions: suggestions,
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
    const currentInput = inputMessage;
    setInputMessage('');
    setIsLoading(true);

    try {
      // Analizar el tipo de consulta del usuario
      const queryType = analyzeQueryType(currentInput);
      
      let response;
      
      // Procesar según el tipo de consulta
      switch (queryType.type) {
        case 'capability_request':
          // Si el usuario solicita una capacidad específica, ejecutarla
          const capability = aiCapabilities.find(cap => 
            cap.id === queryType.capabilityId || 
            currentInput.toLowerCase().includes(cap.title.toLowerCase())
          );
          if (capability) {
            response = await capability.action();
          } else {
            // Usar Gemini para respuestas generales
            response = await callGeminiDirectly(currentInput, context, queryType);
          }
          break;
          
        case 'help_request':
          response = {
            content: generateHelpResponse(queryType.helpType),
            recommendations: getHelpRecommendations(queryType.helpType),
            actions: []
          };
          break;
          
        case 'data_request':
          response = await callGeminiDirectly(currentInput, context, queryType);
          break;
          
        default:
          // Usar Gemini para todas las consultas generales
          response = await callGeminiDirectly(currentInput, context, queryType);
      }

      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: response.analysis || response.content || t('dashboards.ai.noResponse'),
        recommendations: response.recommendations || [],
        actions: response.immediateActions || [],
        confidence: response.confidence || 0.8,
        timestamp: new Date().toISOString(),
        queryType: queryType.type
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'ai',
        content: generateErrorResponse(error, currentInput),
        error: true,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // Función para llamar a Gemini directamente con datos reales
  const callGeminiDirectly = async (message, context, queryType) => {
    try {
      // Obtener datos reales e inteligentes del contexto
      let realTimeData = {};
      try {
        if (context?.role) {
          realTimeData = await intelligentDataService.getRoleBasedIntelligence(context.role, user?.id);
        }
      } catch (error) {
        console.warn('Error getting real-time data:', error);
      }

      // Crear prompt contextualizado con datos reales
      const roleName = context?.role || 'usuario';
      const userName = user?.name || 'Usuario';
      
      const contextualPrompt = `Eres un asistente de IA especializado en educación para la plataforma Kary. 

CONTEXTO DEL USUARIO:
- Usuario: ${userName}
- Rol: ${roleName}
- Consulta: ${message}
- Tipo de consulta: ${queryType.type}

DATOS REALES DE LA INSTITUCIÓN:
${realTimeData.demographics ? `
- Total de estudiantes: ${realTimeData.demographics.totalStudents || 'N/A'}
- Total de profesores: ${realTimeData.demographics.totalTeachers || 'N/A'}
- Estudiantes activos: ${realTimeData.demographics.activeStudents || 'N/A'}
` : ''}

${realTimeData.academic ? `
- Actividades totales: ${realTimeData.academic.totalActivities || 'N/A'}
- Actividades completadas: ${realTimeData.academic.completedActivities || 'N/A'}
- Tasa de finalización: ${realTimeData.academic.averageCompletionRate || 'N/A'}%
` : ''}

${realTimeData.support ? `
- Planes de apoyo activos: ${realTimeData.support.activeSupportPlans || 'N/A'}
- Efectividad del apoyo: ${realTimeData.support.supportEffectiveness || 'N/A'}%
` : ''}

${realTimeData.insights ? `
- Estudiantes destacados: ${realTimeData.insights.topPerformingStudents?.length || 0}
- Estudiantes que necesitan atención: ${realTimeData.insights.studentsNeedingAttention?.length || 0}
- Desafíos institucionales: ${realTimeData.insights.institutionalChallenges?.join(', ') || 'N/A'}
` : ''}

INSTRUCCIONES:
- Responde de manera útil y específica para el rol del usuario
- Usa los datos reales de la institución cuando sea relevante
- Proporciona recomendaciones accionables basadas en datos reales
- Usa un tono profesional pero amigable
- Incluye emojis apropiados para hacer la respuesta más atractiva
- Si es relevante, sugiere capacidades específicas de la plataforma
- Mantén las respuestas concisas pero informativas
- Menciona métricas reales cuando sea apropiado

Responde en español y adapta tu respuesta al contexto educativo, al rol del usuario y a los datos reales de la institución.`;

      const geminiResponse = await educationalAI.geminiService.generateEducationalContent(
        contextualPrompt,
        {
          type: 'chat',
          role: roleName,
          user: userName,
          context: context,
          realTimeData: realTimeData
        }
      );

      if (geminiResponse.success) {
        return {
          content: geminiResponse.content,
          recommendations: extractRecommendations(geminiResponse.content),
          actions: extractActions(geminiResponse.content),
          confidence: 0.9,
          realTimeData: realTimeData
        };
      } else {
        throw new Error(geminiResponse.error || 'Error en Gemini');
      }
    } catch (error) {
      console.error('Error calling Gemini:', error);
      // Fallback a respuesta local con datos básicos
      return {
        content: `Disculpa ${user?.name || 'Usuario'}, no pude procesar tu consulta en este momento. 

**Tu consulta:** "${message}"

**Sugerencias:**
• Intenta reformular tu pregunta
• Usa palabras clave específicas de tu rol (${context?.role || 'usuario'})
• Verifica que tu consulta esté relacionada con la educación

¿Te gustaría intentar con una consulta diferente?`,
        recommendations: [
          "Reformular la consulta de manera más específica",
          "Usar palabras clave relacionadas con tu rol",
          "Verificar que la consulta esté relacionada con la educación"
        ],
        actions: [],
        confidence: 0.5
      };
    }
  };

  // Función para extraer recomendaciones del texto de Gemini
  const extractRecommendations = (text) => {
    const recommendations = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.includes('•') || line.includes('-') || line.includes('*')) {
        const cleanLine = line.replace(/^[\s•\-*]+/, '').trim();
        if (cleanLine.length > 10 && cleanLine.length < 100) {
          recommendations.push(cleanLine);
        }
      }
    }
    
    return recommendations.slice(0, 4); // Máximo 4 recomendaciones
  };

  // Función para extraer acciones del texto de Gemini
  const extractActions = (text) => {
    const actions = [];
    const lines = text.split('\n');
    
    for (const line of lines) {
      if (line.toLowerCase().includes('acción') || line.toLowerCase().includes('paso') || line.toLowerCase().includes('siguiente')) {
        const cleanLine = line.replace(/^[\s•\-*]+/, '').trim();
        if (cleanLine.length > 10 && cleanLine.length < 100) {
          actions.push(cleanLine);
        }
      }
    }
    
    return actions.slice(0, 3); // Máximo 3 acciones
  };

  // Función para analizar el tipo de consulta del usuario
  const analyzeQueryType = (input) => {
    const lowerInput = input.toLowerCase();
    
    // Detectar solicitudes de capacidades específicas
    const capabilityKeywords = {
      'support_plan': ['plan de apoyo', 'plan personalizado', 'apoyo individual'],
      'predictive_alerts': ['alertas', 'predicciones', 'riesgo'],
      'personalized_tasks': ['actividades', 'tareas', 'ejercicios'],
      'learning_analysis': ['análisis', 'progreso', 'rendimiento'],
      'role_assistance': ['ayuda', 'asistencia', 'cómo hacer'],
      'adaptive_content': ['contenido', 'material', 'recursos']
    };
    
    for (const [capabilityId, keywords] of Object.entries(capabilityKeywords)) {
      if (keywords.some(keyword => lowerInput.includes(keyword))) {
        return { type: 'capability_request', capabilityId };
      }
    }
    
    // Detectar solicitudes de ayuda
    if (lowerInput.includes('ayuda') || lowerInput.includes('help') || lowerInput.includes('cómo')) {
      return { type: 'help_request', helpType: 'general' };
    }
    
    // Detectar solicitudes de datos
    if (lowerInput.includes('datos') || lowerInput.includes('estadísticas') || lowerInput.includes('métricas')) {
      return { type: 'data_request' };
    }
    
    return { type: 'general' };
  };

  // Función para generar respuestas de ayuda
  const generateHelpResponse = (helpType) => {
    const roleName = context?.role || 'usuario';
    const userName = user?.name || 'Usuario';
    
    switch (helpType) {
      case 'general':
        return `¡Hola ${userName}! 👋 Estoy aquí para ayudarte. Como ${roleName}, puedes pedirme:

• **Generar contenido personalizado** - "Crea actividades para mis estudiantes"
• **Analizar datos** - "Muestra el progreso de la clase"
• **Crear planes de apoyo** - "Genera un plan para Juan"
• **Obtener insights** - "¿Qué patrones ves en el rendimiento?"

¿En qué específicamente te gustaría que te ayude?`;
        
      default:
        return `¡Hola ${userName}! 👋 Estoy aquí para ayudarte. ¿En qué puedo asistirte hoy?`;
    }
  };

  // Función para generar recomendaciones de ayuda
  const getHelpRecommendations = (helpType) => {
    const roleName = context?.role || 'usuario';
    
    switch (roleName) {
      case 'teacher':
        return [
          "Generar actividades personalizadas",
          "Analizar el progreso de estudiantes",
          "Crear planes de apoyo individualizados",
          "Recibir insights sobre rendimiento"
        ];
      case 'parent':
        return [
          "Ver progreso de mi hijo/a",
          "Recibir recomendaciones de apoyo",
          "Comunicarme con profesores",
          "Acceder a recursos familiares"
        ];
      case 'psychopedagogue':
        return [
          "Crear planes psicopedagógicos",
          "Analizar casos de estudiantes",
          "Generar reportes especializados",
          "Recibir alertas de riesgo"
        ];
      case 'directive':
        return [
          "Ver métricas institucionales",
          "Generar reportes estratégicos",
          "Analizar rendimiento general",
          "Recibir insights para decisiones"
        ];
      default:
        return [
          "Explorar funcionalidades",
          "Recibir ayuda personalizada",
          "Acceder a recursos",
          "Optimizar experiencia"
        ];
    }
  };

  // Función para generar respuestas de error más útiles
  const generateErrorResponse = (error, input) => {
    const userName = user?.name || 'Usuario';
    
    return `Disculpa ${userName}, hubo un problema procesando tu solicitud. 😔

**Tu consulta:** "${input}"

**Posibles soluciones:**
• Intenta reformular tu pregunta de manera más específica
• Usa palabras clave relacionadas con tu rol (${context?.role || 'usuario'})
• Verifica que tu consulta esté relacionada con la educación

**Ejemplos de consultas útiles:**
• "Genera actividades para mis estudiantes"
• "Analiza el progreso de la clase"
• "Crea un plan de apoyo personalizado"

¿Te gustaría intentar con una consulta diferente?`;
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

  // Nuevas funciones de capacidades específicas por rol
  const generatePersonalizedLearningPlan = async (context) => {
    return {
      content: `📚 **Plan de Aprendizaje Personalizado para ${user?.name || 'Estudiante'}**

He creado un plan de estudio adaptado a tu nivel actual y objetivos de aprendizaje:

**Objetivos Identificados:**
• Mejorar comprensión en Matemáticas
• Desarrollar habilidades de lectura crítica
• Fortalecer técnicas de estudio

**Estrategias Recomendadas:**
• Sesiones de estudio de 45 minutos con descansos de 15 minutos
• Técnica Pomodoro para mantener la concentración
• Repaso espaciado para mejorar la retención

**Cronograma Semanal:**
• Lunes-Miércoles-Viernes: Matemáticas (2 horas)
• Martes-Jueves: Lenguaje (1.5 horas)
• Sábados: Repaso general (1 hora)

¿Te gustaría que ajuste algún aspecto del plan?`,
      recommendations: [
        "Establece un horario fijo de estudio",
        "Usa técnicas de memorización activa",
        "Practica con ejercicios variados",
        "Mantén un registro de tu progreso"
      ],
      actions: [
        "Configurar recordatorios de estudio",
        "Descargar recursos adicionales",
        "Programar evaluaciones de progreso"
      ]
    };
  };

  const analyzeStudentProgress = async (context) => {
    return {
      content: `📊 **Análisis de Progreso de ${user?.name || 'Estudiante'}**

**Rendimiento General:**
• Matemáticas: 85% (Mejorando)
• Lenguaje: 78% (Estable)
• Ciencias: 92% (Excelente)

**Fortalezas Identificadas:**
• Excelente capacidad de análisis en Ciencias
• Buena comprensión de conceptos abstractos
• Participación activa en clase

**Áreas de Mejora:**
• Cálculo mental en Matemáticas
• Velocidad de lectura
• Organización del tiempo de estudio

**Recomendaciones Específicas:**
• Practicar ejercicios de cálculo mental 15 min/día
• Leer textos variados para mejorar velocidad
• Usar agenda para planificar tareas`,
      recommendations: [
        "Practicar cálculo mental diariamente",
        "Leer 20 minutos extra por día",
        "Usar técnicas de organización",
        "Solicitar ayuda en áreas específicas"
      ]
    };
  };

  const generateStudyTips = async (context) => {
    return {
      content: `💡 **Consejos de Estudio Personalizados**

**Para ${user?.name || 'Estudiante'}** - Técnicas adaptadas a tu estilo de aprendizaje:

**Técnica de Estudio Activo:**
• Subraya conceptos clave con colores diferentes
• Crea mapas mentales para temas complejos
• Explica el tema en voz alta como si fueras el profesor

**Gestión del Tiempo:**
• Técnica Pomodoro: 25 min estudio + 5 min descanso
• Establece metas diarias específicas
• Evita estudiar más de 2 horas seguidas

**Ambiente de Estudio:**
• Lugar fijo, bien iluminado y sin distracciones
• Mantén materiales organizados
• Usa música instrumental si te ayuda a concentrarte

**Memorización Efectiva:**
• Repasa el mismo día, a los 3 días y a la semana
• Usa acrónimos para listas
• Conecta nueva información con conocimientos previos`,
      recommendations: [
        "Crear un espacio de estudio dedicado",
        "Establecer rutina de estudio consistente",
        "Usar técnicas de repaso espaciado",
        "Practicar explicar conceptos en voz alta"
      ]
    };
  };

  const generateMotivation = async (context) => {
    return {
      content: `🌟 **Mensaje de Motivación y Apoyo**

¡Hola ${user?.name || 'Estudiante'}! 👋

**Recuerda que eres capaz de lograr grandes cosas.** Cada día de estudio es un paso más hacia tus metas.

**Logros Recientes:**
• Has mantenido una asistencia del 95%
• Mejoraste en 3 materias este mes
• Demuestras gran dedicación y esfuerzo

**Mensaje Inspirador:**
"El éxito no es la clave de la felicidad. La felicidad es la clave del éxito. Si amas lo que haces, tendrás éxito." - Albert Schweitzer

**Consejos para Mantener la Motivación:**
• Celebra cada pequeño logro
• Visualiza tus metas a largo plazo
• Recuerda por qué empezaste este camino
• Pide ayuda cuando la necesites

**Recuerda:**
• Los errores son oportunidades de aprendizaje
• Cada experto fue alguna vez un principiante
• Tu esfuerzo de hoy construye tu futuro de mañana`,
      recommendations: [
        "Establecer metas pequeñas y alcanzables",
        "Celebrar cada logro, por pequeño que sea",
        "Mantener una actitud positiva",
        "Buscar apoyo cuando sea necesario"
      ]
    };
  };

  // Funciones para Profesores
  const generateLessonPlan = async (context) => {
    return {
      content: `📝 **Plan de Clase Personalizado**

**Tema:** Matemáticas - Fracciones
**Duración:** 45 minutos
**Nivel:** 5to Grado

**Objetivos de Aprendizaje:**
• Identificar fracciones equivalentes
• Comparar fracciones con diferentes denominadores
• Resolver problemas con fracciones

**Actividades:**
1. **Inicio (10 min):** Repaso de fracciones básicas con ejemplos visuales
2. **Desarrollo (25 min):** Trabajo en grupos con material manipulativo
3. **Cierre (10 min):** Evaluación rápida y reflexión

**Materiales Necesarios:**
• Pizzas de papel para fracciones
• Tarjetas con fracciones
• Pizarra interactiva

**Evaluación:**
• Observación directa durante actividades
• Ejercicios prácticos en grupos
• Preguntas de reflexión`,
      recommendations: [
        "Preparar material manipulativo con anticipación",
        "Adaptar actividades según el ritmo de la clase",
        "Usar ejemplos del contexto de los estudiantes",
        "Incluir actividades de cierre efectivas"
      ]
    };
  };

  const analyzeStudents = async (context) => {
    return {
      content: `👥 **Análisis de Estudiantes - Clase 5to A**

**Resumen General:**
• Total de estudiantes: 28
• Asistencia promedio: 94%
• Rendimiento general: Bueno

**Estudiantes Destacados:**
• María González: Excelente en Matemáticas
• Carlos Ruiz: Líder natural, ayuda a compañeros
• Ana Torres: Muy creativa en proyectos

**Estudiantes que Necesitan Apoyo:**
• Luis Pérez: Dificultades en comprensión lectora
• Sofía Díaz: Necesita refuerzo en Matemáticas
• Diego Martín: Problemas de atención

**Recomendaciones por Estudiante:**
• Luis: Ejercicios de lectura guiada
• Sofía: Tutoría individual en Matemáticas
• Diego: Estrategias de concentración

**Estrategias de Diferenciación:**
• Grupos heterogéneos para trabajo colaborativo
• Materiales adaptados según necesidades
• Evaluaciones diferenciadas`,
      recommendations: [
        "Implementar tutorías individuales",
        "Crear grupos de apoyo entre pares",
        "Adaptar materiales según necesidades",
        "Mantener comunicación con padres"
      ]
    };
  };

  const generateActivities = async (context) => {
    return {
      content: `🎯 **Actividades Educativas Generadas**

**Tema:** Ecosistemas - Ciencias Naturales
**Nivel:** 4to Grado

**Actividad 1: "Exploradores del Bosque"**
• **Objetivo:** Identificar componentes de un ecosistema
• **Duración:** 30 minutos
• **Materiales:** Lupa, cuaderno, cámara
• **Procedimiento:** Salida al patio para observar ecosistema local

**Actividad 2: "Cadena Alimentaria en Acción"**
• **Objetivo:** Comprender relaciones tróficas
• **Duración:** 25 minutos
• **Materiales:** Tarjetas de animales, hilo
• **Procedimiento:** Crear cadena alimentaria con tarjetas

**Actividad 3: "Diseña tu Ecosistema"**
• **Objetivo:** Aplicar conocimientos creativamente
• **Duración:** 40 minutos
• **Materiales:** Cartulina, colores, recortes
• **Procedimiento:** Crear maqueta de ecosistema ideal

**Evaluación:**
• Rúbrica de observación
• Presentación oral de maquetas
• Reflexión escrita sobre aprendizajes`,
      recommendations: [
        "Adaptar actividades según recursos disponibles",
        "Incluir elementos de gamificación",
        "Fomentar trabajo colaborativo",
        "Evaluar proceso y producto"
      ]
    };
  };

  const generateAssessments = async (context) => {
    return {
      content: `📊 **Herramientas de Evaluación Generadas**

**Materia:** Lenguaje y Comunicación
**Tema:** Comprensión Lectora
**Nivel:** 6to Grado

**Rúbrica de Evaluación:**
• **Comprensión Literal (40%):** Identifica información explícita
• **Comprensión Inferencial (35%):** Extrae conclusiones
• **Comprensión Crítica (25%):** Evalúa y juzga contenido

**Instrumentos de Evaluación:**

**1. Prueba Escrita (60%):**
• 10 preguntas de selección múltiple
• 5 preguntas de desarrollo corto
• 1 pregunta de análisis profundo

**2. Proyecto Práctico (40%):**
• Crear resumen de texto leído
• Presentación oral de ideas principales
• Reflexión personal sobre el tema

**Criterios de Calificación:**
• Excelente (90-100): Demuestra comprensión profunda
• Bueno (80-89): Comprende conceptos principales
• Satisfactorio (70-79): Comprensión básica
• Necesita Mejora (0-69): Requiere refuerzo`,
      recommendations: [
        "Usar rúbricas claras y específicas",
        "Incluir diferentes tipos de evaluación",
        "Proporcionar retroalimentación constructiva",
        "Adaptar según necesidades individuales"
      ]
    };
  };

  // Funciones para Padres
  const viewChildProgress = async (context) => {
    return {
      content: `👨‍👩‍👧‍👦 **Progreso de tu Hijo/a - ${user?.name || 'Estudiante'}**

**Resumen Académico:**
• **Matemáticas:** 85% (Mejorando) 📈
• **Lenguaje:** 78% (Estable) ➡️
• **Ciencias:** 92% (Excelente) ⭐
• **Asistencia:** 96% (Muy buena) ✅

**Logros Destacados:**
• Mejoró significativamente en Matemáticas
• Participa activamente en clase
• Muestra buena actitud hacia el aprendizaje
• Ayuda a compañeros cuando puede

**Áreas de Oportunidad:**
• Velocidad de lectura
• Organización de tareas
• Concentración en actividades largas

**Recomendaciones para Casa:**
• Leer 20 minutos diarios en voz alta
• Establecer rutina de tareas fija
• Crear espacio de estudio sin distracciones
• Celebrar logros, por pequeños que sean

**Próximos Pasos:**
• Reunión con profesor de Lenguaje
• Implementar técnicas de concentración
• Continuar con el apoyo en Matemáticas`,
      recommendations: [
        "Establecer rutina de estudio en casa",
        "Leer juntos diariamente",
        "Mantener comunicación con profesores",
        "Celebrar todos los logros"
      ]
    };
  };

  const generateHomeSupport = async (context) => {
    return {
      content: `🏠 **Guía de Apoyo en Casa**

**Para ${user?.name || 'tu hijo/a'}** - Estrategias familiares efectivas:

**Ambiente de Estudio:**
• Lugar fijo, bien iluminado y silencioso
• Materiales organizados y accesibles
• Sin distracciones (TV, música, ruido)
• Horario consistente de estudio

**Técnicas de Apoyo:**
• **Preguntas Guía:** "¿Qué aprendiste hoy?"
• **Repaso Activo:** Que explique el tema en sus palabras
• **Ejemplos Prácticos:** Conectar con situaciones reales
• **Refuerzo Positivo:** Celebrar esfuerzos y logros

**Actividades Familiares Educativas:**
• Cocinar juntos (Matemáticas)
• Leer cuentos en voz alta (Lenguaje)
• Explorar la naturaleza (Ciencias)
• Jugar juegos de mesa (Lógica)

**Comunicación con la Escuela:**
• Reuniones regulares con profesores
• Preguntar sobre el progreso semanal
• Participar en actividades escolares
• Mantener contacto con otros padres`,
      recommendations: [
        "Crear rutina de estudio consistente",
        "Participar activamente en el aprendizaje",
        "Mantener comunicación con la escuela",
        "Fomentar la curiosidad y el amor por aprender"
      ]
    };
  };

  const generateCommunication = async (context) => {
    return {
      content: `📞 **Herramientas de Comunicación Escolar**

**Canales de Comunicación Disponibles:**
• **Plataforma Kary:** Mensajes directos con profesores
• **Reuniones Virtuales:** Videollamadas programadas
• **Reportes Semanales:** Actualizaciones automáticas
• **Grupo de Padres:** WhatsApp/Telegram del curso

**Temas Importantes a Comunicar:**
• Cambios en el comportamiento del niño/a
• Dificultades académicas específicas
• Situaciones familiares que afecten el aprendizaje
• Logros y avances notables

**Preguntas Efectivas para Profesores:**
• "¿Cómo puedo apoyar mejor en casa?"
• "¿Qué estrategias funcionan mejor con mi hijo/a?"
• "¿Hay áreas específicas que necesiten atención?"
• "¿Cómo puedo reforzar lo aprendido en clase?"

**Horarios de Disponibilidad:**
• **Lunes a Viernes:** 8:00 AM - 5:00 PM
• **Respuesta promedio:** 2-4 horas
• **Urgencias:** Contacto directo con coordinación`,
      recommendations: [
        "Mantener comunicación regular y proactiva",
        "Hacer preguntas específicas y constructivas",
        "Participar en reuniones y actividades",
        "Documentar conversaciones importantes"
      ]
    };
  };

  const generateFamilyResources = async (context) => {
    return {
      content: `📚 **Recursos Educativos Familiares**

**Recursos Digitales:**
• **Khan Academy Kids:** Matemáticas y ciencias divertidas
• **Duolingo:** Idiomas de forma gamificada
• **National Geographic Kids:** Exploración y ciencias
• **Storyline Online:** Cuentos narrados por actores

**Actividades Prácticas:**
• **Experimentos Caseros:** Ciencia en la cocina
• **Matemáticas Cotidianas:** Presupuestos, recetas, compras
• **Lectura Compartida:** Turnos para leer en voz alta
• **Proyectos Creativos:** Arte, manualidades, construcción

**Libros Recomendados por Edad:**
• **4-6 años:** "El Principito", "Donde viven los monstruos"
• **7-9 años:** "Matilda", "Charlie y la fábrica de chocolate"
• **10-12 años:** "Harry Potter", "Percy Jackson"

**Apps Educativas:**
• **Scratch Jr:** Programación básica
• **Google Earth:** Exploración del mundo
• **Minecraft Education:** Construcción y creatividad
• **Kahoot:** Juegos de preguntas y respuestas`,
      recommendations: [
        "Explorar recursos juntos como familia",
        "Adaptar actividades según intereses del niño/a",
        "Establecer tiempo de pantalla educativo",
        "Fomentar la curiosidad y exploración"
      ]
    };
  };

  // Funciones para Psicopedagogos
  const analyzeCases = async (context) => {
    return {
      content: `🔍 **Análisis de Caso Psicopedagógico**

**Estudiante:** Juan Pérez (8 años)
**Grado:** 3ro Básico
**Fecha de Evaluación:** ${new Date().toLocaleDateString()}

**Áreas Evaluadas:**
• **Cognitiva:** Procesamiento lento, dificultades de atención
• **Lenguaje:** Comprensión lectora limitada
• **Socioemocional:** Baja autoestima, retraimiento social
• **Motora:** Coordinación fina adecuada

**Diagnóstico Preliminar:**
• Posibles dificultades de aprendizaje específicas
• Necesita evaluación más profunda en lectura
• Requiere apoyo emocional y social

**Estrategias de Intervención:**
• **Académicas:** Adaptaciones curriculares, material visual
• **Emocionales:** Terapia de juego, refuerzo positivo
• **Sociales:** Grupos de apoyo, actividades colaborativas
• **Familiares:** Orientación a padres, seguimiento en casa

**Próximos Pasos:**
• Evaluación psicopedagógica completa
• Reunión con equipo docente
• Plan de apoyo individualizado
• Seguimiento mensual`,
      recommendations: [
        "Realizar evaluación psicopedagógica completa",
        "Implementar adaptaciones curriculares",
        "Trabajar en equipo con profesores y familia",
        "Monitorear progreso regularmente"
      ]
    };
  };

  const generateSupportPlans = async (context) => {
    return {
      content: `📋 **Plan de Apoyo Psicopedagógico**

**Estudiante:** María González (10 años)
**Grado:** 5to Básico
**Duración:** 6 meses

**Objetivos Generales:**
• Mejorar comprensión lectora
• Fortalecer autoestima y confianza
• Desarrollar estrategias de aprendizaje
• Integrar socialmente al grupo curso

**Intervenciones Específicas:**

**1. Área Académica:**
• Lectura guiada con material adaptado
• Técnicas de comprensión lectora
• Estrategias de memorización
• Evaluaciones diferenciadas

**2. Área Socioemocional:**
• Terapia de juego semanal
• Actividades de autoestima
• Habilidades sociales
• Manejo de emociones

**3. Área Familiar:**
• Orientación a padres
• Estrategias de apoyo en casa
• Comunicación con la escuela
• Seguimiento del progreso

**Cronograma:**
• **Lunes:** Lectura guiada (30 min)
• **Miércoles:** Terapia de juego (45 min)
• **Viernes:** Habilidades sociales (30 min)
• **Mensual:** Reunión con padres`,
      recommendations: [
        "Implementar intervenciones de forma sistemática",
        "Adaptar estrategias según respuesta del estudiante",
        "Mantener comunicación constante con la familia",
        "Evaluar progreso y ajustar plan según necesidades"
      ]
    };
  };

  const generateInterventions = async (context) => {
    return {
      content: `⚡ **Estrategias de Intervención Psicopedagógica**

**Caso:** Dificultades de Atención e Hiperactividad
**Edad:** 7 años
**Contexto:** Aula regular

**Estrategias Ambientales:**
• Ubicar al estudiante cerca del profesor
• Reducir estímulos visuales y auditivos
• Usar señalizaciones visuales claras
• Establecer rutinas predecibles

**Estrategias Académicas:**
• Dividir tareas en pasos pequeños
• Usar material manipulativo
• Permitir movimiento durante el aprendizaje
• Dar instrucciones claras y breves

**Estrategias Conductuales:**
• Refuerzo positivo inmediato
• Sistema de puntos/tokens
• Tiempo de descanso estructurado
• Contratos de comportamiento

**Estrategias de Autocontrol:**
• Técnicas de respiración
• Automonitoreo de comportamiento
• Estrategias de relajación
• Técnicas de concentración

**Colaboración con la Familia:**
• Orientación sobre el trastorno
• Estrategias de manejo en casa
• Rutinas y estructura familiar
• Comunicación con la escuela`,
      recommendations: [
        "Implementar estrategias de forma consistente",
        "Adaptar según las necesidades específicas",
        "Trabajar en equipo con todos los involucrados",
        "Evaluar efectividad y ajustar según resultados"
      ]
    };
  };

  const generateReports = async (context) => {
    return {
      content: `📄 **Reporte Psicopedagógico Especializado**

**Información General:**
• **Estudiante:** Ana Torres
• **Edad:** 9 años
• **Grado:** 4to Básico
• **Fecha:** ${new Date().toLocaleDateString()}
• **Evaluador:** Psicopedagogo/a

**Evaluación Realizada:**
• **WISC-V:** CI Total 95 (Rango Normal)
• **Test de Lectura:** Nivel 2do Básico
• **Evaluación Socioemocional:** Baja autoestima
• **Observación en Aula:** Dificultades de atención

**Conclusiones:**
• Dificultades específicas de aprendizaje en lectura
• Necesita apoyo psicopedagógico especializado
• Requiere adaptaciones curriculares
• Necesita fortalecimiento socioemocional

**Recomendaciones:**
• Implementar plan de apoyo individualizado
• Adaptaciones curriculares en lenguaje
• Apoyo psicopedagógico semanal
• Orientación familiar
• Seguimiento trimestral

**Próximos Pasos:**
• Reunión con equipo docente
• Elaboración de plan de apoyo
• Inicio de intervención
• Evaluación de progreso en 3 meses`,
      recommendations: [
        "Presentar reporte al equipo docente",
        "Elaborar plan de apoyo individualizado",
        "Iniciar intervención psicopedagógica",
        "Programar seguimiento regular"
      ]
    };
  };

  // Funciones para Directivos
  const viewInstitutionalMetrics = async (context) => {
    return {
      content: `📊 **Métricas Institucionales - ${new Date().getFullYear()}**

**Indicadores Académicos:**
• **Promedio General:** 7.2/10 (+0.3 vs año anterior)
• **Aprobación:** 94% (+2% vs año anterior)
• **Retención:** 98% (+1% vs año anterior)
• **Egreso:** 96% (Estable)

**Indicadores de Convivencia:**
• **Suspensiones:** 12 (-8 vs año anterior)
• **Reuniones de apoderados:** 89% asistencia
• **Proyectos de integración:** 15 activos
• **Clima escolar:** 8.5/10

**Indicadores de Recursos:**
• **Asistencia docente:** 97%
• **Capacitaciones realizadas:** 24
• **Recursos tecnológicos:** 85% utilización
• **Infraestructura:** 92% funcional

**Áreas de Mejora Identificadas:**
• Matemáticas en 7mo y 8vo básico
• Convivencia escolar en recreos
• Utilización de recursos tecnológicos
• Participación familiar en 1ro básico`,
      recommendations: [
        "Implementar plan de mejora en Matemáticas",
        "Fortalecer protocolos de convivencia",
        "Capacitar en uso de tecnología",
        "Desarrollar estrategias de participación familiar"
      ]
    };
  };

  const generateStrategicReports = async (context) => {
    return {
      content: `📈 **Reporte Estratégico Institucional**

**Período:** ${new Date().getFullYear()}
**Institución:** Colegio Kary
**Enfoque:** Análisis integral y proyecciones

**Logros Destacados:**
• Mejora del 15% en resultados SIMCE
• Implementación exitosa de programa de convivencia
• Aumento del 20% en participación familiar
• Modernización del 80% de la infraestructura

**Análisis FODA:**

**Fortalezas:**
• Equipo docente comprometido y capacitado
• Infraestructura moderna y adecuada
• Buena relación con la comunidad
• Proyectos innovadores en marcha

**Oportunidades:**
• Alianzas con universidades locales
• Fondos disponibles para proyectos
• Tecnología educativa emergente
• Red de apoyo interinstitucional

**Debilidades:**
• Dependencia de recursos externos
• Rotación de personal en áreas específicas
• Limitaciones en espacios deportivos
• Necesidad de actualización curricular

**Amenazas:**
• Cambios en políticas educativas
• Competencia de otros establecimientos
• Recursos limitados del estado
• Pandemia y sus efectos

**Recomendaciones Estratégicas:**
• Diversificar fuentes de financiamiento
• Fortalecer retención de personal clave
• Desarrollar propuesta educativa diferenciada
• Crear alianzas estratégicas sólidas`,
      recommendations: [
        "Implementar plan de diversificación de recursos",
        "Desarrollar programa de retención de talentos",
        "Crear propuesta educativa única",
        "Establecer alianzas estratégicas"
      ]
    };
  };

  const analyzeInstitutionalPerformance = async (context) => {
    return {
      content: `🎯 **Análisis de Rendimiento Institucional**

**Período de Análisis:** Últimos 3 años
**Metodología:** Análisis comparativo y tendencias

**Rendimiento Académico:**
• **Tendencia:** Crecimiento constante (+12% en 3 años)
• **Materias Destacadas:** Ciencias (95% aprobación)
• **Materias Críticas:** Matemáticas (78% aprobación)
• **Proyección:** Mantener crecimiento con enfoque en Matemáticas

**Rendimiento en Convivencia:**
• **Mejora Significativa:** -60% en conflictos graves
• **Programas Exitosos:** Mediación escolar, talleres de habilidades sociales
• **Áreas de Atención:** Ciberbullying, recreos
• **Proyección:** Implementar programa de ciudadanía digital

**Rendimiento en Gestión:**
• **Eficiencia Administrativa:** 92% (Excelente)
• **Gestión de Recursos:** 88% (Muy bueno)
• **Comunicación:** 85% (Bueno)
• **Proyección:** Digitalizar procesos administrativos

**Factores de Éxito:**
• Liderazgo pedagógico sólido
• Trabajo colaborativo del equipo
• Participación activa de la comunidad
• Uso efectivo de datos para toma de decisiones

**Oportunidades de Mejora:**
• Fortalecer áreas de bajo rendimiento
• Implementar tecnología educativa avanzada
• Desarrollar programas de innovación
• Crear cultura de mejora continua`,
      recommendations: [
        "Implementar plan específico para Matemáticas",
        "Desarrollar programa de ciudadanía digital",
        "Digitalizar procesos administrativos",
        "Crear cultura de innovación y mejora continua"
      ]
    };
  };

  const generateImprovementPlans = async (context) => {
    return {
      content: `🚀 **Plan de Mejora Institucional 2024-2026**

**Objetivo General:** Posicionar a la institución como referente en educación integral y de calidad

**Eje 1: Excelencia Académica**
• **Meta:** Aumentar promedio general a 7.5/10
• **Estrategias:**
  - Implementar metodologías activas
  - Fortalecer áreas de bajo rendimiento
  - Desarrollar talentos excepcionales
  - Crear sistema de tutorías

**Eje 2: Convivencia Escolar**
• **Meta:** Reducir conflictos en 50%
• **Estrategias:**
  - Programa de educación emocional
  - Mediación estudiantil
  - Talleres de resolución de conflictos
  - Espacios de diálogo y reflexión

**Eje 3: Innovación Pedagógica**
• **Meta:** 100% de docentes usando tecnología educativa
• **Estrategias:**
  - Capacitación continua en TIC
  - Laboratorio de innovación
  - Proyectos interdisciplinarios
  - Metodologías del siglo XXI

**Eje 4: Participación Comunitaria**
• **Meta:** 95% de participación familiar
• **Estrategias:**
  - Escuela para padres
  - Proyectos comunitarios
  - Comunicación digital efectiva
  - Eventos de integración

**Cronograma:**
• **Año 1:** Implementación y ajustes
• **Año 2:** Consolidación y expansión
• **Año 3:** Evaluación y proyección

**Recursos Necesarios:**
• Presupuesto: $50,000,000
• Personal: 3 profesionales adicionales
• Infraestructura: Laboratorio de innovación
• Tecnología: Equipamiento digital completo`,
      recommendations: [
        "Aprobar presupuesto y recursos necesarios",
        "Formar equipo de implementación",
        "Establecer cronograma detallado",
        "Crear sistema de monitoreo y evaluación"
      ]
    };
  };

  // Funciones Generales
  const getGeneralHelp = async (context) => {
    return {
      content: `❓ **Ayuda General - Plataforma Kary**

¡Hola ${user?.name || 'Usuario'}! 👋

**¿En qué puedo ayudarte hoy?**

**Funciones Disponibles:**
• **Navegación:** Te guío por las diferentes secciones
• **Funcionalidades:** Te explico cómo usar cada herramienta
• **Problemas Técnicos:** Te ayudo a resolver dificultades
• **Recursos:** Te muestro materiales y guías disponibles

**Preguntas Frecuentes:**
• ¿Cómo acceder a mis datos?
• ¿Dónde encuentro mis reportes?
• ¿Cómo configurar notificaciones?
• ¿Cómo contactar soporte técnico?

**Sugerencias de Uso:**
• Explora las diferentes secciones del menú
• Usa el buscador para encontrar información específica
• Revisa las notificaciones regularmente
• Participa en las actividades de la comunidad

**¿Qué te gustaría saber específicamente?**`,
      recommendations: [
        "Explorar las funcionalidades disponibles",
        "Revisar la guía de usuario",
        "Contactar soporte si es necesario",
        "Participar en la comunidad de usuarios"
      ]
    };
  };

  const exploreFeatures = async (context) => {
    return {
      content: `🔍 **Exploración de Funciones - Plataforma Kary**

**Para ${user?.name || 'Usuario'}** - Descubre todo lo que puedes hacer:

**Funciones Principales:**
• **Dashboard Personalizado:** Tu centro de control
• **Reportes y Análisis:** Datos detallados de tu área
• **Comunicación:** Mensajes y notificaciones
• **Recursos:** Materiales y herramientas educativas

**Funciones por Rol:**

**Si eres Estudiante:**
• Ver tu progreso académico
• Acceder a actividades personalizadas
• Comunicarte con profesores
• Participar en proyectos colaborativos

**Si eres Profesor:**
• Gestionar tu clase
• Crear actividades y evaluaciones
• Analizar el progreso de estudiantes
• Comunicarte con padres y colegas

**Si eres Padre/Madre:**
• Ver el progreso de tu hijo/a
• Comunicarte con la escuela
• Acceder a recursos familiares
• Participar en actividades escolares

**Si eres Directivo:**
• Ver métricas institucionales
• Generar reportes estratégicos
• Gestionar recursos y personal
• Tomar decisiones informadas

**¿Qué función te interesa explorar más?**`,
      recommendations: [
        "Explorar el dashboard principal",
        "Revisar las funciones específicas de tu rol",
        "Probar las herramientas de comunicación",
        "Descargar recursos disponibles"
      ]
    };
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
          className={`ai-assistant-modal bg-slate-900 border-2 border-slate-500 rounded-lg sm:rounded-xl shadow-2xl ${
            isExpanded 
              ? 'w-[99vw] h-[99vh] sm:w-[98vw] sm:h-[98vh] md:w-[95vw] md:h-[95vh]' 
              : 'w-[99vw] h-[99vh] sm:w-[98vw] sm:h-[98vh] md:w-[90vw] md:h-[90vh] lg:w-[85vw] lg:h-[85vh] xl:w-[80vw] xl:h-[80vh] 2xl:w-[75vw] 2xl:h-[75vh]'
          } flex flex-col`}
          style={{ backgroundColor: '#0f172a', opacity: 1, border: '2px solid #475569' }}
        >
          {/* Header */}
          <div className="ai-assistant-header flex items-center justify-between p-3 sm:p-4 border-b-2 border-slate-500 bg-slate-800" style={{ backgroundColor: '#1e293b', opacity: 1 }}>
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <div className="p-1.5 sm:p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex-shrink-0">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h2 className="text-base sm:text-lg font-semibold text-white truncate">
                  {t('dashboards.ai.assistantTitle')}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 truncate">
                  {aiStatus === 'ready' ? t('dashboards.ai.status.ready') : 
                   aiStatus === 'error' ? t('dashboards.ai.status.error') : 
                   t('dashboards.ai.status.loading')}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-white p-1 sm:p-2"
              >
                {isExpanded ? <Minimize2 className="w-3 h-3 sm:w-4 sm:h-4" /> : <Maximize2 className="w-3 h-3 sm:w-4 sm:h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-slate-400 hover:text-white p-1 sm:p-2"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col 2xl:flex-row overflow-hidden">
            {/* Sidebar - Capabilities - Ultra pequeña */}
            <div className="ai-assistant-sidebar w-full 2xl:w-1/6 border-r-0 2xl:border-r-2 border-slate-500 p-1 overflow-y-auto bg-slate-800" style={{ backgroundColor: '#1e293b', opacity: 1 }}>
              <h3 className="text-xs font-semibold text-slate-300 mb-1 px-1">
                {t('dashboards.ai.capabilities.title')}
              </h3>
              
              <div className="space-y-0.5">
                {aiCapabilities.map((capability) => (
                  <motion.div
                    key={capability.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`ai-assistant-capability-card cursor-pointer transition-all duration-200 hover:bg-slate-700 bg-slate-800 ${
                        currentCapability?.id === capability.id ? 'ring-1 ring-blue-500' : ''
                      }`}
                      style={{ backgroundColor: '#1e293b', opacity: 1, border: '1px solid #475569' }}
                      onClick={() => executeCapability(capability)}
                    >
                      <CardContent className="p-1">
                        <div className="flex items-center space-x-1">
                          <div className={`p-0.5 rounded ${capability.color} flex-shrink-0`}>
                            <capability.icon className="w-2.5 h-2.5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-xs font-medium text-white truncate">
                              {capability.title}
                            </h4>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Main Chat Area - Máximo espacio */}
            <div className="ai-assistant-main flex-1 flex flex-col bg-slate-900 w-full 2xl:w-5/6" style={{ backgroundColor: '#0f172a', opacity: 1 }}>
              {/* Messages */}
              <div className="flex-1 p-2 sm:p-3 lg:p-4 overflow-y-auto space-y-2 sm:space-y-3">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[90%] sm:max-w-[85%] md:max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                      <div className={`p-2 sm:p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'ai-assistant-user-message bg-blue-600 text-white' 
                          : 'ai-assistant-message bg-slate-800 text-slate-100'
                      }`} style={{ 
                        backgroundColor: message.type === 'user' ? '#1d4ed8' : '#1e293b', 
                        opacity: 1,
                        border: message.type === 'user' ? '1px solid #3b82f6' : '1px solid #475569'
                      }}>
                        <div className="text-xs sm:text-sm leading-relaxed whitespace-pre-line">
                          {message.content}
                        </div>
                        
                        {/* Sugerencias interactivas */}
                        {message.suggestions && message.suggestions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium text-slate-300">
                              💡 Sugerencias rápidas:
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {message.suggestions.map((suggestion, index) => (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs px-2 py-1 h-auto bg-slate-700 border-slate-500 text-slate-200 hover:bg-slate-600"
                                  onClick={() => setInputMessage(suggestion)}
                                >
                                  {suggestion}
                                </Button>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Recomendaciones */}
                        {message.recommendations && message.recommendations.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium text-slate-300">
                              📋 Recomendaciones:
                            </p>
                            <div className="space-y-1">
                              {message.recommendations.map((rec, index) => (
                                <div key={index} className="text-xs text-slate-400 flex items-start">
                                  <span className="mr-2">•</span>
                                  <span>{rec}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Acciones inmediatas */}
                        {message.actions && message.actions.length > 0 && (
                          <div className="mt-3 space-y-2">
                            <p className="text-xs font-medium text-slate-300">
                              ⚡ Acciones inmediatas:
                            </p>
                            <div className="space-y-1">
                              {message.actions.map((action, index) => (
                                <div key={index} className="text-xs text-slate-400 flex items-start">
                                  <span className="mr-2">→</span>
                                  <span>{action}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {/* Confianza */}
                        {message.confidence && (
                          <div className="mt-3">
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="text-xs bg-slate-600">
                                Confianza: {Math.round(message.confidence * 100)}%
                              </Badge>
                              {message.queryType && (
                                <Badge variant="outline" className="text-xs">
                                  {message.queryType}
                                </Badge>
                              )}
                            </div>
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
                    <div className="bg-slate-800 p-2 sm:p-3 rounded-lg border border-slate-600" style={{ backgroundColor: '#1e293b', opacity: 1 }}>
                      <div className="flex items-center space-x-2">
                        <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin text-blue-400" />
                        <span className="text-xs sm:text-sm text-slate-300">
                          {t('dashboards.ai.thinking')}...
                        </span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="ai-assistant-input-area border-t-2 border-slate-500 p-2 sm:p-3 lg:p-4 bg-slate-800" style={{ backgroundColor: '#1e293b', opacity: 1 }}>
                <div className="flex space-x-2 sm:space-x-3">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder={t('dashboards.ai.inputPlaceholder')}
                    className="flex-1 resize-none text-sm sm:text-base"
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
                    className="bg-blue-500 hover:bg-blue-600 p-2 sm:p-3 flex-shrink-0"
                    size="sm"
                  >
                    <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                  </Button>
                </div>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-2 gap-2">
                  <div className="flex space-x-1 sm:space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearConversation}
                      className="text-slate-400 hover:text-white text-xs px-2 py-1"
                    >
                      {t('dashboards.ai.clear')}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={exportConversation}
                      className="text-slate-400 hover:text-white text-xs px-2 py-1"
                    >
                      {t('dashboards.ai.export')}
                    </Button>
                  </div>
                  
                  <Badge variant="outline" className="text-xs px-2 py-1">
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

