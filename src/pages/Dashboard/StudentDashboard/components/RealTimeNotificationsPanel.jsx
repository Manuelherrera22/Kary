import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  CheckCircle, 
  X, 
  Sparkles, 
  BookOpen, 
  AlertCircle,
  Clock,
  Star
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import notificationService from '@/services/notificationService';

const RealTimeNotificationsPanel = () => {
  const { t } = useLanguage();
  const { userProfile } = useMockAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
    
    // Suscribirse a nuevas notificaciones
    const unsubscribe = notificationService.subscribeToStudent(userProfile.id, (event, data) => {
      if (event === 'notification_created') {
        setNotifications(prev => [data, ...prev]);
        
        // Mostrar toast para notificaciones importantes
        if (data.priority === 'high' || data.priority === 'urgent') {
          toast({
            title: data.title,
            description: data.message,
            variant: data.priority === 'urgent' ? 'destructive' : 'default'
          });
        }
      }
    });

    return unsubscribe;
  }, [userProfile.id]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const result = await notificationService.getUserNotifications(userProfile.id, 'student');
      if (result.success) {
        setNotifications(result.data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const result = await notificationService.markAsRead(notificationId, userProfile.id);
      if (result.success) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        );
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const result = await notificationService.markAllAsRead(userProfile.id, 'student');
      if (result.success) {
        setNotifications(prev => 
          prev.map(n => ({ ...n, read: true }))
        );
        toast({
          title: "Notificaciones marcadas como leídas",
          description: `${result.data.count} notificaciones marcadas`,
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const result = await notificationService.deleteNotification(notificationId, userProfile.id);
      if (result.success) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'activity_assigned': return <BookOpen size={16} className="text-blue-400" />;
      case 'feedback_received': return <CheckCircle size={16} className="text-green-400" />;
      case 'reminder': return <Clock size={16} className="text-yellow-400" />;
      case 'achievement': return <Star size={16} className="text-purple-400" />;
      default: return <Bell size={16} className="text-slate-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
      case 'low': return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando notificaciones...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl overflow-hidden relative">
        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-emerald-500 to-cyan-500" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />

        <CardHeader className="relative pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 rounded-lg border border-emerald-500/30">
                <Bell size={24} className="text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold text-emerald-300">
                  Notificaciones en Tiempo Real
                </CardTitle>
                <p className="text-sm text-slate-400">
                  Mantente al día con tus actividades
                </p>
              </div>
            </div>
            {unreadCount > 0 && (
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-red-500/20 text-red-300 px-3 py-1 rounded-full border-red-500/30">
                  {unreadCount} nuevas
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="text-xs"
                >
                  Marcar todas como leídas
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="relative z-10 space-y-3">
          {notifications.length === 0 ? (
            <div className="text-center py-8 text-slate-400">
              <Bell size={48} className="text-slate-500 mx-auto mb-4" />
              <p className="text-lg">No hay notificaciones nuevas</p>
              <p className="text-sm mt-2">¡Estás al día con todo!</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              <AnimatePresence>
                {notifications.map(notification => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center p-3 rounded-lg border transition-all duration-200 ${
                      notification.read 
                        ? 'bg-slate-700/30 border-slate-600/50' 
                        : 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg bg-slate-800 border-slate-700 flex-shrink-0`}>
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="text-sm font-semibold text-slate-200 truncate">
                                {notification.title}
                              </h5>
                              <Badge className={getPriorityColor(notification.priority)}>
                                {notification.priority}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-300 leading-snug">
                              {notification.message}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      {!notification.read && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="text-slate-500 hover:text-slate-300 p-1 h-auto"
                        >
                          <CheckCircle size={16} />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="text-slate-500 hover:text-slate-300 p-1 h-auto"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RealTimeNotificationsPanel;



