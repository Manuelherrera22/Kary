import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, CheckCircle, AlertTriangle, Clock, UserCircle, Info } from 'lucide-react';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { es } from 'date-fns/locale';

const NotificationAuditTable = ({ notifications, onRowClick, onMarkAsRead, currentUserRole, canViewSensitiveData }) => {
  const { t, language } = useLanguage();

  const getStatusBadge = (notification) => {
    const daysToRead = notification.dias_para_leer;
    const isRead = notification.fue_leida;

    if (isRead) {
      if (daysToRead !== null && daysToRead > 3) {
        return (
          <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-white flex items-center">
            <Clock size={14} className="mr-1" /> {t('notificationAuditPage.statusReadDelayed')}
          </Badge>
        );
      }
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white flex items-center">
          <CheckCircle size={14} className="mr-1" /> {t('notificationAuditPage.statusRead')}
        </Badge>
      );
    } else {
      if (daysToRead !== null && daysToRead < 0) { 
        return (
          <Badge variant="destructive" className="bg-red-600 hover:bg-red-700 text-white flex items-center">
            <AlertTriangle size={14} className="mr-1" /> {t('notificationAuditPage.statusUnreadOverdue')}
          </Badge>
        );
      }
      return (
        <Badge variant="secondary" className="bg-slate-600 hover:bg-slate-500 text-slate-200 flex items-center">
          <Info size={14} className="mr-1" /> {t('notificationAuditPage.statusUnread')}
        </Badge>
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notAvailable');
    try {
      return format(new Date(dateString), 'PPpp', { locale: language === 'es' ? es : undefined });
    } catch (e) {
      return dateString; 
    }
  };
  
  const formatDaysToRead = (days) => {
    if (days === null || days === undefined) return '-';
    if (days < 0) return `${Math.abs(days)} ${t('common.daysAgo')}`;
    return `${days} ${t('common.days')}`;
  };


  return (
    <div className="overflow-x-auto bg-slate-800/60 border border-slate-700/70 rounded-lg shadow-xl">
      <Table className="min-w-full">
        <TableHeader className="bg-slate-700/50">
          <TableRow>
            <TableHead className="text-sky-300">{t('notificationAuditPage.tableHeaderRecipient')}</TableHead>
            <TableHead className="text-sky-300">{t('notificationAuditPage.tableHeaderRole')}</TableHead>
            <TableHead className="text-sky-300">{t('notificationAuditPage.tableHeaderTitle')}</TableHead>
            <TableHead className="text-sky-300">{t('notificationAuditPage.tableHeaderCreatedAt')}</TableHead>
            <TableHead className="text-sky-300">{t('notificationAuditPage.tableHeaderStatus')}</TableHead>
            {canViewSensitiveData && <TableHead className="text-sky-300">{t('notificationAuditPage.tableHeaderReadAt')}</TableHead>}
            {canViewSensitiveData && <TableHead className="text-sky-300">{t('notificationAuditPage.tableHeaderReadBy')}</TableHead>}
            <TableHead className="text-sky-300">{t('notificationAuditPage.tableHeaderDaysToRead')}</TableHead>
            <TableHead className="text-sky-300 text-center">{t('notificationAuditPage.tableHeaderActions')}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {notifications.length === 0 ? (
            <TableRow>
              <TableCell colSpan={canViewSensitiveData ? 9 : 7} className="text-center text-slate-400 py-10">
                {t('notificationAuditPage.noNotificationsFound')}
              </TableCell>
            </TableRow>
          ) : (
            notifications.map((notification) => (
              <TableRow key={notification.notificacion_id} className="border-slate-700/80 hover:bg-slate-700/40 transition-colors">
                <TableCell className="text-slate-300 font-medium flex items-center">
                  <UserCircle size={18} className="mr-2 text-slate-400" />
                  {notification.nombre_destinatario || t('common.notAvailable')}
                </TableCell>
                <TableCell className="text-slate-300">{t(`roles.${notification.rol_destinatario}`, notification.rol_destinatario)}</TableCell>
                <TableCell className="text-slate-300 max-w-xs truncate" title={notification.title}>{notification.title}</TableCell>
                <TableCell className="text-slate-400 text-xs">{formatDate(notification.created_at)}</TableCell>
                <TableCell>{getStatusBadge(notification)}</TableCell>
                {canViewSensitiveData && <TableCell className="text-slate-400 text-xs">{notification.leido_en ? formatDate(notification.leido_en) : '-'}</TableCell>}
                {canViewSensitiveData && <TableCell className="text-slate-300">{notification.nombre_lector || '-'}</TableCell>}
                <TableCell className="text-slate-300 text-center">{formatDaysToRead(notification.dias_para_leer)}</TableCell>
                <TableCell className="text-center space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => onRowClick(notification)} className="text-sky-400 hover:text-sky-300 hover:bg-sky-500/10">
                    <Eye size={16} className="mr-1" /> {t('common.viewDetailsButton')}
                  </Button>
                  {!notification.fue_leida && (currentUserRole === 'admin' || currentUserRole === 'directive') && (
                    <Button variant="outline" size="sm" onClick={() => onMarkAsRead(notification.notificacion_id)} className="text-green-400 border-green-500/50 hover:bg-green-500/10 hover:text-green-300">
                      <CheckCircle size={16} className="mr-1" /> {t('notificationAuditPage.markAsReadButton')}
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default NotificationAuditTable;