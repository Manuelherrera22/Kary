import React from 'react';
import { KeyRound, Mail } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";

const SecuritySettingsSection = () => {
  const { t } = useLanguage();
  const { toast } = useToast();

  const settingsOptions = [
    { id: 'password', labelKey: 'accountSettings.passwordTitle', icon: KeyRound, action: () => toast({ title: t('common.comingSoon'), description: t('accountSettings.passwordFeatureDesc')}) },
    { id: 'email_change', labelKey: 'accountSettings.changeEmailTitle', icon: Mail, action: () => toast({ title: t('common.comingSoon'), description: t('accountSettings.changeEmailTitle') + " " + t('common.comingSoon').toLowerCase() }) },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {settingsOptions.map(option => (
        <div key={option.id} className="bg-slate-700/40 p-4 rounded-lg border border-slate-600/50 hover:shadow-md hover:border-slate-500/70 transition-all">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <option.icon size={20} className="mr-3 text-sky-400" />
              <span className="font-medium text-slate-200">{t(option.labelKey)}</span>
            </div>
            <Button onClick={option.action} variant="outline" size="sm" className="text-slate-300 border-slate-500 hover:bg-slate-600/50 hover:text-white">{t('common.editButton')}</Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SecuritySettingsSection;