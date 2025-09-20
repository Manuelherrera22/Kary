import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Users, 
  MessageSquare, 
  FileText, 
  Calendar,
  Clock,
  User,
  Send,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
  Brain,
  Target,
  Heart,
  BookOpen,
  BarChart3
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import unifiedDataService from '@/services/unifiedDataService';
import realTimeNotificationService from '@/services/realTimeNotificationService';

const InterdisciplinaryCollaborationPanel = () => {
  const { t } = useLanguage();
  const [collaborations, setCollaborations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [newMessage, setNewMessage] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('');
  const [messageType, setMessageType] = useState('general');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCollaborationData();
  }, []);

  const loadCollaborationData = async () => {
    setLoading(true);
    try {
      // Cargar colaboraciones existentes
      const collaborationsResult = await unifiedDataService.getAssignments();
      if (collaborationsResult.success) {
        setCollaborations(collaborationsResult.data);
      }

      // Cargar mensajes de colaboración
      const messagesResult = await realTimeNotificationService.getNotifications('psychopedagogue', {
        type: 'collaboration_message'
      });
      if (messagesResult.success) {
        setMessages(messagesResult.data);
      }

    } catch (error) {
      console.error('Error loading collaboration data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockData = () => {
    const mockCollaborations = [
      {
        id: 'collab-1',
        studentId: 'student-1',
        studentName: 'María García',
        teacherId: 'teacher-1',
        teacherName: 'Prof. María Rodríguez',
        psychopedagogueId: 'psycho-1',
        psychopedagogueName: 'Dr. Luis Martínez',
        type: 'academic_support',
        status: 'active',
        lastUpdate: new Date().toISOString(),
        priority: 'high',
        description: 'Seguimiento conjunto para TDAH y dificultades de lectura'
      },
      {
        id: 'collab-2',
        studentId: 'student-2',
        studentName: 'Carlos López',
        teacherId: 'teacher-1',
        teacherName: 'Prof. María Rodríguez',
        psychopedagogueId: 'psycho-2',
        psychopedagogueName: 'Dra. María García',
        type: 'emotional_support',
        status: 'active',
        lastUpdate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        description: 'Apoyo emocional y académico para dislexia'
      }
    ];

    const mockMessages = [
      {
        id: 'msg-1',
        collaborationId: 'collab-1',
        senderId: 'teacher-1',
        senderName: 'Prof. María Rodríguez',
        senderRole: 'teacher',
        content: 'María ha mostrado mejoras significativas en su concentración durante las actividades matutinas.',
        type: 'progress_update',
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: 'msg-2',
        collaborationId: 'collab-1',
        senderId: 'psycho-1',
        senderName: 'Dr. Luis Martínez',
        senderRole: 'psychopedagogue',
        content: 'Excelente. Continuemos con las técnicas de mindfulness que implementamos.',
        type: 'recommendation',
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        read: true
      },
      {
        id: 'msg-3',
        collaborationId: 'collab-2',
        senderId: 'psycho-2',
        senderName: 'Dra. María García',
        senderRole: 'psychopedagogue',
        content: 'Carlos necesita apoyo adicional en matemáticas. ¿Podemos coordinar una sesión?',
        type: 'coordination',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        read: false
      }
    ];

    setCollaborations(mockCollaborations);
    setMessages(mockMessages);
    setLoading(false);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedStudent) return;

    const message = {
      id: `msg-${Date.now()}`,
      collaborationId: `collab-${selectedStudent}`,
      senderId: 'psycho-1',
      senderName: 'Dr. Luis Martínez',
      senderRole: 'psychopedagogue',
      content: newMessage,
      type: messageType,
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages(prev => [message, ...prev]);
    setNewMessage('');

    // Notificar a otros participantes
    await realTimeNotificationService.createNotification({
      userId: `teacher-${selectedStudent}`,
      type: 'collaboration_message',
      title: 'Nuevo mensaje de colaboración',
      message: `Dr. Luis Martínez: ${newMessage}`,
      data: { messageId: message.id, collaborationId: message.collaborationId }
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getMessageTypeIcon = (type) => {
    switch (type) {
      case 'progress_update': return <TrendingUp size={16} className="text-green-400" />;
      case 'recommendation': return <Brain size={16} className="text-purple-400" />;
      case 'coordination': return <Users size={16} className="text-blue-400" />;
      case 'alert': return <AlertCircle size={16} className="text-red-400" />;
      default: return <MessageSquare size={16} className="text-gray-400" />;
    }
  };

  const getSenderRoleColor = (role) => {
    switch (role) {
      case 'teacher': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'psychopedagogue': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'student': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando colaboraciones...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
            <Users size={24} className="text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-blue-300">
              Colaboración Interdisciplinaria
            </CardTitle>
            <p className="text-sm text-slate-400">
              Comunicación coordinada entre psicopedagogo, profesor y estudiante
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tabs de navegación */}
        <div className="flex space-x-1 bg-slate-700/30 rounded-lg p-1">
          {[
            { id: 'overview', label: 'Resumen', icon: BarChart3 },
            { id: 'collaborations', label: 'Colaboraciones', icon: Users },
            { id: 'messages', label: 'Mensajes', icon: MessageSquare },
            { id: 'coordination', label: 'Coordinación', icon: Calendar }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab: Resumen */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-slate-700/30 border-slate-600/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Users size={24} className="text-blue-400" />
                  <div>
                    <h4 className="font-semibold text-slate-200">Colaboraciones Activas</h4>
                    <p className="text-2xl font-bold text-blue-400">{collaborations.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/30 border-slate-600/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <MessageSquare size={24} className="text-green-400" />
                  <div>
                    <h4 className="font-semibold text-slate-200">Mensajes Recientes</h4>
                    <p className="text-2xl font-bold text-green-400">{messages.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-700/30 border-slate-600/30">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Target size={24} className="text-purple-400" />
                  <div>
                    <h4 className="font-semibold text-slate-200">Casos Prioritarios</h4>
                    <p className="text-2xl font-bold text-purple-400">
                      {collaborations.filter(c => c.priority === 'high').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tab: Colaboraciones */}
        {activeTab === 'collaborations' && (
          <div className="space-y-4">
            {collaborations.map((collaboration) => (
              <Card key={collaboration.id} className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-semibold text-slate-200">{collaboration.studentName}</h4>
                        <Badge className={getPriorityColor(collaboration.priority)}>
                          {collaboration.priority}
                        </Badge>
                        <Badge className="text-green-400 bg-green-500/20 border-green-500/30">
                          {collaboration.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">{collaboration.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <User size={12} />
                          {collaboration.teacherName}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(collaboration.lastUpdate).toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                        <Eye size={16} />
                      </Button>
                      <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                        <MessageSquare size={16} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tab: Mensajes */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {/* Formulario de nuevo mensaje */}
            <Card className="bg-slate-700/30 border-slate-600/30">
              <CardContent className="p-4">
                <h4 className="font-semibold text-slate-200 mb-3">Enviar Mensaje</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-200">
                        <SelectValue placeholder="Seleccionar estudiante" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {collaborations.map((collab) => (
                          <SelectItem key={collab.studentId} value={collab.studentId}>
                            {collab.studentName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={messageType} onValueChange={setMessageType}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-200">
                        <SelectValue placeholder="Tipo de mensaje" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="progress_update">Actualización de Progreso</SelectItem>
                        <SelectItem value="recommendation">Recomendación</SelectItem>
                        <SelectItem value="coordination">Coordinación</SelectItem>
                        <SelectItem value="alert">Alerta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe tu mensaje aquí..."
                    className="bg-slate-800 border-slate-600 text-slate-200"
                    rows={3}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !selectedStudent}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Send size={16} className="mr-2" />
                    Enviar Mensaje
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Lista de mensajes */}
            <div className="space-y-3">
              {messages.map((message) => (
                <Card key={message.id} className="bg-slate-700/30 border-slate-600/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-600/30 rounded-lg">
                        {getMessageTypeIcon(message.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getSenderRoleColor(message.senderRole)}>
                            {message.senderName}
                          </Badge>
                          <Badge className="text-xs text-slate-400 bg-slate-600/30">
                            {message.type}
                          </Badge>
                          <span className="text-xs text-slate-500">
                            {new Date(message.timestamp).toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300">{message.content}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Tab: Coordinación */}
        {activeTab === 'coordination' && (
          <div className="space-y-4">
            <Card className="bg-slate-700/30 border-slate-600/30">
              <CardContent className="p-4">
                <h4 className="font-semibold text-slate-200 mb-3">Próximas Reuniones</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-600/30 rounded-lg">
                    <Calendar size={20} className="text-blue-400" />
                    <div className="flex-1">
                      <h5 className="font-medium text-slate-200">Reunión de Seguimiento - María García</h5>
                      <p className="text-sm text-slate-400">Mañana 10:00 AM - Sala de Reuniones</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                      <Eye size={16} />
                    </Button>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-600/30 rounded-lg">
                    <Calendar size={20} className="text-green-400" />
                    <div className="flex-1">
                      <h5 className="font-medium text-slate-200">Evaluación Trimestral - Carlos López</h5>
                      <p className="text-sm text-slate-400">Viernes 2:00 PM - Virtual</p>
                    </div>
                    <Button size="sm" variant="outline" className="text-slate-300 border-slate-600">
                      <Eye size={16} />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default InterdisciplinaryCollaborationPanel;

