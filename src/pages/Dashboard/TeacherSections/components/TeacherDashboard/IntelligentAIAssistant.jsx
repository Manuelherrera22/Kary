import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Lightbulb, 
  BookOpen, 
  Users, 
  Target, 
  TrendingUp,
  MessageSquare,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Clock,
  Star
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const IntelligentAIAssistant = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [aiMode, setAiMode] = useState('teaching'); // teaching, analytics, planning

  // Mensajes iniciales del asistente
  useEffect(() => {
    const initialMessages = [
      {
        id: 1,
        type: 'ai',
        message: '¡Hola! Soy tu asistente de IA para enseñanza. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date(),
        suggestions: [
          'Analizar el rendimiento de la clase',
          'Crear actividades personalizadas',
          'Revisar el progreso de estudiantes',
          'Generar reportes automáticos'
        ]
      }
    ];
    setMessages(initialMessages);
  }, []);

  // Sugerencias contextuales basadas en el modo
  useEffect(() => {
    const modeSuggestions = {
      teaching: [
        '¿Cómo puedo mejorar la participación en clase?',
        'Sugiere actividades para estudiantes con dificultades',
        '¿Qué recursos son más efectivos para matemáticas?',
        'Ayúdame a planificar la próxima lección'
      ],
      analytics: [
        'Analiza el rendimiento de María García',
        '¿Cuáles son las tendencias de la clase?',
        'Genera un reporte de progreso semanal',
        'Identifica estudiantes que necesitan apoyo'
      ],
      planning: [
        'Crea un plan de estudios para esta semana',
        'Sugiere actividades para diferentes niveles',
        '¿Cómo estructurar una lección de ciencias?',
        'Planifica evaluaciones para el mes'
      ]
    };

    setSuggestions(modeSuggestions[aiMode] || []);
  }, [aiMode]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simular respuesta de IA
    setTimeout(() => {
      const aiResponse = generateAIResponse(inputMessage, aiMode);
      const aiMessage = {
        id: Date.now() + 1,
        type: 'ai',
        message: aiResponse.message,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions || [],
        actions: aiResponse.actions || []
      };

      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const generateAIResponse = (message, mode) => {
    const lowerMessage = message.toLowerCase();
    
    // Respuestas basadas en el contexto
    if (lowerMessage.includes('rendimiento') || lowerMessage.includes('analizar')) {
      return {
        message: "Basándome en los datos actuales, veo que el rendimiento general de la clase es del 87%. María García y Ana López están destacando, mientras que Luis Martínez podría beneficiarse de apoyo adicional. ¿Te gustaría que profundice en algún estudiante específico?",
        suggestions: [
          "Ver detalles de María García",
          "Analizar el progreso de Luis Martínez",
          "Generar reporte completo de la clase"
        ],
        actions: [
          { label: "Ver Analytics", icon: TrendingUp },
          { label: "Generar Reporte", icon: BookOpen }
        ]
      };
    }
    
    if (lowerMessage.includes('actividad') || lowerMessage.includes('ejercicio')) {
      return {
        message: "Perfecto, puedo ayudarte a crear actividades personalizadas. Basándome en el nivel de la clase, te sugiero actividades interactivas que combinen teoría y práctica. ¿Qué materia específica te interesa?",
        suggestions: [
          "Actividades de matemáticas",
          "Ejercicios de ciencias",
          "Proyectos de lenguaje",
          "Actividades grupales"
        ],
        actions: [
          { label: "Crear Actividad", icon: Target },
          { label: "Ver Plantillas", icon: BookOpen }
        ]
      };
    }
    
    if (lowerMessage.includes('estudiante') || lowerMessage.includes('alumno')) {
      return {
        message: "Entiendo que quieres enfocarte en estudiantes específicos. Puedo ayudarte a analizar el progreso individual, identificar necesidades de apoyo y sugerir estrategias personalizadas. ¿Hay algún estudiante en particular que te preocupe?",
        suggestions: [
          "Analizar todos los estudiantes",
          "Ver estudiantes con bajo rendimiento",
          "Revisar estudiantes destacados",
          "Generar reportes individuales"
        ],
        actions: [
          { label: "Ver Estudiantes", icon: Users },
          { label: "Análisis Individual", icon: TrendingUp }
        ]
      };
    }

    // Respuesta genérica
    return {
      message: "Entiendo tu consulta. Como tu asistente de IA, puedo ayudarte con análisis de datos, creación de actividades, planificación de lecciones y seguimiento de estudiantes. ¿En qué área específica te gustaría que te ayude?",
      suggestions: [
        "Análisis de rendimiento",
        "Creación de actividades",
        "Planificación de lecciones",
        "Seguimiento de estudiantes"
      ]
    };
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  const handleModeChange = (mode) => {
    setAiMode(mode);
    setMessages(prev => [...prev, {
      id: Date.now(),
      type: 'ai',
      message: `Cambiando a modo ${mode}. ¿En qué puedo ayudarte en este contexto?`,
      timestamp: new Date()
    }]);
  };

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'teaching': return <BookOpen size={16} />;
      case 'analytics': return <TrendingUp size={16} />;
      case 'planning': return <Target size={16} />;
      default: return <Bot size={16} />;
    }
  };

  const getModeColor = (mode) => {
    switch (mode) {
      case 'teaching': return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'analytics': return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
      case 'planning': return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      default: return 'from-gray-500/20 to-slate-500/20 border-gray-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl h-[600px] flex flex-col">
        <CardHeader className="pb-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                <Bot size={20} className="text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-purple-300">
                  {t('teacherDashboard.aiAssistant.title', 'Asistente de IA Inteligente')}
                </CardTitle>
                <p className="text-sm text-slate-400">
                  {t('teacherDashboard.aiAssistant.subtitle', 'Tu compañero de enseñanza con IA')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                <CheckCircle size={12} className="mr-1" />
                {t('teacherDashboard.aiAssistant.online', 'En línea')}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          {/* Modos de IA */}
          <div className="p-4 border-b border-slate-700/50">
            <div className="flex gap-2">
              {['teaching', 'analytics', 'planning'].map((mode) => (
                <Button
                  key={mode}
                  variant={aiMode === mode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleModeChange(mode)}
                  className={`text-xs ${aiMode === mode ? 'bg-purple-600 hover:bg-purple-700' : ''}`}
                >
                  {getModeIcon(mode)}
                  <span className="ml-1">{t(`teacherDashboard.aiAssistant.modes.${mode}`, mode)}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Área de mensajes */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-3 max-w-[80%] ${
                    message.type === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <div className={`p-2 rounded-full ${
                      message.type === 'user' 
                        ? 'bg-blue-500/20 border border-blue-500/30' 
                        : `bg-gradient-to-br ${getModeColor(aiMode)} border`
                    }`}>
                      {message.type === 'user' ? (
                        <MessageSquare size={16} className="text-blue-400" />
                      ) : (
                        <Bot size={16} className="text-purple-400" />
                      )}
                    </div>
                    <div className={`p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-blue-500/20 border border-blue-500/30'
                        : `bg-gradient-to-br ${getModeColor(aiMode)} border`
                    }`}>
                      <p className="text-sm text-slate-200">{message.message}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                      
                      {/* Sugerencias de IA */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-slate-400">Sugerencias:</p>
                          <div className="flex flex-wrap gap-2">
                            {message.suggestions.map((suggestion, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="text-xs bg-slate-700/50 border-slate-600 hover:bg-slate-600"
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Acciones de IA */}
                      {message.actions && message.actions.length > 0 && (
                        <div className="mt-3 space-y-2">
                          <p className="text-xs text-slate-400">Acciones:</p>
                          <div className="flex flex-wrap gap-2">
                            {message.actions.map((action, index) => {
                              const Icon = action.icon;
                              return (
                                <Button
                                  key={index}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs bg-slate-700/50 border-slate-600 hover:bg-slate-600"
                                >
                                  <Icon size={12} className="mr-1" />
                                  {action.label}
                                </Button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full bg-gradient-to-br ${getModeColor(aiMode)} border`}>
                    <Bot size={16} className="text-purple-400" />
                  </div>
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${getModeColor(aiMode)} border`}>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Sugerencias rápidas */}
          {suggestions.length > 0 && (
            <div className="p-4 border-t border-slate-700/50">
              <p className="text-xs text-slate-400 mb-2">Sugerencias rápidas:</p>
              <div className="flex flex-wrap gap-2">
                {suggestions.slice(0, 3).map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs bg-slate-700/50 border-slate-600 hover:bg-slate-600"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Área de entrada */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder={t('teacherDashboard.aiAssistant.placeholder', 'Escribe tu consulta...')}
                className="flex-1 bg-slate-800 border-slate-600 text-slate-200 placeholder:text-slate-400"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsListening(!isListening)}
                className={`p-2 ${isListening ? 'text-red-400' : 'text-slate-400'}`}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-purple-600 hover:bg-purple-700 text-white p-2"
              >
                <Send size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default IntelligentAIAssistant;



