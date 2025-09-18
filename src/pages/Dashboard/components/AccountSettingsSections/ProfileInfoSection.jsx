import React from 'react';
import { UserCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

const ProfileInfoSection = ({ userProfile }) => {
  const { t } = useLanguage();

  return (
    <div className="mb-8 p-6 bg-slate-700/40 rounded-lg border border-slate-600/50">
      <div className="flex items-center mb-4">
        <UserCircle size={24} className="mr-3 text-sky-400" />
        <h2 className="text-xl font-semibold text-slate-200">{t('accountSettings.profileInfoTitle')}</h2>
      </div>
      <div className="space-y-3">
        <p><strong className="text-slate-400">{t('common.fullName')}:</strong> <span className="text-slate-300">{userProfile?.full_name || t('common.notAvailable')}</span></p>
        <p><strong className="text-slate-400">{t('common.email')}:</strong> <span className="text-slate-300">{userProfile?.email || t('common.notAvailable')}</span></p>
        <p><strong className="text-slate-400">{t('common.role')}:</strong> <span className="text-slate-300">{userProfile?.role ? t(`roles.${userProfile.role}`) : t('common.notAvailable')}</span></p>
      </div>
    </div>
  );
};

export default ProfileInfoSection;