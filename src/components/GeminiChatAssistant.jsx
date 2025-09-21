import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { chatWithGemini } from '@/services/geminiActivityService';
import { 
  MessageCircle, 
  Send, 
  Bot, 
  User, 
  Sparkles,
  Loader2,
  Minimize2,
  Maximize2,
  Settings
} from 'lucide-react';

const GeminiChatAssistant = ({ 
  isOpen, 
  onClose, 
  context = {}, 
  onMinimize,
  isMinimized = false 
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

  // Mensaje inicial cuando se abre el chat
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: 'welcome',
        type: 'assistant',
        content: `¡Hola ${userProfile?.full_name || 'estudiante'}! Soy Kary, tu asistente educativo personal. ¿En qué puedo ayudarte con tu actividad de ${context.subject || 'hoy'}?`,
        timestamp: new Date().toISOString(),
        isWelcome: true
      };
      setMessages([welcomeMessage]);
    }
  }, [isOpen, userProfile, context.subject]);

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
      const response = await chatWithGemini(
        inputMessage.trim(),
        context,
        userProfile
      );

      if (response.success) {
        const assistantMessage = {
          id: Date.now() + 1,
          type: 'assistant',
          content: response.data.message,
          timestamp: response.data.timestamp,
          context: response.data.context
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

  const quickQuestions = [
    "¿Puedes explicarme esto de otra manera?",
    "¿Tienes alguna pista para ayudarme?",
    "¿Estoy en el camino correcto?",
    "¿Qué debo hacer a continuación?"
  ];

  if (!isOpen) return null;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => onMinimize(false)}
          className="rounded-full w-14 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
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
    <div className="fixed bottom-4 right-4 z-50 w-96 h-[500px]">
      <Card 
        className="h-full flex flex-col border-2 border-blue-500/30 shadow-2xl"
        style={{
          backgroundColor: '#1e293b',
          opacity: 1,
          background: '#1e293b'
        }}
      >
        {/* Header */}
        <CardHeader className="pb-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-3">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-lg">Kary Assistant</CardTitle>
                <p className="text-white/80 text-sm">
                  {context.subject ? `Ayuda con ${context.subject}` : 'Tu asistente educativo'}
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
                    : 'bg-slate-700 text-white'
                }`}
              >
                {message.type === 'assistant' && (
                  <div className="flex items-center mb-2">
                    <Bot className="w-4 h-4 mr-2 text-blue-400" />
                    <span className="text-xs text-gray-400">Kary</span>
                  </div>
                )}
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
            <p className="text-xs text-gray-400 mb-2">Preguntas rápidas:</p>
            <div className="flex flex-wrap gap-1">
              {quickQuestions.slice(0, 2).map((question, index) => (
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
              placeholder="Pregúntale a Kary..."
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

export default GeminiChatAssistant;
