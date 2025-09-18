import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';
import NotificationAuditFilters from '@/pages/Dashboard/AdminSections/components/NotificationAuditFilters';
import NotificationAuditTable from '@/pages/Dashboard/AdminSections/components/NotificationAuditTable';
import NotificationDetailDrawer from '@/pages/Dashboard/AdminSections/components/NotificationDetailDrawer';
import NotificationSummaryBar from '@/pages/Dashboard/AdminSections/components/NotificationSummaryBar';
import { FileSearch, AlertTriangle } from 'lucide-react';

const NotificationAuditPage = () => {
  const { t } = useLanguage();
  const { userProfile } = useMockAuth();
  const { toast } = useToast();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    p_institucion: null,
    p_tipo_evento: null,
    p_rol_destinatario: null,
    p_solo_no_leidas: false,
  });
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [summaryStats, setSummaryStats] = useState({ total: 0, read: 0, unread: 0, avgReadTime: null });

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error: rpcError } = await supabase.rpc('filtrar_notificaciones_panel_admin', filters);
      if (rpcError) throw rpcError;
      setNotifications(data || []);

      const total = data?.length || 0;
      const readCount = data?.filter(n => n.fue_leida).length || 0;
      setSummaryStats({
        total,
        read: readCount,
        unread: total - readCount,
        avgReadTime: null, 
      });

    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError(t('notificationAuditPage.errorFetching'));
      toast({
        title: t('toast.errorTitle'),
        description: `${t('notificationAuditPage.errorFetching')}: ${err.message}`,
        variant: 'destructive',
      });
      setNotifications([]);
      setSummaryStats({ total: 0, read: 0, unread: 0, avgReadTime: null });
    } finally {
      setLoading(false);
    }
  }, [filters, t, toast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const handleRowClick = (notification) => {
    setSelectedNotification(notification);
    setIsDrawerOpen(true);
  };

  const handleMarkAsRead = async (notificationId) => {
    if (!userProfile) return;
    try {
      const { error: markError } = await supabase.rpc('marcar_notificacion_como_leida', { 
        p_notificacion_id: notificationId
      });
      if (markError) throw markError;
      
      const { error: logError } = await supabase.rpc('registrar_lectura_notificacion', {
        p_notificacion_id: notificationId,
        p_lector_id: userProfile.id,
        p_rol_lector: userProfile.role,
      });
      if (logError) console.warn("Error logging read notification, but marked as read:", logError);


      toast({
        title: t('toast.successTitle'),
        description: t('notificationAuditPage.markedAsReadSuccess'),
        className: 'bg-green-500 text-white'
      });
      fetchNotifications(); 
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast({
        title: t('toast.errorTitle'),
        description: `${t('notificationAuditPage.errorMarkingAsRead')}: ${err.message}`,
        variant: 'destructive',
      });
    }
  };

  if (!userProfile) return <LoadingScreen />;

  const canViewSensitiveData = ['admin', 'directive'].includes(userProfile.role);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 space-y-6 bg-slate-900 min-h-screen"
    >
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400 flex items-center">
          <FileSearch size={32} className="mr-3 text-sky-400" />
          {t('notificationAuditPage.title')}
        </h1>
        <p className="text-slate-400 mt-1">{t('notificationAuditPage.subtitle')}</p>
      </header>

      <NotificationSummaryBar stats={summaryStats} />
      <NotificationAuditFilters onFilterChange={handleFilterChange} initialFilters={filters} />

      {loading && (
        <div className="flex justify-center items-center py-10">
          <LoadingScreen text={t('common.loadingText')} />
        </div>
      )}
      
      {error && !loading && (
        <div className="text-center py-10 bg-red-900/20 p-6 rounded-lg border border-red-700">
          <AlertTriangle size={48} className="mx-auto mb-4 text-red-400" />
          <p className="text-xl font-semibold text-red-300">{t('common.errorTitle')}</p>
          <p className="text-red-400">{error}</p>
          <button onClick={fetchNotifications} className="mt-4 px-4 py-2 bg-sky-500 hover:bg-sky-600 rounded-md text-white">
            {t('common.retryButton')}
          </button>
        </div>
      )}

      {!loading && !error && (
        <NotificationAuditTable
          notifications={notifications}
          onRowClick={handleRowClick}
          onMarkAsRead={handleMarkAsRead}
          currentUserRole={userProfile.role}
          canViewSensitiveData={canViewSensitiveData}
        />
      )}

      {selectedNotification && (
        <NotificationDetailDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          notification={selectedNotification}
          currentUserRole={userProfile.role}
          canViewSensitiveData={canViewSensitiveData}
        />
      )}
    </motion.div>
  );
};

export default NotificationAuditPage;