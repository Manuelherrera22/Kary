import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Save } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useMockAuth } from '@/contexts/MockAuthContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from '@/lib/supabaseClient';

const RoleChangeSection = () => {
  const { t } = useLanguage();
  const { user, userProfile, loading: authLoading, setLoading: setAuthLoading, refreshUserProfile } = useMockAuth();
  const { toast } = useToast();

  const [isChangeRoleModalOpen, setIsChangeRoleModalOpen] = useState(false);
  const [selectedRoleForSelf, setSelectedRoleForSelf] = useState('');
  const [allRoles, setAllRoles] = useState([]);
  const [isSavingRole, setIsSavingRole] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setSelectedRoleForSelf(userProfile.role || '');
    }
  }, [userProfile]);

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

  return (
    <>
      <div className="bg-slate-700/40 p-4 rounded-lg border border-slate-600/50 hover:shadow-md hover:border-slate-500/70 transition-all">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <ShieldCheck size={20} className="mr-3 text-sky-400" />
            <span className="font-medium text-slate-200">{t('accountSettings.myRoleSectionTitle')}</span>
          </div>
          <Button onClick={() => setIsChangeRoleModalOpen(true)} variant="outline" size="sm" className="text-slate-300 border-slate-500 hover:bg-slate-600/50 hover:text-white">{t('common.editButton')}</Button>
        </div>
      </div>

      <Dialog open={isChangeRoleModalOpen} onOpenChange={setIsChangeRoleModalOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white">
          <DialogHeader>
            <DialogTitle>{t('accountSettings.changeMyRoleModalTitle', 'Cambiar mi Rol')}</DialogTitle>
            <DialogDescription className="text-slate-400">
              {t('accountSettings.changeMyRoleModalDescription', 'Selecciona el nuevo rol que deseas asumir. Es posible que necesites refrescar la página o volver a iniciar sesión para que todos los cambios surtan efecto.')}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-3">
            <Label htmlFor="roleSelectSelfStudent" className="text-slate-300">{t('accountSettings.newRoleLabel', 'Nuevo Rol')}</Label>
            <Select value={selectedRoleForSelf} onValueChange={setSelectedRoleForSelf}>
              <SelectTrigger id="roleSelectSelfStudent" className="w-full bg-slate-700 border-slate-600 text-white">
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
    </>
  );
};

export default RoleChangeSection;