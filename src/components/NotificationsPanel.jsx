import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, Settings2, AlertCircle as CircleAlert, FileText, CalendarClock, Users, BookOpen, RefreshCw, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { es, enUS, pt, fr, ru } from 'date-fns/locale';
import { formatEventForDisplay, eventTypes } from '@/lib/eventInterpreter';

const localeMap = {
  es,
  en: enUS,
  pt,
  fr,
  ru,
};

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const { t, language } = useLanguage();
  const currentLocale = localeMap[language] || enUS;

  const getIcon = (type) => {
    switch (type) {
      case eventTypes.NUEVO_REPORTE: return <FileText className="w-5 h-5 text-blue-400" />;
      case eventTypes.RECORDATORIO_CITA: return <CalendarClock className="w-5 h-5 text-yellow-400" />;
      case eventTypes.APROBACION_PLAN_PENDIENTE: return <CircleAlert className="w-5 h-5 text-orange-400" />;
      case eventTypes.RIESGO_EMOCIONAL: return <CircleAlert className="w-5 h-5 text-red-400" />;
      case eventTypes.FALTA_ACADEMICA: return <BookOpen className="w-5 h-5 text-amber-400" />;
      case eventTypes.INTERVENCION_PIAR: return <Users className="w-5 h-5 text-teal-400" />;
      case 'predictive_alert': return <CircleAlert className="w-5 h-5 text-red-400" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };
  
  const formattedNotification = notification.isPredictiveAlert 
    ? {
        ...notification,
        title: notification.title || t('notifications.predictiveAlertTitle'),
        message: notification.description,
        link: `/dashboard/student/${notification.student_id}/profile`,
      }
    : formatEventForDisplay(notification, notification.user_role_context || 'student', t, language);


  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
      className={`p-3 hover:bg-slate-700/50 rounded-md transition-colors ${formattedNotification.is_read ? 'opacity-70' : ''}`}
    >
      <Link to={formattedNotification.link || '#'} className="block">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">{getIcon(formattedNotification.type)}</div>
          <div className="flex-1">
            <p className={`text-sm font-medium ${formattedNotification.is_read ? 'text-slate-400' : 'text-white'}`}>{formattedNotification.title}</p>
            <p className={`text-xs ${formattedNotification.is_read ? 'text-slate-500' : 'text-slate-300'} mt-0.5`}>{formattedNotification.message}</p>
            <p className="text-xs text-slate-500 mt-1">
              {formatDistanceToNow(new Date(formattedNotification.created_at), { addSuffix: true, locale: currentLocale })}
            </p>
          </div>
          {!formattedNotification.is_read && !notification.isPredictiveAlert && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-slate-400 hover:text-green-400 hover:bg-slate-700"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); onMarkAsRead(formattedNotification.id); }}
              title={t('notifications.markAsRead')}
            >
              <CheckCheck size={16} />
            </Button>
          )}
        </div>
      </Link>
    </motion.div>
  );
};


const NotificationsPanel = () => {
  const { t } = useLanguage();
  const { user, userProfile } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [predictiveAlerts, setPredictiveAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      setNotifications([]);
      setPredictiveAlerts([]);
      return;
    }
    setLoading(true);
    try {
      const [notifRes, alertRes] = await Promise.all([
        supabase
          .from('notifications')
          .select('id, created_at, type, title, message, is_read, link, user_id, contenido, estudiante_id, nivel_alerta, tipo_evento, fecha, user_role_context')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10),
        supabase.rpc('obtener_alertas', { p_user_id: user.id })
      ]);

      if (notifRes.error) throw notifRes.error;
      if (alertRes.error) throw alertRes.error;
      
      const processedNotifications = (notifRes.data || []).map(n => ({
        ...n,
        user_role_context: userProfile?.role || 'student' 
      }));
      
      setNotifications(processedNotifications);
      setPredictiveAlerts(alertRes.data || []);

    } catch (err) {
      console.error("Error fetching notifications and alerts:", err);
      setNotifications([]);
      setPredictiveAlerts([]);
    } finally {
      setLoading(false);
    }
  }, [user, userProfile?.role]);

  useEffect(() => {
    fetchAllData();

    if (!user) return;

    const channel = supabase.channel(`notifications:${user.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
        fetchAllData();
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'notifications', filter: `user_id=eq.${user.id}` }, (payload) => {
        fetchAllData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'alerts_predictive', filter: `student_id=eq.${user.id}` }, (payload) => {
        fetchAllData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };

  }, [user, fetchAllData]);

  const combinedAndSortedNotifications = useMemo(() => {
    const mappedAlerts = predictiveAlerts.map(alert => ({
      id: `pa-${alert.id}`,
      created_at: alert.created_at,
      title: alert.categoria,
      description: alert.descripcion,
      is_read: false, // Predictive alerts are always "new"
      isPredictiveAlert: true,
      type: 'predictive_alert',
      student_id: alert.student_id,
    }));

    return [...notifications, ...mappedAlerts]
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 15);
  }, [notifications, predictiveAlerts]);

  const unreadCount = useMemo(() => {
    const unreadNotifications = notifications.filter(n => !n.is_read).length;
    const unreadAlerts = predictiveAlerts.length;
    return unreadNotifications + unreadAlerts;
  }, [notifications, predictiveAlerts]);

  const handleMarkAsRead = async (id) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', id)
        .eq('user_id', user.id);
      if (error) throw error;
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };
  
  const handleMarkAllAsRead = async () => {
    if (!user || notifications.filter(n => !n.is_read).length === 0) return;
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('user_id', user.id)
        .eq('is_read', false);
      if (error) throw error;
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch (err) {
      console.error("Error marking all notifications as read:", err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-purple-300 hover:text-white hover:bg-purple-500/20">
          <Bell size={22} />
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 500, damping: 20 }}
              className="absolute top-1 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 sm:w-96 bg-slate-800 border-slate-700 text-white p-2 shadow-2xl mr-2 sm:mr-4" sideOffset={10} align="end">
        <div className="flex justify-between items-center px-3 py-2">
          <DropdownMenuLabel className="text-base font-semibold p-0">{t('notifications.title')}</DropdownMenuLabel>
          <Button variant="ghost" size="icon" onClick={fetchAllData} disabled={loading} className="h-8 w-8 text-slate-400 hover:text-white hover:bg-slate-700">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          </Button>
        </div>
        <DropdownMenuSeparator className="bg-slate-700" />
        
        {loading ? (
          <div className="p-4 text-center text-slate-400">{t('common.loadingText')}</div>
        ) : combinedAndSortedNotifications.length === 0 ? (
          <div className="p-4 text-center text-slate-400">{t('notifications.noNotifications')}</div>
        ) : (
          <div className="max-h-[400px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800">
            <AnimatePresence>
              {combinedAndSortedNotifications.map((notification) => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
        
        <DropdownMenuSeparator className="bg-slate-700 mt-1" />
        <DropdownMenuGroup>
          <DropdownMenuItem 
            className="p-2.5 hover:bg-slate-700/50 focus:bg-slate-700/60 cursor-pointer data-[disabled]:opacity-50"
            onSelect={handleMarkAllAsRead}
            disabled={notifications.filter(n => !n.is_read).length === 0 || loading || !user}
          >
            <CheckCheck className="mr-2 h-4 w-4 text-green-400" />
            <span>{t('notifications.markAllAsRead')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="p-2.5 hover:bg-slate-700/50 focus:bg-slate-700/60 cursor-pointer">
            <Settings2 className="mr-2 h-4 w-4 text-sky-400" />
            <span>{t('notifications.settings')}</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-slate-700" />
        <DropdownMenuItem className="p-2.5 justify-center hover:bg-slate-700/50 focus:bg-slate-700/60 cursor-pointer">
          <Link to="/dashboard/notifications" className="text-sm text-sky-400 hover:text-sky-300 w-full text-center">
            {t('notifications.viewAll')}
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationsPanel;