import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/contexts/LanguageContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Lock, Mail, Bell, Languages, LogOut, ShieldAlert, Trash2, Palette, Server, UserCog, Save, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';

const SettingCard = ({ title, description, icon: Icon, children, actionButton }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700/60"
  >
    <div className="flex items-center mb-4">
      <Icon className="w-8 h-8 mr-3 text-sky-400" />
      <div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-400">{description}</p>
      </div>
    </div>
    <div className="mt-4 space-y-4">
      {children}
    </div>
    {actionButton && <div className="mt-6">{actionButton}</div>}
  </motion.div>
);


const AccountSettingsPage = () => {
  const { t, language, changeLanguage, availableLanguages } = useLanguage();
  const { user, userProfile, loading: authLoading, updateUserProfile, signOut, refreshUserProfile, setLoading: setAuthLoading } = useMockAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [selectedRoleForSelf, setSelectedRoleForSelf] = useState('');
  const [allRoles, setAllRoles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingRole, setIsSavingRole] = useState(false);


  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setEmail(userProfile.email || user?.email || '');
      setNotificationsEnabled(userProfile.notifications_enabled !== undefined ? userProfile.notifications_enabled : true);
      setSelectedRoleForSelf(userProfile.role || '');
    }
  }, [userProfile, user]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        // Simular carga de roles para San Luis Gonzaga
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockRoles = [
          { value: 'directive', labelKey: 'roles.directive' },
          { value: 'teacher', labelKey: 'roles.teacher' },
          { value: 'student', labelKey: 'roles.student' },
          { value: 'parent', labelKey: 'roles.parent' },
          { value: 'psychopedagogue', labelKey: 'roles.psychopedagogue' },
          { value: 'admin', labelKey: 'roles.admin' },
          { value: 'program_coordinator', labelKey: 'roles.program_coordinator' }
        ];
        
        setAllRoles(mockRoles);
        console.log("✅ Roles de San Luis Gonzaga cargados:", mockRoles.length);
        
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast({ title: t('common.errorTitle'), description: t('roles.errorFetchingRoles'), variant: 'destructive' });
      }
    };
    fetchRoles();
  }, [t, toast]);

  const handleProfileUpdate = async () => {
    if (!fullName.trim()) {
      toast({ title: t('toast.warningTitle'), description: t('common.errorFullNameRequired'), variant: 'destructive' });
      return;
    }
    setIsSaving(true);
    const success = await updateUserProfile({ full_name: fullName });
    if (success) {
      toast({ title: t('toast.successTitle'), description: t('accountSettings.profileUpdateSuccess') });
    } else {
      toast({ title: t('toast.errorTitle'), description: t('accountSettings.profileUpdateError'), variant: 'destructive' });
    }
    setIsSaving(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast({ title: t('toast.errorTitle'), description: t('accountSettings.passwordsDoNotMatch'), variant: 'destructive' });
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      toast({ title: t('toast.errorTitle'), description: t('accountSettings.passwordTooShort'), variant: 'destructive' });
      return;
    }
    
    setIsSaving(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });

    if (error) {
      toast({ title: t('toast.errorTitle'), description: `${t('accountSettings.passwordChangeError')}: ${error.message}`, variant: 'destructive' });
    } else {
      toast({ title: t('toast.successTitle'), description: t('accountSettings.passwordChangeSuccess') });
      setNewPassword('');
      setConfirmNewPassword('');
    }
    setIsSaving(false);
  };
  
  const handleNotificationsToggle = async (checked) => {
    setNotificationsEnabled(checked);
    const success = await updateUserProfile({ notifications_enabled: checked });
    if (!success) {
      setNotificationsEnabled(!checked); 
      toast({ title: t('toast.errorTitle'), description: t('accountSettings.notificationUpdateError'), variant: 'destructive' });
    } else {
       toast({ title: t('toast.successTitle'), description: t('accountSettings.notificationUpdateSuccess')});
    }
  };

  const handleLanguageChange = async (newLang) => {
    changeLanguage(newLang);
    const success = await updateUserProfile({ language: newLang });
    if (success) {
      toast({ title: t('toast.successTitle'), description: t('accountSettings.languageUpdateSuccess') });
    } else {
      toast({ title: t('toast.errorTitle'), description: t('accountSettings.languageUpdateError'), variant: 'destructive' });
      changeLanguage(language); 
    }
  };

  const handleSelfRoleChange = async () => {
    if (!user || !userProfile) {
      toast({ title: t('toast.errorTitle'), description: t('accountSettings.errorNoUser'), variant: 'destructive' });
      return;
    }
    if (!selectedRoleForSelf) {
      toast({ title: t('toast.warningTitle'), description: t('roles.selectRoleError'), variant: 'destructive' });
      return;
    }

    setIsSavingRole(true);
    setAuthLoading(true);

    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: selectedRoleForSelf, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;
      
      await refreshUserProfile(); 

      toast({
        title: t('toast.successTitle'),
        description: t('accountSettings.roleUpdateSuccessSelf', { newRole: t(`roles.${selectedRoleForSelf}`, selectedRoleForSelf) }),
        className: 'bg-green-500 text-white dark:bg-green-600',
      });
      setIsChangeRoleModalOpen(false);
    } catch (error) {
      console.error('Error updating own role:', error);
      toast({
        title: t('toast.errorTitle'),
        description: t('accountSettings.roleUpdateErrorSelf'),
        variant: 'destructive',
      });
    } finally {
      setIsSavingRole(false);
      setAuthLoading(false);
    }
  };

  if (authLoading && !userProfile) return <LoadingScreen text={t('common.loadingText')} />;


  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 sm:p-6 space-y-8"
    >
      {/* Botón de regreso */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-4"
      >
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center text-slate-300 hover:text-white transition-colors duration-200 group"
        >
          <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="text-sm font-medium">{t('common.backToDashboard')}</span>
        </button>
      </motion.div>
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-300 to-purple-300">
          {t('dashboards.directive.settings.pageTitle')}
        </h1>
        <p className="text-slate-300 mt-2 text-lg">
          {t('dashboards.directive.settings.pageSubtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SettingCard 
          title={t('accountSettings.profileTitle')}
          description={t('accountSettings.profileDescription')}
          icon={User}
        >
          <div>
            <Label htmlFor="fullName" className="text-slate-300">{t('accountSettings.fullNameLabel')}</Label>
            <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="bg-slate-700 border-slate-600 text-white" />
          </div>
          <div>
            <Label htmlFor="email" className="text-slate-300">{t('accountSettings.emailLabel')}</Label>
            <Input id="email" type="email" value={email} disabled className="bg-slate-700/50 border-slate-600 text-slate-400 cursor-not-allowed" />
             <p className="text-xs text-slate-500 mt-1">{t('accountSettings.emailCannotChange')}</p>
          </div>
          <Button onClick={handleProfileUpdate} disabled={isSaving} className="w-full bg-sky-600 hover:bg-sky-700">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save size={18} className="mr-2" />}
            {isSaving ? t('accountSettings.savingButton') : t('accountSettings.saveProfileButton')}
          </Button>
        </SettingCard>

        <SettingCard 
          title={t('accountSettings.passwordTitle')}
          description={t('accountSettings.passwordDescription')}
          icon={Lock}
        >
          <div>
            <Label htmlFor="newPassword" className="text-slate-300">{t('accountSettings.newPasswordLabel')}</Label>
            <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="bg-slate-700 border-slate-600 text-white" />
          </div>
          <div>
            <Label htmlFor="confirmNewPassword" className="text-slate-300">{t('accountSettings.confirmNewPasswordLabel')}</Label>
            <Input id="confirmNewPassword" type="password" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} className="bg-slate-700 border-slate-600 text-white" />
          </div>
          <Button onClick={handleChangePassword} disabled={isSaving} className="w-full bg-sky-600 hover:bg-sky-700">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save size={18} className="mr-2" />}
            {isSaving ? t('accountSettings.savingButton') : t('accountSettings.changePasswordButton')}
          </Button>
        </SettingCard>

        <SettingCard
          title={t('accountSettings.myRoleSectionTitle')}
          description={t('accountSettings.myRoleSectionDescription')}
          icon={ShieldCheck}
          actionButton={
            <Button onClick={() => setIsChangeRoleModalOpen(true)} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
              <UserCog size={18} className="mr-2" />
              {t('accountSettings.changeMyRoleButton')}
            </Button>
          }
        >
          <p className="text-slate-300">{t('accountSettings.currentRoleLabel')}: <span className="font-semibold text-teal-400">{t(`roles.${userProfile?.role || 'notAssigned'}`, userProfile?.role)}</span></p>
        </SettingCard>

        <SettingCard 
          title={t('accountSettings.notificationsTitle')}
          description={t('accountSettings.notificationsDescription')}
          icon={Bell}
        >
          <div className="flex items-center justify-between">
            <Label htmlFor="notificationsEnabled" className="text-slate-300 text-base">{t('accountSettings.enableNotificationsLabel')}</Label>
            <Switch 
              id="notificationsEnabled" 
              checked={notificationsEnabled} 
              onCheckedChange={handleNotificationsToggle}
              className="data-[state=checked]:bg-sky-500 data-[state=unchecked]:bg-slate-600"
            />
          </div>
        </SettingCard>
        
        <SettingCard 
          title={t('dashboard.header.language')}
          description={t('accountSettings.languageDescription')}
          icon={Languages}
        >
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-full bg-slate-700 border-slate-600 text-white">
              <SelectValue placeholder={t('common.selectLanguage')} />
            </SelectTrigger>
            <SelectContent className="bg-slate-700 text-white border-slate-600">
              {availableLanguages.map(lang => (
                <SelectItem key={lang.code} value={lang.code} className="focus:bg-sky-600">
                  {lang.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </SettingCard>


        <SettingCard 
          title={t('accountSettings.sessionsTitle')}
          description={t('accountSettings.sessionsDescription')}
          icon={Server}
          actionButton={
            <Button onClick={() => toast({ title: t('common.comingSoon'), description: t('accountSettings.logoutAllDevicesButton') + ' ' + t('common.comingSoon').toLowerCase() })} className="w-full bg-orange-600 hover:bg-orange-700" variant="outline">
              {t('accountSettings.logoutAllDevicesButton')}
            </Button>
          }
        >
          <p className="text-slate-400">{t('accountSettings.currentDevice')}</p>
        </SettingCard>
        
        <SettingCard 
          title={t('accountSettings.deleteAccountTitle')}
          description={t('accountSettings.deleteAccountWarning')}
          icon={Trash2}
        >
          <Button variant="destructive" className="w-full bg-red-700 hover:bg-red-800" onClick={() => toast({ title: t('common.comingSoon'), description: t('accountSettings.deleteAccountButton') + ' ' + t('common.comingSoon').toLowerCase() })}>
            {t('accountSettings.deleteAccountButton')}
          </Button>
        </SettingCard>

      </div>

      <Dialog open={isChangeRoleModalOpen} onOpenChange={setIsChangeRoleModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>{t('accountSettings.changeMyRoleModalTitle')}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {t('accountSettings.changeMyRoleModalDescription')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Label htmlFor="roleSelectSelf" className="text-slate-300">{t('accountSettings.newRoleLabel')}</Label>
            <Select value={selectedRoleForSelf} onValueChange={setSelectedRoleForSelf}>
              <SelectTrigger id="roleSelectSelf" className="w-full bg-slate-700 border-slate-600 text-white">
                <SelectValue placeholder={t('common.selectRolePlaceholder')} />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 text-white border-slate-600">
                {allRoles.map(role => (
                  <SelectItem key={role.value} value={role.value} className="focus:bg-sky-600">
                    {t(role.labelKey, role.value)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsChangeRoleModalOpen(false)} className="text-slate-300 border-slate-600 hover:bg-slate-700 hover:text-white">
              {t('common.cancelButton')}
            </Button>
            <Button onClick={handleSelfRoleChange} disabled={isSavingRole || authLoading} className="bg-teal-600 hover:bg-teal-700">
              {isSavingRole || authLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Save size={18} className="mr-2" />
              )}
              {isSavingRole || authLoading ? t('accountSettings.savingButton') : t('common.saveChangesButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </motion.div>
  );
};

export default AccountSettingsPage;