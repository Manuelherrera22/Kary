import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Star,
  Target,
  Calendar,
  BookOpen,
  Heart,
  Zap
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import studentNotificationService from '@/services/studentNotificationService';

const StudentIntelligentAlerts = () => {
  const { t } = useLanguage();
  const { user } = useMockAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, urgent, academic, emotional, achievements

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user?.id) return;
      setLoading(true);
      try {
        const result = await studentNotificationService.getStudentNotifications(user.id);
        if (result.success) {
          setNotifications(result.data || []);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Datos mock para desarrollo
        setNotifications([
          {
            id: 1,
            type: 'achievement',
            title: '¡Logro Desbloqueado!',
            message: 'Has completado 5 actividades seguidas. ¡Excelente trabajo!',
            priority: 'high',
            timestamp: new Date().toISOString(),
            read: false,
            icon: '🏆',
            color: 'text-yellow-400',
            bgColor: 'bg-yellow-500/20',
            borderColor: 'border-yellow-500/50'
          },
          {
            id: 2,
            type: 'academic',
            title: 'Nueva Actividad Asignada',
            message: 'Tu profesor te ha asignado una nueva actividad de matemáticas.',
            priority: 'medium',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            read: false,
            icon: '📚',
            color: 'text-blue-400',
            bgColor: 'bg-blue-500/20',
            borderColor: 'border-blue-500/50'
          },
          {
            id: 3,
            type: 'emotional',
            title: 'Recordatorio de Bienestar',
            message: 'Recuerda tomar descansos regulares. Tu bienestar es importante.',
            priority: 'low',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            read: true,
            icon: '💙',
            color: 'text-purple-400',
            bgColor: 'bg-purple-500/20',
            borderColor: 'border-purple-500/50'
          },
          {
            id: 4,
            type: 'urgent',
            title: 'Actividad Próxima a Vencer',
            message: 'Tienes una actividad de historia que vence mañana.',
            priority: 'urgent',
            timestamp: new Date(Date.now() - 1800000).toISOString(),
            read: false,
            icon: '⚠️',
            color: 'text-red-400',
            bgColor: 'bg-red-500/20',
            borderColor: 'border-red-500/50'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [user?.id]);

  const filteredNotifications = notifications.filter(notification => {
    switch (filter) {
      case 'urgent':
        return notification.priority === 'urgent';
      case 'academic':
        return notification.type === 'academic';
      case 'emotional':
        return notification.type === 'emotional';
      case 'achievements':
        return notification.type === 'achievement';
      default:
        return true;
    }
  });

  const markAsRead = async (notificationId) => {
    try {
      const result = await studentNotificationService.markAsRead(notificationId);
      if (result.success) {
        setNotifications(prev => prev.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true }
            : notification
        ));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'urgent': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'high': return <Star className="w-4 h-4 text-yellow-400" />;
      case 'medium': return <Bell className="w-4 h-4 text-blue-400" />;
      case 'low': return <Heart className="w-4 h-4 text-purple-400" />;
      default: return <Bell className="w-4 h-4 text-gray-400" />;
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/60">
        <CardHeader>
          <CardTitle className="text-xl text-orange-300">🔔 Alertas Inteligentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-400"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/60">
      <CardHeader>
        <CardTitle className="text-xl text-orange-300 flex items-center gap-2">
          🔔 Alertas Inteligentes
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} nuevas
            </Badge>
          )}
        </CardTitle>
        
        {/* Filtros */}
        <div className="flex gap-2 mt-4">
          {['all', 'urgent', 'academic', 'emotional', 'achievements'].map(filterType => (
            <Button
              key={filterType}
              variant={filter === filterType ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(filterType)}
              className="text-xs"
            >
              {filterType === 'all' ? 'Todas' : 
               filterType === 'urgent' ? 'Urgentes' :
               filterType === 'academic' ? 'Académicas' :
               filterType === 'emotional' ? 'Emocionales' : 'Logros'}
            </Button>
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No hay alertas {filter === 'all' ? '' : filter}</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border-2 ${
                  notification.read 
                    ? 'bg-slate-700/30 border-slate-600/30' 
                    : `${notification.bgColor} ${notification.borderColor}`
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{notification.icon}</div>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className={`font-semibold ${notification.read ? 'text-slate-400' : notification.color}`}>
                        {notification.title}
                      </h4>
                      {getPriorityIcon(notification.priority)}
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      )}
                    </div>
                    
                    <p className={`text-sm mb-3 ${notification.read ? 'text-slate-500' : 'text-slate-300'}`}>
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Clock className="w-3 h-3" />
                        {getTimeAgo(notification.timestamp)}
                      </div>
                      
                      {!notification.read && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs"
                        >
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Marcar como leída
                        </Button>
                      )}
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

export default StudentIntelligentAlerts;
