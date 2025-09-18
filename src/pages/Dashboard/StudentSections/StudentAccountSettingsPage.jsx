import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Settings } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';
import AccountSettingsLayout from '@/pages/Dashboard/components/AccountSettingsLayout';
import ProfileInfoSection from '@/pages/Dashboard/components/AccountSettingsSections/ProfileInfoSection';
import RoleChangeSection from '@/pages/Dashboard/components/AccountSettingsSections/RoleChangeSection';
import SecuritySettingsSection from '@/pages/Dashboard/components/AccountSettingsSections/SecuritySettingsSection';
import PreferencesSection from '@/pages/Dashboard/components/AccountSettingsSections/PreferencesSection';
import LogoutSection from '@/pages/Dashboard/components/AccountSettingsSections/LogoutSection';

const StudentAccountSettingsPage = () => {
  const { t } = useLanguage();
  const { user, userProfile, loading: authLoading, handleLogout } = useAuth();

  if (authLoading || !userProfile) {
    return <LoadingScreen />;
  }

  return (
    <AccountSettingsLayout
      pageTitle={t('studentDashboard.settingsPageTitle')}
      pageSubtitle={t('studentDashboard.settingsPageSubtitle')}
      headerIcon={Settings}
      backLink="/dashboard"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="space-y-8"
      >
        <ProfileInfoSection userProfile={userProfile} />
        <RoleChangeSection />
        <SecuritySettingsSection />
        <PreferencesSection />
        <LogoutSection onLogout={handleLogout} />
      </motion.div>
    </AccountSettingsLayout>
  );
};

export default StudentAccountSettingsPage;