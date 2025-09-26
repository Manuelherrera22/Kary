import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Users, 
  Calendar,
  Clock,
  Send,
  Smile,
  Heart,
  Star,
  Target,
  BookOpen,
  CheckCircle
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import studentCommunicationService from '@/services/studentCommunicationService';

const StudentCommunicationPanel = () => {
  const { t } = useLanguage();
  const { user } = useMockAuth();
  const [communications, setCommunications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('messages'); // messages, teachers, parents, support

  useEffect(() => {
    const fetchCommunications = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const result = await studentCommunicationService.getStudentCommunications(user.id);
        if (result.success) {
          setCommunications(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching communications:', error);
        // Datos mock para desarrollo
        setCommunications([
          {
            id: 1,
            type: 'teacher_message',
            sender: 'Prof. María González',
            senderRole: 'teacher',
            subject: 'Nueva actividad de matemáticas',
            message: 'Hola! Te he asignado una nueva actividad de matemáticas. Recuerda revisar las instrucciones cuidadosamente.',
            timestamp: new Date().toISOString(),
            read: false,
            priority: 'medium',
            attachments: []
          },
          {
            id: 2,
            type: 'parent_message',
            sender: 'Mamá',
            senderRole: 'parent',
            subject: '¡Muy bien!',
            message: 'Estoy muy orgullosa de tu progreso esta semana. ¡Sigue así!',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: true,
            priority: 'low',
            attachments: []
          },
          {
            id: 3,
            type: 'support_message',
            sender: 'Psicopedagoga Ana',
            senderRole: 'psychopedagogue',
            subject: 'Seguimiento semanal',
            message: 'Hola! Quería saber cómo te sientes con las actividades de esta semana. ¿Hay algo en lo que necesites ayuda?',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            read: false,
            priority: 'high',
            attachments: []
          },
          {
            id: 4,
            type: 'system_notification',
            sender: 'Sistema Kary',
            senderRole: 'system',
            subject: 'Recordatorio de actividad',
            message: 'Tienes una actividad pendiente que vence mañana. ¡No olvides completarla!',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            read: false,
            priority: 'urgent',
            attachments: []
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunications();
  }, [user?.id]);

  const filteredCommunications = communications.filter(comm => {
    switch (activeTab) {
      case 'messages':
        return comm.type === 'teacher_message' || comm.type === 'parent_message';
      case 'teachers':
        return comm.senderRole === 'teacher';
      case 'parents':
        return comm.senderRole === 'parent';
      case 'support':
        return comm.senderRole === 'psychopedagogue' || comm.senderRole === 'system';
      default:
        return true;
    }
  });

  const markAsRead = async (communicationId) => {
    try {
      const result = await studentCommunicationService.markAsRead(communicationId);
      if (result.success) {
        setCommunications(prev => prev.map(comm => 
          comm.id === communicationId 
            ? { ...comm, read: true }
            : comm
        ));
      }
    } catch (error) {
      console.error('Error marking communication as read:', error);
    }
  };

  const getSenderIcon = (senderRole) => {
    switch (senderRole) {
      case 'teacher': return <BookOpen className="w-4 h-4 text-blue-400" />;
      case 'parent': return <Heart className="w-4 h-4 text-pink-400" />;
      case 'psychopedagogue': return <Target className="w-4 h-4 text-green-400" />;
      case 'system': return <Star className="w-4 h-4 text-purple-400" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-400';
      case 'high': return 'text-orange-400';
      case 'medium': return 'text-blue-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const commTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - commTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const unreadCount = communications.filter(c => !c.read).length;

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/60">
        <CardHeader>
          <CardTitle className="text-xl text-purple-300">💬 Comunicación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/60">
      <CardHeader>
        <CardTitle className="text-xl text-purple-300 flex items-center gap-2">
          💬 Comunicación
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} sin leer
            </Badge>
          )}
        </CardTitle>
        
        {/* Tabs */}
        <div className="flex gap-2 mt-4">
          {[
            { key: 'messages', label: 'Mensajes', icon: MessageSquare },
            { key: 'teachers', label: 'Profesores', icon: BookOpen },
            { key: 'parents', label: 'Familia', icon: Heart },
            { key: 'support', label: 'Apoyo', icon: Target }
          ].map(tab => (
            <Button
              key={tab.key}
              variant={activeTab === tab.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab.key)}
              className="text-xs flex items-center gap-1"
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {filteredCommunications.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay comunicaciones {activeTab === 'messages' ? '' : activeTab}</p>
            </div>
          ) : (
            filteredCommunications.map((communication) => (
              <motion.div
                key={communication.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border-2 ${
                  communication.read 
                    ? 'bg-slate-700/30 border-slate-600/30' 
                    : 'bg-purple-500/20 border-purple-500/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    {getSenderIcon(communication.senderRole)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className={`font-semibold ${communication.read ? 'text-slate-400' : 'text-white'}`}>
                        {communication.sender}
                      </h4>
                      <Badge variant="outline" className={`text-xs ${getPriorityColor(communication.priority)}`}>
                        {communication.priority}
                      </Badge>
                      {!communication.read && (
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                      )}
                    </div>
                    
                    <h5 className={`font-medium mb-2 ${communication.read ? 'text-slate-500' : 'text-purple-200'}`}>
                      {communication.subject}
                    </h5>
                    
                    <p className={`text-sm mb-3 ${communication.read ? 'text-slate-500' : 'text-slate-300'}`}>
                      {communication.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {getTimeAgo(communication.timestamp)}
                      </div>
                      
                      <div className="flex gap-2">
                        {!communication.read && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => markAsRead(communication.id)}
                            className="text-xs"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Leída
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {/* Responder */}}
                          className="text-xs"
                        >
                          <Send className="w-3 h-3 mr-1" />
                          Responder
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentCommunicationPanel;
