import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Bell, CheckCircle, MessageSquare, User, Calendar, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const colorByAlertLevel = {
  alto: 'bg-red-500 border-red-700',
  medio: 'bg-yellow-400 border-yellow-600',
  bajo: 'bg-green-500 border-green-700',
  default: 'bg-slate-500 border-slate-700'
};

const iconByAlertType = (type, level) => {
  if (type === 'riesgo_emocional' || level === 'alto') return <AlertTriangle className="h-5 w-5" />;
  if (level === 'medio') return <Info className="h-5 w-5" />;
  return <Bell className="h-5 w-5" />;
};

const StudentNotificationTimeline = ({ estudianteId }) => {
  const { t, language } = useLanguage();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);

  const fetchNotifications = useCallback(async () => {
    if (!estudianteId) {
      setError(t('studentProfilePage.timeline.errorNoStudentId'));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc('get_notificaciones_por_estudiante', {
        p_estudiante_id: estudianteId
      });

      if (rpcError) throw rpcError;
      setNotifications(data || []);
    } catch (err) {
      console.error('Error fetching student notifications:', err);
      setError(t('studentProfilePage.timeline.errorFetching'));
      toast({
        title: t('toast.errorTitle'),
        description: `${t('studentProfilePage.timeline.errorFetching')}: ${err.message}`,
        variant: 'destructive',
      });
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, [estudianteId, t, toast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'PPpp', { locale: language === 'es' ? es : undefined });
    } catch (e) {
      return dateString;
    }
  };

  const formatRelativeDate = (dateString) => {
    if (!dateString) return '';
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: language === 'es' ? es : undefined });
    } catch(e) {
      return dateString;
    }
  };

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 10);
  };

  if (loading) {
    return (
      <Card className="bg-slate-800/60 border-slate-700/70 shadow-xl mt-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-sky-300 flex items-center">
            <Bell size={22} className="mr-2" />
            {t('studentProfilePage.timeline.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-slate-400">
          {t('common.loadingText')}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-900/30 border-red-700/70 shadow-xl mt-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-red-300 flex items-center">
            <AlertTriangle size={22} className="mr-2" />
            {t('studentProfilePage.timeline.errorTitle')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-red-400">
          {error}
        </CardContent>
      </Card>
    );
  }

  if (notifications.length === 0) {
    return (
      <Card className="bg-slate-800/60 border-slate-700/70 shadow-xl mt-8">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-sky-300 flex items-center">
            <Bell size={22} className="mr-2" />
            {t('studentProfilePage.timeline.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 text-center text-slate-400">
          {t('studentProfilePage.timeline.noNotifications')}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="mt-8"
    >
      <Card className="bg-slate-800/60 border-slate-700/70 shadow-xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-300 via-cyan-300 to-sky-300 flex items-center">
            <Bell size={26} className="mr-3 text-cyan-300" />
            {t('studentProfilePage.timeline.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="relative pl-6 border-l-2 border-slate-700 space-y-8">
            {notifications.slice(0, visibleCount).map((notification, index) => (
              <motion.div
                key={notification.notificacion_id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="relative"
              >
                <div className={`absolute -left-[34px] top-1 flex items-center justify-center w-10 h-10 rounded-full ${colorByAlertLevel[notification.nivel_alerta] || colorByAlertLevel.default} text-white shadow-md`}>
                  {iconByAlertType(notification.tipo, notification.nivel_alerta)}
                </div>
                <div className="ml-6 p-4 bg-slate-700/50 rounded-lg shadow-md border border-slate-600/60 hover:border-slate-500/80 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-semibold text-slate-100 text-lg">{notification.title}</h4>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          {notification.fue_leida ? (
                            <Badge variant="outline" className="border-green-500 text-green-400 bg-green-900/30 text-xs">
                              <CheckCircle size={12} className="mr-1" /> {t('studentProfilePage.timeline.read')}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="border-red-500 text-red-400 bg-red-900/30 text-xs">
                              <AlertTriangle size={12} className="mr-1" /> {t('studentProfilePage.timeline.unread')}
                            </Badge>
                          )}
                        </TooltipTrigger>
                        <TooltipContent className="bg-slate-900 text-white border-slate-700">
                          {notification.fue_leida ? t('studentProfilePage.timeline.readTooltip') : t('studentProfilePage.timeline.unreadTooltip')}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-sm text-slate-300 mb-2 leading-relaxed line-clamp-2">{notification.message}</p>
                  
                  <TooltipProvider>
                    <Tooltip delayDuration={100}>
                      <TooltipTrigger asChild>
                        <button className="text-xs text-sky-400 hover:text-sky-300 hover:underline focus:outline-none">
                          {t('common.viewDetailsButton')}
                        </button>
                      </TooltipTrigger>
                      <TooltipContent className="bg-slate-900 text-white border-slate-700 p-3 max-w-xs shadow-lg">
                        <div className="space-y-1.5 text-xs">
                          <p><strong className="text-slate-400">{t('studentProfilePage.timeline.tooltipMessage')}:</strong> {notification.message}</p>
                          <p><strong className="text-slate-400">{t('studentProfilePage.timeline.tooltipRecipientRole')}:</strong> {t(`roles.${notification.rol_destinatario}`, notification.rol_destinatario)}</p>
                          <p><strong className="text-slate-400">{t('studentProfilePage.timeline.tooltipRecipientName')}:</strong> {notification.nombre_destinatario}</p>
                          <p><strong className="text-slate-400">{t('studentProfilePage.timeline.tooltipDate')}:</strong> {formatDate(notification.created_at)}</p>
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <p className="text-xs text-slate-500 mt-2 text-right">{formatRelativeDate(notification.created_at)}</p>
                </div>
              </motion.div>
            ))}
          </div>
          {notifications.length > visibleCount && (
            <div className="mt-8 text-center">
              <Button onClick={handleLoadMore} variant="outline" className="text-sky-300 border-sky-500/50 hover:bg-sky-500/20">
                {t('studentProfilePage.timeline.loadMore')} ({notifications.length - visibleCount} {t('studentProfilePage.timeline.remaining')})
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StudentNotificationTimeline;