import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  Star, 
  X,
  BookOpen,
  Target,
  HeartHandshake,
  MessageSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const SmartNotificationsWidget = ({ t }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: 'task',
      priority: 'high',
      title: t('studentDashboard.notifications.taskDue', 'Tarea pendiente'),
      message: t('studentDashboard.notifications.taskDueMessage', 'Tienes una tarea de matemáticas que vence mañana'),
      time: '2h',
      icon: Clock,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      borderColor: 'border-orange-500/30',
      read: false
    },
    {
      id: 2,
      type: 'achievement',
      priority: 'medium',
      title: t('studentDashboard.notifications.achievement', '¡Nuevo logro!'),
      message: t('studentDashboard.notifications.achievementMessage', 'Has completado 5 recursos esta semana'),
      time: '4h',
      icon: Star,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/30',
      read: false
    },
    {
      id: 3,
      type: 'resource',
      priority: 'low',
      title: t('studentDashboard.notifications.newResource', 'Nuevo recurso'),
      message: t('studentDashboard.notifications.newResourceMessage', 'Se ha asignado un nuevo video de ciencias'),
      time: '1d',
      icon: BookOpen,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/30',
      read: true
    },
    {
      id: 4,
      type: 'emotional',
      priority: 'medium',
      title: t('studentDashboard.notifications.emotionalCheck', 'Chequeo emocional'),
      message: t('studentDashboard.notifications.emotionalCheckMessage', 'Es hora de registrar cómo te sientes hoy'),
      time: '6h',
      icon: HeartHandshake,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      borderColor: 'border-pink-500/30',
      read: false
    },
    {
      id: 5,
      type: 'kary',
      priority: 'low',
      title: t('studentDashboard.notifications.karyMessage', 'Mensaje de Kary'),
      message: t('studentDashboard.notifications.karyMessageText', 'Kary tiene una sugerencia para ti'),
      time: '2d',
      icon: MessageSquare,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/30',
      read: true
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high':
        return <AlertCircle size={12} className="text-red-400" />;
      case 'medium':
        return <Clock size={12} className="text-yellow-400" />;
      case 'low':
        return <CheckCircle size={12} className="text-green-400" />;
      default:
        return <Bell size={12} className="text-slate-400" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="w-full"
    >
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 overflow-hidden relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-emerald-500 to-teal-500" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        
        <CardHeader className="relative pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 rounded-xl border border-emerald-500/30">
                <Bell size={28} className="text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold text-emerald-300">
                  {t('studentDashboard.notifications.title', 'Notificaciones')}
                </CardTitle>
                <p className="text-base text-slate-400 mt-1">
                  {t('studentDashboard.notifications.subtitle', 'Mantente al día con tu progreso')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="bg-red-500/20 text-red-300 border-red-500/30 text-sm font-medium px-3 py-1">
                  {unreadCount}
                </Badge>
              )}
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-slate-400 hover:text-slate-200 text-sm font-medium px-3 py-2"
                >
                  {t('studentDashboard.notifications.markAllRead', 'Marcar todas')}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="relative p-6">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {notifications.map((notification, index) => {
                const Icon = notification.icon;
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-5 rounded-xl border transition-all duration-200 hover:scale-[1.02] ${
                      notification.read 
                        ? 'bg-slate-700/30 border-slate-600/50' 
                        : `bg-gradient-to-r ${notification.bgColor} border ${notification.borderColor}`
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-lg ${notification.bgColor} border ${notification.borderColor} flex-shrink-0`}>
                        {React.createElement(notification.icon, { size: 20, className: notification.color })}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className={`text-base font-semibold ${
                                notification.read ? 'text-slate-300' : 'text-slate-100'
                              }`}>
                                {notification.title}
                              </h4>
                              {getPriorityIcon(notification.priority)}
                            </div>
                            <p className={`text-sm ${
                              notification.read ? 'text-slate-400' : 'text-slate-300'
                            } mb-3 leading-relaxed`}>
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-slate-500">
                                {notification.time}
                              </span>
                              {!notification.read && (
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => markAsRead(notification.id)}
                                    className="text-slate-400 hover:text-slate-200 p-2 h-auto text-sm"
                                  >
                                    <CheckCircle size={16} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeNotification(notification.id)}
                                    className="text-slate-400 hover:text-red-400 p-2 h-auto"
                                  >
                                    <X size={16} />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {notifications.length === 0 && (
            <div className="text-center py-12">
              <Bell size={56} className="text-slate-500 mx-auto mb-6" />
              <p className="text-lg text-slate-400">
                {t('studentDashboard.notifications.noNotifications', 'No hay notificaciones nuevas')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default SmartNotificationsWidget;
