import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { Settings, Database, ShieldCheck, Mail, Bell } from 'lucide-react';

const SettingItem = ({ icon: Icon, title, description, children }) => (
  <motion.div 
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, ease: "easeOut" }}
    className="bg-slate-800/60 p-6 rounded-xl shadow-lg border border-slate-700/50"
  >
    <div className="flex items-start mb-3">
      <div className="p-2 bg-sky-500/20 rounded-lg mr-4">
        <Icon className="w-6 h-6 text-sky-400" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-slate-100">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
    <div className="mt-4 pl-12">
      {children}
    </div>
  </motion.div>
);

const AdminSystemSettingsPage = () => {
  const { t } = useLanguage();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-4 sm:p-6 space-y-8"
    >
      <header className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-300">
          {t('dashboards.adminDashboard.quickActions.systemSettings')}
        </h1>
        <p className="text-slate-300 mt-2 text-md sm:text-lg">
          {t('adminUserRolePage.systemSettingsDescription')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SettingItem
          icon={Database}
          title={t('adminSystemSettings.databaseManagement.title', 'Gestión de Base de Datos')}
          description={t('adminSystemSettings.databaseManagement.description', 'Monitorear estado, realizar copias de seguridad y optimizar.')}
        >
          <p className="text-slate-500 text-sm">{t('common.featureComingSoon', 'Esta función estará disponible próximamente.')}</p>
        </SettingItem>

        <SettingItem
          icon={ShieldCheck}
          title={t('adminSystemSettings.securitySettings.title', 'Configuración de Seguridad')}
          description={t('adminSystemSettings.securitySettings.description', 'Gestionar políticas de acceso, autenticación y auditorías.')}
        >
           <p className="text-slate-500 text-sm">{t('common.featureComingSoon', 'Esta función estará disponible próximamente.')}</p>
        </SettingItem>

        <SettingItem
          icon={Mail}
          title={t('adminSystemSettings.emailConfiguration.title', 'Configuración de Correo')}
          description={t('adminSystemSettings.emailConfiguration.description', 'Ajustar plantillas de correo, servidor SMTP y listas de envío.')}
        >
           <p className="text-slate-500 text-sm">{t('common.featureComingSoon', 'Esta función estará disponible próximamente.')}</p>
        </SettingItem>

        <SettingItem
          icon={Bell}
          title={t('adminSystemSettings.notificationSettings.title', 'Ajustes de Notificaciones')}
          description={t('adminSystemSettings.notificationSettings.description', 'Configurar tipos de notificaciones y canales de entrega.')}
        >
           <p className="text-slate-500 text-sm">{t('common.featureComingSoon', 'Esta función estará disponible próximamente.')}</p>
        </SettingItem>
      </div>
    </motion.div>
  );
};

export default AdminSystemSettingsPage;