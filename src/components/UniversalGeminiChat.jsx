import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { useMockAuth } from '@/contexts/MockAuthContext';
import geminiDashboardService from '@/services/geminiDashboardService';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Loader2,
  Minimize2,
  Maximize2,
  Settings,
  Brain,
  BookOpen,
  Users,
  Shield,
  GraduationCap
} from 'lucide-react';

const UniversalGeminiChat = ({ 
  userRole = 'teacher',
  context = {},
  isOpen, 
  onClose, 
  onMinimize,
  isMinimized = false,
  position = 'bottom-right' // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
}) => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { userProfile } = useMockAuth();
  
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Configuración por rol
  const roleConfig = {
    teacher: {
      icon: GraduationCap,
      title: 'Kary - Asistente del Profesor',
      subtitle: 'Tu asistente educativo especializado',
      color: 'from-blue-600 to-indigo-600',
      quickQuestions: [
        "¿Cómo puedo mejorar el rendimiento de mi clase?",
        "¿Qué estrategias recomiendas para estudiantes con dificultades?",
        "¿Cómo puedo hacer mis clases más interactivas?",
        "¿Qué actividades sugieres para esta materia?"
      ]
    },
    student: {
      icon: BookOpen,
      title: 'Kary - Tu Tutor Personal',
      subtitle: 'Tu asistente de aprendizaje personalizado',
      color: 'from-green-600 to-teal-600',
      quickQuestions: [
        "¿Cómo puedo mejorar en esta materia?",
        "¿Tienes alguna pista para mi actividad?",
        "¿Qué estrategias de estudio me recomiendas?",
        "¿Cómo puedo mantenerme motivado?"
      ]
    },
    parent: {
      icon: Users,
      title: 'Kary - Asistente Familiar',
      subtitle: 'Tu consejero educativo familiar',
      color: 'from-purple-600 to-pink-600',
      quickQuestions: [
        "¿Cómo está progresando mi hijo?",
        "¿Qué puedo hacer para apoyarlo en casa?",
        "¿Cómo puedo motivarlo para estudiar?",
        "¿Qué actividades recomiendas para el hogar?"
      ]
    },
    psychopedagogue: {
      icon: Brain,
      title: 'Kary - Asistente Psicopedagógico',
      subtitle: 'Tu asistente especializado en necesidades educativas',
      color: 'from-orange-600 to-red-600',
      quickQuestions: [
        "¿Qué estrategias recomiendas para este caso?",
        "¿Cómo puedo evaluar el progreso del estudiante?",
        "¿Qué adaptaciones sugieres?",
        "¿Cómo puedo colaborar mejor con los profesores?"
      ]
    },
    admin: {
      icon: Shield,
      title: 'Kary - Asistente Administrativo',
      subtitle: 'Tu asistente de gestión educativa',
      color: 'from-gray-600 to-slate-600',
      quickQuestions: [
        "¿Cómo está el rendimiento general de la institución?",
        "¿Qué áreas necesitan más recursos?",
        "¿Qué tendencias observas en los datos?",
        "¿Qué recomendaciones tienes para mejorar?"
      ]
    }
  };

  const config = roleConfig[userRole] || roleConfig.teacher;
  const IconComponent = config.icon;

  // Mensaje inicial cuando se abre el chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessages = {
        teacher: `¡Hola ${userProfile?.full_name || 'Profesor'}! Soy Kary, tu asistente educativo. Estoy aquí para ayudarte con estrategias de enseñanza, análisis de rendimiento y cualquier consulta sobre tu clase. ¿En qué puedo asistirte hoy?`,
        student: `¡Hola ${userProfile?.full_name || 'Estudiante'}! Soy Kary, tu tutor personal. Puedo ayudarte con tus estudios, darte pistas para tus actividades y motivarte en tu aprendizaje. ¿Qué te gustaría saber?`,
        parent: `¡Hola ${userProfile?.full_name || 'Padre/Madre'}! Soy Kary, tu asistente familiar educativo. Te ayudo a entender el progreso de tu hijo y te doy consejos para apoyarlo en casa. ¿Cómo puedo ayudarte?`,
        psychopedagogue: `¡Hola ${userProfile?.full_name || 'Psicopedagogo'}! Soy Kary, tu asistente especializado. Te ayudo con análisis de casos, estrategias de intervención y colaboración educativa. ¿En qué caso trabajamos hoy?`,
        admin: `¡Hola ${userProfile?.full_name || 'Administrador'}! Soy Kary, tu asistente de gestión educativa. Te ayudo a analizar datos institucionales, identificar tendencias y tomar decisiones informadas. ¿Qué necesitas revisar?`
      };

      const welcomeMessage = {
        id: 'welcome',
        type: 'assistant',
        content: welcomeMessages[userRole] || welcomeMessages.teacher,
        timestamp: new Date().toISOString(),
        isWelcome: true
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, userProfile, userRole]);

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus en el input cuando se abre
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen, isMinimized]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      const response = await geminiDashboardService.chatWithContext(
        inputMessage.trim(),
        userRole,
        context,
        userProfile
      );

      if (response.success) {
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: response.data.message,
          timestamp: response.data.timestamp,
          context: response.data.context,
          isDemo: response.data.isDemo || false,
          suggestions: response.data.suggestions || []
        };

        // Simular tiempo de escritura
        setTimeout(() => {
          setMessages(prev => [...prev, assistantMessage]);
          setIsTyping(false);
          setIsLoading(false);
        }, 1000);
      } else {
        throw new Error(response.error);
      }
    } catch (error) {
      console.error('Error en chat con Gemini:', error);
      
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'Lo siento, no puedo responder en este momento. ¿Podrías intentar de nuevo?',
        timestamp: new Date().toISOString(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
      setIsLoading(false);
      
      toast({
        title: 'Error de Conexión',
        description: 'No se pudo conectar con Kary. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      default:
        return 'bottom-4 right-4';
    }
  };

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className={`fixed ${getPositionClasses()} z-50`}>
        <Button
          onClick={() => onMinimize(false)}
          className={`rounded-full w-14 h-14 bg-gradient-to-r ${config.color} hover:opacity-90 text-white shadow-lg`}
        >
          <IconComponent className="w-6 h-6" />
        </Button>
        {messages.length > 1 && (
          <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
            {messages.length - 1}
          </Badge>
        )}
      </div>
    );
  }

  return (
    <div className={`fixed ${getPositionClasses()} z-50 w-96 h-[500px]`}>
      <Card 
        className="h-full flex flex-col border-2 border-blue-500/30 shadow-2xl"
        style={{
          backgroundColor: '#1e293b',
          opacity: 1,
          background: '#1e293b'
        }}
      >
        {/* Header */}
        <CardHeader className={`pb-3 bg-gradient-to-r ${config.color} rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <IconComponent className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">{config.title}</CardTitle>
                <p className="text-white/80 text-sm">
                  {config.subtitle}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onMinimize(true)}
                className="text-white/80 hover:text-white hover:bg-white/20"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white/80 hover:text-white hover:bg-white/20"
              >
                ✕
              </Button>
            </div>
          </div>
        </CardHeader>

        {/* Messages */}
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.type === 'user'
                    ? 'bg-blue-600 text-white'
                    : message.isError
                    ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                    : message.isDemo
                    ? 'bg-yellow-600/20 border border-yellow-600/30 text-yellow-100'
                    : 'bg-slate-700 text-white'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="flex items-center mb-2">
                    <Bot className="w-4 h-4 mr-2 text-blue-400" />
                    <span className="text-xs text-gray-400">Kary</span>
                    {message.isDemo && (
                      <span className="ml-2 text-xs bg-yellow-600/30 text-yellow-200 px-2 py-1 rounded">
                        Modo Demo
                      </span>
                    )}
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                
                {/* Mostrar sugerencias si es un mensaje de demo */}
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <p className="text-xs font-medium text-yellow-200">💡 Sugerencias:</p>
                    <ul className="text-xs space-y-1">
                      {message.suggestions.map((suggestion, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-yellow-400 mr-2">•</span>
                          <span className="text-yellow-100">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <span className="text-xs opacity-75 mt-1 block">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-slate-700 text-white rounded-lg p-3 max-w-[80%]">
                <div className="flex items-center mb-2">
                  <Bot className="w-4 h-4 mr-2 text-blue-400" />
                  <span className="text-xs text-gray-400">Kary está escribiendo...</span>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </CardContent>

        {/* Quick Questions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-gray-400 mb-2">Preguntas sugeridas:</p>
            <div className="flex flex-wrap gap-1">
              {config.quickQuestions.slice(0, 2).map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickQuestion(question)}
                  className="text-xs h-6 text-gray-300 border-gray-600 hover:bg-slate-600"
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Pregúntale a Kary sobre ${userRole === 'teacher' ? 'tu clase' : userRole === 'student' ? 'tus estudios' : userRole === 'parent' ? 'tu hijo' : userRole === 'psychopedagogue' ? 'tus casos' : 'tu institución'}...`}
              disabled={isLoading}
              className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-400">
              Presiona Enter para enviar
            </p>
            <div className="flex items-center text-xs text-gray-400">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by Gemini AI
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UniversalGeminiChat;
