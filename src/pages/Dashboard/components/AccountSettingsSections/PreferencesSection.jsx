import React, { useState, useEffect } from 'react';
import { Languages as LanguagesIcon, Palette, Clock, Bell, CheckCircle, Loader2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';

const timezones = [
  "Etc/GMT+12", "Etc/GMT+11", "Pacific/Honolulu", "America/Anchorage", 
  "America/Los_Angeles", "America/Denver", "America/Chicago", "America/New_York",
  "America/Caracas", "America/Halifax", "America/Sao_Paulo", "Atlantic/Azores",
  "Etc/GMT", "Europe/London", "Europe/Paris", "Europe/Kiev", "Europe/Moscow",
  "Asia/Tehran", "Asia/Dubai", "Asia/Kolkata", "Asia/Dhaka", "Asia/Bangkok",
  "Asia/Shanghai", "Asia/Tokyo", "Australia/Sydney", "Pacific/Auckland", "Etc/GMT-14"
];

const PreferencesSection = () => {
  const { t, language: currentLanguageContext, changeLanguage, availableLanguages } = useLanguage();
  const { user, userProfile, updateUserProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    timezone: '',
    notifications_enabled: false,
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFormData({
        timezone: userProfile.timezone || '',
        notifications_enabled: userProfile.notifications_enabled || false,
      });
    }
  }, [userProfile]);

  const handleSettingsSave = async () => {
    if (!user) return;
    setIsSavingSettings(true);
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({
          timezone: formData.timezone,
          notifications_enabled: formData.notifications_enabled,
          language: currentLanguageContext, 
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id); 

      if (error) throw error;
      
      await updateUserProfile({ 
        timezone: formData.timezone, 
        notifications_enabled: formData.notifications_enabled, 
        language: currentLanguageContext 
      });

      toast({
        title: t('accountSettings.updateSuccessTitle'),
        description: t('accountSettings.updateSuccessDesc'),
        className: "bg-green-500 text-white dark:bg-green-600"
      });
    } catch (error) {
      console.error("Error updating settings:", error);
      toast({
        title: t('accountSettings.updateErrorTitle'),
        description: t('accountSettings.updateErrorDesc'),
        variant: "destructive",
      });
    } finally {
      setIsSavingSettings(false);
    }
  };

  const LanguageSettingComponent = () => (
    <div className="space-y-2">
      <Label htmlFor="language-select" className="text-purple-200 dark:text-sky-300">{t('common.selectLanguage')}</Label>
      <div className="flex flex-wrap gap-2">
        {availableLanguages.map(langObj => (
          <Button
            key={langObj.code}
            size="sm"
            variant={currentLanguageContext === langObj.code ? "default" : "outline"}
            onClick={() => changeLanguage(langObj.code)}
            className={`${currentLanguageContext === langObj.code ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'text-purple-200 border-purple-400 hover:bg-purple-500/30 dark:text-sky-300 dark:border-sky-500 dark:hover:bg-sky-500/20'}`}
          >
            {langObj.name}
          </Button>
        ))}
      </div>
    </div>
  );
  
  const ThemeSettingComponent = () => (
    <div className="space-y-2">
       <Label className="text-purple-200 dark:text-sky-300">{t('common.theme')}</Label>
       <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-500/30 dark:text-sky-300 dark:border-sky-500 dark:hover:bg-sky-500/20" onClick={() => toast({ title: t('common.comingSoon'), description: t('common.lightMode') + " " + t('common.comingSoon').toLowerCase()})}>{t('common.lightMode')}</Button>
        <Button size="sm" variant="outline" className="text-purple-200 border-purple-400 hover:bg-purple-500/30 dark:text-sky-300 dark:border-sky-500 dark:hover:bg-sky-500/20" onClick={() => toast({ title: t('common.comingSoon'), description: t('common.darkMode') + " " + t('common.comingSoon').toLowerCase()})}>{t('common.darkMode')}</Button>
      </div>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-700/40 p-4 rounded-lg border border-slate-600/50 hover:shadow-md hover:border-slate-500/70 transition-all">
          <div className="flex items-center">
              <LanguagesIcon size={20} className="mr-3 text-sky-400" />
              <span className="font-medium text-slate-200">{t('common.language')}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-600/50">
              <LanguageSettingComponent />
          </div>
        </div>
        <div className="bg-slate-700/40 p-4 rounded-lg border border-slate-600/50 hover:shadow-md hover:border-slate-500/70 transition-all">
          <div className="flex items-center">
              <Palette size={20} className="mr-3 text-sky-400" />
              <span className="font-medium text-slate-200">{t('common.theme')}</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-600/50">
              <ThemeSettingComponent />
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-8 p-6 bg-slate-700/40 rounded-lg border border-slate-600/50">
        <div>
          <Label htmlFor="timezone-select" className="text-lg font-semibold text-purple-200 dark:text-sky-300 flex items-center mb-2">
            <Clock size={20} className="mr-2" /> {t('accountSettings.timezoneLabel')}
          </Label>
          <Select
            value={formData.timezone}
            onValueChange={(value) => setFormData(prev => ({ ...prev, timezone: value }))}
          >
            <SelectTrigger id="timezone-select" className="w-full bg-slate-600 border-slate-500 text-white focus:ring-sky-500">
              <SelectValue placeholder={t('common.selectOption')} />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 border-slate-600 text-white max-h-60">
              {timezones.map(tz => (
                <SelectItem key={tz} value={tz} className="hover:bg-slate-600">{tz.replace(/_/g, ' ')}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label htmlFor="notifications-switch" className="text-lg font-semibold text-purple-200 dark:text-sky-300 flex items-center">
            <Bell size={20} className="mr-2" /> {t('accountSettings.notificationsLabel')}
          </Label>
          <Switch
            id="notifications-switch"
            checked={formData.notifications_enabled}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, notifications_enabled: checked }))}
            className="data-[state=checked]:bg-sky-500 data-[state=unchecked]:bg-slate-600"
          />
        </div>
        <Button onClick={handleSettingsSave} disabled={isSavingSettings || authLoading} className="w-full bg-sky-500 hover:bg-sky-600 text-white">
          {(isSavingSettings) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          <CheckCircle size={18} className="mr-2" /> {t('common.saveChangesButton')}
        </Button>
      </div>
    </>
  );
};

export default PreferencesSection;