import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
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
  Heart
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useMockAuth } from '../contexts/MockAuthContext';
import { generateSupportPlan } from '../services/geminiDashboardService';

const ResponsiveAssistantChat = () => {
  const { t } = useLanguage();
  const { userProfile } = useMockAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Sugerencias rápidas basadas en el rol
  const getQuickSuggestions = () => {
    const role = userProfile?.role;
    
    const suggestions = {
      teacher: [
        { text: "Analizar rendimiento de clase", icon: BarChart3 },
        { text: "Crear actividades", icon: BookOpen },
        { text: "Revisar progreso", icon: Target },
        { text: "Generar reportes", icon: Zap }
      ],
      psychopedagogue: [
        { text: "Analizar casos", icon: Brain },
        { text: "Generar planes", icon: Target },
        { text: "Tendencias emocionales", icon: AlertTriangle },
        { text: "Evaluar intervenciones", icon: CheckCircle }
      ],
      directive: [
        { text: "Resumen estratégico", icon: BarChart3 },
        { text: "Análisis general", icon: Target },
        { text: "Alertas predictivas", icon: AlertTriangle },
        { text: "Reportes gestión", icon: Zap }
      ],
      parent: [
        { text: "Progreso de mi hijo", icon: Target },
        { text: "Actividades recomendadas", icon: BookOpen },
        { text: "Comunicación", icon: MessageSquare },
        { text: "Seguimiento emocional", icon: Heart }
      ],
      student: [
        { text: "Ayuda con tareas", icon: BookOpen },
        { text: "Actividades divertidas", icon: Sparkles },
        { text: "Mi progreso", icon: Target },
        { text: "Recursos", icon: Zap }
      ]
    };

    return suggestions[role] || suggestions.teacher;
  };

  // Mensaje de bienvenida
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

  // Scroll automático
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Enviar mensaje
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

    try {
      const response = await generateAIResponse(messageText, userProfile);
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: response.content,
        timestamp: new Date(),
        suggestions: response.suggestions || []
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

    const prompt = `Eres KARY AI, el asistente educativo más avanzado del mundo. Responde como especialista en ${role}.

CONTEXTO:
- Usuario: ${userProfile?.full_name || 'Usuario'}
- Rol: ${role}
- Mensaje: ${message}

Responde de manera útil, profesional y específica para el rol ${role}. Incluye sugerencias de acciones si es apropiado.

Responde en español, máximo 2 párrafos, siendo conciso pero útil.`;

    try {
      const result = await generateSupportPlan(
        { full_name: userProfile?.full_name, role: role },
        {},
        { message: message, context: context }
      );

      if (result.success) {
        return {
          content: result.data.supportPlan || 'Entiendo tu consulta. Como tu asistente de IA, puedo ayudarte con análisis de datos, creación de actividades, planificación de lecciones y seguimiento de estudiantes. ¿En qué área específica te gustaría que te ayude?',
          suggestions: getQuickSuggestions().slice(0, 2)
        };
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      return {
        content: 'Entiendo tu consulta. Como tu asistente de IA, puedo ayudarte con análisis de datos, creación de actividades, planificación de lecciones y seguimiento de estudiantes. ¿En qué área específica te gustaría que te ayude?',
        suggestions: getQuickSuggestions().slice(0, 2)
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
    <div className="w-full h-[400px] bg-slate-900 rounded-lg border border-slate-700 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-3 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="p-1 bg-white/20 rounded-full">
            <Brain className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold">Asistente de IA Inteligente</h3>
            <p className="text-xs text-white/80">Tu compañero de enseñanza con IA</p>
          </div>
          <div className="ml-auto flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
            <span className="text-xs">En línea</span>
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        <ScrollArea className="flex-1 p-3">
          <div className="space-y-3">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  {message.type === 'assistant' && (
                    <div className="flex items-center space-x-1 mb-1">
                      <div className="p-0.5 bg-purple-600 rounded-full">
                        <Bot className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs text-slate-400">KARY AI</span>
                      <span className="text-xs text-slate-500">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  )}
                  
                  <div className={`p-2 rounded-lg text-sm ${
                    message.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : message.isError 
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : 'bg-slate-700 text-slate-200'
                  }`}>
                    <p className="whitespace-pre-wrap">{message.content}</p>
                  </div>

                  {message.type === 'user' && (
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      <span className="text-xs text-slate-500">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      <div className="p-0.5 bg-blue-600 rounded-full">
                        <User className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  )}

                  {/* Sugerencias */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs text-slate-400 mb-1">Sugerencias:</p>
                      <div className="flex flex-wrap gap-1">
                        {message.suggestions.map((suggestion, index) => {
                          const Icon = suggestion.icon;
                          return (
                            <Button
                              key={index}
                              size="sm"
                              variant="outline"
                              className="text-xs h-6 px-2 border-purple-300 text-purple-300 hover:bg-purple-500/20"
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

            {/* Indicador de carga */}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-2">
                  <div className="p-0.5 bg-purple-600 rounded-full">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="p-3 border-t border-slate-700">
          <div className="flex space-x-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu mensaje..."
              className="flex-1 bg-slate-800 border-slate-600 text-slate-200 placeholder-slate-400 focus:border-purple-500 text-sm h-8"
              disabled={isLoading}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isLoading}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white h-8 px-3"
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Send className="w-3 h-3" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponsiveAssistantChat;
