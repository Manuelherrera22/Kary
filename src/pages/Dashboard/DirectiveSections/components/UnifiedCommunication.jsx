import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, Users, Send, Phone, Video, Mail, 
  Calendar, Clock, CheckCircle, AlertCircle, 
  User, UserCheck, UserX, Bell, Settings,
  Search, Filter, MoreVertical, Reply, Forward
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
// Avatar component inline to avoid import issues
const Avatar = ({ className, children, ...props }) => (
  <div
    className={`relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ${className || ''}`}
    {...props}
  >
    {children}
  </div>
);

const AvatarImage = ({ className, src, alt, ...props }) => (
  <img
    src={src}
    alt={alt}
    className={`aspect-square h-full w-full object-cover ${className || ''}`}
    {...props}
  />
);

const AvatarFallback = ({ className, children, ...props }) => (
  <div
    className={`flex h-full w-full items-center justify-center rounded-full bg-slate-700 text-slate-300 font-medium ${className || ''}`}
    {...props}
  >
    {children}
  </div>
);

const CommunicationCard = ({ communication, index }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'sent': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'delivered': return <CheckCircle className="w-4 h-4 text-blue-400" />;
      case 'read': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-400" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <MessageSquare className="w-4 h-4" />;
      case 'call': return <Phone className="w-4 h-4" />;
      case 'video': return <Video className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      case 'low': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Hace un momento';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes} min`;
    if (diffInMinutes < 1440) return `Hace ${Math.floor(diffInMinutes / 60)}h`;
    return date.toLocaleDateString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group"
    >
      <Card className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 border-slate-700/60 hover:border-slate-600/80 transition-all duration-300 group-hover:shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={communication.avatar} />
              <AvatarFallback className="bg-slate-700 text-slate-300">
                {communication.sender.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-slate-200 group-hover:text-white transition-colors">
                    {communication.sender}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className={`${getPriorityColor(communication.priority)} text-xs`}
                  >
                    {communication.priority.toUpperCase()}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(communication.status)}
                  <span className="text-xs text-slate-500">
                    {formatTime(communication.timestamp)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <div className={`p-1 rounded ${getPriorityColor(communication.priority).split(' ')[1]}`}>
                  {getTypeIcon(communication.type)}
                </div>
                <span className="text-sm text-slate-400">
                  {communication.subject}
                </span>
              </div>
              
              <p className="text-sm text-slate-300 mb-3 line-clamp-2">
                {communication.message}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="text-xs border-slate-600">
                    {communication.role}
                  </Badge>
                  {communication.attachments && (
                    <Badge variant="outline" className="text-xs border-slate-600">
                      {communication.attachments} archivos
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Reply className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Forward className="w-3 h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const UnifiedCommunication = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');

  const communications = [
    {
      id: 1,
      sender: 'Ana Rodríguez',
      role: 'Acudiente',
      subject: 'Consulta sobre progreso de María',
      message: 'Buenos días, me gustaría conocer más detalles sobre el progreso académico de mi hija María en matemáticas...',
      type: 'email',
      priority: 'medium',
      status: 'read',
      timestamp: new Date().toISOString(),
      avatar: null,
      attachments: 2
    },
    {
      id: 2,
      sender: 'Prof. Carlos López',
      role: 'Docente',
      subject: 'Reporte semanal 5to Grado',
      message: 'Adjunto el reporte semanal con las observaciones de los estudiantes y recomendaciones...',
      type: 'email',
      priority: 'high',
      status: 'delivered',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      avatar: null,
      attachments: 1
    },
    {
      id: 3,
      sender: 'Psic. María González',
      role: 'Psicopedagoga',
      subject: 'Alerta emocional - Estudiante en riesgo',
      message: 'He detectado patrones preocupantes en el comportamiento de un estudiante que requiere atención inmediata...',
      type: 'sms',
      priority: 'urgent',
      status: 'sent',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      avatar: null,
      attachments: 0
    },
    {
      id: 4,
      sender: 'Dr. Roberto Silva',
      role: 'Director',
      subject: 'Reunión de coordinación',
      message: 'Necesitamos programar una reunión para revisar los indicadores del mes y planificar las próximas acciones...',
      type: 'meeting',
      priority: 'high',
      status: 'pending',
      timestamp: new Date(Date.now() - 14400000).toISOString(),
      avatar: null,
      attachments: 0
    }
  ];

  const filteredCommunications = communications.filter(comm => {
    const matchesTab = activeTab === 'all' || comm.priority === activeTab;
    const matchesSearch = comm.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         comm.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const tabs = [
    { id: 'all', label: 'Todas', count: communications.length },
    { id: 'urgent', label: 'Urgentes', count: communications.filter(c => c.priority === 'urgent').length },
    { id: 'high', label: 'Altas', count: communications.filter(c => c.priority === 'high').length },
    { id: 'medium', label: 'Medias', count: communications.filter(c => c.priority === 'medium').length },
    { id: 'low', label: 'Bajas', count: communications.filter(c => c.priority === 'low').length }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Comunicación Unificada
          </h2>
          <p className="text-slate-400 mt-1">
            Centro de comunicación integrado con todos los actores del ecosistema educativo
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Send className="w-4 h-4 mr-2" />
            Nueva Comunicación
          </Button>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex space-x-1 bg-slate-800/50 rounded-lg p-1">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-slate-700 text-slate-400'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <Badge variant="secondary" className="ml-2 text-xs">
                  {tab.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
        
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
          <Input
            placeholder="Buscar comunicaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-slate-800/50 border-slate-700"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {filteredCommunications.map((communication, index) => (
              <CommunicationCard key={communication.id} communication={communication} index={index} />
            ))}
          </AnimatePresence>
        </div>

        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/60">
            <CardHeader>
              <CardTitle className="text-lg text-slate-200 flex items-center">
                <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                Mensaje Rápido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Destinatario
                </label>
                <Input 
                  placeholder="Seleccionar destinatario..."
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Asunto
                </label>
                <Input 
                  placeholder="Asunto del mensaje..."
                  className="bg-slate-800/50 border-slate-700"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-slate-300 mb-2 block">
                  Mensaje
                </label>
                <Textarea 
                  placeholder="Escribe tu mensaje aquí..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 min-h-[100px]"
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <Send className="w-4 h-4 mr-2" />
                Enviar Mensaje
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/60">
            <CardHeader>
              <CardTitle className="text-lg text-slate-200 flex items-center">
                <Users className="w-5 h-5 mr-2 text-green-400" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-300">Ana Rodríguez en línea</p>
                    <p className="text-xs text-slate-500">Acudiente</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-300">Prof. Carlos López</p>
                    <p className="text-xs text-slate-500">Última actividad: 5 min</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-300">Psic. María González</p>
                    <p className="text-xs text-slate-500">Última actividad: 1 hora</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UnifiedCommunication;
