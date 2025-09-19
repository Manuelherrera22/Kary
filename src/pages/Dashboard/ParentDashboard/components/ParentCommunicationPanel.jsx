import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  MessageSquare, 
  Send, 
  Users, 
  Clock,
  User,
  CheckCircle,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  FileText,
  Heart,
  Brain,
  BookOpen,
  Target,
  Star,
  Bell,
  Eye,
  Reply
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import realTimeNotificationService from '@/services/realTimeNotificationService';
import unifiedDataService from '@/services/unifiedDataService';

const ParentCommunicationPanel = () => {
  const { t } = useLanguage();
  const [messages, setMessages] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [activeTab, setActiveTab] = useState('messages');
  const [newMessage, setNewMessage] = useState('');
  const [selectedContact, setSelectedContact] = useState('');
  const [messageType, setMessageType] = useState('general');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommunicationData();
  }, []);

  const loadCommunicationData = async () => {
    setLoading(true);
    try {
      // Cargar mensajes
      const messagesResult = await realTimeNotificationService.getNotifications('parent', {
        type: 'communication_message'
      });
      if (messagesResult.success) {
        setMessages(messagesResult.data);
      }

      // Cargar contactos (profesores y psicopedagogos)
      const contactsResult = await unifiedDataService.getTeachers();
      if (contactsResult.success) {
        const teachers = contactsResult.data.map(teacher => ({
          id: teacher.id,
          name: teacher.name,
          role: 'teacher',
          specialization: teacher.specialization,
          email: teacher.email,
          lastMessage: 'Hace 2 horas',
          unreadCount: 2
        }));

        const psychopedagogues = [
          {
            id: 'psycho-1',
            name: 'Dr. Luis Martínez',
            role: 'psychopedagogue',
            specialization: 'TDAH y Dificultades de Aprendizaje',
            email: 'luis.martinez@psicopedagogo.com',
            lastMessage: 'Hace 1 día',
            unreadCount: 1
          },
          {
            id: 'psycho-2',
            name: 'Dra. María García',
            role: 'psychopedagogue',
            specialization: 'Dislexia y Problemas de Lectura',
            email: 'maria.garcia@psicopedagogo.com',
            lastMessage: 'Hace 3 días',
            unreadCount: 0
          }
        ];

        setContacts([...teachers, ...psychopedagogues]);
      }

    } catch (error) {
      console.error('Error loading communication data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return;

    const message = {
      id: `msg-${Date.now()}`,
      contactId: selectedContact,
      senderId: 'parent',
      senderName: 'Ana Rodríguez',
      senderRole: 'parent',
      content: newMessage,
      type: messageType,
      timestamp: new Date().toISOString(),
      read: false
    };

    setMessages(prev => [message, ...prev]);
    setNewMessage('');

    // Notificar al contacto
    await realTimeNotificationService.createNotification({
      userId: selectedContact,
      type: 'communication_message',
      title: 'Nuevo mensaje de padre',
      message: `Ana Rodríguez: ${newMessage}`,
      data: { messageId: message.id, contactId: selectedContact }
    });
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'teacher': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'psychopedagogue': return 'text-purple-400 bg-purple-500/20 border-purple-500/30';
      case 'parent': return 'text-green-400 bg-green-500/20 border-green-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'teacher': return <BookOpen size={16} />;
      case 'psychopedagogue': return <Brain size={16} />;
      case 'parent': return <User size={16} />;
      default: return <MessageSquare size={16} />;
    }
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando comunicación...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30">
            <MessageSquare size={24} className="text-blue-400" />
          </div>
          <div>
            <CardTitle className="text-xl font-bold text-blue-300">
              Comunicación Directa
            </CardTitle>
            <p className="text-sm text-slate-400">
              Contacta con profesores y psicopedagogos
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Tabs de navegación */}
        <div className="flex space-x-1 bg-slate-700/30 rounded-lg p-1">
          {[
            { id: 'messages', label: 'Mensajes', icon: MessageSquare },
            { id: 'contacts', label: 'Contactos', icon: Users },
            { id: 'compose', label: 'Nuevo Mensaje', icon: Send }
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

        {/* Tab: Mensajes */}
        {activeTab === 'messages' && (
          <div className="space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <MessageSquare size={48} className="text-slate-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-slate-300 mb-2">No hay mensajes</h3>
                <p className="text-slate-400">Los mensajes aparecerán aquí cuando te comuniques con el personal</p>
              </div>
            ) : (
              messages.map((message) => (
                <Card key={message.id} className="bg-slate-700/30 border-slate-600/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-600/30 rounded-lg">
                        {getRoleIcon(message.senderRole)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge className={getRoleColor(message.senderRole)}>
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
              ))
            )}
          </div>
        )}

        {/* Tab: Contactos */}
        {activeTab === 'contacts' && (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <Card key={contact.id} className="bg-slate-700/30 border-slate-600/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-slate-600/30 rounded-lg">
                        {getRoleIcon(contact.role)}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-200">{contact.name}</h4>
                        <p className="text-sm text-slate-400 mb-1">{contact.specialization}</p>
                        <p className="text-xs text-slate-500">{contact.email}</p>
                        <p className="text-xs text-slate-500 mt-1">Último mensaje: {contact.lastMessage}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {contact.unreadCount > 0 && (
                        <Badge className="text-red-400 bg-red-500/20 border-red-500/30">
                          {contact.unreadCount}
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        onClick={() => {
                          setSelectedContact(contact.id);
                          setActiveTab('compose');
                        }}
                        className="bg-purple-600 hover:bg-purple-700 text-white"
                      >
                        <MessageSquare size={16} className="mr-1" />
                        Mensaje
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Tab: Nuevo Mensaje */}
        {activeTab === 'compose' && (
          <div className="space-y-4">
            <Card className="bg-slate-700/30 border-slate-600/30">
              <CardContent className="p-4">
                <h4 className="font-semibold text-slate-200 mb-3">Enviar Mensaje</h4>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Select value={selectedContact} onValueChange={setSelectedContact}>
                      <SelectTrigger className="bg-slate-800 border-slate-600 text-slate-200">
                        <SelectValue placeholder="Seleccionar contacto" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {contacts.map((contact) => (
                          <SelectItem key={contact.id} value={contact.id}>
                            {contact.name} ({contact.role === 'teacher' ? 'Profesor' : 'Psicopedagogo'})
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
                        <SelectItem value="academic">Académico</SelectItem>
                        <SelectItem value="emotional">Emocional</SelectItem>
                        <SelectItem value="behavioral">Comportamental</SelectItem>
                        <SelectItem value="appointment">Cita</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe tu mensaje aquí..."
                    className="bg-slate-800 border-slate-600 text-slate-200"
                    rows={4}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !selectedContact}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Send size={16} className="mr-2" />
                    Enviar Mensaje
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParentCommunicationPanel;

