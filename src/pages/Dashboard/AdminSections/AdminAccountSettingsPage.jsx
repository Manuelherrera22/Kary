import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/pages/Dashboard/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserCog, Save, Mail, Languages, ShieldAlert, ShieldCheck } from 'lucide-react';
import LoadingScreen from '@/pages/Dashboard/components/LoadingScreen';

const SettingCard = ({ title, description, icon: Icon, children, actionButton }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-slate-800/50 p-6 rounded-xl shadow-lg border border-slate-700/60"
  >
    <div className="flex items-center mb-4">
      <Icon className="w-8 h-8 mr-3 text-orange-400" />
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

const AdminAccountSettingsPage = () => {
  const { t } = useLanguage();
  const { user, userProfile, loading: authLoading, setLoading: setAuthLoading, parseSupabaseError, refreshUserProfile } = useAuth();
  const { toast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [selectedRoleForSelf, setSelectedRoleForSelf] = useState('');
  const [allRoles, setAllRoles] = useState([]);
  const [isSavingRole, setIsSavingRole] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setFullName(userProfile.full_name || '');
      setEmail(userProfile.email || user?.email || '');
      setSelectedRoleForSelf(userProfile.role || '');
    }
  }, [userProfile, user]);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const { data, error } = await supabase.from('roles').select('name, display_name_key');
        if (error) throw error;
        setAllRoles(data.map(r => ({ value: r.name, labelKey: r.display_name_key })));
      } catch (error) {
        console.error('Error fetching roles:', error);
        toast({ title: t('toast.errorTitle'), description: t('roles.errorFetchingRoles'), variant: 'destructive' });
      }
    };
    fetchRoles();
  }, [t, toast]);

  const handleSaveChanges = async (e) => {
    e.preventDefault();
    if (!user || !userProfile) {
      toast({ title: t('toast.errorTitle'), description: t('accountSettings.errorNoUser'), variant: 'destructive' });
      return;
    }

    setIsSaving(true);
    setAuthLoading(true);

    try {
      const updates = {
        id: user.id,
        full_name: fullName,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', user.id);

      if (error) throw error;

      await refreshUserProfile();
      toast({
        title: t('toast.successTitle'),
        description: t('accountSettings.updateSuccess'),
        className: 'bg-green-500 text-white dark:bg-green-600',
      });
      
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: t('toast.errorTitle'),
        description: parseSupabaseError(error),
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
      setAuthLoading(false);
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
        description: t('adminUserRolePage.roleUpdateSuccessSelf', { newRole: t(`roles.${selectedRoleForSelf}`, selectedRoleForSelf) }),
        className: 'bg-green-500 text-white dark:bg-green-600',
      });
      setIsChangeRoleModalOpen(false);
    } catch (error) {
      console.error('Error updating own role:', error);
      toast({
        title: t('toast.errorTitle'),
        description: t('adminUserRolePage.roleUpdateErrorSelf'),
        variant: 'destructive',
      });
    } finally {
      setIsSavingRole(false);
      setAuthLoading(false);
    }
  };


  if (authLoading && !userProfile) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 max-w-3xl mx-auto"
    >
      <header className="mb-10 text-center">
        <UserCog className="mx-auto h-16 w-16 text-orange-400 mb-4" />
        <h1 className="text-3xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-amber-300 to-yellow-300">
          {t('adminUserRolePage.accountSettingsTitle', 'Configuración de Cuenta de Administrador')}
        </h1>
        <p className="text-slate-300 mt-2 text-md sm:text-lg">
          {t('adminUserRolePage.accountSettingsDescription', 'Gestiona tu información personal y preferencias.')}
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <SettingCard 
            title={t('accountSettings.profileTitle')}
            description={t('accountSettings.profileDescription')}
            icon={UserCog}
          >
          <form onSubmit={handleSaveChanges} className="space-y-6">
            <div>
              <Label htmlFor="fullName" className="text-slate-300 flex items-center">
                <UserCog size={18} className="mr-2 text-orange-300" /> {t('accountSettings.fullNameLabel')}
              </Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-slate-700 border-slate-600 text-white focus:ring-orange-500 focus:border-orange-500 mt-1"
                placeholder={t('accountSettings.fullNamePlaceholder')}
              />
            </div>

            <div>
              <Label htmlFor="email" className="text-slate-300 flex items-center">
                <Mail size={18} className="mr-2 text-orange-300" /> {t('accountSettings.emailLabel')}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-slate-700/50 border-slate-600 text-slate-400 cursor-not-allowed mt-1"
              />
              <p className="text-xs text-slate-500 mt-1">{t('accountSettings.emailCannotChange')}</p>
            </div>
            
            <div className="pt-2 text-right">
              <Button type="submit" disabled={isSaving || (authLoading && !userProfile)} className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2.5 text-base">
                {isSaving ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="mr-2">
                    <Save size={18} />
                  </motion.div>
                ) : (
                  <Save size={18} className="mr-2" />
                )}
                {isSaving ? t('accountSettings.savingButton') : t('accountSettings.saveChangesButton')}
              </Button>
            </div>
          </form>
        </SettingCard>

        <SettingCard
          title={t('adminUserRolePage.myRoleSectionTitle', 'Mi Rol Actual')}
          description={t('adminUserRolePage.myRoleSectionDescription', 'Visualiza y modifica tu rol en la plataforma.')}
          icon={ShieldCheck}
          actionButton={
            <Button onClick={() => setIsChangeRoleModalOpen(true)} className="w-full bg-teal-600 hover:bg-teal-700 text-white">
              {t('adminUserRolePage.changeMyRoleButton', 'Cambiar mi Rol')}
            </Button>
          }
        >
          <p className="text-slate-300">{t('adminUserRolePage.currentRoleLabel', 'Rol Actual')}: <span className="font-semibold text-teal-400">{t(`roles.${userProfile?.role || 'notAssigned'}`, userProfile?.role)}</span></p>
        </SettingCard>
      </div>
      
      <div className="space-y-8">
        <SettingCard 
            title={t('accountSettings.languagePreference')}
            description={t('accountSettings.languageManagedGlobally')}
            icon={Languages}
          >
           <p className="text-sm text-slate-400">{t('accountSettings.languageManagedGlobally')}</p>
        </SettingCard>
        
        <SettingCard
          title={t('accountSettings.securitySectionTitle', 'Seguridad Avanzada')}
          description={t('accountSettings.securitySectionDescription', 'La gestión de contraseñas y autenticación de dos factores se maneja a través de tu proveedor de identidad (ej. Google).')}
          icon={ShieldAlert}
        >
          <p className="text-sm text-slate-400">{t('accountSettings.securitySectionDescription')}</p>
        </SettingCard>
      </div>


      <Dialog open={isChangeRoleModalOpen} onOpenChange={setIsChangeRoleModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>{t('adminUserRolePage.changeMyRoleModalTitle', 'Cambiar mi Rol')}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {t('adminUserRolePage.changeMyRoleModalDescription', 'Selecciona el nuevo rol que deseas asumir. Es posible que necesites refrescar la página o volver a iniciar sesión para que todos los cambios surtan efecto.')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Label htmlFor="roleSelectSelf" className="text-slate-300">{t('adminUserRolePage.newRoleLabel', 'Nuevo Rol')}</Label>
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
              {isSavingRole ? (
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="mr-2">
                  <Save size={18} />
                </motion.div>
              ) : (
                <Save size={18} className="mr-2" />
              )}
              {isSavingRole ? t('accountSettings.savingButton') : t('common.saveChangesButton')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </motion.div>
  );
};

export default AdminAccountSettingsPage;