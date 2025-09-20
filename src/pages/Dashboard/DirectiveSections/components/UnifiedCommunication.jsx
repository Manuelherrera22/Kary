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
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start space-x-2 sm:space-x-3">
            <Avatar className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0">
              <AvatarImage src={communication.avatar} />
              <AvatarFallback className="bg-slate-700 text-slate-300 text-xs sm:text-sm">
                {communication.sender.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                <div className="flex items-center space-x-2 min-w-0">
                  <h4 className="font-medium text-sm sm:text-base text-slate-200 group-hover:text-white transition-colors truncate">
                    {communication.sender}
                  </h4>
                  <Badge 
                    variant="outline" 
                    className={`${getPriorityColor(communication.priority)} text-xs flex-shrink-0`}
                  >
                    <span className="hidden sm:inline">{communication.priority.toUpperCase()}</span>
                    <span className="sm:hidden">{communication.priority.substr(0,3).toUpperCase()}</span>
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  {React.cloneElement(getStatusIcon(communication.status), { className: "w-3 h-3 sm:w-4 sm:h-4" })}
                  <span className="text-xs text-slate-500">
                    {formatTime(communication.timestamp)}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 mb-2">
                <div className={`p-0.5 sm:p-1 rounded ${getPriorityColor(communication.priority).split(' ')[1]}`}>
                  {React.cloneElement(getTypeIcon(communication.type), { className: "w-3 h-3 sm:w-4 sm:h-4" })}
                </div>
                <span className="text-xs sm:text-sm text-slate-400 truncate">
                  {communication.subject}
                </span>
              </div>
              
              <p className="text-xs sm:text-sm text-slate-300 mb-3 line-clamp-2 leading-relaxed">
                {communication.message}
              </p>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center space-x-2 flex-wrap">
                  <Badge variant="outline" className="text-xs border-slate-600">
                    {communication.role}
                  </Badge>
                  {communication.attachments && (
                    <Badge variant="outline" className="text-xs border-slate-600">
                      {communication.attachments} archivos
                    </Badge>
                  )}
                </div>
                <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity self-start sm:self-center">
                  <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                    <Reply className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                    <Forward className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-6 w-6 sm:h-8 sm:w-8 p-0">
                    <MoreVertical className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
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
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Comunicación Unificada
          </h2>
          <p className="text-sm sm:text-base text-slate-400 mt-1 leading-relaxed">
            Centro de comunicación integrado con todos los actores del ecosistema educativo
          </p>
        </div>
        <div className="flex items-center">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5">
            <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Nueva Comunicación</span>
            <span className="sm:hidden">Nueva</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
        <div className="flex overflow-x-auto scrollbar-hide space-x-1 bg-slate-800/50 rounded-lg p-1 min-w-0">
          {tabs.map(tab => (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? "default" : "ghost"}
              size="sm"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 ${
                activeTab === tab.id 
                  ? 'bg-blue-600 text-white' 
                  : 'hover:bg-slate-700 text-slate-400'
              }`}
            >
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.substr(0, 3)}</span>
              {tab.count > 0 && (
                <Badge variant="secondary" className="ml-1 sm:ml-2 text-xs px-1 py-0.5">
                  {tab.count}
                </Badge>
              )}
            </Button>
          ))}
        </div>
        
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-3 h-3 sm:w-4 sm:h-4" />
          <Input
            placeholder="Buscar comunicaciones..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 sm:pl-10 bg-slate-800/50 border-slate-700 text-sm sm:text-base"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
        <div className="xl:col-span-2 space-y-3 sm:space-y-4">
          <AnimatePresence>
            {filteredCommunications.map((communication, index) => (
              <CommunicationCard key={communication.id} communication={communication} index={index} />
            ))}
          </AnimatePresence>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/60">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-lg text-slate-200 flex items-center">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-400" />
                Mensaje Rápido
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2 block">
                  Destinatario
                </label>
                <Input 
                  placeholder="Seleccionar destinatario..."
                  className="bg-slate-800/50 border-slate-700 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2 block">
                  Asunto
                </label>
                <Input 
                  placeholder="Asunto del mensaje..."
                  className="bg-slate-800/50 border-slate-700 text-sm sm:text-base"
                />
              </div>
              <div>
                <label className="text-xs sm:text-sm font-medium text-slate-300 mb-1 sm:mb-2 block">
                  Mensaje
                </label>
                <Textarea 
                  placeholder="Escribe tu mensaje aquí..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                />
              </div>
              <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm sm:text-base py-2 sm:py-2.5">
                <Send className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                Enviar Mensaje
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/60">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-base sm:text-lg text-slate-200 flex items-center">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-400" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="space-y-2 sm:space-y-3">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-slate-300 truncate">Ana Rodríguez en línea</p>
                    <p className="text-xs text-slate-500">Acudiente</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-yellow-400 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-slate-300 truncate">Prof. Carlos López</p>
                    <p className="text-xs text-slate-500">Última actividad: 5 min</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-400 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-slate-300 truncate">Psic. María González</p>
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