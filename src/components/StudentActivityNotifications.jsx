import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { 
  Bell, 
  BookOpen, 
  Clock, 
  User, 
  Star,
  CheckCircle,
  X,
  Activity,
  Sparkles
} from 'lucide-react';

const StudentActivityNotifications = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const { user } = useMockAuth();
  
  const [notifications, setNotifications] = useState([]);
  const [isVisible, setIsVisible] = useState(true);

  // Mock data - en producción esto vendría de un servicio real
  useEffect(() => {
    const loadNotifications = async () => {
      // Simular carga de notificaciones
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Datos mock de notificaciones de actividades
      const mockNotifications = [
        {
          id: 'notif-1',
          type: 'new_activity',
          title: 'Nueva Actividad Asignada',
          message: 'Tu profesor te ha asignado una nueva actividad de Matemáticas',
          activityTitle: 'Conteo básico - Matemáticas',
          teacherName: 'Prof. María González',
          subject: 'mathematics',
          difficulty: 'beginner',
          points: 50,
          dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutos atrás
          read: false
        },
        {
          id: 'notif-2',
          type: 'reminder',
          title: 'Recordatorio de Actividad',
          message: 'Tienes una actividad pendiente que vence pronto',
          activityTitle: 'Lectura de palabras simples',
          teacherName: 'Prof. Carlos Ruiz',
          subject: 'reading',
          difficulty: 'beginner',
          points: 75,
          dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 horas atrás
          read: false
        },
        {
          id: 'notif-3',
          type: 'completion',
          title: '¡Actividad Completada!',
          message: 'Has completado exitosamente una actividad',
          activityTitle: 'Sumas simples - Matemáticas',
          teacherName: 'Prof. María González',
          subject: 'mathematics',
          difficulty: 'intermediate',
          points: 100,
          completedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 horas atrás
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          read: true
        }
      ];

      setNotifications(mockNotifications);
    };

    loadNotifications();
  }, [user]);

  const getSubjectIcon = (subject) => {
    switch (subject) {
      case 'mathematics': return '🔢';
      case 'reading': return '📖';
      case 'writing': return '✍️';
      case 'science': return '🔬';
      default: return '📚';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-600';
      case 'intermediate': return 'bg-yellow-600';
      case 'advanced': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'new_activity': return <BookOpen className="w-5 h-5 text-blue-400" />;
      case 'reminder': return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'completion': return <CheckCircle className="w-5 h-5 text-green-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'new_activity': return 'border-blue-500/30 bg-blue-500/10';
      case 'reminder': return 'border-yellow-500/30 bg-yellow-500/10';
      case 'completion': return 'border-green-500/30 bg-green-500/10';
      default: return 'border-gray-500/30 bg-gray-500/10';
    }
  };

  const handleMarkAsRead = (notificationId) => {
    setNotifications(prev => prev.map(notif => 
      notif.id === notificationId 
        ? { ...notif, read: true }
        : notif
    ));
    
    toast({
      title: 'Notificación Leída',
      description: 'La notificación ha sido marcada como leída',
      variant: 'default',
    });
  };

  const handleDismiss = (notificationId) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
    
    toast({
      title: 'Notificación Descartada',
      description: 'La notificación ha sido eliminada',
      variant: 'default',
    });
  };

  const handleViewActivities = () => {
    // En una implementación real, esto navegaría a la sección de actividades
    toast({
      title: 'Redirigiendo...',
      description: 'Abriendo sección de actividades',
      variant: 'default',
    });
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;
  const recentNotifications = notifications.slice(0, 3); // Mostrar solo las 3 más recientes

  if (!isVisible || notifications.length === 0) {
    return null;
  }

  return (
    <Card 
      className={`border-2 ${unreadCount > 0 ? 'border-blue-500/50' : 'border-gray-600'} mb-6`}
      style={{
        backgroundColor: '#1e293b',
        opacity: 1,
        background: '#1e293b'
      }}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Bell className="w-5 h-5 mr-2 text-blue-400" />
            Notificaciones de Actividades
            {unreadCount > 0 && (
              <Badge 
                className="ml-2 bg-blue-600 text-white"
              >
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {recentNotifications.map((notification) => (
          <div
            key={notification.id}
            className={`rounded-lg p-4 border transition-all duration-200 ${
              notification.read 
                ? 'border-gray-600/50 bg-gray-800/30' 
                : `${getTypeColor(notification.type)} border-2`
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 mt-1">
                {getTypeIcon(notification.type)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <h4 className={`font-semibold ${
                    notification.read ? 'text-gray-300' : 'text-white'
                  }`}>
                    {notification.title}
                  </h4>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-2"></div>
                  )}
                </div>
                
                <p className="text-sm text-gray-400 mb-3">
                  {notification.message}
                </p>
                
                {/* Información de la actividad */}
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <span className="text-lg">{getSubjectIcon(notification.subject)}</span>
                    <span>{notification.activityTitle}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    <span>{notification.teacherName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3" />
                    <span>{notification.points} pts</span>
                  </div>
                </div>
                
                {/* Badges */}
                <div className="flex items-center gap-2 mb-3">
                  <Badge 
                    className={`${getDifficultyColor(notification.difficulty)} text-white text-xs`}
                  >
                    {notification.difficulty}
                  </Badge>
                  
                  {notification.dueDate && (
                    <Badge 
                      variant="outline"
                      className="text-xs border-gray-600 text-gray-300"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      Vence: {new Date(notification.dueDate).toLocaleDateString()}
                    </Badge>
                  )}
                  
                  {notification.completedAt && (
                    <Badge 
                      className="bg-green-600 text-white text-xs"
                    >
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Completada
                    </Badge>
                  )}
                </div>
                
                {/* Botones de acción */}
                <div className="flex gap-2">
                  {!notification.read && (
                    <Button
                      size="sm"
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-xs"
                      style={{
                        backgroundColor: '#3b82f6',
                        opacity: 1,
                        background: '#3b82f6'
                      }}
                    >
                      Marcar como Leída
                    </Button>
                  )}
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDismiss(notification.id)}
                    className="text-xs text-gray-300 border-gray-600"
                  >
                    Descartar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Footer con acción principal */}
        <div className="pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-400">
              {notifications.length > 3 && `+${notifications.length - 3} notificaciones más`}
            </p>
            
            <Button
              onClick={handleViewActivities}
              className="text-white"
              style={{
                backgroundColor: '#059669',
                opacity: 1,
                background: '#059669'
              }}
            >
              <Activity className="w-4 h-4 mr-2" />
              Ver Mis Actividades
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StudentActivityNotifications;
