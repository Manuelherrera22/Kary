import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Edit3, User, Calendar, ShieldAlert, Info, LayoutList as ListCollapse } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const NotificationAuditLog = ({ notificacionId }) => {
  const { t, language } = useLanguage();
  const { userProfile } = useMockAuth();
  const { toast } = useToast();
  const [auditLog, setAuditLog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAuditLog = useCallback(async () => {
    if (!notificacionId) {
      setError(t('notificationAuditPage.auditLog.errorNoNotificationId'));
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: fetchError } = await supabase
        .from('auditoria_notificaciones')
        .select('id, campo_modificado, valor_anterior, valor_nuevo, modificado_por, fecha_modificacion, motivo, usuario_editor_details:user_profiles!auditoria_notificaciones_modificado_por_fkey(full_name, role)')
        .eq('notificacion_id', notificacionId)
        .order('fecha_modificacion', { ascending: false });

      if (fetchError) throw fetchError;
      
      setAuditLog(data.map(item => ({
        ...item,
        usuario_editor: item.usuario_editor_details?.full_name || t('common.unknownUser'),
        rol_editor: item.usuario_editor_details?.role || t('common.unknownRole')
      })));

    } catch (err) {
      console.error('Error fetching notification audit log:', err);
      setError(t('notificationAuditPage.auditLog.errorFetching'));
      toast({
        title: t('toast.errorTitle'),
        description: `${t('notificationAuditPage.auditLog.errorFetching')}: ${err.message}`,
        variant: 'destructive',
      });
      setAuditLog([]);
    } finally {
      setLoading(false);
    }
  }, [notificacionId, t, toast]);

  useEffect(() => {
    fetchAuditLog();
  }, [fetchAuditLog]);

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

  if (loading) {
    return <div className="p-4 text-center text-slate-400">{t('common.loadingText')}</div>;
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-400 bg-red-900/20 rounded-md border border-red-700">
        <ShieldAlert size={24} className="mx-auto mb-2" />
        {error}
      </div>
    );
  }

  if (auditLog.length === 0) {
    return (
      <div className="p-4 text-center text-slate-500 italic">
        <Info size={20} className="inline mr-2" />
        {t('notificationAuditPage.auditLog.noHistory')}
      </div>
    );
  }
  
  const canViewEditorUuid = userProfile && userProfile.role === 'admin';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-4 mt-4"
    >
      <h4 className="text-lg font-semibold text-sky-300 flex items-center mb-3">
        <ListCollapse size={20} className="mr-2" />
        {t('notificationAuditPage.auditLog.title')}
      </h4>
      <div className="max-h-96 overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-700/50">
        {auditLog.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="p-4 bg-slate-700/40 rounded-lg border border-slate-600/50 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
              <div className="flex items-center text-xs text-slate-400 mb-1 sm:mb-0">
                <Calendar size={14} className="mr-1.5 text-slate-500" />
                {formatDate(entry.fecha_modificacion)} 
                <span className="mx-1 text-slate-600">|</span>
                {formatRelativeDate(entry.fecha_modificacion)}
              </div>
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-xs text-slate-400 cursor-default">
                      <User size={14} className="mr-1.5 text-slate-500" />
                      {t('notificationAuditPage.auditLog.editedBy')}: <span className="font-medium text-slate-300 ml-1">{entry.usuario_editor}</span>
                      <span className="text-slate-500 mx-1">({t(`roles.${entry.rol_editor}`, entry.rol_editor)})</span>
                    </div>
                  </TooltipTrigger>
                  {canViewEditorUuid && entry.modificado_por && (
                     <TooltipContent className="bg-slate-900 text-white border-slate-700">
                       <p className="text-xs">{t('notificationAuditPage.auditLog.editorId')}: {entry.modificado_por}</p>
                     </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <div className="flex items-center space-x-2 text-sm">
              <Edit3 size={16} className="text-sky-400 flex-shrink-0" />
              <span className="text-slate-300">{t('notificationAuditPage.auditLog.field')}:</span>
              <Badge variant="outline" className="bg-sky-900/50 border-sky-700 text-sky-300 px-2 py-0.5">
                {t(`notificationAuditPage.auditLog.fields.${entry.campo_modificado}`, entry.campo_modificado)}
              </Badge>
            </div>

            <div className="mt-1.5 flex items-center space-x-1.5 text-sm pl-7">
              <span className="line-through text-red-400/80 break-all">
                {entry.valor_anterior || `(${t('common.empty')})`}
              </span>
              <ArrowRight size={14} className="text-slate-500 flex-shrink-0" />
              <span className="font-semibold text-green-400 break-all">
                {entry.valor_nuevo || `(${t('common.empty')})`}
              </span>
            </div>
            {entry.motivo && (
              <div className="mt-2 pl-7">
                <p className="text-xs text-slate-500">
                  <span className="font-medium">{t('notificationAuditPage.auditLog.reason')}:</span> {entry.motivo}
                </p>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default NotificationAuditLog;