import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, CheckCircle, AlertTriangle, Info, Star, BookOpen, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const RealTimeNotifications = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  // Simular notificaciones en tiempo real
  useEffect(() => {
    const mockNotifications = [
      {
        id: 1,
        type: 'achievement',
        title: '¡Nuevo Logro Desbloqueado!',
        message: 'Has completado 5 tareas esta semana',
        icon: Star,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/30',
        timestamp: '2 min',
        isNew: true
      },
      {
        id: 2,
        type: 'reminder',
        title: 'Recordatorio de Tarea',
        message: 'Tienes una tarea de matemáticas pendiente',
        icon: BookOpen,
        color: 'text-blue-400',
        bgColor: 'bg-blue-500/20',
        borderColor: 'border-blue-500/30',
        timestamp: '15 min',
        isNew: true
      },
      {
        id: 3,
        type: 'kary_message',
        title: 'Mensaje de Kary',
        message: 'Kary tiene una sugerencia especial para ti',
        icon: MessageSquare,
        color: 'text-purple-400',
        bgColor: 'bg-purple-500/20',
        borderColor: 'border-purple-500/30',
        timestamp: '1 hora',
        isNew: false
      },
      {
        id: 4,
        type: 'motivation',
        title: '¡Sigue así!',
        message: 'Tu progreso esta semana ha sido increíble',
        icon: CheckCircle,
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/30',
        timestamp: '2 horas',
        isNew: false
      }
    ];

    setNotifications(mockNotifications);

    // Simular nuevas notificaciones cada 30 segundos
    const interval = setInterval(() => {
      const newNotification = {
        id: Date.now(),
        type: 'motivation',
        title: '¡Mensaje Motivacional!',
        message: 'Cada día es una nueva oportunidad para aprender algo increíble',
        icon: Star,
        color: 'text-pink-400',
        bgColor: 'bg-pink-500/20',
        borderColor: 'border-pink-500/30',
        timestamp: 'ahora',
        isNew: true
      };

      setNotifications(prev => [newNotification, ...prev.slice(0, 4)]);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => n.isNew).length;

  const handleMarkAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isNew: false } : n)
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isNew: false }))
    );
  };

  const handleRemove = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="relative"
    >
      <Card className="bg-gradient-to-br from-slate-800/90 to-slate-900/90 border-slate-700/50 text-slate-100 shadow-xl overflow-hidden">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-lg border border-orange-500/30">
                <Bell size={20} className="text-orange-400" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-orange-300">
                  {t('studentDashboard.notifications.title', 'Notificaciones en Tiempo Real')}
                </h3>
                <p className="text-sm text-slate-400">
                  {t('studentDashboard.notifications.subtitle', 'Mantente al día con tus actividades')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge variant="destructive" className="bg-red-500/20 text-red-300 border-red-500/30">
                  {unreadCount}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-slate-400 hover:text-slate-200"
              >
                {isExpanded ? 'Ver menos' : 'Ver todas'}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <AnimatePresence>
              {notifications.slice(0, isExpanded ? notifications.length : 2).map((notification, index) => {
                const Icon = notification.icon;
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      notification.isNew 
                        ? `bg-gradient-to-r ${notification.bgColor} border ${notification.borderColor}` 
                        : 'bg-slate-700/30 border-slate-600/50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${notification.bgColor} border ${notification.borderColor} flex-shrink-0`}>
                        <Icon size={16} className={notification.color} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="text-sm font-semibold text-slate-200 truncate">
                                {notification.title}
                              </h5>
                              {notification.isNew && (
                                <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                              )}
                            </div>
                            <p className="text-xs text-slate-300 leading-snug">
                              {notification.message}
                            </p>
                          </div>
                          <span className="text-xs text-slate-500 ml-4 flex-shrink-0">
                            {notification.timestamp}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        {notification.isNew && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-slate-500 hover:text-slate-300 p-1 h-auto"
                          >
                            <CheckCircle size={14} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(notification.id)}
                          className="text-slate-500 hover:text-slate-300 p-1 h-auto"
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {notifications.length === 0 && (
              <div className="text-center py-8 text-slate-400">
                <Bell size={48} className="text-slate-500 mx-auto mb-4" />
                <p className="text-lg">
                  {t('studentDashboard.notifications.noNotifications', 'No hay notificaciones nuevas')}
                </p>
                <p className="text-sm mt-2">
                  {t('studentDashboard.notifications.allCaughtUp', '¡Estás al día con todo!')}
                </p>
              </div>
            )}

            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="w-full mt-4 text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-slate-100 hover:border-slate-500 transition-all duration-200"
              >
                <CheckCircle size={14} className="mr-2" />
                {t('studentDashboard.notifications.markAllRead', 'Marcar todas como leídas')}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default RealTimeNotifications;





