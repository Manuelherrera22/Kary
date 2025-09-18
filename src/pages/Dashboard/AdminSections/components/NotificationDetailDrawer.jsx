import React from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose } from "@/components/ui/drawer"; 
import { Button } from '@/components/ui/button';
import { X, Info, UserCircle, Calendar, Shield, Eye, Server, Smartphone, Globe, History } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import NotificationAuditLog from '@/pages/Dashboard/AdminSections/components/NotificationAuditLog';

const DetailItem = ({ icon: Icon, label, value, sensitive = false, canViewSensitiveData }) => {
  if (sensitive && !canViewSensitiveData) return null;
  return (
    <div className="flex items-start space-x-3 py-2 border-b border-slate-700 last:border-b-0">
      <Icon size={18} className="text-sky-400 mt-1 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-slate-400">{label}</p>
        <p className="text-slate-200 break-words">{value || '-'}</p>
      </div>
    </div>
  );
};

const NotificationDetailDrawer = ({ isOpen, onClose, notification, currentUserRole, canViewSensitiveData }) => {
  const { t, language } = useLanguage();
  const { userProfile } = useMockAuth();

  if (!notification) return null;

  const formatDate = (dateString) => {
    if (!dateString) return t('common.notAvailable');
    try {
      return format(new Date(dateString), 'PPpp', { locale: language === 'es' ? es : undefined });
    } catch (e) {
      return dateString; 
    }
  };
  
  const getMessageForRole = () => {
    if (!notification.contenido) return t('notificationAuditPage.noSpecificMessage');
    
    const userContextRole = notification.user_role_context || notification.rol_destinatario;
    
    if (currentUserRole === userContextRole || canViewSensitiveData) {
      if (typeof notification.contenido === 'string') {
        try {
          const parsedContent = JSON.parse(notification.contenido);
          return parsedContent[`mensaje_${userContextRole}`] || JSON.stringify(parsedContent, null, 2);
        } catch (e) {
          return notification.contenido;
        }
      } else if (typeof notification.contenido === 'object') {
         return notification.contenido[`mensaje_${userContextRole}`] || JSON.stringify(notification.contenido, null, 2);
      }
    }
    return t('notificationAuditPage.accessRestrictedToRole', { role: t(`roles.${userContextRole}`, userContextRole) });
  };

  const canViewAuditLog = userProfile && ['admin', 'directive', 'program_coordinator', 'psychopedagogue'].includes(userProfile.role);

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-slate-800 border-slate-700 text-white p-0 max-h-[90vh] flex flex-col">
        <DrawerHeader className="mb-4 p-6 border-b border-slate-700 flex-shrink-0">
          <DrawerTitle className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-purple-400 flex items-center">
            <Info size={26} className="mr-3 text-sky-400" />
            {t('notificationAuditPage.detailDrawerTitle')}
          </DrawerTitle>
          <DrawerDescription className="text-slate-400">{notification.title}</DrawerDescription>
        </DrawerHeader>

        <div className="p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-800 flex-grow">
          <div className="space-y-3">
            <DetailItem icon={UserCircle} label={t('notificationAuditPage.tableHeaderRecipient')} value={notification.nombre_destinatario} canViewSensitiveData={true} />
            <DetailItem icon={Shield} label={t('notificationAuditPage.tableHeaderRole')} value={t(`roles.${notification.rol_destinatario}`, notification.rol_destinatario)} canViewSensitiveData={true} />
            <DetailItem icon={Calendar} label={t('notificationAuditPage.tableHeaderCreatedAt')} value={formatDate(notification.created_at)} canViewSensitiveData={true} />
            <DetailItem icon={Eye} label={t('notificationAuditPage.statusLabel')} value={notification.fue_leida ? t('notificationAuditPage.statusRead') : t('notificationAuditPage.statusUnread')} canViewSensitiveData={true} />
            
            <DetailItem icon={Calendar} label={t('notificationAuditPage.tableHeaderReadAt')} value={notification.leido_en ? formatDate(notification.leido_en) : '-'} sensitive canViewSensitiveData={canViewSensitiveData} />
            <DetailItem icon={UserCircle} label={t('notificationAuditPage.tableHeaderReadBy')} value={notification.nombre_lector} sensitive canViewSensitiveData={canViewSensitiveData} />
            <DetailItem icon={Shield} label={t('notificationAuditPage.readerRole')} value={notification.rol_lector ? t(`roles.${notification.rol_lector}`, notification.rol_lector) : '-'} sensitive canViewSensitiveData={canViewSensitiveData} />
            <DetailItem icon={Smartphone} label={t('notificationAuditPage.device')} value={notification.dispositivo} sensitive canViewSensitiveData={canViewSensitiveData} />
            <DetailItem icon={Globe} label={t('notificationAuditPage.ipAddress')} value={notification.ip_origen} sensitive canViewSensitiveData={canViewSensitiveData} />

            <div className="py-3">
              <p className="text-sm font-medium text-slate-400 mb-1">{t('notificationAuditPage.messageForRoleContext', { role: t(`roles.${notification.user_role_context || notification.rol_destinatario}`, notification.user_role_context || notification.rol_destinatario) })}</p>
              <pre className="bg-slate-700/50 p-3 rounded-md text-xs text-slate-200 whitespace-pre-wrap break-all max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-500 scrollbar-track-slate-700">
                {getMessageForRole()}
              </pre>
            </div>
            
            {canViewSensitiveData && notification.contenido && (
              <div className="py-3">
                <p className="text-sm font-medium text-slate-400 mb-1">{t('notificationAuditPage.rawContent')}</p>
                <pre className="bg-slate-900/70 p-3 rounded-md text-xs text-slate-300 whitespace-pre-wrap break-all max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-slate-900">
                  {typeof notification.contenido === 'object' ? JSON.stringify(notification.contenido, null, 2) : notification.contenido}
                </pre>
              </div>
            )}

            {canViewAuditLog && (
              <NotificationAuditLog notificacionId={notification.notificacion_id} />
            )}

          </div>
        </div>
        <DrawerFooter className="border-t border-slate-700 p-4 bg-slate-800 flex-shrink-0">
          <DrawerClose asChild>
            <Button variant="outline" className="w-full text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white">
              <X size={18} className="mr-2" />
              {t('common.closeButton')}
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default NotificationDetailDrawer;