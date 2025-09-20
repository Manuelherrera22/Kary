import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles, Heart, Brain, MessageSquare, Mic, MicOff } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

const SmartKaryChat = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [karyMood, setKaryMood] = useState('happy');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mensajes iniciales de Kary
  useEffect(() => {
    const initialMessages = [
      {
        id: 1,
        type: 'kary',
        message: '¡Hola! Soy Kary, tu asistente de aprendizaje. ¿Cómo te sientes hoy?',
        timestamp: new Date(),
        mood: 'happy'
      },
      {
        id: 2,
        type: 'kary',
        message: 'Recuerda que estoy aquí para ayudarte con tus estudios y emociones. ¡Puedes contarme lo que quieras!',
        timestamp: new Date(),
        mood: 'encouraging'
      }
    ];
    setMessages(initialMessages);
  }, []);

  const karyResponses = {
    happy: [
      "¡Qué bueno verte tan contento! Ese ánimo positivo te ayudará mucho en tus estudios.",
      "Me encanta verte así de motivado. ¡Sigamos aprovechando esa energía!",
      "¡Excelente! Cuando te sientes bien, todo es más fácil de aprender."
    ],
    sad: [
      "Entiendo que te sientas así. Es normal tener días difíciles. ¿Quieres contarme qué te preocupa?",
      "No estás solo. Estoy aquí para escucharte y ayudarte a sentirte mejor.",
      "A veces necesitamos un momento para procesar nuestras emociones. Tómate tu tiempo."
    ],
    stressed: [
      "Veo que estás un poco estresado. ¿Te gustaría que te ayude con técnicas de relajación?",
      "El estrés es normal, pero podemos manejarlo juntos. ¿Qué te está preocupando?",
      "Respira profundo. Podemos dividir las tareas en pasos más pequeños y manejables."
    ],
    confused: [
      "No te preocupes por la confusión. Es parte del proceso de aprendizaje. ¿En qué puedo ayudarte?",
      "La confusión es el primer paso hacia la comprensión. ¡Vamos a resolver esto juntos!",
      "Es normal sentirse confundido. Explícame qué no entiendes y te ayudo a aclararlo."
    ],
    proud: [
      "¡Me siento muy orgulloso de ti! Has trabajado duro y se nota.",
      "¡Increíble! Tu dedicación está dando frutos. ¡Sigue así!",
      "¡Qué logro tan impresionante! Eres un ejemplo de perseverancia y esfuerzo."
    ]
  };

  const getKaryMood = (message) => {
    const lowerMessage = message.toLowerCase();
    if (lowerMessage.includes('triste') || lowerMessage.includes('mal') || lowerMessage.includes('deprimido')) {
      return 'sad';
    } else if (lowerMessage.includes('estresado') || lowerMessage.includes('ansioso') || lowerMessage.includes('nervioso')) {
      return 'stressed';
    } else if (lowerMessage.includes('confundido') || lowerMessage.includes('no entiendo') || lowerMessage.includes('duda')) {
      return 'confused';
    } else if (lowerMessage.includes('orgulloso') || lowerMessage.includes('logré') || lowerMessage.includes('completé')) {
      return 'proud';
    }
    return 'happy';
  };

  const getKaryResponse = (mood) => {
    const responses = karyResponses[mood] || karyResponses.happy;
    return responses[Math.floor(Math.random() * responses.length)];
  };

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

    // Simular respuesta de Kary
    setTimeout(() => {
      const mood = getKaryMood(inputMessage);
      setKaryMood(mood);
      
      const karyMessage = {
        id: Date.now() + 1,
        type: 'kary',
        message: getKaryResponse(mood),
        timestamp: new Date(),
        mood: mood
      };

      setMessages(prev => [...prev, karyMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getMoodIcon = (mood) => {
    switch (mood) {
      case 'happy': return <Heart className="text-pink-400" size={16} />;
      case 'sad': return <Heart className="text-blue-400" size={16} />;
      case 'stressed': return <Brain className="text-orange-400" size={16} />;
      case 'confused': return <MessageSquare className="text-yellow-400" size={16} />;
      case 'proud': return <Sparkles className="text-purple-400" size={16} />;
      default: return <Heart className="text-pink-400" size={16} />;
    }
  };

  const getMoodColor = (mood) => {
    switch (mood) {
      case 'happy': return 'from-pink-500/20 to-rose-500/20 border-pink-500/30';
      case 'sad': return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'stressed': return 'from-orange-500/20 to-red-500/20 border-orange-500/30';
      case 'confused': return 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30';
      case 'proud': return 'from-purple-500/20 to-violet-500/20 border-purple-500/30';
      default: return 'from-pink-500/20 to-rose-500/20 border-pink-500/30';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl overflow-hidden h-[500px] flex flex-col">
        <CardHeader className="pb-4 border-b border-slate-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
                <Bot size={20} className="text-purple-400" />
              </div>
              <div>
                <CardTitle className="text-lg font-bold text-purple-300">
                  {t('studentDashboard.karyChat.title', 'Chat con Kary')}
                </CardTitle>
                <p className="text-sm text-slate-400">
                  {t('studentDashboard.karyChat.subtitle', 'Tu asistente de aprendizaje emocional')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getMoodIcon(karyMood)}
              <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                {t('studentDashboard.karyChat.online', 'En línea')}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
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
                        : `bg-gradient-to-br ${getMoodColor(message.mood)}`
                    }`}>
                      {message.type === 'user' ? (
                        <User size={16} className="text-blue-400" />
                      ) : (
                        <Bot size={16} className="text-purple-400" />
                      )}
                    </div>
                    <div className={`p-3 rounded-2xl ${
                      message.type === 'user'
                        ? 'bg-blue-500/20 border border-blue-500/30'
                        : `bg-gradient-to-br ${getMoodColor(message.mood)}`
                    }`}>
                      <p className="text-sm text-slate-200">{message.message}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
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
                  <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full border border-purple-500/30">
                    <Bot size={16} className="text-purple-400" />
                  </div>
                  <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Área de entrada */}
          <div className="p-4 border-t border-slate-700/50">
            <div className="flex items-center gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={t('studentDashboard.karyChat.placeholder', 'Escribe tu mensaje...')}
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

export default SmartKaryChat;



