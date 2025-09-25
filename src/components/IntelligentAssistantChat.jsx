import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Sparkles,
  Brain,
  MessageSquare,
  Zap,
  BookOpen,
  BarChart3,
  Target,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useMockAuth } from '../contexts/MockAuthContext';
import { generateSupportPlan } from '../services/geminiDashboardService';
import { piarService } from '../services/piarService';
import unifiedDataService from '../services/unifiedDataService';

const IntelligentAssistantChat = () => {
  const { t } = useLanguage();
  const { userProfile } = useMockAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Sugerencias rápidas basadas en el rol del usuario
  const getQuickSuggestions = () => {
    const role = userProfile?.role;
    
    const suggestions = {
      teacher: [
        { text: "Analizar el rendimiento de mi clase", icon: BarChart3, color: "blue" },
        { text: "Crear actividades personalizadas", icon: BookOpen, color: "green" },
        { text: "Revisar el progreso de estudiantes", icon: Target, color: "purple" },
        { text: "Generar reportes automáticos", icon: Zap, color: "orange" }
      ],
      psychopedagogue: [
        { text: "Analizar casos recientes", icon: Brain, color: "purple" },
        { text: "Generar planes de apoyo", icon: Target, color: "green" },
        { text: "Revisar tendencias emocionales", icon: AlertTriangle, color: "red" },
        { text: "Evaluar intervenciones", icon: CheckCircle, color: "blue" }
      ],
      directive: [
        { text: "Resumen estratégico institucional", icon: BarChart3, color: "blue" },
        { text: "Análisis de rendimiento general", icon: Target, color: "green" },
        { text: "Alertas predictivas", icon: AlertTriangle, color: "red" },
        { text: "Reportes de gestión", icon: Zap, color: "orange" }
      ],
      parent: [
        { text: "Progreso de mi hijo", icon: Target, color: "green" },
        { text: "Actividades recomendadas", icon: BookOpen, color: "blue" },
        { text: "Comunicación con profesores", icon: MessageSquare, color: "purple" },
        { text: "Seguimiento emocional", icon: Heart, color: "red" }
      ],
      student: [
        { text: "Ayuda con mis tareas", icon: BookOpen, color: "blue" },
        { text: "Actividades divertidas", icon: Sparkles, color: "green" },
        { text: "Mi progreso personal", icon: Target, color: "purple" },
        { text: "Recursos de aprendizaje", icon: Zap, color: "orange" }
      ]
    };

    return suggestions[role] || suggestions.teacher;
  };

  // Mensaje de bienvenida inicial
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      type: 'assistant',
      content: `¡Hola! Soy tu asistente de IA para enseñanza. ¿En qué puedo ayudarte hoy?`,
      timestamp: new Date(),
      suggestions: getQuickSuggestions()
    };
    setMessages([welcomeMessage]);
  }, [userProfile?.role]);

  // Scroll automático al final
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Manejar envío de mensaje
  const handleSendMessage = async (messageText = inputMessage) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: messageText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Generar respuesta con IA
      const response = await generateAIResponse(messageText, userProfile);
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions || [],
        actions: response.actions || []
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu solicitud. Por favor, inténtalo de nuevo.',
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
    }
  };

  // Generar respuesta con IA
  const generateAIResponse = async (message, userProfile) => {
    const role = userProfile?.role;
    const context = {
      role: role,
      user: userProfile?.full_name || 'Usuario',
      message: message,
      timestamp: new Date().toISOString()
    };

    // Obtener datos relevantes según el rol
    let relevantData = {};
    if (role === 'teacher') {
      relevantData = {
        students: unifiedDataService.getStudents().slice(0, 5),
        classPerformance: { averageScore: 85, totalStudents: 25 }
      };
    } else if (role === 'psychopedagogue') {
      relevantData = {
        cases: unifiedDataService.getStudents().slice(0, 3),
        trends: { emotionalAlerts: 5, activePlans: 12 }
      };
    }

    const prompt = `Eres KARY AI, el asistente educativo más avanzado del mundo. Responde como especialista en ${role}.

CONTEXTO:
- Usuario: ${userProfile?.full_name || 'Usuario'}
- Rol: ${role}
- Mensaje: ${message}
- Datos relevantes: ${JSON.stringify(relevantData)}

Responde de manera útil, profesional y específica para el rol ${role}. Incluye sugerencias de acciones si es apropiado.

Responde en español, máximo 3 párrafos, siendo conciso pero útil.`;

    try {
      const result = await generateSupportPlan(
        { full_name: userProfile?.full_name, role: role },
        {},
        { message: message, context: context }
      );

      if (result.success) {
        return {
          content: result.data.supportPlan || 'Entiendo tu consulta. Como tu asistente de IA, puedo ayudarte con análisis de datos, creación de actividades, planificación de lecciones y seguimiento de estudiantes. ¿En qué área específica te gustaría que te ayude?',
          suggestions: getQuickSuggestions().slice(0, 2),
          actions: []
        };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      // Respuesta de fallback
      return {
        content: 'Entiendo tu consulta. Como tu asistente de IA, puedo ayudarte con análisis de datos, creación de actividades, planificación de lecciones y seguimiento de estudiantes. ¿En qué área específica te gustaría que te ayude?',
        suggestions: getQuickSuggestions().slice(0, 2),
        actions: []
      };
    }
  };

  // Manejar sugerencia rápida
  const handleQuickSuggestion = (suggestion) => {
    setInputMessage(suggestion.text);
    handleSendMessage(suggestion.text);
  };

  // Manejar tecla Enter
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-slate-900 rounded-lg border border-slate-700">
      {/* Header */}
      <CardHeader className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-white/20 rounded-full">
            <Brain className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold">Asistente de IA Inteligente</CardTitle>
            <p className="text-sm text-white/80">Tu compañero de enseñanza con IA</p>
          </div>
          <div className="ml-auto flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
            <span className="text-xs">En línea</span>
          </div>
        </div>
      </CardHeader>

      {/* Chat Area */}
      <CardContent className="flex-1 p-0 flex flex-col">
        <ScrollArea className="flex-1 p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.type === 'assistant' && (
                    <div className="flex items-center space-x-2 mb-2">
                      <div className="p-1 bg-purple-600 rounded-full">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm text-slate-400">KARY AI</span>
                      <span className="text-xs text-slate-500">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                  
                  <div className={`p-3 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : message.isError 
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-slate-700 text-slate-200'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.type === 'user' && (
                    <div className="flex items-center justify-end space-x-2 mt-2">
                      <span className="text-xs text-slate-500">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      <div className="p-1 bg-blue-600 rounded-full">
                        <User className="w-4 h-4 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Sugerencias */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3">
                      <p className="text-xs text-slate-400 mb-2">Sugerencias:</p>
                      <div className="flex flex-wrap gap-2">
                        {message.suggestions.map((suggestion, index) => {
                          const Icon = suggestion.icon;
                          return (
                            <Button
                              key={index}
                              size="sm"
                              variant="outline"
                              className={`text-xs border-${suggestion.color}-300 text-${suggestion.color}-300 hover:bg-${suggestion.color}-500/20`}
                              onClick={() => handleQuickSuggestion(suggestion)}
                            >
                              <Icon className="w-3 h-3 mr-1" />
                              {suggestion.text}
                            </Button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Indicador de escritura */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="p-1 bg-purple-600 rounded-full">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex space-x-2">
            <Input
              ref={inputRef}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-slate-800 border-slate-600 text-slate-200 placeholder-slate-400 focus:border-purple-500"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </div>
  );
};

export default IntelligentAssistantChat;
