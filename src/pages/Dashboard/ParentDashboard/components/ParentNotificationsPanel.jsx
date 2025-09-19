import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Heart,
  BookOpen,
  Users,
  Calendar,
  Star,
  TrendingUp,
  MessageSquare,
  FileText,
  Target,
  Zap,
  Eye,
  X,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import realTimeNotificationService from '@/services/realTimeNotificationService';

const ParentNotificationsPanel = () => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, unread, urgent, academic, emotional

  useEffect(() => {
    loadNotifications();
    
    // Suscribirse a nuevas notificaciones
    const unsubscribe = realTimeNotificationService.subscribe('parent', (notification) => {
      setNotifications(prev => [notification, ...prev]);
    });

    return unsubscribe;
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const result = await realTimeNotificationService.getNotifications('parent');
      if (result.success) {
        setNotifications(result.data);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockNotifications = () => {
    const mockNotifications = [
      {
        id: 'notif-1',
        type: 'academic_progress',
        priority: 'high',
        title: 'Progreso Académico Actualizado',
        message: 'María ha completado 3 actividades de matemáticas esta semana',
        data: { studentId: 'student-1', subject: 'Matemáticas', progress: 85 },
        read: false,
        createdAt: new Date().toISOString()
      },
      {
        id: 'notif-2',
        type: 'emotional_alert',
        priority: 'urgent',
        title: 'Alerta Emocional',
        message: 'Se detectó un cambio en el estado emocional de María. Contacta al psicopedagogo.',
        data: { studentId: 'student-1', alertType: 'anxiety', level: 'high' },
        read: false,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'notif-3',
        type: 'appointment_reminder',
        priority: 'medium',
        title: 'Recordatorio de Cita',
        message: 'Tienes una cita programada con el profesor mañana a las 10:00 AM',
        data: { appointmentId: 'app-1', date: '2024-01-20', time: '10:00' },
        read: true,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'notif-4',
        type: 'achievement',
        priority: 'low',
        title: 'Nuevo Logro',
        message: 'María ha obtenido el logro "Estudiante del Mes" por su excelente comportamiento',
        data: { studentId: 'student-1', achievement: 'Estudiante del Mes' },
        read: true,
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'notif-5',
        type: 'support_plan_update',
        priority: 'medium',
        title: 'Plan de Apoyo Actualizado',
        message: 'El plan de apoyo de María ha sido actualizado con nuevas estrategias',
        data: { studentId: 'student-1', planId: 'plan-1' },
        read: false,
        createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
      }
    ];

    setNotifications(mockNotifications);
    setLoading(false);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'academic_progress': return <BookOpen size={20} className="text-blue-400" />;
      case 'emotional_alert': return <Heart size={20} className="text-red-400" />;
      case 'appointment_reminder': return <Calendar size={20} className="text-yellow-400" />;
      case 'achievement': return <Star size={20} className="text-green-400" />;
      case 'support_plan_update': return <Target size={20} className="text-purple-400" />;
      case 'behavioral_alert': return <AlertTriangle size={20} className="text-orange-400" />;
      case 'communication': return <MessageSquare size={20} className="text-cyan-400" />;
      case 'report_available': return <FileText size={20} className="text-indigo-400" />;
      default: return <Bell size={20} className="text-gray-400" />;
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

  const getTypeColor = (type) => {
    switch (type) {
      case 'academic_progress': return 'text-blue-400 bg-blue-500/10';
      case 'emotional_alert': return 'text-red-400 bg-red-500/10';
      case 'appointment_reminder': return 'text-yellow-400 bg-yellow-500/10';
      case 'achievement': return 'text-green-400 bg-green-500/10';
      case 'support_plan_update': return 'text-purple-400 bg-purple-500/10';
      case 'behavioral_alert': return 'text-orange-400 bg-orange-500/10';
      case 'communication': return 'text-cyan-400 bg-cyan-500/10';
      case 'report_available': return 'text-indigo-400 bg-indigo-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    await realTimeNotificationService.markAsRead(notificationId);
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
  };

  const handleDismissNotification = async (notificationId) => {
    await realTimeNotificationService.markAsRead(notificationId);
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notification.read;
    if (filter === 'urgent') return notification.priority === 'urgent';
    if (filter === 'academic') return notification.type === 'academic_progress';
    if (filter === 'emotional') return notification.type === 'emotional_alert';
    return true;
  });

  if (loading) {
    return (
      <Card className="bg-slate-800/50 border-slate-700/50">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Cargando notificaciones...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-slate-800/50 border-slate-700/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg border border-purple-500/30">
              <Bell size={24} className="text-purple-400" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-purple-300">
                Notificaciones
              </CardTitle>
              <p className="text-sm text-slate-400">
                Actualizaciones sobre el progreso de tu hijo/a
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-slate-700 border-slate-600 text-slate-200 rounded-lg px-3 py-1 text-sm"
            >
              <option value="all">Todas</option>
              <option value="unread">No leídas</option>
              <option value="urgent">Urgentes</option>
              <option value="academic">Académicas</option>
              <option value="emotional">Emocionales</option>
            </select>
            <Button
              variant="ghost"
              size="sm"
              onClick={loadNotifications}
              className="text-slate-400 hover:text-slate-200"
            >
              <RefreshCw size={16} />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell size={48} className="text-slate-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-300 mb-2">
              No hay notificaciones
            </h3>
            <p className="text-slate-400">
              Las notificaciones aparecerán aquí cuando haya actualizaciones
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border transition-all duration-200 ${
                  notification.read 
                    ? 'bg-slate-700/30 border-slate-600/30' 
                    : 'bg-purple-500/10 border-purple-500/30'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${
                    notification.read ? 'bg-slate-600/30' : 'bg-purple-500/20'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-slate-200 text-sm">
                            {notification.title}
                          </h4>
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          {!notification.read && (
                            <Badge className="text-purple-300 bg-purple-500/20 border-purple-500/30">
                              Nuevo
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-slate-300 leading-relaxed mb-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Clock size={12} />
                            {new Date(notification.createdAt).toLocaleString()}
                          </span>
                          <Badge className={`text-xs ${getTypeColor(notification.type)}`}>
                            {notification.type.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="text-slate-400 hover:text-slate-200"
                          >
                            <Eye size={16} />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDismissNotification(notification.id)}
                          className="text-slate-400 hover:text-red-400"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ParentNotificationsPanel;

